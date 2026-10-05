import type { ArchiveFacetGroup } from '@/lib/content/archive';

import { FilterChip } from './filter-chip';

/**
 * One axis of the archive's filters.
 *
 * A group rather than a row of links, so a visitor is told what a control
 * selects before selecting it: the heading names the axis and each chip states
 * its own value and how many case studies match it.
 *
 * The heading is a real `<h3>` and the list carries that id, so the group is
 * reachable by heading navigation rather than only by tabbing through chips.
 */
export function FilterGroup({ group }: { group: ArchiveFacetGroup }) {
  const headingId = `archive-filter-${group.param}`;

  // No options means every value on this axis is unused by the published
  // records. The group is omitted rather than rendered empty: an empty group of
  // controls announces a choice that does not exist.
  if (group.options.length === 0) return null;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 id={headingId} className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
        {group.label}
      </h3>
      <ul aria-labelledby={headingId} className="flex flex-wrap gap-2">
        {group.options.map((option) => (
          <li key={option.value}>
            <FilterChip
              href={option.href}
              label={option.label}
              count={option.count}
              selected={option.selected}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}