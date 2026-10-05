# Tasks

## 1. Content fields

The schema and the CSV header change must land in one change: `checkHeader` fails in both directions, so neither alone builds. Task 1.3 is that combined step and must not be split.

- [ ] 1.1 Add `'slug'` and `'optionalText'` to `FieldKind` in `lib/content/schema.ts` and implement both cases in `checkField`. `slug` rejects empty, uppercase, and anything outside `/^[a-z0-9]+(-[a-z0-9]+)*$/`; `optionalText` always returns `null`. No collection declares these yet, so the build is unaffected at this step.
- [ ] 1.2 Generalize the cross-record uniqueness check in `lib/content/validate.ts`. Replace the hardcoded `checkUniqueOrderIndex` dispatch with a loop over declared fields that routes `orderIndex` to the existing `checkUniqueOrderIndices` and `slug` to a new uniqueness check reusing its failure shape (file, both line numbers, offending value).
- [ ] 1.3 In one change: add `slug: { kind: 'slug' }` and `detail: { kind: 'optionalText' }` to `PROJECT_SCHEMA`; add `slug: string` and `detail: string` to the `Project` interface and to `buildProject` in `lib/content/model.ts`; add both columns to the `content/projects.csv` header and give all seven rows a unique kebab-case slug. Leave `detail` empty for every row.
- [ ] 1.4 Verify `npm run build` fails with a message naming file, record, and field when a slug is absent, uppercase, or contains a space or underscore; and when two rows declare the same slug.
- [ ] 1.5 Verify `detail` may be empty on every row and that the build still succeeds.
- [ ] 1.6 Confirm slugs are lowercase, hyphen-separated, and match the project's own title rather than being derived from it at render time.

## 2. Derived lookups

- [ ] 2.1 Add `findProjectBySlug(slug, content)` to `lib/content/derive.ts`, returning the project or `undefined`.
- [ ] 2.2 Add the derived cross-references the case-study page needs — for example the set of other projects sharing a technology — each computed from the content model, with no figure written as a literal.
- [ ] 2.3 Confirm every exported figure is computed at call time from `ContentModel` and none is a constant in the module.

## 3. Project case-study route

- [ ] 3.1 Create `app/projects/[slug]/page.tsx` as a Server Component. `params` is a `Promise` in Next 16.3.8 and must be awaited.
- [ ] 3.2 Export `generateStaticParams` returning one `{ slug }` per project, and `export const dynamicParams = false` so an ungenerated segment 404s without running the page body.
- [ ] 3.3 Call `notFound()` when `findProjectBySlug` misses, so the page is correct on its own terms even if the segment config is later removed.
- [ ] 3.4 Build `components/project-detail/` from the existing primitives in `components/ui/` — button, card, metadata, status indicator — with no new primitive.
- [ ] 3.5 Render the declared fields: title, category, description, tech stack, and the declared live and source destinations. Every figure comes from the model, never from the component.
- [ ] 3.6 Give external destinations the treatment already used in `components/layout/nav-link.tsx`: new browsing context, `rel="noopener noreferrer"`, and a visually-hidden "opens in a new tab". Internal destinations get neither.
- [ ] 3.7 Create `components/project-detail/case-study-body.tsx`: split on `/\n{2,}/`, one `<p>` per block, no Markdown interpretation. Confirm markup characters render literally.
- [ ] 3.8 When `detail` is empty, render no body and no placeholder or generated paragraph in its place.
- [ ] 3.9 Verify the page carries no `'use client'` directive and that `PageShell` — applied once at `app/layout.tsx:36` — is inherited, giving exactly one banner, main region, and contentinfo.
- [ ] 3.10 Verify an unknown slug returns 404 and does not redirect to the index or render a different project.

## 4. Command layer

Keep this directory free of React, Next, and `node:fs` imports. Every `resolve` is a total function of its arguments and the content passed to it.

- [ ] 4.1 Create `lib/terminal/registry.ts` with the shared types: command name, arity, resolution class (`server` or `session`), usage string, summary, and `resolve`.
- [ ] 4.2 Implement the content-backed commands against `ContentModel` and `lib/content/derive.ts`: `whoami`, `about`, `ls`, `projects`, `skills`, `certifications`, `experience`, `education`, `contact`, `socials`, `status`, `neofetch`.
- [ ] 4.3 Implement `neofetch` and `status` using only figures the content model yields. No literal count, total, or year.
- [ ] 4.4 Implement `date` and `uptime` taking the current time as a parameter rather than reading a clock. `uptime` must label what it measures and must not present process age as site uptime.
- [ ] 4.5 Implement `open <project>` to resolve its argument against declared slugs and return either a `navigateTo` path or an error listing the slugs that exist. It performs no navigation and calls no `redirect()`.
- [ ] 4.6 Generate `help` output from the registry itself, so the help text cannot drift from the command set.
- [ ] 4.7 Declare `history` and `clear` in the registry as session-class so the command set stays in one place, with no resolver of their own.
- [ ] 4.8 Confirm no file under `lib/terminal/` imports `react`, `next`, or `node:fs`.

## 5. Server endpoint

- [ ] 5.1 Create `lib/terminal/parse.ts`: split the input line on whitespace into a name and at most one argument. No quoting, escaping, flags, or evaluation of any kind.
- [ ] 5.2 Create `app/api/terminal/route.ts` exporting `POST`. Read `{ line }`, parse it, dispatch through the registry, and return `{ lines }` or `{ lines, navigateTo }` as JSON. Set no cache directive — `POST` is uncached by default.
- [ ] 5.3 Return a refusal with status 400 for an unknown command, naming it and suggesting the closest declared name; for wrong arity, stating the expected argument; and for any session-class name, so the two resolution paths cannot diverge.
- [ ] 5.4 Verify with `curl` that each content-backed command returns lines and that no response contains anything beyond the command's own output.

## 6. Terminal route and client leaf

- [ ] 6.1 Create `app/terminal/page.tsx` as a Server Component that passes no content data to its children.
- [ ] 6.2 Build `components/terminal/scrollback.tsx` as a Server Component: append-only, no ARIA live behaviour, framed in `surface-inset` with a border, capped at `max-w-prose` with an inner `100ch` measure. No maximum retained length.
- [ ] 6.3 Build `components/terminal/terminal-input.tsx` as `'use client'`: a real `<input>`, with the prompt as a sibling `aria-hidden` span and a visually-hidden label so the accessible name is not the decorative glyph.
- [ ] 6.4 Add no custom caret element and no key handler that reimplements Home, End, Backspace, Delete, or arrow editing. Confirm insertion and deletion follow the platform caret.
- [ ] 6.5 Hold history as component state, appended per executed command, never written to `localStorage` or `sessionStorage`, never sent to the server, and emptied by `clear`.
- [ ] 6.6 Wire the up and down arrows to move through history, and implement `history` and `clear` locally with no request.
- [ ] 6.7 Wire Enter to dispatch, clearing the input and keeping focus in it.
- [ ] 6.8 Implement Tab completion against the registry's declared names only. A unique prefix completes and appends a space; several matches print the candidates and leave the input unchanged; no match leaves the input unchanged.
- [ ] 6.9 Add a visually-hidden `aria-live="polite"` region carrying only the most recent result. Do not put live behaviour on the scrollback.
- [ ] 6.10 On a response carrying `navigateTo`, call `router.push` so the destination is an ordinary Server Component navigation to a full page.
- [ ] 6.11 Append output only after the server responds, so the scrollback can never contain a line the server did not produce.
- [ ] 6.12 Confirm focus is visible on the input and that the only focusable elements before it on this page are the skip link and the header navigation.

## 7. Navigation and landing link

- [ ] 7.1 Add `{ href: '/terminal', label: 'Terminal' }` to `PRIMARY_NAV` in `lib/navigation.ts`.
- [ ] 7.2 Add a secondary link to the terminal on the landing page, keeping the one-primary-per-view rule intact — a secondary treatment, not a second primary button.
- [ ] 7.3 Confirm `PRIMARY_NAV` contains no per-project entry and that the landing page does not enumerate all projects as links.

## 8. Token and typography conformance

- [ ] 8.1 Set all terminal text at `--text-small` (0.875rem), confirming nothing on the route renders below the 0.85rem floor and that no terminal text uses the `code` step.
- [ ] 8.2 Confirm `app/globals.css` is unchanged — no colour, spacing step, radius, or type step is added.
- [ ] 8.3 Reference every colour by an existing role: the surface roles, the three text roles, the two border roles, and the four status roles. No literal colour value in any terminal style.
- [ ] 8.4 Confirm command success and failure are stated in the output text and not signalled by colour alone.
- [ ] 8.5 Confirm no transition or animation runs when the user has asked for reduced motion.
- [ ] 8.6 Confirm Tab is bound to nothing else on the route.

## 9. Verification

- [ ] 9.1 `npm run lint` passes.
- [ ] 9.2 `npm run build` passes, and the build output lists one prerendered page per project plus `/terminal`.
- [ ] 9.3 Enumerate `'use client'` across the application: the existing navigation leaf plus exactly one new leaf on the terminal route, and none on the project route.
- [ ] 9.4 Inspect the terminal client bundle and confirm it holds declared command names and interaction code only — no project, certification, experience, or qualification record, and no slug.
- [ ] 9.5 Grep the components for hardcoded counts, totals, and years, and confirm every figure traces to the content model.
- [ ] 9.6 Keyboard walk of `/terminal`: Tab order, Enter, up and down history, Home and End, Backspace and Delete, and visible focus.
- [ ] 9.7 Read `/terminal` at a narrow and a wide viewport, confirming the prompt and input stay on one line, long output wraps, and nothing is clipped or needs horizontal scrolling.
- [ ] 9.8 Fetch `/terminal` and `/projects/<slug>` with scripts disabled and confirm the markup carries the case-study content and the terminal's initial lines as selectable text, and that every shell link still resolves.
- [ ] 9.9 Confirm `/projects/[slug]` and `/terminal` each render exactly one banner, one main region, one contentinfo, and the skip link first.

## 10. Handoff

- [ ] 10.1 Write the owner-facing note listing the seven project slugs assigned in task 1.3 and stating that each `detail` cell is empty, that the case-study pages therefore present their other recorded fields with no body, and that the bodies are content the owner writes rather than something the build can supply.
- [ ] 10.2 Record in the same note that there is no test runner in the project, so `lib/terminal/` is verified by `npm run build` and `npm run lint` until one is added.