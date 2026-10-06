import { CONTENT } from '@/lib/content/model';
import { SECTION_IDS } from '@/lib/navigation';
import { ReadableDescription } from '@/components/ui/readable-description';

export function PracticalProjectsSection() {
  const { projects } = CONTENT;

  if (!projects || projects.length === 0) return null;

  return (
    <section
      id={SECTION_IDS.projects}
      aria-labelledby="projects-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
          Projects // deployed systems
        </p>
        <h2 id="projects-heading" className="text-title font-medium text-text">
          Practical Projects
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          Production software systems, IoT hardware implementations, full-stack applications, and cloud infrastructures.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group relative flex flex-col gap-2 rounded-md border border-border bg-surface p-4 transition-colors hover:border-accent/50 w-full max-w-xl mx-auto sm:max-w-none"
          >
            <h3 className="text-body font-medium text-text transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <span className="text-label text-text-muted">{project.category}</span>
            <ReadableDescription
              description={project.description}
              className="text-small text-text-secondary"
            />
            {project.techStack.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border border-border bg-surface-raised px-2 py-0.5 text-xs text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-auto flex items-center gap-4 pt-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center py-2 text-small text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Live Site
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center py-2 text-small text-text-secondary hover:text-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Source Code
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Backward-compatible alias
export { PracticalProjectsSection as ProjectsBand };
