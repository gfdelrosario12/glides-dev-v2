import { StatusIndicator } from '@/components/ui/status-indicator';
import { Button } from '@/components/ui/button';
import type { StatusTone } from '@/components/ui/status-indicator';

/**
 * A credential's verification state and the destination a visitor can check it at.
 *
 * Two things are presented, and keeping them apart is the point. The *state* is what
 * the site's own content supports; the *destination* is where a visitor goes to form
 * their own opinion. Presenting them as one button — "Verify" — would collapse the
 * difference, and for a credential whose destination is the owner's profile listing
 * that button would be making a claim the content does not make.
 *
 * Presentational only. The state, its wording, and the destination's wording all arrive
 * as strings, because both depend on facts this component cannot see: the state needs
 * the record's expiry, and the destination's wording needs what the destination
 * identifies. Deciding either here would mean the route reaching past the record.
 */

export type CredentialVerificationState = 'verified' | 'listed' | 'needs-attention';

/**
 * State to tone.
 *
 * `listed` is `neutral` and not `info`, deliberately. It is the absence of a
 * verification claim rather than a claim of its own, and `neutral` is documented as
 * "inactive, unknown, or not applicable" — which is exactly what a link to a profile
 * listing is with respect to this particular credential.
 *
 * `needs-attention` outranks the destination: a lapsed credential is not verified
 * however good its badge link is, so the tone follows the expiry and not the kind.
 */
const TONE_FOR_STATE: Record<CredentialVerificationState, StatusTone> = {
  verified: 'success',
  listed: 'neutral',
  'needs-attention': 'warning',
};

export interface CredentialVerificationProps {
  readonly state: CredentialVerificationState;
  /**
   * The visible state text.
   *
   * Required rather than derived, because `StatusIndicator` treats tone as never
   * sufficient on its own and because the honest wording depends on the record: an
   * expiry that has passed and one that is approaching read differently.
   */
  readonly stateLabel: string;
  /** Where a visitor can follow to form their own opinion. */
  readonly destination: string;
  /**
   * What that destination is called on this page.
   *
   * "Verify" when the destination identifies this credential, "View on profile" when
   * it identifies the owner's listing of it. Passed in so the claim is written once,
   * next to the record that supports it.
   */
  readonly destinationLabel: string;
}

export function CredentialVerification({
  state,
  stateLabel,
  destination,
  destinationLabel,
}: CredentialVerificationProps) {
  return (
    <div className="flex flex-col gap-3">
      <StatusIndicator tone={TONE_FOR_STATE[state]} label={stateLabel} />

      <div className="flex flex-col gap-2">
        <Button variant="secondary" size="sm" href={destination} external>
          {destinationLabel}
        </Button>

        {/*
          The address in text as well as in the button's target.

          A button that says "View on profile" tells a visitor where they are going but
          not where — and where matters more than usual here, because "where" is the
          whole claim. Someone deciding whether to trust a credential should be able to
          read the domain without following the link, which is also the only way to tell
          a badge page from a profile page without clicking.
        */}
        <p className="wrap-anywhere font-mono text-code text-text-muted">{destination}</p>
      </div>
    </div>
  );
}