import { Biography } from '@/components/sections/biography';
import { CallsToAction } from '@/components/sections/calls-to-action';
import { EducationSummary } from '@/components/sections/education-summary';
import { FeaturedWork } from '@/components/sections/featured-work';
import { FocusAreas } from '@/components/sections/focus-areas';
import { Hero } from '@/components/sections/hero';
import { StatisticsBand } from '@/components/sections/statistics';
import { SECONDARY_ACTIONS } from '@/content/site';
import { DERIVED } from '@/lib/content/derive';
import { SECTION_RHYTHM } from '@/lib/layout';

/**
 * The landing page. A Server Component, and entirely server-rendered.
 *
 * Every figure and every card comes from the content model through
 * `derive.ts`, so the markup that arrives is the finished page rather than a
 * shell that fills itself in. Nothing here needs a client bundle, which is why
 * the page works with scripting disabled.
 *
 * Sibling regions are separated by the single rhythm step from
 * `lib/layout.ts`, never by one-off gaps.
 *
 * The page adds no shell of its own: the skip link, header, `main`, and footer
 * all come from `PageShell` in the root layout, so there is exactly one banner,
 * one main region, and one contentinfo.
 */
export default function Home() {
  return (
    <div className={`py-12 ${SECTION_RHYTHM}`}>
      <Hero />
      <Biography />
      <EducationSummary />
      <FocusAreas focusAreas={DERIVED.focusAreas} />
      <FeaturedWork
        caseStudies={DERIVED.featuredCaseStudies}
        totalAvailable={DERIVED.statistics.caseStudyCount}
      />
      <StatisticsBand statistics={DERIVED.statistics} />
      <CallsToAction actions={SECONDARY_ACTIONS} />
    </div>
  );
}