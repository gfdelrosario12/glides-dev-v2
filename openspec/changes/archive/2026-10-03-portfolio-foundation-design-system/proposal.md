## Why

The Gladwin.dev portfolio is a rewrite of the v1 site at `../glides-dev`, whose visual direction is built on stock shadcn/ui neutral OKLCH tokens, a 0.625rem radius, Geist as the only typeface, and roughly 70 hardcoded Tailwind palette classes (`bg-orange-100 text-orange-700 dark:bg-orange-900/30 …`) keyed per technology in `lib/style-utils.ts`. That direction reads as a generic light/dark theme rather than as a technical-infrastructure editorial identity, and its colors are not semantic — a technology badge, a status, and a category are all expressed by picking a different hue, so any new content forces a new hand-picked class.

`glides-dev-v2` is currently an untouched `create-next-app` scaffold: `app/globals.css` defines only `--background`/`--foreground` plus a `prefers-color-scheme` block, there is no `components/`, no `lib/`, and no token layer at all. Every feature still planned for this site — case studies, credentials, and an interactive terminal — will need the same handful of surfaces: cards, buttons, metadata rows, status indicators, a nav, and a page shell. Building those per-feature first guarantees the three features drift apart visually and forces a second, costlier redesign.

This change therefore establishes the design system and application structure **first**, as a dark-charcoal "technical infrastructure editorial" foundation, so the later features are assembled from stable primitives instead of inventing their own.

## What Changes

- **Replace the visual direction.** The stock create-next-app theme is removed and superseded by a dark charcoal design system. The system is dark-first; a light theme is explicitly out of scope.
- **Introduce a semantic token layer** in `app/globals.css` using Tailwind v4's CSS-first `@theme` (no `tailwind.config.js`). Tokens are defined by *role*, not hue: surface, surface-raised, border, text, and text-muted, plus accent roles for primary, muted, and on-accent. Raw charcoal and amber values are referenced only inside the token definitions.
- **Adopt amber as the single accent family** (~`oklch(0.78 0.16 70)`), used only where something is actionable, active, or live. It is not a general-purpose highlight.
- **Add a second, non-accent accent** for state that must not compete with the primary: a desaturated red reserved for destructive and offline status.
- **Establish a dual typography system.** IBM Plex Sans for prose and headings, IBM Plex Mono for all machine-facing data — metadata, labels, tech stacks, status indicators, dates, versions, and identifiers. Both are loaded through `next/font` and exposed as CSS variables; no font files are checked in.
- **Define a spacing, border, and radius scale.** Borders are hairline (1px) and low-chroma; radii are deliberately small (2px/4px/6px) to read as instrumentation rather than as soft consumer UI.
- **Add reusable, presentational UI primitives** under `components/ui/`: `Button`, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`), `Metadata` / `MetadataList` (label–value rows), and `StatusIndicator` (a dot + label with semantic tone variants).
- **Add a global navigation** in `components/layout/` with a persistent wordmark, primary route links, and a mobile disclosure state at small widths.
- **Add a page shell** in `components/layout/` — skip link, sticky header, constrained-width main column, and footer — used by the root layout so every future route inherits the same frame.
- **Add a token-reference route** at `/design-tokens` that renders the full token and primitive set, so the design system is visually verifiable before any content is built on it. The route is reachable by direct URL and is deliberately not linked from the primary navigation.
- **Keep the primitive layer free of business and content logic.** No CSV loading, no project or credential models, no terminal simulation. Primitives take already-resolved data as props.
- **Add no runtime dependencies.** Primitives are hand-rolled with plain TypeScript variant maps and a small `cn` class-merge helper. No component library, no Radix, no CVA, no `next-themes`, no icon package.

## Capabilities

### New Capabilities

- `design-tokens`: The single source of truth for the dark charcoal palette, semantic accent roles, surface/border/text hierarchy, spacing scale, border weights, and radius scale — exposed to Tailwind v4 through `@theme` in `app/globals.css` and consumed by every other capability via `var(--…)` / generated utility classes.
- `typography`: The dual typeface system (IBM Plex Sans for prose, IBM Plex Mono for data), the modular type scale with line heights and letter spacing, the font-loading contract via `next/font`, and the rule that machine-facing strings never render in the prose face.
- `ui-primitives`: The reusable presentational component contracts — `Button`, the `Card` family, `Metadata`/`MetadataList`, and `StatusIndicator` — including their variants, accessibility guarantees, and the rule that they accept no domain data.
- `app-shell`: The global navigation and the shared page shell (skip link, sticky header, width-constrained main column, footer), plus the responsive layout foundation — the breakpoint behaviour, container widths, and vertical rhythm that every route and section composes against.

### Modified Capabilities

None. This is the first change in the repository; `openspec/specs/` does not yet exist, so there are no prior capability requirements to modify.

## Non-goals

Deferred explicitly, and out of scope for this change:

- **Case study rendering** — the detailed project/case-study layout, its narrative sections, and per-project deep routes.
- **Credential rendering** — certification and experience entry layouts, credential verification links, and issuer metadata presentation beyond what `Metadata` and `StatusIndicator` already provide generically.
- **Terminal functionality** — the interactive terminal simulation, its command set, output formatting, and any typewriter behaviour. Only the *visual* surface a terminal would occupy (the shell frame) is in scope.
- **Content data loading** — reading `projects.csv`, `experiences.csv`, or `certifications.csv`, and any schema, type, or parser work for them. Data lives at `../data for portfolio/` and stays there.
- **A light theme and a theme toggle.** The system is dark-only for now; `prefers-color-scheme` switching is removed rather than preserved.
- **Motion and animation.** No enter/exit transitions, no scroll reveals, no reduced-motion handling yet.
- **Search, filtering, and sorting** of any content collection.
- **SEO, OpenGraph, and structured data** beyond the minimal default metadata already in the scaffold.
- **Deployment configuration** (Vercel settings, redirects, headers).

## Impact

**Affected code**

- `app/globals.css` — **replaced**. The `--background`/`--foreground` pair and the `prefers-color-scheme` block are removed; the file becomes the token source of truth with `@import "tailwindcss"`, `@theme inline`, `:root` custom properties, and a small base layer.
- `app/layout.tsx` — **modified**. Swap Geist for IBM Plex Sans/Mono via `next/font`, apply the new metadata defaults, and wrap children in the page shell.
- `app/page.tsx` — **modified**. Replaced with a composition that demonstrates the shell, nav, cards, metadata, and status indicators against placeholder content.
- `public/*.svg` — **deleted**. The `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, and `window.svg` scaffolding assets are no longer referenced.
- `README.md` — **modified**. Replaces the create-next-app boilerplate with the design-system overview and the token reference.

**New files**

- `app/design-tokens/page.tsx` — development token/primitive reference route.
- `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/metadata.tsx`, `components/ui/status-indicator.tsx`
- `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`, `components/layout/page-shell.tsx`, `components/layout/skip-link.tsx`
- `lib/cn.ts` — class-merge helper.
- `lib/navigation.ts` — the single source of truth for nav items and social links.

**Dependencies**

None added. `package.json` is unchanged. The implementation must build with the existing `next@16.3.8`, `react@19.2.8`, `tailwindcss@^4`, and `@tailwindcss/postcss@^4` only.

**Risk**

Low, and contained. The change is additive apart from `app/globals.css` and the scaffold `app/page.tsx`, and no user content exists yet to migrate. The main risk is committing to a palette that later proves wrong; the token-reference route exists specifically to make that visible and cheap to correct before the feature work lands.
