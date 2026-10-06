'use client';

import { useEffect, useRef, useId, forwardRef } from 'react';
import { COMMAND_NAMES } from '@/lib/terminal/registry';
import { useTerminal, type OutputLine } from './terminal-context';

function Line({ line }: { line: OutputLine }) {
  return (
    <div
      className={
        line.kind === 'command'
          ? 'whitespace-pre-wrap [overflow-wrap:anywhere] break-words text-text font-mono text-code sm:text-small'
          : 'whitespace-pre-wrap [overflow-wrap:anywhere] break-words text-text-secondary font-mono text-code sm:text-small'
      }
    >
      {line.kind === 'command' ? (
        <span aria-hidden="true" className="text-accent select-none font-medium">
          <span className="hidden sm:inline text-text-muted">gladwin@workstation:~$ </span>
          <span className="inline sm:hidden">$ </span>
        </span>
      ) : null}
      {line.kind === 'command' ? <span className="sr-only">Command: </span> : null}
      {line.text}
    </div>
  );
}

export const TerminalUI = forwardRef<HTMLInputElement, { onClose?: () => void; isEmbedded?: boolean }>(
  ({ onClose, isEmbedded = false }, ref) => {
    const {
      lines,
      announcement,
      busy,
      submit,
      printLines,
      recallPrevious,
      recallNext,
    } = useTerminal();

    const inputId = useId();
    const scrollbackRef = useRef<HTMLDivElement>(null);

    // Fallback ref if none is provided
    const fallbackRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || fallbackRef;

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
        if (completeCurrentWord(inputRef.current)) event.preventDefault();
        return;
      }
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
        printLines(matches);
        return true;
      }
      return false;
    }

    return (
      <div className="flex h-full w-full flex-col font-mono">
        {!isEmbedded && onClose && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
            <div className="flex flex-col gap-1">
              <span className="text-small font-medium text-text">Terminal</span>
              <span className="text-small text-text-secondary">Gladwin.dev</span>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              className="cursor-pointer rounded-sm border border-border px-3 py-1 text-small text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-text"
            >
              Close
              <span className="sr-only"> the terminal</span>
            </button>
          </div>
        )}

        {/* Always-visible system identity and environment strip */}
        <div className="flex min-w-0 items-center justify-between border-b border-border bg-surface-raised/40 px-3 py-1.5 font-mono text-xs text-text-muted sm:px-4">
          <div className="flex min-w-0 items-center gap-2 truncate">
            <span className="text-accent select-none font-bold">#</span>
            <span className="font-medium text-text truncate">gladwin.dev</span>
            <span className="text-border">·</span>
            <span className="truncate">Infrastructure, Cloud &amp; Cybersecurity</span>
          </div>
          <span className="hidden sm:inline-block shrink-0 text-text-muted">
            session: active
          </span>
        </div>

        <div ref={scrollbackRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin] sm:px-4">
          <div className="flex flex-col gap-1">
            {lines.map((line, index) => (
              <Line key={`${index}-${line.text}`} line={line} />
            ))}
            {busy ? (
              <div className="flex items-center gap-2 font-mono text-code text-text-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span>running command...</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-11 items-center gap-2 border-t border-border px-3 py-2.5 sm:px-4">
          <span aria-hidden="true" className="text-accent font-medium select-none shrink-0">
            <span className="hidden sm:inline text-text-muted">gladwin@workstation:~$</span>
            <span className="inline sm:hidden">$</span>
          </span>
          <label htmlFor={inputId} className="sr-only">
            Terminal command input
          </label>
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            onKeyDown={onKeyDown}
            placeholder="type 'help' or 'ls'..."
            className="min-w-0 flex-1 bg-transparent text-base sm:text-small text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    );
  }
);
TerminalUI.displayName = 'TerminalUI';
