'use client';

import { TerminalProvider } from './terminal-context';
import { TerminalUI } from './terminal-ui';

export function EmbeddedTerminal() {
  return (
    <div className="relative flex h-64 w-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-colors duration-200 hover:border-border-strong sm:h-80">
      <div className="flex min-w-0 items-center justify-between border-b border-border bg-surface-raised px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex gap-1.5 shrink-0" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/80" />
          </div>
          <span className="ml-1 min-w-0 truncate font-mono text-xs text-text-muted sm:ml-2">
            gladwin@workstation: ~
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="rounded-xs border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">bash 5.2</span>
          <span className="text-text font-medium">Gladwin Ferdz Del Rosario</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative isolate z-0">
        <TerminalProvider>
          <TerminalUI isEmbedded />
        </TerminalProvider>
      </div>
    </div>
  );
}
