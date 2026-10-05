import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata, MetadataList } from '@/components/ui/metadata';
import { SectionBlock } from '@/components/case-study/section-block';
import { TokenChipList } from '@/components/sections/chip';
import { DERIVED } from '@/lib/content/derive';
import { formatDate, formatDateRange } from '@/lib/content/date';
import { publishedCaseStudy, sectionsOf } from '@/lib/content/model';
import { domainLabel } from '@/lib/content/schema';
import type { CaseStudy } from '@/lib/content/model';
import { CONTENT_GUTTER } from '@/lib/layout';
import { SECTION_RHYTHM } from '@/lib/layout';

/**
 * The case-study page.
 *
 * A Server Component, and entirely server-rendered: the whole case study is in
 * the initial response and this route introduces no client component. That is
 * what lets it work with scripting disabled, and it is why the record is read here
 * rather than passed to a client leaf — a whole `CaseStudy` handed to the browser
 * would put the owner's content into a client bundle for no gain.
 *
 * The route adds no shell of its own. The skip link, header, `main`, and footer
 * all come from `PageShell` in the root layout, so the document has exactly one
 * banner, one main region, and one contentinfo.
 *
 * Two independent gates make an unpublished case study unreachable, and both are
 * needed. `generateStaticParams` enumerates only published slugs, so a draft is
 * not prerendered — but `dynamicParams` defaults to true, which means a draft
 * would still be generated on demand if this function did not also refuse it.
 * Enumeration alone is therefore not enough; the check below is what actually
 * holds.
 */

/** Every published case study, enumerated at build time. */
export function generateStaticParams(): { slug: string }[] {
  return DERIVED.publishedCaseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const caseStudy = publishedCaseStudy(slug);

  // One response for a slug no case study declares and for a slug a draft claims,
  // so an unpublished case study cannot be distinguished from a nonexistent one.
  if (caseStudy === undefined) {
    notFound();
  }

  /*
   * Resolved once, here, rather than inside the JSX: it filters this record's
   * media and snippets by section, and doing that in a render expression would
   * run it on every render of a page that is otherwise fully static.
   */
  const sections = sectionsOf(caseStudy);

  return (
    <article className={`py-12 ${CONTENT_GUTTER}`}>
      <div className={`mx-auto flex max-w-wide flex-col gap-8 ${SECTION_RHYTHM}`}>
        {/* A `div`, not a `header`: the element inside an article is scoped to
            it and so is not a banner landmark, but the document then holds
            exactly one element named `header` and nothing has to reason about
            which one is the shell's. */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Case study
          </p>
          <h1 className="text-title font-medium text-text">{caseStudy.title}</h1>
          <p className="max-w-prose text-body text-text-secondary">{caseStudy.description}</p>
          <TokenChipList
            labels={[
              caseStudy.category,
              ...caseStudy.domains.map(domainLabel),
              ...caseStudy.technologies.map((t) => t.name),
            ]}
          />
        </div>

        <Facts caseStudy={caseStudy} />

        <Destinations caseStudy={caseStudy} />

        {/* Every section is the same layout, so the page has one loop rather than
            a region per kind of content. Media and snippets render inside the
            section they belong to, which is why the flat Media region this
            replaced is gone: a diagram sat under a "Media" heading at the foot
            of the page, a long way from the section it illustrated. */}
        {sections.length > 0 ? (
          <div className="flex flex-col gap-8">
            {sections.map((section) => (
              <SectionBlock key={section.key} section={section} idPrefix={caseStudy.slug} />
            ))}
          </div>
        ) : null}

        <Related caseStudy={caseStudy} />

        <nav aria-label="Back" className="flex">
          {/* The archive rather than the landing page: a visitor who arrived
              here by address or from the terminal should reach the rest of the
              work in one step, not by way of a landing page that features two
              of the seven. */}
          <Button variant="ghost" size="sm" href="/projects">
            All case studies
          </Button>
        </nav>
      </div>
    </article>
  );
}

/**
 * The recorded facts about the case study.
 *
 * Rendered only when the content declares at least one, because an empty
 * definition list announces a group of facts and then presents none. The
 * alternative — `Not recorded` for each absent field — would put four rows of
 * "nothing" on a page whose content is complete, just differently arranged.
 */
function Facts({ caseStudy }: { caseStudy: CaseStudy }) {
  const rows: { label: string; value: string }[] = [];

  if (caseStudy.year !== null) rows.push({ label: 'Year', value: formatDate(caseStudy.year) });
  if (caseStudy.role !== null) rows.push({ label: 'Role', value: caseStudy.role });
  rows.push({ label: 'Category', value: caseStudy.category });
  rows.push({
    label: 'Technologies',
    value: caseStudy.technologies.map((t) => t.name).join(', '),
  });

  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="facts-heading" className="flex flex-col gap-2">
      <h2 id="facts-heading" className="text-title font-medium text-text">
        At a glance
      </h2>
      <MetadataList label="Case study details">
        {rows.map((row) => (
          <Metadata key={row.label} label={row.label} value={row.value} />
        ))}
      </MetadataList>
    </section>
  );
}

/**
 * The destinations the case study declares.
 *
 * Both the live destination and the source leave the site, so both open in a new
 * browsing context and both say that they do. A destination with no address would
 * be omitted rather than rendered as an empty link.
 */
function Destinations({ caseStudy }: { caseStudy: CaseStudy }) {
  const destinations: { label: string; href: string }[] = [
    { label: 'Live site', href: caseStudy.liveUrl },
    { label: 'Source', href: caseStudy.githubUrl },
  ].filter((destination) => destination.href !== '');

  if (destinations.length === 0) return null;

  return (
    <section aria-labelledby="destinations-heading" className="flex flex-col gap-2">
      <h2 id="destinations-heading" className="text-title font-medium text-text">
        Where to see it
      </h2>
      <div className="flex flex-wrap gap-3">
        {destinations.map((destination) => (
          <Button
            key={destination.href}
            variant="secondary"
            size="sm"
            href={destination.href}
            external
          >
            {destination.label}
          </Button>
        ))}
      </div>
    </section>
  );
}

/**
 * The records that declare a relationship to this case study.
 *
 * Derived from those records rather than declared here, so the relationship is
 * written once. Each links to the landing-page section it appears on, which is
 * where that record is presented today.
 */
function Related({ caseStudy }: { caseStudy: CaseStudy }) {
  const hasRelated = caseStudy.certifications.length > 0 || caseStudy.experiences.length > 0;
  if (!hasRelated) return null;

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <h2 id="related-heading" className="text-title font-medium text-text">
        Related records
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {caseStudy.certifications.length > 0 ? (
          <Card labelledBy="related-certifications">
            <CardHeader>
              <CardTitle id="related-certifications" level={3}>
                Certifications
              </CardTitle>
              <CardDescription>
                Credentials that record a relationship to this case study.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {caseStudy.certifications.map((certification) => (
                  <li key={certification.title} className="text-small text-text-secondary">
                    {certification.title}
                    <span className="block font-mono text-label text-text-muted">
                      {certification.issuer} &middot; acquired{' '}
                      {formatDate(certification.acquiredOn)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {caseStudy.experiences.length > 0 ? (
          <Card labelledBy="related-experience">
            <CardHeader>
              <CardTitle id="related-experience" level={3}>
                Experience
              </CardTitle>
              <CardDescription>
                Roles that record a relationship to this case study.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {caseStudy.experiences.map((experience) => (
                  <li key={experience.title + experience.source.line} className="text-small text-text-secondary">
                    {experience.title}
                    <span className="block font-mono text-label text-text-muted">
                      {experience.organization} &middot;{' '}
                      {formatDateRange(experience.startDate, experience.endDate)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}