import { SkipLink } from './skip-link';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { CONTENT_GUTTER } from '@/lib/layout';

/**
 * The page shell. Applied once in the root layout, so no route can render
 * without it and no route has to opt in.
 *
 * The main region carries `id="main-content"` and `tabIndex={-1}` so the skip
 * link can move focus into it — a focusable main region is what makes that
 * work in browsers that do not focus a fragment target on its own.
 *
 * The hero owns the site's single terminal surface. The shell stays focused on
 * shared navigation, landmarks, and the page frame.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SkipLink />
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className={`mx-auto w-full max-w-wide flex-1 ${CONTENT_GUTTER}`}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
