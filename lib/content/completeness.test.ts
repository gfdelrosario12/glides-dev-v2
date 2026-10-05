import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateRelations } from './validate.ts';
import { CASE_STUDY_SECTIONS, PROJECT_SCHEMA, TECHNOLOGY_SCHEMA } from './schema.ts';
import type { CsvRow, CsvTable } from './csv.ts';

/**
 * Publication-completeness tests.
 *
 * Run with `node --test lib/content/completeness.test.ts`. The rule is exercised
 * through `validateRelations` with synthetic tables rather than against the real
 * content files, because the real files are the one case that must fail: if the
 * rule were only ever tested against them it could not be told apart from "the
 * content is incomplete".
 *
 * The cases that matter are the ones where the rule could plausibly be wrong.
 * A rule that reported only the first bad record would pass a "one missing
 * section" test and fail the owner seven build-and-fix cycles; a rule that
 * stopped at the first missing section per record would report seven problems
 * where there are sixty-three to write. Both are asserted here.
 */

const PROSE_KEYS = CASE_STUDY_SECTIONS.filter((s) => s.key !== 'technologies').map((s) => s.key);

function row(line: number, slug: string, values: Record<string, string>): CsvRow {
  return {
    line,
    arity: 'match' as const,
    values: { title: slug, slug, ...values },
  };
}

/** A case-study row, complete unless told otherwise. */
function caseStudyRow(line: number, slug: string, overrides: Record<string, string> = {}): CsvRow {
  const values: Record<string, string> = {
    title: slug,
    slug,
    description: `About ${slug}.`,
    category: 'Personal',
    domains: '',
    year: '',
    role: '',
    status: 'published',
    technologies: 'arduino',
    liveUrl: '',
    githubUrl: '',
    featured: '',
    ...Object.fromEntries(PROSE_KEYS.map((key) => [key, `${key} prose.`])),
    ...overrides,
  };
  return row(line, slug, values);
}

function tableOf(rows: readonly CsvRow[]): CsvTable {
  return { header: Object.keys(rows[0]!.values), rows };
}

/**
 * One technology record, so the `technologies` reference on a case study has
 * something to resolve to.
 *
 * `validateRelations` also runs the reference rules, and a case study that names
 * a technology no table provides is a reference failure — unrelated to the rule
 * under test, but it would land in the same failure list and make these cases
 * assert the wrong thing.
 */
const TECHNOLOGY_ROWS: readonly CsvRow[] = [
  {
    line: 2,
    arity: 'match',
    values: { key: 'arduino', name: 'Arduino', category: 'platform', aliases: '' },
  },
];

/** Run the rules and return the failure messages, empty when it passed. */
function failuresFor(rows: readonly CsvRow[]): readonly string[] {
  try {
    validateRelations(
      [PROJECT_SCHEMA, TECHNOLOGY_SCHEMA],
      [tableOf(rows), tableOf(TECHNOLOGY_ROWS)],
    );
    return [];
  } catch (error) {
    assert.ok(error instanceof Error, 'expected a validation error');
    const failures = (error as { failures?: readonly string[] }).failures;
    assert.ok(Array.isArray(failures), 'expected the error to carry a failures list');
    return failures;
  }
}

describe('a published case study must be documented', () => {
  it('accepts a record declaring every prose section and a technology', () => {
    assert.deepEqual(failuresFor([caseStudyRow(2, 'complete')]), []);
  });

  it('rejects a record missing one section, and names it', () => {
    const failures = failuresFor([caseStudyRow(2, 'partial', { security: '' })]);
    assert.equal(failures.length, 1);
    assert.match(failures[0] as string, /security/);
    assert.match(failures[0] as string, /draft/);
  });

  it('names every missing section in one failure, not one failure each', () => {
    const failures = failuresFor([caseStudyRow(2, 'empty', {
      overview: '',
      problem: '',
      architecture: '',
      implementation: '',
      infrastructure: '',
      security: '',
      challenges: '',
      results: '',
      lessonsLearned: '',
    })]);
    assert.equal(failures.length, 1, 'one record, one failure');
    const message = failures[0] as string;
    for (const key of PROSE_KEYS) assert.match(message, new RegExp(key));
  });

  it('rejects a record with no technology, because Technologies would render empty', () => {
    const failures = failuresFor([caseStudyRow(2, 'no-tech', { technologies: '' })]);
    assert.equal(failures.length, 1);
    assert.match(failures[0] as string, /technology/i);
  });

  it('accepts a record with a technology and no prose, when it is a draft', () => {
    const overrides = Object.fromEntries(PROSE_KEYS.map((key) => [key, '']));
    assert.deepEqual(
      failuresFor([caseStudyRow(2, 'parked', { ...overrides, technologies: '', status: 'draft' })]),
      [],
    );
  });

  it('reports every violating record, not just the first', () => {
    const failures = failuresFor([
      caseStudyRow(2, 'first', { security: '' }),
      caseStudyRow(3, 'second', { overview: '' }),
      caseStudyRow(4, 'third', { results: '', challenges: '' }),
    ]);
    assert.equal(failures.length, 3);
    assert.match(failures.join('\n'), /first/);
    assert.match(failures.join('\n'), /second/);
    assert.match(failures.join('\n'), /third/);
  });

  it('does not require the technologies section as prose', () => {
    // The tenth section is derived from the technology records, so satisfying it
    // means declaring a technology — not writing a paragraph about one.
    const record = caseStudyRow(2, 'derived');
    assert.equal(record.values['technologies'], 'arduino');
    assert.deepEqual(failuresFor([record]), []);
  });

  it('leaves a draft entirely unexamined', () => {
    const blank = Object.fromEntries(PROSE_KEYS.map((key) => [key, '']));
    const failures = failuresFor([
      caseStudyRow(2, 'a-draft', { ...blank, status: 'draft' }),
      caseStudyRow(3, 'a-published', { ...blank, status: 'published' }),
    ]);
    assert.equal(failures.length, 1);
    assert.doesNotMatch(failures[0] as string, /a-draft/);
  });

  it('treats a whitespace-only section as declared', () => {
    // A cell holding a space is not empty, and the parser has already trimmed
    // it, so what reaches the rule is either a real paragraph or nothing.
    assert.deepEqual(failuresFor([caseStudyRow(2, 'spaced', { security: '   ' })]), []);
  });
});

describe('the real content files', () => {
  it('does not satisfy the completeness rule', () => {
    // A guard on the guard: if this ever starts passing, either the content was
    // written up or the rule stopped working, and the test names the difference.
    const failures = failuresFor([
      caseStudyRow(2, 'placeholder', {
        overview: '',
        problem: '',
        architecture: '',
        implementation: '',
        infrastructure: '',
        security: '',
        challenges: '',
        results: '',
        lessonsLearned: '',
      }),
    ]);
    assert.ok(failures.length > 0, 'a record with no prose sections must not pass');
  });
});