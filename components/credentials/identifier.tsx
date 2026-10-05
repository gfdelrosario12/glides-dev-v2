import { cn } from '@/lib/cn';

/**
 * The credential identifier, presented as a value rather than as prose.
 *
 * A badge UUID is a reference, not a sentence, so it gets the code treatment: monospaced
 * at `--text-code` on `--color-surface-inset` (`#1a1d22`) behind a `--color-border`
 * (`#262a31`) hairline. That combination already exists for the terminal and for code
 * snippets; reusing it is why this adds no token.
 *
 * Rendered inside a `<code>` element so the value is marked up as code rather than only
 * looking like it, and `wrap-anywhere` so a long identifier wraps instead of widening the
 * document on a narrow screen.
 */
export function CredentialIdentifier({ value }: { readonly value: string }) {
  return (
    <code
      className={cn(
        'inline-block max-w-full rounded-sm border border-border bg-surface-inset px-2 py-1',
        'wrap-anywhere font-mono text-code text-text',
      )}
    >
      {value}
    </code>
  );
}