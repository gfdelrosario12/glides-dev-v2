import { ProfessionalExperienceSection } from './professional-experience';
import { HackathonsSection } from './hackathons';
import { OrganizationsSection } from './organizations';

/**
 * Composite ExperienceTimeline presenting the three separated sections:
 * Professional Experience, Hackathons, and Organizations & Community.
 */
export function ExperienceTimeline() {
  return (
    <div className="flex flex-col gap-16">
      <ProfessionalExperienceSection />
      <HackathonsSection />
      <OrganizationsSection />
    </div>
  );
}
