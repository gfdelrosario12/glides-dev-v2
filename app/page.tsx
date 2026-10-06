import { CallsToAction } from '@/components/sections/calls-to-action';
import { EducationSummary } from '@/components/sections/education-summary';
import { FocusAreas } from '@/components/sections/focus-areas';
import { Hero } from '@/components/sections/hero';
import { InfrastructureExpertise } from '@/components/sections/expertise';
import { MotionSection } from '@/components/layout/motion-section';
import { ProjectsBand } from '@/components/sections/projects';
import { DERIVED } from '@/lib/content/derive';
import { SECTION_RHYTHM } from '@/lib/layout';

export const metadata = {
  title: 'Infrastructure, Cloud & Cybersecurity Engineer',
  description:
    'Gladwin Ferdz Del Rosario builds and operates cloud, networking, cybersecurity, and IT infrastructure.',
};

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
      <MotionSection>
        <Hero />
      </MotionSection>
      <MotionSection>
        <InfrastructureExpertise focusAreas={DERIVED.focusAreas} />
      </MotionSection>
      <MotionSection>
        <EducationSummary />
      </MotionSection>
      <MotionSection>
        <FocusAreas />
      </MotionSection>
      <MotionSection>
        <ProjectsBand />
      </MotionSection>
      <MotionSection>
        <CallsToAction />
      </MotionSection>
    </div>
  );
}