/**
 * Build-time validation of the content files.
 *
 * `schema.ts` declares the rules; this module enforces them. Every violation is
 * collected and reported together, and the build fails. There is no warn-and-
 * continue path and no defaulting of an invalid value, for two reasons:
 *
 *   - A default would hide the fault. A missing project category that becomes
 *     `Personal` is invisible in review and wrong on the page forever.
 *   - A dropped row is worse than a failed build. A visitor counting seven
 *     projects and seeing six has been given a false number; a build that stops
 *     is a five-second fix for whoever is editing the file.
 *
 * Each failure names the file, the record, and the field, because a content
 * owner editing a CSV needs to be able to find the cell from the message alone.
 */

// Runtime imports carry their extension so this module can be loaded on its own
// by `node --test`, the way `schema.ts` is. Node's ESM resolver requires it;
// TypeScript accepts it because `allowImportingTsExtensions` is on.
import type { CollectionId, CollectionSchema } from './schema';
import {
  CASE_STUDY_PROSE_SECTIONS,
  checkField,
  LIST_SEPARATOR,
  schemaFor,
  splitList,
  UNIQUELY_ADDRESSED_KINDS,
} from './schema.ts';
import type { CsvRow, CsvTable } from './csv.ts';
import { isBefore, parseDate } from './date.ts';

/** Every problem found across every collection, in file order. */
export class ContentValidationError extends Error {
  readonly failures: readonly string[];

  constructor(failures: readonly string[]) {
    super(
      `Content validation failed with ${failures.length} ${failures.length === 1 ? 'problem' : 'problems'}:\n` +
        failures.map((failure) => `  - ${failure}`).join('\n'),
    );
    this.name = 'ContentValidationError';
    this.failures = failures;
  }
}

/** Human-readable location of a record, for a failure message. */
function locate(schema: CollectionSchema, row: CsvRow, index: number): string {
  const identifier = row.values[schema.identifier];
  const named =
    identifier !== undefined && identifier !== ''
      ? `${schema.record} "${identifier}"`
      : `${schema.record} #${index + 1}`;
  return `${schema.file} line ${row.line} (${named})`;
}

/**
 * Check the header against the schema.
 *
 * Both directions matter. A declared field missing from the header would be a
 * column that silently validates as absent on every row; a header field with no
 * rule is content nobody decided how to treat.
 */
function checkHeader(schema: CollectionSchema, table: CsvTable): string[] {
  const failures: string[] = [];
  const declared = Object.keys(schema.fields);
  const actual = new Set(table.header);

  for (const field of declared) {
    if (!actual.has(field)) {
      failures.push(`${schema.file}: the header is missing the declared field "${field}"`);
    }
  }

  for (const field of table.header) {
    if (!(field in schema.fields)) {
      failures.push(
        `${schema.file}: the header has the field "${field}", which no schema rule covers`,
      );
    }
  }

  return failures;
}

/** Check every field of every record in one collection. */
function checkRows(schema: CollectionSchema, table: CsvTable): string[] {
  const failures: string[] = [];

  table.rows.forEach((row, index) => {
    const where = locate(schema, row, index);

    if (row.arity !== 'match') {
      failures.push(
        `${where}: has ${row.arity === 'long' ? 'more' : 'fewer'} fields than the header declares`,
      );
    }

    for (const [field, spec] of Object.entries(schema.fields)) {
      const value = row.values[field];
      if (value === undefined) {
        // A missing field on a short row is already reported by the arity check.
        if (row.arity === 'match') {
          failures.push(`${where}: the field "${field}" is absent`);
        }
        continue;
      }
      const reason = checkField(field, value, spec);
      if (reason !== null) {
        failures.push(`${where}: the field "${field}" ${reason}`);
      }
    }
  });

  return failures;
}

/**
 * A field value must be unique across a collection's records.
 *
 * Two projects claiming the same order index leaves their relative order down to
 * the order they happen to appear in the file, which is not a declared order.
 * Two projects claiming the same slug leaves one of them unreachable at its own
 * address. Both are rules that span records rather than fields, which is why they
 * live here and not in `checkField`.
 */
function checkUniqueValues(
  schema: CollectionSchema,
  table: CsvTable,
  field: string,
): string[] {
  const failures: string[] = [];
  const claimed = new Map<string, number>();

  table.rows.forEach((row, index) => {
    const value = row.values[field];
    if (value === undefined || value === '') return;

    const first = claimed.get(value);
    if (first !== undefined) {
      failures.push(
        `${locate(schema, row, index)}: the field "${field}" is ${value}, which ` +
          `${schema.file} line ${first} also claims`,
      );
      return;
    }
    claimed.set(value, row.line);
  });

  return failures;
}

/** Validate one collection against its schema. */
export function validateCollection(schema: CollectionSchema, table: CsvTable): string[] {
  return [
    ...checkHeader(schema, table),
    ...checkRows(schema, table),
    ...checkUniqueAcrossRecords(schema, table),
  ];
}

/** Every uniqueness rule that applies to a schema, in declaration order. */
function checkUniqueAcrossRecords(schema: CollectionSchema, table: CsvTable): string[] {
  const failures: string[] = [];

  for (const [field, spec] of Object.entries(schema.fields)) {
    if ((UNIQUELY_ADDRESSED_KINDS as readonly string[]).includes(spec.kind)) {
      failures.push(...checkUniqueValues(schema, table, field));
    }
  }

  return failures;
}

/**
 * Validate every collection, and throw if anything is wrong.
 *
 * Returns nothing: reaching the end of this function means the content is
 * well-formed. Callers do not get a boolean to ignore.
 */
export function validateAll(schemas: readonly CollectionSchema[], tables: readonly CsvTable[]): void {
  const failures: string[] = [];

  schemas.forEach((schema, index) => {
    const table = tables[index];
    if (table === undefined) {
      throw new Error(`No table was read for ${schema.file}`);
    }
    failures.push(...validateCollection(schema, table));
  });

  if (failures.length > 0) {
    throw new ContentValidationError(failures);
  }
}

/* ------------------------------------------------------------------ *
 * Cross-record rules
 * ------------------------------------------------------------------ */

/**
 * The values of one collection's key field, for matching references against.
 *
 * Built from tables that have already passed `validateAll`, so every value here
 * has been checked for shape. Anything empty is skipped: an empty key is not a
 * record another file can name.
 */
function keysOf(schema: CollectionSchema, table: CsvTable): ReadonlySet<string> {
  const keys = new Set<string>();
  for (const row of table.rows) {
    const value = row.values[schema.key];
    if (value !== undefined && value !== '') keys.add(value);
  }
  return keys;
}

/** Resolve every reference in one row, naming the file, record, and field. */
function checkRowReferences(
  schema: CollectionSchema,
  row: CsvRow,
  index: number,
  keys: ReadonlyMap<CollectionId, ReadonlySet<string>>,
): string[] {
  const failures: string[] = [];
  const where = locate(schema, row, index);

  for (const [field, spec] of Object.entries(schema.fields)) {
    if (spec.kind !== 'slugRef' && spec.kind !== 'slugRefList') continue;

    const value = row.values[field];
    if (value === undefined || value === '') continue;

    // The collection is resolved from the declared id rather than taken from the
    // caller, so a reference cannot point somewhere the id does not name.
    const target = schemaFor(spec.collection);
    if (target === undefined) {
      failures.push(
        `${where}: the field "${field}" references the collection "${spec.collection}", which no schema declares`,
      );
      continue;
    }

    const known = keys.get(spec.collection);
    if (known === undefined) {
      failures.push(
        `${where}: the field "${field}" references "${spec.collection}", which was not read`,
      );
      continue;
    }

    const named = spec.kind === 'slugRef' ? [value] : value.split(LIST_SEPARATOR);

    for (const entry of named) {
      const reference = entry.trim();
      if (reference === '') continue;
      if (known.has(reference)) continue;
      failures.push(
        `${where}: the field "${field}" references "${reference}", which ` +
          `${target.file} does not declare`,
      );
    }
  }

  return failures;
}

/**
 * A declared span that ends before it begins.
 *
 * Checked across two fields rather than inside one, because no single field
 * carries the contradiction: each of `startDate` and `endDate` is a perfectly
 * good date on its own. Only their pair is impossible.
 *
 * Not repaired. A record that ends before it begins has no trustworthy dates, and
 * swapping the two would quietly let a bad row into a derived figure — which is
 * exactly what the free-text `duration` parser used to report rather than fix.
 */
function checkRowDateOrder(schema: CollectionSchema, row: CsvRow, index: number): string[] {
  const order = schema.dateOrder;
  if (order === undefined) return [];

  const startRaw = row.values[order.start];
  const endRaw = row.values[order.end];
  if (startRaw === undefined || startRaw === '') return [];
  // An absent end date is how an open span is declared, not a fault.
  if (endRaw === undefined || endRaw === '') return [];

  const start = parseDate(startRaw);
  const end = parseDate(endRaw);
  if (start === null || end === null) return [];

  if (isBefore(end, start)) return [
    `${locate(schema, row, index)}: the field "${order.end}" is ${endRaw}, which is before ` +
      `the "${order.start}" it follows (${startRaw}), so the span it declares cannot exist`,
  ];

  return [];
}

/**
 * Check every rule that spans records, and throw if anything is wrong.
 *
 * Runs after `validateAll` and before any record is built, because both rules
 * need every table: a reference is checked against the whole of its target
 * collection, so a case study may reference a technology whose file is read
 * later, and a validation pass that walked the collections in order would reject
 * a perfectly good reference for being early.
 *
 * Returns nothing: reaching the end means every reference resolves and every
 * declared span is possible.
 */
export function validateRelations(
  schemas: readonly CollectionSchema[],
  tables: readonly CsvTable[],
): void {
  const keys = new Map<CollectionId, ReadonlySet<string>>(
    schemas.map((schema, index) => {
      const table = tables[index];
      return [schema.id, keysOf(schema, table ?? { header: [], rows: [] })];
    }),
  );

  const failures: string[] = [];

  schemas.forEach((schema, index) => {
    const table = tables[index];
    if (table === undefined) {
      throw new Error(`No table was read for ${schema.file}`);
    }
    table.rows.forEach((row, rowIndex) => {
      failures.push(...checkRowReferences(schema, row, rowIndex, keys));
      failures.push(...checkRowDateOrder(schema, row, rowIndex));
    });
  });

  failures.push(...checkPublicationCompleteness(schemas, tables));

  if (failures.length > 0) {
    throw new ContentValidationError(failures);
  }
}

/**
 * A case study may only be published once it is documented.
 *
 * A rule about one record's relationship to a whole collection rather than about
 * one field, so it cannot live in `checkField`. A published case study must
 * declare all ten sections; nine of them hold authored prose and the tenth is
 * satisfied by declaring at least one technology, because its content is the
 * technology records rather than a paragraph about them.
 *
 * Drafts are exempt. That exemption is the point of the rule rather than a
 * loophole in it: without it, writing a case study up section by section would
 * mean a red build after every step, and the alternative — filling the gaps with
 * generated prose — is exactly what the content model forbids.
 *
 * Every violating record is reported, and every missing section within it, so the
 * whole set of corrections is one build rather than one per section per record.
 */
function checkPublicationCompleteness(
  schemas: readonly CollectionSchema[],
  tables: readonly CsvTable[],
): readonly string[] {
  const index = schemas.findIndex((schema) => schema.id === 'caseStudies');
  const schema = schemas[index];
  const table = tables[index];
  if (schema === undefined || table === undefined) return [];

  const failures: string[] = [];

  for (const [rowIndex, row] of table.rows.entries()) {
    if (row.values['status'] !== 'published') continue;

    const missing = CASE_STUDY_PROSE_SECTIONS.filter(
      (section) => (row.values[section.key] ?? '') === '',
    ).map((section) => section.key);
    const hasTechnology = (splitList(row.values['technologies'] ?? '')).length > 0;
    const where = locate(schema, row, rowIndex);

    if (missing.length > 0) {
      failures.push(
        `${where}: is published but does not declare ${missing.length} of its ` +
          `${CASE_STUDY_PROSE_SECTIONS.length} prose sections: ${missing.join(', ')}. ` +
          `Write them, or set status to draft until they are written.`,
      );
    }

    if (!hasTechnology) {
      failures.push(
        `${where}: is published but declares no technology, so its Technologies ` +
          `section would render empty. Declare at least one, or set status to draft.`,
      );
    }
  }

  return failures;
}
