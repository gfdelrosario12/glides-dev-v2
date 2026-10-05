import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChipList } from './chip';
import type { CaseStudy } from '@/lib/content/model';
import { SECTION_IDS } from '@/lib/navigation';

export interface FeaturedWorkProps {
  /** Featured case studies, already in their declared order. */
  readonly caseStudies: readonly CaseStudy[];
  /** Every published case study, featured or not. */
  readonly totalAvailable: number;
}

/**
 * Featured case studies.
 *
 * Order comes from the declared order index in the content file, not from the
 * order the rows happen to sit in the CSV. The caller has already sorted; this
 * section does not re-sort, so there is one place where the order is decided.
 *
 * When fewer case studies are shown than exist, the total is stated. Unmarked
 * case studies that were simply absent from the page would read as "this is all
 * of them", and that is a claim the content does not make.
 *
 * A category is rendered as a token rather than a `StatusIndicator`. A category
 * is not a state: there is nothing to be active, verified, or revoked, and the
 * status component's silhouettes would imply otherwise. The same is true of a
 * technology.
 *
 * Each card links to the case study's own address rather than straight to the
 * live destination, because the case study is the record of the work and the
 * live URL is one fact inside it.
 */
export function FeaturedWork({ caseStudies, totalAvailable }: FeaturedWorkProps) {
  const omitted = totalAvailable - caseStudies.length;

  return (
    <section
      id={SECTION_IDS.featuredWork}
      aria-labelledby="work-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 id="work-heading" className="text-title font-medium text-text">
          Featured work
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          {omitted > 0
            ? `A selection of ${caseStudies.length} from ${totalAvailable} case studies. The remaining ${omitted} are listed in full on the case-studies archive.`
            : `All ${totalAvailable} case studies, in the order they are declared.`}
        </p>

        {/* Offered only when there is something the selection does not show.
            Without it an unfeatured case study would be counted in the sentence
            above and reachable from nowhere else on the page. */}
        {omitted > 0 ? (
          <p className="flex">
            <Button variant="secondary" size="sm" href="/projects">
              Browse all {totalAvailable} case studies
            </Button>
          </p>
        ) : null}
      </div>

      <ul className="grid gap-4 lg:grid-cols-2">
        {caseStudies.map((caseStudy) => {
          const titleId = `case-study-${caseStudy.source.line}`;

          return (
            <li key={caseStudy.source.file + caseStudy.source.line} className="min-w-0">
              <Card labelledBy={titleId}>
                <CardHeader>
                  <CardTitle id={titleId} level={3}>
                    {caseStudy.title}
                  </CardTitle>
                  <CardDescription>{caseStudy.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-3">
                    <TokenChipList
                      labels={[caseStudy.category, ...caseStudy.technologies.map((t) => t.name)]}
                    />
                    {/* The definition list appears only when there is something
                        to define. An empty `dl` announces a group of facts and
                        then presents none. */}
                    {caseStudy.year !== null || caseStudy.role !== null ? (
                      <dl className="grid gap-3">
                        {caseStudy.year !== null ? (
                          <div className="flex min-w-0 flex-col gap-1">
                            <dt className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                              Year
                            </dt>
                            <dd className="wrap-anywhere font-mono text-code text-text-secondary">
                              {caseStudy.year.iso}
                            </dd>
                          </div>
                        ) : null}
                        {caseStudy.role !== null ? (
                          <div className="flex min-w-0 flex-col gap-1">
                            <dt className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                              Role
                            </dt>
                            <dd className="text-small text-text-secondary">{caseStudy.role}</dd>
                          </div>
                        ) : null}
                      </dl>
                    ) : null}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="secondary" size="sm" href={`/projects/${caseStudy.slug}`}>
                    Read the case study
                  </Button>
                  {/* Both of these leave the site, so both are marked as doing
                      so rather than being left to look like internal routes. */}
                  <Button variant="ghost" size="sm" href={caseStudy.liveUrl} external>
                    Live site
                  </Button>
                  <Button variant="ghost" size="sm" href={caseStudy.githubUrl} external>
                    Source
                  </Button>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}