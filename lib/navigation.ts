/**
 * Single source of truth for navigation.
 *
 * Both the desktop navigation and the small-width disclosure render from
 * `PRIMARY_NAV`, and the footer renders from `SOCIAL_LINKS`, so the link sets
 * and their order are identical by construction rather than by convention.
 *
 * The primary list is intentionally short: it holds the home route plus the
 * landing page's navigable sections. Adding a section is a one-line change in
 * `NAVIGABLE_SECTIONS`, and both navigations pick it up. The token-reference
 * route at `/design-tokens` is deliberately absent — it is a system reference,
 * not site content, and stays reachable by direct URL. Case-study pages are
 * absent for the same reason and one step further: a case study is reached from
 * the terminal, from the landing page's featured selection, or by direct
 * address, and adding one must not add a navigation item.
 *
 * It deliberately does not import the profile. `content/site.ts` imports
 * `SECTION_IDS` from here, so an import back from this module would close a cycle
 * and leave one of the two declarations uninitialised at load.
 *
 * This module reads the content model, so it stays on the server. Nothing here is
 * imported by a client component: the only client components in the application
 * are the three terminal files and `nav-link.tsx`, whose props arrive from a
 * server component. That fact is load-bearing — `lib/terminal/registry.ts` is
 * deliberately content-free so the overlay can read command names without
 * dragging `node:fs` into the browser bundle, and it must never come to import
 * this module.
 */

import { TERMINAL_SHORTCUT } from '@/lib/terminal/types';
import { CONTENT } from '@/lib/content/model';

/**
 * One navigation entry.
 *
 * A discriminated union because the list holds two different kinds of thing: a
 * destination to follow, and an action to perform. An action has no `href` by
 * construction — which is what makes "an action item carries no destination"
 * true of the type rather than of a convention — and it is rendered as a control
 * rather than as a link.
 */
export type NavItem =
  | {
      readonly kind: 'link';
      readonly href: string;
      readonly label: string;
      /**
       * True only for links that leave the site and should open in a new browsing
       * context. `mailto:` is not external — it stays in the current context.
       */
      readonly external?: boolean;
    }
  | {
      readonly kind: 'action';
      /** Identifies the action; `terminal` is the only one declared today. */
      readonly id: 'terminal';
      readonly label: string;
      /** Human-readable form of the key combination, for the accessible name. */
      readonly shortcut: string;
    };

/** The link arm of the union, for lists that only ever hold destinations. */
export type LinkNavItem = Extract<NavItem, { kind: 'link' }>;

/**
 * Anchorable regions of the landing page.
 *
 * Declared here so the fragment a link points at and the `id` on the section are
 * the same constant. Typing a fragment in two places is how a navigation link
 * ends up pointing at a section that was renamed.
 */
export const SECTION_IDS = {
  about: 'about',
  education: 'education',
  focusAreas: 'focus-areas',
  statistics: 'statistics',
  featuredWork: 'featured-work',
  connect: 'connect',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/**
 * The sections surfaced in navigation, in document order.
 *
 * A subset: the hero, the statistics band, and the closing actions are reached
 * by reading the page or by the primary call to action, so they are not links.
 * There is deliberately no scroll-spy: marking the section currently in view
 * would need a client boundary and an observer for no navigational gain.
 */
export const NAVIGABLE_SECTIONS: readonly { readonly id: SectionId; readonly label: string }[] = [
  { id: SECTION_IDS.about, label: 'About' },
  { id: SECTION_IDS.focusAreas, label: 'Focus' },
  { id: SECTION_IDS.featuredWork, label: 'Work' },
];

/** A fragment link to a landing-page section. */
export function sectionHref(id: SectionId): string {
  return `/#${id}`;
}

/**
 * The global terminal action.
 *
 * Declared here, once, so the header's control, the mobile disclosure's control,
 * and the key handler all read the same label and the same shortcut. The shortcut
 * text itself comes from the terminal's own constant, so what the accessible name
 * announces and what the key handler matches are one string, not two that agree
 * today. The action itself is the overlay the shell mounts; this entry names it.
 */
export const TERMINAL_ACTION = {
  kind: 'action',
  id: 'terminal',
  label: 'Terminal',
  shortcut: TERMINAL_SHORTCUT.label,
} as const satisfies Extract<NavItem, { kind: 'action' }>;

export const PRIMARY_NAV: readonly NavItem[] = [
  { kind: 'link', href: '/', label: 'Home' },
  ...NAVIGABLE_SECTIONS.map(({ id, label }) => ({
    kind: 'link' as const,
    href: sectionHref(id),
    label,
  })),
  // One entry for the credential vault, and never one per credential — the same rule
  // the case-studies archive follows, for the same reason: the navigation item count
  // must not depend on how many records a collection holds.
  { kind: 'link', href: '/credentials', label: 'Credentials' },
  // One entry for the background, and never one per experience or qualification.
  // Twenty roles and three records of study would otherwise add twenty-three
  // navigation items, which is how a navigation stops being a navigation.
  { kind: 'link', href: '/background', label: 'Background' },
  { kind: 'link', href: '/connect', label: 'Connect' },
  TERMINAL_ACTION,
];

/**
 * The owner's social destinations, read from the content records.
 *
 * Not declared here. This module used to hold the four destinations itself while
 * `content/site.ts` independently named GitHub and LinkedIn again, so there were
 * two declarations of the same addresses and no way to tell which one a surface
 * had used. A social destination is content: it is edited by adding a row to
 * `content/social-links.csv`, and the navigation, the mobile disclosure, and the
 * footer all pick it up.
 */
export const SOCIAL_LINKS: readonly LinkNavItem[] = Object.freeze(
  CONTENT.socialLinks.map((link) => ({
    kind: 'link' as const,
    href: link.href,
    label: link.label,
    external: link.external,
  })),
);