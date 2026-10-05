import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CASE_STUDY_DOMAINS, PROJECT_SCHEMA, checkField } from './schema.ts';

/**
 * Field-rule tests for the case-study `domains` column.
 *
 * Run with `node --test lib/content/schema.test.ts`. Node strips the type
 * annotations, so this needs no test-runner dependency and no build step. The
 * module is importable on its own because its one runtime import carries its
 * extension.
 *
 * The cases that matter are the ones where a list could pass something it
 * should not: a value outside the declared set, a cell holding only separators,
 * and a cell where one bad entry sits beside valid ones. A validator that
 * checked only the first entry would accept `bogus | iot`, and the archive would
 * then filter on a domain no case study declares.
 */

/**
 * The spec as the schema actually declares it.
 *
 * Read from `PROJECT_SCHEMA` rather than rebuilt here, so these cases test the
 * declaration the build enforces — a hand-copied fixture would keep passing if
 * someone changed the field to be required, which is exactly the drift this
 * column must not have.
 */
const domains = PROJECT_SCHEMA.fields['domains']!;

describe('the domains field', () => {
  it('accepts every declared domain', () => {
    for (const domain of CASE_STUDY_DOMAINS) {
      assert.equal(checkField('domains', domain, domains), null, domain);
    }
  });

  it('accepts several declared domains in one cell', () => {
    assert.equal(checkField('domains', 'iot | cloud', domains), null);
  });

  it('accepts an empty cell, because the field is optional', () => {
    assert.equal(checkField('domains', '', domains), null);
  });

  it('rejects a domain outside the declared set', () => {
    const reason = checkField('domains', 'embedded', domains);
    assert.notEqual(reason, null);
    assert.match(reason as string, /"embedded"/);
  });

  it('reports the permitted values when it rejects one', () => {
    const reason = checkField('domains', 'embedded', domains) as string;
    for (const domain of CASE_STUDY_DOMAINS) {
      assert.match(reason, new RegExp(domain));
    }
  });

  it('rejects a cell holding only separators', () => {
    assert.match(checkField('domains', ' | ', domains) as string, /no entries/);
  });

  it('tolerates a stray empty entry between two valid ones', () => {
    // `splitList` drops whitespace-only entries, so a doubled separator is two
    // domains rather than an empty one. Asserted because it is the difference
    // between "no entries" and "two entries", and both readings look right until
    // a content file has a trailing separator.
    assert.equal(checkField('domains', 'iot |  | cloud', domains), null);
  });

  it('rejects one bad entry beside valid ones rather than stopping at the first', () => {
    const reason = checkField('domains', 'bogus | iot', domains) as string;
    assert.match(reason, /"bogus"/);
  });

  it('names every bad entry in the cell, so one build reports them all', () => {
    const reason = checkField('domains', 'nope | iot | alsobad', domains) as string;
    assert.match(reason, /"nope"/);
    assert.match(reason, /"alsobad"/);
  });

  it('is case-sensitive, because a domain is a slug-shaped value', () => {
    assert.notEqual(checkField('domains', 'IoT', domains), null);
  });

  it('does not treat a required list as optional by default', () => {
    // The same rule with the optional flag removed: optionality governs presence,
    // not rigour, and a cell that must be filled cannot simply be left empty.
    const required = { kind: 'oneOfList', values: CASE_STUDY_DOMAINS } as const;
    assert.equal(checkField('domains', '', required), 'is required and is empty');
    assert.equal(checkField('domains', 'iot', required), null);
  });
});