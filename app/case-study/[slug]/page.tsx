import fs from 'fs';
import path from 'path';

import { marked } from 'marked';
import type { Metadata } from 'next';

import { CONTENT } from '@/lib/content/model';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = CONTENT.caseStudies.find((entry) => entry.slug === slug);
  const experience = CONTENT.experiences.find((entry) => entry.slug === slug);
  const title = caseStudy?.title ?? experience?.title ?? `Case study: ${slug}`;
  const description =
    caseStudy?.description ??
    experience?.description ??
    `Technical case study by Gladwin Ferdz Del Rosario: ${slug}.`;

  return {
    title,
    description,
    alternates: { canonical: `/case-study/${slug}` },
    openGraph: { title, description, type: 'article' },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', 'case-studies-md', `${slug}.md`);

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    // Markdown files are authored manually in content/case-studies-md.
  }

  const html = content.trim() === '' ? '' : await marked.parse(content);

  return (
    <div className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <Link
        href="/#projects"
        className="mb-8 inline-flex rounded-sm border border-border-strong px-3 py-2 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:border-accent hover:bg-surface-raised hover:text-text"
      >
        &lt;- Back to projects
      </Link>
      <article className="prose prose-invert max-w-none prose-headings:text-text prose-p:text-text-secondary prose-a:text-accent prose-strong:text-text prose-code:text-accent">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="border border-dashed border-border-strong bg-surface-inset p-6 font-mono text-small uppercase tracking-[0.06em] text-text-muted">
            Empty / content pending
          </div>
        )}
      </article>
    </div>
  );
}
