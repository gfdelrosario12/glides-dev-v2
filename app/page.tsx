import { CallsToAction } from '@/components/sections/calls-to-action';
import { EducationSummary } from '@/components/sections/education-summary';
import { ExpertiseSummary } from '@/components/sections/expertise';
import { FocusAreas } from '@/components/sections/focus-areas';
import { HackathonsSection } from '@/components/sections/hackathons';
import { Hero } from '@/components/sections/hero';
import { MotionSection } from '@/components/layout/motion-section';
import { OrganizationsSection } from '@/components/sections/organizations';
import { PracticalProjectsSection } from '@/components/sections/projects';
import { ProfessionalExperienceSection } from '@/components/sections/professional-experience';
import { DERIVED } from '@/lib/content/derive';
import { SECTION_RHYTHM } from '@/lib/layout';

export const metadata = {
  title: 'Gladwin Ferdz Del Rosario \u00b7 Systems & Cloud Infrastructure Engineer',
  description:
    'Technology professional focused on building scalable, reliable systems across full-stack development and cloud infrastructure, with hands-on exposure to AWS, Azure, and Google Cloud.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://gladwin.dev',
    title: 'Gladwin Ferdz Del Rosario \u00b7 Systems & Cloud Infrastructure Engineer',
    description:
      'Technology professional focused on building scalable, reliable systems across full-stack development and cloud infrastructure, with hands-on exposure to AWS, Azure, and Google Cloud.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gladwin Ferdz Del Rosario \u00b7 Systems & Cloud Infrastructure Engineer',
    description:
      'Technology professional focused on building scalable, reliable systems across full-stack development and cloud infrastructure, with hands-on exposure to AWS, Azure, and Google Cloud.',
  },
};

/**
 * The landing page. A Server Component, and entirely server-rendered.
 *
 * Ordered as requested:
 * 1. Hero
 * 2. Expertise Summary
 * 3. Professional Experience
 * 4. Certifications
 * 5. Education
 * 6. Practical Projects
 * 7. Hackathons & Sprints
 * 8. Organizations & Community
 * 9. Let's Connect button
 */
export default function Home() {
  return (
    <div className={`py-12 ${SECTION_RHYTHM}`}>
      <MotionSection>
        <Hero />
      </MotionSection>
      <MotionSection>
        <ExpertiseSummary
          focusAreas={DERIVED.focusAreas}
          technologies={DERIVED.technologiesInUse}
        />
      </MotionSection>
      <MotionSection>
        <ProfessionalExperienceSection />
      </MotionSection>
      <MotionSection>
        <FocusAreas />
      </MotionSection>
      <MotionSection>
        <EducationSummary />
      </MotionSection>
      <MotionSection>
        <PracticalProjectsSection />
      </MotionSection>
      <MotionSection>
        <HackathonsSection />
      </MotionSection>
      <MotionSection>
        <OrganizationsSection />
      </MotionSection>
      <MotionSection>
        <CallsToAction />
      </MotionSection>
    </div>
  );
}