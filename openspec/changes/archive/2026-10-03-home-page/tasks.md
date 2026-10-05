## 1. Content files in place and corrected

- [x] 1.1 Create `content/`. Copy `projects.csv`, `experiences.csv`, and `certifications.csv` from `../data for portfolio/` into it. Leave the upstream directory untouched — it is the owner's working copy and is not read by the site after this change.
- [x] 1.2 Correct the `certifications.csv` header. It currently reads `title,organization,&#32;&#32;year,description,color,url` with two leading spaces before `year`. Remove them so the field is `year`.
- [x] 1.3 Correct the broken URL in `projects.csv`. The "Care Max" row has `githubUrl` ending in `.gitt`; it must end in `.git`.
- [x] 1.4 Correct the `Devember 2022` typo in the `experiences.csv` duration for the "Community Development Fellow Lead" record so the month parses.
- [x] 1.5 Correct the `competetive` type value in `experiences.csv` to `competitive` in all 4 affected rows.
- [x] 1.6 Add a `featured` column to `content/projects.csv` as the final column, holding an integer order index and empty for unfeatured projects. Mark at least two projects, with distinct indices, so the featured section has content and the ordering is exercised.
- [x] 1.7 Create `content/education.csv` with a header row of `title,institution,period,location,focus,detail` and three records transcribed from the v1 `components/sections/EducationSection.tsx`: the Bachelor of Science in Computer Engineering at the Polytechnic University of the Philippines College of Engineering (2025 - 2027, Sta. Mesa, Manila City); the Diploma in Computer Engineering Technology at the same institution's Institute of Technology (2022-2025, Sta. Mesa, Manila City); and the STEM Strand at Espiritu Santo Parochial School (2020-2022, Sta. Cruz, Manila). Transcribe verbatim — do not rewrite the descriptions.
- [x] 1.8 Confirm `content/projects.csv` still has 7 records, `experiences.csv` 20, `certifications.csv` 6, `education.csv` 3, and that no record was lost or shifted by the edits in 1.2 through 1.6.
- [x] 1.9 Record the experience records whose description contradicts their own title or organisation. At minimum: "Director for Cloud Computing, PUP Manila Microsoft Student Community" described as building Android applications, and "Mobile Developer, Google Developer Student Clubs PUP" described as leading business development. Report them to the owner; do NOT rewrite them.

## 2. Parser, with tests

- [x] 2.1 Create `lib/content/csv.ts` implementing the RFC 4180 subset: quoted fields, commas inside quoted fields, line breaks inside quoted fields, `""` as an escaped quote, CRLF and LF endings, and a leading byte-order mark. Export a function returning trimmed, normalised records.
- [x] 2.2 Add normalisation to the parser: trim leading and trailing whitespace from every header name and every field value, and convert typographic quotation marks to ASCII. Do not alter the interior of a value.
- [x] 2.3 Add tests covering, at minimum: a field containing a comma; a field containing a line break; an escaped `""` inside a quoted field; CRLF endings; a leading byte-order mark; a header name with leading whitespace resolving by its trimmed name; a row with more fields than the header; and a row with fewer fields than the header.
- [x] 2.4 Run the tests. Do not proceed to group 3 on a failing parser — a mis-parsed quote produces plausible-looking wrong data, which is the worst failure mode for content.
- [x] 2.5 Confirm no dependency was added: `git diff --quiet HEAD -- package.json package-lock.json` must report no change.

## 3. Schema, validation, and the typed model

- [x] 3.1 Create `lib/content/schema.ts` declaring, per collection, the required fields, the optional fields, and the constrained value sets. Constrain at minimum: project `category` to the observed categories, experience `type` to `professional`/`organizational`/`competitive`, and `featured` to an integer or empty.
- [x] 3.2 Implement validation that throws on any violation, naming the file, the record, and the field. Do not coerce an invalid value into a default, and do not silently discard a row.
- [x] 3.3 Make the build fail on a validation violation rather than warning. Confirm by temporarily introducing a bad record, observing the failure with a specific message, then reverting it.
- [x] 3.4 Create `lib/content/model.ts` exposing the validated content as typed records. Constrained fields must be typed unions, not bare strings — an unrecognised project category must be a compile-time error.
- [x] 3.5 Export the assembled model as immutable so consumers cannot mutate it.
- [x] 3.6 Confirm the model assembles cleanly against the real files in `content/`, with 7 projects, 20 experiences, 6 certifications, and 3 qualifications.

## 4. Derived statistics

- [x] 4.1 Create `lib/content/taxonomy.ts` declaring the cloud-provider taxonomy as an alias-to-canonical map. Include at minimum `aws` ← AWS / Amazon Web Services, `azure` ← Azure / Microsoft Azure, `google-cloud` ← Google Cloud / GCP, `oracle-cloud` ← Oracle Cloud / OCI.
- [x] 4.2 Create `lib/content/derive.ts` as the only module in the project permitted to produce a displayed number.
- [x] 4.3 Derive: project count; distinct technologies across project tech stacks; roles held; leadership roles; certifications earned; distinct cloud platforms via the canonical map; years of practice from the earliest recorded start to the present; and total projects available.
- [x] 4.4 Implement duration parsing that recognises the open-ended marker as extending to the present, and that excludes an uninterpretable duration from date-derived figures while reporting it with its record identifier.
- [x] 4.5 Implement focus-area signal counting: map each declared signal to a count over the content model, returning no count when the result is zero.
- [x] 4.6 Verify the derived figures equal the values measured during planning: 7 projects, 16 distinct technologies, 20 roles, 9 leadership roles, 6 certifications, and **4** distinct cloud platforms. The cloud figure is 4, not 5 — `Azure` and `Microsoft Azure` must collapse to one canonical provider.
- [x] 4.7 Confirm the derived figures are recomputed on each build with no cached value carried over.

## 5. Site identity and focus areas

- [x] 5.1 Create `content/site.ts` as a typed module holding the owner's name, professional role, short biography, and profile image reference.
- [x] 5.2 State the professional role with infrastructure, cloud, cybersecurity, networking, and IT operations as the primary technical direction, rather than presenting software development as the sole focus.
- [x] 5.3 Declare exactly five focus areas — infrastructure, cloud, cybersecurity, networking, and IT operations — each with a label, a short summary, and a list of signal tokens drawn from the content. Declare signals only; do not write a count and do not write a function.
- [x] 5.4 Choose signals that the real content actually supports, so the computed counts are meaningful. Verified candidates: infrastructure ← `Enterprise Infrastructure`, `IT Governance`; cloud ← the cloud taxonomy applied to experience skills and certification organisations; cybersecurity ← `CyberPH`; networking ← `Computer Networks` in education focus plus the TESDA Computer Systems Servicing qualification; IT operations ← `Service Management`, `Operations`, and the Sun Life internship records.
- [x] 5.5 Confirm `npx tsc --noEmit` passes, so a misspelled or missing identity field is a compile error.

## 6. Profile image

- [x] 6.1 Produce a right-sized derivative of `Main.JPG` into `public/images/profile.jpg` using the available ImageMagick, resizing to 1600px wide and re-encoding at quality 82, preserving the 3:2 aspect ratio. Do not crop at the source.
- [x] 6.2 Confirm the derivative is in the low hundreds of kilobytes, against the original 6000x4000 / 11.2 MB. Record both figures.
- [x] 6.3 Do not commit the 11.2 MB original into this repository. Confirm it is absent from the repository after the copy.
- [x] 6.4 Confirm the image dimensions of the derivative and that it will be served through `next/image` with an explicit size and a fixed aspect container using `object-fit: cover`.

## 7. Page sections

- [x] 7.1 Create `components/sections/hero.tsx` as a Server Component. Open with the owner's name and professional role as real text, the short biography summary, and the primary call to action. Exactly one `primary` button on the page.
- [x] 7.2 Create `components/sections/profile.tsx` rendering the profile image through `next/image` with explicit dimensions, `object-cover` in a fixed aspect container, and alternative text identifying it as a photograph of the owner.
- [x] 7.3 Create `components/sections/biography.tsx` rendering the biography from the content model in the sans prose face at the body type step.
- [x] 7.4 Create `components/sections/education-summary.tsx` composing the existing `Card` and `Metadata` primitives. Render each qualification's title, institution, period, location, and focus, with period and location in the mono data face.
- [x] 7.5 Create `components/sections/focus-areas.tsx` rendering the five declared focus areas with their computed evidence counts, omitting the count entirely when it is zero.
- [x] 7.6 Create `components/sections/statistics.tsx` rendering the statistics band. Every figure is a prop obtained from `derive.ts`; each carries a label in the mono data face.
- [x] 7.7 Create `components/sections/featured-work.tsx` rendering featured case studies in the declared order, composed from the `Card` primitive. When the number shown is fewer than the total projects available, state the total so an unmarked project is never invisible without explanation.
- [x] 7.8 Create `components/sections/calls-to-action.tsx` with the secondary and ghost actions, every destination taken from `lib/navigation.ts` or the content declaration rather than typed into the section. External destinations carry `target="_blank"`, `rel="noopener noreferrer"`, and a visually-hidden note that they leave the site.
- [x] 7.9 Confirm no section contains a client directive, and that `grep -rn "use client" app components lib` still reports only `components/layout/nav-link.tsx`.
- [x] 7.10 Confirm no section contains a raw colour literal, a radius outside 2/4/6px, an off-scale spacing value, or a type step outside the declared scale.

## 8. Compose the page and navigation

- [x] 8.1 Replace `app/page.tsx` with the real landing page, composing the sections in reading order and separating them with the single `SECTION_RHYTHM` step from `lib/layout.ts`. Remove the placeholder copy and the placeholder content entirely.
- [x] 8.2 Add the landing page's section anchors to `lib/navigation.ts` so both the desktop navigation and the small-width disclosure pick them up. Do not add a second list, and do not add scroll-spy.
- [x] 8.3 Confirm the landing page does not reimplement the shell: the skip link, header, main region, and footer come from `PageShell` in the root layout, with exactly one `banner`, one `main`, and one `contentinfo`.
- [x] 8.4 Confirm `app/globals.css` is unchanged by this change — no new colour, type step, radius, or spacing value was required.
- [x] 8.5 Confirm heading levels descend without skipping, and that each major region is a labelled section with a heading.
- [x] 8.6 Confirm every call to action destination is well-formed, and that no malformed URL from the content is rendered.

## 9. Verification

- [x] 9.1 Run the parser tests from group 2 and confirm all pass.
- [x] 9.2 Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. All three must pass.
- [x] 9.3 Confirm `package.json` and `package-lock.json` are unchanged from the scaffold — this change adds no dependency.
- [x] 9.4 Confirm the derived figures on the rendered page equal the values from task 4.6, read from the built output rather than from the source.
- [x] 9.5 Fetch the landing page with client scripts disabled and confirm the biography, education summary, focus areas, statistics band, featured case studies, and calls to action are all present in the returned markup.
- [x] 9.6 Render the page at the narrowest supported viewport in a real browser and confirm the document does not scroll horizontally with the longest real value present, such as a full project URL. Report the measured widths.
- [x] 9.7 Confirm `grep -rnE '[0-9]+'` over `components/sections/` finds no statistic literal — only ordinal or incidental numbers, if any.
- [x] 9.8 Confirm the upstream `../data for portfolio/` directory is unmodified by this change.
- [x] 9.9 Report the experience records whose description contradicts their own record, and the discrepancy between the upstream copy and `content/`, as follow-ups for the owner.