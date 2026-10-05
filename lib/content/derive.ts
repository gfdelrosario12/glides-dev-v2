/**
 * Derived statistics.
 *
 * This is the only module in the project permitted to produce a number that
 * appears on the page. Every figure on the landing page is computed here from
 * the validated content model, at build or render time, and read as a prop by
 * the section that shows it.
 *
 * The reason for that rule is that a number written into a component is a
 * number that can be wrong. Written into a component it survives a content
 * change; written into a CSV it survives until someone remembers to update it;
 * computed here it cannot disagree with the data that produced it. Nothing is
 * cached, so a figure cannot outlive the record it came from.
 *
 * Counts are of *distinct records*, not of matches. A record carrying two
 * signals that both point at one focus area is one piece of evidence for that
 * area, and counting it twice would let a generous signal list inflate a figure.
 */

import { CONTENT, publishedCaseStudies, getGaps } from './model';
import type {
  CaseStudy,
  Certification,
  Education,
  Experience,
  Technology,
} from './model';
import {
  ARCHIVE_SORT_KEYS,
  applyArchiveView,
  dateOrderingAvailable,
  deriveArchiveFacets,
} from './archive';
import type {
  ArchiveFacetGroup,
  ArchiveSelection,
  ArchiveSortKey,
  ArchiveVocabulary,
  ArchiveView,
} from './archive';
import {
  CASE_STUDY_DOMAIN_LABELS,
  CASE_STUDY_DOMAINS,
  PROJECT_CATEGORIES,
} from './schema';
import type { FocusArea, FocusAreaId, Signal } from '../../content/site';
import { FOCUS_AREAS } from '../../content/site';
import {
  CLOUD_PROVIDER_IDS,
  cloudProviderOf,
  findUnknownCloudTokens,
  normaliseToken,
} from './taxonomy';
import type { CloudProviderId } from './taxonomy';
import type { ContentDate } from './date';
import type { ContentSource } from './model';

/* ------------------------------------------------------------------ *
 * Signal matching
 * ------------------------------------------------------------------ */

/**
 * Every token the cloud signal could match, from the two places it looks.
 *
 * Experience skills and certification issuers, because that is where a platform
 * is actually named. Case-study technologies are not consulted: they name the
 * same providers the taxonomy already resolves from the experience and
 * certification records, and adding a third source would double-count the
 * platform rather than discover a new one.
 */
function cloudCandidates(
  experiences: readonly Experience[],
  certifications: readonly Certification[],
): readonly string[] {
  return [
    ...experiences.flatMap((experience) => experience.skills),
    ...certifications.map((certification) => certification.issuer),
  ];
}

interface Match {
  /** Unique key of the record that matched. */
  readonly record: string;
  readonly source: ContentSource;
}

/**
 * Records matched by one signal.
 *
 * Token comparison is exact on the normalised value, so a signal cannot match a
 * longer string that happens to contain it.
 */
function matchSignal(
  signal: Signal,
  model: {
    readonly experiences: readonly Experience[];
    readonly certifications: readonly Certification[];
    readonly education: readonly Education[];
  },
): readonly Match[] {
  const wanted = 'token' in signal ? normaliseToken(signal.token) : '';

  switch (signal.kind) {
    case 'skill':
      return model.experiences
        .filter((experience) => experience.skills.some((skill) => normaliseToken(skill) === wanted))
        .map((experience) => ({ record: `experience:${experience.source.line}`, source: experience.source }));

    case 'organisation':
      return model.experiences
        .filter((experience) => normaliseToken(experience.organization) === wanted)
        .map((experience) => ({ record: `experience:${experience.source.line}`, source: experience.source }));

    case 'certificationTitle':
      return model.certifications
        .filter((certification) => normaliseToken(certification.title) === wanted)
        .map((certification) => ({
          record: `certification:${certification.source.line}`,
          source: certification.source,
        }));

    case 'qualificationFocus':
      return model.education
        .filter((record) => record.field.some((entry) => normaliseToken(entry) === wanted))
        .map((record) => ({
          record: `education:${record.source.line}`,
          source: record.source,
        }));

    case 'cloudProvider': {
      const hits: Match[] = [];
      for (const experience of model.experiences) {
        if (experience.skills.some((skill) => cloudProviderOf(skill) !== null)) {
          hits.push({
            record: `experience:${experience.source.line}`,
            source: experience.source,
          });
        }
      }
      for (const certification of model.certifications) {
        if (cloudProviderOf(certification.issuer) !== null) {
          hits.push({
            record: `certification:${certification.source.line}`,
            source: certification.source,
          });
        }
      }
      return hits;
    }
  }
}

/** One signal's evidence, with its count. */
export interface SignalEvidence {
  readonly signal: Signal;
  /** A short label for the signal, for the page. */
  readonly label: string;
  readonly count: number;
}

export interface FocusAreaEvidence {
  readonly id: FocusAreaId;
  readonly label: string;
  readonly summary: string;
  /**
   * Distinct records matched by any of the area's signals. A record matching two
   * signals is one piece of evidence, not two.
   */
  readonly count: number;
  /** Only the signals that matched something. A zero signal is not listed. */
  readonly signals: readonly SignalEvidence[];
  /** How many signals the area declares, matched or not. */
  readonly declaredSignals: number;
  /** Where the evidence came from, for review. */
  readonly records: readonly ContentSource[];
}

function signalLabel(signal: Signal): string {
  switch (signal.kind) {
    case 'skill':
      return signal.token;
    case 'organisation':
      return signal.token;
    case 'certificationTitle':
    case 'qualificationFocus':
      return signal.token;
    case 'cloudProvider':
      return 'Cloud platforms';
  }
}

function deriveFocusAreas(
  areas: readonly FocusArea[],
  model: {
    readonly experiences: readonly Experience[];
    readonly certifications: readonly Certification[];
    readonly education: readonly Education[];
  },
): readonly FocusAreaEvidence[] {
  return areas.map((area) => {
    const perSignal = area.signals.map((signal) => ({
      signal,
      label: signalLabel(signal),
      matches: matchSignal(signal, model),
    }));

    const unique = new Map<string, ContentSource>();
    for (const { matches } of perSignal) {
      for (const match of matches) {
        unique.set(match.record, match.source);
      }
    }

    return {
      id: area.id,
      label: area.label,
      summary: area.summary,
      count: unique.size,
      declaredSignals: area.signals.length,
      signals: perSignal
        .filter(({ matches }) => matches.length > 0)
        .map(({ signal, label, matches }) => ({ signal, label, count: matches.length })),
      records: [...unique.values()],
    };
  });
}

/* ------------------------------------------------------------------ *
 * Statistics
 * ------------------------------------------------------------------ */

export interface Statistics {
  /** Published case studies. Also the total available for display. */
  readonly caseStudyCount: number;
  /** How many of them the featured section shows. */
  readonly featuredCaseStudyCount: number;
  /** Distinct technology records in use, across case studies and experience. */
  readonly uniqueTechnologyCount: number;
  /** Experience records: one per role held. */
  readonly rolesHeld: number;
  /** Experience records badged as leadership. */
  readonly leadershipRoles: number;
  readonly unclassifiedRoles: number;
  readonly certificationsEarned: number;
  /** Canonical cloud providers, after the alias map. */
  readonly distinctCloudPlatforms: number;
  /** Whole years from the earliest recorded role start to the present. */
  readonly yearsOfPractice: number;
}

export interface Derivation {
  readonly statistics: Statistics;
  readonly featuredCaseStudies: readonly CaseStudy[];
  readonly focusAreas: readonly FocusAreaEvidence[];
  readonly cloudPlatforms: readonly CloudProviderId[];
  /**
   * The technology records in use, resolved and sorted by name.
   *
   * Exposed so a consumer can list them instead of re-deriving the set from text.
   * The `skills` list holds capabilities, not technologies, so a consumer that
   * scanned it would be listing something else entirely.
   */
  readonly technologiesInUse: readonly Technology[];
  /**
   * Case studies the content declares published.
   *
   * The one answer to "what exists on this site", read by the route, by these
   * statistics, and by the terminal's `open`. A surface that decided publication
   * for itself would be a second source of truth.
   */
  readonly publishedCaseStudies: readonly CaseStudy[];
  readonly gaps: import("./model").ContentGaps;
  /** Tokens that look like a cloud provider but have no canonical mapping. */
  readonly unmappedCloudTokens: readonly string[];
  /**
   * Declared signals that matched no record.
   *
   * Signals are matched exactly, so a token that is slightly off — a dropped
   * `NC2`, a renamed skill — matches nothing. A zero signal is omitted from the
   * page, which would leave that quietly invisible and quietly lower a count.
   * Listing it here makes the mistake visible at build time.
   */
  readonly unmatchedSignals: readonly string[];
}

/**
 * Months since year 0, so two dates of differing precision compare.
 *
 * A year-only date counts as the first month of that year, which is what the
 * owner meant by it: `2025` does not mean "sometime after 2025 began".
 */
function monthOrdinal(date: ContentDate): number {
  return date.year * 12 + (date.month ?? 1);
}

function wholeYearsBetween(from: ContentDate, to: ContentDate): number {
  const years = Math.floor((monthOrdinal(to) - monthOrdinal(from)) / 12);
  return years < 0 ? 0 : years;
}

/** Today's date, as a declared date, so it compares like one. */
function today(): ContentDate {
  const now = new Date();
  return {
    iso: now.toISOString().slice(0, 10),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    precision: 'day',
  };
}

/* ------------------------------------------------------------------ *
 * The case-studies archive
 * ------------------------------------------------------------------ */

/**
 * The vocabulary the archive filters on, declared once.
 *
 * Both axes name the sets the schema declares rather than restating them, which
 * is what stops a surface from growing its own list of categories or domains.
 * The label lookups come from the same place: a category's label is the value
 * the owner wrote, and a domain's is the one declared beside the value.
 */
export const ARCHIVE_VOCABULARY: ArchiveVocabulary = {
  axes: [
    {
      param: 'category',
      label: 'Category',
      permitted: PROJECT_CATEGORIES,
      labelOf: (value) => value,
      valuesOf: (caseStudy) => [caseStudy.category],
    },
    {
      param: 'domain',
      label: 'Domain',
      permitted: CASE_STUDY_DOMAINS,
      labelOf: (value) => CASE_STUDY_DOMAIN_LABELS[value as keyof typeof CASE_STUDY_DOMAIN_LABELS],
      valuesOf: (caseStudy) => caseStudy.domains,
    },
  ],
};

/** The address the archive is served at. Named here so no route types its own. */
export const ARCHIVE_PATH = '/projects';

export interface ArchiveRender extends ArchiveView {
  readonly selection: ArchiveSelection;
  readonly facets: readonly ArchiveFacetGroup[];
  /** Orderings the archive can actually offer, right now. */
  readonly sorts: readonly ArchiveSortKey[];
  readonly href: string;
}

/**
 * Everything one archive request needs, from one pass.
 *
 * The view and the figure above it come from the same call, so a card grid and
 * the count describing it cannot disagree — which is the whole reason this is
 * one function rather than a grid that renders `facets` and a heading that
 * renders a separate count.
 */
export function archiveFor(
  selection: ArchiveSelection,
  basePath: string = ARCHIVE_PATH,
): ArchiveRender {
  const published = publishedCaseStudies();
  const view = applyArchiveView(published, selection, ARCHIVE_VOCABULARY);

  return {
    ...view,
    selection,
    facets: deriveArchiveFacets({ basePath, selection, caseStudies: published, vocabulary: ARCHIVE_VOCABULARY }),
    // The date ordering appears only once a year exists. Offering it earlier
    // would order the archive by a field no record carries.
    sorts: dateOrderingAvailable(published)
      ? ARCHIVE_SORT_KEYS
      : ARCHIVE_SORT_KEYS.filter((key) => key !== 'year'),
    href: basePath,
  };
}

/** Every technology record in use, as distinct records.
 *
 * Keyed by the technology's key rather than by name, so two records cannot
 * collide by sharing a spelling and one record cannot be counted twice under
 * two spellings. Both directions of that failure were possible while the stacks
 * were free text.
 */
function technologiesInUse(
  caseStudies: readonly CaseStudy[],
  experiences: readonly Experience[],
): readonly Technology[] {
  const inUse = new Map<string, Technology>();
  for (const caseStudy of caseStudies) {
    for (const technology of caseStudy.technologies) {
      inUse.set(technology.key, technology);
    }
  }
  for (const experience of experiences) {
    for (const technology of [...experience.tools, ...experience.systems]) {
      inUse.set(technology.key, technology);
    }
  }
  return [...inUse.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function derive(): Derivation {
  const { caseStudies, experiences, certifications, education } = CONTENT;

  const published = publishedCaseStudies();

  const starts = experiences.map((experience) => experience.startDate);
  const earliest = starts.reduce<ContentDate | null>((acc, start) => {
    if (acc === null || monthOrdinal(start) < monthOrdinal(acc)) return start;
    return acc;
  }, null);

  const platforms = new Set<CloudProviderId>();
  for (const token of cloudCandidates(experiences, certifications)) {
    const provider = cloudProviderOf(token);
    if (provider !== null) platforms.add(provider);
  }

  const technologies = technologiesInUse(caseStudies, experiences);

  // Featured is a selection of what exists, so it is drawn from the published set
  // rather than from every case study. A draft with a display order would
  // otherwise occupy a slot on a page the terminal cannot open.
  const featured = published
    .filter((caseStudy) => caseStudy.featured !== null)
    .sort((a, b) => (a.featured as number) - (b.featured as number));

  const focusAreas = deriveFocusAreas(FOCUS_AREAS, { experiences, certifications, education });

  const unmatchedSignals = focusAreas.flatMap((area) =>
    area.signals.length === area.declaredSignals
      ? []
      : FOCUS_AREAS.find((declared) => declared.id === area.id)!.signals
          .filter((declared) => !area.signals.some((hit) => hit.signal === declared))
          .map((declared) => `${declared.kind} "${signalLabel(declared)}" matched no record`),
  );

  return {
    statistics: {
      caseStudyCount: published.length,
      featuredCaseStudyCount: featured.length,
      uniqueTechnologyCount: technologies.length,
      rolesHeld: experiences.length,
      leadershipRoles: experiences.filter((experience) => experience.badgeLabel === 'Leadership').length,
      unclassifiedRoles: experiences.filter((e) => e.track === null).length,
      certificationsEarned: certifications.length,
      // Counted from the map, so an unmapped platform is a missing alias rather
      // than a silently different number.
      distinctCloudPlatforms: CLOUD_PROVIDER_IDS.filter((id) => platforms.has(id)).length,
      yearsOfPractice: earliest === null ? 0 : wholeYearsBetween(earliest, today()),
    },
    featuredCaseStudies: featured,
    publishedCaseStudies: published,
    technologiesInUse: technologies,
    gaps: getGaps(),
    focusAreas,
    cloudPlatforms: CLOUD_PROVIDER_IDS.filter((id) => platforms.has(id)),
    unmappedCloudTokens: findUnknownCloudTokens(cloudCandidates(experiences, certifications)),
    unmatchedSignals,
  };
}

/**
 * Report what derivation had to exclude or could not map.
 *
 * These lists exist because a figure that quietly ignores a record is a figure
 * nobody can check. Collecting them is not the same as surfacing them: without
 * this call they are computed and then dropped, which is the failure these
 * fields were added to prevent. Derivation runs at module load, so this prints
 * once per build, naming the file and line at fault.
 */
function reportDiagnostics(derived: Derivation): void {
  const groups: readonly { readonly title: string; readonly problems: readonly string[] }[] = [
    { title: 'cloud tokens with no canonical mapping', problems: derived.unmappedCloudTokens },
    { title: 'declared signals that matched no record', problems: derived.unmatchedSignals },
  ];

  for (const { title, problems } of groups) {
    if (problems.length === 0) continue;
    console.warn(
      `\nContent derivation: ${problems.length} ${title}:\n` +
        problems.map((problem) => `  - ${problem}`).join('\n') +
        '\n',
    );
  }
}

const DERIVED_RESULT: Derivation = derive();
reportDiagnostics(DERIVED_RESULT);

/**
 * The derived figures.
 *
 * Computed once per module instance, from the model. Nothing is persisted, so
 * the next build recomputes everything from the current files.
 */
export const DERIVED: Derivation = DERIVED_RESULT;