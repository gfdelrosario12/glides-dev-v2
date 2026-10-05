import { Profile } from './profile';
import { PROFILE } from '@/content/site';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * The about region: the photograph and the biography.
 *
 * The prose is the site's reading measure — the sans face at the body step,
 * capped at the prose container — because this is the one place a visitor reads
 * a paragraph rather than scanning a label. Everything machine-facing on this
 * page stays in the mono face, so this is deliberately not.
 *
 * The section carries `scroll-mt` because the header is sticky: without it a
 * navigation link would scroll the heading to exactly where the header covers
 * it.
 */
export function Biography() {
  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby="about-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <h2 id="about-heading" className="text-title font-medium text-text">
        About
      </h2>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
        <Profile />

        <div className="flex min-w-0 flex-col gap-4">
          {PROFILE.biography.map((paragraph) => (
            <p key={paragraph} className="max-w-prose text-body text-text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}