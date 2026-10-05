'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

/**
 * The application's only interactive client leaf.
 *
 * `usePathname` is a Client Component hook by design — reading the URL from a
 * Server Component is deliberately unsupported — so marking the current route
 * requires a client boundary somewhere. Confining it to one leaf that renders
 * a single link keeps the header and footer as Server Components instead of
 * pulling their whole structure into the client bundle. See design decision D5.
 *
 * The current route is conveyed by two channels: `aria-current="page"` for
 * assistive technology, and a visible non-colour marker alongside the accent
 * colour, so it stays identifiable in greyscale.
 */

export interface NavLinkProps {
  href: string;
  label: string;
  external?: boolean;
  /** Extra classes for the caller's layout. Not a styling override. */
  placement?: string;
}

export function NavLink({ href, label, external, placement }: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  const marker = isCurrent ? (
    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-xs bg-accent" />
  ) : null;

  const classes = cn(
    'inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.06em]',
    isCurrent ? 'text-accent' : 'text-text-secondary hover:text-text',
    placement,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {marker}
        {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} aria-current={isCurrent ? 'page' : undefined} className={classes}>
      {marker}
      {label}
    </Link>
  );
}
