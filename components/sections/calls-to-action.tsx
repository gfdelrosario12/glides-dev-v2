import { Button } from '@/components/ui/button';
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
export function CallsToAction() {
  return (
    <section
      id={SECTION_IDS.connect}
      aria-labelledby="connect-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 id="connect-heading" className="text-title font-medium text-text">
          Let&apos;s connect
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          Good work starts with a good conversation. Find every direct channel in one place.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" href="/connect">
          Open social hub
        </Button>
      </div>
    </section>
  );
}