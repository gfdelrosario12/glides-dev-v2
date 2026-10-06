import { CONTENT } from '@/lib/content/model';
import Link from 'next/link';
import { SECTION_IDS } from '@/lib/navigation';

export function ProjectsBand() {
  const { projects } = CONTENT;

  if (!projects || projects.length === 0) return null;

  return (
    <section id={SECTION_IDS.projects} aria-labelledby="projects-heading" className="flex flex-col gap-6 scroll-mt-16">
      <h2 id="projects-heading" className="text-title font-medium text-text">
        Additional Projects
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map(project => (
          <div key={project.slug} className="relative flex flex-col gap-2 rounded-md border border-border bg-surface p-4 hover:border-accent/50 transition-colors group">
            <h3 className="text-body font-medium text-text group-hover:text-accent transition-colors">
              <Link href={`/case-study/${project.slug}`} className="before:absolute before:inset-0">
                {project.title}
              </Link>
            </h3>
            <span className="text-label text-text-muted">{project.category}</span>
            <p className="text-small text-text-secondary relative z-10 pointer-events-none">{project.description}</p>
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 relative z-10 pointer-events-none">
                {project.techStack.map(tech => (
                  <span key={tech} className="rounded-sm bg-surface-raised px-2 py-0.5 text-xs text-text-secondary border border-border">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 mt-auto pt-2 relative z-10">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-small text-accent hover:underline">
                  Live Site
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-small text-text-secondary hover:underline">
                  Source Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
