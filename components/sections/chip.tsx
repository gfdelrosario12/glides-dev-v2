import { cn } from '@/lib/cn';

/**
 * A short machine-facing token, rendered as a bordered label.
 *
 * A local helper for these sections, not a design-system primitive: it exists
 * because focus areas and project stacks both need to show a short value as
 * something you can point at, and adding a primitive to `components/ui/` for
 * two callers would widen the system for no gain. Nothing here takes a className
 * override, and every value comes from the token layer.
 */
export function TokenChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-xs border border-border bg-surface-inset',
        'px-2 py-0.5 font-mono text-label text-text-secondary wrap-anywhere',
      )}
    >
      {label}
    </span>
  );
}

/** A row of tokens, wrapping rather than overflowing. */
export function TokenChipList({ labels }: { labels: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <li key={label}>
          <TokenChip label={label} />
        </li>
      ))}
    </ul>
  );
}