## Context

The content layer is `lib/content/`, four delimited files under `content/`, and a typed identity
module `content/site.ts`. `schema.ts` declares each collection's fields and their kinds; `validate.ts`
enforces them per file; `model.ts` builds frozen typed records; `derive.ts` computes the statistics
and the taxonomies. Nothing imports a CSV directly, so there is one place a content rule can live.

Three facts about the current data shape the approach:

- **The files are wide and thin, not deep.** `projects.csv` has 8 columns for 7 records;
  `experiences.csv` has 9 for 20; `certifications.csv` has 6 for 6; `education.csv` has 6 for 3. The
  site can count these records accurately and say very little about any one of them.
- **Dates are already a known failure.** `duration` and `period` are free-text spans parsed by
  pattern. The build reports `experiences.csv` line 12 — "October 2022 - August 2022" — as a span
  that ends before it begins. The parser is doing the job it was designed for; the data is the
  problem, and the shape invited it.
- **Three columns are already dead.** `badgeColor` and `color` are validated and never rendered,
  because the design-tokens capability forbids content-supplied colour. `schema.ts` says so in a
  comment. `techStack` is live but untyped: a list of spellings, not identities.

Two constraints from earlier changes hold. Content lives inside the repository and no build or
runtime path escapes it. And no content payload reaches the browser bundle, which is why the
terminal's `open` command resolves on the server — see `specs/terminal/spec.md` in this change.

## Goals / Non-Goals

**Goals:**

- Model records with the fields a case study, credential, and role actually have, and validate every
  one of them at build time whether or not it is required.
- Make a relationship between two records expressible once and resolvable to the record.
- Make publication a declared fact with one derived predicate, so the route, the counts, and the
  terminal cannot disagree about what exists.
- Make "unique technology" a count of identities rather than a distinct-string scan.
- Replace free-text spans with dates the system can compare.
- Keep the layer dependency-free and server-only.

**Non-Goals:**

- **No design token is added, changed, or removed.** This change touches no colour, spacing step,
  radius, or type step, so no token value is specified here. The one presentational consequence —
  media and section headings on a case study — composes from the primitives `project-detail`
  already requires.
- **No runtime dependency, and no new package.** Every capability below is in-repo code: a date
  parser, a reference resolver, a Levenshtein-free alias matcher over declared strings.
- **No client component.** The content stays server-side, as `content-model` already requires.
- **No image pipeline.** `media` is modelled and validated; nothing resizes, converts, or optimises.

## Decisions

### D1. Widen the delimited files; do not introduce a new format or a new file per section

The case study's fields live as columns on one row, including the nine narrative sections.

**Why.** The existing `content-model` capability already decides representation by shape: repeating
collections are delimited files, singletons are typed modules. A case study is one record, so it is
one row. The parser already recovers commas, quotes, and line breaks inside a quoted field, so
multi-paragraph prose needs no format change. And keeping the whole record on one line is what lets
a build fail on a half-written case study — if `results` were its own file, a missing `results` file
would be indistinguishable from a case study that has no results.

**Alternatives.** JSON or YAML modules — rejected: hand-edited structured prose is where a trailing
comma costs an afternoon, and it would need a parser dependency. One file per narrative section —
rejected: seven files per case study, and record completeness stops being checkable in one place.

### D2. Publication status is a declared field; the published set is one derived predicate

`status` is a `oneOf` over `published` and `draft`. `derive.ts` exposes the published case studies as
a single derived value, and the route, the statistics, and the terminal all read it.

**Why.** Three surfaces must agree about what exists. Today they cannot, because the terminal keeps
its own empty list in `lib/terminal/commands.ts` and the route has no concept of publication at all.
One predicate, computed once, is what makes agreement structural rather than a convention.

`status` is **required**, not optional, with no default. A record's visibility is a decision; making
it optional would make "forgot to say" and "draft" the same state, which is the ambiguity the
requirement exists to remove.

**Seed value: all 7 records declare `published`.** This is an owner decision, not a derivable one —
nothing in the repository records which case studies are finished. It is chosen because it is the
only value under which the three surfaces agree without a visible regression: today the landing page
states "Projects: 7" while all 7 addresses 404. Publishing all 7 makes those 7 pages exist and keeps
the figure at 7. Marking them draft instead preserves the 404s and drops the displayed count to 0,
which is a regression the change would have to explain. This presupposes D12 — the route has to exist
for a published status to mean anything.

**Alternatives.** A separate boolean column — rejected: two spellings of one fact. A route-level
allowlist — rejected: that is the current arrangement, and it is what produced the drift. All 7
marked `draft` — rejected as above.

### D3. Cross-references store the target's slug and resolve to the record during assembly

A certification's related case studies are stored as the case studies' slugs. Resolution runs after
every table is read and validated, before any record is built.

**Why.** The slug is already the collection's unique, format-checked, build-verified identity, and
`project-detail` already makes the case for it: renaming a title must not move a published address.
A relationship keyed on slug inherits that guarantee for free. Resolution as a distinct pass means
file order does not matter — a certification may reference a case study declared later.

The reverse direction is derived. `relatedTo(slug)` walks the other collections, so a relationship is
written once and both pages see it.

**Alternatives.** Numeric ids — rejected: meaningless in a file a human edits, and renumbered on
insert. Titles — rejected: the same breakage `project-detail` already rejects for slugs. Storing the
resolved record in the file — impossible, the file is text.

### D4. Technologies become a collection; declared mentions reference them by key

`technologies.csv` carries `key` (slug kind, unique across the collection), `name`, `category`
(`oneOf`), and `aliases` (list). Case studies, and an experience's `tools` and `systems` lists,
reference a technology by its key.

**Why.** This is what turns "16 distinct technologies" from a `Set` of spellings into a count of
records. It also converts the failure mode: today a technology nobody has heard of becomes a new
entry in the list silently, and the existing taxonomy requirement already forbids exactly that
behaviour for cloud platforms. Extending the same rule to technologies is consistent rather than new.

**Seed: one record per distinct value currently in `projects.csv` `techStack` — 16 records.** All 16
are seeded exactly as written, including the two that are not specific technologies. `Version Control
Systems` is a practice and `IoT` is a field, and the owner's answer is to keep both and let
`category` say so, rather than have the change substitute names the owner never wrote. The category
set is therefore wider than "language | framework | platform": it must be able to hold a practice and
a field, because those are things the stack genuinely records.

**`experiences.csv` `skills` is NOT a technology list, and must not be read as one.** 17 of its 20
distinct values are capabilities or activities — `Communication`, `People Management`, `Business
Analysis`, `Events Management`, `IT Governance`, `Service Management`, `Operations`, `Writing` — and
the `content-model` focus-area requirements match signals against exactly those tokens. Seeding
`technologies.csv` from `skills` would create a `Technology` record for `Communication`, make the
unique-technology figure a count of soft skills, and break the focus-area matching that already
works. So `skills` stays free text, and a new `tools` list carries the genuinely technological
entries — `AWS`, `Google Cloud`, `Microsoft Azure`, `Flutter` — as key references.

**Consequence for the figure, stated up front.** The derived unique-technology count **changes**: 16
today, 19 after the migration, because three tools that were previously invisible to the count
(`Google Cloud`, `Microsoft Azure`, `Flutter`) become references while `AWS` was already present.
Tasks report the before and after figures with a per-record explanation rather than asserting they
are equal.

**Alternatives.** Keep free text and normalise at derive time — rejected: it cannot fail on an
untracked mention, which is the case that matters. Embed technologies in one file with aliases —
rejected: aliases are shared across every mention, so they belong to the technology, not to the
mention. Make `skills` a `slugRef` list too — rejected: it would force every soft skill to be a
technology record.

### D5. Dates are `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`; precision is carried, not invented

`startDate` and `endDate` accept three precisions. Each normalises to the first instant it denotes,
and the record carries the precision that was declared.

**Why.** The data is genuinely mixed: `education.csv` says `2025 - 2027`, `experiences.csv` says
`July 2024 - September 2025`. Padding a month-precision value to `2024-07-01` and then rendering
"1 July 2024" asserts a day nobody recorded. Carrying the precision lets the interface say "2025" or
"Jul 2024", which is what the owner wrote. ISO form sorts lexicographically, parses with `Date`
without a locale, and is unambiguous — which matters because `new Date('2024-07')` is
implementation-defined.

An absent `endDate` is how an ongoing role is stated. It is not a marker string, and it is
distinguishable from an omitted record because the field is required on records that declare a span.

All 20 `experiences.csv` durations and all 3 `education.csv` periods are month or year precision, so
every converted value is `YYYY` or `YYYY-MM`; no record needs `YYYY-MM-DD`.

**Alternatives.** Pad to full precision — rejected: invents data. Keep free-text spans — rejected:
that is the status quo that already produced a build warning on a real record. A single `year` field
— rejected: month precision is already present and would be lost.

### D5a. `degree` is optional, because one record states a strand rather than a degree

`education.csv` splits into `degree` and `field`. Two records state a credential level — `Bachelor
of Science` and `Diploma` — and the third, `Science, Technology, Engineering, and Mathematics (STEM)
Strand`, states a strand, which is not a degree level. A required `degree` would force the migration
to invent one for that record. So `degree` is optional and absent there, while the record's existing
`title` still names it. `focus` becomes `field` rather than being duplicated by a new list — it is
already the discipline list, and adding `field` alongside `focus` would give the record two
discipline fields.

### D6. `Profile` is a typed module; `SocialLink` is a delimited file

**Why.** The existing rule decides this by shape, so it is not a new decision. A profile is one
editorial record whose structure should be compiler-checked; today it is six loose exported
constants, and a misspelling is a runtime `undefined`. Social links are a small repeating collection
that three surfaces render, so they belong in a file the owner edits without touching code — and out
of `lib/navigation.ts`, which is a layout concern and should not be the site's record of where the
owner is on the internet.

**Constraint this must respect.** `lib/navigation.ts` is read by the header, the footer, six
sections, and the terminal's server-side resolver — and by no client component: the only client
components in the application are the three terminal files and `nav-link.tsx`, whose props arrive
from a server component. So making `navigation.ts` read the content model is safe today, and it is
safe by a fact that is easy to lose. `lib/terminal/registry.ts` is deliberately content-free so the
overlay can import command names for tab completion without dragging content into the browser bundle;
if `navigation.ts` were to reach the content model, and `registry.ts` were ever to import
`navigation.ts` again, `node:fs` would re-enter that bundle and the terminal's "no content record in
the client bundle" requirement would fail silently. This is verified, not assumed — see the bundle
assertion in `tasks.md`.

**Two declarations exist today, and both are collapsed into one.** `SOCIAL_LINKS` in
`lib/navigation.ts` holds four entries — GitHub, LinkedIn, a `bio.link` aggregator, and a `mailto:`
address — while `SECONDARY_ACTIONS` in `content/site.ts` independently names GitHub and LinkedIn
again. The duplicate URLs are the failure this capability exists to prevent, so both surfaces read
the one record.

**`SocialLink` carries whether it leaves the site, rather than deriving it.** Three of today's four
entries are marked `external: true`; the `mailto:` one is not, and it must not be marked as leaving
the site — a mail link opens a handler, not another site. Inferring the fact from the scheme would be
a rule that has to be right about every future scheme, and would label `mailto:` as external. So the
record states it, and the mail link renders as a mail link.

### D7. `Project` becomes `CaseStudy`; the record type renames but the URL space does not

The file becomes `case-studies.csv` and the type becomes `CaseStudy`. `Qualification` becomes
`Education`. The route segment stays `/projects`.

**Why.** The type rename is worth doing because a "project" here is a case study with a narrative,
and the name is what every consumer types. The URL space is not: `/projects/etapon` has been handed
out and is in the terminal's history, and renaming an address segment for symmetry with a type name
breaks every link already given away for no user-visible gain. This is the same reasoning
`project-detail` already applies to slugs, applied one level up.

**Alternatives.** Keeping the name `Project` — rejected: it is the name the request is replacing.
Renaming the route to `/case-studies` — rejected, as above. `Education` rather than `Qualification`
— chosen: the collection is degrees, and "qualification" is what a `Certification` is.

### D8. Media is a collection keyed by the case study's slug

`case-study-media.csv` carries `slug`, `src`, `alt`, and `order`.

**Why.** A case study can have many media items, so this is a repeating collection and
`content-model` already requires those to be delimited files. It keeps one fact per cell, which is
the reason the project uses delimited files at all — a media item packed into one list cell would
need a nested structure with its own separator, which is the fragile construction the parser exists
to avoid.

`alt` is required. An image whose meaning is carried only by its pixels fails the build, which is
the same stance the accessibility requirements take elsewhere.

### D9. Three inert columns are deleted rather than carried forward

`techStack`, `color`, and `badgeColor` are removed from the files and the model.

**Why.** `techStack` becomes `Technology` references (D4), so keeping it would give every case study
two technology fields, one of which nothing reads. `color` and `badgeColor` are already documented
as inert, and the tokens capability means they can never become live — carrying three fields that
always have a value and never have a meaning makes a sparse record look complete. `Technology`
references and the declared categories carry what the colours were gesturing at.

**Trade-off.** The owner's existing colour values leave the model. Recoverable from the pre-change
copy kept in the migration plan.

**Trade-off, corrected.** An earlier draft of this decision claimed the derived distinct-technology
figure would be unchanged because the technology records were seeded from the same strings. That is
no longer true: D4 adds experience `tools` as references, so the figure becomes 19. It is reported
with an explanation, not asserted to be stable.

### D10. Two new field kinds, both in-repo

`date` (the three precisions in D5) and `slugRef` — a non-empty slug that must resolve to a record
in a named collection. Media needs only the existing kinds: a source is a `url`, and its ordering is
the existing `orderIndex`.

Reference checking is a distinct pass after `validateAll` and before the builders, throwing with the
file, line, and field. A reference that names nothing fails the build rather than rendering as an
absent section, because a silently dropped relationship reads as "there is none".

The `year` kind retires into `date`; a certification's `year` becomes `acquiredOn`.

### D11. This change introduces required/optional; there is no such dimension today

`FieldKind` has no required flag, so **every declared field is currently required** — `checkField`
returns "is required and is empty" for an empty `text`, `list`, `oneOf`, `url`, `year`, or `slug`.
The one exception is `orderIndex`, whose empty value is a declared state rather than a mistake.

Optionality is therefore not a behaviour to change but a dimension to add, and the main
`content-model` spec already mandates it: "Every content file SHALL declare, per collection, which
fields are required, which are optional". This change is the first to need it.

**Why it must be strict once present.** An optional field that is unchecked when present is a field
whose failures are discovered by reading the page. Optionality should describe whether a value is
*required*, not whether it is *checked*. So `checkField` skips an empty value only when the field is
declared optional, and applies the kind's full check to a value that is present — including the
malformed, reversed, and unresolvable cases.

### D12. This change builds `/projects/[slug]`, because publication has nothing to decide without it

**The route does not exist.** `app/` contains only the landing page, the root layout, the
design-tokens reference, and the terminal's API route. There is no `app/projects/[slug]/page.tsx`,
and `lib/terminal/commands.ts:34` says so in as many words: the hardcoded published list is "Empty
until `/projects/[slug]` ships". The `project-detail` capability's 9 requirements are fully specified
in the main specs and have no code behind them.

**Why it lands here.** A publication status with no route to publish to is a claim nothing can check.
Seeding all 7 records `published` while the route is absent would make the terminal's `open`
navigate to a 404, which the terminal requirement forbids — it says navigation lands on the case-study
page. And leaving them `draft` drops the landing page's "Projects: 7" to 0 while this change's
`project-detail` and `terminal` deltas have no subject at all. Building the route is what makes the
publication decision mean anything.

**Both the enumeration and the per-request check are required.** `generateStaticParams` is populated
from the derived published set, so the route table and the published set cannot disagree. That alone
is not sufficient: with `dynamicParams` left at its default, a request for an unpublished slug would
still render on demand. The route therefore checks status per request and returns the not-found
response, so an unpublished slug is unreachable whether it was enumerated or not.

**Requirements the route inherits rather than changes.** These are already in the main
`project-detail` spec and this change does not modify them: the page is a server component that
introduces no client leaf beyond the shell's existing navigation leaf; it inherits the root layout
and does not reimplement the skip link, header, main region, or footer; it composes chrome from
existing primitives and introduces no token; it holds no per-case-study navigation entry; and it
states no authored figure.

**Alternatives.** Seed all 7 `draft` and build the route in a follow-up — rejected: the displayed
count drops to 0 and the two spec deltas lose their subject. Publish without building the route —
rejected: the terminal navigates into a 404. Keep the hardcoded terminal list — rejected: that drift
is what this change exists to remove.

## Risks / Trade-offs

**[A 20-column CSV is hard to hand-edit]** → The validator reports file, line, and field, so a
mistake is a one-line fix rather than a hunt. Mitigation: the migration widens the header and adds
columns one at a time, validating between steps, so no commit ever has an unparseable file.

**[Ordering trap in the migration]** → A case study cannot reference a technology that does not exist
yet, and the build now fails on exactly that. Mitigation: the migration order is technologies, then
media, then case studies, then the other collections — stated as ordered steps in `tasks.md`.

**[Losing free-text spans]** → `duration` and `period` are replaced by dates; the exact string a
record used to render disappears. Mitigation: the derived display string is compared against the
current rendered output for every record before the columns are dropped. Recorded precision means the
derived string matches what the owner wrote, not a padded version of it.

**[Deleting colour columns]** → The values are lost from the model. Mitigation: a copy of all four
files is kept before the change starts (see Migration Plan), because **git cannot supply one — the
content files are currently untracked**, so `git checkout` would not restore them.

**[No automated coverage for the new field kinds]** → `lib/content/csv.test.ts` exists but the project
has no script or runner for it, so the new `date` and `slugRef` kinds ship untested. Mitigation: the
kinds stay pure functions with no I/O, which is what makes adding a runner cheap later; verification
for this change is `npm run build` and `npm run lint`, plus a build-failure walk that asserts each
new kind actually fails the build on a deliberately bad value.

**[The model rename touches every consumer]** → `Project` and `Qualification` are referenced from the
model, the derivation, the registry, the route, and the terminal. Mitigation: the rename is one
isolated task that must land before the tasks that repoint consumers, so the compiler enumerates
every call site rather than a search missing one.

**[The unique-technology figure moves from 16 to 19]** → A displayed number changes without anyone
authoring it, which is the exact failure the derived-statistics requirement exists to prevent. The
change is nonetheless correct: `Google Cloud`, `Microsoft Azure`, and `Flutter` are technologies the
portfolio records and the figure never counted. Mitigation: the migration records the before figure,
the after figure, and the per-record reason for each difference, and the terminal `techs` output is
compared against the new record list so the change is inspectable rather than merely stated.

**[Publishing all 7 creates 7 pages that do not exist today]** → Every `/projects/<slug>` address
starts resolving. Mitigation: this is an owner decision, stated in D2 with its alternative; the
chosen value is a single-column data edit, so reverting to `draft` withdraws all 7 addresses without
a code change. It also depends on D12 — without the route, publishing would navigate into a 404.

**[The route is new code with no test runner and no existing implementation to copy]** → The
`project-detail` capability is 9 requirements with nothing behind them, so there is no prior art in the
repository for this route. Mitigation: it is a single server-rendered page with no client state, no
data fetching, and no interactive behaviour; its obligations are enumerated in D12 and checked against
the main spec rather than against precedent.

## Migration Plan

Content files and server code only; no dependency and no token changes, so a rollback is reverting
the change, restoring four CSV files, and deleting one route directory.

Before starting, copy `content/*.csv` to `content.pre-portfolio-content-model/` at the repository
root. This is not ceremony: **the content files are untracked**, so version control cannot restore
them, and they are the site's only copy of the owner's data.

1. Copy the four files as above.
2. Add the `date` and `slugRef` field kinds, the required/optional dimension, and the
   reference-resolution pass; retire `year`. No file changes yet — build and lint still pass.
3. Create `technologies.csv` with 16 records, one per distinct `techStack` value, each with a
   category that can hold a practice and a field. Nothing references it yet, so the build still
   passes.
4. Create `social-links.csv` from `SOCIAL_LINKS`, including whether each leaves the site, and point
   `lib/navigation.ts`, the footer, and `content/site.ts`'s `SECONDARY_ACTIONS` at it.
5. Create `case-study-media.csv` with its header and no rows.
6. Widen `projects.csv` to `case-studies.csv` with the new columns; populate `year`, `role`,
   `status: published` for all 7, and technology keys; leave every narrative section empty.
7. Convert `experiences.csv`, `certifications.csv`, and `education.csv` to date columns; add `tools`
   from the four technological `skills` values; add relationship columns where the owner has recorded
   them. `skills` itself is left as written.
8. Rename the record types and update every builder and consumer the compiler names.
9. Derive the published set; rewire the statistics and the terminal's `open`; delete
   `PUBLISHED_CASE_STUDIES`.
10. Create `app/projects/[slug]/page.tsx`: a server component returning the not-found response for
    an unrecognised or unpublished slug, presenting the declared fields, sections, media, related
    records, and external destinations, and enumerating the published slugs.
11. Delete the inert columns, then run `npm run lint`, `npm run build`, and the build-failure walk.

Rollback: restore the four files from `content.pre-portfolio-content-model/`, delete
`app/projects/`, and revert the code change. Nothing else in the repository is touched.
