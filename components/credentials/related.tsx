/**
 * The case studies a credential evidences.
 *
 * Renders nothing at all when there are none — no region, no heading, no "no related
 * work" line. A heading over an empty list announces a relationship that is not there,
 * and a sentence saying so would put a line of negative information on the page of every
 * credential whose `caseStudies` cell is empty, which is currently all of them.
 *
 * Each entry is a title and a link, and nothing else. The case study's own facts are one
 * click away and repeating them here would put the credential's issuer and acquisition
 * date beside each of them, which says nothing about the case study.
 */

export interface RelatedCaseStudyLink {
  readonly slug: string;
  readonly title: string;
}

export function RelatedCaseStudies({ items }: { readonly items: readonly RelatedCaseStudyLink[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-work-heading" className="flex flex-col gap-3">
      <h2 id="related-work-heading" className="text-title font-medium text-text">
        Related work
      </h2>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`/projects/${item.slug}`}
              className="text-body text-text underline decoration-border-strong underline-offset-4 hover:decoration-text"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}