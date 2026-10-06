'use client';

import { useTerminal } from './terminal-context';
import { buttonClasses } from '@/components/ui/button';

const SUGGESTIONS = ['help', 'whoami', 'projects', 'certifications', 'experience', 'clear'];

export function TerminalSuggestions() {
  const { submit, busy } = useTerminal();

  return (
    <div className="flex sm:hidden overflow-x-auto gap-2 px-4 pb-3 pt-2 scrollbar-hide border-t border-surface-raised">
      {SUGGESTIONS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          disabled={busy}
          onClick={() => submit(cmd)}
          className={`${buttonClasses('secondary', 'sm')} min-h-9 flex-shrink-0 text-xs`}
        >
          {cmd}
        </button>
      ))}
    </div>
  );
}
