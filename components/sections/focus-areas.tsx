import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChipList } from './chip';
import type { FocusAreaEvidence } from '@/lib/content/derive';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * The focus areas.
 *
 * Receives its evidence as a prop. The section knows how to lay out a count and
 * a list of signals; it has no idea what any of them come from, and it holds no
 * number of its own.
 *
 * A count of zero is omitted entirely rather than rendered as a zero. An area
 * with no recorded evidence should read as unevidenced, not as a claim of
 * nothing — and printing `0` next to a summary would assert a conclusion the
 * content does not support.
 */
export function FocusAreas({ focusAreas }: { focusAreas: readonly FocusAreaEvidence[] }) {
  return (
    <section
      id={SECTION_IDS.focusAreas}
      aria-labelledby="focus-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 id="focus-heading" className="text-title font-medium text-text">
          Focus
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          Each area is stated with the records that back it. The count is of
          distinct records, so one record evidencing two signals in the same area
          is still one record.
        </p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-3">
        {focusAreas.map((area) => {
          const titleId = `focus-${area.id}`;

          return (
            <li key={area.id} className="min-w-0">
              <Card labelledBy={titleId}>
                <CardHeader>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <CardTitle id={titleId} level={3}>
                      {area.label}
                    </CardTitle>
                    {area.count > 0 ? (
                      <p className="font-mono text-small text-accent">
                        {area.count} {area.count === 1 ? 'record' : 'records'}
                      </p>
                    ) : null}
                  </div>
                  <CardDescription>{area.summary}</CardDescription>
                </CardHeader>

                {area.signals.length > 0 ? (
                  <CardContent>
                    <TokenChipList labels={area.signals.map((signal) => signal.label)} />
                  </CardContent>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}