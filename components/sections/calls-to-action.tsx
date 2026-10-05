import { Button, buttonClasses } from '@/components/ui/button';
import type { Action } from '@/content/site';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * An action that leaves the site.
 *
 * It cannot be a `Button`: the primitive renders an internal `Link`, and an
 * external destination needs `target="_blank"` and `rel="noopener noreferrer"`
 * to be safe. Adding target and rel to the primitive for one caller would undo
 * D9, so the anchor is built from `buttonClasses` instead — the same recipe the
 * primitive uses, not a second copy of it — and both `variant` and `note` are
 * honoured here rather than being declared in the content and then discarded.
 */
function ActionLink({ action }: { action: Action }) {
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(action.variant, 'md')}
    >
      {action.label}
      <span aria-hidden="true" className="text-text-muted">
        &#8599;
      </span>
      <span className="sr-only"> ({action.note ?? 'Opens in a new tab'})</span>
    </a>
  );
}

/**
 * The closing actions.
 *
 * Destinations come from `lib/navigation.ts` or from the content declaration;
 * none is typed into this file. Adding an action is a change to the content, and
 * the section has no list to keep in step.
 *
 * The note that an external link leaves the site is present visually as well as
 * in the accessible name, so it is not carried by a target attribute alone.
 */
export function CallsToAction({ actions }: { actions: readonly Action[] }) {
  return (
    <section
      id={SECTION_IDS.connect}
      aria-labelledby="connect-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 id="connect-heading" className="text-title font-medium text-text">
          Get in touch
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          The fastest route to me is email. GitHub and LinkedIn are open if you
          would rather start there.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {actions.map((action) =>
          action.external ? (
            <ActionLink key={action.label} action={action} />
          ) : (
            <Button key={action.label} variant={action.variant} href={action.href}>
              {action.label}
            </Button>
          ),
        )}
      </div>
    </section>
  );
}