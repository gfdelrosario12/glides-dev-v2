import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChipList } from '@/components/sections/chip';

import { CredentialVerification, type CredentialVerificationState } from './verification';
import Link from 'next/link';

/**
 * One credential, as a card on the listing.
 *
 * Presentational: every value arrives resolved and formatted, and nothing here reads the
 * content model. That is what lets the listing and the detail page share these pieces
 * without either of them passing a record around.
 *
 * The card presents what the credential declares and stops. Absent optional facts are
 * omitted rather than rendered empty — no "Not recorded" row, no reserved space — because
 * a card that says nothing about a field is quieter than one that announces it has
 * nothing to say, and six of them stack up on a listing.
 */

export interface CredentialCardProps {
  readonly slug: string;
  readonly title: string;
  readonly issuer: string;
  /** Pre-formatted by the caller, which owns the date vocabulary. */
  readonly acquiredOn: string;
  readonly state: CredentialVerificationState;
  readonly stateLabel: string;
  readonly destination: string;
  readonly destinationLabel: string;
  readonly skills: readonly string[];
}

export function CredentialCard({
  slug,
  title,
  issuer,
  acquiredOn,
  state,
  stateLabel,
  destination,
  destinationLabel,
  skills,
}: CredentialCardProps) {
  const titleId = `credential-${slug}`;

  return (
    <Card labelledBy={titleId} className="relative group hover:border-accent/50 transition-colors">
      <CardHeader>
        {/* `level={3}` because the listing's own heading is the level 2 and the card
            titles sit inside it; a card title at level 2 would compete with it. */}
        <CardTitle id={titleId} level={3} className="group-hover:text-accent transition-colors">
          <Link href={`/credentials/${slug}`} className="before:absolute before:inset-0">{title}</Link>
        </CardTitle>
        <CardDescription>
          {issuer} &middot; acquired {acquiredOn}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="relative z-10">
            <CredentialVerification
              state={state}
              stateLabel={stateLabel}
              destination={destination}
              destinationLabel={destinationLabel}
            />
          </div>

          {skills.length === 0 ? null : <TokenChipList labels={skills} />}
        </div>
      </CardContent>
    </Card>
  );
}