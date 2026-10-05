import type { Metadata as NextMetadata } from 'next';

import { EducationEntry } from '@/components/background/education-entry';
import { ExperienceEntry } from '@/components/background/experience-entry';
import { ExperienceGroup } from '@/components/background/experience-group';
import { Timeline, type TimelineEntry } from '@/components/background/timeline';
import { formatDateRange } from '@/lib/content/date';
import { DERIVED } from '@/lib/content/derive';
import {
  educationInRecencyOrder,
  experiencesByTrack,
  type Experience,
  type ExperienceTrackGroup,
} from '@/lib/content/model';
import {
  EXPERIENCE_SCHEMA,
  QUALIFICATION_SCHEMA,
  UNCLASSIFIED_TRACK_LABEL,
  trackLabel,
} from '@/lib/content/schema';
import { CONTENT_GUTTER, SECTION_RHYTHM } from '@/lib/layout';

/**
 * The background: recorded study and recorded experience, as operational history.
 *
 * A Server Component with no client component anywhere in it. Both timelines are in
 * the initial response and nothing about a record is serialised into a bundle, so
 * the page works with scripting disabled and no education or experience value
 * reaches the browser twice.
 *
 * The route adds no shell of its own — skip link, header, `main`, and footer come
 * from `PageShell` in the root layout — so the document holds exactly one banner,
 * one main region, and one contentinfo.
 *
 * Every record resolves to display values here, above the JSX, and the components
 * receive those values as props. That keeps the content model out of the view, so a
 * field reaches the page only by a path the model validated.
 */

export const metadata: NextMetadata = {
  title: 'Background',
  description:
    'Recorded study and recorded work: what was operated, with what, and where.',
};

/**
 * One experience as the view needs it.
 *
 * A function rather than inline JSX so the two places that would otherwise each
 * spell it — the group's list and nothing else — cannot drift. The `id`s are derived
 * from the record's declared slug, so they are unique across the page and stable
 * across builds.
 */
function entryOf(experience: Experience): TimelineEntry {
  return {
    slug: experience.slug,
    render: (
      <ExperienceEntry
        titleId={`${experience.slug}-role`}
        role={experience.title}
        organization={experience.organization}
        period={formatDateRange(experience.startDate, experience.endDate)}
        badgeLabel={experience.badgeLabel}
        location={experience.location}
        description={experience.description}
        responsibilities={experience.responsibilities}
        lessonsLearned={experience.lessonsLearned}
        skills={experience.skills}
        tools={experience.tools.map((tool) => tool.name)}
        systems={experience.systems.map((system) => system.name)}
        caseStudies={experience.caseStudies.map((caseStudy) => ({
          slug: caseStudy.slug,
          title: caseStudy.title,
        }))}
      />
    ),
  };
}

/**
 * The group's key and its name as a visitor reads them.
 *
 * The key is the declared track, or `unclassified` for the group that claims none.
 * It is built here rather than inside `ExperienceGroup` because the heading's id
 * has to be a valid fragment for `aria-labelledby`, and the display label is a
 * phrase with spaces in it.
 */
function groupKeyOf(group: ExperienceTrackGroup): string {
  return group.track ?? 'unclassified';
}

function groupLabelOf(group: ExperienceTrackGroup): string {
  return group.track === null ? UNCLASSIFIED_TRACK_LABEL : trackLabel(group.track);
}

export default function BackgroundPage() {
  const groups = experiencesByTrack();
  const study = educationInRecencyOrder();

  const total = groups.reduce((count, group) => count + group.experiences.length, 0);

  const educationEntries: TimelineEntry[] = study.map((record) => ({
    slug: record.slug,
    render: (
      <EducationEntry
        titleId={`${record.slug}-title`}
        title={record.title}
        institution={record.institution}
        period={formatDateRange(record.startDate, record.endDate)}
        degree={record.degree}
        location={record.location}
        field={record.field}
        detail={record.detail}
      />
    ),
  }));

  return (
    <article className={`py-12 ${CONTENT_GUTTER}`}>
      <div className={`mx-auto flex max-w-wide flex-col gap-8 ${SECTION_RHYTHM}`}>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Background
          </p>
          <h1 className="text-title font-medium text-text">Background</h1>
          <p className="max-w-prose text-body text-text-secondary">
            Computer engineering as a discipline, and the work carried out alongside it — as
            an operational record rather than a list of titles and employers.
          </p>
        </div>

        {/* Experience leads and the study timeline follows: the order a visitor asks
            the question in. What has this person been doing, and how were they trained
            to do it. */}
        <section aria-labelledby="experience-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="experience-heading" className="text-title font-medium text-text">
              Experience
            </h2>
            {/*
              The count and the classification, stated together. Most of the recorded
              work declares no kind today, and saying so is the difference between a
              visitor reading the grouping as complete and reading it as the author's
              own unfinished work.
            */}
            <p className="max-w-prose text-body text-text-secondary">
              {total === 0
                ? 'No experience is recorded yet.'
                : `${total} recorded, most recent period first, grouped by the kind of work.` +
                  (DERIVED.statistics.unclassifiedRoles === 0
                    ? ''
                    : ` ${DERIVED.statistics.unclassifiedRoles} of them declare no kind, and are listed last.`)}
            </p>
          </div>

          {groups.length === 0 ? (
            <Timeline label="Recorded experience" emptySource={EXPERIENCE_SCHEMA.file} entries={[]} />
          ) : (
            groups.map((group) => (
              <ExperienceGroup
                key={groupKeyOf(group)}
                groupKey={groupKeyOf(group)}
                label={groupLabelOf(group)}
              >
                <Timeline
                  label={`${groupLabelOf(group)} experience`}
                  emptySource={EXPERIENCE_SCHEMA.file}
                  entries={group.experiences.map(entryOf)}
                />
              </ExperienceGroup>
            ))
          )}
        </section>

        <section aria-labelledby="education-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="education-heading" className="text-title font-medium text-text">
              Education
            </h2>
            <p className="max-w-prose text-body text-text-secondary">
              {study.length === 0
                ? 'No study is recorded yet.'
                : `${study.length} records of study, most recent period first.`}
            </p>
          </div>

          <Timeline
            label="Recorded study"
            emptySource={QUALIFICATION_SCHEMA.file}
            entries={educationEntries}
          />
        </section>
      </div>
    </article>
  );
}