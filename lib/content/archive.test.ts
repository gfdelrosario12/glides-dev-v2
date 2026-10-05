import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  applyArchiveView,
  archiveHref,
  dateOrderingAvailable,
  deriveArchiveFacets,
  hasActiveSelection,
  parseArchiveQuery,
} from './archive.ts';
import type { ArchiveSelection, ArchiveVocabulary } from './archive.ts';
import type { CaseStudy } from './model.ts';

/**
 * Archive view tests.
 *
 * Run with `node --test lib/content/archive.test.ts`. This module's only import
 * is type-only, so it loads without the content model — which is the point:
 * these cases are about how a selection narrows and orders records, and
 * standing up the CSV files to check that an unfeatured record sorts last would
 * make the ordering rules much harder to see.
 *
 * The vocabulary is built here rather than imported so the cases can use a
 * vocabulary that is deliberately unlike the real one: domains that no record
 * carries, categories that only one record carries, and a `year` ordering that
 * is unavailable. The real sets are declared in `schema.ts` and named by
 * `derive.ts`.
 */

const DOMAIN_LABELS: Readonly<Record<string, string>> = {
  infrastructure: 'Infrastructure',
  cloud: 'Cloud',
  devops: 'DevOps',
  software: 'Software',
  iot: 'IoT',
};

const VOCABULARY: ArchiveVocabulary = {
  axes: [
    {
      param: 'category',
      label: 'Category',
      permitted: ['Academic', 'Freelance', 'Personal'],
      labelOf: (value) => value,
      valuesOf: (caseStudy) => [caseStudy.category],
    },
    {
      param: 'domain',
      label: 'Domain',
      permitted: ['infrastructure', 'cloud', 'devops', 'software', 'iot'],
      labelOf: (value) => DOMAIN_LABELS[value] ?? value,
      valuesOf: (caseStudy) => caseStudy.domains as readonly string[],
    },
  ],
};

const NO_YEAR = null;
const YEAR = { iso: '2024-03-01', year: 2024, month: 3, day: 1, precision: 'day' } as const;

function caseStudy(
  slug: string,
  title: string,
  category: string,
  domains: readonly string[],
  featured: number | null,
  technologyCount: number,
  year: typeof YEAR | null = NO_YEAR,
): CaseStudy {
  return {
    slug,
    title,
    description: `${title} description.`,
    category,
    domains,
    featured,
    technologies: Array.from({ length: technologyCount }, (_, i) => ({
      key: `tech-${i}`,
      name: `Tech ${i}`,
      category: 'library',
      aliases: [],
      source: { file: 'technologies.csv', line: 1, id: `Tech ${i}` },
    })),
    year,
  } as unknown as CaseStudy;
}

/** Two featured, one unfeatured, and one dated — enough to tell rules apart. */
const CASE_STUDIES: readonly CaseStudy[] = [
  caseStudy('etapon', 'eTapon', 'Academic', ['iot'], 2, 3),
  caseStudy('guardian', 'Guardian Vision', 'Freelance', ['iot', 'cloud'], 1, 10),
  caseStudy('asteria', 'Asteria Academy', 'Personal', ['software'], null, 5),
  caseStudy('caremax', 'Care Max', 'Academic', ['software'], null, 2),
];

/** Every case study, with none recording a year. */
const UNDATED = CASE_STUDIES;

const select = (params: Record<string, string | string[]> = {}): ArchiveSelection =>
  parseArchiveQuery(params, VOCABULARY);

const slugs = (params: Record<string, string | string[]> = {}): readonly string[] =>
  applyArchiveView(CASE_STUDIES, select(params), VOCABULARY).caseStudies.map((c) => c.slug);

describe('parsing the query string', () => {
  it('reads a permitted value', () => {
    assert.deepEqual(select({ category: 'Freelance' }).categories, ['Freelance']);
  });

  it('reads several values in one group', () => {
    assert.deepEqual(select({ category: ['Academic', 'Personal'] }).categories, [
      'Academic',
      'Personal',
    ]);
  });

  it('accepts a single value sent as a string rather than an array', () => {
    assert.deepEqual(select({ domain: 'iot' }).domains, ['iot']);
  });

  it('drops a value outside the permitted set', () => {
    assert.deepEqual(select({ category: 'Nonexistent' }).categories, []);
  });

  it('keeps the permitted values and drops the rest of a mixed group', () => {
    assert.deepEqual(select({ category: ['Academic', 'Nonexistent'] }).categories, ['Academic']);
  });

  it('deduplicates a repeated value', () => {
    assert.deepEqual(select({ category: ['Academic', 'Academic'] }).categories, ['Academic']);
  });

  it('ignores a parameter it does not own', () => {
    const parsed = select({ nonsense: 'x', category: 'Academic' });
    assert.deepEqual(parsed.categories, ['Academic']);
    assert.equal('nonsense' in parsed, false);
  });

  it('falls back to the default ordering for one it does not offer', () => {
    assert.equal(select({ sort: 'bogus' }).sort, 'featured');
  });

  it('accepts each ordering it does offer', () => {
    for (const sort of ['title', 'featured', 'technology-count', 'year']) {
      assert.equal(select({ sort }).sort, sort);
    }
  });

  it('reports no active selection for the bare archive', () => {
    assert.equal(hasActiveSelection(select()), false);
  });

  it('reports an active selection once a filter is chosen', () => {
    assert.equal(hasActiveSelection(select({ category: 'Academic' })), true);
  });

  it('reports an active selection once a non-default ordering is chosen', () => {
    assert.equal(hasActiveSelection(select({ sort: 'title' })), true);
  });
});

describe('narrowing', () => {
  it('returns every published record with no filter', () => {
    assert.deepEqual(slugs(), ['guardian', 'etapon', 'asteria', 'caremax']);
  });

  it('narrows to one category', () => {
    assert.deepEqual(slugs({ category: 'Academic' }), ['etapon', 'caremax']);
  });

  it('treats several values in one group as a union', () => {
    assert.deepEqual(slugs({ category: ['Freelance', 'Personal'] }), [
      'guardian',
      'asteria',
    ]);
  });

  it('narrows by domain', () => {
    assert.deepEqual(slugs({ domain: 'cloud' }), ['guardian']);
  });

  it('treats a record declaring both selected domains as matching once', () => {
    assert.deepEqual(slugs({ domain: ['iot', 'cloud'] }), ['guardian', 'etapon']);
  });

  it('intersects two groups', () => {
    assert.deepEqual(slugs({ category: 'Academic', domain: 'software' }), ['caremax']);
  });

  it('reports an empty result as empty', () => {
    const view = applyArchiveView(CASE_STUDIES, select({ category: 'Personal', domain: 'iot' }), VOCABULARY);
    assert.equal(view.count, 0);
    assert.equal(view.empty, true);
  });

  it('counts exactly what it returns', () => {
    const view = applyArchiveView(CASE_STUDIES, select({ category: 'Academic' }), VOCABULARY);
    assert.equal(view.count, view.caseStudies.length);
    assert.equal(view.count, 2);
  });

  it('does not reorder the records it was given', () => {
    const before = CASE_STUDIES.map((c) => c.slug);
    applyArchiveView(CASE_STUDIES, select({ sort: 'title' }), VOCABULARY);
    assert.deepEqual(CASE_STUDIES.map((c) => c.slug), before);
  });
});

describe('ordering', () => {
  it('puts the declared featured marker first, in its declared order', () => {
    assert.deepEqual(slugs({ sort: 'featured' }), ['guardian', 'etapon', 'asteria', 'caremax']);
  });

  it('puts unfeatured records last rather than treating no marker as zero', () => {
    const ordered = slugs({ sort: 'featured' });
    const unfeatured = ordered.filter((slug) => slug === 'asteria' || slug === 'caremax');
    assert.deepEqual(unfeatured, ['asteria', 'caremax']);
    // `etapon` is featured with marker 2, so it outranks both unfeatured records
    // despite carrying the larger number.
    assert.ok(ordered.indexOf('etapon') < ordered.indexOf('asteria'));
  });

  it('orders alphabetically by title', () => {
    assert.deepEqual(slugs({ sort: 'title' }), ['asteria', 'caremax', 'etapon', 'guardian']);
  });

  it('orders by technology count, most first', () => {
    assert.deepEqual(slugs({ sort: 'technology-count' }), [
      'guardian',
      'asteria',
      'etapon',
      'caremax',
    ]);
  });

  it('breaks a technology-count tie by title, so the order is total', () => {
    const tied = [
      caseStudy('zebra', 'Zebra', 'Personal', ['cloud'], null, 3),
      caseStudy('apple', 'Apple', 'Personal', ['cloud'], null, 3),
    ];
    const view = applyArchiveView(
      tied,
      { categories: [], domains: [], sort: 'technology-count' },
      VOCABULARY,
    );
    assert.deepEqual(view.caseStudies.map((c) => c.slug), ['apple', 'zebra']);
  });

  it('keeps the filters applied while the ordering changes', () => {
    assert.deepEqual(slugs({ category: 'Academic', sort: 'title' }), ['caremax', 'etapon']);
  });
});

describe('the date ordering', () => {
  it('is unavailable while no record states a year', () => {
    assert.equal(dateOrderingAvailable(UNDATED), false);
  });

  it('becomes available as soon as one record states a year', () => {
    const dated = [...CASE_STUDIES, caseStudy('dated', 'Dated', 'Personal', ['cloud'], null, 1, YEAR)];
    assert.equal(dateOrderingAvailable(dated), true);
  });

  it('orders the most recent first', () => {
    const dated = [...CASE_STUDIES, caseStudy('dated', 'Dated', 'Personal', ['cloud'], null, 1, YEAR)];
    const view = applyArchiveView(dated, { categories: [], domains: [], sort: 'year' }, VOCABULARY);
    assert.equal(view.caseStudies[0]?.slug, 'dated');
  });

  it('places records with no year after those that state one', () => {
    const dated = [...CASE_STUDIES, caseStudy('dated', 'Dated', 'Personal', ['cloud'], null, 1, YEAR)];
    const view = applyArchiveView(dated, { categories: [], domains: [], sort: 'year' }, VOCABULARY);
    const ordered = view.caseStudies.map((c) => c.slug);
    assert.equal(ordered.indexOf('dated'), 0);
    assert.ok(ordered.indexOf('asteria') > 0);
  });
});

describe('building the archive address', () => {
  it('is the bare path with nothing selected', () => {
    assert.equal(archiveHref('/projects', select()), '/projects');
  });

  it('carries the active filters and ordering', () => {
    const href = archiveHref('/projects', select({ category: 'Academic', sort: 'title' }));
    assert.equal(href, '/projects?category=Academic&sort=title');
  });

  it('omits the ordering when it is the default', () => {
    assert.equal(archiveHref('/projects', select({ category: 'Academic' })), '/projects?category=Academic');
  });

  it('adds a value when toggled on, preserving the other group', () => {
    const href = archiveHref('/projects', select({ category: 'Academic' }), {
      toggle: { param: 'domain', value: 'iot' },
    });
    assert.equal(href, '/projects?category=Academic&domain=iot');
  });

  it('removes a value when toggled off, preserving the other group', () => {
    const href = archiveHref('/projects', select({ category: 'Academic', domain: 'iot' }), {
      toggle: { param: 'category', value: 'Academic' },
    });
    assert.equal(href, '/projects?domain=iot');
  });

  it('clears one group without touching the other', () => {
    const href = archiveHref('/projects', select({ category: 'Academic', domain: 'iot', sort: 'title' }), {
      clear: 'domain',
    });
    assert.equal(href, '/projects?category=Academic&sort=title');
  });

  it('produces the same address for the same state', () => {
    const a = archiveHref('/projects', select({ domain: ['iot', 'cloud'] }));
    const b = archiveHref('/projects', select({ domain: ['cloud', 'iot'] }));
    assert.equal(a, b);
  });
});

describe('deriving the filter options', () => {
  const facets = (params: Record<string, string | string[]> = {}) =>
    deriveArchiveFacets({
      basePath: '/projects',
      selection: select(params),
      caseStudies: CASE_STUDIES,
      vocabulary: VOCABULARY,
    });

  it('counts the published records declaring each category', () => {
    const categories = facets().find((group) => group.param === 'category');
    assert.deepEqual(
      categories?.options.map((option) => [option.value, option.count]),
      [
        ['Academic', 2],
        ['Freelance', 1],
        ['Personal', 1],
      ],
    );
  });

  it('omits a value no published record carries', () => {
    const domains = facets().find((group) => group.param === 'domain');
    // `infrastructure` and `devops` are permitted but unused, so they are absent
    // even though the taxonomy declares them.
    assert.deepEqual(
      domains?.options.map((option) => option.value).sort(),
      ['cloud', 'iot', 'software'],
    );
  });

  it('counts a record declaring two domains once in each', () => {
    const domains = facets().find((group) => group.param === 'domain');
    assert.deepEqual(
      domains?.options.map((option) => [option.value, option.count]),
      [
        ['iot', 2],
        ['cloud', 1],
        ['software', 2],
      ],
    );
  });

  it('labels a domain for a visitor rather than showing its slug', () => {
    const domains = facets().find((group) => group.param === 'domain');
    assert.deepEqual(domains?.options.map((option) => option.label), ['IoT', 'Cloud', 'Software']);
  });

  it('marks the selected option and links the others', () => {
    const domains = facets({ domain: 'iot' }).find((group) => group.param === 'domain');
    const iot = domains?.options.find((option) => option.value === 'iot');
    const cloud = domains?.options.find((option) => option.value === 'cloud');
    assert.equal(iot?.selected, true);
    assert.equal(cloud?.selected, false);
    assert.equal(cloud?.href, '/projects?domain=cloud&domain=iot');
    assert.equal(iot?.href, '/projects');
  });

  it('names each group after the axis it filters', () => {
    assert.deepEqual(
      facets().map((group) => group.label),
      ['Category', 'Domain'],
    );
  });
});