## 1. Token layer (`app/globals.css`)

- [x] 1.1 Replace `app/globals.css` entirely. Remove the `--background`/`--foreground` pair, the `body { font-family: Arial }` rule, and the `@media (prefers-color-scheme: dark)` block. Keep `@import "tailwindcss";` as the first line. No light theme, no `prefers-color-scheme` branch.
- [x] 1.2 Declare the four surface roles in `@theme` exactly as specified in `specs/design-tokens`: `--color-surface: #0B0C0E`, `--color-surface-raised: #131519`, `--color-surface-inset: #1A1D22`, `--color-surface-overlay: #22262C`. Add a comment carrying each one's OKLCH equivalent.
- [x] 1.3 Declare the three text roles: `--color-text: #E8EAED`, `--color-text-secondary: #A8AEB8`, `--color-text-muted: #868E9A`. Include the measured contrast range in a comment.
- [x] 1.4 Declare the amber accent roles: `--color-accent: #FFB020`, `--color-accent-hover: #FFC24D`, `--color-accent-subtle: #3A2A0E`, `--color-on-accent: #0B0C0E`.
- [x] 1.5 Declare the four status hues: `--color-success: #3DD68C`, `--color-warning: #D9B310`, `--color-destructive: #F0616D`, `--color-info: #58A6FF`. Add a comment noting `warning` (hue 93°) sits close to `accent` (hue 75°) and that tone must never be the sole distinguishing channel.
- [x] 1.6 Declare both border roles: `--color-border: #262A31` (decorative hairline) and `--color-border-strong: #66696E` (interactive boundary, ≥3:1). Comment that `border-strong` is restricted to `surface`, `surface-raised`, `surface-inset`.
- [x] 1.7 Declare the spacing and radius scales: `--spacing: 0.25rem`, and `--radius-xs: 2px`, `--radius-sm: 4px`, `--radius-md: 6px`. Confirm no radius above 6px is reachable from the theme.
- [x] 1.8 Declare the seven type-scale steps as `--text-display`, `--text-title`, `--text-heading`, `--text-body`, `--text-small`, `--text-label`, `--text-code` with their `--line-height` and `--letter-spacing` sub-keys, per the table in `specs/typography`. Only `label` carries positive letter spacing.
- [x] 1.9 Declare `--font-sans` and `--font-mono` in a separate `@theme inline` block referencing the `next/font` CSS variables, each with its full fallback stack (see design decision D1 for why these two alone use `inline`).
- [x] 1.10 Add the base layer: set the page background to `surface` and default text colour to `text` on `body`; set the default font family to `--font-sans`; add a `:focus-visible` rule producing `outline: 2px solid var(--color-accent); outline-offset: 2px;` (design decision D10). Do not suppress focus outlines globally.
- [x] 1.11 Add a `.skip-link` utility: visually hidden by default, becoming visible on `:focus` with at least 4.5:1 contrast, not clipped, using `accent` fill with `on-accent` text.
- [x] 1.12 Verify the token layer compiles and generates the expected utilities: `npx tsc --noEmit && npm run build`. Confirm `--radius-md` and `--breakpoint-sm` namespaces resolve as utilities (`rounded-md`, `sm:`) per design decision D1.

## 2. Foundations (`lib/`)

- [x] 2.1 Create `lib/cn.ts` exporting a `cn` helper that filters falsy values and joins with a single space. No dependency, per design decision D4. Do not add `clsx` or `tailwind-merge`.
- [x] 2.2 Create `lib/navigation.ts` as the single source of truth for primary navigation and social links: an exported list of items with `href` and `label`, and an exported set of social/external links with an `external` flag. Include only the routes this change introduces; the token-reference route is deliberately excluded.
- [x] 2.3 Confirm `package.json` is unchanged from the scaffold — no runtime or dev dependency was added by this change.

## 3. UI primitives (`components/ui/`)

- [x] 3.1 Create `components/ui/button.tsx`. Export a `Button` with `variant` (`primary` | `secondary` | `ghost` | `danger`) and `size` (`sm` | `md`), selected via a plain `Record` lookup per design decision D4. Render a real `<button>` by default. Apply the token-role styles from the table in `specs/ui-primitives`; use `border-strong` for `secondary` and a `destructive` border for `danger`. Do not accept a `className` override (design decision D9).
- [x] 3.2 Give `Button` a disabled state that is conveyed by more than reduced opacity: set the `disabled` attribute and add a visible non-opacity cue. Ensure no variant renders `accent` fill with `accent` text.
- [x] 3.3 Support rendering `Button` as a link when an `href` is supplied, preserving identical visual output and forwarding the focus indicator.
- [x] 3.4 Create `components/ui/card.tsx` exporting `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. `Card` uses `surface-raised`, a 1px `border`, and `rounded-md`; no drop shadow (design decision D7). `CardTitle` uses the `title` type step and can be marked as the card's accessible name.
- [x] 3.5 Ensure the card parts keep their order when optional parts are omitted, and that `CardTitle` is the first heading in the card.
- [x] 3.6 Create `components/ui/metadata.tsx` exporting `Metadata` (one label–value pair) and `MetadataList` (a sequence of them). Label uses the `label` type step, uppercase, in `text-muted`; value uses the mono face in `text`. Values are real selectable text.
- [x] 3.7 Implement the absent-value behaviour in `Metadata`: render an explicit muted placeholder in the value position rather than omitting the row, so label alignment is preserved. Expose the placeholder string as a prop with a sensible default.
- [x] 3.8 Create `components/ui/status-indicator.tsx` exporting `StatusIndicator` with a `tone` of `neutral` | `accent` | `success` | `warning` | `destructive` | `info`, mapping each to its dot fill from the table in `specs/ui-primitives`. Include a `label: string` prop that is required.
- [x] 3.9 Give each `StatusIndicator` tone a distinct shape so `accent` and `warning` are distinguishable in greyscale, and mark the dot `aria-hidden` so the label is announced exactly once.
- [x] 3.10 Verify every primitive file: no hex, RGB, or OKLCH literal; no radius outside 2/4/6px; every spacing value a declared scale step; no `'use client'` directive; no domain vocabulary.
- [x] 3.11 Verify primitives render with no client JavaScript: confirm none of the four files contains a client directive and each is importable from a Server Component.

## 4. Layout shell and root layout

- [x] 4.1 Create `components/layout/skip-link.tsx` rendering a link to `#main-content` using the `.skip-link` utility from task 1.11. It must be the first focusable element in the document.
- [x] 4.2 Create `components/layout/nav-link.tsx` as a `'use client'` leaf that calls `usePathname` and renders one `Link`. Mark the current route with `aria-current="page"` plus a non-color marker in addition to the `accent` colour. It must not know anything about header structure (design decision D5).
- [x] 4.3 Create `components/layout/site-header.tsx` as a Server Component. Render `banner`, the wordmark link to the site root as its first focusable element, and the primary nav from `lib/navigation.ts`. Make it sticky with a 1px `border` bottom hairline and no shadow.
- [x] 4.4 Add the small-width disclosure to `site-header.tsx` using native `<details>`/`<summary>` (design decision D6). Restyle `summary` to a full-width control with `list-style: none` and a custom indicator, keeping the native semantics. Do not add a `'use client'` directive or React state.
- [x] 4.5 Render both the desktop nav and the `<details>` nav from the same `lib/navigation.ts` data, so the link sets and order are identical by construction. Verify the spec scenario "Desktop and mobile navigation agree".
- [x] 4.6 Create `components/layout/site-footer.tsx` as a Server Component rendering `contentinfo`. Include a colophon naming the site owner and a build/technology stamp in the mono face at `text-muted`. Mark external links with `target="_blank"` and `rel="noopener noreferrer"`.
- [x] 4.7 Create `components/layout/page-shell.tsx` composing skip link, header, the main region, and footer. Give the main element `id="main-content"` and `tabIndex={-1}` so the skip link can move focus into it. Constrain the column to a provisional max width from the container scale and inset it by a spacing-scale gutter; add a comment that the exact width is provisional per the design open questions.
- [x] 4.8 Rewrite `app/layout.tsx`: replace the Geist imports with `IBM_Plex_Sans` and `IBM_Plex_Mono` from `next/font/google` (`subsets: ['latin']`, `display: 'swap'`, `variable`), keep the Next 16 `LayoutProps<"/">` prop typing already in the scaffold, apply both font variables to `<html lang="en">`, and replace the placeholder metadata with a title and description for Gladwin.dev.
- [x] 4.9 Wrap `children` in `PageShell` in `app/layout.tsx` so every route inherits the frame with no per-route wiring. Confirm exactly one `banner`, one `main`, and one `contentinfo` are rendered.

## 5. Home page composition and asset cleanup

- [x] 5.1 Rewrite `app/page.tsx` to demonstrate the system: a display-type masthead, a card grid exercising every `Button` variant and size, `MetadataList` rows, and `StatusIndicator` tones across all six. Use clearly-labelled placeholder content — no real portfolio data, no CSV loading.
- [x] 5.2 Compose the home page sections using the declared section rhythm step from the spacing scale, and use the same step between every sibling region. Do not introduce one-off gaps.
- [x] 5.3 Remove the now-unreferenced scaffold assets `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, and `public/window.svg`. Confirm no file still references them.
- [x] 5.4 Verify the spec scenario "No horizontal overflow" by checking the narrowest supported viewport with a long unbroken string (a URL) in both a `MetadataList` value and a card.
- [x] 5.5 Run `npm run lint` and `npx tsc --noEmit`. Both must pass before continuing.

## 6. Token reference route

- [x] 6.1 Create `app/design-tokens/page.tsx` rendering every colour role as a labelled swatch on each surface it is valid against, with its hex and OKLCH values as text.
- [x] 6.2 Render the radius steps, the spacing scale, and both border roles as labelled specimens.
- [x] 6.3 Render all seven type-scale steps in both faces, demonstrating the prose-versus-machine-facing-data rule.
- [x] 6.4 Render every `Button` variant and size, the full card composition, `Metadata`/`MetadataList` including the absent-value case, and all six `StatusIndicator` tones.
- [x] 6.5 Confirm the route is not present in `lib/navigation.ts` and therefore not linked from the header or footer.
- [x] 6.6 Review the rendered route and correct any palette value that does not match the intent. Per design decision D2, corrections are made to the hex in `app/globals.css` and the OKLCH comment updated to match.

## 7. Documentation and final verification

- [x] 7.1 Replace the `create-next-app` boilerplate in `README.md` with a design-system overview: the two typefaces and their roles, the token layer location, the primitive list, the file structure, and a pointer to `/design-tokens`.
- [x] 7.2 Document the authoring rules a future feature must follow: reference colours by role only, keep radii at or below 6px, use the mono face for machine-facing strings, and compose chrome from `components/ui` rather than hand-rolling it.
- [x] 7.3 Run the full gate: `npm run lint`, `npx tsc --noEmit`, and `npm run build`. All three must pass.
- [x] 7.4 Confirm `package.json` is byte-identical to the scaffold commit — this change adds no dependency.
- [x] 7.5 Confirm no raw colour literal exists in any file under `components/` or `app/`, and that every raw literal in the repository is confined to `app/globals.css` and the `/design-tokens` reference content.
- [x] 7.6 Confirm no `prefers-color-scheme` media query remains anywhere in the project, per the dark-only requirement.
- [x] 7.7 Confirm no `'use client'` directive exists outside `components/layout/nav-link.tsx`, per design decision D5.
- [x] 7.8 Confirm no feature content was implemented: no CSV loading, no project/case-study layout, no credential layout, and no interactive terminal, per the proposal's Non-goals.
