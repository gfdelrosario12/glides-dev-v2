import { notFound } from 'next/navigation';
import type { Metadata as NextMetadata } from 'next';

import { CredentialIdentifier } from '@/components/credentials/identifier';
import { RelatedCaseStudies } from '@/components/credentials/related';
import { CredentialVerification } from '@/components/credentials/verification';
import { TokenChipList } from '@/components/sections/chip';
import { Button } from '@/components/ui/button';
import { Metadata, MetadataList } from '@/components/ui/metadata';
import { credentialBySlug, credentials } from '@/lib/content/model';
import { credentialVerificationProps, today } from '@/lib/content/credential-presentation';
import { formatDate } from '@/lib/content/date';
import { CONTENT_GUTTER, SECTION_RHYTHM } from '@/lib/layout';

/**
 * One credential's page.
 *
 * A Server Component, and entirely server-rendered: the whole credential is in the
 * initial response and this route introduces no client component. Reading the record here
 * rather than passing it to a client leaf keeps the owner's content out of a bundle.
 *
 * Two independent gates keep an unrecognised slug unreachable. `generateStaticParams`
 * enumerates the slugs that exist, but `dynamicParams` defaults to true, which means an
 * unrecognised slug would still be generated on demand if the check below did not
 * separately refuse it. Enumeration alone is therefore not enough.
 */

/** Every recorded credential, enumerated at build time. */
export function generateStaticParams(): { slug: string }[] {
  return credentials().map((certification) => ({ slug: certification.slug }));
}

/**
 * The page title for a credential, read from the record.
 *
 * A function rather than a constant because the title differs per credential, and
 * reading it from the same record the page renders means the two cannot disagree.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<NextMetadata> {
  const { slug } = await params;
  const certification = credentialBySlug(slug);

  if (certification === undefined) return { title: 'Credential not found' };

  return { title: certification.title, description: certification.description };
}

export default async function CredentialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // One response for a slug no credential claims, so an unrecognised address and a
  // withdrawn one cannot be told apart.
  const certification = credentialBySlug(slug);
  if (certification === undefined) {
    notFound();
  }

  const asOf = today();
  const verification = credentialVerificationProps(certification, asOf);

  return (
    <article className={`py-12 ${CONTENT_GUTTER}`}>
      <div className={`mx-auto flex max-w-wide flex-col gap-8 ${SECTION_RHYTHM}`}>
        {/* A `div`, not a `header`: the element inside an article is scoped to it and
            so is not a banner landmark, which leaves the document holding exactly one
            `header` — the shell's. */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Credential
          </p>
          <h1 className="text-title font-medium text-text">{certification.title}</h1>
          <p className="max-w-prose text-body text-text-secondary">{certification.description}</p>
        </div>

        <Facts certification={certification} />

        <section aria-labelledby="verification-heading" className="flex flex-col gap-3">
          <h2 id="verification-heading" className="text-title font-medium text-text">
            How to check this
          </h2>
          {/*
            The section heading is deliberately not "Verification". On a `profile`
            credential there is nothing to verify here, and a heading that claims
            otherwise would reintroduce exactly the overstatement the state wording
            avoids.
          */}
          <CredentialVerification {...verification} />
        </section>

        {/* Both regions below render nothing when the record declares none, rather than
            a heading over an empty list. */}
        <RelatedCaseStudies
          items={certification.caseStudies.map((caseStudy) => ({
            slug: caseStudy.slug,
            title: caseStudy.title,
          }))}
        />

        <nav aria-label="Back" className="flex">
          <Button variant="ghost" size="sm" href="/credentials">
            All credentials
          </Button>
        </nav>
      </div>
    </article>
  );
}

/**
 * The recorded facts about the credential.
 *
 * The identifier appears in this list and nowhere else, so the region reads as the
 * record's fields rather than as a stray code fragment. Rows for absent optional fields
 * are omitted rather than given a placeholder: `Metadata` can render "Not recorded", but
 * a page whose content is complete and differently arranged should not carry four rows
 * saying nothing.
 */
function Facts({ certification }: { certification: NonNullable<ReturnType<typeof credentialBySlug>> }) {
  const identifier = certification.credentialId;

  return (
    <section aria-labelledby="facts-heading" className="flex flex-col gap-2">
      <h2 id="facts-heading" className="text-title font-medium text-text">
        At a glance
      </h2>

      <MetadataList label="Credential details">
        <Metadata label="Issuer" value={certification.issuer} />
        <Metadata label="Acquired" value={formatDate(certification.acquiredOn)} />
        {certification.expiration === null ? null : (
          <Metadata label="Expires" value={formatDate(certification.expiration)} />
        )}
        {identifier === null ? null : (
          <Metadata label="Identifier" value={<CredentialIdentifier value={identifier} />} />
        )}
        {certification.skills.length === 0 ? null : (
          <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3 py-2">
            <dt className="text-label font-mono uppercase tracking-[0.06em] text-text-muted">
              Covers
            </dt>
            <dd>
              <TokenChipList labels={certification.skills} />
            </dd>
          </div>
        )}
      </MetadataList>
    </section>
  );
}