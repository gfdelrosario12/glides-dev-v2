# Tasks

## 1. Safety copy and the new field kinds

- [x] 1.1 Copy `content/*.csv` to `content.pre-portfolio-content-model/` at the repository root, because the content files are untracked and version control cannot restore them
- [x] 1.2 Add a `date` field kind to `lib/content/schema.ts` accepting `YYYY`, `YYYY-MM`, and `YYYY-MM-DD`, normalising each to the first instant it denotes and returning the declared precision
- [x] 1.3 Add a `slugRef` field kind naming the collection it must resolve into
- [x] 1.4 Add the reference-resolution pass to `lib/content/validate.ts`, running after `validateAll` and before any record is built, and throwing with the file, line, and field when a reference names nothing
- [x] 1.5 Add the required/optional dimension to `FieldKind`, which does not exist today, and make `checkField` skip an empty value only for a field declared optional while applying the kind's full check to a value that is present
- [x] 1.6 Confirm `npm run lint`, `npx tsc --noEmit`, and `npm run build` are all green with no content file changed

## 2. The new collections

- [x] 2.1 Create `content/technologies.csv` with columns `key`, `name`, `category`, `aliases` and exactly 16 records, one per distinct value currently in `projects.csv` `techStack`, seeded as written rather than renamed
- [x] 2.2 Add the technology category value set, seeded from those same 16 values and wide enough to hold a practice and a field, so `Version Control Systems` is categorised as a practice and `IoT` as a field, and a new category is a one-word edit
- [x] 2.3 Create `content/social-links.csv` with columns `platform`, `label`, `href`, `external`, populated from all four entries in `SOCIAL_LINKS` in `lib/navigation.ts` with their existing external flags, so the `mailto:` entry is recorded as not leaving the site, and declare its schema
- [x] 2.4 Create `content/case-study-media.csv` with columns `slug`, `src`, `alt`, `order` and no rows, and declare its schema with `alt` required
- [x] 2.5 Register the three new schemas in `COLLECTION_SCHEMAS` and confirm the build still succeeds

## 3. The case-study collection

- [x] 3.1 Rename `content/projects.csv` to `content/case-studies.csv`
- [x] 3.2 Widen its header to `slug`, `title`, `description`, `category`, `year`, `role`, `status`, `technologies`, `liveUrl`, `githubUrl`, `featured`, `overview`, `problem`, `architecture`, `implementation`, `infrastructure`, `security`, `challenges`, `results`, `lessonsLearned`
- [x] 3.3 Declare `status` as required and constrained to `published` and `draft`, with no default, so an omitted status fails the build
- [x] 3.4 Declare `technologies` as a list of `slugRef` values resolving into the technology collection
- [x] 3.5 Declare the nine narrative sections as optional `text` fields
- [x] 3.6 Populate `year`, `role`, and `status` for all 7 records, with `status` as `published` on every one, and convert each `techStack` value into its technology key, leaving every narrative section empty
- [x] 3.7 Update `PROJECT_SCHEMA` to match, and confirm the build succeeds

## 4. Certifications, experience, and education

- [x] 4.1 In `content/certifications.csv`, replace `organization` with `issuer`, `year` with `acquiredOn`, and `url` with `verificationUrl`; add optional `expiration` and `credentialId` and a `caseStudies` list of `slugRef`
- [x] 4.2 Populate `issuer`, `acquiredOn`, and `verificationUrl` for all 6 records from the values already present; leave `expiration` empty for all 6; populate `credentialId` only for the two Credly records, taking the badge identifier already present in their URL, and leave it empty for the other four
- [x] 4.3 In `content/experiences.csv`, add `role` alongside `title`, replace `duration` with `startDate` and `endDate`, add a `category` value set, add `tools` and `systems` lists of `slugRef`, a `responsibilities` list, and a `caseStudies` list of `slugRef`
- [x] 4.4 Convert all 20 duration values to dates, and correct the record at line 12 whose span ends before it begins rather than working around it
- [x] 4.5 Populate `tools` from the four genuinely technological `skills` values — `AWS`, `Google Cloud`, `Microsoft Azure`, `Flutter` — and leave `skills` exactly as written, since its other values are capabilities the focus-area requirements match signals against
- [x] 4.6 Split each existing `description` into `responsibilities` entries only where it already enumerates them, leaving the prose as written and inventing nothing
- [x] 4.7 In `content/education.csv`, replace `period` with `startDate` and `endDate`, add optional `degree`, and rename `focus` to `field`; convert all 3 records and leave `degree` empty on the record that states a strand rather than a degree
- [x] 4.8 Update the three schemas and confirm the build succeeds

## 5. The model

- [x] 5.1 Rename the `Project` type to `CaseStudy` and `Qualification` to `Education`, and let the compiler enumerate every consumer
- [x] 5.2 Add the `Technology`, `SocialLink`, `CaseStudyMedia`, and `Profile` record types
- [x] 5.3 Replace `content/site.ts`'s loose identity constants with one frozen `Profile` record, and update every consumer the compiler names
- [x] 5.4 Build each `CaseStudy` with its narrative sections modelled as absent rather than empty, its technologies resolved to `Technology` records, and its related certifications and experience resolved to records
- [x] 5.5 Build `Certification` with `issuer`, `acquiredOn`, optional `expiration` and `credentialId`, and resolved related case studies
- [x] 5.6 Build `Experience` with `role`, structured dates, `responsibilities`, `tools`, `systems`, and resolved related case studies
- [x] 5.7 Build `Education` with `degree`, `field`, and structured dates
- [x] 5.8 Expose `relatedTo(slug)` as the derived reverse of every declared relationship, so a relationship is written once
- [x] 5.9 Confirm `npm run lint`, `npx tsc --noEmit`, and `npm run build` are green

## 6. The derivation

- [x] 6.1 Derive the published case studies as a single value in `lib/content/derive.ts`, filtered by `status`
- [x] 6.2 Derive `caseStudyCount` from published case studies, and state the published count wherever the total was stated before
- [x] 6.3 Derive `uniqueTechnologyCount` from the technology records in use, reached through the case-study and experience references, rather than from distinct strings
- [x] 6.4 Derive the canonical technology from its declared aliases, and report a mention matching no record rather than creating one
- [x] 6.5 Replace the distinct-string and duration-pattern derivations with the resolved technology records and the declared dates
- [x] 6.6 Correct `experiences.csv` line 12 in the data rather than suppressing the warning, and confirm the build no longer reports it

## 7. The case-study route

- [x] 7.1 Create `app/projects/[slug]/page.tsx` as a server component that returns the not-found response for a slug no case study declares and for a slug an unpublished case study declares, without redirecting to the index
- [x] 7.2 Populate `generateStaticParams` from the derived published case studies, and keep the per-request publication check, so an unpublished slug is unreachable whether or not it was enumerated
- [x] 7.3 Present the case study's declared fields — title, description, category, year, role, technologies, and external destinations — composing chrome from existing primitives and introducing no design token
- [x] 7.4 Present the nine narrative sections in the order the model declares, omitting absent sections and emitting no narrative region when none is declared
- [x] 7.5 Render media from the model's declaration, with its alternative description available to assistive technology
- [x] 7.6 Render related certifications and experience records resolved from the model, each linking to wherever that record is presented elsewhere, and emit no related-records region when there are none
- [x] 7.7 Render only external destinations the case study declares, marking each as leaving the site, and omit a destination with no address
- [x] 7.8 Confirm the route inherits the root layout without reimplementing the skip link, header, main region, or footer, and that it introduces no client component beyond the shell's existing navigation leaf
- [x] 7.9 Confirm no case-study record or slug reaches the client bundle from this route

## 8. Navigation, social links, and the landing page

- [x] 8.1 Point `lib/navigation.ts`, the footer, and `SECONDARY_ACTIONS` in `content/site.ts` at the social-link records, and delete `SOCIAL_LINKS` from `navigation.ts`, so GitHub and LinkedIn are declared once
- [x] 8.2 Render a mail-address social destination as a mail link rather than as a destination that leaves the site
- [x] 8.3 Confirm the shared navigation still holds no per-case-study entry and that the landing page still presents its featured selection and the total rather than listing every case study as a link
- [x] 8.4 Update every section and the landing page that read a renamed record or a reworked statistic
- [x] 8.5 Confirm `npm run lint`, `npx tsc --noEmit`, and `npm run build` are green

## 9. The terminal

- [x] 9.1 Delete `PUBLISHED_CASE_STUDIES` from `lib/terminal/commands.ts` and resolve the navigable set from the derived published case studies
- [x] 9.2 Keep the distinct-argument refusal, so an unknown slug still lists the slugs that exist
- [x] 9.3 Confirm `open` for a published slug closes the terminal and navigates to a page that renders, and for an unpublished or unknown slug reports and does not
- [x] 9.4 Confirm `lib/terminal/registry.ts` still imports no content and no client API, and that the overlay still imports command names from the registry alone

## 10. Removing what is now dead

- [x] 10.1 Delete the `techStack`, `color`, and `badgeColor` columns from the content files and the schemas, and delete the badge colour value sets from `schema.ts`
- [x] 10.2 Record the unique-technology figure before and after, and explain every difference; expect 16 to become 19 because `Google Cloud`, `Microsoft Azure`, and `Flutter` become references, and compare the terminal's `techs` output against the technology records so the change is inspectable
- [x] 10.3 Confirm the derived duration text matches what each record rendered before the columns were dropped

## 11. Verification

- [x] 11.1 Run `npm run lint` with no errors and no warnings, `npx tsc --noEmit`, and `npm run build`, and confirm the route table gains exactly one entry — `/projects/[slug]` — with no existing route changed
- [x] 11.2 Walk the build-failure path for every new field kind and for required/optional: a malformed date, a reversed date span, a dangling `slugRef`, an out-of-set `status`, a case study with no `status`, a media item with no `alt`, a technology mention with no record, and an optional field present with a malformed value — each must fail the build naming the file, record, and field
- [x] 11.3 Confirm an absent optional field validates when empty and fails when present with a bad value
- [x] 11.4 Inspect the built client chunks and confirm no case study, certification, experience, technology, profile, education, or social-link record and no slug is present, and that the terminal's chunk still holds only declared command names and interaction code
- [x] 11.5 Confirm all 7 `/projects/<slug>` addresses resolve and render a case study, and that a slug marked `draft` returns the not-found response rather than a page
- [x] 11.6 Confirm the case-study page holds exactly one banner, one main region, and one contentinfo, with the skip link the first focusable element
- [x] 11.7 Confirm every statistic on every rendered surface equals the value the model derives, by changing one record and rebuilding
