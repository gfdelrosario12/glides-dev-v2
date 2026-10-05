## Context

See `proposal.md` — Why for motivation. The state that shapes the approach:

- `content/certifications.csv` holds **6 records**, not 7. Column order today is
  `title,issuer,acquiredOn,expiration,description,verificationUrl,credentialId,caseStudies`.
- The verification destinations split **2 direct / 4 profile**. Both direct ones are
  Credly badge URLs and both carry a matching `credentialId`; the 4 profile ones all point
  at one shared LinkedIn certifications list. `expiration` is empty on all 6. `caseStudies`
  is empty on all 6. `skills` does not exist as a column.
- `CERTIFICATION_SCHEMA` (`lib/content/schema.ts:618`) keys on `title`, so
  `identifier` and `key` are both `title`.
- Certifications currently render in three places with no page of their own:
  `app/projects/[slug]/page.tsx` (related-records block), `components/terminal/terminal-context.tsx`,
  and `components/sections/statistics.tsx`.
- Relevant settled decisions elsewhere in the repo, followed here rather than re-litigated:
  - `openspec/specs/ui-primitives/spec.md` forbids domain vocabulary in a primitive, so
    `components/ui/` gains nothing from this change.
  - `StatusIndicator` (`components/ui/status-indicator.tsx`) already carries `success`
    ("Verified, passing, or completed") and `warning` ("Degraded, expiring, or needing
    attention"), requires a caller-supplied label, and hides its dot from assistive
    technology.
  - `openspec/specs/project-detail/spec.md` sets the precedent that a collection gets one
    navigation entry and its members get none.
  - `app/projects/[slug]/page.tsx` resolves `sectionsOf` once outside the JSX rather than
    in a render expression.
- No dependency may be added. Runtime packages stay `next`, `react`, `react-dom`.

## Goals / Non-Goals

**Goals:**

- Two routes, both server-rendered, with no client component anywhere in the path.
- One declared vocabulary for skills, validated by the same `checkField` path as every
  other field, and referenced rather than restated if a second field ever needs it.
- Verification state derived from recorded dates and the declared destination kind, so it
  cannot be authored into being wrong.
- Zero new design tokens and zero new primitives.

**Non-Goals:**

- Authoring `skills` or `caseStudies` values. Both columns ship empty; see `proposal.md`
  — Non-goals for why that is a decision rather than an omission.
- Any client-side filtering or search on the listing.
- Changing what the three existing certification call sites render. They keep reading the
  same resolved record; this change adds a surface, it does not migrate the old ones.

## Decisions

### D1 — `slug` becomes the identifier and the key, and the CSV is rewritten

`CERTIFICATION_SCHEMA.identifier` and `.key` move from `title` to a new `slug` column,
mirroring `PROJECT_SCHEMA`. Titles become free to be corrected without moving an address,
which is the entire reason `PROJECT_SCHEMA` made the same move.

*Alternative rejected:* keeping `title` as the address and percent-encoding it. It needs no
content edit, but `IBM Full Stack Software Developer Professional Certificate` becomes a
URL nobody types, and correcting a title silently 404s a published address.

*Consequence to own:* this is a breaking content change. All 6 rows are rewritten in one
commit and the slugs are authored once, here, from the existing titles.

### D2 — `verificationKind` is declared, required, and decides the label

Two values: `direct` identifies the credential; `profile` identifies the owner's listing.
The field is required, so every row states what its destination actually is and no row can
default into claiming verification.

The 4 profile rows keep their LinkedIn URL and gain `profile`; the 2 Credly rows keep the
badge URL and gain `direct`. No URL changes and none is invented.

*Alternative rejected:* making `verificationUrl` optional. Every row already has a URL, so
it would change nothing in practice while leaving the 4 profile URLs still reading as
verification.

*Alternative rejected:* requiring a real per-credential URL for all 6. Five rows have no
such URL available, so the build would fail until the owner obtained five badges.

### D3 — Skills are a declared vocabulary, declared empty

`CREDENTIAL_SKILLS` is a `readonly` array of slug-shaped strings next to
`CASE_STUDY_DOMAINS` in `lib/content/schema.ts`, and `skills` is a `list` field validated
against it. The vocabulary ships empty and `skills` ships empty on all 6 rows, because an
empty optional list validates and renders nothing.

This is the one place where a reviewer should push back if they disagree: the change adds a
validated column that no row populates. The reasoning is that authoring the vocabulary is
editorial, and an authored vocabulary that turns out to be wrong is harder to unwind than an
empty one — but the alternative, accepting free text, permanently loses the typo check.

*Alternative rejected:* reusing the `technologies` collection by reference. Tightest model,
but it forces credentials onto that vocabulary and cannot express a covered subject with no
matching technology record.

### D4 — Verification state is derived, never authored

A pure function of the record returns one of three states:

| State | Condition | Tone | Label |
| --- | --- | --- | --- |
| Verified | `verificationKind` is `direct` | `success` | "Verified" |
| Listed | `verificationKind` is `profile` | `neutral` | "Listed on profile" |
| Needs attention | `expiration` has passed | `warning` | "Expired" or "Expires {date}" |

Expiry is evaluated against the build date using the existing `isBefore` helper in
`lib/content/date.ts`. `Listed` uses `neutral` rather than `info` deliberately: it is not a
claim, it is the absence of one, and `neutral` is documented in
`openspec/specs/ui-primitives/spec.md` as "Inactive, unknown, or not applicable".

Today all 6 rows land on `Listed` or `Verified` because `expiration` is empty everywhere.
The `warning` path is specified and implemented but unexercised by current content, and
that gap is stated rather than papered over with an invented expiry.

### D5 — The relationship is declared on one side, and that side ships empty

`PROJECT_SCHEMA` declares no certifications reference. The credential-to-case-study
relationship therefore has exactly one declared side: the `caseStudies` column on
`CERTIFICATION_SCHEMA`. That column is empty on all 6 rows, so the related-case-studies
region renders nothing for every current credential — which is the correct outcome, and
the reason it is listed in `proposal.md` — Non-goals rather than treated as a gap.

The read side needs no work. `lib/content/model.ts:645` already resolves a certification's
`caseStudies` keys into the records themselves, and the case study's `certifications` view
is already derived from that by filtering at line 658. Neither side restates the other, so
the "declared once" requirement in `content-model` holds as written.

*Earlier draft of this decision claimed every case study names the credentials that relate
to it, and prescribed unioning both sides. That was wrong: no such field exists, so there
was nothing to union with. The scenario it added to `content-model` was removed rather than
reworded, and task 2.2 with it.*

*Alternative rejected:* adding a `certifications` column to `PROJECT_SCHEMA` so both sides
exist. That creates two places the same relationship can be declared, which is precisely
what the requirement that a reference is not duplicated text exists to prevent. The two
sides could then disagree, and the build has no rule that would catch it.

### D6 — "Technical Infrastructure Editorial" is the existing role system, not a new one

Read as: monospace uppercase micro-labels, a title/body hierarchy, hairline-bordered
surfaces, generous vertical rhythm, and no decorative colour. Every token the vault needs
already exists in `app/globals.css`. **No token is added and no token's value changes.**

| Role | Token | Hex | OKLCH | Used for |
| --- | --- | --- | --- | --- |
| Page base | `--color-surface` | `#0b0c0e` | `oklch(0.154 0.005 264)` | Page background, inherited |
| Card face | `--color-surface-raised` | `#131519` | `oklch(0.195 0.009 264)` | Credential card |
| Inset face | `--color-surface-inset` | `#1a1d22` | `oklch(0.230 0.011 261)` | Credential identifier |
| Hairline | `--color-border` | `#262a31` | `oklch(0.284 0.014 262)` | Card and inset borders |
| Interactive rule | `--color-border-strong` | `#66696e` | `oklch(0.520 0.009 261)` | Focus rings, link underlines |
| Primary text | `--color-text` | `#e8eaed` | `oklch(0.936 0.005 258)` | Titles, identifier value |
| Secondary text | `--color-text-secondary` | `#a8aeb8` | `oklch(0.749 0.016 261)` | Descriptions |
| Muted text | `--color-text-muted` | `#868e9a` | `oklch(0.644 0.020 258)` | Labels, issuer, dates |
| Verified | `--color-success` | `#3dd68c` | `oklch(0.779 0.165 157)` | `StatusIndicator` `success` shape only |
| Attention | `--color-warning` | `#d9b310` | `oklch(0.778 0.157 93)` | `StatusIndicator` `warning` shape only |

Type roles, all pre-existing: `text-title` (`1.75rem` / `1.2` / `-0.01em`), `text-body`
(`1rem` / `1.65`), `text-small` (`0.875rem` / `1.5`), `text-label` (`0.75rem` / `1.4` /
`0.06em`), `text-code` (`0.8125rem` / `1.6`) — the last used for the credential identifier
so a UUID reads as a value rather than as prose.

`success` and `warning` are used **only** as the `StatusIndicator` shape fill. They are not
applied to borders, badges, or card backgrounds, because the primitive's requirement is that
colour reinforces state rather than carrying it.

### D7 — Components live in `components/credentials/`, not in `components/ui/`

`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Button`,
`MetadataList`, `Metadata`, and `StatusIndicator` are reused from `components/ui/`. New
files are `components/credentials/card.tsx`, `verification.tsx`, and `related.tsx`.

Each takes already-resolved display values as props and imports nothing from
`lib/content/`. The route reads the record and passes plain values down. This keeps
`components/ui/` free of the word "credential", as its spec requires, and keeps the
primitive boundary intact for whatever comes next.

### D8 — Ordering and gating

The listing renders in `acquiredOn` descending, ties broken by issuer then title so the
order is total and does not depend on CSV row order.

Unlike a published case study, a credential has no completeness gate. Every field the card
shows is either required or already optional-and-omitted, so there is no state in which a
credential page can render an empty required region.

`generateStaticParams` enumerates credential slugs, and the route separately refuses a slug
no credential declares. Both are needed: `dynamicParams` defaults to true, so enumeration
alone would not stop an unrecognised slug being generated on demand.

## Risks / Trade-offs

- **[The new required columns make the content file fail validation until every row is
  rewritten]** → All 6 rows are rewritten in a single task, before the schema change is
  exercised, and the task verifies the file parses. Half-migrated content is not a state the
  change can be left in.
- **[A URL can change hands while `verificationKind` stays `direct`]** → Nothing detects
  this. A Credly badge URL replaced by a profile URL would keep claiming `direct` until the
  owner edits the row. Accepted: the model can only report what the content declares, and
  inventing a check that fetches third-party URLs would add a network dependency to the
  build for a guarantee it could not give.
- **[Adding a validated `skills` column that no row fills is dead weight on arrival]** →
  Accepted deliberately, per D3. It is declared rather than omitted so that populating it
  later needs no schema change, and the alternative permanently loses the typo check.
- **[The related region renders nothing for all 6 credentials, indefinitely]** → Accepted and
  stated in D5 and in `proposal.md` — Non-goals. Filling the column is the owner's account
  of which credential evidences which work, and inferring it would assert a relationship
  the site cannot stand behind. The read path is already implemented, so populating the
  column later needs no code change.
- **[The `warning` expiry path ships unexercised]** → Accepted and stated in D4. Exercising
  it would require inventing an expiry date on a real credential. The task list verifies the
  function directly with synthetic dates instead of relying on content.
- **[Keying on `slug` breaks any address that was ever built from a title]** → No such
  address exists yet, because no credential page has ever been served. The migration is
  therefore free.

## Migration Plan

Single content migration, no deploy step and no code flag.

1. Rewrite all 6 rows: add `slug`, `verificationKind`, and an empty `skills`; move `slug`
   into position after `title`; leave every existing value byte-identical.
2. Change `CERTIFICATION_SCHEMA` to key on `slug` and declare the three new fields.
3. Add `CREDENTIAL_SKILLS` and `CREDENTIAL_VERIFICATION_KINDS`.
4. Build the resolved record, the two routes, and the three components.
5. Add one `/credentials` entry to `PRIMARY_NAV`.

Rollback is reverting steps 2–5 and restoring the six-column file; no data is transformed,
only columns added, so the old file is recoverable by deleting the new columns. The `slug`
values are authored in step 1 and recorded in that commit's diff.

## Open Questions

- What vocabulary should `CREDENTIAL_SKILLS` eventually contain, and does any second field
  need it? Both are answerable later without changing a spec, the approach, or the task
  breakdown — the column is declared empty and validated either way.
- Should the terminal and the statistics figure eventually link into `/credentials` rather
  than rendering inline? A navigation and linkage question that touches no requirement in
  this change's deltas.