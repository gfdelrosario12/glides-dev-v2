import { formatDate, isBefore, parseDate } from './date.ts';
import type { ContentDate } from './date.ts';
import { verificationStateOf } from './model.ts';
import type { Certification } from './model.ts';

/**
 * Turning a credential into the display values its components take.
 *
 * Both routes need the same mapping and neither should contain it twice, and the
 * wording is the part that most needs to live next to the record: deciding that a
 * lapsed credential says "Expired" while an approaching one says "Expires" means
 * comparing the record's own date against the current one, which is model knowledge
 * dressed as a string.
 *
 * Presentational only. Nothing here reads a file or reaches past the record it is
 * given, so a test can call it with a synthetic credential and a chosen date.
 */

/**
 * The date states are evaluated against.
 *
 * Read from the clock once, at module load, and passed in explicitly from there. The
 * pages using this are prerendered, so for them this value *is* the build date — which
 * is the honest answer for a static page, and the reason the risk of a recorded expiry
 * not re-evaluating until the next build is written down rather than discovered.
 */
export function today(): ContentDate {
  const parsed = parseDate(new Date().toISOString().slice(0, 10));
  if (parsed === null) {
    // Unreachable for any real clock: the value is an ISO date by construction. Failing
    // loudly beats comparing an expiry against an epoch, which would report every
    // credential as lapsed.
    throw new Error('the current date could not be read as a content date');
  }
  return parsed;
}

/**
 * The visible state text.
 *
 * Two things are going on. A credential with no expiry is never given an expiry state,
 * because "does not lapse" is not a claim about attention — presenting it as one would
 * put a warning-toned indicator on the majority of credentials to say nothing. And
 * within `needs-attention`, a lapse and an approach read differently, because "Expired"
 * on something that has not expired yet would be a false statement.
 */
function stateLabelFor(certification: Certification, asOf: ContentDate): string {
  const { expiration } = certification;

  if (expiration !== null) {
    return isBefore(expiration, asOf)
      ? `Expired ${formatDate(expiration)}`
      : `Expires ${formatDate(expiration)}`;
  }

  return certification.verificationKind === 'direct' ? 'Verified' : 'Listed on profile';
}

/**
 * What the destination is called on this page.
 *
 * The whole reason the `direct` / `profile` distinction exists: a button reading
 * "Verify" on a link that goes to a profile listing would be claiming something the
 * content does not support.
 */
function destinationLabelFor(certification: Certification): string {
  return certification.verificationKind === 'direct' ? 'Verify' : 'View on profile';
}

/** The props a credential card needs, resolved and formatted. */
export function credentialCardProps(certification: Certification, asOf: ContentDate) {
  return {
    slug: certification.slug,
    title: certification.title,
    issuer: certification.issuer,
    acquiredOn: formatDate(certification.acquiredOn),
    state: verificationStateOf(certification, asOf),
    stateLabel: stateLabelFor(certification, asOf),
    destination: certification.verificationUrl,
    destinationLabel: destinationLabelFor(certification),
    skills: certification.skills,
    credentialId: certification.credentialId,
  } as const;
}

/** The props a credential's verification region needs, resolved and formatted. */
export function credentialVerificationProps(certification: Certification, asOf: ContentDate) {
  return {
    state: verificationStateOf(certification, asOf),
    stateLabel: stateLabelFor(certification, asOf),
    destination: certification.verificationUrl,
    destinationLabel: destinationLabelFor(certification),
  } as const;
}