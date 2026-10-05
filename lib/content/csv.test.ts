import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { CsvSyntaxError, parseCsv } from './csv.ts';

// Extensioned so this suite can walk the registered schemas without loading the
// content model, which would read every file a second time.
import { COLLECTION_SCHEMAS, EXPERIENCE_TRACKS } from './schema.ts';

/**
 * Parser tests.
 *
 * Run with `node --test lib/content/csv.test.ts`. Node strips the type
 * annotations, so this needs no test-runner dependency and no build step.
 *
 * The quoted-field cases are the ones that matter. A parser that mishandles a
 * quote or an escaped quote does not crash — it returns clean, plausible,
 * wrong data, and the site's content is wrong for as long as nobody notices.
 * So every rule in RFC 4180 that this reader claims to support has a case here.
 */

/** LF-joined, for the cases that are about quoting rather than line endings. */
const lf = (...lines: string[]) => lines.join('\n') + '\n';
/** The same content with CRLF endings. */
const crlf = (...lines: string[]) => lines.join('\r\n') + '\r\n';

describe('fields', () => {
  it('keeps a comma inside a quoted field as one field', () => {
    const table = parseCsv(lf('a,b', '1,"two, three"'));
    assert.equal(table.rows.length, 1);
    assert.equal(table.rows[0]?.values['b'], 'two, three');
  });

  it('keeps a line break inside a quoted field as part of the value', () => {
    const table = parseCsv(lf('a,b', '1,"first', 'second"'));
    assert.equal(table.rows.length, 1);
    assert.equal(table.rows[0]?.values['b'], 'first\nsecond');
  });

  it('folds CRLF inside a quoted field to a single LF', () => {
    const table = parseCsv(crlf('a,b', '1,"first', 'second"'));
    assert.equal(table.rows.length, 1);
    assert.equal(table.rows[0]?.values['b'], 'first\nsecond');
  });

  it('reads "" inside a quoted field as one literal quote', () => {
    const table = parseCsv(lf('a,b', '1,"He said ""hi"""'));
    assert.equal(table.rows[0]?.values['b'], 'He said "hi"');
  });

  it('reads a field that is only a quoted empty string as empty', () => {
    const table = parseCsv(lf('a,b', '"",x'));
    assert.equal(table.rows[0]?.values['a'], '');
    assert.equal(table.rows[0]?.values['b'], 'x');
  });

  it('reads an unquoted empty field as empty', () => {
    const table = parseCsv(lf('a,b,c', ',,x'));
    assert.equal(table.rows[0]?.values['a'], '');
    assert.equal(table.rows[0]?.values['b'], '');
    assert.equal(table.rows[0]?.values['c'], 'x');
  });
});

describe('line endings', () => {
  it('parses CRLF endings', () => {
    const table = parseCsv(crlf('a,b', '1,2', '3,4'));
    assert.deepEqual(table.header, ['a', 'b']);
    assert.equal(table.rows.length, 2);
    assert.equal(table.rows[0]?.values['b'], '2');
    assert.equal(table.rows[1]?.values['b'], '4');
  });

  it('parses LF endings', () => {
    const table = parseCsv(lf('a,b', '1,2'));
    assert.equal(table.rows.length, 1);
    assert.equal(table.rows[0]?.values['a'], '1');
  });

  it('parses a lone CR as a record separator', () => {
    const table = parseCsv('a,b\r1,2\r3,4');
    assert.equal(table.rows.length, 2);
  });

  it('does not turn the trailing newline into an empty record', () => {
    for (const source of [lf('a,b', '1,2'), crlf('a,b', '1,2'), 'a,b\n1,2', 'a,b\n1,2\r\n']) {
      assert.equal(parseCsv(source).rows.length, 1, JSON.stringify(source));
    }
  });

  it('parses a final record with no trailing line ending', () => {
    const table = parseCsv('a,b\n1,2');
    assert.equal(table.rows.length, 1);
    assert.equal(table.rows[0]?.values['b'], '2');
  });

  it('drops a blank line rather than reporting an empty record', () => {
    const table = parseCsv(lf('a,b', '1,2', '', '3,4'));
    assert.equal(table.rows.length, 2);
  });
});

describe('byte-order mark', () => {
  it('strips a leading BOM from the first header name', () => {
    const table = parseCsv('\uFEFFa,b\n1,2');
    assert.deepEqual(table.header, ['a', 'b']);
    assert.equal(table.rows[0]?.values['a'], '1');
  });

  it('strips a leading BOM in front of a CRLF file', () => {
    const table = parseCsv('\uFEFFa,b\r\n1,2\r\n');
    assert.deepEqual(table.header, ['a', 'b']);
    assert.equal(table.rows.length, 1);
  });
});

describe('normalisation', () => {
  it('resolves a header name with leading whitespace by its trimmed name', () => {
    const table = parseCsv('title,  year,color\nSolo,2024,blue');
    assert.deepEqual(table.header, ['title', 'year', 'color']);
    assert.equal(table.rows[0]?.values['year'], '2024');
  });

  it('trims a header name with trailing whitespace too', () => {
    const table = parseCsv('title ,year\nSolo,2024');
    assert.deepEqual(table.header, ['title', 'year']);
  });

  it('trims leading and trailing whitespace from a value', () => {
    const table = parseCsv(lf('a', '  padded  ', '"  also padded  "'));
    assert.equal(table.rows[0]?.values['a'], 'padded');
    assert.equal(table.rows[1]?.values['a'], 'also padded');
  });

  it('trims a line break left inside a quoted field', () => {
    const table = parseCsv(lf('a', '"trailing break', '"'));
    assert.equal(table.rows[0]?.values['a'], 'trailing break');
  });

  it('converts typographic quotation marks to ASCII', () => {
    const table = parseCsv(lf('a,b', '"the company’s “quote”"'));
    assert.equal(table.rows[0]?.values['a'], 'the company\'s "quote"');
  });

  it('leaves the interior of a value otherwise untouched', () => {
    const table = parseCsv(lf('a', '"  two  inner  spaces  "'));
    assert.equal(table.rows[0]?.values['a'], 'two  inner  spaces');
  });
});

describe('arity', () => {
  it('reports a row with more fields than the header, and keeps the extras out of values', () => {
    const table = parseCsv(lf('a,b', '1,2,3'));
    const row = table.rows[0];
    assert.equal(row?.arity, 'long');
    assert.equal(row?.values['a'], '1');
    assert.equal(row?.values['b'], '2');
    assert.deepEqual(Object.keys(row?.values ?? {}), ['a', 'b']);
  });

  it('reports a row with fewer fields than the header, and leaves the missing field absent', () => {
    const table = parseCsv(lf('a,b,c', '1,2'));
    const row = table.rows[0];
    assert.equal(row?.arity, 'short');
    assert.equal(row?.values['a'], '1');
    assert.ok(!('c' in (row?.values ?? {})));
  });

  it('reports a matching row as matching', () => {
    assert.equal(parseCsv(lf('a,b', '1,2')).rows[0]?.arity, 'match');
  });

  it('carries the source line of each record for error messages', () => {
    const table = parseCsv(crlf('a,b', '1,2', '"x', 'y",3', '4,5'));
    assert.equal(table.rows[0]?.line, 2);
    assert.equal(table.rows[1]?.line, 3);
    assert.equal(table.rows[2]?.line, 5);
  });
});

describe('syntax errors', () => {
  it('rejects a quote inside an unquoted field', () => {
    assert.throws(() => parseCsv(lf('a', 'ab"cd"')), CsvSyntaxError);
  });

  it('rejects text after a closing quote', () => {
    assert.throws(() => parseCsv(lf('a', '"ab" cd')), CsvSyntaxError);
  });

  it('rejects a space after a closing quote', () => {
    assert.throws(() => parseCsv(lf('a', '"ab" ')), CsvSyntaxError);
  });

  it('rejects an unterminated quoted field', () => {
    assert.throws(() => parseCsv(lf('a', '"never closed')), CsvSyntaxError);
  });

  it('rejects a file with no header row', () => {
    assert.throws(() => parseCsv(''), CsvSyntaxError);
  });

  it('rejects a repeated header name rather than letting one shadow the other', () => {
    assert.throws(() => parseCsv(lf('a,b,a', '1,2,3')), CsvSyntaxError);
  });

  it('rejects an empty header field name', () => {
    assert.throws(() => parseCsv(lf('a,,c', '1,2,3')), CsvSyntaxError);
  });

  it('names the line and column of the failure', () => {
    const error = (() => {
      try {
        parseCsv(lf('a,b', '1,2', '3,4', 'x"y"'));
        return undefined;
      } catch (caught) {
        return caught as CsvSyntaxError;
      }
    })();
    assert.ok(error instanceof CsvSyntaxError);
    assert.equal(error.line, 4);
    assert.equal(error.column, 2);
    assert.match(error.message, /line 4, column 2/);
  });

  it('names the file of the failure', () => {
    assert.throws(
      () => parseCsv(lf('a', 'x"y"'), 'experiences.csv'),
      (error: unknown) => {
        assert.ok(error instanceof CsvSyntaxError);
        assert.equal(error.file, 'experiences.csv');
        assert.match(error.message, /^experiences\.csv: /);
        return true;
      },
    );
  });
});

describe('the real content files', () => {
  const CONTENT = join(process.cwd(), 'content');

  // Driven by the registered schemas rather than a hand-written file list.
  //
  // This suite used to name `projects.csv` and assert frozen row and column
  // counts for four files, and it had been failing since the content model moved
  // that file to `case-studies.csv` and reshaped the others. A snapshot of
  // counts is the wrong assertion anyway: it fails when a record is legitimately
  // added and passes when a column is renamed in both places at once. What is
  // worth asserting is that every registered schema has a file, that its header
  // declares exactly the fields the schema declares, and that no row's field
  // count disagrees with its header — the three ways a content file is actually
  // broken.
  const schemas = COLLECTION_SCHEMAS;

  for (const schema of schemas) {
    const file = schema.file;

    it(`parses ${file} with no arity mismatch`, () => {
      const table = parseCsv(readFileSync(join(CONTENT, file), 'utf8'), file);
      for (const row of table.rows) {
        assert.equal(row.arity, 'match', `${file} line ${row.line} has ${row.arity} arity`);
      }
    });

    it(`declares exactly the fields ${schema.record} schema declares in ${file}`, () => {
      const table = parseCsv(readFileSync(join(CONTENT, file), 'utf8'), file);
      const declared = Object.keys(schema.fields);
      // Compared as sets: column order is a readability choice in the file, and
      // `case-studies.csv` leads with `slug` rather than declaring it after
      // `featured`. Requiring an order would make that a failure.
      assert.deepEqual(
        [...table.header].sort(),
        [...declared].sort(),
        `${file} header does not match its declared fields`,
      );
    });
  }

  it('reads every registered schema a file that exists', () => {
    for (const schema of schemas) {
      assert.ok(
        existsSync(join(CONTENT, schema.file)),
        `${schema.file} is registered as ${schema.id} but does not exist`,
      );
    }
  });

  it('reads every declared experience track as a known value', () => {
    const table = parseCsv(
      readFileSync(join(CONTENT, 'experiences.csv'), 'utf8'),
      'experiences.csv',
    );
    const tracks = new Set(table.rows.map((row) => row.values['track']));

    // An empty cell is legal: `track` is optional, and an unclassified experience is
    // a real state rather than a defect. Every non-empty value must be one the
    // vocabulary declares, which is what this case is actually about.
    for (const track of tracks) {
      if (track === '') continue;
      assert.ok(
        (EXPERIENCE_TRACKS as readonly string[]).includes(track),
        `"${track}" is not a declared experience track`,
      );
    }
    assert.ok(tracks.has(''), 'at least one experience should be unclassified today');
  });

  it('leaves no value carrying a typographic quotation mark', () => {
    for (const schema of schemas) {
      const name = schema.file;
      const table = parseCsv(readFileSync(join(CONTENT, name), 'utf8'), name);
      for (const row of table.rows) {
        for (const [field, value] of Object.entries(row.values)) {
          assert.doesNotMatch(value, /[‘’“”]/, `${name} line ${row.line} field ${field}`);
        }
      }
    }
  });
});
