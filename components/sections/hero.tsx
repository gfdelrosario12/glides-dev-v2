import { Button } from '@/components/ui/button';
import { FOCUS_AREAS, PRIMARY_ACTION, PROFILE } from '@/content/site';

/**
 * The hero. A Server Component.
 *
 * The name and the role are real text, not an image or a gradient, so they are
 * selectable, translatable, and read correctly by assistive technology before
 * anything else on the page loads.
 *
 * The eyebrow lists the focus areas by reading `FOCUS_AREAS`, so it cannot drift
 * from the section further down that explains them. There is no second list of
 * the five areas anywhere in the project.
 *
 * Exactly one primary button appears in this section, and it is the only one on
 * the page — the accent fill is the system's scarcest emphasis, and two accents
 * on one screen means neither one is the emphasis.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="flex flex-col gap-6 py-8 sm:py-12">
      <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
        {FOCUS_AREAS.map((area) => area.label).join(' · ')}
      </p>

      <div className="flex flex-col gap-3">
        <h1 id="hero-name" className="max-w-3xl text-display font-medium text-text">
          {PROFILE.name}
        </h1>
        <p className="max-w-2xl text-title text-text-secondary">{PROFILE.role}</p>
        <p className="max-w-2xl text-body text-text-muted">{PROFILE.roleLine}</p>
      </div>

      <p className="max-w-prose text-body text-text-secondary">{PROFILE.summary}</p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button variant={PRIMARY_ACTION.variant} href={PRIMARY_ACTION.href}>
          {PRIMARY_ACTION.label}
        </Button>
      </div>
    </section>
  );
}