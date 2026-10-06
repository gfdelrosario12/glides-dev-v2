import { formatDateRange } from '@/lib/content/date';
import { experiencesInRecencyOrder } from '@/lib/content/model';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * Hackathons Section.
 *
 * Dedicated section for competitive hackathons, blockchain dApps, and sprint engineering.
 * Server Component with zero client bundle overhead.
 */
export function HackathonsSection() {
  const hackathons = experiencesInRecencyOrder().filter(
    (exp) => exp.track === 'technical',
  );

  return (
    <section
      id={SECTION_IDS.hackathons}
      aria-labelledby="hackathons-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-info">
            02 // Hackathons & Competitions
          </p>
          <span className="font-mono text-label uppercase tracking-[0.06em] text-info">
            {hackathons.length} sprint builds
          </span>
        </div>
        <h2 id="hackathons-heading" className="text-title font-medium text-text">
          Hackathons & Sprints
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          High-intensity sprint builds, blockchain dApps, technical product management, and award-oriented hackathon engineering.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {hackathons.map((hackathon) => {
          return (
            <article
              key={hackathon.slug}
              className="group relative flex flex-col justify-between rounded-md border border-border bg-surface-raised p-4 transition-colors duration-200 hover:border-info hover:bg-surface-overlay w-full max-w-xl mx-auto sm:max-w-none"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-sm border border-info/30 bg-info/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-info">
                    Hackathon
                  </span>
                  <span className="font-mono text-label text-text-muted">
                    {formatDateRange(hackathon.startDate, hackathon.endDate)}
                  </span>
                </div>

                <h3 className="mt-2 text-heading font-medium text-text transition-colors group-hover:text-info">
                  {hackathon.title}
                </h3>

                <p className="mt-1 font-mono text-label text-text-secondary">
                  {hackathon.organization}
                </p>

                {hackathon.description && (
                  <p className="mt-3 text-small leading-relaxed text-text-secondary">
                    {hackathon.description}
                  </p>
                )}

                {hackathon.skills && hackathon.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hackathon.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xs border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <span className="font-mono text-label text-text-muted">
                  {hackathon.location ?? 'Metro Manila'}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
