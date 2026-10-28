import fs from 'fs';
import path from 'path';

import { marked } from 'marked';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CONTENT } from '@/lib/content/model';
import {
  CaseStudyReader,
  DesktopTableOfContents,
  type TocItem,
} from '@/components/case-study/case-study-reader';

const PROJECT_ROLES: Record<string, string> = {
  'vibecheck-ai-code-standards-review-assistant': 'Sole Creator & AI/CLI Engineer',
  'arduino-day-philippines-2026-interactive-3d-activity-map': 'Lead Frontend & 3D Interactive Systems Developer',
  'stampify-digital-id-verification-and-event-passport-system': 'Full-Stack Developer & Cloud Deployment Lead',
  'guardian-vision-voice-activated-emergency-monitoring-system': 'IoT Systems Engineer & Cloud Backend Architect',
  'siteguard-workforce-management-and-biometric-security-system': 'Systems Infrastructure & Full-Stack Security Engineer',
  'chem-z-chemistry-learning-management-system': 'Full-Stack Developer & 3D Web Graphics Specialist',
  'etapon-iot-enabled-smart-waste-management-system': 'IoT Firmware & Hardware Integration Engineer',
  'asteria-academy-student-information-system': 'Backend Architect & Full-Stack Developer',
  'traittechhive-technology-personality-assessment-platform': 'Frontend UI/UX & State Architecture Engineer',
  'happy-endings-wedding-website-builder-platform': 'Sole Full-Stack Developer & System Designer',
  'care-max-arduino-heart-rate-monitoring-system': 'Embedded Systems & Biomedical Hardware Integrator',
  'portfolio-website-v1-professional-portfolio-platform': 'Creator & Frontend Developer',
};

export function generateStaticParams(): { slug: string }[] {
  const projectSlugs = CONTENT.projects.map((p) => ({ slug: p.slug }));
  const caseStudySlugs = CONTENT.caseStudies.map((cs) => ({ slug: cs.slug }));
  const experienceSlugs = CONTENT.experiences.map((exp) => ({ slug: exp.slug }));

  const dirPath = path.join(process.cwd(), 'content', 'case-studies-md');
  let mdSlugs: { slug: string }[] = [];
  try {
    const files = fs.readdirSync(dirPath);
    mdSlugs = files
      .filter((file) => file.endsWith('.md'))
      .map((file) => ({ slug: file.replace(/\.md$/, '') }));
  } catch {
    // Directory might be missing in testing
  }

  const combined = new Map<string, { slug: string }>();
  for (const item of [...projectSlugs, ...caseStudySlugs, ...experienceSlugs, ...mdSlugs]) {
    combined.set(item.slug, item);
  }

  return Array.from(combined.values());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = CONTENT.projects.find((entry) => entry.slug === slug);
  const caseStudy = CONTENT.caseStudies.find((entry) => entry.slug === slug);
  const experience = CONTENT.experiences.find((entry) => entry.slug === slug);

  const title = project?.title ?? caseStudy?.title ?? experience?.title ?? `Case study: ${slug}`;
  const description =
    project?.description ??
    caseStudy?.description ??
    experience?.description ??
    `Technical case study article by Gladwin Ferdz Del Rosario: ${title}.`;

  return {
    title: `${title} · Case Study`,
    description,
    alternates: { canonical: `/case-study/${slug}` },
    openGraph: { title: `${title} · Case Study`, description, type: 'article' },
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'case-studies-md', `${slug}.md`);

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    // Content pending
  }

  const project = CONTENT.projects.find((entry) => entry.slug === slug);
  const caseStudy = CONTENT.caseStudies.find((entry) => entry.slug === slug);
  const experience = CONTENT.experiences.find((entry) => entry.slug === slug);

  if (!content && !project && !caseStudy && !experience) {
    notFound();
  }

  // Extract headings and inject IDs for navigation anchors
  const toc: TocItem[] = [];
  const renderer = new marked.Renderer();

  renderer.heading = ({ text, depth }) => {
    const rawText = text.replace(/<[^>]*>/g, '');
    const headingId = slugify(rawText);

    if (depth === 2 || depth === 3) {
      toc.push({ id: headingId, text: rawText, level: depth });
    }

    return `<h${depth} id="${headingId}" class="group relative flex items-center justify-between">
      <span>${text}</span>
      <a href="#${headingId}" class="ml-2 font-mono text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent" aria-label="Direct link to ${rawText}">#</a>
    </h${depth}>`;
  };

  const html = content.trim() === '' ? '' : await marked.parse(content, { renderer });

  // Metadata chips
  const tags: string[] = [];
  let categoryLabel = 'Project Case Study';
  if (project) {
    if (project.category) {
      categoryLabel = `${project.category} Project`;
    }
    tags.push(...project.techStack);
  } else if (caseStudy) {
    if (caseStudy.category) {
      categoryLabel = `${caseStudy.category} Case Study`;
    }
    tags.push(...caseStudy.technologies.map((t) => t.name));
  } else if (experience) {
    if (experience.track) {
      categoryLabel = `${experience.track} Experience`;
    }
    tags.push(...experience.skills);
  }

  const displayTitle = project?.title ?? caseStudy?.title ?? experience?.title ?? slug;
  const projectRole = PROJECT_ROLES[slug] ?? (experience ? experience.title : null);

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Reading Progress & Mobile TOC */}
      <CaseStudyReader toc={toc} />

      {/* Breadcrumb & Navigation Bar */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4"
      >
        <div className="flex items-center gap-2 font-mono text-label uppercase tracking-[0.06em] text-text-muted">
          <Link href="/" className="hover:text-accent transition-colors">
            Gladwin.dev
          </Link>
          <span>/</span>
          <Link href="/#projects" className="hover:text-accent transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-accent truncate max-w-[16rem] sm:max-w-xs">{slug}</span>
        </div>

        <Link
          href="/#projects"
          className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border-strong px-3 py-1.5 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:border-accent hover:bg-surface-raised hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          &larr; Back to projects
        </Link>
      </nav>

      {/* Professional Editorial Article Header */}
      <header className="mb-10 max-w-prose">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-sm border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
            {categoryLabel}
          </span>
          {projectRole && (
            <span className="rounded-sm border border-border-strong bg-surface-raised px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide text-text-secondary">
              Role: <strong className="font-semibold text-text">{projectRole}</strong>
            </span>
          )}
          <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Technical Architecture &amp; Implementation
          </span>
        </div>

        <h1 className="text-display font-medium text-text mb-4 leading-tight">
          {displayTitle}
        </h1>

        {project?.description && (
          <p className="text-heading text-text-secondary leading-relaxed mb-6 font-normal">
            {project.description}
          </p>
        )}

        {/* Action Bar (Live Site & Source Code) */}
        {(project?.liveUrl || project?.githubUrl) && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-accent bg-accent/10 px-4 py-1.5 font-mono text-label uppercase tracking-[0.06em] text-accent transition-colors hover:bg-accent hover:text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span>Live Site</span>
                <span aria-hidden="true">&rarr;</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border-strong bg-surface-raised px-4 py-1.5 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:border-accent hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span>Source Code</span>
                <span aria-hidden="true">&rarr;</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}

        {/* Technologies Grid */}
        {tags.length > 0 && (
          <div className="pt-4 border-t border-border flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-border bg-surface-inset px-2.5 py-1 font-mono text-xs text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Layout Grid: Editorial Content + Sticky Desktop TOC */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <main className="min-w-0 max-w-prose flex-1">
          <article className="article-content">
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="rounded-md border border-dashed border-border-strong bg-surface-inset p-8 font-mono text-small uppercase tracking-[0.06em] text-text-muted">
                Case study documentation pending publication
              </div>
            )}
          </article>

          {/* Footer Back Link & Call to Action */}
          <footer className="mt-16 border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/#projects"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong px-4 py-2 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:border-accent hover:bg-surface-raised hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              &larr; Back to all projects
            </Link>

            <Link
              href="/connect"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-label uppercase tracking-[0.06em] text-accent hover:underline"
            >
              Let&apos;s Connect &rarr;
            </Link>
          </footer>
        </main>

        {/* Desktop Sticky Table of Contents */}
        <DesktopTableOfContents toc={toc} />
      </div>
    </div>
  );
}
