/**
 * The case-studies archive's view logic.
 *
 * Filtering, ordering, and the filter option sets, as pure functions over
 * already-published records. Nothing here reads a file, a URL, or a framework,
 * and nothing here knows what a category or a domain *means* — the vocabulary
 * arrives as an argument from `derive.ts`, which is the only module that names
 * the declared sets. Two consequences follow, and both are the point:
 *
 * - The declared vocabulary stays in one place. `CASE_STUDY_DOMAINS` and
 *   `PROJECT_CATEGORIES` are declared in `schema.ts` and reach this file as
 *   data, so a surface cannot quietly grow a second copy of either list.
 * - This module is loadable on its own. Its only import is type-only, so a test
 *   can exercise the orderings and the query parser directly rather than
 *   standing up the whole content model to check that a sort puts unfeatured
 *   work last.
 *
 * The state a visitor controls lives in the query string, not in memory: an
 * `ArchiveSelection` is derived from the parameters of a request and the
 * response is already final. That is why there is no store here and no way for
 * the grid and the figure above it to be computed from different records —
 * `applyArchiveView` returns both from one pass.
 */

import type { CaseStudy } from './model';

/* ------------------------------------------------------------------ *
 * Vocabulary
 * ------------------------------------------------------------------ */

/** Which axis a filter narrows. */
export type ArchiveFilterParam = 'category' | 'domain';

export const ARCHIVE_FILTER_PARAMS: readonly ArchiveFilterParam[] = ['category', 'domain'];

/**
 * One filterable axis of a case study.
 *
 * Declared by the caller rather than built here because the values of a
 * `category` and the values of a `domain` come from different fields, and
 * hardcoding either here would be a second declaration of a content set.
 */
export interface ArchiveAxis {
  /** Query parameter this axis is filtered by. */
  readonly param: ArchiveFilterParam;
  /** Heading for the group of controls. */
  readonly label: string;
  /** Every value the axis may hold, as the content model declares it. */
  readonly permitted: readonly string[];
  /** How one declared value is written for a visitor. */
  readonly labelOf: (value: string) => string;
  /** The values one case study declares on this axis. */
  readonly valuesOf: (caseStudy: CaseStudy) => readonly string[];
}

export interface ArchiveVocabulary {
  readonly axes: readonly ArchiveAxis[];
}

/* ------------------------------------------------------------------ *
 * Selection
 * ------------------------------------------------------------------ */

/** How the archive may be ordered. */
export type ArchiveSortKey = 'featured' | 'title' | 'technology-count' | 'year';

/**
 * Every ordering, in the order the control offers them.
 *
 * `featured` is first because it is the selection the content already makes,
 * and `year` is last because it only appears once the content records a year.
 */
export const ARCHIVE_SORT_KEYS: readonly ArchiveSortKey[] = [
  'featured',
  'title',
  'technology-count',
  'year',
];

export const ARCHIVE_SORT_LABELS: Readonly<Record<ArchiveSortKey, string>> = {
  featured: 'Featured first',
  title: 'Title A–Z',
  'technology-count': 'Most technologies',
  year: 'Most recent',
};

export interface ArchiveSelection {
  readonly categories: readonly string[];
  readonly domains: readonly string[];
  readonly sort: ArchiveSortKey;
}

/**
 * Query parameter name to the selection field it fills.
 *
 * Written out rather than indexed directly because the parameter is singular and
 * the field is plural, and the mapping between them is a fact worth stating once
 * instead of at each of the four places that need it.
 */
const SELECTION_FIELD: Readonly<Record<ArchiveFilterParam, keyof ArchiveSelection>> = {
  category: 'categories',
  domain: 'domains',
};

/**
 * The archive as it is with no filter applied.
 *
 * `featured` rather than `title` because the landing page's selection is the
 * one the content declares, and an unfiltered archive that disagreed with it
 * would present the same work in a different order on the same site.
 */
export const DEFAULT_ARCHIVE_SELECTION: ArchiveSelection = Object.freeze({
  categories: Object.freeze([]) as readonly string[],
  domains: Object.freeze([]) as readonly string[],
  sort: 'featured',
});

/** Whether a selection differs from the unfiltered archive. */
export function hasActiveSelection(selection: ArchiveSelection): boolean {
  return (
    selection.categories.length > 0 ||
    selection.domains.length > 0 ||
    selection.sort !== DEFAULT_ARCHIVE_SELECTION.sort
  );
}

/* ------------------------------------------------------------------ *
 * Parsing the query string
 * ------------------------------------------------------------------ */

/** Query parameters as Next.js hands them to a page. */
export type ArchiveQueryParams = Readonly<Record<string, string | string[] | undefined>>;

/**
 * Read a selection out of a query string.
 *
 * Every value is checked against the axis that owns it and dropped when it is
 * not declared, and an unrecognised parameter is ignored. A mistyped link, a
 * stale bookmark, or a crawler probing the route therefore renders the archive
 * rather than a 500: no value from the URL reaches a comparison unchecked, so
 * there is no code path where an unsanitised string is compared against
 * anything.
 */
export function parseArchiveQuery(
  params: ArchiveQueryParams,
  vocabulary: ArchiveVocabulary,
): ArchiveSelection {
  const selected: Record<ArchiveFilterParam, string[]> = { category: [], domain: [] };

  for (const axis of vocabulary.axes) {
    const permitted = new Set(axis.permitted);
    // Deduplicated because a repeated parameter is one selection, and rendering
    // the same chip twice would read as two options that mean the same thing.
    const chosen = new Set<string>();
    for (const value of asArray(params[axis.param])) {
      if (permitted.has(value)) chosen.add(value);
    }
    selected[axis.param] = [...chosen];
  }

  const sort = asArray(params['sort'])[0];
  return {
    categories: selected.category,
    domains: selected.domain,
    sort: ARCHIVE_SORT_KEYS.includes(sort as ArchiveSortKey)
      ? (sort as ArchiveSortKey)
      : DEFAULT_ARCHIVE_SELECTION.sort,
  };
}

function asArray(value: string | string[] | undefined): readonly string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).filter((entry) => entry !== '');
}

/* ------------------------------------------------------------------ *
 * Building the query string
 * ------------------------------------------------------------------ */

export interface ArchiveHrefPatch {
  /** Add this value to its axis, or remove it when it is already selected. */
  readonly toggle?: { readonly param: ArchiveFilterParam; readonly value: string };
  /** Empty one axis, leaving the others alone. */
  readonly clear?: ArchiveFilterParam;
  /** Order by this instead. */
  readonly sort?: ArchiveSortKey;
}

/**
 * The archive's address for a given state.
 *
 * Deterministic parameter order, so the same state always produces the same
 * href and a link rendered twice on a page is recognisably the same link.
 */
export function archiveHref(
  basePath: string,
  selection: ArchiveSelection,
  patch?: ArchiveHrefPatch,
): string {
  let categories = [...selection.categories];
  let domains = [...selection.domains];
  let sort = selection.sort;

  // Narrowed once, because a narrowed property does not survive into a closure.
  const { clear, toggle, sort: sortPatch } = patch ?? {};

  if (clear !== undefined) {
    if (clear === 'category') categories = [];
    else domains = [];
  }

  if (toggle !== undefined) {
    const current = toggle.param === 'category' ? categories : domains;
    const next = current.includes(toggle.value)
      ? current.filter((value) => value !== toggle.value)
      : [...current, toggle.value];
    if (toggle.param === 'category') categories = next;
    else domains = next;
  }

  if (sortPatch !== undefined) sort = sortPatch;

  const query = new URLSearchParams();
  // Sorted within each axis. The same set of selected values is one state
  // whichever order the visitor arrived in, so it must produce one address:
  // otherwise the same filter state yields two URLs, and a link rendered twice
  // on a page is not recognisably the same link.
  for (const value of [...categories].sort()) query.append('category', value);
  for (const value of [...domains].sort()) query.append('domain', value);
  if (sort !== DEFAULT_ARCHIVE_SELECTION.sort) query.set('sort', sort);

  const encoded = query.toString();
  return encoded === '' ? basePath : `${basePath}?${encoded}`;
}

/* ------------------------------------------------------------------ *
 * Ordering
 * ------------------------------------------------------------------ */

/** Records with no declared year sort after those with one, not among them. */
function byYear(a: CaseStudy, b: CaseStudy): number {
  if (a.year === null && b.year === null) return byTitle(a, b);
  if (a.year === null) return 1;
  if (b.year === null) return -1;
  return b.year.iso.localeCompare(a.year.iso) || byTitle(a, b);
}

/**
 * Alphabetical, tiebroken on slug.
 *
 * The tiebreak is not cosmetic: two records may legitimately share a title, and
 * without a total order their relative sequence depends on the order they
 * happened to be read in, which changes when an unrelated record is added.
 */
function byTitle(a: CaseStudy, b: CaseStudy): number {
  return a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug);
}

/**
 * Declared featured marker ascending, unfeatured last.
 *
 * A null marker sorts after every real one rather than as zero. Treating it as
 * zero would make an unfeatured case study outrank one the owner explicitly
 * placed second, which inverts the selection the content made.
 */
function byFeatured(a: CaseStudy, b: CaseStudy): number {
  if (a.featured === null && b.featured === null) return byTitle(a, b);
  if (a.featured === null) return 1;
  if (b.featured === null) return -1;
  return a.featured - b.featured || byTitle(a, b);
}

function byTechnologyCount(a: CaseStudy, b: CaseStudy): number {
  return b.technologies.length - a.technologies.length || byTitle(a, b);
}

const ORDERINGS: Readonly<Record<ArchiveSortKey, (a: CaseStudy, b: CaseStudy) => number>> = {
  featured: byFeatured,
  title: byTitle,
  'technology-count': byTechnologyCount,
  year: byYear,
};

/**
 * Whether an ordering by date can say anything.
 *
 * False while no published case study records a year. Offering the ordering
 * anyway would order the whole archive by an absent field, which is an ordering
 * that looks available and carries no information.
 */
export function dateOrderingAvailable(caseStudies: readonly CaseStudy[]): boolean {
  return caseStudies.some((caseStudy) => caseStudy.year !== null);
}

/* ------------------------------------------------------------------ *
 * Applying the view
 * ------------------------------------------------------------------ */

export interface ArchiveView {
  /** Exactly the records the grid renders. */
  readonly caseStudies: readonly CaseStudy[];
  /**
   * How many they are.
   *
   * Returned by the same pass that selects them, so the figure above the grid
   * and the grid cannot describe different populations.
   */
  readonly count: number;
  /** True when the selection excluded everything. */
  readonly empty: boolean;
}

/**
 * Narrow and order the published records.
 *
 * Values within one axis are a union: a case study matching either is kept.
 * Separate axes intersect: a case study must satisfy every active axis to
 * survive, which is what makes two filter groups mean something together rather
 * than one overriding the other.
 */
export function applyArchiveView(
  caseStudies: readonly CaseStudy[],
  selection: ArchiveSelection,
  vocabulary: ArchiveVocabulary,
): ArchiveView {
  const order = ORDERINGS[selection.sort];

  const matched = caseStudies.filter((caseStudy) =>
    vocabulary.axes.every((axis) => {
      const chosen = selection[SELECTION_FIELD[axis.param]] as readonly string[];
      if (chosen.length === 0) return true;
      const declared = axis.valuesOf(caseStudy);
      return chosen.some((value) => declared.includes(value));
    }),
  );

  // `toSorted` rather than `sort` so the derivation cannot reorder the frozen
  // array the content model handed out.
  const ordered = order === undefined ? matched : matched.toSorted(order);

  return { caseStudies: ordered, count: ordered.length, empty: ordered.length === 0 };
}

/* ------------------------------------------------------------------ *
 * Filter options
 * ------------------------------------------------------------------ */

export interface ArchiveOption {
  readonly value: string;
  readonly label: string;
  /** How many published case studies declare this value. */
  readonly count: number;
  readonly href: string;
  readonly selected: boolean;
}

export interface ArchiveFacetGroup {
  readonly param: ArchiveFilterParam;
  readonly label: string;
  readonly options: readonly ArchiveOption[];
}

export interface ArchiveFacetSelection {
  readonly basePath: string;
  readonly selection: ArchiveSelection;
  /** The published records the options are counted from. */
  readonly caseStudies: readonly CaseStudy[];
  readonly vocabulary: ArchiveVocabulary;
}

/**
 * The filter options, derived from the records rather than from the declared set.
 *
 * A value no published case study carries is not offered. The declared set
 * answers "what may the owner say"; a visitor needs "what can I filter by", and
 * an option that always yields nothing reads as a broken control rather than as
 * an unused category.
 *
 * Every count is of published records, so a figure cannot name work the archive
 * will not show. A record declaring the same value twice on one axis is counted
 * once, because a count is of records and not of the tokens a record carries.
 */
export function deriveArchiveFacets({
  basePath,
  selection,
  caseStudies,
  vocabulary,
}: ArchiveFacetSelection): readonly ArchiveFacetGroup[] {
  return vocabulary.axes.map((axis) => {
    const declared = new Set(axis.permitted);

    const counts = new Map<string, number>();
    for (const caseStudy of caseStudies) {
      for (const value of new Set(axis.valuesOf(caseStudy))) {
        if (!declared.has(value)) continue;
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    return {
      param: axis.param,
      label: axis.label,
      options: [...counts.entries()]
        .filter(([, count]) => count > 0)
        .map(([value, count]) => ({
          value,
          label: axis.labelOf(value),
          count,
          href: archiveHref(basePath, selection, { toggle: { param: axis.param, value } }),
          selected: (selection[SELECTION_FIELD[axis.param]] as readonly string[]).includes(value),
        })),
    };
  });
}