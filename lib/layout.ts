/**
 * Shared layout metrics.
 *
 * These live in one place so the header, the main column, and the footer are
 * guaranteed to use the same gutter and the same vertical rhythm, as the
 * app-shell spec requires. All values are spacing-scale steps.
 */

/** Inset from the viewport edge, shared by header, main column, and footer. */
export const CONTENT_GUTTER = 'px-4 sm:px-6 lg:px-8';

/** The single gap between sibling page regions. Reused, never one-off. */
export const SECTION_RHYTHM = 'space-y-16';
