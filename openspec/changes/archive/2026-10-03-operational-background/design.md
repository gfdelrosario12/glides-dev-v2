## Context

See `proposal.md` — Why for motivation. The state that shapes the approach:

- `content/experiences.csv` holds **20 records** (`wc -l` reports 21 because a description
  contains an embedded newline). Field population: `description`, `skills`, `location`,
  `title`, `organization`, `badgeLabel`, `startDate` are 20/20; `endDate` 15/20 (the other 5
  are open spans, which is how absence is declared); `tools` 4/20; `responsibilities` **1/20**;
  `systems` **0/20**; `caseStudies` **0/20**.
- `type` today is `professional` 2, `organizational` 14, `competitive` 4.
- `badgeLabel` is `Internship` 2, `Leadership` 9, `Member` 4, `Membership` 2,
  `Volunteering` 3.
- `EXPERIENCE_TYPES` (`lib/content/schema.ts:117`) is the vocabulary being replaced.
  `EXPERIENCE_SCHEMA` (`lib/content/schema.ts:601`) keys on `title`, so `identifier` and
  `key` are both `title`.
- `QUALIFICATION_SCHEMA` (`lib/content/schema.ts:594`) also keys on `title` and holds 3
  records: a degree in progress (2025–2027, `endDate` absent as declared open), a diploma
  (2022–2025), and a STEM strand (2020–2022) with `degree` absent.
- Experiences currently render in exactly two places: the related-records block on
  `app/projects/[slug]/page.tsx`, and `components/terminal/terminal-context.tsx`. There is
  no route for them. Education renders as a three-column card grid on the landing page via
  `components/sections/education-summary.tsx`.
- Settled decisions elsewhere, followed rather than re-litigated:
  - `openspec/specs/ui-primitives/spec.md` forbids domain vocabulary in a primitive, so
    `components/ui/` gains nothing.
  - `app-shell` requires navigation to come from one declared source;
    `project-detail` sets the precedent that a collection gets one navigation entry and its
    members get none.
  - `app/projects/[slug]/page.tsx` resolves its data once outside the JSX.
  - `content-model` already requires a record's address to be declared rather than derived
    (added by `credentials-vault`), so the slug work here reuses that requirement rather than
    restating it. Only the education collection's adoption of it is new.
- No dependency may be added. Runtime packages stay `next`, `react`, `react-dom`.

## Goals / Non-Goals

**Goals:**

- One server-rendered route carrying both timelines, with no client component in the path.
- A total order on both timelines that does not depend on content-file row order.
- Every optional field omitted when absent. With `responsibilities` at 1/20, `tools` at 4/20,
  and `systems` and `caseStudies` at 0/20, omission is the common case, not the exception —
  a page of placeholders would be the normal appearance of a complete record.
- Zero new design tokens and zero new primitives.

**Non-Goals:**

- Authoring `lessonsLearned`, `systems`, or `caseStudies`. See `proposal.md` — Non-goals.
- Classifying the 14 `organizational` rows. Six rows are authored in this change; the other
  fourteen ship unclassified and render in the unclassified group.
- Per-entry routes. Every entry is an anchor.
- A computed tenure or total-years figure.
- Reworking the terminal's experience listing, which reads the same records and keeps
  working because `track` is added rather than substituted.

## Decisions

### D1 — `type` becomes `track` with the five declared values

`EXPERIENCE_TYPES` is removed and `EXPERIENCE_TRACKS` is declared:
`['professional', 'technical', 'leadership', 'community', 'event-operations']`. The column
is renamed `track` as well as re-valued, so the CSV states what the field now means rather
than carrying a name that no longer describes its contents.

`track` is **optional**. Six rows are authored in this change — the two internships as
`professional`, the four hackathon entries as `technical` — and the remaining fourteen ship
empty. An optional field is what makes that possible; a required one would force a guess.

*Alternative rejected:* keeping `type` and adding `track`. Two columns would describe the
same 20 rows, and a reader would see `organizational` and `community` side by side on one
entry with no way to tell which governs.

*Alternative rejected:* replacing `badgeLabel` too. `badgeLabel` answers a different
question — the shape of the role (internship, leadership, membership, volunteering) — and
`track` answers what kind of work it was. Collapsing them would lose the distinction
between a person who led an org and a person who belonged to one. Two axes, not one.

### D2 — Group order is declared, not sorted

`TRACK_ORDER` is a `readonly` array giving the presentation order, so the timeline reads in
a chosen sequence rather than alphabetically. Alphabetical would place `community` before
`event-operations` before `leadership` before `professional` before `technical`, which is
an accident of spelling rather than a shape anyone intended. The unclassified group renders
last, after every declared kind, so an unclassified entry never appears to lead.

### D3 — Ordering by end-of-period, with open spans outranking finished ones

Both timelines sort by `endDate` descending, with a null `endDate` — an open span — sorting
as more recent than any ended span, which is the same convention `content-model` already
applies to experience and qualification ordering.

Ties break on `startDate` descending, then `slug` ascending. The `slug` tiebreak is what
makes the order total: without it, two entries ending in the same period would hold whatever
relative order the content file happened to have, and rearranging rows would silently
reorder the page.

*Alternative rejected:* ordering by `startDate`. A long role that started first and a short
one that started last would read in the wrong order for a visitor asking what this person
has been doing most recently.

### D4 — `lessonsLearned` is one new optional prose column; `description` is kept

`description` already holds the operational account in the first person — "I cross-checked
IP addresses and system data against manual records" — which is exactly the "operational
work" the brief asks for. Adding `operationalWork` beside it would have meant rewriting 20
descriptions and drawing a boundary between a summary and its detail that the owner has not
drawn. So `description` stays and is transcribed as written.

`lessonsLearned` is genuinely new and genuinely optional, and ships empty on all 20 rows.

*Alternative rejected:* deriving a lesson from the description. That would manufacture a
retrospective judgement and present it as the owner's.

### D5 — Slugs on both collections, identifiers moved

`EXPERIENCE_SCHEMA` and `QUALIFICATION_SCHEMA` both move `identifier` and `key` from `title`
to a new `slug`, matching `PROJECT_SCHEMA` and `CERTIFICATION_SCHEMA`. The education slug is
not strictly required by this change's surface — education entries are anchors, not routes —
but leaving one collection keyed on its title would mean the two timelines differ on a point
that `content-model` now requires to be uniform.

20 experience slugs and 3 qualification slugs are authored here. They are derived from the
organization and role, not the free-text title, because several titles contain a semester
marker or a year that a correction would change.

*Alternative rejected:* using `title` as the anchor id for education and leaving it keyed as
it is. Two addressing schemes in two timelines that sit on one page.

### D6 — "Technical Infrastructure Editorial" again means the existing role system

The visual language is the one already tabulated in the archived `credentials-vault` design:
monospace uppercase micro-labels, a title/body hierarchy, hairline-bordered surfaces, and
no decorative colour. **No token is added and none changes value.**

| Role | Token | Hex | OKLCH | Used for |
| --- | --- | --- | --- | --- |
| Page base | `--color-surface` | `#0b0c0e` | `oklch(0.154 0.005 264)` | Inherited |
| Card face | `--color-surface-raised` | `#131519` | `oklch(0.195 0.009 264)` | Timeline entry face |
| Inset face | `--color-surface-inset` | `#1a1d22` | `oklch(0.230 0.011 261)` | Track group label rail |
| Hairline | `--color-border` | `#262a31` | `oklch(0.284 0.014 262)` | Entry and rail borders |
| Interactive rule | `--color-border-strong` | `#66696e` | `oklch(0.520 0.009 261)` | Focus rings, link underlines |
| Primary text | `--color-text` | `#e8eaed` | `oklch(0.936 0.005 258)` | Entry title, anchor target |
| Secondary text | `--color-text-secondary` | `#a8aeb8` | `oklch(0.749 0.016 261)` | Work description |
| Muted text | `--color-text-muted` | `#868e9a` | `oklch(0.644 0.020 258)` | Period, organization, role shape |

Type roles, all pre-existing: `text-title` (`1.75rem` / `1.2` / `-0.01em`), `text-body`
(`1rem` / `1.65`), `text-small` (`0.875rem` / `1.5`), `text-label` (`0.75rem` / `1.4` /
`0.06em`).

A timeline rail is a layout device, not a data mark, so it uses `--color-border` and carries
its group name as text. It is not a `StatusIndicator` and has no tone: a track is not a state.

### D7 — Components live in `components/background/`

New files: `components/background/timeline.tsx`, `components/background/experience-entry.tsx`,
`components/background/education-entry.tsx`. Each takes already-resolved display values as
props and imports nothing from `lib/content/`. `Card`, `CardHeader`, `CardTitle`,
`CardDescription`, `CardContent`, `Button`, `MetadataList`, `Metadata`, and `TokenChipList`
are reused from `components/ui/` and `components/sections/chip.tsx`.

This also satisfies the existing home-page scenario "Education renders without a bespoke
layout" for the timeline: the entries compose the same primitives the landing page's cards
do, rather than a parallel set of education-only components.

### D8 — The landing page points rather than restates

`components/sections/education-summary.tsx` keeps its heading, its count, and its three
compact cards, and gains one `Button` to `/background`. The `detail` paragraph moves out of
it. Presenting the same three records twice in two different arrangements is the duplication
the `home-page` delta forbids, and the landing page has no room for a second timeline.

*Alternative rejected:* removing the landing page's education section entirely. It is the
only education a visitor sees without clicking, and the section is a navigation anchor in
`NAVIGABLE_SECTIONS`.

### D9 — No duration figures, and no client-side grouping

No tenure is computed per entry. A duration across overlapping roles sums overlapping
intervals, and the arithmetic would be defensible while the resulting figure would invite the
wrong reading. Periods are shown as declared ranges.

Grouping is done server-side by the declared order in D2. A client-side filter would need a
`use client` boundary and a serialised copy of all 20 records in a bundle, for a page a
visitor can read by scrolling.

## Risks / Trade-offs

- **[Sixteen of 20 rows ship with no track, so the timeline's grouping is nearly empty]** →
  Accepted, and stated in `proposal.md` — Non-goals. The unclassified group renders last and
  says what it is. The alternative is guessing at how the owner would classify fourteen roles
  spanning community leadership, event operations, and technical direction.
- **[Removing `organizational` and `competitive` discards two words the owner chose]** →
  Accepted. Both are folded into the five: `competitive` into `technical`, and
  `organizational` into whichever of leadership, community, or event-operations each row
  turns out to be. The old values cannot be declared alongside the new because the field they
  belonged to is gone, which is what makes the build fail loudly on a row nobody migrated.
- **[The timeline may read as sparse for months, because `responsibilities` is 1/20]** →
  Accepted. Entries carry `description` and `skills` regardless, both 20/20, so no entry is
  ever a bare date range. The sparseness is in the optional detail, which is exactly where it
  belongs.
- **[Slugs authored from organization and role can collide]** → Two rows at the same
  organization with the same role would produce one slug. The build's uniqueness rule catches
  it, and the slug list is authored once here and reviewable in the content diff.
- **[Education gains a slug it does not strictly need today]** → Accepted as D5 argues: one
  addressing scheme across two timelines on one page is worth more than avoiding a column that
  the addressing requirement would eventually demand anyway.
- **[Dropping `type` from the terminal's output]** → `track` is added alongside the record's
  other fields, so the terminal's experience listing keeps working. What the terminal prints
  about an entry is a display question, not a schema one, and is left alone.
- **[Two timelines on one route means one very long page]** → Accepted. It is a single
  document with two headings, fully server-rendered, and it matches the reading the brief
  asked for: one history rather than two destinations.

## Migration Plan

Single content migration, no deploy step and no code flag.

1. Rewrite all 20 experience rows: replace `type` with `track`, add `slug` and
   `lessonsLearned`, leave every other value byte-identical. Author `track` for the 2
   internships and 4 hackathon rows; leave the other 14 empty.
2. Rewrite all 3 education rows to add `slug`, leaving every other value byte-identical.
3. Replace `EXPERIENCE_TYPES` with `EXPERIENCE_TRACKS` and `TRACK_ORDER`; move both schemas'
   `identifier`/`key` to `slug`; add `track` and `lessonsLearned` field declarations.
4. Add the ordered accessors and the slug lookup to `lib/content/model.ts`.
5. Build `components/background/` and `app/background/page.tsx`; add the navigation entry.
6. Reduce `components/sections/education-summary.tsx` to a pointer.

Rollback is reverting steps 3–6 and restoring the `type` column, which is the only value
removed. No value is transformed, so both old files are recoverable by renaming one column
back.

## Open Questions

- Whether the fourteen unclassified experiences should be grouped, and into which tracks.
  Deferrable: `track` is optional, the unclassified group is specified, and the answer
  changes no requirement, no approach decision, and no task.
- Whether the terminal should eventually filter by `track` rather than list every entry. A
  display and interaction question touching no requirement in this change's deltas.