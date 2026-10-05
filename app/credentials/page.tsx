import type { Metadata as NextMetadata } from 'next';

import { CredentialCard } from '@/components/credentials/card';
import { credentials } from '@/lib/content/model';
import { credentialCardProps, today } from '@/lib/content/credential-presentation';
import { CONTENT_GUTTER, SECTION_RHYTHM } from '@/lib/layout';

/**
 * The credential vault: every recorded credential, as a card.
 *
 * A Server Component with no client component anywhere in it. The credentials are in the
 * initial response and nothing about them is serialised into a bundle, which is what lets
 * the page work with scripting disabled and keeps the content server-side.
 *
 * The route adds no shell of its own — skip link, header, `main`, and footer come from
 * `PageShell` in the root layout — so the document holds exactly one banner, one main
 * region, and one contentinfo.
 *
 * There is no filter and no search. Six records do not need one, and a control that
 * filtered would need either a query string, which would make this the site's second
 * dynamic route, or a client boundary, which this page otherwise has no reason to
 * introduce.
 */

export const metadata: NextMetadata = {
  title: 'Credentials',
  description: 'Recorded certifications and qualifications, with how each can be checked.',
};

export default function CredentialsPage() {
  const all = credentials();
  const asOf = today();

  return (
    <article className={`py-12 ${CONTENT_GUTTER}`}>
      <div className={`mx-auto flex max-w-wide flex-col gap-8 ${SECTION_RHYTHM}`}>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Credentials
          </p>
          <h1 className="text-title font-medium text-text">Credentials</h1>
          {/*
            Two states, one sentence. With credentials recorded the page says how many and
            what each will let a visitor do; with none it says so plainly, because an empty
            region would look like a page that failed to load rather than one with nothing
            in it yet.
          */}
          <p className="max-w-prose text-body text-text-secondary">
            {all.length === 0
              ? 'No credentials are recorded yet.'
              : `${all.length} recorded. Each states what it covers and how it can be checked.`}
          </p>
        </div>

        {all.length === 0 ? null : (
          <div className="grid gap-6 lg:grid-cols-2">
            {all.map((certification) => (
              <CredentialCard
                key={certification.slug}
                {...credentialCardProps(certification, asOf)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}