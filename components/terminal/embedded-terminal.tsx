'use client';

import { TerminalProvider } from './terminal-context';
import { TerminalUI } from './terminal-ui';

export function EmbeddedTerminal() {
  return (
    <div className="relative flex h-64 w-full flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-colors duration-200 hover:border-border-strong sm:h-80">
      <div className="flex items-center gap-2 border-b border-border bg-surface-raised px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-border" />
          <div className="h-3 w-3 rounded-full bg-border" />
          <div className="h-3 w-3 rounded-full bg-border" />
        </div>
        <span className="ml-2 text-xs text-text-muted">guest@gladwin.dev:~</span>
      </div>
      <div className="flex-1 overflow-hidden relative isolate z-0">
        <TerminalProvider>
          <TerminalUI isEmbedded />
        </TerminalProvider>
      </div>
    </div>
  );
}
