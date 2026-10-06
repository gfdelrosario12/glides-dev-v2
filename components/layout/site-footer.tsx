import { SOCIAL_LINKS } from '@/lib/navigation';
import { PROFILE } from '@/content/site';
import { CONTENT_GUTTER } from '@/lib/layout';

/**
 * Global footer. A Server Component.
 *
 * The colophon names the site owner, read from the profile record rather than
 * from a constant in the navigation module: the name was declared in two places
 * and only one of them was the content. The build stamp is machine-facing, so it
 * renders in the mono face at `text-muted`, consistent with every other
 * machine-facing string in the system.
 *
 * The social destinations come from the same content records the navigations
 * read, and each carries whether it leaves the site — so the mail link renders as
 * a mail link rather than being given new-tab treatment it does not need.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div
        className={`mx-auto flex max-w-wide flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between ${CONTENT_GUTTER}`}
      >
        <div className="flex flex-col gap-1 items-center text-center sm:items-start sm:text-left">
          <p className="font-mono text-small text-text">{PROFILE.name}</p>
          <p className="font-mono text-label text-text-muted">
            Next.js 16 &middot; Tailwind CSS v4 &middot; TypeScript
          </p>
        </div>

        <nav aria-label="Elsewhere" className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
          {SOCIAL_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-sm px-3 py-2 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors duration-200 hover:bg-surface-raised hover:text-accent"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-sm px-3 py-2 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors duration-200 hover:bg-surface-raised hover:text-accent"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
