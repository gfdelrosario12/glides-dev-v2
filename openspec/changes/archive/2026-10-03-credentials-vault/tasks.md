## 1. Schema and content, together

The two halves of this group cannot land separately. The CSV reader compares each row's
field count against the header and reports a row carrying more fields than the schema
declares, so adding a column without declaring it fails the build, and declaring it without
adding it fails validation for a missing field. They are one atomic edit.

- [x] 1.1 Add `CREDENTIAL_SKILLS` (an empty `readonly` slug-shaped array) and `CREDENTIAL_VERIFICATION_KINDS` (`['direct', 'profile']`) to `lib/content/schema.ts`, beside `CASE_STUDY_DOMAINS` and `MEDIA_KINDS`
- [x] 1.2 Move `CERTIFICATION_SCHEMA.identifier` and `.key` from `title` to `slug`, and add `slug: { kind: 'slug' }`, `skills: { kind: 'oneOfList', values: CREDENTIAL_SKILLS, optional: true }` (`oneOfList`, not `list` — a plain `list` carries no `values` and would accept any text), and `verificationKind: { kind: 'oneOf', values: CREDENTIAL_VERIFICATION_KINDS }`
- [x] 1.3 Rewrite `content/certifications.csv`: add `slug` after `title`, add `skills` and `verificationKind`, leave every existing value byte-identical, and leave `skills` empty on all 6 rows
- [x] 1.4 Author the 6 slugs from the existing titles — `ibm-full-stack-developer`, `oracle-oci-generative-ai`, `google-cloud-associate-engineer`, `tesda-computer-systems-servicing-nc2`, `tesda-web-development-nc3`, `aws-cloud-practitioner` — and set `verificationKind` to `direct` for the 2 Credly rows and `profile` for the 4 LinkedIn rows
- [x] 1.5 Confirm `npm run build` passes, which proves the header, the arity, and the two new required values all agree

## 2. The resolved record

- [x] 2.1 Extend the `Certification` type in `lib/content/model.ts` with `slug`, `verificationKind`, `skills`, and keep `caseStudies` as the resolved records rather than keys
- [x] 2.2 Confirm the existing resolution needs no change: `model.ts:645` already resolves `caseStudies` keys to records and line 658 already derives the case study's reverse view. Add no union — no case-study-side field exists
- [x] 2.3 Add a pure `verificationStateOf(certification, today)` returning `verified`, `listed`, or `needs-attention`, using the existing `isBefore` helper from `lib/content/date.ts` for expiry and the declared `verificationKind` for the rest
- [x] 2.4 Return `needs-attention` for a passed expiry and for one inside the declared warning window, and return no expiry state at all when `expiration` is null — per design D4
- [x] 2.5 Add `credentials` and `credentialBySlug` to the derived model, ordered by `acquiredOn` descending with issuer then title as tie-breakers so the order is total

## 3. Components

Each takes already-resolved display values as props and imports nothing from
`lib/content/`. No file is added to `components/ui/`, because a primitive must not carry the
vocabulary of a credential.

- [x] 3.1 Create `components/credentials/card.tsx` presenting title, issuer, acquisition date, verification state, declared skills, and a link to the detail page, using `Card`, `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent` from `components/ui/card.tsx`
- [x] 3.2 Omit absent optional fields in the card entirely — no skills region and no expiry line when the record declares neither, and no placeholder standing in
- [x] 3.3 Create `components/credentials/verification.tsx` rendering `StatusIndicator` from `components/ui/status-indicator.tsx` with the caller-supplied label, and the destination as a labelled external `Button` — `Verify` for `direct`, `View on profile` for `profile`
- [x] 3.4 Style the credential identifier with `text-code` on `bg-surface-inset` and `border-border`, using only the tokens tabulated in design D6, and add no token and change no token value
- [x] 3.5 Create `components/credentials/related.tsx` listing related case studies by title, each linking to `/projects/[slug]`, rendering nothing at all when there are none
- [x] 3.6 Confirm `npm run lint` passes and that `grep -rl "use client" components/credentials` returns nothing

## 4. Routes and navigation

- [x] 4.1 Create `app/credentials/page.tsx` listing every credential as a `card`, ordered by `acquiredOn` descending, with a heading and no client component
- [x] 4.2 Have the empty listing state render a sentence saying none are recorded, with no card and no error
- [x] 4.3 Create `app/credentials/[slug]/page.tsx` presenting the recorded title, issuer, description, `acquiredOn`, `expiration` where declared, skills, verification state, and related case studies
- [x] 4.4 Add `generateStaticParams` enumerating credential slugs, and separately refuse a slug no credential declares, because `dynamicParams` defaults to true and enumeration alone would generate an unrecognised slug on demand
- [x] 4.5 Add one `{ kind: 'link', href: '/credentials', label: 'Credentials' }` entry to `PRIMARY_NAV` in `lib/navigation.ts`, and no per-credential entry
- [x] 4.6 Confirm `npm run build` passes and the route table lists `/credentials` and `/credentials/[slug]` without a route file having been added by hand

## 5. Tests

- [x] 5.1 Add a case asserting a certification with an undeclared `verificationKind` fails validation, and that the message names the permitted kinds
- [x] 5.2 Add a case asserting a `skills` value outside `CREDENTIAL_SKILLS` fails validation naming file, record, and value, and that two bad values in one cell are both named
- [x] 5.3 Add a case asserting an empty `skills` cell validates, so the column can ship empty
- [x] 5.4 Add a case asserting two credentials cannot declare the same slug
- [x] 5.5 Add cases for `verificationStateOf` covering `direct` → verified, `profile` → listed, a passed expiry → needs attention, an expiry inside the warning window → needs attention, and a null expiry → no expiry state
- [x] 5.6 Add a case asserting a credential declaring `caseStudies` resolves to the records themselves, and a credential declaring none resolves to an empty list rather than failing
- [x] 5.7 Run `node --test lib/content/*.test.ts` and confirm every case passes, including the 149 that existed before this change

## 6. Verification

- [x] 6.1 Run `npm run lint` and confirm it is clean
- [x] 6.2 Run `npx tsc --noEmit` and confirm it is clean
- [x] 6.3 Run `npm run build` and confirm it passes
- [x] 6.4 Confirm the build output prerenders one `/credentials/[slug]` page per recorded slug, which is 6
- [x] 6.5 Fetch `/credentials` and confirm all 6 credentials appear as cards in the declared order, and that navigation gained exactly one item
- [x] 6.6 Fetch one `direct` credential and one `profile` credential, and confirm the destination reads `Verify` on the first and `View on profile` on the second, with no claim of verification on the second
- [x] 6.7 Confirm the verification state survives a greyscale rendering by shape and label alone, and that the indicator's dot contributes no announcement
- [x] 6.8 Fetch an unrecognised slug and confirm the not-found response
- [x] 6.9 Confirm the three existing certification call sites still render, and that their output is unchanged
- [x] 6.10 Inspect the client bundles and confirm no credential field appears in any chunk under `.next/static/chunks`
- [x] 6.11 Run `openspec validate --specs --strict` and confirm every spec still passes
- [x] 6.12 Record in the archive notes that `skills` and `caseStudies` ship empty and the `warning` expiry path ships unexercised, so the omissions read as decisions
## Implementation notes

Recorded so the gaps read as decisions at archive time rather than as oversights.

- **`skills` ships empty on all 6 rows.** `CREDENTIAL_SKILLS` is declared as an empty
  vocabulary and validated as one, so `cloud`, `security`, and every other value currently
  fail the build. The column is declared so populating it later is a content edit with no
  schema change; choosing the vocabulary is the owner's editorial call. Asserted in
  `credentials.test.ts` so that adding the first skill is a deliberate change to a stated
  expectation rather than a silent one.
- **`caseStudies` ships empty on all 6 rows,** so the related-work region renders nothing
  for every credential. The read path is already implemented
  (`lib/content/model.ts:645` and the derived reverse at line 658); populating the column
  later needs no code change. Which credential evidences which work is the owner's account
  to make.
- **The `warning` expiry path ships unexercised.** All 6 rows leave `expiration` empty, so
  nothing in the current content produces `needs-attention`. Exercising it would mean
  inventing an expiry on a real credential. It is verified instead by the boundary cases in
  `verificationStateOf`, which test the day before and the day after a 90-day-out expiry.
- **Recorded expiry is evaluated against the build date.** `today()` reads the clock once
  at module load and the pages are prerendered, so for them that value is the build date. A
  credential that expires after a deploy will keep presenting its pre-deploy state until the
  next one. Acceptable now because no record declares an expiry; revisit when one does.
- **D5 was corrected during implementation.** The design originally claimed every case study
  names the credentials relating to it and prescribed unioning both sides. `PROJECT_SCHEMA`
  declares no such field, so there was nothing to union with. The scenario added to
  `content-model` was deleted rather than reworded, D5 rewritten, and task 2.2 turned into a
  confirmation that the existing resolution needs no change.
- **One field kind corrected during implementation.** Task 1.2 originally specified
  `skills: { kind: 'list', values: ... }`. A plain `list` carries no `values` constraint, so
  that would have been a type error and would have accepted any text. Corrected to
  `oneOfList`, which is the kind `domains` already uses.
