## Context

See `proposal.md` — Why for motivation, and `specs/` for the requirements this design implements.

The constraints that shape the approach, all of them existing and none of them negotiable without their own change:

- **Zero runtime dependencies.** `package.json` holds `next`, `react`, `react-dom` and nothing else. Content parsing is in-repo by requirement. There is no state library, no component library, and no search library to reach for.
- **One client leaf.** `components/layout/nav-link.tsx` is the only `'use client'` file outside the terminal, and it exists solely because `usePathname` is a Client Component hook. `lib/navigation.ts` documents that the content model must never be imported by anything a client component reaches.
- **`searchParams` is a Promise** in Next 16.3.8 and is a request-time API: reading it opts the page into dynamic rendering (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md:119`). The same document names filtering, pagination, and sorting from `searchParams` as the supported pattern (`:166`). There is no Cache Components or `use cache` in this project, so there is no partial-prerender optimisation to design around.
- **Two axes already exist and mean different things.** `CaseStudy.category` (`lib/content/schema.ts:26`) is the engagement context — `Academic`, `Freelance`, `Personal`. `FOCUS_AREAS` (`content/site.ts:141`) is the technical direction — `infrastructure`, `cloud`, `cybersecurity`, `networking`, `it-operations` — and its membership is derived from experience skills, certification issuers and titles, and education fields, never from case studies.
- **`year` and `role` are empty on all seven case studies**, so any ordering by them is an ordering by nothing.
- **The landing page already states something false.** `components/sections/featured-work.tsx:49` writes the category vocabulary into prose and tells visitors the unfeatured case studies are "available on request".

## Goals / Non-Goals

**Goals:**

- Make filtering and ordering work with no client component, no client state, and no content in the browser bundle.
- Add the technical-domain axis without disturbing the engagement category, and keep both editable as data.
- Derive every option set, every ordering, and every figure from the records, so no component holds a list or a number.
- Add the minimum new surface to the design system, and only where an existing primitive cannot carry the job.

**Non-Goals:**

- Any client-side interactivity, including client-side filtering and instant search.
- A new design-system primitive. Everything here composes `Card`, `Button`, `TokenChip`, `Metadata`, and the token layer.
- Any change to how the case-study detail page presents narrative sections, media, or related records.
- Making the archive the primary navigation. One link from the landing page's featured section and one back-link from each case study is the whole navigation surface (see the `project-detail` delta).

## Decisions

### D1 — Filters and ordering are links carrying query parameters, and the route reads them server-side

`app/projects/page.tsx` receives `searchParams`, awaits it, and derives the card set on the server. Each filter control and each ordering control is an ordinary `next/link` whose `href` is the archive address plus the active state.

*Why.* It is the only arrangement that satisfies three requirements at once: filtering must work without scripting, no content may reach the browser bundle, and no client component may be introduced. Client-side filtering would need a serialised index of titles, slugs, categories, and domains in the bundle — a documented exception to "Content access stays server-side" for a list of seven records. A `useSearchParams` client wrapper would reintroduce the one client leaf the codebase deliberately confines to `nav-link.tsx`.

*Alternative rejected:* client-side filtering over a minimal index. Faster to type, no round trip, and it ships owner content to the browser to do something seven links already do.

*Consequence, accepted deliberately:* this is the application's first request-time route. Every existing route stays prerendered, and `/projects/[slug]` keeps `generateStaticParams`. The cost is one server render per filter click instead of a static file.

*Consequence, also accepted:* state lives in the URL, so a filtered archive is linkable, survives reload, and works with the back button. This is a gain, not a cost.

### D2 — `domains` is a new closed set, not a reuse of `FOCUS_AREAS` and not a rename of `category`

`lib/content/schema.ts` gains:

```
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
```

with `domains: { kind: 'oneOf', values: CASE_STUDY_DOMAINS, optional: true }` on `PROJECT_SCHEMA`, following the pattern already used for `category` and `TECHNOLOGY_CATEGORIES`. Values are lowercase kebab-case because the field is a slug-shaped list and the model resolves it against a set the way `slugRefList` resolves references.

*Why not reuse `FOCUS_AREAS`.* A focus area is a claim about the owner's direction, and its membership is evidence gathered from skills, credentials, and a degree. `it-operations` is a focus area precisely because it is evidenced by an internship and two skill tokens; it is not something any case study is *about*. Putting it in a case-study taxonomy would ship a filter that matches nothing, and would make the two taxonomies look interchangeable when they answer different questions. It is excluded, and adding it later is a one-word edit.

*Why not reuse `category`.* They are independent facts — `Academic`/`Freelance`/`Personal` say under what relationship the work was done; `infrastructure`…`iot` say what it is about. `devops`, `software`, and `iot` have no counterpart in the engagement axis, and forcing a case study into one axis loses the other. They are offered as two filter groups.

*Alternative rejected:* deriving domains from the declared technologies, so a case study using AWS is tagged `cloud`. Rejected because it is wrong in both directions — `guardian-vision` uses AWS but is an IoT voice-alert system for caregivers, and tagging it `cloud` misdescribes it; and no technology implies `cybersecurity` or `networking` at all. The `content-model` delta states this as a requirement so the inference cannot be reintroduced.

### D3 — Option sets are derived from the published records in use, not from the declared set

Both filter groups are built by walking the published case studies and collecting the distinct values each one declares, then counting how many case studies carry each. An option with a count of zero is not rendered.

*Why.* The declared set answers "what may the owner say", which is not what a visitor needs. A visitor needs "what can I filter by". Rendering `devops` before any case study declares it offers a control that always yields an empty result, which reads as a broken filter rather than an unused category.

*Alternative rejected:* render the whole declared set and disable empty options. Rejected — a disabled control still occupies space and still has to be explained, and "this category exists but nothing is in it" is content-model information, not visitor information.

### D4 — Three orderings, and no date ordering until a year exists

`lib/content/derive.ts` exposes three orderings over the published set: `title` (alphabetical by the record's title, locale-aware, with a stable tiebreak on slug so equal titles cannot reorder between builds), `featured` (declared marker ascending, unfeatured last), and `technology-count` (descending by resolved technology count, tiebroken by title).

`year` ordering is gated: `dateOrderingAvailable` is true only when at least one published case study records a `year`, and the control is rendered only when that holds.

*Why the gate rather than a permanent omission.* The `year` field is declared, optional, and validated precisely so the owner can start filling it in. A sort control that appears the moment a year exists is the difference between a data edit and a code change. Rendering it unconditionally would mean ordering seven records by an absent field, which is exactly the arbitrary ordering the `case-studies-archive` delta forbids.

### D5 — Archive-local components, no new design-system primitive

New files under `components/archive/`: `case-study-card.tsx`, `filter-group.tsx`, `archive-toolbar.tsx`. They compose existing primitives and take no `className` override.

*Why.* `components/sections/chip.tsx:6` sets the precedent in a comment: a helper serving one surface is not a primitive, and adding to `components/ui/` "would widen the system for no gain". Three filter groups inside one route is still one surface. `ui-primitives` also requires every primitive to be domain-agnostic, and a `FilterChip` that understood "category" versus "domain" would not be. If a second surface later needs selected filter chips, that is the moment to promote one.

### D6 — The selected filter mirrors the active navigation item, in two channels

A filter control is a link shaped like the existing `TokenChip` and, when active, is styled like `nav-link.tsx`'s current item: accent text **plus** a visible non-colour marker, plus `aria-current="true"`.

| Role | Token | Value | OKLCH | Measured contrast |
| --- | --- | --- | --- | --- |
| Resting border (interactive) | `border-strong` | `#66696E` | `oklch(0.520 0.009 261)` | 3.07:1 on `surface-inset` (≥ 3:1 required) |
| Resting fill | `surface-inset` | `#1A1D22` | `oklch(0.230 0.011 261)` | — |
| Resting label | `text-secondary` | `#A8AEB8` | `oklch(0.749 0.016 261)` | 7.57:1 on `surface-inset` |
| Active fill | `accent-subtle` | `#3A2A0E` | `oklch(0.297 0.048 79)` | — |
| Active border | `accent` | `#FFB020` | `oklch(0.813 0.165 75)` | 9.24:1 on `surface-inset` |
| Active label | `accent` | `#FFB020` | `oklch(0.813 0.165 75)` | 7.57:1 on `accent-subtle` |

All values are defined in `app/globals.css` inside `@theme` and reach the markup as Tailwind role utilities — `border-border-strong`, `bg-surface-inset`, `text-text-secondary`, `bg-accent-subtle`, `border-accent`, `text-accent` — per "Colors are referenced by role, never by raw value". No token is added.

*Why `border-strong` and not `border`.* `design-tokens` assigns `border-strong` as the boundary for interactive elements and `border` as a decorative hairline. `TokenChip` uses `border` because it is a static label; a filter is focusable, so it takes the stronger role. The active marker is a `h-2 w-2 rounded-xs bg-accent` dot rendered `aria-hidden`, exactly as in `nav-link.tsx:34`, so the active filter survives greyscale and colour-blind viewing.

*Why accent is legitimate here.* `design-tokens` permits accent on "an interactive control, a focus indicator, the active navigation item, or a live/active status", and forbids it as "decorative emphasis such as section headings, dividers, or background fills behind ordinary prose". A selected filter is an interactive control in its active state, which is the permitted case.

### D7 — Query parameter contract, and unparseable state is ignored rather than rejected

| Parameter | Values | Default |
| --- | --- | --- |
| `category` | one or more `CaseStudy.category` values, repeatable | absent = no category filter |
| `domain` | one or more `CaseStudyDomain` values, repeatable | absent = no domain filter |
| `sort` | `title`, `featured`, `technology-count`, `year` | `featured` |

Parsing drops any value outside the permitted set for that parameter rather than failing the request, and drops any `sort` the archive does not offer. An unrecognised parameter is ignored.

*Why.* A stale bookmark, a mistyped query, or a crawler probing `?sort=; DROP TABLE` must render the archive, not a 500. Because every value is checked against a closed set before it reaches a comparison, an unsanitised value is not a code path at all. Toggling a filter means rebuilding its own parameter set and keeping the others, so filters compose without a client state machine.

*Alternative rejected:* redirect to a canonical query on an unrecognised value. Rejected as hostile — it turns a visitor's mistyped link into a redirect and loses the rest of their state.

### D8 — `/projects` sits beside `/projects/[slug]`, and the archive enumerates nothing itself

`app/projects/page.tsx` is a sibling route of the existing dynamic segment, so `/projects` is the archive and `/projects/<slug>` remains each case study. The archive reads `DERIVED.publishedCaseStudies` — the same derived answer the detail route, the statistics, and the terminal already read — so there is exactly one definition of what exists on the site.

Each card links to `/projects/${caseStudy.slug}` rather than to `liveUrl`, matching `featured-work.tsx:102`, because the case study is the record of the work and the live destination is one fact inside it.

### D9 — The featured section loses its hardcoded sentence and gains a link

`components/sections/featured-work.tsx:49` is replaced. The count sentence stays — the `home-page` requirement "Unfeatured projects are not silently dropped" depends on it — but the category vocabulary is removed and an archive link is added when the shown count is below the total.

*Why now.* "The remaining N are academic, freelance, and personal work available on request" states a category list no code owns and an availability claim the content contradicts: all seven are published, and after this change they are browsable. The archive is what makes the sentence checkable, so the sentence is corrected here rather than left to rot.

### D10 — The back destination on a case-study page points at the archive

`app/projects/[slug]/page.tsx:96` changes from `/` with the label "Back to the portfolio" to `/projects` with the label "All case studies".

*Why.* A visitor who arrived at a case study by address or from the terminal has no way back to the rest of the work except the landing page and then the featured section, which shows two of seven. The archive is the nearest thing to a parent route.

### D11 — Featured state on a card is a token, not a status indicator

`components/ui/status-indicator.tsx` is for states with a lifecycle — active, verified, revoked. Featuredness is a selection, not a lifecycle, and `featured-work.tsx:25` already reasons this way for categories and technologies. The card renders a `TokenChip` reading `Featured`.

## Risks / Trade-offs

- **Request-time rendering costs a render per filter click** → Accepted. Seven records render in single-digit milliseconds, and the alternative is shipping content to the browser. Revisit if the archive grows past roughly a hundred records and the render becomes measurable; the D1 migration at that point is a client boundary plus an index endpoint, not a rewrite of the derivation.
- **The owner must populate `domains` for all seven records or the filter is thin** → The build accepts an empty `domains` by design, so this cannot block the change. The archive renders only the options the content supports (D3), so a partially populated column produces a partially populated filter rather than an error. Flagged in the migration plan rather than papered over.
- **Two taxonomies with overlapping words invites future conflation** → Mitigated by specification, not convention: the `content-model` delta states that domain and category are independent and neither is derived from the other, and that domains are never inferred from technologies.
- **A domain the owner wants has no value in the set** → A one-word edit to `CASE_STUDY_DOMAINS`, which is the same edit that makes the value legal in code. Stated as a requirement so it stays a data edit.
- **`aria-current` on several filter links at once** → Valid and intended: `aria-current="true"` marks each active filter link within the group, and each group carries its own accessible name so a visitor is told which axis they are on before activating one.
- **The archive is the first dynamic route, so it is the first route where a build-time mistake becomes a runtime one** → Every filter value is checked against a closed set before use, so no query string reaches a comparison unchecked. `npm run build` plus a manual pass over `/projects`, `/projects?category=Freelance`, `/projects?domain=iot&sort=title`, and `/projects?sort=bogus` covers it.

## Migration Plan

1. Add `CASE_STUDY_DOMAINS` and the `domains` field to `lib/content/schema.ts`; resolve it onto `CaseStudy` in `lib/content/model.ts`.
2. Add the `domains` column to `content/case-studies.csv`. Leave it empty for every row at this step so the build passes unchanged.
3. Extend `lib/content/derive.ts` with the archive's filter option sets, the three orderings, and the date-ordering gate.
4. Build `components/archive/` and `app/projects/page.tsx`.
5. Retarget the case-study page's back link and add its domain rendering.
6. Correct the featured section's prose and add the archive link.
7. **Owner step:** populate `domains` per case study. Until then the domain filter shows only what has been filled in.
8. Verify with `npm run lint`, `npx tsc --noEmit`, `npm run build`, then the four route shapes named under Risks.

**Rollback.** Every step is additive and `content/` is untracked, so reverting is a matter of dropping the new files, the `domains` column, and the edited components. `content.pre-portfolio-content-model/` still holds the pre-migration CSVs if the column itself needs to be undone. Nothing published depends on this change: `/projects/<slug>` keeps serving the same seven addresses, and `/projects` is a new one.

## Open Questions

None. The three questions that would have changed the design — which axis the filters use, whether search is in scope, and what the orderings are — were resolved before this document was written, and the remaining choices are reversible data edits rather than design changes.
