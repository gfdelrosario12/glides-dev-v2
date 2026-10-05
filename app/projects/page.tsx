import type { Metadata as NextMetadata } from 'next';

import { ArchiveToolbar } from '@/components/archive/archive-toolbar';
import { CaseStudyCard } from '@/components/archive/case-study-card';
import { ARCHIVE_PATH, ARCHIVE_VOCABULARY, archiveFor } from '@/lib/content/derive';
import { hasActiveSelection, parseArchiveQuery } from '@/lib/content/archive';
import { CONTENT_GUTTER, SECTION_RHYTHM } from '@/lib/layout';

/**
 * The case-studies archive.
 *
 * A Server Component, and the application's first request-time route. It reads
 * `searchParams` to learn which filters and ordering the visitor asked for, and
 * the response it returns already contains the final card set — there is no
 * client component here to fetch anything afterwards, and nothing from the
 * content model is serialised into the client bundle. That is also why the
 * filters are links rather than toggles: this page can be entirely
 * server-rendered and still have working filters.
 *
 * `searchParams` is awaited because it is a Promise in this Next version, and
 * reading it is what opts the page into dynamic rendering. The cost is one
 * render per filter click; the benefit is that a filtered archive is a URL,
 * which is shareable, survives a reload, and works with the back button.
 *
 * The route adds no shell of its own — skip link, header, `main`, and footer all
 * come from `PageShell` in the root layout — so the document holds exactly one
 * banner, one main region, and one contentinfo.
 *
 * Only published case studies are ever considered. `archiveFor` reads the one
 * derived answer to "what exists on this site", so the archive cannot offer a
 * draft that the case-study route would refuse to serve.
 */

/** No figure in the title: the count is derived and belongs on the page. */
export const metadata: NextMetadata = {
  title: 'Case studies',
  description:
    'Every published case study, with the technologies each was built from and the address of its own page.',
};

/**
 * The page's search parameters, as Next.js hands them to a page component.
 *
 * Matches the type `page.md` documents for the prop. Values are always checked
 * against the declared vocabulary before use, so an unrecognised one is dropped
 * rather than reaching a comparison.
 */
interface CaseStudiesArchiveProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CaseStudiesArchivePage({
  searchParams,
}: CaseStudiesArchiveProps) {
  const params = await searchParams;
  const selection = parseArchiveQuery(params, ARCHIVE_VOCABULARY);
  const archive = archiveFor(selection, ARCHIVE_PATH);

  const nothingPublished = archive.count === 0 && !hasActiveSelection(selection);

  return (
    <article className={`py-12 ${CONTENT_GUTTER}`}>
      <div className={`mx-auto flex max-w-wide flex-col gap-8 ${SECTION_RHYTHM}`}>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Case studies
          </p>
          <h1 className="text-title font-medium text-text">Every published case study</h1>
          <p className="max-w-prose text-body text-text-secondary">
            {nothingPublished
              ? 'No case studies are published yet.'
              : `${archive.count} ${archive.count === 1 ? 'case study' : 'case studies'}${
                  hasActiveSelection(selection)
                    ? ' match the current filters'
                    : ', each with its own page and the technologies it was built from'
                }.`}
          </p>
        </div>

        {/* The toolbar is omitted entirely when there is nothing to filter, so an
            archive of no records offers no controls that would only narrow
            nothing. */}
        {!nothingPublished ? (
          <ArchiveToolbar
            basePath={ARCHIVE_PATH}
            facets={archive.facets}
            sorts={archive.sorts}
            selection={selection}
            activeSort={selection.sort}
            isFiltered={hasActiveSelection(selection)}
          />
        ) : null}

        {archive.empty ? (
          <p className="max-w-prose text-body text-text-secondary">
            {nothingPublished
              ? 'There is nothing to list.'
              : 'No case study matches these filters. Clear them to see them all.'}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.caseStudies.map((caseStudy) => (
              <li key={caseStudy.slug} className="min-w-0">
                <CaseStudyCard caseStudy={caseStudy} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}