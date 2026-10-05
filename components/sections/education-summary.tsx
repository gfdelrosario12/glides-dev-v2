import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Metadata, MetadataList } from '@/components/ui/metadata';
import { TokenChipList } from './chip';
import { CONTENT } from '@/lib/content/model';
import { formatDateRange } from '@/lib/content/date';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * Education summary.
 *
 * A pointer into the background timeline, not a second presentation of it. The
 * heading, the count, and three compact cards stay — they are the only education a
 * visitor sees without clicking, and the section is an anchor in
 * `NAVIGABLE_SECTIONS`. The detail paragraph does not: `/background` presents it,
 * and printing the same three records twice in two different arrangements is the
 * duplication the home-page spec forbids.
 *
 * Composed from the existing `Card` and `Metadata` primitives, the same ones the
 * timeline's own entries use, so a study record reads identically on both pages.
 * Period and location go through `Metadata`, which is what puts them in the mono
 * data face — they are machine-facing facts, and rendering them in the prose face
 * would make them compete with the summary for the reader's attention.
 */
export function EducationSummary() {
  const count = CONTENT.education.length;

  return (
    <section
      id={SECTION_IDS.education}
      aria-labelledby="education-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 id="education-heading" className="text-title font-medium text-text">
          Education
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          Computer engineering as a discipline, from secondary science through to a
          degree in progress.
        </p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-3">
        {CONTENT.education.map((record) => {
          const titleId = `education-title-${record.slug}`;

          return (
            <li key={record.source.file + record.source.line} className="min-w-0">
              <Card labelledBy={titleId}>
                <CardHeader>
                  <CardTitle id={titleId} level={3}>
                    {record.title}
                  </CardTitle>
                  <CardDescription>{record.institution}</CardDescription>
                </CardHeader>

                <CardContent>
                  <MetadataList label={`${record.title} details`}>
                    {/* Derived from the two declared dates at the precision each
                        was written, so the span reads the way the owner recorded
                        it rather than padded to a precision they did not claim. */}
                    <Metadata label="Period" value={formatDateRange(record.startDate, record.endDate)} />
                    {record.degree !== null ? (
                      <Metadata label="Degree" value={record.degree} />
                    ) : null}
                    <Metadata label="Location" value={record.location} />
                  </MetadataList>

                  {record.field.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {/* A label, not a heading: a heading would imply a
                          document section here and add three identical entries
                          to the page outline. */}
                      <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                        Focus
                      </p>
                      <TokenChipList labels={record.field} />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      {/* The full history is one click away, and this section lists no experience
          entry: adding a role must not change the landing page. */}
      <div className="flex flex-col gap-2">
        <p className="text-small text-text-secondary">
          {count === 1
            ? 'One record of study. The timeline carries what was done in each.'
            : `${count} records of study. The timeline carries what was done in each, and every recorded role.`}
        </p>
        <div>
          <Button href="/background" variant="secondary" size="sm">
            Full background
          </Button>
        </div>
      </div>
    </section>
  );
}