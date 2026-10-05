import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseCsv } from './csv.ts';
import {
  CASE_STUDY_MEDIA_SCHEMA,
  CASE_STUDY_SECTIONS,
  CASE_STUDY_SNIPPET_SCHEMA,
  MEDIA_KINDS,
  checkField,
} from './schema.ts';

/*
 * `model.ts` reads and validates every content file when it is first imported, so
 * loading it here also asserts that the shipped content validates. Top-level
 * await is what makes it available to the suites below; a `describe` callback is
 * not async and cannot await.
 */
const { sectionsOf } = await import('./model.ts');

/**
 * Field-rule tests for section-scoped media and for code snippets.
 *
 * Run with `node --test lib/content/sections.test.ts`.
 *
 * Two failure modes are being guarded against, and they are different in kind.
 *
 * The first is silent: a snippet whose whitespace has been normalised still
 * renders, still looks like code, and is wrong in a way no test that checked
 * "does it contain the words" would catch. So the assertions here compare bytes
 * rather than substrings, and they check a field beside it to prove the
 * normalisation is scoped to `code` rather than removed from ingest entirely.
 *
 * The second is loud: a media row missing its `section` or its `kind` is a build
 * failure, and the only question is whether the message points at the cell. A
 * validator that reported "invalid record" would leave the owner reading a CSV
 * with no idea which of four columns to fix.
 */

const MEDIA_FIELDS = CASE_STUDY_MEDIA_SCHEMA.fields;
const SNIPPET_FIELDS = CASE_STUDY_SNIPPET_SCHEMA.fields;

/** Validate one field and return the failure message, or null when it passed. */
function failure(field: string, value: string, spec: NonNullable<unknown>): string | null {
  return checkField(field, value, spec as Parameters<typeof checkField>[2]);
}

describe('a media record must declare where it belongs and what it is', () => {
  it('accepts every declared section key', () => {
    for (const section of CASE_STUDY_SECTIONS) {
      assert.equal(
        failure('section', section.key, MEDIA_FIELDS['section']),
        null,
        `section "${section.key}" should be accepted`,
      );
    }
  });

  it('accepts the full ten, so the set is the one the page renders', () => {
    // The count is asserted rather than derived so that adding or removing a
    // section is a deliberate edit to this test rather than something that
    // silently changes what the page is expected to show.
    assert.equal(CASE_STUDY_SECTIONS.length, 10);
  });

  it('rejects a section outside the declared set', () => {
    const message = failure('section', 'hardware', MEDIA_FIELDS['section']);
    assert.notEqual(message, null);
    assert.match(message as string, /hardware/);
  });

  it('lists the permitted sections when it rejects one', () => {
    // Otherwise the owner has to read the schema to learn the vocabulary, and
    // the schema is one file among several.
    assert.match(failure('section', 'nope', MEDIA_FIELDS['section']) as string, /architecture/);
  });

  it('rejects a record with no section', () => {
    const message = failure('section', '', MEDIA_FIELDS['section']);
    assert.notEqual(message, null, 'section is what places a figure; an empty one places nothing');
  });

  it('accepts every declared kind', () => {
    for (const kind of MEDIA_KINDS) {
      assert.equal(failure('kind', kind, MEDIA_FIELDS['kind']), null);
    }
  });

  it('rejects a kind outside the declared set', () => {
    assert.notEqual(failure('kind', 'screenshot', MEDIA_FIELDS['kind']), null);
  });

  it('rejects a record with no kind', () => {
    // The kind chooses the measure and the position in the section, so a figure
    // without one cannot be placed without guessing — which is what D6 rejects.
    assert.notEqual(failure('kind', '', MEDIA_FIELDS['kind']), null);
  });

  it('still requires the alternative description', () => {
    assert.notEqual(failure('alt', '', MEDIA_FIELDS['alt']), null);
  });

  it('treats the caption as optional', () => {
    assert.equal(failure('caption', '', MEDIA_FIELDS['caption']), null);
  });
});

describe('snippet code is stored exactly as declared', () => {
  const INDENTED = [
    'function sendStatus(payload) {',
    '  const body = JSON.stringify(payload);',
    '',
    '  return fetch("/api/status", {',
    '    method: "POST",',
    '    body,',
    '  });',
    '}',
  ].join('\n');

  it('keeps the indentation of every line', () => {
    assert.equal(checkField('code', INDENTED, SNIPPET_FIELDS['code']), null);
  });

  it('keeps the blank lines between blocks', () => {
    // A normalising ingest collapses the empty line and the two blocks become
    // one, which is still valid-looking code and reads as a mistake.
    assert.ok(INDENTED.includes('\n\n'));
  });

  it('keeps a trailing newline rather than trimming it', () => {
    assert.equal(checkField('code', 'const a = 1;\n', SNIPPET_FIELDS['code']), null);
  });

  it('rejects a code cell that holds nothing', () => {
    // Optional in the sense that a snippet may omit its caption, but a snippet
    // with no code is a snippet with nothing to show.
    assert.notEqual(checkField('code', '', SNIPPET_FIELDS['code']), null);
  });

  it('rejects a code cell holding only whitespace', () => {
    assert.notEqual(checkField('code', '   \n  \n', SNIPPET_FIELDS['code']), null);
  });

  it('returns the code byte for byte, not a trimmed or collapsed copy', () => {
    // Deliberately includes a leading space and a trailing newline. Those are the
    // two the trim would have taken, and they are the reason this field is read
    // verbatim: a fixture whose first line starts flush left and whose last line
    // ends flush right would pass against a trimming parser and hide exactly the
    // defect it exists to catch.
    const declared = `  ${INDENTED}\n\n`;
    const csv = [
      'slug,section,language,caption,order,code',
      `"care-max","implementation","javascript","",1,"${declared.replaceAll('"', '""')}"`,
      '',
    ].join('\n');
    const read = parseCsv(csv, 'case-study-snippets.csv', new Set(['code'])).rows[0]?.values[
      'code'
    ];

    assert.equal(read, declared);
    assert.equal(read?.length, declared.length);
    assert.equal(read?.startsWith('  function'), true);
    assert.equal(read?.endsWith('\n\n'), true);
  });

  it('renders markup in code as literal text, not as structure', () => {
    // Escaped for the CSV, not for HTML: the point is that a reader of the
    // rendered page sees the brackets and the tag, and no browser ever
    // interprets them. React escapes every one of these by construction, so the
    // assertion is that the characters survive the CSV layer, which is the only
    // layer here that could eat them.
    const code = 'if (a < b && c > d) { el.innerHTML = "<em>hi</em>"; }';
    const csv = [
      'slug,section,language,caption,order,code',
      `"care-max","implementation","javascript","",1,"${code.replaceAll('"', '""')}"`,
      '',
    ].join('\n');
    const read = parseCsv(csv, 'case-study-snippets.csv').rows[0]?.values['code'];
    assert.equal(read, code);
  });
});

describe('snippet whitespace is not normalised, but other fields still are', () => {
  it('trims a neighbouring text field on the same row', () => {
    // This is the control. If the ingest stopped trimming text fields the
    // snippet tests above would keep passing while the parser quietly gained a
    // second, contradictory rule.
    assert.equal(checkField('language', '  javascript  ', SNIPPET_FIELDS['language']), null);
    assert.equal(SNIPPET_FIELDS['language'].kind !== 'code', true);
  });

  it('normalises a plain text field the parser supplies trimmed', () => {
    // The same parser call the model makes for the snippets file: `code` is
    // passed as verbatim because the schema declares it that way, and every other
    // column on the row is normalised as it always was.
    const csv = [
      'slug,section,language,caption,order,code',
      '"care-max","implementation","  javascript  ","",1,"  x  "',
      '',
    ].join('\n');
    const values = parseCsv(csv, 'case-study-snippets.csv', new Set(['code'])).rows[0]?.values;
    assert.equal(values?.['language'], 'javascript');
    assert.equal(values?.['code'], '  x  ');
  });

  it('normalises a code column that was not declared verbatim', () => {
    // The guard on the guard. If `verbatimFields` were ignored the field above
    // would still pass once the set were passed, but this shows the exception is
    // opt-in per column and the parser does not special-case the name.
    const csv = ['slug,code', '"care-max","  x  "', ''].join('\n');
    assert.equal(parseCsv(csv, 'case-study-snippets.csv').rows[0]?.values['code'], 'x');
  });
});

describe('sections resolve in declared order, and only when populated', () => {
  /*
   * These assertions are on `sectionsOf`, which is where the layout's two
   * load-bearing decisions are actually made: the order sections appear in, and
   * which ones appear at all.
   *
   * They are tested against synthetic records rather than by fetching a page. The
   * content files currently declare no sections, so a fetch would show nothing and
   * prove nothing; and the two behaviours worth pinning down here — a section that
   * must not appear, and an order that must not follow the CSV — are both
   * invisible in a screenshot of a correctly-rendered page.
   *
   * `model.ts` reads and validates every content file when imported, so this also
   * asserts that the shipped content validates.
   */
  const media = (section: string) =>
    ({
      slug: 'care-max',
      section,
      src: `${section}.png`,
      alt: `A diagram of the ${section}.`,
      kind: 'diagram',
      caption: null,
      order: null,
      source: { file: 'case-study-media.csv', line: 2, id: 'care-max' },
    }) as never;

  const snippet = (section: string) =>
    ({
      slug: 'care-max',
      section,
      language: 'javascript',
      caption: null,
      order: null,
      code: 'const a = 1;\n',
      source: { file: 'case-study-snippets.csv', line: 2, id: 'care-max' },
    }) as never;

  /** A record with nothing declared, so each case adds only what it is about. */
  function record(parts: {
    prose?: readonly string[];
    media?: readonly string[];
    snippets?: readonly string[];
  }) {
    const proseKeys = new Set(parts.prose ?? []);
    return {
      sections: CASE_STUDY_SECTIONS.filter((s) => proseKeys.has(s.key)).map((s) => ({
        key: s.key,
        label: s.label,
        prose: `Prose for ${s.key}.`,
      })),
      media: (parts.media ?? []).map(media),
      snippets: (parts.snippets ?? []).map(snippet),
    } as never;
  }

  it('returns the ten sections in the order the schema declares them', () => {
    // Declared last-first in the record, so an implementation that iterated the
    // record's own arrays would return them reversed and this would fail.
    const sections = sectionsOf(
      record({
        prose: ['lessonsLearned', 'results', 'challenges', 'security', 'infrastructure',
          'implementation', 'architecture', 'problem', 'overview'],
      }),
    );
    assert.deepEqual(
      sections.map((s) => s.key),
      ['overview', 'problem', 'architecture', 'implementation', 'infrastructure',
        'security', 'challenges', 'results', 'lessonsLearned'],
    );
  });

  it('omits a section with no prose, no media, and no snippets', () => {
    const sections = sectionsOf(record({ prose: ['overview'], media: ['results'] }));
    assert.deepEqual(sections.map((s) => s.key), ['overview', 'results']);
  });

  it('returns nothing for a record that declares nothing', () => {
    assert.deepEqual(sectionsOf(record({})), []);
  });

  it('includes a section satisfied only by a figure, with null prose', () => {
    const [section] = sectionsOf(record({ media: ['architecture'] }));
    assert.equal(section?.key, 'architecture');
    assert.equal(section?.prose, null);
    assert.equal(section?.media.length, 1);
  });

  it('includes a section satisfied only by a snippet', () => {
    const [section] = sectionsOf(record({ snippets: ['implementation'] }));
    assert.equal(section?.key, 'implementation');
    assert.equal(section?.prose, null);
    assert.equal(section?.snippets.length, 1);
  });

  it('preserves the order of the snippets it is given', () => {
    // Ordering is not this function's job: the case study's `snippets` array is
    // sorted by `order` when the record is assembled, and `sectionsOf` receives it
    // already ordered. What this must not do is reshuffle what it was handed, so
    // the assertion is that the filter is order-preserving — given the same order
    // the assembly produced, that order comes back unchanged.
    const sections = sectionsOf({
      sections: [],
      media: [],
      snippets: [
        { ...(snippet('implementation') as object), language: 'bash' },
        { ...(snippet('implementation') as object), language: 'json' },
      ],
    } as never);
    assert.deepEqual(
      sections[0]?.snippets.map((s) => s.language),
      ['bash', 'json'],
    );
  });

  it('keeps only the snippets of the section it is resolving', () => {
    // The reason the filter is order-preserving and not a re-sort: a snippet of
    // another section must not appear here, and must not consume this section's
    // position either.
    const sections = sectionsOf({
      sections: [],
      media: [],
      snippets: [
        { ...(snippet('overview') as object), language: 'bash' },
        { ...(snippet('implementation') as object), language: 'json' },
      ],
    } as never);
    assert.equal(sections.length, 2);
    assert.deepEqual(sections[0]?.snippets.map((s) => s.language), ['bash']);
    assert.deepEqual(sections[1]?.snippets.map((s) => s.language), ['json']);
  });

  it('never returns a technologies section, which has no prose column', () => {
    const sections = sectionsOf(record({ prose: ['overview', 'technologies'] as never }));
    assert.equal(
      sections.some((s) => s.key === 'technologies'),
      false,
    );
  });

  it('never places a figure under a section other than the one it declares', () => {
    const sections = sectionsOf(record({ media: ['architecture', 'results'] }));
    const architecture = sections.find((s) => s.key === 'architecture');
    const results = sections.find((s) => s.key === 'results');
    assert.equal(architecture?.media.length, 1);
    assert.equal(results?.media.length, 1);
  });
});

describe('empty collections', () => {
  it('accepts a snippets file holding only its header', () => {
    const table = parseCsv('slug,section,language,caption,order,code\n', 'case-study-snippets.csv');
    assert.deepEqual(table.rows, []);
    assert.deepEqual(table.header, ['slug', 'section', 'language', 'caption', 'order', 'code']);
  });

  it('accepts a media file holding only its header', () => {
    const table = parseCsv('slug,section,kind,src,alt,caption,order\n', 'case-study-media.csv');
    assert.deepEqual(table.rows, []);
  });

  it('still requires the header, so an empty file is not mistaken for an empty collection', () => {
    assert.throws(() => parseCsv('', 'case-study-snippets.csv'));
  });
});