import { CredentialCard } from '@/components/credentials/card';
import { credentials } from '@/lib/content/model';
import { credentialCardProps, today } from '@/lib/content/credential-presentation';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * The focus areas.
 *
 * Receives its evidence as a prop. The section knows how to lay out a count and
 * a list of signals; it has no idea what any of them come from, and it holds no
 * number of its own.
 *
 * A count of zero is omitted entirely rather than rendered as a zero. An area
 * with no recorded evidence should read as unevidenced, not as a claim of
 * nothing — and printing `0` next to a summary would assert a conclusion the
 * content does not support.
 */
export function FocusAreas() {
  const certifications = credentials();
  const asOf = today();

  return (
    <section
      id={SECTION_IDS.focusAreas}
      aria-labelledby="focus-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
          Credentials / verified record
        </p>
        <h2 id="focus-heading" className="text-title font-medium text-text">
          Certifications
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          A compact register of the platforms, systems, and practices I have studied.
        </p>
      </div>

      {certifications.length === 0 ? (
        <div className="border border-dashed border-border-strong bg-surface-inset p-6 font-mono text-small text-text-muted">
          Empty register.
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-3">
          {certifications.map((certification) => (
            <li key={certification.slug} className="min-w-0">
              <CredentialCard {...credentialCardProps(certification, asOf)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}