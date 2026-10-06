/**
 * Site identity: the content that is prose, not records.
 *
 * The CSVs hold collections with a field per attribute. Everything here is
 * singleton — a name, a role, a biography — and has no row to live in, so it is
 * typed TypeScript instead. One file, one place, and a misspelled or missing
 * field is a compile error rather than an empty space on the page.
 *
 * No number appears anywhere in this file. Every figure on the site is derived
 * from the content model by `lib/content/derive.ts`. A statistic written here
 * would be a statistic that can disagree with the data, and nobody would find
 * out until a visitor counted.
 *
 * The biography names its certifications by issuer and leaves the count to the
 * derived statistics. It cannot import that count from here: `derive.ts` imports
 * `FOCUS_AREAS` from this file, so reaching back would close a cycle.
 */

import { SECTION_IDS, sectionHref } from '@/lib/navigation';
import { CONTENT } from '@/lib/content/model';

/* ------------------------------------------------------------------ *
 * Profile
 * ------------------------------------------------------------------ */

/** The portrait shown beside the biography. */
export interface ProfileImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

/**
 * The owner, as one record.
 *
 * These were six separate exported constants, which is six places the identity
 * could be stated and five ways it could disagree with itself: a hero that says
 * "Cloud Engineer" and a footer that says "Full Stack Developer" are both
 * faithful to their own constant and wrong about the site. One record means a
 * misspelled or missing field is a compile error rather than an empty space.
 *
 * Deliberately holds no figure. Every number attributed to the owner comes from
 * the derived statistics; a count written here is a count that can disagree with
 * the records it describes.
 */
export interface Profile {
  readonly name: string;
  /**
   * The professional role, stated with the actual technical direction.
   *
   * Application development appears in the biography as earlier and current work,
   * not as the headline. Leading with "developer" would misrepresent where the
   * time goes: the recorded content is service management, cloud platforms,
   * security programmes, and networked systems.
   */
  readonly role: string;
  /** One line under the role, in the hero. No figure. */
  readonly roleLine: string;
  /** The short summary, for the hero. The biography carries the detail. */
  readonly summary: string;
  readonly biography: readonly string[];
  readonly image: ProfileImage;
}

export const PROFILE: Profile = Object.freeze({
  name: 'Gladwin Ferdz Del Rosario',

  role: 'Infrastructure, Cloud & Cybersecurity Engineer',

  roleLine:
    'Working across infrastructure, cloud, cybersecurity, networking, and IT operations.',

  summary:
    'Technology professional focused on building scalable, reliable systems across full-stack development and cloud infrastructure. Experienced in developing modern web applications using React and Spring Boot, with hands-on exposure to AWS, Azure, and Google Cloud. Strong foundation in backend engineering, distributed systems, and cloud-native architecture, with practical experience in deploying applications, managing infrastructure, and designing end-to-end solutions. Driven by curiosity and impact to contribute to teams that value scalability, performance, and continuous improvement.',

  /**
   * Written to the recorded content and no further. Every specific claim here is
   * one the content model supports: the Sun Life internship and what it
   * involved, the named leadership roles, the certifications, and the degree in
   * progress.
   */
  biography: Object.freeze([
    'His technical direction focuses on infrastructure, cloud, cybersecurity, and networking — the layers a system runs on rather than the interface in front of it. He works across AWS, Microsoft Azure, and Google Cloud, spending most of his time on the operational side: service management, incident escalation, and governance around dependable systems.',
    'That direction emerged from two semesters as an IT Service Management Intern at Sun Life Global Solutions, where he cross-checked IP addresses and system data against manual records, tracked and escalated infrastructure issues through to resolution, and improved operational issue-tracking dashboards. Around it sits sustained student and community leadership: Vice President for Operations at CyberPH, Executive Vice President at ICPEP, Chief Technology Officer and Chief Community Development Officer with Google developer groups on campus, and technical lead roles in competitive hackathons.',
    'Certifications across AWS, Google Cloud, Microsoft, Oracle Cloud, and TESDA accompany a Bachelor of Science in Computer Engineering in progress at the Polytechnic University of the Philippines, where his thesis investigates distributed IoT monitoring for healthcare networks. His earlier work centered on application development, which he continues to build on — understanding what runs on top of the infrastructure makes systems easier to reason about.',
  ]),

  /** The profile photograph. Produced from the original by this change's build. */
  image: Object.freeze({
    src: '/images/profile.jpg',
    width: 1600,
    height: 1067,
    alt: 'Photograph of Gladwin Ferdz Del Rosario',
  }),
});

/* ------------------------------------------------------------------ *
 * Focus areas
 * ------------------------------------------------------------------ */

/** The five declared focus areas, as identities. */
export type FocusAreaId =
  | 'infrastructure'
  | 'cloud'
  | 'cybersecurity'
  | 'networking'
  | 'it-operations';

/**
 * What to count evidence for, and where to look.
 *
 * A signal names a token and the field to look for it in. Tokens match exactly
 * against the normalised value — never as a substring — so `Cloud Computing`
 * does not become evidence for the cloud platform count by containing the word.
 *
 * The `cloudProvider` signal is the exception, and deliberately so: it resolves
 * every candidate through the canonical alias map, so `AWS` and
 * `AWS Cloud Quest` are one platform rather than two.
 */
export type Signal =
  | { readonly kind: 'skill'; readonly token: string }
  | { readonly kind: 'organisation'; readonly token: string }
  | { readonly kind: 'certificationTitle'; readonly token: string }
  | { readonly kind: 'qualificationFocus'; readonly token: string }
  | { readonly kind: 'cloudProvider' };

export interface FocusArea {
  readonly id: FocusAreaId;
  readonly label: string;
  readonly summary: string;
  readonly signals: readonly Signal[];
}

/**
 * The five focus areas.
 *
 * Declared, not counted. `derive.ts` turns these signals into figures; nothing
 * here knows what any of them come to.
 */
export const FOCUS_AREAS: readonly FocusArea[] = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    summary:
      'Enterprise systems and the governance around them — tracking, escalating, and reporting on the infrastructure other teams depend on.',
    signals: [
      { kind: 'skill', token: 'Enterprise Infrastructure' },
      { kind: 'skill', token: 'IT Governance' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    summary:
      'Platforms rather than preferences. Cloud work is counted through a canonical provider map, so one platform is never counted twice.',
    signals: [{ kind: 'cloudProvider' }],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    summary:
      'Security awareness as an operational programme: strategy, internal process, and nationwide initiatives rather than a checklist.',
    signals: [{ kind: 'organisation', token: 'CyberPH' }],
  },
  {
    id: 'networking',
    label: 'Networking',
    summary:
      'Computer networks as an academic specialisation and as a qualification in systems servicing and troubleshooting.',
    signals: [
      { kind: 'qualificationFocus', token: 'Computer Networks Engineering' },
      { kind: 'certificationTitle', token: 'Technical Support Fundamentals' },
    ],
  },
  {
    id: 'it-operations',
    label: 'IT Operations',
    summary:
      'Service management, operations, and the day-to-day running of systems in a live organisation.',
    signals: [
      { kind: 'skill', token: 'Service Management' },
      { kind: 'skill', token: 'Operations' },
      { kind: 'organisation', token: 'Sun Life Global Solutions - Philippines' },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Calls to action
 * ------------------------------------------------------------------ */

/**
 * Actions offered on the page.
 *
 * Destinations come from `lib/navigation.ts` or from here; a section never types
 * one into itself. Exactly one action is `primary`, and the page has exactly one
 * primary button — the accent fill is reserved, and two accents on one screen
 * means neither is the emphasis.
 */
export type ActionVariant = 'primary' | 'secondary' | 'ghost';

export interface Action {
  readonly label: string;
  readonly href: string;
  readonly variant: ActionVariant;
  /**
   * True for a destination that leaves the site. Carries the new-tab attributes
   * and the visually hidden note that says so.
   */
  readonly external: boolean;
  /** Plain-language note rendered under the label when the action is external. */
  readonly note?: string;
}

export const PRIMARY_ACTION: Action = {
  label: 'See the work',
  href: sectionHref(SECTION_IDS.projects),
  variant: 'primary',
  external: false,
};

/**
 * The secondary actions, built from the social-link records.
 *
 * These four destinations were declared twice: once here and once in
 * `SOCIAL_LINKS` in `lib/navigation.ts`, with the GitHub and LinkedIn URLs
 * written out in both. Two declarations of one destination is the disagreement
 * this change exists to remove, so the labels and addresses now come from the
 * content and only the presentation — which variant, and whether the action
 * carries the new-tab note — is decided here.
 */
const SOCIAL_ACTION_VARIANTS: Readonly<Record<string, ActionVariant>> = {
  github: 'ghost',
  linkedin: 'ghost',
  linktree: 'ghost',
  email: 'secondary',
};

export const SECONDARY_ACTIONS: readonly Action[] = Object.freeze(
  CONTENT.socialLinks.map((link) => ({
    label: link.label,
    href: link.href,
    variant: SOCIAL_ACTION_VARIANTS[link.platform] ?? 'ghost',
    external: link.external,
    // Only a destination that leaves the site needs the note explaining that it
    // opens a new tab; a mail link does not leave the site and does not get one.
    ...(link.external ? { note: 'Opens in a new tab' } : {}),
  })),
);