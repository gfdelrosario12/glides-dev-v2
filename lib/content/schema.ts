/**
 * Declarative schema for the content files.
 *
 * Every rule that the site relies on is declared here once, and enforced at
 * build time by `validate.ts`. The point of doing this at build time is that a
 * content mistake has exactly one possible moment to be caught: before it is
 * published. A missing field that reaches a page is a blank space in the
 * layout and a sentence that reads as though it were complete.
 *
 * Constrained values are declared as `as const` arrays and their types are
 * derived from them. That keeps the runtime list and the compile-time union
 * from drifting: adding a category to the data is a one-word edit here, and it
 * is the same edit that makes the value legal in code.
 *
 * Fields are constrained to what the data actually needs. A validation layer
 * that can express everything is a layer nobody trusts enough to rely on.
 */

import type { ContentDate } from './date';
// Extensioned so this module can be loaded on its own by `node --test`, the way
// `csv.ts` is. Node's ESM resolver requires the extension; TypeScript accepts it
// because `allowImportingTsExtensions` is on.
import { parseDate } from './date.ts';

/* ------------------------------------------------------------------ *
 * Constrained value sets
 * ------------------------------------------------------------------ */
/** Case-study categories present in the data. */
export const PROJECT_CATEGORIES = ['Academic', 'Freelance', 'Personal'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * The technical domains a case study may belong to.
 *
 * A second, independent axis from `PROJECT_CATEGORIES`, not a replacement for it.
 * A category states the relationship the work was done under; a domain states
 * what the work is about. Neither is derived from the other, and the two are
 * offered to a visitor as two separate filters, because a case study has both
 * facts and forcing it onto one axis loses the other.
 *
 * Lowercase and hyphen-separated because the column is a slug-shaped list
 * resolved against this set, in the same way a reference resolves against its
 * collection. The vocabulary deliberately overlaps `FOCUS_AREAS` in
 * `content/site.ts` — infrastructure, cloud, cybersecurity, networking — so the
 * site speaks one language about direction.
 *
 * `it-operations` is deliberately absent. It is a focus area, evidenced by an
 * internship and two experience-skill tokens, and it is a claim about the
 * owner's practice rather than a thing any recorded case study is about; adding
 * it here would ship a filter that matches nothing. Adding it later, or any
 * other domain, is a one-word edit to this list — the same edit that makes the
 * value legal in code.
 */
export const CASE_STUDY_DOMAINS = [
  'infrastructure',
  'cloud',
  'cybersecurity',
  'networking',
  'devops',
  'software',
  'iot',
] as const;
export type CaseStudyDomain = (typeof CASE_STUDY_DOMAINS)[number];

/**
 * How each domain is written when it is shown to a visitor.
 *
 * A second declaration, kept honest by the compiler rather than by convention:
 * the `Record<CaseStudyDomain, string>` key is the union derived from the list
 * above, so adding a domain without writing its label fails type checking
 * instead of rendering as `undefined`. Without this the archive would show the
 * raw value — `iot`, `devops` — because `IoT` and `DevOps` cannot be produced
 * from `iot` and `devops` by any rule that does not also mis-spell them.
 */
export const CASE_STUDY_DOMAIN_LABELS: Readonly<Record<CaseStudyDomain, string>> = {
  infrastructure: 'Infrastructure',
  cloud: 'Cloud',
  cybersecurity: 'Cybersecurity',
  networking: 'Networking',
  devops: 'DevOps',
  software: 'Software',
  iot: 'IoT',
};

/**
 * How one domain is written for a visitor.
 *
 * Exported as a function as well as the map so a caller holding a
 * `CaseStudyDomain` gets the label without indexing the record itself — the cast
 * this replaces was the only place in the codebase that could name a domain and
 * misspell it.
 */
export function domainLabel(domain: CaseStudyDomain): string {
  return CASE_STUDY_DOMAIN_LABELS[domain];
}

/**
 * Whether a case study is published.
 *
 * A closed set of two, because those are the only two states a page can be in.
 * The distinction is load-bearing: `published` means the case study has an
 * address, appears in counts, and can be navigated to, and `draft` means it has
 * none of those. There is deliberately no third state and no default — a record
 * that does not say which it is has not made the decision, and that fails the
 * build rather than defaulting to one.
 */
export const CASE_STUDY_STATUSES = ['published', 'draft'] as const;
export type CaseStudyStatus = (typeof CASE_STUDY_STATUSES)[number];

/**
 * The kinds of work an experience record represents.
 *
 * Five values, each of which a reader could act on: this says whether the entry
 * belongs under professional work, technical work, leadership, community work, or
 * event operations. Two former values are deliberately gone. `organizational` held
 * fourteen of the twenty recorded rows across community leadership, technical
 * direction, and event operations — four different kinds of work behind one word
 * a reader could not use. `competitive` is covered by `technical`, which says the
 * same thing about a hackathon entry.
 *
 * Kept alongside `badgeLabel` rather than merged into it, because the two answer
 * different questions: a track says what kind of work it was, and `badgeLabel`
 * says what the role was doing — leading an organisation, belonging to one,
 * volunteering. Collapsing them would lose the difference between a person who
 * led and a person who attended.
 *
 * Every value here is held by at least one recorded experience. A declared kind
 * no record claims is a signal the vocabulary is wider than the record set, and
 * is reviewed rather than left to accumulate.
 */
export const EXPERIENCE_TRACKS = [
  'professional',
  'technical',
  'leadership',
  'community',
  'event-operations',
] as const;
export type ExperienceTrack = (typeof EXPERIENCE_TRACKS)[number];

/**
 * The order the tracks are presented in.
 *
 * Declared rather than sorted, because alphabetical order would put `community`
 * before `event-operations` before `leadership` before `professional` before
 * `technical` — an accident of spelling rather than a shape anyone chose. This
 * sequence reads as intended: the two individual-contributor kinds first, then
 * leadership, then the two kinds of work carried on behalf of a community.
 *
 * Typed as `ExperienceTrack[]` so it cannot name a kind the vocabulary does not
 * declare: the presentation order and the vocabulary are held together by the
 * compiler rather than by the two happening to agree today.
 *
 * The unclassified group is not here. It is not a track, and it renders last, so
 * an entry that declares no kind never appears to lead the timeline.
 */
export const TRACK_ORDER: readonly ExperienceTrack[] = EXPERIENCE_TRACKS;

/**
 * How each kind of work is written for a visitor.
 *
 * The same two-part declaration as `CASE_STUDY_DOMAIN_LABELS`, for the same
 * reason: `Record<ExperienceTrack, string>` is checked in the direction that
 * matters, so adding a track without writing its label is a compile error here
 * rather than an `undefined` heading at runtime. Nothing can produce "Event
 * Operations" from `event-operations` by a rule that does not also mis-spell
 * `iT` and `cI`, so the label is written out.
 *
 * `professional` and `technical` alone would read as claims rather than as names —
 * "Professional" over a group of internships says the reader has been judged — so
 * both are written as the kind of work they name.
 */
export const EXPERIENCE_TRACK_LABELS: Readonly<Record<ExperienceTrack, string>> = {
  professional: 'Professional work',
  technical: 'Technical work',
  leadership: 'Leadership',
  community: 'Community work',
  'event-operations': 'Event operations',
};

/**
 * How one kind of work is written for a visitor.
 *
 * Exported as a function as well as the map so a caller holding an
 * `ExperienceTrack` gets the label without indexing the record itself.
 */
export function trackLabel(track: ExperienceTrack): string {
  return EXPERIENCE_TRACK_LABELS[track];
}

/**
 * What the group of records that declare no kind is called.
 *
 * A named constant rather than a literal at the call site: the timeline states this
 * in two places — the group's heading and the sentence above it — and the two have
 * to agree, because a heading reading "Unclassified" under an introduction that says
 * "unclassified" is the same fact said twice, not two facts.
 */
export const UNCLASSIFIED_TRACK_LABEL = 'Unclassified';

/** Badge labels present in the data. */
export const BADGE_LABELS = [
  'Internship',
  'Leadership',
  'Member',
  'Membership',
  'Volunteering',
] as const;
export type BadgeLabel = (typeof BADGE_LABELS)[number];

/**
 * Technology categories present in the data.
 *
 * Deliberately wider than "language | framework | platform". The recorded stacks
 * name a field (`IoT`) and a practice (`Version Control Systems`) alongside the
 * usual languages and frameworks, and a category set that could not hold those
 * two would have forced the migration to rename values the owner wrote. A
 * category is a statement about what kind of thing the record is, so it has to
 * be able to say "this is not a specific product either".
 */
export const TECHNOLOGY_CATEGORIES = [
  'language',
  'framework',
  'library',
  'database',
  'platform',
  'model',
  'field',
  'practice',
] as const;
export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

/**
 * Social platforms present in the data.
 *
 * Declared rather than free text so the terminal and the navigations can group
 * or filter by platform without matching on a label, and so a typo in a platform
 * name fails the build instead of producing a chip that says "githb".
 */
export const SOCIAL_PLATFORMS = ['github', 'linkedin', 'linktree', 'email'] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

/* ------------------------------------------------------------------ *
 * Collections
 * ------------------------------------------------------------------ */

/**
 * Every collection that can be named as a reference target.
 *
 * A reference states which collection it points into by this id rather than by
 * naming the schema object, so that declaring a field on a collection does not
 * require that collection to be declared first. Resolution maps the id to its
 * schema once every table has been read.
 */
export const COLLECTION_IDS = [
  'caseStudies',
  'technologies',
  'caseStudyMedia',
  'caseStudySnippets',
  'socialLinks',
  'experiences',
  'certifications',
  'education',
] as const;
export type CollectionId = (typeof COLLECTION_IDS)[number];

/* ------------------------------------------------------------------ *
 * Field kinds
 * ------------------------------------------------------------------ */

/** How a single field is validated. */
export type FieldKind =
  /** Must be present and non-empty. */
  | { readonly kind: 'text'; readonly optional?: boolean }
  /** Must be one of the listed values. */
  | { readonly kind: 'oneOf'; readonly values: readonly string[]; readonly optional?: boolean }
  /**
   * Must be a ` | `-separated list whose every entry is one of the listed values.
   *
   * A distinct kind from `oneOf` because a list and a single value are different
   * claims, exactly as `slugRefList` is a distinct kind from `slugRef`: one case
   * study belongs to one category but may belong to several domains, and a kind
   * that could express only one of those would force the content to flatten a
   * real fact. Every entry is checked, so an unrecognised domain anywhere in the
   * cell fails the build rather than the valid entries beside it surviving.
   */
  | {
      readonly kind: 'oneOfList';
      readonly values: readonly string[];
      readonly optional?: boolean;
    }
  /** Must parse as an http or https URL. */
  | { readonly kind: 'url'; readonly optional?: boolean }
  /**
   * Must be an http or https URL, or a `mailto:` address.
   *
   * A separate kind from `url` because the two are not the same claim. `url`
   * names a page this site could have linked to and checks for embedded
   * credentials in the authority; a `mailto:` is a destination that opens the
   * visitor's mail application, and it would fail `url`'s protocol rule for
   * being exactly what it is. Weakening `url` to admit it would lose the check
   * that an image source or a case-study destination is really a web address.
   */
  | { readonly kind: 'link'; readonly optional?: boolean }
  /**
   * Must be a date in `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` form, checked for real
   * calendar validity rather than shape alone.
   */
  | { readonly kind: 'date'; readonly optional?: boolean }
  /** Must be empty, or a positive integer used as a display order. */
  | { readonly kind: 'orderIndex'; readonly optional?: boolean }
  /** Must be non-empty, and is split into a list on the ` | ` separator. */
  | { readonly kind: 'list'; readonly optional?: boolean }
  /**
   * Must be a single lowercase hyphen-separated slug naming a record in
   * `collection`.
   *
   * Checked for shape here and for existence in a later pass, because existence
   * needs every table read. Used where one record points at exactly one other,
   * such as a media item naming the case study it belongs to.
   */
  | { readonly kind: 'slugRef'; readonly collection: CollectionId; readonly optional?: boolean }
  /**
   * Must name one of the declared case-study sections.
   *
   * A distinct kind from `oneOf` because the value is not free text: it is a
   * reference into the one declared section set, and the failure has to say so.
   * A `oneOf` over the same names would report an equivalent string but nothing
   * would tie the two lists together, and they would be free to drift.
   */
  | { readonly kind: 'sectionRef'; readonly optional?: boolean }
  /**
   * Required text whose whitespace is content and is not normalised.
   *
   * Used only for a code snippet's body. See the `code` case in `checkField`.
   */
  | { readonly kind: 'code'; readonly optional?: boolean }
  /**
   * Must be a ` | `-separated list whose every entry is a slug naming a record
   * in `collection`.
   *
   * A list of references rather than a reference to a list: a relationship
   * between two records is stated one entry at a time, and packing several
   * references into one cell would need a nested structure with its own
   * separator, which is the fragile construction the CSV parser exists to avoid.
   */
  | {
      readonly kind: 'slugRefList';
      readonly collection: CollectionId;
      readonly optional?: boolean;
    }
  /**
   * Must be a lowercase, hyphen-separated addressable segment.
   *
   * A slug is part of a published address, so it is stricter than `text`: a
   * capital letter, space, or underscore in one produces a URL that has to be
   * escaped, and renaming it later would break every link already handed out.
   */
  | { readonly kind: 'slug'; readonly optional?: boolean };

/**
 * Field kinds whose value must be unique across a collection's records.
 *
 * `slugRef` is deliberately absent: several media items name the same case
 * study, which is the whole point of a media item.
 */
export const UNIQUELY_ADDRESSED_KINDS = ['orderIndex', 'slug'] as const;

export type FieldSpec = FieldKind;

/**
 * A pair of date fields whose order the content must respect.
 *
 * Declared rather than hardcoded in the validator, because which pairs have an
 * order is a fact about a collection, not about validation.
 */
export interface DateOrder {
  /** The earlier field's name. */
  readonly start: string;
  /** The later field's name. Absent means the span is open and no check applies. */
  readonly end: string;
}

export interface CollectionSchema {
  /** Stable name, used by references and by error messages. */
  readonly id: CollectionId;
  /** File name under `content/`, used in every error message. */
  readonly file: string;
  /** Singular noun for a record, used in error messages. */
  readonly record: string;
  /** Field name to rule, in header order. */
  readonly fields: Record<string, FieldKind>;
  /** Field holding the record's human-readable identifier, for error messages. */
  readonly identifier: string;
  /**
   * Field whose value names this record from another file.
   *
   * What a `slugRef` into this collection is matched against. Set to the
   * addressable segment for anything reachable by address, and to the
   * identifier otherwise; nothing references the latter today.
   */
  readonly key: string;
  /** A start/end date pair whose order the content must respect, if it has one. */
  readonly dateOrder?: DateOrder;
}

/* ------------------------------------------------------------------ *
 * The schemas
 * ------------------------------------------------------------------ */

export const TECHNOLOGY_SCHEMA: CollectionSchema = {
  id: 'technologies',
  file: 'technologies.csv',
  record: 'technology',
  identifier: 'name',
  key: 'key',
  fields: {
    key: { kind: 'slug' },
    name: { kind: 'text' },
    category: { kind: 'oneOf', values: TECHNOLOGY_CATEGORIES },
    aliases: { kind: 'list', optional: true },
  },
};

export const SOCIAL_LINK_SCHEMA: CollectionSchema = {
  id: 'socialLinks',
  file: 'social-links.csv',
  record: 'social link',
  identifier: 'label',
  key: 'href',
  fields: {
    platform: { kind: 'oneOf', values: SOCIAL_PLATFORMS },
    label: { kind: 'text' },
    href: { kind: 'link' },
    /**
     * Declared rather than inferred from the scheme, so that a `mailto:`
     * destination is recorded as opening the visitor's mail application instead
     * of leaving the site.
     */
    external: { kind: 'oneOf', values: ['true', 'false'] },
  },
};

/**
 * The ten sections a case study is documented in, in the order they read.
 *
 * Declared here, beside the other closed sets, because this list is referenced
 * from three places that must not each hold their own copy: the page that
 * renders the sections, the `section` field on media and snippet records, and
 * the completeness rule that decides whether a case study may be published. The
 * key type is derived from this list, so a name it does not contain cannot be
 * named by a record or reached by the renderer at all.
 *
 * Nine of the ten hold authored prose. `technologies` does not: it renders the
 * case study's resolved technology records, so it is satisfied by declaring a
 * technology rather than by writing a paragraph about one. That asymmetry is
 * deliberate and is stated in the completeness rule rather than left to be
 * inferred, because treating all ten alike would demand the same information be
 * written twice, in two forms that could disagree.
 */
export const CASE_STUDY_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'problem', label: 'Problem' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'implementation', label: 'Implementation' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'security', label: 'Security' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'results', label: 'Results' },
  { key: 'lessonsLearned', label: 'Lessons learned' },
  { key: 'technologies', label: 'Technologies' },
] as const;

/** One declared section: the key records reference, and the label the page shows. */
export type CaseStudySection = (typeof CASE_STUDY_SECTIONS)[number]['key'];

/** The sections whose content is authored prose. */
export type CaseStudyProseSection = Exclude<CaseStudySection, 'technologies'>;

/**
 * The prose sections, in order.
 *
 * The element type is annotated rather than inferred, because a bare `filter`
 * widens `key` back to the full union and the point of excluding `technologies`
 * is that it must be unreachable here.
 */
export const CASE_STUDY_PROSE_SECTIONS: readonly {
  readonly key: CaseStudyProseSection;
  readonly label: string;
}[] = CASE_STUDY_SECTIONS.filter((section) => section.key !== 'technologies');

/** How media may declare itself, so a photograph is never inferred to be a diagram. */
export const MEDIA_KINDS = ['diagram', 'photo'] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

/**
 * What a recorded verification destination actually identifies.
 *
 * The distinction is between a page that verifies *this* credential and a page that
 * lists the owner's credentials. Both are honest places to send a visitor and neither
 * is a stronger claim than the other — but reading them the same way would present a
 * link to a shared profile listing as though it verified the credential beside it,
 * which is the specific dishonesty this change exists to remove.
 *
 * `direct` is claimed only by the owner, never inferred from the URL. A build that
 * inspected the destination to decide would be guessing at a third party's URL shape,
 * and the answer would be wrong the moment the owner moved a badge.
 */
export const CREDENTIAL_VERIFICATION_KINDS = ['direct', 'profile'] as const;
export type CredentialVerificationKind = (typeof CREDENTIAL_VERIFICATION_KINDS)[number];

/**
 * The subject areas a credential covers.
 *
 * Declared empty and shipped that way: the vocabulary is editorial, and authoring it
 * is the owner's. The column validates against this list, so populating it later is a
 * content edit with no schema change — and the list stays the single definition rather
 * than free text that would accept a typo.
 */
export const CREDENTIAL_SKILLS: readonly string[] = [];

/**
 * The section keys as a plain value list.
 *
 * For the runtime reference checks that need a list to test membership against.
 * Derived from the declaration rather than restated, for the same reason the
 * labels are: a second list of section names is a second thing that can drift.
 */
export const SECTION_KEYS: readonly CaseStudySection[] = CASE_STUDY_SECTIONS.map(
  (section) => section.key,
);

/**
 * The label for a declared section key.
 *
 * Cast from `Object.fromEntries`, which cannot prove it produced every key. The
 * cast is checked in the direction that matters: `CaseStudySection` is the union
 * derived from the list above, so a key missing from the object literal would be
 * a compile error here rather than an `undefined` label at runtime.
 */
export const SECTION_LABELS: Readonly<Record<CaseStudySection, string>> = Object.freeze(
  Object.fromEntries(
    CASE_STUDY_SECTIONS.map((section) => [section.key, section.label]),
  ) as Record<CaseStudySection, string>,
);

export const CASE_STUDY_MEDIA_SCHEMA: CollectionSchema = {
  id: 'caseStudyMedia',
  file: 'case-study-media.csv',
  record: 'media item',
  identifier: 'src',
  key: 'src',
  fields: {
    slug: { kind: 'slugRef', collection: 'caseStudies' },
    src: { kind: 'url' },
    /**
     * Required. An image whose meaning is carried only by its pixels fails the
     * build, which is the same stance the accessibility requirements take
     * elsewhere in the system.
     */
    alt: { kind: 'text' },
    /**
     * Which section this figure belongs to.
     *
     * Required, so a figure cannot be declared without somewhere to appear. The
     * page renders media inside the section that names it, which is what lets a
     * diagram lead the Architecture section specifically rather than sitting in
     * a gallery that is gathered after the narrative.
     */
    section: { kind: 'sectionRef' },
    /**
     * Declared rather than inferred, so a photograph is never presented as a
     * diagram because of how it happens to look or what it is named.
     */
    kind: { kind: 'oneOf', values: MEDIA_KINDS },
    /** Optional: a caption is content, and an absent one is simply omitted. */
    caption: { kind: 'text', optional: true },
    order: { kind: 'orderIndex' },
  },
};

/**
 * Code snippets, one row per contiguous block.
 *
 * A collection rather than a column inside the narrative sections, because a
 * snippet is a different kind of content from prose: it is not trimmed, it
 * declares the language it is written in, and it carries an order among its
 * siblings. Putting it in a column would mean either losing the language or
 * packing several blocks into one cell behind a delimiter that real code could
 * contain.
 */
export const CASE_STUDY_SNIPPET_SCHEMA: CollectionSchema = {
  id: 'caseStudySnippets',
  file: 'case-study-snippets.csv',
  record: 'snippet',
  identifier: 'language',
  key: 'slug',
  fields: {
    slug: { kind: 'slugRef', collection: 'caseStudies' },
    /** The section this snippet illustrates. */
    section: { kind: 'sectionRef' },
    /**
     * Shown with the code so a visitor knows what they are reading. Free text
     * rather than a closed set: the content names languages this project has
     * never heard of, and rejecting the row would reject the code.
     */
    language: { kind: 'text' },
    caption: { kind: 'text', optional: true },
    order: { kind: 'orderIndex' },
    /**
     * The code itself, with its whitespace left exactly as declared. A literal
     * quotation mark is written doubled in the file, as RFC 4180 requires; the
     * parser restores it, and a cell that cannot be read fails the build at the
     * position rather than yielding text that differs from what was declared.
     */
    code: { kind: 'code' },
  },
};

export const PROJECT_SCHEMA: CollectionSchema = {
  id: 'caseStudies',
  file: 'case-studies.csv',
  record: 'case study',
  identifier: 'title',
  key: 'slug',
  fields: {
    title: { kind: 'text' },
    description: { kind: 'text' },
    category: { kind: 'oneOf', values: PROJECT_CATEGORIES },
    /**
     * The technical domains this case study is about. Optional because the
     * recorded content predates the column and nothing in it states a domain;
     * left empty rather than inferred from the technologies, which would
     * misdescribe a case study that happens to use a cloud platform.
     */
    domains: { kind: 'oneOfList', values: CASE_STUDY_DOMAINS, optional: true },
    /**
     * Optional because nothing in the recorded content states when a case study
     * was built. Declared and validated when present so the owner can add it
     * without a code change, and left empty rather than guessed at.
     */
    year: { kind: 'date', optional: true },
    /**
     * Optional for the same reason as `year`: the recorded content names each
     * case study but not the part the owner played in building it.
     */
    role: { kind: 'text', optional: true },
    /**
     * Required, and deliberately so. A case study's visibility is a decision, and
     * making the field optional would make "forgot to say" and "draft" the same
     * state — which is the ambiguity this column exists to remove.
     */
    status: { kind: 'oneOf', values: CASE_STUDY_STATUSES },
    /** References into `technologies`, so an untracked mention fails the build. */
    technologies: { kind: 'slugRefList', collection: 'technologies', optional: true },
    liveUrl: { kind: 'url' },
    githubUrl: { kind: 'url' },
    featured: { kind: 'orderIndex', optional: true },
    slug: { kind: 'slug' },
    // The nine narrative sections. All optional, all empty in the recorded
    // content: they are facts about real work, and an absent section renders
    // nothing rather than standing in for prose nobody wrote.
    overview: { kind: 'text', optional: true },
    problem: { kind: 'text', optional: true },
    architecture: { kind: 'text', optional: true },
    implementation: { kind: 'text', optional: true },
    infrastructure: { kind: 'text', optional: true },
    security: { kind: 'text', optional: true },
    challenges: { kind: 'text', optional: true },
    results: { kind: 'text', optional: true },
    lessonsLearned: { kind: 'text', optional: true },
  },
};

export const EXPERIENCE_SCHEMA: CollectionSchema = {
  id: 'experiences',
  file: 'experiences.csv',
  record: 'experience',
  identifier: 'slug',
  key: 'slug',
  dateOrder: { start: 'startDate', end: 'endDate' },
  fields: {
    /**
     * The addressable segment, declared rather than derived from the title.
     *
     * Several recorded titles carry a semester marker or a year — "1st Semester",
     * "2025" — and those are exactly the strings a correction changes. Keying an
     * anchor on one would move a published address every time it was fixed.
     */
    slug: { kind: 'slug' },
    /**
     * Which kind of work this entry represents.
     *
     * Optional, and that is what makes it usable: an experience the owner has not
     * classified is a valid record. It is presented in the unclassified group
     * rather than assigned a kind, because a guessed classification is worse than
     * an absent one — it would look like the owner's decision.
     */
    track: { kind: 'oneOf', values: EXPERIENCE_TRACKS, optional: true },
    /**
     * The role, as the owner wrote it. Not split into a separate `role` field:
     * every recorded title *is* a role ("Chief Technology Officer", "Mobile
     * Developer"), so a second column would hold the same fact twice and the two
     * could disagree.
     */
    title: { kind: 'text' },
    organization: { kind: 'text' },
    badgeLabel: { kind: 'oneOf', values: BADGE_LABELS },
    startDate: { kind: 'date' },
    /** Absent means the span is still open, which is how it is declared. */
    endDate: { kind: 'date', optional: true },
    location: { kind: 'text' },
    /**
     * The operational account, in the first person: what was actually done.
     *
     * This is what the timeline presents as the work itself. It is transcribed as
     * written and never summarised or reworded.
     */
    description: { kind: 'text' },
    /**
     * The discrete items the description already enumerates, and nothing else.
     *
     * Populated only where the recorded prose is already a sequence of discrete
     * sentences. Splitting a single sentence at its commas is editorial — it
     * decides where one responsibility ends and the next begins, and where a
     * trailing prepositional phrase belongs — so those records leave it empty
     * rather than have a boundary invented for them.
     */
    responsibilities: { kind: 'list', optional: true },
    /**
     * A lesson the owner learned from this work.
     *
     * Optional and shipped empty. A retrospective judgement about work that was
     * really done is the owner's to make: deriving one from the description would
     * manufacture a reflection and present it as theirs. Validated when present so
     * that writing one is a content edit with no code change.
     */
    lessonsLearned: { kind: 'text', optional: true },
    /**
     * Capabilities and activities, free text.
     *
     * Deliberately not technology references. Most recorded skills are soft
     * ("Communication", "People Management"), and the declared focus areas match
     * signals against exactly these tokens; making this a technology list would
     * put a `Technology` record on the word "Communication".
     */
    skills: { kind: 'list' },
    /** Genuinely technological tools, referenced so an untracked one fails the build. */
    tools: { kind: 'slugRefList', collection: 'technologies', optional: true },
    /** Named systems the role worked on. No recorded value yet. */
    systems: { kind: 'slugRefList', collection: 'technologies', optional: true },
    caseStudies: { kind: 'slugRefList', collection: 'caseStudies', optional: true },
  },
};

export const CERTIFICATION_SCHEMA: CollectionSchema = {
  id: 'certifications',
  file: 'certifications.csv',
  record: 'certification',
  identifier: 'slug',
  key: 'slug',
  dateOrder: { start: 'acquiredOn', end: 'expiration' },
  fields: {
    title: { kind: 'text' },
    /**
     * The addressable segment, declared rather than derived from the title.
     *
     * A title is corrected — this one is punctuated, and the corrections are exactly
     * the kind a credential's owner makes when the awarding body reissues it. Keying
     * the page on the title would move a published address on every correction and
     * produce an address nobody would type.
     */
    slug: { kind: 'slug' },
    /**
     * The organisation that issued the credential, stored independently of the
     * title so a credential's name need not contain its issuer.
     */
    issuer: { kind: 'text' },
    /** The acquisition date, as a date rather than a year, so an expiry compares. */
    acquiredOn: { kind: 'date' },
    /** Absent means the credential does not lapse. */
    expiration: { kind: 'date', optional: true },
    description: { kind: 'text' },
    /**
     * A destination a visitor can follow to check the credential.
     *
     * Optional in principle because a credential need not be verifiable, and
     * required here because every recorded one supplies a URL — though four of
     * them point at a shared certifications list rather than at the credential.
     */
    verificationUrl: { kind: 'link' },
    /**
     * What that destination identifies.
     *
     * Required alongside the URL rather than inferred from it, so the page's claim
     * is stated by the owner instead of guessed from a third party's URL shape. See
     * `CREDENTIAL_VERIFICATION_KINDS`.
     */
    verificationKind: { kind: 'oneOf', values: CREDENTIAL_VERIFICATION_KINDS },
    /** The badge identifier, where the recorded URL already carries one. */
    credentialId: { kind: 'text', optional: true },
    /**
     * The subject areas this credential covers, checked against the declared
     * vocabulary. Empty today and valid empty, so the column can ship before its
     * values are written.
     */
    skills: { kind: 'oneOfList', values: CREDENTIAL_SKILLS, optional: true },
    caseStudies: { kind: 'slugRefList', collection: 'caseStudies', optional: true },
  },
};

export const QUALIFICATION_SCHEMA: CollectionSchema = {
  id: 'education',
  file: 'education.csv',
  record: 'qualification',
  identifier: 'slug',
  key: 'slug',
  dateOrder: { start: 'startDate', end: 'endDate' },
  fields: {
    /**
     * The addressable segment, declared rather than derived from the title.
     *
     * Every recorded title here is a long credential name that an awarding body
     * rewrites — "Bachelor of Science in Computer Engineering" is the kind of
     * string that gains or loses a word. An anchor keyed on one would move on the
     * correction. Two timelines that sit on one page using two addressing schemes
     * would be worse still.
     */
    slug: { kind: 'slug' },
    title: { kind: 'text' },
    institution: { kind: 'text' },
    startDate: { kind: 'date' },
    endDate: { kind: 'date', optional: true },
    /**
     * The credential level. Optional because one recorded record states a strand
     * rather than a degree level, and no level is invented for it.
     */
    degree: { kind: 'text', optional: true },
    location: { kind: 'text' },
    /** The disciplines of study, one entry each. */
    field: { kind: 'list' },
    detail: { kind: 'text' },
  },
};

/**
 * Every collection that has a file, in the order the tables are read.
 *
 * `TECHNOLOGY_SCHEMA`, `SOCIAL_LINK_SCHEMA`, and `CASE_STUDY_MEDIA_SCHEMA` are
 * declared above but are not registered here until their files exist: this list
 * is what `model.ts` reads from, so a registered schema without a file fails the
 * build on a missing path rather than on the content mistake the owner needs to
 * see.
 *
 * Order is presentational only. Nothing may depend on it: reference resolution
 * runs once every table has been read precisely so that a case study may
 * reference a technology declared later in this list.
 */
export const COLLECTION_SCHEMAS: readonly CollectionSchema[] = [
  TECHNOLOGY_SCHEMA,
  SOCIAL_LINK_SCHEMA,
  CASE_STUDY_MEDIA_SCHEMA,
  CASE_STUDY_SNIPPET_SCHEMA,
  PROJECT_SCHEMA,
  EXPERIENCE_SCHEMA,
  CERTIFICATION_SCHEMA,
  QUALIFICATION_SCHEMA,
];

/** The schema for a collection id, or undefined when no collection claims it. */
export function schemaFor(collection: CollectionId): CollectionSchema | undefined {
  return COLLECTION_SCHEMAS.find((schema) => schema.id === collection);
}

/** The separator used by the list columns in the source data. */
export const LIST_SEPARATOR = ' | ';

/**
 * The shape a routable slug must take.
 *
 * Lowercase words joined by single hyphens, so the value is already URL-safe and
 * never needs escaping. Leading, trailing, and doubled hyphens are rejected, as
 * are empty words.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* ------------------------------------------------------------------ *
 * Field checks
 * ------------------------------------------------------------------ */

const ORDER_INDEX = /^[1-9][0-9]*$/;

/** Whether a field is declared optional. */
export function isOptional(spec: FieldKind): boolean {
  return spec.optional === true;
}

/**
 * Check one field, returning a reason string when it is invalid.
 *
 * Returns `null` rather than throwing so the caller can gather every problem in
 * a file before reporting. A content owner fixing a file wants the whole list,
 * not the first item and then a second build.
 *
 * Optionality governs presence, not rigour. An empty value is allowed only on a
 * field declared optional; a value that *is* present is checked by its kind
 * exactly as it would be on a required field. An optional field that skipped
 * validation when present would move the discovery of a bad value from the build
 * to whoever reads the rendered page.
 */
export function checkField(field: string, value: string, spec: FieldKind): string | null {
  if (value === '' && isOptional(spec)) return null;

  switch (spec.kind) {
    case 'text':
      return value === '' ? 'is required and is empty' : null;

    case 'list':
      if (value === '') return 'is required and is empty';
      // A cell holding only the separator, or only whitespace, is not empty as a
      // string but yields no entries — which would render the field as nothing
      // rather than fail the build.
      return splitList(value).length === 0
        ? 'contains no entries, only separators or whitespace'
        : null;

    case 'oneOf': {
      if (value === '') return 'is required and is empty';
      return spec.values.includes(value)
        ? null
        : `is "${value}", which is not one of: ${spec.values.join(', ')}`;
    }

    case 'oneOfList': {
      if (value === '') return 'is required and is empty';
      const entries = splitList(value);
      // A cell holding only separators is not empty as a string but yields no
      // entries, which would render the field as nothing rather than fail.
      if (entries.length === 0) {
        return 'contains no entries, only separators or whitespace';
      }
      // Every entry is checked. Reporting only the first would make a
      // three-domain cell take three builds to fix.
      const rejected = entries.filter((entry) => !spec.values.includes(entry));
      if (rejected.length > 0) {
        return (
          `contains ${rejected.map((entry) => `"${entry}"`).join(', ')}, ` +
          `which ${rejected.length === 1 ? 'is' : 'are'} not one of: ${spec.values.join(', ')}`
        );
      }
      return null;
    }

    case 'url': {
      if (value === '') return 'is required and is empty';
      return checkUrl(value);
    }

    case 'link': {
      if (value === '') return 'is required and is empty';
      // A valid web address is accepted as-is. Otherwise the only other thing
      // this kind admits is a mailto: with an address after it.
      if (checkUrl(value) === null) return null;
      if (value.startsWith('mailto:') && value.length > 'mailto:'.length) return null;
      return `is "${value}", which is neither an http or https URL nor a mailto: address`;
    }

    case 'slug': {
      if (value === '') return 'is required and is empty';
      return slugReason(value);
    }

    case 'slugRef': {
      if (value === '') return 'is required and is empty';
      return slugReason(value);
    }

    case 'sectionRef': {
      if (value === '') return 'is required and is empty';
      return CASE_STUDY_SECTIONS.some((section) => section.key === value)
        ? null
        : `is "${value}", which is not one of the declared sections: ${CASE_STUDY_SECTIONS.map(
            (section) => section.key,
          ).join(', ')}`;
    }

    /**
     * Code, which is not prose.
     *
     * The only kind that leaves a value's whitespace alone. Everything else is
     * trimmed on ingest, which is right for a label and wrong for code: a
     * trailing newline and the space that indents a block are part of the code,
     * and normalising them would make the stored text differ from what was
     * declared. So this returns null for any present value, and fails only when
     * there is nothing to present.
     */
    case 'code':
      // Present is not the same as non-empty here. A cell of nothing but spaces
      // and newlines is not code, and accepting it would let a snippet declare a
      // block that renders as an empty box under a language label.
      //
      // The check is `trim() === ''` and nothing more: it reads the value and
      // returns, never reassigning it, so the whitespace that survives is the
      // whitespace the owner declared.
      return value.trim() === '' ? 'is required and holds only whitespace' : null;

    case 'slugRefList': {
      if (value === '') return 'is required and is empty';
      if (splitList(value).length === 0) {
        return 'contains no entries, only separators or whitespace';
      }
      // Every entry must be a slug. Which records they name is checked later, once
      // every table has been read.
      for (const entry of splitList(value)) {
        const reason = slugReason(entry);
        if (reason !== null) {
          return `contains the entry "${entry}", which ${reason}`;
        }
      }
      return null;
    }

    case 'date': {
      if (value === '') return 'is required and is empty';
      if (parseDate(value) !== null) return null;
      return (
        `is "${value}", which is not a date in YYYY, YYYY-MM, or YYYY-MM-DD form ` +
        `with a real month and day (as in "2024-07" or "2025")`
      );
    }

    case 'orderIndex':
      // Empty is the declared way to say "not featured", so it is not an error.
      if (value === '') return null;
      return ORDER_INDEX.test(value)
        ? null
        : `is "${value}", which is not a positive integer order index or empty`;
  }
}

/**
 * The web-address checks shared by the `url` and `link` kinds.
 *
 * Split out because the two kinds differ in which protocols they admit, not in
 * how they judge a web address, and a duplicated body would let the two drift.
 */
function checkUrl(value: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return `is "${value}", which is not a URL`;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return `is "${value}", which is not an http or https URL`;
  }
  // These render as `href` on the site, so a credential in the authority
  // would be disclosed to every visitor and in the `Referer` header.
  if (parsed.username !== '' || parsed.password !== '') {
    return `is "${value}", which embeds credentials`;
  }
  return null;
}

function slugReason(value: string): string | null {
  if (SLUG_PATTERN.test(value)) return null;
  return (
    `is not a lowercase hyphen-separated slug ` +
    `(expected letters, digits, and single hyphens, as in "guardian-vision")`
  );
}

/** Split a list column into its trimmed, non-empty entries. */
export function splitList(value: string): readonly string[] {
  return value
    .split(LIST_SEPARATOR)
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '');
}

/** An empty value as an absent value, for an optional text field. */
export function optionalText(value: string): string | null {
  return value === '' ? null : value;
}

/** An empty value as an absent date, for an optional date field. */
export function optionalDate(value: string): ContentDate | null {
  return value === '' ? null : parseDate(value);
}

/** An empty value as an absent list. */
export function optionalList(value: string): readonly string[] {
  return value === '' ? [] : splitList(value);
}

/** Narrow a validated string to one of a declared value set. */
export function asOneOf<const T extends readonly string[]>(
  field: string,
  value: string,
  values: T,
): T[number] {
  if (!values.includes(value)) {
    throw new Error(`"${value}" is not a valid value for ${field}`);
  }
  return value as T[number];
}

/** Convert a validated order index to a number, or null when unfeatured. */
export function asOrderIndex(value: string): number | null {
  return value === '' ? null : Number(value);
}

/** Read a validated date, throwing rather than returning a wrong date. */
export function asDate(field: string, value: string): ContentDate {
  const parsed = parseDate(value);
  if (parsed === null) {
    throw new Error(`"${value}" is not a valid date for ${field}`);
  }
  return parsed;
}
/**
 * Fields whose absence leaves content unwritten.
 * 
 * Distinct from optional fields (like endDate or degree) whose absence is a
 * legitimate stated state. These fields are tracked by the model to report gaps.
 */
export const AUTHORABLE_CONTENT: Partial<Record<CollectionId, readonly string[]>> = {
  experiences: ['lessonsLearned', 'systems', 'caseStudies'],
  certifications: ['caseStudies'],
};
