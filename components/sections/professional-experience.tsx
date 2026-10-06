import { formatDateRange } from '@/lib/content/date';
import { experiencesInRecencyOrder } from '@/lib/content/model';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * Professional Experience Section.
 *
 * Dedicated section for industry work and enterprise internships (Dayforce Inc. and Sun Life).
 * Server Component with zero client bundle overhead.
 */
export function ProfessionalExperienceSection() {
  const experiences = experiencesInRecencyOrder().filter(
    (exp) => exp.track === 'professional',
  );

  return (
    <section
      id={SECTION_IDS.professionalExperience}
      aria-labelledby="professional-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
            01 // Industry & Enterprise
          </p>
          <span className="font-mono text-label uppercase tracking-[0.06em] text-success">
            {experiences.length} verified roles
          </span>
        </div>
        <h2 id="professional-heading" className="text-title font-medium text-text">
          Professional Experience
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          Enterprise IT operations, service management, infrastructure ticketing, and corporate support internships.
        </p>
      </div>

      <ol className="relative ml-1 border-l border-border pl-5 sm:ml-2 sm:pl-6 max-w-4xl mx-auto w-full">
        {experiences.map((experience) => {
          return (
            <li key={experience.slug} className="relative pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[calc(1.25rem+5px)] top-2 h-2.5 w-2.5 rounded-full border border-accent bg-accent sm:-left-[calc(1.5rem+5px)]"
              />
              <article className="group rounded-md border border-border bg-surface-raised p-4 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-heading font-medium text-text transition-colors group-hover:text-accent">
                        {experience.title}
                      </h3>
                      {experience.badgeLabel && (
                        <span className="rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                          {experience.badgeLabel}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-small font-medium text-text-secondary">
                      {experience.organization}
                    </p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
                      Professional
                    </p>
                    <p className="mt-1 font-mono text-label text-text-muted">
                      {formatDateRange(experience.startDate, experience.endDate)}
                    </p>
                  </div>
                </div>

                {experience.responsibilities && experience.responsibilities.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {experience.responsibilities.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-small leading-relaxed text-text-secondary"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : experience.description ? (
                  <ul className="mt-3 space-y-2">
                    {experience.description
                      .split(/(?<=\.)\s+/)
                      .filter(Boolean)
                      .map((sentence, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-small leading-relaxed text-text-secondary"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          <span>{sentence}</span>
                        </li>
                      ))}
                  </ul>
                ) : null}

                {experience.skills && experience.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {experience.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xs border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="font-mono text-label text-text-muted">
                    {experience.location ?? 'Metro Manila'}
                  </span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
