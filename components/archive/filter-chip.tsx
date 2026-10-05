import Link from 'next/link';

import { cn } from '@/lib/cn';

/**
 * One filter option.
 *
 * A link, not a toggle. Filtering works by navigating, so it needs no client
 * state, survives a reload, is shareable, and works with scripting disabled.
 * `next/link` needs no client boundary to prefetch, so this file carries no
 * `'use client'` directive and the archive introduces no client component.
 *
 * The selected state is carried in two channels so it does not depend on colour
 * alone: an `aria-hidden` dot, mirroring the active navigation item in
 * `nav-link.tsx`, and `aria-current`. Both restate what the href already says,
 * so a screen-reader user and a visitor in greyscale learn the same thing.
 *
 * The resting border is `border-strong`, not `border`. `TokenChip` uses
 * `border` because it is a static label; this control is focusable, and
 * `design-tokens` reserves `border-strong` as the boundary for interactive
 * elements, where it measures at least 3:1 against the surface it sits on.
 */
export interface FilterChipProps {
  readonly href: string;
  readonly label: string;
  /** How many case studies this option matches. Never authored by hand. */
  readonly count: number;
  readonly selected: boolean;
}

export function FilterChip({ href, label, count, selected }: FilterChipProps) {
  return (
    <Link
      href={href}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-xs border px-2 py-0.5',
        'font-mono text-label wrap-anywhere',
        selected
          ? 'border-accent bg-accent-subtle text-accent'
          : 'border-border-strong bg-surface-inset text-text-secondary hover:text-text',
      )}
    >
      {selected ? <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-xs bg-accent" /> : null}
      {label}
      {/* Not `aria-hidden`: the number is the reason to choose this option, so
          it belongs in the accessible name rather than only on screen. */}
      <span className="text-text-muted">{count}</span>
    </Link>
  );
}