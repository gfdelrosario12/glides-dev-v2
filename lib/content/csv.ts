/**
 * RFC 4180 CSV reader.
 *
 * Hand-written rather than pulled in as a dependency. The site reads four small
 * files at build time, and a CSV reader is a few dozen lines — a package for it
 * would be a permanent dependency to avoid thirty lines, which is a bad trade
 * for a content pipeline whose output is the whole site.
 *
 * What is supported, all of it exercised by `csv.test.ts`:
 *
 *   - quoted fields, and commas inside quoted fields
 *   - line breaks inside quoted fields
 *   - `""` as an escaped quote
 *   - CRLF and LF line endings, and a lone CR
 *   - a leading byte-order mark
 *
 * What it deliberately does not do: guess. An unquoted field containing a quote
 * is a syntax error, not a value to be salvaged. A mis-parsed quote does not
 * fail loudly — it produces clean, plausible, wrong content, which is the worst
 * possible failure for a site's source of truth. Every ambiguity is an error
 * that names the line and column.
 *
 * Field values are normalised on the way out: trimmed at both ends, and
 * typographic quotation marks folded to ASCII. Nothing else about a value is
 * touched, so a line break inside a quoted field survives as `\n` in the middle
 * of the string and only the surrounding whitespace goes.
 */

/** A row's field count relative to the header's. */
export type CsvArity = 'match' | 'short' | 'long';

export interface CsvRow {
  /** 1-based line on which this record starts, for error messages. */
  readonly line: number;
  /**
   * Field values keyed by trimmed header name. A field the row does not have is
   * absent rather than empty: "the column is missing" and "the value is blank"
   * are different faults, and validation has to be able to tell them apart.
   */
  readonly values: Readonly<Record<string, string>>;
  /** Whether the row's field count matches the header's. */
  readonly arity: CsvArity;
}

export interface CsvTable {
  /** Trimmed header names, in source order. */
  readonly header: readonly string[];
  /** Data records, in source order. */
  readonly rows: readonly CsvRow[];
}

/**
 * A parse failure at a known position in a known file.
 *
 * Carries the file so that the message can name it. A build failing with
 * "line 4, column 2" and no file is a message that costs a search to act on.
 */
export class CsvSyntaxError extends Error {
  readonly file: string;
  /** The message without the file and position, for re-wrapping. */
  readonly detail: string;
  readonly line: number;
  readonly column: number;

  constructor(detail: string, line: number, column: number, file = 'csv') {
    super(`${file}: ${detail} (line ${line}, column ${column})`);
    this.name = 'CsvSyntaxError';
    this.file = file;
    this.detail = detail;
    this.line = line;
    this.column = column;
  }
}

/**
 * Typographic quotation marks, folded to ASCII. The source data is hand-edited
 * and mixes the two, and a curly quote inside a value is invisible in review
 * but shows up as a stray character in rendered output.
 */
const TYPOGRAPHIC_QUOTES = /[‘’‚‛′“”„‟″]/g;

const ASCII_FOR_TYPOGRAPHIC: Readonly<Record<string, string>> = {
  '‘': "'",
  '’': "'",
  '‚': "'",
  '‛': "'",
  '′': "'",
  '“': '"',
  '”': '"',
  '„': '"',
  '‟': '"',
  '″': '"',
};

function normalise(value: string): string {
  return value.replace(TYPOGRAPHIC_QUOTES, (mark) => ASCII_FOR_TYPOGRAPHIC[mark]).trim();
}

/**
 * The default for `verbatimFields`: a shared empty set, so the common call site
 * allocates nothing.
 */
const VERBATIM_NONE: ReadonlySet<string> = new Set<string>();

interface RawRecord {
  line: number;
  fields: string[];
}

/**
 * Split CSV source into records.
 *
 * Blank lines are dropped. A line whose every field is empty carries no data,
 * and the trailing newline of a well-formed file must not become a final empty
 * record.
 */
function splitRecords(source: string): RawRecord[] {
  const text = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;

  const records: RawRecord[] = [];
  let fields: string[] = [];
  let field = '';
  let inQuotes = false;
  let quoteClosed = false;

  let line = 1;
  let column = 1;
  let recordLine = 1;

  const pushField = () => {
    // Pushed raw. Normalisation happens in `buildTable`, which knows the header and
    // can therefore skip the columns declared verbatim — see `normaliseRow`.
    fields.push(field);
    field = '';
    quoteClosed = false;
  };

  const pushRecord = () => {
    pushField();
    // A record holding a single empty or whitespace-only field is blank. This is
    // tested against the trimmed value rather than the normalised one, because
    // nothing has been normalised yet, and blank-line handling must not depend on
    // whether normalisation is applied to a column.
    if (!(fields.length === 1 && (fields[0] as string).trim() === '')) {
      records.push({ line: recordLine, fields });
    }
    fields = [];
  };

  let index = 0;

  while (index < text.length) {
    const char = text[index] as string;

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 2;
          column += 2;
          continue;
        }
        inQuotes = false;
        quoteClosed = true;
        index += 1;
        column += 1;
        continue;
      }
      if (char === '\r') {
        // A line break inside a quoted field is content, and the value is
        // normalised to LF so a CRLF file and an LF file parse identically.
        field += '\n';
        if (text[index + 1] === '\n') index += 1;
        index += 1;
        line += 1;
        column = 1;
        continue;
      }
      field += char;
      if (char === '\n') {
        line += 1;
        column = 1;
      } else {
        column += 1;
      }
      index += 1;
      continue;
    }

    if (char === ',') {
      pushField();
      index += 1;
      column += 1;
      continue;
    }

    if (char === '\n' || char === '\r') {
      pushRecord();
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      index += 1;
      line += 1;
      column = 1;
      recordLine = line;
      continue;
    }

    if (char === '"') {
      if (field !== '') {
        throw new CsvSyntaxError(
          'a quote appeared inside an unquoted field; the field must be quoted in full',
          line,
          column,
        );
      }
      inQuotes = true;
      index += 1;
      column += 1;
      continue;
    }

    if (quoteClosed) {
      throw new CsvSyntaxError(
        `unexpected ${char === ' ' ? 'space' : `"${char}"`} after a closing quote`,
        line,
        column,
      );
    }

    field += char;
    index += 1;
    column += 1;
  }

  if (inQuotes) {
    throw new CsvSyntaxError('a quoted field was never closed', line, column);
  }

  // A final record with no trailing line ending still counts.
  if (field !== '' || fields.length > 0 || quoteClosed) {
    pushRecord();
  }

  return records;
}

/**
 * Parse CSV source into a header and keyed records.
 *
 * Every failure names the file, the line, and the column, so a broken build
 * points at the offending content rather than at the reader.
 */
export function parseCsv(
  source: string,
  file = 'csv',
  verbatimFields: ReadonlySet<string> = VERBATIM_NONE,
): CsvTable {
  try {
    return buildTable(splitRecords(source), verbatimFields);
  } catch (error) {
    // Re-wrap so the file name reaches a failure raised further down, without
    // every throw site having to thread it through.
    if (error instanceof CsvSyntaxError) {
      throw new CsvSyntaxError(error.detail, error.line, error.column, file);
    }
    throw error;
  }
}

function buildTable(
  records: readonly RawRecord[],
  verbatimFields: ReadonlySet<string>,
): CsvTable {
  const headerRecord = records[0];
  if (headerRecord === undefined) {
    throw new CsvSyntaxError('the file has no header row', 1, 1);
  }

  // The header is normalised even when it names a verbatim column: a header is a
  // field name, not content, and matching the values below it requires that both
  // sides have been through the same replacement.
  const header = headerRecord.fields.map((name) => normalise(name));
  const seen = new Set<string>();
  for (const name of header) {
    if (name === '') {
      throw new CsvSyntaxError('the header row has an empty field name', headerRecord.line, 1);
    }
    if (seen.has(name)) {
      throw new CsvSyntaxError(`the header row repeats the field "${name}"`, headerRecord.line, 1);
    }
    seen.add(name);
  }

  const rows: CsvRow[] = records.slice(1).map((record) => {
    const values: Record<string, string> = {};
    for (let i = 0; i < header.length && i < record.fields.length; i += 1) {
      const name = header[i] as string;
      const raw = record.fields[i] as string;
      // The one exception to the normalisation rule, and it is by column rather
      // than by file: a `code` cell keeps every byte it was declared with. A
      // leading space that indents the first line and a trailing newline are part
      // of the code, so trimming them would make the stored text differ from what
      // the owner wrote. Every other field is normalised as it always was.
      values[name] = verbatimFields.has(name) ? raw : normalise(raw);
    }

    const arity: CsvArity =
      record.fields.length === header.length
        ? 'match'
        : record.fields.length < header.length
          ? 'short'
          : 'long';

    return { line: record.line, values: Object.freeze(values), arity };
  });

  return { header: Object.freeze(header), rows: Object.freeze(rows) };
}
