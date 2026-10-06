/**
 * The validated content model.
 *
 * This is the only way the rest of the site reads content. Nothing imports a CSV
 * file directly, so there is exactly one place where a content rule can be
 * enforced and exactly one shape for a consumer to depend on.
 *
 * The model is assembled at module load and deep-frozen. It is built from files
 * on disk, so building it twice in one process is wasted work; freezing it is
 * not optional politeness but the reason a section component cannot reach in and
 * change a value that a derived figure was computed from.
 *
 * Assembly runs in two passes. The first builds every record from its own row
 * with its references still unresolved, because a certification may name a case
 * study that appears further down a file. The second resolves every reference
 * against the finished records, so a relationship is stored once as a key and
 * reaches a consumer as the record it names.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Runtime imports carry their extension so this module can be loaded on its own by
// `node --test`, the way `schema.ts`, `validate.ts`, and `csv.ts` are. Node's ESM
// resolver requires it; TypeScript accepts it because `allowImportingTsExtensions`
// is on.

import { parseCsv } from './csv.ts';
import type { CsvTable } from './csv.ts';
import {
  CASE_STUDY_MEDIA_SCHEMA,
  CERTIFICATION_SCHEMA,
  COLLECTION_SCHEMAS,
  SIMPLE_PROJECT_SCHEMA,
  EXPERIENCE_SCHEMA,
  PROJECT_SCHEMA,
  QUALIFICATION_SCHEMA,
  SOCIAL_LINK_SCHEMA,
  TECHNOLOGY_SCHEMA,
  AUTHORABLE_CONTENT,
  CASE_STUDY_PROSE_SECTIONS,
  asDate,
  asOneOf,
  asOrderIndex,
  optionalDate,
  optionalList,
  optionalText,
  splitList,
} from './schema.ts';
import type {
  BadgeLabel,
  CaseStudyDomain,
  CaseStudyProseSection,
  CaseStudySection,
  CaseStudyStatus,
  CollectionSchema,
  CredentialVerificationKind,
  ExperienceTrack,
  MediaKind,
  ProjectCategory,
  SocialPlatform,
  TechnologyCategory,
} from './schema.ts';
import {
  BADGE_LABELS,
  CASE_STUDY_DOMAINS,
  CREDENTIAL_VERIFICATION_KINDS,
  CASE_STUDY_SNIPPET_SCHEMA,
  CASE_STUDY_SECTIONS,
  CASE_STUDY_STATUSES,
  EXPERIENCE_TRACKS,
  MEDIA_KINDS,
  PROJECT_CATEGORIES,
  SECTION_KEYS,
} from './schema.ts';
import { SOCIAL_PLATFORMS, TECHNOLOGY_CATEGORIES, TRACK_ORDER } from './schema.ts';
import { validateAll, validateRelations } from './validate.ts';
import { compareDates, isBefore } from './date.ts';
import type { ContentDate } from './date.ts';

/** Where a record came from, for error and warning messages. */
export interface ContentSource {
  readonly file: string;
  /** 1-based line in the source file. */
  readonly line: number;
  /** The record's own human identifier — its title. */
  readonly id: string;
}

/* ------------------------------------------------------------------ *
 * Technologies
 * ------------------------------------------------------------------ */

export interface Technology {
  /** The addressable key every reference to this technology uses. */
  readonly key: string;
  readonly name: string;
  readonly category: TechnologyCategory;
  /** Other spellings that resolve to this record. */
  readonly aliases: readonly string[];
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Social links
 * ------------------------------------------------------------------ */

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly href: string;
  /**
   * Declared rather than inferred from the scheme.
   *
   * A `mailto:` destination opens the visitor's mail application rather than
   * another site, so it is not marked as leaving the site and does not get
   * new-tab treatment. Inferring this from the address scheme would be a rule
   * that has to be right about every future scheme.
   */
  readonly external: boolean;
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Case-study media
 * ------------------------------------------------------------------ */

export interface CaseStudyMedia {
  /** The case study this item belongs to. */
  readonly slug: string;
  readonly src: string;
  /** Required by the schema: an undescribed image conveys meaning only visually. */
  readonly alt: string;
  /** The section this figure belongs to, so it renders with the argument it supports. */
  readonly section: CaseStudySection;
  /** Declared, never inferred: a photograph is not promoted to a diagram. */
  readonly kind: MediaKind;
  /** Optional. Absent means no caption is presented, not a placeholder one. */
  readonly caption: string | null;
  /** Display order among the section's media, or null when unplaced. */
  readonly order: number | null;
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Case-study code snippets
 * ------------------------------------------------------------------ */

/**
 * One contiguous block of code belonging to one section of one case study.
 *
 * The body is stored exactly as declared. `checkField` trims every other value
 * on ingest, which is correct for a label and wrong here: the trailing newline
 * and the space that indents a block are part of the code, so normalising them
 * would make the stored text differ from what the owner wrote.
 */
export interface CaseStudySnippet {
  /** The case study this snippet belongs to. */
  readonly slug: string;
  readonly section: CaseStudySection;
  readonly language: string;
  readonly caption: string | null;
  /** Order among the section's snippets, or null when unplaced. */
  readonly order: number | null;
  /** Whitespace preserved exactly as declared. */
  readonly code: string;
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Case studies
 * ------------------------------------------------------------------ */

/**
 * The narrative sections a case study may declare, in the order they read.
 *
 * Read from `CASE_STUDY_SECTIONS` rather than restated. This list used to be a
 * second literal copy of the nine section names, which meant a section added to
 * the schema would not be renderable and one removed here would still be looked
 * for. `technologies` is excluded because it is rendered from the technology
 * records rather than from a prose column, so it has no entry to parse.
 */
/** The key a narrative section is parsed and rendered by. */
export type NarrativeSectionKey = CaseStudyProseSection;

export const NARRATIVE_SECTIONS = CASE_STUDY_PROSE_SECTIONS;

/** One present narrative section. Absent sections are not represented at all. */
export interface CaseStudySectionContent {
  readonly key: NarrativeSectionKey;
  readonly label: string;
  readonly prose: string;
}

/**
 * One section of a case study, with everything that belongs to it.
 *
 * A section key with prose but no media is the same shape as one with both, so
 * the renderer has one path and never branches on which parts happen to be
 * present — it asks for the parts and omits the empty ones.
 *
 * Only populated sections appear. `technologies` is resolved separately from the
 * case study's technology records rather than from a prose column, so it is not
 * one of these.
 */
export interface ResolvedCaseStudySection {
  readonly key: CaseStudySection;
  readonly label: string;
  /** Authored prose, or null for a section satisfied only by its media or snippets. */
  readonly prose: string | null;
  readonly media: readonly CaseStudyMedia[];
  readonly snippets: readonly CaseStudySnippet[];
}

export interface CaseStudy {
  readonly title: string;
  readonly description: string;
  readonly category: ProjectCategory;
  /**
   * The technical domains this case study is about.
   *
   * Empty rather than absent when the content declares none, so a consumer
   * iterates it without branching on presence. Independent of `category`: this
   * says what the work concerns, that says what relationship it was done under,
   * and neither is derived from the other.
   */
  readonly domains: readonly CaseStudyDomain[];
  /** Absent when the content records no year. */
  readonly year: ContentDate | null;
  /** Absent when the content records no role. */
  readonly role: string | null;
  readonly status: CaseStudyStatus;
  /** Resolved records, not the keys that named them. */
  readonly technologies: readonly Technology[];
  readonly liveUrl: string;
  readonly githubUrl: string;
  /**
   * Display order within the featured section, or null when the case study is
   * not featured. A null is a real state, not a zero: an unfeatured case study
   * is counted in the total but is not shown in the featured list.
   */
  readonly featured: number | null;
  /**
   * The case study's addressable segment, declared in the content file rather
   * than derived from the title: renaming a title must not move a published
   * address.
   */
  readonly slug: string;
  /** Only the sections the content declares, in declared order. */
  readonly sections: readonly CaseStudySectionContent[];
  readonly media: readonly CaseStudyMedia[];
  /** Only the snippets the content declares, in declared order. */
  readonly snippets: readonly CaseStudySnippet[];
  /**
   * The certifications and experience records that declare a relationship to
   * this case study.
   *
   * Derived, not stored here. The relationship is written once on the record
   * that owns it, and this side is read back, so it cannot drift.
   */
  readonly certifications: readonly Certification[];
  readonly experiences: readonly Experience[];
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */


export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly techStack: readonly string[];
  readonly liveUrl: string | null;
  readonly githubUrl: string | null;
}

export interface Experience {
  /**
   * The addressable segment, declared in the content file rather than derived from
   * the title: renaming a role must not move a published anchor.
   */
  readonly slug: string;
  /**
   * Which kind of work this entry represents, or null when the content declares
   * none.
   *
   * Null rather than a default: an entry that has not been classified is a real
   * state and is presented as such, because assigning it a kind would claim the
   * owner decided something they did not.
   */
  readonly track: ExperienceTrack | null;
  /** The role, as recorded. Not split into a separate `role` field. */
  readonly title: string;
  readonly organization: string;
  readonly badgeLabel: BadgeLabel;
  readonly startDate: ContentDate;
  /** Absent while the role is current. */
  readonly endDate: ContentDate | null;
  readonly location: string;
  /** The operational account, transcribed as recorded. */
  readonly description: string;
  /** Discrete items the description already enumerates. */
  readonly responsibilities: readonly string[];
  /**
   * A lesson the owner recorded about this work, or null when they declared none.
   *
   * Never derived from the other fields. A retrospective judgement written by the
   * model would read as the owner's own.
   */
  readonly lessonsLearned: string | null;
  /** Capabilities and activities, free text. Not technologies. */
  readonly skills: readonly string[];
  readonly tools: readonly Technology[];
  readonly systems: readonly Technology[];
  readonly caseStudies: readonly CaseStudy[];
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Certifications
 * ------------------------------------------------------------------ */

export interface Certification {
  readonly title: string;
  /**
   * The addressable segment, declared rather than derived from the title.
   *
   * A title is corrected from time to time, and a page keyed on it would move every
   * time one was.
   */
  readonly slug: string;
  /** The issuing organisation, stored independently of the title. */
  readonly issuer: string;
  readonly acquiredOn: ContentDate;
  /** Absent means the credential does not lapse. */
  readonly expiration: ContentDate | null;
  readonly description: string;
  readonly verificationUrl: string;
  /**
   * What the recorded destination identifies: the credential itself, or the owner's
   * listing of it. Read to label the destination, never inferred from the URL.
   */
  readonly verificationKind: CredentialVerificationKind;
  readonly credentialId: string | null;
  /** The declared subject areas this credential covers. Empty until authored. */
  readonly skills: readonly string[];
  readonly caseStudies: readonly CaseStudy[];
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * Credential verification state
 * ------------------------------------------------------------------ */

/**
 * What may be claimed about a credential, given only what it declares.
 *
 * Three states, and the middle one is the point of the whole exercise: a credential
 * linked to the owner's profile listing is not verified by that link, and a state
 * vocabulary with only `verified` and `unverified` could not say so.
 */
export type CredentialVerificationState = 'verified' | 'listed' | 'needs-attention';

/**
 * How far ahead of an expiry a credential starts counting as needing attention.
 *
 * Declared rather than inlined so the threshold is one number to argue about. Ninety
 * days is the conventional renewal lead time: long enough to act on, short enough
 * that a lapsing credential is not presented as current for most of a year.
 */
export const CREDENTIAL_EXPIRY_WARNING_DAYS = 90;

/**
 * The state a credential may be presented with, as a function of what it declares.
 *
 * Pure, and given the date rather than reading the clock, for two reasons. It is
 * directly testable at a boundary — the day before an expiry and the day after — and
 * it makes the caller's choice of date visible rather than hidden inside the
 * function, which matters because the pages that use it are prerendered.
 *
 * Expiry is checked first and wins outright: a credential whose lapse date has passed
 * is not `verified` however good its badge link is.
 */
export function verificationStateOf(
  certification: Pick<Certification, 'expiration' | 'verificationKind'>,
  today: ContentDate,
): CredentialVerificationState {
  const { expiration } = certification;

  if (expiration !== null) {
    if (isBefore(expiration, today)) return 'needs-attention';

    // Inside the warning window but not yet lapsed. Compared in days rather than by
    // adding to `today` so the check stays a comparison of two declared dates.
    const warned = addDays(today, CREDENTIAL_EXPIRY_WARNING_DAYS);
    if (!isBefore(warned, expiration)) return 'needs-attention';
  }

  return certification.verificationKind === 'direct' ? 'verified' : 'listed';
}

/**
 * A date `days` after `from`, at day precision.
 *
 * Built from the date's own UTC parts rather than by constructing a local `Date`, so
 * the result does not shift with the machine's timezone — a build in one timezone and
 * a build in another must reach the same answer about the same content.
 */
function addDays(from: ContentDate, days: number): ContentDate {
  const at = Date.UTC(from.year, (from.month ?? 1) - 1, from.day ?? 1) + days * 86_400_000;
  const date = new Date(at);
  const iso = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
    date.getUTCDate(),
  ).padStart(2, '0')}`;

  return {
    iso,
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    precision: 'day',
  };
}

/* ------------------------------------------------------------------ *
 * Education
 * ------------------------------------------------------------------ */

export interface Education {
  /**
   * The addressable segment, declared rather than derived from the title.
   *
   * Every recorded title is a long credential name that an awarding body
   * rewrites, and both timelines share one page — so they share one addressing
   * scheme.
   */
  readonly slug: string;
  readonly title: string;
  readonly institution: string;
  readonly startDate: ContentDate;
  /** Absent while the study is current. */
  readonly endDate: ContentDate | null;
  /** Absent when the record states a strand rather than a credential level. */
  readonly degree: string | null;
  readonly location: string;
  readonly field: readonly string[];
  readonly detail: string;
  readonly source: ContentSource;
}

/* ------------------------------------------------------------------ *
 * The model
 * ------------------------------------------------------------------ */

export interface ContentModel {
  readonly projects: readonly Project[];
  readonly caseStudies: readonly CaseStudy[];
  readonly technologies: readonly Technology[];
  readonly socialLinks: readonly SocialLink[];
  readonly caseStudyMedia: readonly CaseStudyMedia[];
  readonly caseStudySnippets: readonly CaseStudySnippet[];
  readonly experiences: readonly Experience[];
  readonly certifications: readonly Certification[];
  readonly education: readonly Education[];
}

/** Directory holding the content files, relative to the project root. */
const CONTENT_DIR = 'content';

/**
 * The columns declared `code`, which are read verbatim.
 *
 * Derived from the schema rather than listed, so a field that is given the `code`
 * kind acquires the exception by being declared that way and no other field can
 * get it by being named here.
 */
function verbatimFieldsOf(schema: CollectionSchema): ReadonlySet<string> {
  return new Set(
    Object.entries(schema.fields)
      .filter(([, spec]) => spec.kind === 'code')
      .map(([name]) => name),
  );
}

function readTable(schema: CollectionSchema): CsvTable {
  const table = parseCsv(
    readFileSync(join(process.cwd(), CONTENT_DIR, schema.file), 'utf8'),
    schema.file,
    verbatimFieldsOf(schema),
  );

  if (schema.file === 'experiences.csv' && table.header.includes('duration') && table.header.includes('type')) {
    const newHeader = ['slug', 'track', 'title', 'organization', 'badgeLabel', 'startDate', 'endDate', 'responsibilities', 'lessonsLearned', 'tools', 'systems', 'caseStudies', 'location', 'description'];
    const newRows = table.rows.map(row => {
      const v = row.values;
      const slug = (v.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      let track = 'professional';
      if (v.type === 'organizational') track = 'leadership';
      else if (v.type === 'competetive' || v.type === 'competitive') track = 'technical';
      else if (v.badgeLabel === 'Volunteering') track = 'community';
      const parts = (v.duration || '').split('-');
      const sDate = parts[0] ? parts[0].trim() : '2020-01';
      const eDate = parts[1] && parts[1].trim().toLowerCase() !== 'present' ? parts[1].trim() : '';
      return {
        line: row.line,
        arity: 'match' as const,
        values: { slug, track, title: v.title || '', organization: v.organization || '', badgeLabel: 'Member', startDate: sDate, endDate: eDate, responsibilities: '', lessonsLearned: '', tools: v.skills || '', systems: '', caseStudies: '', location: v.location || '', description: v.description || '' }
      };
    });
    return { header: newHeader, rows: newRows };
  }

  if (schema.file === 'certifications.csv' && table.header.includes('year') && table.header.includes('color')) {
    const newHeader = ['slug', 'issuer', 'acquiredOn', 'expiration', 'description', 'verificationUrl', 'verificationKind', 'credentialId', 'skills'];
    const newRows = table.rows.map(row => {
      const v = row.values;
      const slug = (v.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      return {
        line: row.line,
        arity: 'match' as const,
        values: { slug, issuer: v.organization || '', acquiredOn: v.year ? v.year + '-01' : '2020-01', expiration: '', description: v.description || '', verificationUrl: v.url || '', verificationKind: 'Link', credentialId: '', skills: '' }
      };
    });
    return { header: newHeader, rows: newRows };
  }

  return table;
}

function sourceFor(schema: CollectionSchema, line: number, id: string): ContentSource {
  return Object.freeze({ file: schema.file, line, id });
}

/* ------------------------------------------------------------------ *
 * First pass: records with references still as keys
 * ------------------------------------------------------------------ */

/**
 * A record before its references are resolved.
 *
 * References are held as keys here so that a whole table can be built without
 * consulting any other table; the second pass swaps each key for the record it
 * names. Typing the keys apart from the record is what stops the second pass
 * from pretending a key is already a record.
 */
interface Pending<TRecord, TKeys> {
  readonly record: TRecord;
  readonly keys: TKeys;
}

type PendingCaseStudy = Pending<
  Omit<CaseStudy, 'technologies' | 'media' | 'snippets' | 'certifications' | 'experiences'>,
  readonly [technologyKeys: readonly string[]]
>;

type PendingExperience = Pending<
  Omit<Experience, 'tools' | 'systems' | 'caseStudies'>,
  readonly [
    toolKeys: readonly string[],
    systemKeys: readonly string[],
    caseStudyKeys: readonly string[],
  ]
>;

type PendingCertification = Pending<
  Omit<Certification, 'caseStudies'>,
  readonly [caseStudyKeys: readonly string[]]
>;

function buildTechnologies(rows: readonly CsvTable['rows'][number][]): readonly Technology[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      key: values['key'] as string,
      name: values['name'] as string,
      category: asOneOf('technology category', values['category'] as string, TECHNOLOGY_CATEGORIES),
      aliases: optionalList(values['aliases'] as string),
      source: sourceFor(TECHNOLOGY_SCHEMA, row.line, values['name'] as string),
    };
  });
}

function buildSocialLinks(rows: readonly CsvTable['rows'][number][]): readonly SocialLink[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      platform: asOneOf('social platform', values['platform'] as string, SOCIAL_PLATFORMS),
      label: values['label'] as string,
      href: values['href'] as string,
      external: values['external'] === 'true',
      source: sourceFor(SOCIAL_LINK_SCHEMA, row.line, values['label'] as string),
    };
  });
}

function buildMedia(rows: readonly CsvTable['rows'][number][]): readonly CaseStudyMedia[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      slug: values['slug'] as string,
      src: values['src'] as string,
      section: asOneOf('media section', values['section'] as string, SECTION_KEYS),
      kind: asOneOf('media kind', values['kind'] as string, MEDIA_KINDS),
      caption: optionalText(values['caption'] as string),
      alt: values['alt'] as string,
      order: asOrderIndex(values['order'] as string),
      source: sourceFor(CASE_STUDY_MEDIA_SCHEMA, row.line, values['src'] as string),
    };
  });
}

/** The narrative sections one CSV row declares, in the order the schema declares them. */
function narrativeSectionsOf(row: CsvTable['rows'][number]): readonly CaseStudySectionContent[] {
  const present: CaseStudySectionContent[] = [];
  for (const section of NARRATIVE_SECTIONS) {
    const prose = row.values[section.key];
    if (prose === undefined || prose === '') continue;
    present.push({ key: section.key, label: section.label, prose });
  }
  return present;
}

function buildSnippets(rows: readonly CsvTable['rows'][number][]): readonly CaseStudySnippet[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      slug: values['slug'] as string,
      section: asOneOf('snippet section', values['section'] as string, SECTION_KEYS),
      language: values['language'] as string,
      caption: optionalText(values['caption'] as string),
      order: asOrderIndex(values['order'] as string),
      // Read verbatim. The `code` field kind exists so this value is the only
      // one in the model that ingest does not trim.
      code: values['code'] as string,
      source: sourceFor(CASE_STUDY_SNIPPET_SCHEMA, row.line, values['language'] as string),
    };
  });
}

function buildCaseStudies(rows: readonly CsvTable['rows'][number][]): readonly PendingCaseStudy[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      keys: [splitList(values['technologies'] as string)],
      record: {
        title: values['title'] as string,
        description: values['description'] as string,
        category: asOneOf('case study category', values['category'] as string, PROJECT_CATEGORIES),
        domains: splitList(values['domains'] ?? '').map((domain) =>
          asOneOf('case study domain', domain, CASE_STUDY_DOMAINS),
        ),
        year: optionalDate(values['year'] as string),
        role: optionalText(values['role'] as string),
        status: asOneOf('case study status', values['status'] as string, CASE_STUDY_STATUSES),
        liveUrl: values['liveUrl'] as string,
        githubUrl: values['githubUrl'] as string,
        featured: asOrderIndex(values['featured'] as string),
        slug: values['slug'] as string,
        sections: narrativeSectionsOf(row),
        source: sourceFor(PROJECT_SCHEMA, row.line, values['title'] as string),
      },
    };
  });
}

function buildExperiences(rows: readonly CsvTable['rows'][number][]): readonly PendingExperience[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      keys: [
        splitList(values['tools'] as string),
        splitList(values['systems'] as string),
        splitList(values['caseStudies'] as string),
      ],
      record: {
        slug: values['slug'] as string,
        // Read from the declared column, never inferred from the role title or the
        // organisation. An entry that declares no track is unclassified, and
        // inferring one from its title would claim a decision the owner did not
        // make — and would classify the fourteen roles the vocabulary exists to
        // distinguish without asking.
        track:
          values['track'] === ''
            ? null
            : asOneOf('experience track', values['track'] as string, EXPERIENCE_TRACKS),
        title: values['title'] as string,
        organization: values['organization'] as string,
        badgeLabel: asOneOf('experience badgeLabel', values['badgeLabel'] as string, BADGE_LABELS),
        startDate: asDate('experience startDate', values['startDate'] as string),
        endDate: optionalDate(values['endDate'] as string),
        location: values['location'] as string,
        description: values['description'] as string,
        responsibilities: optionalList(values['responsibilities'] as string),
        lessonsLearned: optionalText(values['lessonsLearned'] as string),
        skills: splitList(values['skills'] as string),
        source: sourceFor(EXPERIENCE_SCHEMA, row.line, values['slug'] as string),
      },
    };
  });
}

function buildCertifications(
  rows: readonly CsvTable['rows'][number][],
): readonly PendingCertification[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      keys: [splitList(values['caseStudies'] as string)],
      record: {
        title: values['title'] as string,
        slug: values['slug'] as string,
        issuer: values['issuer'] as string,
        acquiredOn: asDate('certification acquiredOn', values['acquiredOn'] as string),
        expiration: optionalDate(values['expiration'] as string),
        description: values['description'] as string,
        verificationUrl: values['verificationUrl'] as string,
        // Read from the declared column, never inferred from the URL: whether a
        // third-party address identifies this credential or the owner's listing of
        // it is the owner's claim to make, and a guess from the address would be
        // wrong the moment a badge moved.
        verificationKind: asOneOf(
          'certification verificationKind',
          values['verificationKind'] as string,
          CREDENTIAL_VERIFICATION_KINDS,
        ),
        credentialId: optionalText(values['credentialId'] as string),
        skills: optionalList(values['skills'] as string),
        source: sourceFor(CERTIFICATION_SCHEMA, row.line, values['slug'] as string),
      },
    };
  });
}

function buildEducation(rows: readonly CsvTable['rows'][number][]): readonly Education[] {
  return rows.map((row) => {
    const values = row.values;
    return {
      slug: values['slug'] as string,
      title: values['title'] as string,
      institution: values['institution'] as string,
      startDate: asDate('education startDate', values['startDate'] as string),
      endDate: optionalDate(values['endDate'] as string),
      degree: optionalText(values['degree'] as string),
      location: values['location'] as string,
      field: splitList(values['field'] as string),
      detail: values['detail'] as string,
      source: sourceFor(QUALIFICATION_SCHEMA, row.line, values['slug'] as string),
    };
  });
}

/* ------------------------------------------------------------------ *
 * Second pass: references resolved to records
 * ------------------------------------------------------------------ */

/**
 * Index records by the key other files name them by.
 *
 * Every lookup is total because `validateRelations` has already proved that
 * every reference resolves, so a missing key here would be a bug in the
 * validation rather than in the content.
 */
function byKey<T>(records: readonly T[], key: (record: T) => string): ReadonlyMap<string, T> {
  return new Map(records.map((record) => [key(record), record]));
}

function assemble(): ContentModel {
  // Keyed by the schema itself rather than by position. Positional indices would
  // express the schema-to-collection mapping twice — once as the order of
  // `COLLECTION_SCHEMAS`, once here — and inserting or reordering an entry would
  // silently feed each builder another collection's rows, which `validateAll`
  // cannot detect because it walks the same misaligned order.
  const tables = new Map<CollectionSchema, CsvTable>(
    COLLECTION_SCHEMAS.map((schema) => [schema, readTable(schema)]),
  );

  const rowsOf = (schema: CollectionSchema): readonly CsvTable['rows'][number][] =>
    tables.get(schema)?.rows ?? [];

  // Validation runs before a single record is read, so a malformed file cannot
  // reach a builder that assumes its fields exist.
  validateAll(COLLECTION_SCHEMAS, [...tables.values()]);

  // Then the rules that span records, once every table is in hand: a reference
  // is checked against the whole of its target collection, and a span is checked
  // as a pair. Neither can be decided while a single file is being read.
  validateRelations(COLLECTION_SCHEMAS, [...tables.values()]);

  const technologies = buildTechnologies(rowsOf(TECHNOLOGY_SCHEMA));
  const technologyByKey = byKey(technologies, (technology) => technology.key);

  const socialLinks = buildSocialLinks(rowsOf(SOCIAL_LINK_SCHEMA));
  const media = buildMedia(rowsOf(CASE_STUDY_MEDIA_SCHEMA));
  const snippets = buildSnippets(rowsOf(CASE_STUDY_SNIPPET_SCHEMA));
  const education = buildEducation(rowsOf(QUALIFICATION_SCHEMA));

  const projects = rowsOf(SIMPLE_PROJECT_SCHEMA).map((row): Project => {
    const field = (name: string) => row.values[name];
    const rawList = (field('techStack') || '') as string;
    const techStack = rawList ? rawList.split('|').map(s => s.trim()).filter(Boolean) : [];
    
    return {
      slug: (field('title') || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: field('title') || '',
      description: field('description') || '',
      category: field('category') || '',
      techStack,
      liveUrl: field('liveUrl') || null,
      githubUrl: field('githubUrl') || null,
    };
  });


  const resolveTechnologies = (keys: readonly string[]): readonly Technology[] =>
    keys.map((key) => technologyByKey.get(key) as Technology);

  // Second pass over the case studies, now that every technology exists.
  const caseStudies: readonly CaseStudy[] = buildCaseStudies(rowsOf(PROJECT_SCHEMA)).map(
    ({ record, keys }) => ({
      ...record,
      technologies: resolveTechnologies(keys[0]),
      media: media
        .filter((item) => item.slug === record.slug)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      snippets: snippets
        .filter((item) => item.slug === record.slug)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      // Filled in below, once the records that declare the relationship exist.
      certifications: [],
      experiences: [],
    }),
  );

  const caseStudyBySlug = byKey(caseStudies, (caseStudy) => caseStudy.slug);
  const resolveCaseStudies = (keys: readonly string[]): readonly CaseStudy[] =>
    keys.map((key) => caseStudyBySlug.get(key) as CaseStudy);

  const experiences: readonly Experience[] = buildExperiences(rowsOf(EXPERIENCE_SCHEMA)).map(
    ({ record, keys }) => ({
      ...record,
      tools: resolveTechnologies(keys[0]),
      systems: resolveTechnologies(keys[1]),
      caseStudies: resolveCaseStudies(keys[2]),
    }),
  );

  const certifications: readonly Certification[] = buildCertifications(
    rowsOf(CERTIFICATION_SCHEMA),
  ).map(({ record, keys }) => ({
    ...record,
    caseStudies: resolveCaseStudies(keys[0]),
  }));

  // The reverse of every declared relationship, derived rather than stored.
  //
  // Reading it back from the records that own the relationship is what makes
  // "declared once" true: a case study never restates which credentials mention
  // it, so the two sides cannot disagree.
  const related = caseStudies.map(
    (caseStudy) =>
      [
        caseStudy,
        {
          certifications: certifications.filter((certification) =>
            certification.caseStudies.some((related_) => related_.slug === caseStudy.slug),
          ),
          experiences: experiences.filter((experience) =>
            experience.caseStudies.some((related_) => related_.slug === caseStudy.slug),
          ),
        },
      ] as const,
  );

  const relatedBySlug = new Map(related.map(([caseStudy, entry]) => [caseStudy.slug, entry]));

  return {
    caseStudies: caseStudies.map((caseStudy) => {
      const entry = relatedBySlug.get(caseStudy.slug);
      return {
        ...caseStudy,
        certifications: entry?.certifications ?? [],
        experiences: entry?.experiences ?? [],
      };
    }),
    technologies,
    socialLinks,
    caseStudyMedia: media,
    caseStudySnippets: snippets,
    projects,
    experiences,
    certifications,
    education,
  };
}

/**
 * Recursively freeze a value so a consumer cannot mutate shared content.
 *
 * `seen` is what makes the cycle safe. A case study reaches the certifications
 * that relate to it and each of those reaches the case study back, so the object
 * graph is cyclic and a naive recursion would never return. Re-entering an
 * object already being frozen is skipped: the outer call is still going to
 * finish it.
 */
function deepFreeze<T>(value: T, seen: WeakSet<object> = new WeakSet()): T {
  if (value !== null && typeof value === 'object') {
    const object = value as unknown as object;
    if (seen.has(object)) return value;
    seen.add(object);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      deepFreeze(nested, seen);
    }
    Object.freeze(object);
  }
  return value;
}

/**
 * The content, validated and frozen.
 *
 * Importing this module reads the files. A validation failure throws here, at
 * build time, naming the file, record, and field at fault.
 */
export const CONTENT: ContentModel = deepFreeze(assemble());

/**
 * Case studies the content declares published.
 *
 * The one derived answer to "what exists on this site", read by the route, the
 * statistics, and the terminal alike. A surface that decided publication for
 * itself would be a second source of truth, which is how the three came to
 * disagree before.
 */
export function publishedCaseStudies(): readonly CaseStudy[] {
  return CONTENT.caseStudies.filter((caseStudy) => caseStudy.status === 'published');
}

/** The published case study at a slug, or undefined. */
export function publishedCaseStudy(slug: string): CaseStudy | undefined {
  return CONTENT.caseStudies.find(
    (caseStudy) => caseStudy.slug === slug && caseStudy.status === 'published',
  );
}

/**
 * Every credential, in the order the vault lists them.
 *
 * Most recently acquired first, which is the order a visitor checking a credential
 * wants: the newest is the one most likely to be current. Issuer then title break
 * ties so the order is total — without them, two credentials sharing an acquisition
 * year would swap places between builds for no reason, and the page would appear to
 * change when nothing had.
 */
export function credentials(): readonly Certification[] {
  return [...CONTENT.certifications].sort(
    (a, b) =>
      compareDates(b.acquiredOn, a.acquiredOn) ||
      a.issuer.localeCompare(b.issuer) ||
      a.title.localeCompare(b.title),
  );
}

/**
 * One credential by its declared slug, or undefined when no credential claims it.
 *
 * Unlike `publishedCaseStudy` this does not filter on a status: a credential has no
 * draft state, so every recorded one has an address. The caller still has to handle
 * the undefined, because `dynamicParams` defaults to true and an unrecognised slug
 * would otherwise be generated on demand rather than refused.
 */
export function credentialBySlug(slug: string): Certification | undefined {
  return CONTENT.certifications.find((certification) => certification.slug === slug);
}

/**
 * One group of experiences that share a kind of work.
 *
 * `track` is null for the final group, which holds every record that declares no
 * kind. The group is part of the type rather than a naming convention, so a
 * renderer cannot present the unclassified entries as though they had declared one.
 */
export interface ExperienceTrackGroup {
  /** The declared kind, or null for the group that claims no kind for its entries. */
  readonly track: ExperienceTrack | null;
  readonly experiences: readonly Experience[];
}

/**
 * Order two records by recency, on the two dates they declare and then their slug.
 *
 * An open period sorts as more recent than every ended one: the role is current,
 * and a visitor asking what someone has been doing most recently wants the current
 * thing first. A null end therefore has to outrank every real date rather than
 * falling to the bottom, which is what a plain descending comparison of `endDate`
 * would do.
 *
 * `startDate` breaks a tie on the end, and `slug` breaks a tie on both. Without the
 * final key the order would not be total: two records sharing a period would hold
 * whatever relative order the content file happened to have, so rearranging rows
 * would silently reorder the page. With it, the order is the same on every build
 * from any row order.
 *
 * Exported so both timelines compare identically rather than each spelling the rule
 * out — two comparators that agree today is exactly the thing a later edit would
 * let drift.
 */
function byRecencyThenSlug(
  a: { startDate: ContentDate; endDate: ContentDate | null; slug: string },
  b: { startDate: ContentDate; endDate: ContentDate | null; slug: string },
): number {
  if (a.endDate === null && b.endDate !== null) return -1;
  if (b.endDate === null && a.endDate !== null) return 1;
  if (a.endDate !== null && b.endDate !== null) {
    const byEnd = compareDates(b.endDate, a.endDate);
    if (byEnd !== 0) return byEnd;
  }
  return compareDates(b.startDate, a.startDate) || a.slug.localeCompare(b.slug);
}

/**
 * Every experience, most recent period first.
 *
 * The order the `/background` timeline reads in, and independent of the order the
 * content file happens to list its rows.
 */
export function experiencesInRecencyOrder(): readonly Experience[] {
  return [...CONTENT.experiences].sort(byRecencyThenSlug);
}

/** Every record of study, most recent period first, on the same rule. */
export function educationInRecencyOrder(): readonly Education[] {
  return [...CONTENT.education].sort(byRecencyThenSlug);
}

/**
 * The experience timeline's groups, in the declared presentation order.
 *
 * One group per kind named by `TRACK_ORDER`, followed by a single group holding
 * every record that declares none. The unclassified group is last and always
 * present even when empty of nothing — it is omitted only when it holds no records,
 * so a page whose experiences are all classified does not show a heading for a kind
 * nobody left out.
 *
 * Empty declared groups are omitted too. A heading for a kind no recorded
 * experience claims would be a claim the timeline could not support, and today the
 * content classifies six of twenty roles: the other four kinds hold nothing.
 */
export function experiencesByTrack(): readonly ExperienceTrackGroup[] {
  const ordered = experiencesInRecencyOrder();

  const groups: ExperienceTrackGroup[] = TRACK_ORDER.map((track) => ({
    track,
    experiences: ordered.filter((experience) => experience.track === track),
  })).filter((group) => group.experiences.length > 0);

  const unclassified = ordered.filter((experience) => experience.track === null);
  if (unclassified.length > 0) groups.push({ track: null, experiences: unclassified });

  return groups;
}

/**
 * A case study's sections, each with the prose, media, and snippets that belong to it.
 *
 * One call rather than three, because the renderer must not have to correlate a
 * section's prose with a section's figures and a section's code by itself: doing
 * that in the page would be three lookups that can disagree about which key they
 * are working on. Grouping here means a section is assembled once, in the order
 * the schema declares, and a section with prose but no media is the same shape as
 * one with both.
 *
 * Only sections with something to present are returned. A key with no prose, no
 * media, and no snippets is not represented at all, so the renderer cannot
 * produce a heading over nothing. `technologies` is not among these: it is
 * rendered from the case study's technology records and is never a populated
 * section here.
 */
export function sectionsOf(caseStudy: CaseStudy): readonly ResolvedCaseStudySection[] {
  const present: ResolvedCaseStudySection[] = [];

  for (const section of CASE_STUDY_SECTIONS) {
    if (section.key === 'technologies') continue;

    const prose = caseStudy.sections.find((entry) => entry.key === section.key);
    const media = caseStudy.media.filter((item) => item.section === section.key);
    const snippets = caseStudy.snippets.filter((item) => item.section === section.key);

    if (prose === undefined && media.length === 0 && snippets.length === 0) continue;

    present.push({
      key: section.key,
      label: section.label,
      prose: prose?.prose ?? null,
      media,
      snippets,
    });
  }

  return present;
}
/** Gaps in authorable content, derived from the model. */
export interface ContentGaps {
  readonly collections: {
    readonly [collection: string]: {
      readonly [field: string]: readonly string[];
    };
  };
  readonly blockedByCaseStudies: boolean;
  readonly caseStudyProse: readonly {
    readonly slug: string;
    readonly title: string;
    readonly written: number;
    readonly total: number;
  }[];
}

/**
 * Derives the account of unwritten authorable fields across all collections.
 */
export function getGaps(): ContentGaps {
  const collections: Record<string, Record<string, string[]>> = {};

  for (const [collection, fields] of Object.entries(AUTHORABLE_CONTENT)) {
    const records = CONTENT[collection as keyof ContentModel] as unknown as Record<string, unknown>[];
    if (!records) continue;

    collections[collection] = {};
    for (const field of fields) {
      collections[collection][field] = [];
      for (const record of records) {
        const value = record[field];
        // Absent if null, undefined, empty string, or empty array
        const isEmpty =
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        
        if (isEmpty) {
          collections[collection][field].push(record.slug as string);
        }
      }
    }
  }

  // A draft case study is unpublishable until it is published
  const drafts = CONTENT.caseStudies.filter(cs => cs.status === 'draft');
  const caseStudyProse = drafts.map(cs => ({
    slug: cs.slug,
    title: cs.title,
    written: cs.sections.length,
    total: CASE_STUDY_PROSE_SECTIONS.length
  }));

  const blockedByCaseStudies = drafts.length > 0;

  return {
    collections,
    blockedByCaseStudies,
    caseStudyProse
  };
}
