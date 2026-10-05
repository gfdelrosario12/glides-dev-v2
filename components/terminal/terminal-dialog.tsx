/**
 * The terminal's surface.
 *
 * A native `<dialog>`, opened imperatively through a ref, because `show`,
 * `showModal`, and `close` are DOM methods with no JSX equivalent.
 *
 * The element is doing far more work than it looks like it is:
 *
 *   - the top layer, so it renders above the `z-50` sticky header with no
 *     z-index arithmetic;
 *   - focus containment, so Tab and Shift+Tab wrap inside it;
 *   - Escape, delivered as a `cancel` event, but only in modal mode;
 *   - inertness of everything outside it, which is what suspends the shell's
 *     banner, main, and contentinfo landmarks while the terminal covers them.
 *
 * That last one is why this is not a `div` with `role="dialog"`. Focus trapping,
 * inertness, and Escape are three separate pieces of state that a hand-rolled
 * overlay has to keep in agreement, and when they disagree the failure is a
 * keyboard user reaching invisible content. Here there is one source of truth.
 *
 * One element, two presentations. Below the small breakpoint it is a drawer
 * pinned to the trailing edge and opened with `show()` — non-modal, so no
 * backdrop, shell not inert, header stays reachable. At and above it, `showModal()`.
 * A media query does the rest. See design decisions D1 to D3.
 */

import { useCallback, useEffect, useRef, type ReactNode } from 'react';

/**
 * Tailwind's `sm`, expressed as a query rather than reused from a stylesheet.
 *
 * The same breakpoint has to be known in three places — the open method, the mode
 * tracked for a resize, and the CSS box — and a media query in the class list is
 * the only one of those that CSS and JavaScript can both be derived from.
 */
export const COVERING_QUERY = '(min-width: 40rem)';

export type TerminalMode = 'cover' | 'drawer';

export interface TerminalDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  /** Focus lands here when the terminal opens, and after a mode switch. */
  readonly initialFocusRef: React.RefObject<HTMLElement | null>;
  readonly children: ReactNode;
}

/**
 * The presentation the current viewport calls for.
 *
 * This decides the *focus contract* as much as the box: `cover` contains focus
 * and makes the shell inert, `drawer` does neither so the header stays operable.
 */
function modeFor(wide: boolean): TerminalMode {
  return wide ? 'cover' : 'drawer';
}

export function TerminalDialog({
  open,
  onClose,
  initialFocusRef,
  children,
}: TerminalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  /**
   * How the dialog is currently open.
   *
   * Tracked rather than read back off the element, because the `open` attribute
   * is true in both modes and the only way to ask which one you got is
   * `matches(':modal')`. A ref is the simpler dependency and cannot throw on a
   * browser that does not know the selector.
   */
  const modeRef = useRef<TerminalMode | null>(null);

  /** Open the element in a mode, closing first if it is already open. */
  const openIn = useCallback(
    (dialog: HTMLDialogElement, mode: TerminalMode) => {
      // `showModal()` throws `InvalidStateError` on an already-open dialog, so a
      // mode switch has to close before reopening. Synchronous, and on the same
      // element, which is why the React subtree — and with it the scrollback and
      // the history — survives the switch.
      if (dialog.open) dialog.close();
      if (mode === 'cover') dialog.showModal();
      else dialog.show();
      modeRef.current = mode;
      initialFocusRef.current?.focus();
    },
    [initialFocusRef],
  );

  /**
   * Open or close the element to match the `open` prop.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;

    if (!open) {
      if (dialog.open) dialog.close();
      modeRef.current = null;
      return;
    }

    if (dialog.open && modeRef.current === modeFor(window.matchMedia(COVERING_QUERY).matches)) {
      initialFocusRef.current?.focus();
      return;
    }

    openIn(dialog, modeFor(window.matchMedia(COVERING_QUERY).matches));
  }, [open, openIn, initialFocusRef]);

  /**
   * Crossing the breakpoint while the terminal is open.
   *
   * The two presentations have different focus contracts, so the element has to
   * be re-opened rather than restyled: `showModal()` on an open dialog throws, and
   * staying in the old mode would either leave focus escapable under a covering
   * panel or make the header inert under a drawer. Re-opening in place keeps the
   * session, which is what a visitor who rotates their phone did not ask to lose.
   */
  useEffect(() => {
    const media = window.matchMedia(COVERING_QUERY);

    function onChange(): void {
      const dialog = dialogRef.current;
      if (dialog === null || !dialog.open) return;
      const mode = modeFor(media.matches);
      if (mode === modeRef.current) return;
      openIn(dialog, mode);
    }

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [openIn]);

  /**
   * Escape.
   *
   * `cancel` fires only for a modal dialog, so a non-modal one ignores Escape
   * entirely and needs the `keydown` listener. That listener is on the document
   * rather than on the dialog, because the drawer deliberately lets focus leave
   * it — a visitor who has tabbed back to the header is still in a terminal
   * session, and Escape has to close it from there too.
   *
   * Preventing the default on the keydown also suppresses the browser's own close
   * request in modal mode, so `cancel` does not fire and both modes reach
   * `onClose` exactly once: one dismissal behaviour with two triggers rather
   * than two behaviours. `cancel` stays registered as the platform's own path.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null || !open) return;

    function onCancel(event: Event): void {
      event.preventDefault();
      onClose();
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener('cancel', onCancel);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Terminal"
      /*
       * Below `sm`: a drawer on the trailing edge, full height, no backdrop.
       * `100dvh` rather than `100vh` because a mobile browser's `100vh` exceeds
       * the visible area behind its own chrome, which would push the prompt off
       * screen. At and above `sm`: a centred panel with the backdrop dimming the
       * page — `showModal()` renders `::backdrop` and `show()` does not, so the
       * backdrop rule needs no mode-specific handling.
       *
       * Both widths are declared values: `max-w-prose` is the token layer's own
       * container step, and `100ch` is the character width of the mono face, so
       * the measure follows the rendered font and root size instead of a column
       * count tuned to one breakpoint. The inner wrapper carries the measure and
       * centres itself, so a wide window gives the dialog breathing room without
       * giving the text a longer line.
       *
       * Every colour is a declared token role. The backdrop is the page surface
       * at partial alpha rather than a new scrim token, so this adds no colour to
       * the token layer. The resting border is the decorative `border` hairline,
       * not `border-strong`, which the token layer restricts to the three lower
       * surfaces and forbids on an overlay; the focus indication is the accent
       * outline from the base layer, which clears the contrast bar on both of
       * this element's surfaces.
       */
      className={[
        'm-0 ml-auto flex h-[100dvh] w-full flex-col',
        'border border-border bg-surface-raised p-0 font-mono text-small text-text',
        'sm:m-auto sm:h-[85dvh] sm:max-w-prose sm:rounded-md sm:bg-surface-overlay',
        'backdrop:bg-surface/80',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-[100ch] flex-1 flex-col">{children}</div>
    </dialog>
  );
}