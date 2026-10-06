import Link from 'next/link';
import { PRIMARY_NAV, type NavItem } from '@/lib/navigation';
import { CONTENT_GUTTER } from '@/lib/layout';
import { NavLink } from './nav-link';
import { SystemStatusServer } from './system-status-server';
import { ThemeToggle } from './theme-toggle';
import { MobileNavDrawer } from './mobile-nav-drawer';


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
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div
        className={`mx-auto flex min-h-14 max-w-wide items-center justify-between gap-2 py-2 ${CONTENT_GUTTER}`}
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <Link
          href="/"
          className="shrink-0 rounded-sm px-2 py-2 font-mono text-small font-medium uppercase tracking-[0.06em] text-text transition-colors duration-200 hover:bg-surface-raised hover:text-accent"
        >
          Gladwin<span className="text-accent">.dev</span>
        </Link>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <SystemStatusServer />
      </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
            {PRIMARY_NAV.map((item) => (
              <NavEntry key={entryKey(item)} item={item} />
            ))}
          </nav>
          <ThemeToggle />

          <MobileNavDrawer
            items={PRIMARY_NAV.filter(
              (item): item is Extract<NavItem, { kind: 'link' }> => item.kind === 'link',
            )}
          />
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
