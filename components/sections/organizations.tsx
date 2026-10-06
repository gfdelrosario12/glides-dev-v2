import { formatDateRange } from '@/lib/content/date';
import { experiencesInRecencyOrder } from '@/lib/content/model';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * Organizations & Community Leadership Section.
 *
 * Dedicated section for student governance, clubs, dev advocacy, and tech volunteering.
 * Server Component with zero client bundle overhead.
 */
export function OrganizationsSection() {
  const orgExperiences = experiencesInRecencyOrder().filter(
    (exp) => exp.track !== 'professional' && exp.track !== 'technical',
  );

  return (
    <section
      id={SECTION_IDS.organizations}
      aria-labelledby="organizations-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            03 // Community & Student Governance
          </p>
          <span className="font-mono text-label uppercase tracking-[0.06em] text-success">
            {orgExperiences.length} active roles
          </span>
        </div>
        <h2 id="organizations-heading" className="text-title font-medium text-text">
          Organizations & Community
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          Student governance, developer community advocacy, nationwide event operations, and technical club leadership.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {orgExperiences.map((item) => {
          return (
            <article
              key={item.slug}
              className="group flex flex-col justify-between rounded-md border border-border bg-surface-raised p-4 transition-colors duration-200 hover:border-border-strong hover:bg-surface-overlay w-full max-w-xl mx-auto sm:max-w-none"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  {item.badgeLabel ? (
                    <span className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                      {item.badgeLabel}
                    </span>
                  ) : (
                    <span className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                      Community
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-text-muted">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>

                <h3 className="mt-2 text-body font-medium text-text transition-colors group-hover:text-accent">
                  {item.title}
                </h3>

                <p className="mt-0.5 font-mono text-small text-text-secondary">
                  {item.organization}
                </p>

                {item.description && (
                  <p className="mt-2 text-small leading-relaxed text-text-muted line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                <span className="font-mono text-[11px] text-text-muted">
                  {item.location ?? 'Manila'}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
