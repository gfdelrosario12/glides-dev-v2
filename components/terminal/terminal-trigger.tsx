/**
 * The header control that opens the terminal.
 *
 * A thin client child. `site-header.tsx` stays a Server Component; this is where
 * the client boundary starts. It reads its label and its shortcut from the
 * navigation definition rather than restating them, so what is announced and
 * what is bound cannot drift apart.
 *
 * Rendered as a `<button>`, not a link, because it performs an action rather
 * than following a destination — which is why the navigation union gives an
 * action item no `href`.
 */

'use client';

import { buttonClasses } from '@/components/ui/button';
import { useTerminal } from './terminal-context';

export interface TerminalTriggerProps {
  readonly label: string;
  readonly shortcut: string;
}

export function TerminalTrigger({ label, shortcut }: TerminalTriggerProps) {
  const { open, toggleTerminal } = useTerminal();

  return (
    <button
      type="button"
      onClick={toggleTerminal}
      aria-expanded={open}
      aria-haspopup="dialog"
      // Built from the one button recipe, so this control is the same control
      // everywhere in the shell. It sits on the header's `surface`, one of the
      // three surfaces `border-strong` is permitted on.
      className={buttonClasses('secondary', 'sm')}
    >
      {label}
      {/* Announced as part of the name, so the shortcut is discoverable. */}
      <span className="sr-only"> (opens the terminal. Keyboard shortcut: {shortcut})</span>
    </button>
  );
}