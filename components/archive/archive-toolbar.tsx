import Link from 'next/link';

import { ARCHIVE_SORT_LABELS } from '@/lib/content/archive';
import type { ArchiveSelection, ArchiveSortKey } from '@/lib/content/archive';
import { archiveHref } from '@/lib/content/archive';

import { FilterGroup } from './filter-group';
import type { ArchiveFacetGroup } from '@/lib/content/archive';

/**
 * The archive's controls: both filter axes and the ordering.
 *
 * Every control is a link carrying the state a visitor is asking for, so the
 * whole toolbar works before any script runs and the filtered archive is a URL
 * they can share. Nothing is held in component state, which is why this file
 * needs no client boundary.
 *
 * The ordering list is the one the content can support: a date ordering is
 * offered only once a case study records a year, so a visitor is never shown a
 * control that would order the archive by a field nothing carries.
 */
export interface ArchiveToolbarProps {
  readonly basePath: string;
  readonly facets: readonly ArchiveFacetGroup[];
  readonly sorts: readonly ArchiveSortKey[];
  /** The current selection, so changing the ordering keeps the filters. */
  readonly selection: ArchiveSelection;
  readonly activeSort: ArchiveSortKey;
  /** Omitted when no ordering other than the default is selected. */
  readonly isFiltered: boolean;
}

export function ArchiveToolbar({
  basePath,
  facets,
  sorts,
  selection,
  activeSort,
  isFiltered,
}: ArchiveToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-6">
        {facets.map((group) => (
          <FilterGroup key={group.param} group={group} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3
          id="archive-sort-heading"
          className="font-mono text-label uppercase tracking-[0.06em] text-text-muted"
        >
          Order
        </h3>
        <ul aria-labelledby="archive-sort-heading" className="flex flex-wrap gap-2">
          {sorts.map((key) => {
            const selected = key === activeSort;
            return (
              <li key={key}>
                <Link
                  href={archiveHref(basePath, selection, { sort: key })}
                  aria-current={selected ? 'true' : undefined}
                  className={
                    selected
                      ? 'inline-flex items-center gap-2 rounded-xs border border-accent bg-accent-subtle px-2 py-0.5 font-mono text-label text-accent'
                      : 'inline-flex items-center gap-2 rounded-xs border border-border-strong bg-surface-inset px-2 py-0.5 font-mono text-label text-text-secondary hover:text-text'
                  }
                >
                  {selected ? (
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-xs bg-accent" />
                  ) : null}
                  {ARCHIVE_SORT_LABELS[key]}
                </Link>
              </li>
            );
          })}
        </ul>

        {isFiltered ? (
          <Link
            href={basePath}
            className="font-mono text-label uppercase tracking-[0.06em] text-text-secondary hover:text-text"
          >
            Clear filters
          </Link>
        ) : null}
      </div>
    </div>
  );
}