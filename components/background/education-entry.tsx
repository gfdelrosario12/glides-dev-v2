import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata, MetadataList } from '@/components/ui/metadata';
import { TokenChipList } from '@/components/sections/chip';

/**
 * One record of study, presented as a record.
 *
 * Composed from the same `Card` and `Metadata` primitives the landing page's
 * education cards use, so a study record reads identically on both pages and there
 * is one presentation of a qualification rather than two. Period and location go
 * through `Metadata`, which is what puts them in the mono data face — they are
 * machine-facing facts and would otherwise compete with the detail for attention.
 *
 * The credential level is presented where the record declares one and omitted
 * where it does not. One recorded record states a strand rather than a degree, and
 * printing a level for it would assert a qualification the content does not claim.
 *
 * `detail` is transcribed as written. It is the owner's account of what they did
 * while studying — a thesis, a research study — and it is the reason this is a
 * timeline of study rather than a list of credentials.
 */

export interface EducationEntryProps {
  readonly titleId: string;
  readonly title: string;
  readonly institution: string;
  /** The declared span, already formatted at the precision each date was written. */
  readonly period: string;
  /** The credential level, or null when the record states a strand instead. */
  readonly degree: string | null;
  readonly location: string;
  /** The disciplines of study, one entry each. Empty renders no region. */
  readonly field: readonly string[];
  readonly detail: string;
}

export function EducationEntry({
  titleId,
  title,
  institution,
  period,
  degree,
  location,
  field,
  detail,
}: EducationEntryProps) {
  return (
    <Card labelledBy={titleId}>
      <CardHeader>
        <CardTitle id={titleId} level={3}>
          {title}
        </CardTitle>
        <CardDescription>{institution}</CardDescription>
      </CardHeader>

      <CardContent>
        <MetadataList label={`${title} details`}>
          <Metadata label="Period" value={period} />
          {/* No `emptyLabel` stand-in: the row is omitted rather than rendered
              with "Not recorded" in the value position. */}
          {degree !== null ? <Metadata label="Credential" value={degree} /> : null}
          <Metadata label="Location" value={location} />
        </MetadataList>

        <p className="text-small text-text-secondary">{detail}</p>

        {field.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Fields of study
            </p>
            <TokenChipList labels={field} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}