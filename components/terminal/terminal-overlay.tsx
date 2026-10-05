/**
 * The terminal's contents: scrollback, live region, close control, and input.
 *
 * Presentation only. Every decision about whether the terminal is open, what its
 * scrollback says, and what a command returns lives in `terminal-context.tsx`.
 *
 * The input is a real `<input>`, so the platform owns the caret, selection,
 * insertion, and deletion. There is no drawn caret anywhere, and the only keys
 * this component intercepts are Enter, Tab, and the history arrows — none of
 * which has native single-line behaviour worth preserving.
 */

'use client';

import { useEffect, useRef } from 'react';
import { COMMAND_NAMES } from '@/lib/terminal/registry';
import { TerminalDialog } from './terminal-dialog';
import { useTerminal, type OutputLine } from './terminal-context';

/**
 * One scrollback line.
 *
 * A command and its output are distinguished by text, not by colour: the echo is
 * prefixed with the same prompt glyph the input shows, and the two differ in
 * colour only as a second, redundant cue.
 */
function Line({ line }: { line: OutputLine }) {
  return (
    <div
      className={
        line.kind === 'command'
          ? 'whitespace-pre-wrap break-words text-text'
          : 'whitespace-pre-wrap break-words text-text-secondary'
      }
    >
      {line.kind === 'command' ? (
        <span aria-hidden="true" className="text-accent">
          ${' '}
        </span>
      ) : null}
      {line.kind === 'command' ? <span className="sr-only">Command: </span> : null}
      {line.text}
    </div>
  );
}

export function TerminalOverlay() {
  const {
    open,
    lines,
    announcement,
    busy,
    closeTerminal,
    submit,
    printLines,
    recallPrevious,
    recallNext,
  } = useTerminal();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollbackRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view as output accumulates.
  useEffect(() => {
    const scrollback = scrollbackRef.current;
    if (scrollback !== null) scrollback.scrollTop = scrollback.scrollHeight;
  }, [lines]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = inputRef.current?.value ?? '';
      if (inputRef.current !== null) inputRef.current.value = '';
      submit(value);
      return;
    }

    if (event.key === 'Tab') {
      // Tab is bound to completion and to nothing else. When there is nothing to
      // complete, the default is left alone so the platform's own focus
      // navigation still applies — which is also what keeps the terminal's
      // focus containment the dialog's job rather than a second, hand-written
      // focus trap.
      if (completeCurrentWord(inputRef.current)) event.preventDefault();
      return;
    }

    // Only intercept the vertical arrows, which would otherwise leave a
    // one-line input; horizontal caret movement is left to the platform.
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const recalled = recallPrevious();
      if (recalled !== null && inputRef.current !== null) inputRef.current.value = recalled;
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const recalled = recallNext();
      if (recalled !== null && inputRef.current !== null) inputRef.current.value = recalled;
    }
  }

  /**
   * Complete the word under the caret against the declared command names.
   *
   * A unique prefix completes and appends a space. Several matches print the
   * candidates and leave the input alone. No match leaves it alone. Arguments are
   * never completed: that would need the project list in this bundle.
   *
   * Returns whether the keystroke was consumed, so an unhandled Tab can fall
   * through to the platform's focus navigation.
   */
  function completeCurrentWord(input: HTMLInputElement | null): boolean {
    if (input === null) return false;
    const value = input.value;
    const start = input.selectionStart ?? value.length;
    const before = value.slice(0, start);
    const word = /[^\s]*$/.exec(before)?.[0] ?? '';

    if (word === '') return false;

    const matches = COMMAND_NAMES.filter((name) => name.startsWith(word));

    if (matches.length === 1) {
      const completion = `${matches[0]} `;
      input.value = before.slice(0, before.length - word.length) + completion + value.slice(start);
      const caret = before.length - word.length + completion.length;
      input.setSelectionRange(caret, caret);
      return true;
    }

    if (matches.length > 1) {
      // Output, not a command: listed without entering history.
      printLines(matches);
      return true;
    }

    return false;
  }

  return (
    <TerminalDialog open={open} onClose={closeTerminal} initialFocusRef={inputRef}>
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-small font-medium text-text">Terminal</span>
          <span className="text-small text-text-secondary">Gladwin.dev</span>
        </div>
        {/*
          The resting border is the decorative hairline: `border-strong` is
          restricted by the token layer to the three lower surfaces, and this
          button sits on `surface-overlay` at wide widths. The focus indication is
          the accent outline from the base layer, which clears the contrast
          requirement on either surface.
        */}
        <button
          type="button"
          onClick={closeTerminal}
          className="rounded-sm border border-border px-3 py-1 text-small text-text-secondary hover:bg-surface-raised hover:text-text"
        >
          Close
          <span className="sr-only"> the terminal</span>
        </button>
      </div>

      <div ref={scrollbackRef} className="flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:thin]">
        <div className="flex flex-col gap-1">
          {lines.map((line, index) => (
            <Line key={`${index}-${line.text}`} line={line} />
          ))}
          {busy ? <div className="text-text-muted">...</div> : null}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        {/*
          The prompt is decorative: it is a sibling of the input, hidden from
          assistive technology, so the control's accessible name is the label
          below and not a glyph. No custom caret is drawn anywhere — the platform
          caret inside this input is the only one.
        */}
        <span aria-hidden="true" className="text-accent">
          $
        </span>
        <label htmlFor="terminal-input" className="sr-only">
          Terminal command input
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onKeyDown={onKeyDown}
          placeholder="help"
          className="min-w-0 flex-1 bg-transparent text-small text-text placeholder:text-text-muted"
        />
      </div>

      {/*
        A polite live region carrying only the most recent result. The scrollback
        has no live behaviour at all: on a live region, every append would
        re-announce the whole history.
      */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </TerminalDialog>
  );
}