import { cn } from '@/lib/cn';

/**
 * Presentational label–value row.
 *
 * The label is machine-facing, so it renders in the mono face at the `label`
 * step, uppercase, in `text-muted`. The value is likewise machine-facing and
 * renders in the mono face. Nothing here accepts a className override.
 */

export interface MetadataProps {
  label: string;
  value: React.ReactNode;
  /**
   * Rendered in the value position when there is no value, so that labels stay
   * aligned down the column instead of the row disappearing.
   */
  emptyLabel?: string;
}

export function Metadata({ label, value, emptyLabel = 'Not recorded' }: MetadataProps) {
  const isEmpty = value === null || value === undefined || value === '';

  return (
    <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3 py-2">
      <dt className="text-label font-mono uppercase tracking-[0.06em] text-text-muted">
        {label}
      </dt>
      <dd
        className={cn(
          // `wrap-anywhere` rather than `break-words`: overflow-wrap: anywhere
          // reduces the min-content contribution, so a long unbroken value can
          // actually shrink inside the grid track. `break-word` does not, and
          // would let a long URL widen the whole document.
          'wrap-anywhere font-mono text-small',
          isEmpty ? 'text-text-muted' : 'text-text',
        )}
      >
        {isEmpty ? emptyLabel : value}
      </dd>
    </div>
  );
}

export interface MetadataListProps {
  /** Accessible name for the group of label–value pairs. */
  label: string;
  children: React.ReactNode;
}

export function MetadataList({ label, children }: MetadataListProps) {
  return (
    <dl aria-label={label} className="divide-y divide-border">
      {children}
    </dl>
  );
}
