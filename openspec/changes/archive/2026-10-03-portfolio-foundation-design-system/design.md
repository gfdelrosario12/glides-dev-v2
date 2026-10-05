## Context

Motivation is in [proposal.md](./proposal.md) — Why. Normative behaviour is in [`specs/`](./specs). This document records the technical choices behind that spec.

Constraints that shaped the approach, all read from the repo rather than assumed:

- **Tailwind v4.3.3, CSS-first.** There is no `tailwind.config.js`. Theme values are declared in `app/globals.css` via `@theme`, and utilities are generated from the theme namespaces. Verified against the installed version: `--color-*`, `--font-*`, `--text-*` (including the `--text-*--line-height` and `--text-*--letter-spacing` sub-keys, which Tailwind emits for its own defaults), `--tracking-*`, `--container-*`, and the single `--spacing` base value are all active namespaces. `--radius-*` and `--breakpoint-*` are used in the same form and are confirmed by the build in the task list.
- **Next.js 16.3.8, App Router.** Per `AGENTS.md`, `node_modules/next/dist/docs/` is authoritative. Relevant confirmations: the root layout is the only place `<html>`/`<body>` are declared; `next/font` self-hosts at build time with no third-party runtime request and reserves metrics to avoid layout shift; `usePathname` is a Client Component hook and reading the URL from a Server Component is deliberately unsupported.
- **A React 19.2.8 / Next 16 quirk already in the scaffold:** `app/layout.tsx` types its props as the generated `LayoutProps<"/">` rather than `{ children: React.ReactNode }`. That is the Next 16 typed-routes convention and is preserved.
- **Zero runtime dependencies is a hard constraint for this change.** The v1 portfolio shipped Radix, `class-variance-authority`, `clsx`, `tailwind-merge`, `framer-motion`, `lucide-react`, `next-themes`, and `papaparse`. None of them are installed here and none are being added.
- **The palette was derived, not inherited.** The referenced "Technical Infrastructure Editorial" specification does not exist anywhere on this machine, so the values below were authored for this change and are the system of record. Every colour and every contrast claim in it was computed rather than estimated, because a design system's values *are* its contract.

## Goals / Non-Goals

**Goals**

- One file defines every colour, spacing, border, radius, and type value; no other file restates them.
- Every colour in the interface is reachable by role name, so a single edit re-themes the whole site.
- A primitive set complete enough that case studies, credentials, and a terminal are assembly work, not design work.
- Client JavaScript limited to the two interactions that genuinely need it.
- A wrong palette is cheap to correct, before any content is built on it.

**Non-Goals** (design-level boundaries; feature-level exclusions are in [proposal.md](./proposal.md) → Non-goals)

- No theming engine. There is one theme, declared once. No provider, no class-swapping, no `data-theme` indirection, no `prefers-color-scheme` branch.
- No token pipeline. No Style Dictionary, no JSON token source, no build step that generates CSS from a token file. The stylesheet is the source.
- No generic-purpose escape hatch. No "arbitrary" colour path, no runtime style prop for colour, no `style={{}}` colour. If a need cannot be expressed by a role, the role set is wrong and gets amended deliberately.
- No component-composition framework. Primitives compose by nesting JSX. No slot system, no `asChild` polymorphism, no render props.

## Decisions

### D1 — Tokens live in `app/globals.css` under `@theme`; no `tailwind.config.js`

Declare every role as a custom property in a single `@theme` block in `app/globals.css`, so Tailwind generates the matching utilities (`bg-surface-raised`, `text-accent`, `rounded-md`, `text-label`) and the values are simultaneously readable as CSS variables.

**Why here:** the v4 default is CSS-first, and `AGENTS.md` forbids assuming v3 conventions. Declaring in CSS also means the tokens are inspectable in devtools as real variables, which is what makes the `/design-tokens` route possible without a second source.

**Alternative considered:** a `tailwind.config.js` with `theme.extend`. Rejected — reintroduces a JS config file in a project whose whole point is a CSS-first token layer, and splits the system across two languages.

**Alternative considered:** `@theme inline` (as the v1 portfolio used) with values forwarded from a `:root` block. That indirection is only needed to alias runtime-swappable values. With one static theme, `@theme inline` is pure indirection, so plain `@theme` is used and the custom properties land on `:root` directly.

**One exception:** the two font-family values must reference `next/font` variables that do not exist until the layout module evaluates. Those two lines use `@theme inline`, because their values must resolve at use time rather than being captured at theme-declaration time. This is scoped deliberately to `--font-sans` and `--font-mono` and documented inline in the stylesheet.

### D2 — Colours are authored in hex and documented with their OKLCH equivalent

Each colour role is declared as hex, with a comment giving the measured OKLCH equivalent.

**Why hex:** hex is unambiguous, universally copy-pasteable, and what a designer reads and edits. OKLCH is perceptually uniform but harder to eyeball.

**Why not OKLCH-only:** this was tried and it failed concretely. `oklch(0.813 0.165 75)` — the intended amber — sits outside the sRGB gamut, and an unclamped conversion renders it as `#EE5D05`, a red-orange, not amber. Authoring in OKLCH requires per-colour gamut mapping, which is exactly the kind of hidden judgement call a token layer should not contain. Hex is inside the gamut by construction, and the OKLCH value in the comment is then a *description* of the hex rather than a source of truth.

**Verification:** every hex was round-tripped through OKLCH and back with no drift, and every contrast ratio quoted in the specs was computed, not estimated. That is how `text-muted` moved from `#7A828E` to `#868E9A`: the original measured 3.92:1 on `surface-overlay` and would have failed AA. The weakest role in the final palette is `text-muted` at 4.60:1 on `surface-overlay`; the weakest status hue is `destructive` at 4.80:1. Both pass.

### D3 — The accent is amber, and "warning" is deliberately kept as a separate yellow

`accent` is `#FFB020` (OKLCH hue 75°). `warning` is `#D9B310` (OKLCH hue 93°).

**Why this is a real problem, stated plainly:** 18° of hue separation is not much. In infrastructure tooling, "warning" is conventionally amber and so is "primary/active", so this collision is structural, not a palette mistake.

**Decision:** keep both, because collapsing them would force a status vocabulary with no natural home for "degraded" or "expiring" — states the planned credential feature will need. Resolve the ambiguity structurally rather than cosmetically: `StatusIndicator` is required to render a shape plus a caller-supplied text label, so tone is never the sole channel. The shape differs per tone, so the pair is distinguishable in greyscale. The specs make this a normative requirement, not a convention.

**Alternative considered:** drop `warning` and let `destructive` cover degraded states. Rejected — it collapses "needs attention" into "failed", which is exactly the distinction a credential's expiry state turns on.

### D4 — Primitives are hand-rolled; variant selection is a plain `Record` lookup

Each primitive is a single function component with a `const VARIANTS: Record<Variant, string>` lookup and template-literal class assembly, composed with a local `cn` helper.

**Why:** the variant sets are tiny and closed — four button variants, two sizes, six status tones, six card parts. A variant *engine* solves a problem this system does not have yet.

**Why not `class-variance-authority`:** it exists to make large, composable, multi-dimensional variant spaces ergonomic with type-level inference. Paying a runtime dependency and an API surface for four string constants is a bad trade, and the v1 portfolio's dependency list is the cautionary case.

**Why not `clsx` + `tailwind-merge`:** `clsx` is a 500-byte conditional-class join that is fully replaceable. `tailwind-merge` resolves conflicts between *caller-supplied* class strings — it matters when a consumer passes `className="p-8"` into a component whose base already has `p-4`. **No primitive in this system accepts a `className` override prop**, which is a deliberate decision (see D9), so there are no conflicts to merge. If a later feature genuinely needs consumer class overrides, `tailwind-merge` is added then, with a real reason.

`cn` is therefore ~4 lines: filter out falsy values and join with a space.

### D5 — Two client components, both leaves

The entire application is Server Components except:

1. `components/layout/nav-link.tsx` — calls `usePathname` to mark the current route. It is a leaf: it renders one `<Link>` and knows nothing about the header's structure.
2. The mobile disclosure — solved with native `<details>`/`<summary>` (D6), so this one turns out to need no client component at all.

**Why a leaf:** `usePathname` is a Client Component hook by design; reading the URL in a Server Component is explicitly unsupported. The alternative is marking the whole `SiteHeader` as a client component, which would pull the wordmark, the full nav list, and the footer's structure into the client bundle. Confining it to a leaf keeps the boundary at one `<a>`-equivalent per link.

**Trade-off accepted:** the header and footer each pay a small client boundary. That is cheaper than a client header, and it keeps the props flow one-directional.

### D6 — The mobile nav disclosure is native `<details>`/`<summary>`, not React state

**Why:** `<details>`/`<summary>` gives keyboard operability, focus handling, and an exposed expanded/collapsed state to assistive technology from the platform, with zero client JavaScript. The app-shell spec requires the disclosure to be keyboard-operable and to report its state; the native element satisfies both before a line of code is written. React 19 supports it without hydration mismatch.

**Trade-off accepted, stated honestly:** the native element does not close on outside click, and Escape-to-close is not universal across browsers. For a primary-navigation disclosure that is an acceptable gap at this stage, and adding it later means adding a small client component *around* the native element rather than replacing the semantics. If it proves irritating, the migration is local to one file.

`summary` is restyled to a full-width control with `list-style: none` and a custom indicator; the disclosure marker is hidden but the element's semantics are preserved.

### D7 — Elevation is surface role only; there are no shadows in the system

Depth is expressed by moving from `surface` → `surface-raised` → `surface-inset`/`surface-overlay`, with a 1px hairline as the boundary.

**Why:** the "technical infrastructure" register comes from flat planes and hairlines, not from soft drop shadows. Shadows also reintroduce a light-source assumption that fights a purely dark palette. This is also the cheapest accessibility position: no shadow rendering cost, and separation is carried by measured colour contrast.

**Consequence, accepted:** `surface` at `#0B0C0E` against `surface-raised` at `#131519` is a small luminance step, so cards rely on the hairline to read as bounded. The hairline is `border` at 1.36:1, which is below the 3:1 that WCAG 1.4.11 asks of a boundary that *conveys* information. That is acceptable here precisely because the card's own surface is a large, uniform region and the boundary is decorative reinforcement rather than the sole carrier of the grouping. The spec states this explicitly rather than implying the border meets a contrast bar. `border-strong` at `#66696E` is the one that carries a real 3:1 guarantee (3.55:1 on `surface`) and is reserved for interactive boundaries.

### D8 — Radii are capped at 6px and borders at 1px, enforced in the token layer

**Why:** small radii and hairline borders are the primary visual carriers of the instrumentation register, and they are cheap to enforce because the token layer has exactly three radius steps and one border width. `rounded-full` is not available as an escape hatch, because it is not a token.

**Note on enforcement:** this is a convention enforced by review, not by tooling. Tailwind will happily emit `rounded-3xl` from its default theme. A future guard is possible (a lint rule banning radius and colour literals outside the token layer) but is out of scope here and is recorded as an open question rather than silently dropped.

### D9 — Primitives do not accept a `className` override

A primitive's classes are determined entirely by its own variant, size, and tone props plus its children.

**Why:** it is the precondition that makes D4's decision to skip `tailwind-merge` sound, and it is what keeps a primitive visually identical everywhere it is used — the actual point of a design system. It also means a primitive's appearance is reviewable by reading the component.

**Trade-off accepted:** a consumer cannot nudge a single card. The answer to "this one card needs different padding" is a new variant, reviewed once, rather than a one-off override at a call site that will drift.

### D10 — Focus indicators use `outline`, not `box-shadow`, on `:focus-visible`

`outline: 2px solid var(--color-accent); outline-offset: 2px;` applied on `:focus-visible`.

**Why `outline`:** it draws outside the element's box, so it stays visible on an `accent`-filled primary button without needing a second colour. `box-shadow` would be clipped by adjacent overflow and would sit *under* the fill on a same-colour ring.

**Why `:focus-visible` and not `:focus`:** keyboard focus is what needs a ring; a mouse press on a button producing a persistent ring is noise. The spec's ≥3:1 requirement is checked against both the adjacent surface and the element's own fill, which is why the ring colour cannot simply equal the fill.

### D11 — The two typefaces are loaded once in the root layout via `next/font/google`

`IBM_Plex_Sans` and `IBM_Plex_Mono`, each with `subsets: ['latin']`, `display: 'swap'`, and a `variable` CSS variable, applied to `<html>`.

**Why:** build-time self-hosting with no third-party runtime request (a GDPR-adjacent win, verified as a documented `next/font` behaviour rather than assumed), and automatic metric-matched fallbacks that prevent layout shift.

**Why both families, given the cost:** the dual-face rule is the load-bearing idea of the design — prose in Plex Sans, everything a machine would emit in Plex Mono. That single rule is what makes metadata, tech stacks, and terminal content read as instrumentation rather than as prose that happens to be small. It also directly replaces v1's failure mode, where a technology badge was just a small coloured pill with no type distinction at all.

Type scale steps are declared as `--text-*` theme entries with their `--line-height` and `--letter-spacing` sub-keys, so a single utility class carries all three and a step cannot be applied with a mismatched line height.

### D12 — The token layer is exposed for review at `/design-tokens`, unlinked from primary nav

A route that renders every colour role with its swatch and computed contrast, every radius and spacing step, every type step in both faces, and every primitive variant.

**Why it exists:** the palette was derived rather than inherited, and D2's gamut-clipping episode is exactly the class of error that is invisible in a token file and obvious on a rendered swatch. This route is the cheapest possible insurance, and it is the artifact the user reviews to approve or correct the palette before the feature work lands.

**Why unlinked:** it is a system reference, not site content. It stays reachable by direct URL, is excluded from the navigation definition, and — being an ordinary static route — is fully present in the build rather than being conditionally compiled out.

## Risks / Trade-offs

- **The palette is derived, not inherited, and may not match the intended design.** → It is fully specified, contrast-verified, and rendered at `/design-tokens` for review before any feature work. Correcting it is a single-file edit plus a rebuild; nothing else in the system hardcodes a colour. The `/design-tokens` route is the review surface for exactly this.
- **Amber `accent` and yellow `warning` are close in hue.** → Tone is never the only channel: `StatusIndicator` requires a shape plus a caller-supplied label, and shapes differ per tone so the pair survives greyscale. Made normative in `specs/ui-primitives` rather than left to convention.
- **Hairline `border` at 1.36:1 is below the 3:1 WCAG asks of an informative boundary.** → Accepted because the card's surface region, not the border, carries the grouping, and the border is decorative reinforcement. Stated explicitly in `specs/design-tokens` so no one later mistakes it for a passing 3:1 check. `border-strong` carries the real 3:1 guarantee and is reserved for interactive boundaries.
- **`border-strong` measures 2.76:1 on `surface-overlay`, below 3:1.** → Constrained by rule: `border-strong` is used only on `surface`, `surface-raised`, and `surface-inset` contexts, where it measures 3.55, 3.32, and 3.07. Overlays use `border` and do not carry interactive boundaries. Recorded so the constraint is not accidentally violated.
- **Radius and colour discipline is enforced by review, not tooling.** Tailwind will emit `rounded-3xl` or `text-orange-500` on demand. → The specs make both normative violations, and the small primitive set keeps the review surface small. An automated guard is a known follow-up, recorded as an open question rather than assumed.
- **Native `<details>` does not close on outside click, and Escape-to-close is not universal.** → Accepted for a primary-nav disclosure. The semantics, keyboard operation, and state exposure come free; the migration to a stateful control is local to one file and does not discard the accessibility behaviour.
- **Primitives reject `className` overrides, which will occasionally feel restrictive.** → Preferred over ad-hoc overrides that drift. Escape hatch is a new variant, reviewed once. Also the reason `tailwind-merge` is genuinely unnecessary rather than merely deferred.
- **Hue/chroma/lightness triples in OKLCH comments will silently drift if a hex is edited without updating the comment.** → Accepted; the hex is normative and the OKLCH is documentation. The comment is a reading aid, and a stale comment cannot change any rendered value.
- **The first content-bearing feature may reveal that the primitive set is missing a variant.** → Expected and cheap. Adding a variant to a hand-rolled `Record` is a one-line change with no dependency cost, which is a direct benefit of D4.

## Migration Plan

Preconditions: working tree is a clean `create-next-app` scaffold with no content, so there is nothing to migrate and no data to preserve.

1. Replace `app/globals.css` with the token layer. At this point the app renders unstyled-but-token-driven; no component exists yet to break.
2. Add `lib/cn.ts` and `lib/navigation.ts`. No visual effect.
3. Add `components/ui/*`. Wire nothing yet.
4. Add `components/layout/*` and rewrite `app/layout.tsx` (fonts, metadata, shell). First point at which the page has a real frame.
5. Rewrite `app/page.tsx` as a composition demonstrating the shell and every primitive. Delete the unused `public/*.svg` scaffolding assets.
6. Add `app/design-tokens/page.tsx`.
7. Verify: `npm run lint`, `npx tsc --noEmit`, `npm run build`. Review `/design-tokens` and correct the palette if needed.
8. Replace `README.md` with the design-system overview.

**Rollback:** the entire change is confined to `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `README.md`, the `public/*.svg` deletions, and new files under `app/`, `components/`, and `lib/`. Rollback is `git checkout` of the four modified/deleted paths plus removal of the new directories — one commit, no database, no external state, no user data at risk. Because the change is a single commit against a scaffold with no dependents, revert is always safe.

**Verification gates:** the build stays green after each numbered group in `tasks.md`; the change is not complete until `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass and `/design-tokens` has been reviewed.

## Open Questions

Genuinely deferrable — none of these would change the specs, the approach, or the task breakdown:

- **Should the token-discipline rules (no raw colours, radii ≤ 6px) be enforced by a lint rule or a small script?** The specs make them normative and review enforces them for now. Automating is a self-contained follow-up that does not alter the design.
- **Should `/design-tokens` be excluded from the production build?** It is currently an ordinary static route, unlinked from navigation. Excluding it via a conditional is possible but not worth the branch until deployment is configured.
- **Should `border-strong` be re-derived so it clears 3:1 on `surface-overlay` too, rather than being restricted by rule to the three lower surfaces?** Both are acceptable; the restriction is documented, so changing it is a single-token edit whenever overlay-based interactive elements first appear.
- **What is the maximum reading width for the main column?** The task list will use a provisional value from the spacing/container scale; the exact number is a judgement call better made against real case-study content than against placeholder text.
