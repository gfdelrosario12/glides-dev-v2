/**
 * An ordered list of timeline entries, each addressable by its own segment.
 *
 * A Server Component and purely presentational: it takes already-resolved display
 * values and imports nothing from `lib/content/`. That is what keeps the content
 * out of a client bundle, and it means the entry components can be read without
 * knowing where a record came from.
 *
 * The list is ordered by the caller and rendered in that order. This component
 * makes no attempt to sort, because the order is a declared property of the
 * content model rather than a presentation choice made here — re-sorting in the
 * view would give the page a second, divergent answer to "what order is this in".
 *
 * An empty source renders one sentence naming what is absent and no list. An empty
 * region would read as a page that failed to load rather than one with nothing
 * recorded yet.
 */

/** One entry's identity and the element that renders it. */
export interface TimelineEntry {
  /** The addressable segment declared on the record. Unique within the timeline. */
  readonly slug: string;
  readonly render: React.ReactNode;
}

export interface TimelineProps {
  /** The timeline's own accessible name, used for the empty state and the list. */
  readonly label: string;
  /** What the empty state says is absent, e.g. `content/education.csv`. */
  readonly emptySource: string;
  readonly entries: readonly TimelineEntry[];
}

export function Timeline({ label, emptySource, entries }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-body text-text-secondary">
        Nothing is recorded in <span className="font-mono text-small">{emptySource}</span> yet.
      </p>
    );
  }

  return (
    <ol aria-label={label} className="flex flex-col gap-4">
      {entries.map((entry) => (
        <li key={entry.slug} id={entry.slug} className="min-w-0 scroll-mt-16">
          {entry.render}
        </li>
      ))}
    </ol>
  );
}