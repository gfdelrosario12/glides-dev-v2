import Link from 'next/link';
import { PRIMARY_NAV, type NavItem } from '@/lib/navigation';
import { CONTENT_GUTTER } from '@/lib/layout';
import { buttonClasses } from '@/components/ui/button';
import { NavLink } from './nav-link';
import { SystemStatusServer } from './system-status-server';
import { ThemeToggle } from './theme-toggle';


/**
 * Global header. A Server Component.
 *
 * Sticky, separated from scrolling content by a 1px hairline and nothing else
 * — no drop shadow, consistent with design decision D7.
 *
 * The small-width disclosure uses native `<details>`/`<summary>`, which gives
 * keyboard operation, focus handling, and an exposed expanded state to
 * assistive technology with no client JavaScript. See design decision D6.
 *
 * Both the desktop navigation and the disclosure render from `PRIMARY_NAV`, so
 * their link sets and order are identical by construction.
 *
 * This file stays a Server Component. `TerminalTrigger` is a thin client child;
 * the header structure around it is still rendered on the server.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div
        className={`mx-auto flex h-14 max-w-wide items-center justify-between gap-4 ${CONTENT_GUTTER}`}
      >
        <div className="flex items-center gap-4">
        <Link
          href="/"
          className="rounded-sm px-2 py-1 font-mono text-small font-medium uppercase tracking-[0.06em] text-text transition-colors duration-200 hover:bg-surface-raised hover:text-accent"
        >
          Gladwin<span className="text-accent">.dev</span>
        </Link>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <SystemStatusServer />
      </div>

        <div className="flex items-center gap-3">
          <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
            {PRIMARY_NAV.map((item) => (
              <NavEntry key={entryKey(item)} item={item} />
            ))}
          </nav>
          <ThemeToggle />

          <details className="group relative sm:hidden">
          <summary
            className={`${buttonClasses('secondary', 'sm')} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
          >
            Menu
            <span
              aria-hidden="true"
              className="text-accent transition-transform group-open:rotate-90"
            >
              &rsaquo;
            </span>
          </summary>

          <nav
            aria-label="Primary"
            className="absolute right-0 top-full z-50 mt-2 flex min-w-48 flex-col gap-3 rounded-md border border-border bg-surface-overlay p-4"
          >
            {PRIMARY_NAV.map((item) => (
              <NavEntry key={entryKey(item)} item={item} />
            ))}
          </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

/** A stable React key for either kind of navigation entry. */
function entryKey(item: NavItem): string {
  return item.kind === 'link' ? item.href : item.id;
}

/**
 * One navigation entry. Both desktop and mobile layouts use this same renderer.
 */
function NavEntry({ item }: { item: NavItem }) {
  if (item.kind === 'action') return null;

  return <NavLink href={item.href} label={item.label} external={item.external} />;
}
