import type { Statistics } from '@/lib/content/derive';
import { SECTION_IDS } from '@/lib/navigation';

/**
 * The statistics band.
 *
 * Every figure arrives as a prop from `derive.ts`. This file contains no number:
 * the value is read off the object by key and the label is wording. That split is
 * the whole point — a figure written here would be a figure free to disagree
 * with the content, and nothing would catch the disagreement.
 *
 * Labels sit in the mono face because every other machine-facing string on the
 * page does, so a number is recognisable as data at a glance. Values sit in the
 * display step; the band is the one place the largest type is justified.
 */
interface Figure {
  readonly key: keyof Statistics;
  readonly label: string;
  /** Read alongside the figure, so it is never a bare number. */
  readonly note: string;
}

const FIGURES: readonly Figure[] = [
  {
    key: 'yearsOfPractice',
    label: 'Years of practice',
    note: 'from the earliest recorded start',
  },
  { key: 'caseStudyCount', label: 'Case studies', note: 'published, not drafted' },
  { key: 'uniqueTechnologyCount', label: 'Technologies', note: 'distinct across the work' },
  { key: 'distinctCloudPlatforms', label: 'Cloud platforms', note: 'counted once each' },
  { key: 'rolesHeld', label: 'Roles held', note: 'internships, organisations, and competitions' },
  { key: 'leadershipRoles', label: 'Leadership roles', note: 'badged as leadership' },
  { key: 'certificationsEarned', label: 'Certifications', note: 'cloud and vocational issuers' },
  { key: 'featuredCaseStudyCount', label: 'Featured', note: 'selected from the total' },
];

function FigureCell({ figure, value }: { figure: Figure; value: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-md border border-border bg-surface-raised p-4">
      <p className="text-display font-medium text-accent">{value}</p>
      <p className="font-mono text-label uppercase tracking-[0.06em] text-text">
        {figure.label}
      </p>
      <p className="text-label text-text-muted">{figure.note}</p>
    </div>
  );
}

export function StatisticsBand({ statistics }: { statistics: Statistics }) {
  return (
    <section
      id={SECTION_IDS.statistics}
      aria-labelledby="statistics-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <h2 id="statistics-heading" className="text-title font-medium text-text">
        By the numbers
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIGURES.map((figure) => (
          <li key={figure.key} className="min-w-0">
            <FigureCell figure={figure} value={statistics[figure.key]} />
          </li>
        ))}
      </ul>

      <p className="max-w-prose text-small text-text-muted">
        Every figure above is derived from the content files when the site is
        built. None of them is written into the page.
      </p>
    </section>
  );
}