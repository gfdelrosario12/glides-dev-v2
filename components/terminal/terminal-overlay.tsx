'use client';

import { TerminalDialog } from './terminal-dialog';
import { useTerminal } from './terminal-context';
import { TerminalUI } from './terminal-ui';
import { useRef } from 'react';

export function TerminalOverlay() {
  const { open, closeTerminal } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TerminalDialog open={open} onClose={closeTerminal} initialFocusRef={inputRef}>
      <TerminalUI ref={inputRef} onClose={closeTerminal} />
    </TerminalDialog>
  );
}
