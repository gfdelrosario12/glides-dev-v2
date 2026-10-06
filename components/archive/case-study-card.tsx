import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TokenChipList } from '@/components/sections/chip';
import { domainLabel } from '@/lib/content/schema';
import type { CaseStudy } from '@/lib/content/model';
import { ReadableDescription } from '@/components/ui/readable-description';
import { CaseStudyHint } from '@/components/ui/case-study-hint';

/**
 * One case study, as a card in the archive grid.
 *
 * Everything here is read from the record. There is no fallback text, no default
 * year, and no summary the component composed itself: a case study that records
 * no year or role simply shows neither, because a placeholder standing in for an
 * absent fact is a claim the content does not make.
 *
 * The card links to the case study's own address rather than to the live
 * destination, because the case study is the record of the work and the live URL
 * is one fact inside it — the same choice `featured-work.tsx` makes.
 *
 * Featuredness is a `TokenChip`, not a `StatusIndicator`. A status indicator
 * carries a lifecycle — active, verified, revoked — and a selection has none.
 */
export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const titleId = `archive-case-${caseStudy.slug}`;

  const domainLabels = caseStudy.domains.map(domainLabel);

  return (
    <Card labelledBy={titleId} className="relative group">
      <CaseStudyHint />
      <CardHeader>
        <CardTitle id={titleId} level={3}>
          {caseStudy.title}
        </CardTitle>
        <ReadableDescription description={caseStudy.description} />
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Engagement category first, then domains, then the stack. The order
              is the order a visitor reads them in: what it was, what it is about,
              what it is built from. */}
          {caseStudy.featured !== null ? <TokenChipList labels={['Featured']} /> : null}
          <TokenChipList labels={[caseStudy.category, ...domainLabels]} />
          {caseStudy.technologies.length > 0 ? (
            <TokenChipList labels={caseStudy.technologies.map((technology) => technology.name)} />
          ) : null}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="secondary" size="sm" href={`/case-study/${caseStudy.slug}`}>
          Read the case study
        </Button>
        {/* Both of these leave the site, so both are marked as doing so rather
            than being left to look like internal routes. */}
        <Button variant="ghost" size="sm" href={caseStudy.liveUrl} external>
          Live site
        </Button>
        <Button variant="ghost" size="sm" href={caseStudy.githubUrl} external>
          Source
        </Button>
      </CardFooter>
    </Card>
  );
}