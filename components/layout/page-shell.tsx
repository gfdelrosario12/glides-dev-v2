import { SkipLink } from './skip-link';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { CONTENT_GUTTER } from '@/lib/layout';
import { TerminalProvider } from '@/components/terminal/terminal-context';
import { TerminalOverlay } from '@/components/terminal/terminal-overlay';

/**
 * The page shell. Applied once in the root layout, so no route can render
 * without it and no route has to opt in.
 *
 * The main region carries `id="main-content"` and `tabIndex={-1}` so the skip
 * link can move focus into it — a focusable main region is what makes that
 * work in browsers that do not focus a fragment target on its own.
 *
 * The shell also owns the site-wide terminal overlay. It lives here rather than
 * in the header because it has to be a sibling of the whole shell, not a child of
 * the header or of the main column: the header's control and the overlay are
 * siblings in the DOM, and this is the only place both can reach. No route
 * renders its own, so there is exactly one terminal on every route.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <TerminalProvider>
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
      {/* Outside the shell's box, after the footer: the overlay is presented over
          the page rather than inside its flow. */}
      <TerminalOverlay />
    </TerminalProvider>
  );
}
