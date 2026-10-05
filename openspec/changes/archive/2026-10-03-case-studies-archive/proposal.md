## Why

The site publishes seven case studies but presents them as two featured cards on the landing page and a terminal command, with no page that lists them. Five of the seven are reachable only by guessing a slug from the featured cards, and `components/sections/featured-work.tsx` tells visitors the remaining five are "available on request" — a claim that is false, because all seven are published and counted. The portfolio's main body of work is therefore both undiscoverable and misdescribed.

## What Changes

- Add a `/projects` archive route: a responsive card gallery listing every published case study, built entirely from the content model with no case-study information hardcoded in any component.
- Add a `domains` field to the case-study collection: a closed set of technical domains (`infrastructure`, `cloud`, `cybersecurity`, `networking`, `devops`, `software`, `iot`) declared as a taxonomy, populated per case study by the owner. This is a new axis and does not replace `category`, which remains the engagement context (`Academic`, `Freelance`, `Personal`).
- Add category and domain filters to the archive. Both are server-rendered from declared values; the filter set is derived from the records in use rather than from a list held in a component.
- Add sorting by title A–Z, featured-first, and technology count. No date sort: `year` is absent on all seven case studies, so a date ordering would have nothing to order by.
- Render technology tags on each card from the case study's resolved technology records, with no invented or inferred tags.
- Render the featured state on a card from the existing `featured` order index rather than introducing a second featured flag.
- Point the case-study page's back link at the archive rather than at the landing page, and link the landing page's featured section to the archive.
- Correct the featured section's prose, which hardcodes the category vocabulary and claims unfeatured work is unavailable on request.

## Capabilities

### New Capabilities
- `case-studies-archive`: the `/projects` archive route — what it lists, how cards present a case study, how filters and sorting are derived and applied, and how the page stays data-driven, server-rendered, and accessible.

### Modified Capabilities
- `content-model`: a case study declares the technical domains it belongs to, as a closed set validated at build time and countable as identities; and the featured section's own prose is no longer a place where category vocabulary or an availability claim is written.
- `project-detail`: a case-study page presents its declared domains, and its back destination is the archive rather than the landing page.
- `home-page`: the featured section links to the archive and makes no claim that unfeatured work is unavailable.

## Impact

- **New code**: `app/projects/page.tsx`; card, filter, and sort components under `components/archive/`; a sort/filter derivation module under `lib/content/`.
- **Content model**: `lib/content/schema.ts` gains a `CASE_STUDY_DOMAINS` closed set and a `domains` field on `PROJECT_SCHEMA`; `lib/content/model.ts` resolves it onto `CaseStudy`; `lib/content/derive.ts` exposes the archive's filter and sort inputs.
- **Content data**: `content/case-studies.csv` gains a `domains` column, populated by the owner for all seven records. `content.pre-portfolio-content-model/` remains the rollback copy of the pre-migration files.
- **Existing components**: `components/sections/featured-work.tsx` loses its hardcoded category vocabulary and gains a link to the archive; `app/projects/[slug]/page.tsx` renders domains and retargets its back link.
- **No new dependency.** No search library, no state library, no component library — filtering and sorting are server-side derivations over records already in the model.
- **No client component is required.** Filters and sorting are links carrying query parameters, and the archive re-renders on the server per request, so the "Content access stays server-side" requirement holds without exception. The route is the application's first request-time route; every existing route remains prerendered.
- **Compatibility**: additive. No existing route, address, or requirement is removed. `/projects/[slug]` continues to serve the same seven addresses.

## Non-goals

- **Search.** Deferred deliberately. Seven published records are browsable by category and domain, and a search field would either ship a content index to the browser — a documented exception to the server-side content requirement — or make the route dynamic for no navigational gain.
- **Date sorting.** Deferred until the content records years. The sort option appears when at least one case study carries a `year`; it is not added with an empty or inferred date.
- **Pagination or infinite scroll.** Seven records fit one page. A paged archive is a control that has nothing to paginate.
- **A `it-operations` domain.** The owner's focus areas include it, but no case-study content supports it, and a taxonomy entry with no members is a filter that always yields nothing.
- **Reclassifying `category`.** The engagement context stays as it is and is offered as its own filter group rather than merged into `domains`.
- **Case-study thumbnails in the archive grid.** `case-study-media.csv` exists and media renders on the case-study page; deciding how a card presents media is a separate concern.
- **Tagging the terminal or the landing page with domains.** Domains are an archive concern until a surface needs them.
