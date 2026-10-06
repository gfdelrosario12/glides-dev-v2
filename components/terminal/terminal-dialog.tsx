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
 * One element, one presentation: a centered modal opened with `showModal()` at
 * every viewport size. This keeps the terminal from becoming a redundant edge
 * drawer on narrow screens and gives the close control one lifecycle to manage.
 */

import { useCallback, useEffect, useRef, type ReactNode } from 'react';

/**
 * Tailwind's `sm`, expressed as a query rather than reused from a stylesheet.
 *
 * The same breakpoint has to be known in three places — the open method, the mode
 * tracked for a resize, and the CSS box — and a media query in the class list is
 * the only one of those that CSS and JavaScript can both be derived from.
 */
export type TerminalMode = 'cover';

export interface TerminalDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  /** Focus lands here when the terminal opens, and after a mode switch. */
  readonly initialFocusRef: React.RefObject<HTMLElement | null>;
  readonly children: ReactNode;
}

/**
 * The terminal always uses the covering modal focus contract.
 */
function modeFor(): TerminalMode {
  return 'cover';
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

    if (dialog.open && modeRef.current === modeFor()) {
      initialFocusRef.current?.focus();
      return;
    }

    openIn(dialog, modeFor());
  }, [open, openIn, initialFocusRef]);

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
      onClose={onClose}
      aria-label="Terminal"
      /*
      * The dialog is a centered panel at every viewport size, with the backdrop
      * dimming the page. `showModal()` renders `::backdrop` and keeps the shell
      * beneath it inert while the terminal is active.
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
        'm-auto flex h-[min(85dvh,42rem)] w-[calc(100%-2rem)] max-w-prose flex-col',
        'rounded-md border border-border bg-surface-raised p-0 font-mono text-small text-text',
        'sm:bg-surface-overlay',
        'backdrop:bg-surface/80',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-[100ch] flex-1 flex-col">{children}</div>
    </dialog>
  );
}