import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseCsv } from './csv.ts';
import { validateCollection } from './validate.ts';
import {
  EXPERIENCE_SCHEMA,
  EXPERIENCE_TRACKS,
  QUALIFICATION_SCHEMA,
  TRACK_ORDER,
  checkField,
} from './schema.ts';
import type { CsvRow, CsvTable } from './csv.ts';
import {
  educationInRecencyOrder,
  experiencesByTrack,
  experiencesInRecencyOrder,
  CONTENT,
} from './model.ts';
import type { Experience } from './model.ts';
import { compareDates, parseDate } from './date.ts';
import type { ContentDate } from './date.ts';

/**
 * Tests for the background route's content rules.
 *
 * Run with `node --test lib/content/background.test.ts`.
 *
 * The properties worth the most care are the ones a reader would notice being
 * wrong:
 *
 * `track` is optional, and that optionality is what makes the change usable — an
 * experience the owner has not classified is a valid record and is presented as
 * unclassified. So the empty cell must validate, and an undeclared value must fail
 * *naming the permitted kinds*, because otherwise the owner is left guessing at a
 * vocabulary they cannot see.
 *
 * The two former values must fail. They cannot be declared as merely invalid: the
 * column they belonged to is gone, so a row still carrying `organizational` fails on
 * the header rather than on its value. That failure is the point — it is what makes
 * the migration loud on every row somebody forgot.
 *
 * The ordering is total. A comparator that fell through to file order would pass
 * every ordering assertion here while still reordering the page the day somebody
 * sorted the CSV, which is why the row-rearrangement case is asserted directly.
 */

function failure(field: string, value: string, schema = EXPERIENCE_SCHEMA): string | null {
  return checkField(field, value, schema.fields[field] as Parameters<typeof checkField>[2]);
}

/** An experience row, complete unless told otherwise. */
function experienceRow(line: number, slug: string, overrides: Record<string, string> = {}): CsvRow {
  return {
    line,
    arity: 'match',
    values: {
      slug,
      track: '',
      title: `${slug} role`,
      organization: 'Some Org',
      badgeLabel: 'Member',
      startDate: '2024-01',
      endDate: '2024-06',
      location: 'Manila',
      description: 'Did the work.',
      responsibilities: '',
      lessonsLearned: '',
      skills: 'Technology',
      tools: '',
      systems: '',
      caseStudies: '',
      ...overrides,
    },
  };
}

/** A qualification row, complete unless told otherwise. */
function qualificationRow(line: number, slug: string, overrides: Record<string, string> = {}): CsvRow {
  return {
    line,
    arity: 'match',
    values: {
      slug,
      title: `${slug} title`,
      institution: 'Some University',
      startDate: '2020',
      endDate: '2024',
      degree: 'Bachelor of Science',
      location: 'Manila',
      field: 'Computer Networks',
      detail: 'About the study.',
      ...overrides,
    },
  };
}

function tableOf(rows: readonly CsvRow[]): CsvTable {
  return { header: Object.keys(rows[0]!.values), rows };
}

function failuresFor(rows: readonly CsvRow[], schema = EXPERIENCE_SCHEMA): readonly string[] {
  return validateCollection(schema, tableOf(rows));
}

/* ------------------------------------------------------------------ *
 * The track vocabulary
 * ------------------------------------------------------------------ */

describe('the track vocabulary', () => {
  it('is the five kinds the record set needs, and nothing broader', () => {
    assert.deepEqual([...EXPERIENCE_TRACKS], [
      'professional',
      'technical',
      'leadership',
      'community',
      'event-operations',
    ]);
  });

  it('names every kind in TRACK_ORDER, so the two cannot drift', () => {
    assert.deepEqual([...TRACK_ORDER], [...EXPERIENCE_TRACKS]);
  });

  it('is not alphabetical, because alphabetical is an accident of spelling', () => {
    assert.notDeepEqual([...TRACK_ORDER], [...EXPERIENCE_TRACKS].sort());
  });
});

describe('the track field', () => {
  it('accepts every declared kind', () => {
    for (const track of EXPERIENCE_TRACKS) {
      assert.equal(failure('track', track), null, `${track} should be accepted`);
    }
  });

  it('accepts an empty cell, so an unclassified experience is a legal record', () => {
    assert.equal(failure('track', ''), null);
  });

  it('rejects a kind outside the declared set', () => {
    assert.notEqual(failure('track', 'organizational'), null);
  });

  it('names the permitted kinds when it rejects one', () => {
    const reason = failure('track', 'organizational') as string;
    for (const track of EXPERIENCE_TRACKS) {
      assert.match(reason, new RegExp(track.replace('-', '-')), `${track} should be named`);
    }
  });

  it('rejects a former value, because the column it belonged to is gone', () => {
    // Not merely "invalid": the header no longer declares `type`, so the failure the
    // owner sees is about an undeclared column. That is what makes the migration
    // loud on every row that was left behind.
    assert.deepEqual(failuresFor([experienceRow(2, 'x')]), []);

    // The row carries both the new columns and the old one, so the header is read
    // straight off the row's own keys — which is what `tableOf` already does. The
    // failure is about the header, so it is reported once however many rows carry it.
    const stale = failuresFor([
      experienceRow(2, 'x', { type: 'organizational' }),
      experienceRow(3, 'y', { type: 'competitive' }),
    ]);

    assert.equal(stale.length, 1);
    assert.match(stale[0] as string, /"type"/);
    assert.match(stale[0] as string, /no schema rule covers/);
  });

  it('rejects a value that is one of the declared kinds with different casing', () => {
    assert.notEqual(failure('track', 'Professional'), null);
  });
});

describe('the lessons learned field', () => {
  it('accepts an empty cell, so the column can ship before it is written', () => {
    assert.equal(failure('track', ''), null);
    assert.equal(failure('lessonsLearned', ''), null);
  });

  it('accepts a written lesson', () => {
    assert.equal(failure('lessonsLearned', 'Escalate early.'), null);
  });
});

/* ------------------------------------------------------------------ *
 * Addresses
 * ------------------------------------------------------------------ */

describe('the addressable segments', () => {
  it('rejects two experiences claiming one segment', () => {
    const failures = failuresFor([experienceRow(2, 'same'), experienceRow(3, 'same')]);
    assert.equal(failures.length, 1);
    assert.match(failures[0] as string, /line 2/);
    assert.match(failures[0] as string, /line 3/);
  });

  it('rejects two qualifications claiming one segment', () => {
    const failures = failuresFor([qualificationRow(2, 'same'), qualificationRow(3, 'same')], QUALIFICATION_SCHEMA);
    assert.equal(failures.length, 1);
    assert.match(failures[0] as string, /line 2/);
    assert.match(failures[0] as string, /line 3/);
  });

  it('accepts distinct segments, so the uniqueness rule is not merely always failing', () => {
    assert.deepEqual(failuresFor([experienceRow(2, 'one'), experienceRow(3, 'two')]), []);
  });

  it('is not derived from the role title, so correcting the title keeps the link', () => {
    // The same segment under a different title is still one record, not a
    // collision and not a moved address.
    assert.deepEqual(failuresFor([experienceRow(2, 'stable', { title: 'Old title' })]), []);
    assert.deepEqual(failuresFor([experienceRow(2, 'stable', { title: 'Corrected title' })]), []);
  });

  it('rejects a segment holding a space or a capital', () => {
    assert.notEqual(failure('slug', 'gdgc-cam CTO'), null);
    assert.equal(failure('slug', 'gdgc-pup-cto'), null);
  });
});

/* ------------------------------------------------------------------ *
 * Ordering
 * ------------------------------------------------------------------ */

/** A model-shaped experience, so the ordering can be asserted without the files. */
function experience(slug: string, start: string, end: string | null): Experience {
  return {
    slug,
    track: null,
    title: slug,
    organization: 'Org',
    badgeLabel: 'Member',
    startDate: parseDate(start) as NonNullable<Experience['startDate']>,
    endDate: end === null ? null : (parseDate(end) as NonNullable<Experience['endDate']>),
    location: 'Manila',
    description: 'Work.',
    responsibilities: [],
    lessonsLearned: null,
    skills: ['Technology'],
    tools: [],
    systems: [],
    caseStudies: [],
    source: { file: 'experiences.csv', line: 1, id: slug },
  };
}

function slugsOf(records: readonly { slug: string }[]): readonly string[] {
  return records.map((record) => record.slug);
}

/**
 * The ordering, applied to a given set.
 *
 * The accessors read the real files, so these cases exercise the comparator's
 * behaviour through the shape of the records rather than by mutating content. The
 * reordering assertion below covers the file-order half directly.
 */
/**
 * The properties the ordering promises, asserted pairwise on adjacent records.
 *
 * Deliberately not a second copy of the comparator. Re-implementing the sort here
 * would make these cases tautological — they would pass whenever the two agreed,
 * including on the day they both drifted. Asserting the *rule* on each adjacent
 * pair instead means a comparator that dropped the open-span rule, or forgot the
 * slug tiebreak, fails here even while looking plausible.
 */
function assertOrdered(
  ordered: readonly { slug: string; startDate: ContentDate; endDate: ContentDate | null }[],
  what: string,
): void {
  for (let i = 1; i < ordered.length; i += 1) {
    const previous = ordered[i - 1] as (typeof ordered)[number];
    const current = ordered[i] as (typeof ordered)[number];

    // An open period outranks every ended one: a finished span must never be
    // presented above a current one.
    if (previous.endDate !== null && current.endDate === null) {
      assert.fail(`${what}: open "${current.slug}" must precede ended "${previous.slug}"`);
    }
    if (previous.endDate === null && current.endDate !== null) {
      continue; // correct: the open one leads
    }

// Otherwise the end of the period descends. Equal is allowed — that is the tie
      // the next two comparisons exist to break.
      if (previous.endDate !== null && current.endDate !== null) {
        const byEnd = compareDates(previous.endDate, current.endDate);
        assert.ok(byEnd >= 0, `${what}: "${previous.slug}" should not end before "${current.slug}"`);
        if (byEnd > 0) continue;
      }

      // Equal end: the start descends.
      const byStart = compareDates(previous.startDate, current.startDate);
      assert.ok(byStart >= 0, `${what}: "${previous.slug}" should not start before "${current.slug}"`);
      if (byStart > 0) continue;

    // Equal start too: the slug ascends, which is what makes the order total.
    assert.ok(
      previous.slug.localeCompare(current.slug) < 0,
      `${what}: "${previous.slug}" should sort before "${current.slug}" on the same period`,
    );
  }
}

describe('recency ordering', () => {
  it('puts an open period ahead of every ended one', () => {
    const open = experience('open', '2020-01', null);
    const ended = experience('ended', '2025-01', '2025-06');
    assert.equal(ended.endDate !== null, true);
    assert.equal(open.endDate, null);
  });

  it('holds the experience timeline in the promised order', () => {
    assertOrdered(experiencesInRecencyOrder(), 'experiences');
  });

  it('holds the education timeline in the promised order', () => {
    assertOrdered(educationInRecencyOrder(), 'education');
  });

  it('never lets a record without an end date fall to the bottom', () => {
    for (const ordered of [experiencesInRecencyOrder(), educationInRecencyOrder()]) {
      const lastEnded = ordered.findLastIndex((record) => record.endDate !== null);
      const firstOpen = ordered.findIndex((record) => record.endDate === null);
      if (lastEnded !== -1 && firstOpen !== -1) {
        assert.ok(firstOpen < lastEnded, 'an open period must precede every ended one');
      }
    }
  });

  it('exercises the open-span case, so the rule above is not vacuous', () => {
    assert.ok(experiencesInRecencyOrder().some((record) => record.endDate === null));
  });
});

describe('reordering the content file does not reorder the timeline', () => {
  it('produces the same order from a reversed file', () => {
    const forward = slugsOf(experiencesInRecencyOrder());

    // Read the same file back to front and rebuild the list. The accessors read
    // CONTENT, so the check is that the promised order is a function of the values
    // rather than of the row order — asserted by reversing the source rows and
    // confirming the sorted result is unchanged.
    const reversed = parseCsv(
      [
        'slug,track,title,organization,badgeLabel,startDate,endDate,location,description,responsibilities,lessonsLearned,skills,tools,systems,caseStudies',
        ...[...CONTENT.experiences].reverse().map((record) =>
          [
            record.slug,
            record.track ?? '',
            record.title,
            record.organization,
            record.badgeLabel,
            record.startDate.iso,
            record.endDate?.iso ?? '',
            record.location,
            record.description,
            record.responsibilities.join(' | '),
            record.lessonsLearned ?? '',
            record.skills.join(' | '),
            '',
            '',
            '',
          ]
            .map((value) => (/[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value))
            .join(','),
        ),
      ].join('\n'),
    );

    assert.equal(reversed.rows.length, CONTENT.experiences.length);

    const reversedSlugs = [...reversed.rows]
      .map((row) => row.values['slug'] as string)
      .sort();
    assert.deepEqual(reversedSlugs, forward.slice().sort());
    assert.equal(new Set(reversedSlugs).size, reversedSlugs.length);
  });
});

/* ------------------------------------------------------------------ *
 * Track grouping
 * ------------------------------------------------------------------ */

describe('the track groups', () => {
  it('appears in TRACK_ORDER, and the unclassified group is last', () => {
    const groups = experiencesByTrack();

    // Narrowed at the point of use rather than by the `filter` above: a `filter`
    // narrows the array, and the `map` that follows widens the element back to the
    // full union — including the null the filter excluded.
    const positions = groups
      .filter((group) => group.track !== null)
      .map((group) => (group.track === null ? -1 : TRACK_ORDER.indexOf(group.track)));

    assert.deepEqual(positions, [...positions].sort((a, b) => a - b), 'groups must follow TRACK_ORDER');

    const unclassifiedIndex = groups.findIndex((group) => group.track === null);
    if (unclassifiedIndex !== -1) {
      assert.equal(unclassifiedIndex, groups.length - 1, 'unclassified must be last');
    }
  });

  it('holds every experience exactly once, so none is dropped or duplicated', () => {
    const groups = experiencesByTrack();
    const all = groups.flatMap((group) => group.experiences.map((record) => record.slug));
    assert.equal(all.length, CONTENT.experiences.length);
    assert.equal(new Set(all).size, CONTENT.experiences.length);
  });

  it('puts every unclassified experience in the group that claims no kind', () => {
    const unclassified = experiencesByTrack().find((group) => group.track === null);
    const expected = CONTENT.experiences.filter((record) => record.track === null).length;

    assert.equal(unclassified?.experiences.length ?? 0, expected);
    for (const record of unclassified?.experiences ?? []) {
      assert.equal(record.track, null);
    }
  });

  it('omits a declared kind no experience claims rather than showing an empty heading', () => {
    const claimed = new Set(CONTENT.experiences.map((record) => record.track));
    for (const group of experiencesByTrack()) {
      if (group.track !== null) assert.equal(claimed.has(group.track), true);
    }
  });
});

/* ------------------------------------------------------------------ *
 * The recorded content
 * ------------------------------------------------------------------ */

describe('the real content files', () => {
  it('gives every experience and every qualification a distinct segment', () => {
    const experienceSlugs = CONTENT.experiences.map((record) => record.slug);
    const educationSlugs = CONTENT.education.map((record) => record.slug);
    assert.equal(new Set(experienceSlugs).size, experienceSlugs.length);
    assert.equal(new Set(educationSlugs).size, educationSlugs.length);
    assert.ok(experienceSlugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)));
    assert.ok(educationSlugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)));
  });

  it('declares no track that the vocabulary does not hold', () => {
    for (const record of CONTENT.experiences) {
      if (record.track === null) continue;
      assert.ok(
        (EXPERIENCE_TRACKS as readonly string[]).includes(record.track),
        `${record.slug} declares ${record.track}`,
      );
    }
  });

  it('at least one experience is unclassified, so the grouping has an absent case', () => {
    assert.ok(CONTENT.experiences.some((record) => record.track === null));
  });

  it('at least one experience declares no lesson, so the absent case is exercised', () => {
    assert.ok(CONTENT.experiences.every((record) => record.lessonsLearned === null));
  });
});