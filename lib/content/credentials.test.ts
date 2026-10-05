import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseCsv } from './csv.ts';
import {
  CERTIFICATION_SCHEMA,
  CREDENTIAL_SKILLS,
  CREDENTIAL_VERIFICATION_KINDS,
  checkField,
} from './schema.ts';
import { credentialCardProps } from './credential-presentation.ts';
import { parseDate } from './date.ts';
import { verificationStateOf } from './model.ts';
import type { Certification } from './model.ts';

/**
 * Field and state tests for the credential vault.
 *
 * Run with `node --test lib/content/credentials.test.ts`.
 *
 * The two properties worth the most care:
 *
 * `verificationKind` is the only thing standing between a link to a profile listing and
 * a button labelled "Verify", so a case asserts that an undeclared kind fails and that
 * the failure names the permitted values — a validator that said only "invalid" would
 * leave the owner guessing at a column they had just filled in correctly.
 *
 * The state function is given the date rather than reading the clock, so its boundaries
 * can be tested exactly: the day before an expiry and the day after. A test that used
 * "now" would pass today and quietly stop being true once the date moved, which is the
 * whole class of bug this function exists to avoid.
 */

const FIELDS = CERTIFICATION_SCHEMA.fields;

function failure(field: string, value: string): string | null {
  return checkField(field, value, FIELDS[field] as Parameters<typeof checkField>[2]);
}

describe('the verification kind', () => {
  it('accepts every declared kind', () => {
    for (const kind of CREDENTIAL_VERIFICATION_KINDS) {
      assert.equal(failure('verificationKind', kind), null, `${kind} should be accepted`);
    }
  });

  it('rejects an undeclared kind', () => {
    assert.notEqual(failure('verificationKind', 'unverified'), null);
  });

  it('names the permitted kinds when it rejects one', () => {
    // Otherwise the owner has to read the schema to learn a two-word vocabulary.
    assert.match(failure('verificationKind', 'unverified') as string, /direct/);
    assert.match(failure('verificationKind', 'unverified') as string, /profile/);
  });

  it('rejects an empty kind, because the whole point is that it is always stated', () => {
    assert.notEqual(failure('verificationKind', ''), null);
  });

  it('is case-sensitive, because a kind is a slug-shaped value', () => {
    assert.notEqual(failure('verificationKind', 'Direct'), null);
  });
});

describe('the skills column', () => {
  it('accepts an empty cell, so the column can ship before its values are written', () => {
    assert.equal(failure('skills', ''), null);
  });

  it('declares an empty vocabulary, which is why no row populates it', () => {
    assert.deepEqual(CREDENTIAL_SKILLS, []);
  });

  it('rejects every value while the vocabulary is empty', () => {
    // The consequence of the declared-empty decision, asserted so that adding the first
    // skill is a deliberate change to this expectation rather than a silent one.
    assert.notEqual(failure('skills', 'cloud'), null);
  });

  it('names the offending value and the permitted set', () => {
    const message = failure('skills', 'cloud') as string;
    assert.match(message, /cloud/);
  });

  it('names every bad value in one cell rather than stopping at the first', () => {
    const message = failure('skills', 'cloud | security') as string;
    assert.match(message, /cloud/);
    assert.match(message, /security/);
  });
});

describe('the slug', () => {
  it('accepts a slug-shaped value', () => {
    assert.equal(failure('slug', 'aws-cloud-practitioner'), null);
  });

  it('rejects one containing a space', () => {
    // The whole reason the credential is keyed on a slug rather than its title: this
    // title is "IBM Full Stack Software Developer Professional Certificate".
    assert.notEqual(failure('slug', 'IBM Full Stack'), null);
  });

  it('rejects one containing punctuation', () => {
    assert.notEqual(failure('slug', 'aws-cloud:practitioner'), null);
  });

  it('is the identifier, so two credentials cannot claim one address', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];

    const csv = [
      'title,slug,issuer,acquiredOn,expiration,description,verificationUrl,credentialId,caseStudies,verificationKind,skills',
      '"A","shared","I",2024,,"d","https://example.com/a",,,profile,',
      '"B","shared","I",2024,,"d","https://example.com/b",,,direct,',
      '',
    ].join('\n');

    for (const row of parseCsv(csv).rows) {
      const slug = row.values['slug'] as string;
      if (seen.has(slug)) duplicates.push(slug);
      seen.add(slug);
    }

    assert.deepEqual(duplicates, ['shared']);
  });
});

/* ------------------------------------------------------------------ *
 * Verification state
 * ------------------------------------------------------------------ */

const day = (iso: string) => {
  const parsed = parseDate(iso);
  assert.ok(parsed !== null, `${iso} should parse`);
  return parsed;
};

const credential = (over: Partial<Certification> = {}): Certification =>
  ({
    title: 'A credential',
    slug: 'a-credential',
    issuer: 'An issuer',
    acquiredOn: day('2024-01-01'),
    expiration: null,
    description: 'About it.',
    verificationUrl: 'https://example.com/badge',
    verificationKind: 'direct',
    credentialId: null,
    skills: [],
    caseStudies: [],
    source: { file: 'certifications.csv', line: 2, id: 'a-credential' },
    ...over,
  }) as Certification;

describe('the verification state', () => {
  const asOf = day('2026-01-01');

  it('reports a direct destination as verified', () => {
    assert.equal(verificationStateOf(credential({ verificationKind: 'direct' }), asOf), 'verified');
  });

  it('reports a profile destination as listed, not as verified', () => {
    // The distinction the whole change exists for. A credential linked to a profile
    // listing is not verified by that link.
    assert.equal(verificationStateOf(credential({ verificationKind: 'profile' }), asOf), 'listed');
  });

  it('reports an expiry that has passed as needing attention', () => {
    assert.equal(
      verificationStateOf(credential({ expiration: day('2025-12-31') }), asOf),
      'needs-attention',
    );
  });

  it('reports an expiry inside the warning window as needing attention', () => {
    // 2026-02-15 is 45 days out, inside the declared 90-day lead.
    assert.equal(
      verificationStateOf(credential({ expiration: day('2026-02-15') }), asOf),
      'needs-attention',
    );
  });

  it('reports an expiry beyond the warning window by its kind', () => {
    // 2026-06-01 is past the 90-day window, so expiry stops deciding and the declared
    // kind does — which is the precedence the table in design D4 states.
    assert.equal(
      verificationStateOf(credential({ expiration: day('2026-06-01'), verificationKind: 'direct' }), asOf),
      'verified',
    );
    assert.equal(
      verificationStateOf(credential({ expiration: day('2026-06-01'), verificationKind: 'profile' }), asOf),
      'listed',
    );
  });

  it('flips exactly at the boundary rather than somewhere near it', () => {
    // The day before and the day after a 90-day-out expiry, which is where an
    // off-by-one would hide.
    const expiry = day('2026-04-01');
    assert.equal(verificationStateOf(credential({ expiration: expiry }), day('2026-01-01')), 'needs-attention');
    assert.equal(verificationStateOf(credential({ expiration: expiry }), day('2025-12-31')), 'verified');
  });

  it('lets expiry outrank a direct destination', () => {
    // A lapsed credential is not verified however good its badge link is.
    assert.equal(
      verificationStateOf(
        credential({ verificationKind: 'direct', expiration: day('2020-01-01') }),
        asOf,
      ),
      'needs-attention',
    );
  });

  it('gives a credential with no expiry no expiry state', () => {
    // "Does not lapse" is not a claim about attention, so presenting it as one would put
    // a warning on the majority of credentials to say nothing.
    const state = verificationStateOf(credential({ expiration: null }), asOf);
    assert.notEqual(state, 'needs-attention');
  });

  it('does not read the clock, so the same date always gives the same answer', () => {
    const record = credential({ expiration: day('2026-02-15') });
    assert.equal(verificationStateOf(record, asOf), verificationStateOf(record, asOf));
  });
});

describe('the wording a state produces', () => {
  const asOf = day('2026-01-01');

  it('labels a direct credential as verified', () => {
    const props = credentialCardProps(credential({ verificationKind: 'direct' }), asOf);
    assert.equal(props.stateLabel, 'Verified');
    assert.equal(props.destinationLabel, 'Verify');
  });

  it('labels a profile credential without claiming it is verified', () => {
    const props = credentialCardProps(credential({ verificationKind: 'profile' }), asOf);
    assert.equal(props.stateLabel, 'Listed on profile');
    assert.equal(props.destinationLabel, 'View on profile');
  });

  it('says Expired only once it has expired', () => {
    const lapsed = credentialCardProps(credential({ expiration: day('2025-01-01') }), asOf);
    const approaching = credentialCardProps(credential({ expiration: day('2026-02-01') }), asOf);

    assert.match(lapsed.stateLabel, /^Expired /);
    assert.match(approaching.stateLabel, /^Expires /);
    assert.doesNotMatch(approaching.stateLabel, /Expired/);
  });
});