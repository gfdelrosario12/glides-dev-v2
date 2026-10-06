/**
 * Terminal state, shared by the header control and the overlay.
 *
 * This is the one client component above route level, so it holds all of the
 * interactive state: open, scrollback, history, the history cursor, the key
 * handler, and dispatch. The header's control and the dialog are siblings in the
 * DOM, so they share this through context rather than through a prop chain the
 * shell would have to thread. `terminal-overlay.tsx` renders the dialog's
 * contents and decides nothing.
 *
 * Nothing here reads the content model. Content-backed commands are dispatched to
 * `/api/terminal`; the only things the browser knows are the declared command
 * names and the two session commands it satisfies locally. That is what keeps
 * every project, certification, role, and qualification record out of the client
 * bundle — including the biography and organisation strings the server-side
 * resolvers print.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { parseLine } from '@/lib/terminal/parse';
import { findDeclaration } from '@/lib/terminal/registry';
import { TERMINAL_SHORTCUT, type TerminalResponseBody } from '@/lib/terminal/types';

/** One line of scrollback: what was typed, and what came back. */
export interface OutputLine {
  readonly text: string;
  /** Distinguishes an echoed command from its output, without relying on colour. */
  readonly kind: 'command' | 'output';
}

interface TerminalContextValue {
  readonly open: boolean;
  readonly lines: readonly OutputLine[];
  /**
   * The most recent result, and only the most recent one, for the polite live
   * region. Kept apart from `lines` so the announcement is a whole result rather
   * than whatever happened to be its last line, and so the scrollback itself can
   * carry no live behaviour at all.
   */
  readonly announcement: string;
  readonly busy: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  submit: (line: string) => void;
  /**
   * Append output lines directly, without recording a command.
   *
   * Used by tab completion to list the candidates for an ambiguous prefix: that
   * is output, not a command the visitor ran, so it must not enter history.
   */
  printLines: (lines: readonly string[]) => void;
  recallPrevious: () => string | null;
  recallNext: () => string | null;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

/** Read the terminal context. Throws outside a provider rather than half-working. */
export function useTerminal(): TerminalContextValue {
  const value = useContext(TerminalContext);
  if (value === null) {
    throw new Error('useTerminal must be used inside a TerminalProvider');
  }
  return value;
}

/** Is this element somewhere a visitor types? The shortcut must stay out of the way. */
function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  // `userAgentData.platform` where available, the UA string otherwise. Only used
  // to decide which modifier is the command key.
  const data = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  return (data?.platform ?? navigator.userAgent ?? '').toLowerCase().includes('mac');
}

/**
 * Present before any command runs, so the region is never blank and so there is
 * real text in the server response rather than an empty frame.
 */
const OPENING_LINES: readonly OutputLine[] = [
  { text: 'gladwin.dev terminal [v2.0]', kind: 'output' },
  { text: 'Type `help` for commands, `whoami` for profile overview.', kind: 'output' },
];

export function TerminalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<readonly OutputLine[]>(OPENING_LINES);
  const [announcement, setAnnouncement] = useState('');
  const [busy, setBusy] = useState(false);

  /**
   * Whether the terminal is open, as the event handlers need it.
   *
   * A ref rather than the state value, because these handlers are created once
   * and must not close over a stale `open`. State is still what renders; this is
   * only the imperative read, and the two are set together.
   */
  const openRef = useRef(false);
  /**
   * Whether a request is in flight, as the dispatcher needs it.
   *
   * A ref for the same reason as `openRef`: `submit` is created once, so reading
   * `busy` from state would let a second Enter dispatch a command while the
   * first is still resolving.
   */
  const busyRef = useRef(false);
  const historyRef = useRef<readonly string[]>([]);
  const historyIndexRef = useRef<number | null>(null);
  /** The element focus returns to. Recorded at open time. */
  const openerRef = useRef<HTMLElement | null>(null);
  /**
   * Focus is restored from here rather than inside `closeTerminal`, because the
   * shell beneath a modal dialog is inert until the dialog is closed: focusing
   * the opener before that is a focus call on an inert node, which the browser
   * discards. The dialog's own close effect runs before this component's effect
   * in the same commit, so by the time this runs the opener is focusable.
   */
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  /**
   * Bumped on every open and every close. A response whose session no longer
   * matches is discarded, so Escape during a request cannot be followed by a
   * stale line arriving into a session that has moved on.
   */
  const sessionRef = useRef(0);

  const openTerminal = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // A fresh session shares nothing with the previous one, including its
    // history and scrollback, so `history` cannot leak across a close.
    historyRef.current = [];
    historyIndexRef.current = null;
    sessionRef.current += 1;
    setLines(OPENING_LINES);
    setAnnouncement('');
    setBusy(false);
    setOpen(true);
  }, []);

  const closeTerminal = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    // Invalidate any in-flight response before the state settles.
    sessionRef.current += 1;
    setBusy(false);

    restoreFocusRef.current = openerRef.current;
    openerRef.current = null;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) return;
    const opener = restoreFocusRef.current;
    restoreFocusRef.current = null;

    // Focus must never be left inside a dialog that has just closed. Modal mode
    // moves focus out for us; the drawer does not, and a focus left on its input
    // would be focus on a node that is no longer rendered — which also leaves the
    // global shortcut suppressed, because its target is a text field.
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest('dialog') !== null) active.blur();

    // Restore to the opener only if it is a real focus target. `document.body` is
    // the recorded element whenever the terminal was opened without one — a
    // programmatic open, or a route change — and focusing it does nothing, which
    // would leave focus at the top of the document with no element of its own.
    // `open` navigates, and focusing a removed node would strand it for good.
    if (opener !== null && opener.isConnected && opener !== document.body) opener.focus();
  }, [open]);

  const toggleTerminal = useCallback(() => {
    if (openRef.current) closeTerminal();
    else openTerminal();
  }, [openTerminal, closeTerminal]);

  /**
   * Run one command.
   *
   * Session commands resolve here with no request. Everything else goes to the
   * server, and its output — the echoed command included — is appended only once
   * the response comes back, so the scrollback can never contain a line the
   * server did not produce.
   */
  const submit = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (line === '' || busyRef.current) return;

      const { name } = parseLine(line);
      const declaration = findDeclaration(name);

      historyRef.current = [...historyRef.current, line];
      historyIndexRef.current = null;

      if (declaration?.class === 'session') {
        if (declaration.name === 'clear') {
          setLines([]);
          setAnnouncement('Scrollback cleared.');
          return;
        }

        if (declaration.name === 'history') {
          const entries = historyRef.current;
          const output =
            entries.length === 0
              ? ['No commands yet in this session.']
              : [...entries];
          setLines((previous) => [
            ...previous,
            { text: line, kind: 'command' },
            ...output.map((text) => ({ text, kind: 'output' as const })),
          ]);
          setAnnouncement(output.join('. '));
          return;
        }

        if (declaration.name === 'exit') {
          setLines((previous) => [
            ...previous,
            { text: line, kind: 'command' },
            { text: 'Session closed. Type `help` or any command to restart.', kind: 'output' },
          ]);
          setAnnouncement('Terminal session closed.');
          closeTerminal();
          return;
        }

        // A session command with no browser implementation is refused rather than
        // sent to the server, which would refuse it as a session name anyway.
        setLines((previous) => [
          ...previous,
          { text: line, kind: 'command' },
          { text: `No browser implementation for ${declaration.name}.`, kind: 'output' },
        ]);
        setAnnouncement(`No browser implementation for ${declaration.name}.`);
        return;
      }

      const session = sessionRef.current;
      busyRef.current = true;
      setBusy(true);

      void fetch('/api/terminal', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ line }),
      })
        .then(async (response) => {
          const body = (await response.json()) as TerminalResponseBody & { error?: string };
          if (body.lines === undefined) {
            return {
              lines: [`Request failed (${response.status}): ${body.error ?? 'unknown error'}`],
              navigateTo: undefined,
            };
          }
          return { lines: body.lines, navigateTo: body.navigateTo };
        })
        .then((result: { lines: readonly string[]; navigateTo?: string }) => {
          // Discarded if the overlay closed or reopened while in flight.
          if (session !== sessionRef.current) return;
          busyRef.current = false;
          setBusy(false);
          setLines((previous) => [
            ...previous,
            { text: line, kind: 'command' },
            ...result.lines.map((text) => ({ text, kind: 'output' as const })),
          ]);
          setAnnouncement(result.lines.join('. '));
          if (result.navigateTo !== undefined) {
            closeTerminal();
            router.push(result.navigateTo);
          }
        })
        .catch(() => {
          if (session !== sessionRef.current) return;
          busyRef.current = false;
          setBusy(false);
          setLines((previous) => [
            ...previous,
            { text: line, kind: 'command' },
            { text: 'The terminal could not reach the server.', kind: 'output' },
          ]);
          setAnnouncement('The terminal could not reach the server.');
        });
    },
    [closeTerminal, router],
  );

  const printLines = useCallback((output: readonly string[]) => {
    if (output.length === 0) return;
    setLines((previous) => [
      ...previous,
      ...output.map((text) => ({ text, kind: 'output' as const })),
    ]);
  }, []);

  /** The up arrow: the previous command, then the one before it. */
  const recallPrevious = useCallback((): string | null => {
    const entries = historyRef.current;
    if (entries.length === 0) return null;
    const current = historyIndexRef.current;
    const next = current === null ? entries.length - 1 : Math.max(0, current - 1);
    historyIndexRef.current = next;
    return entries[next] ?? null;
  }, []);

  /** The down arrow: the next command, ending back at an empty input. */
  const recallNext = useCallback((): string | null => {
    const entries = historyRef.current;
    const current = historyIndexRef.current;
    if (current === null) return null;
    if (current >= entries.length - 1) {
      historyIndexRef.current = null;
      return '';
    }
    historyIndexRef.current = current + 1;
    return entries[current + 1] ?? '';
  }, []);

  /**
   * The global shortcut.
   *
   * Suppressed wherever the visitor is typing, and when any modifier other than
   * the platform's command key is held, so the site does not win against a
   * same-key browser or extension shortcut.
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== TERMINAL_SHORTCUT.key) return;
      if (isTextEntry(event.target)) return;

      const apple = isApplePlatform();
      if (!(apple ? event.metaKey : event.ctrlKey)) return;

      const otherModifier = apple ? event.ctrlKey : event.metaKey;
      if (event.shiftKey || event.altKey || otherModifier) return;

      event.preventDefault();
      toggleTerminal();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleTerminal]);

  const value = useMemo<TerminalContextValue>(
    () => ({
      open,
      lines,
      announcement,
      busy,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      submit,
      printLines,
      recallPrevious,
      recallNext,
    }),
    [
      open,
      lines,
      announcement,
      busy,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      submit,
      printLines,
      recallPrevious,
      recallNext,
    ],
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}