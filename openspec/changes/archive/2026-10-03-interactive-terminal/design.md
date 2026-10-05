# Design

## Context

The application has one route (`app/page.tsx`), one client component (`components/layout/nav-link.tsx`, needed only for `usePathname`), and one way to read content (`lib/content/model.ts`, which validates four CSVs and deep-freezes them at module load). Styling is CSS-first in `app/globals.css` via Tailwind v4 `@theme`; there is no `tailwind.config.js`. `components/layout/page-shell.tsx` is applied once in `app/layout.tsx`, so no route can render without the skip link, header, main region, and footer, and no route can opt out.

Three things constrain this change more than anything else, so they are stated here rather than rediscovered later:

- **Content is read from disk at build time and frozen.** `CONTENT` is assembled by `readFileSync` in `lib/content/model.ts:185` and deep-frozen at `lib/content/model.ts:205`. A new field is therefore a schema change, a model change, and a CSV header change — there is no runtime content API to extend.
- **Validation is per-field, with one deliberate exception.** `checkField` (`lib/content/schema.ts:170`) receives a single value, so it cannot express a rule that spans records. Cross-record uniqueness exists exactly once today, for `orderIndex`, in `checkUniqueOrderIndices` (`lib/content/validate.ts:115`), and its comment calls itself "the one rule that spans records rather than fields." This change needs a second such rule, so it follows that precedent rather than inventing a new mechanism.
- **There is no test runner.** `package.json` has `dev`, `build`, `start`, and `lint` — no `test` script — despite `lib/content/csv.test.ts` existing. Nothing can currently execute a spec scenario as a test. See D14.

Dependencies are `next`, `react`, `react-dom`, and nothing else. This change adds none.

## Goals / Non-Goals

Goals:

- Keep the command layer a pure function of its arguments and the content model, so it is callable from a route handler, a future search page, or a test with no browser and no React.
- Add exactly one client boundary to the terminal route and zero to the project route.
- Add two content fields and the minimum schema surface needed to carry them.
- Make the unknown-slug case structurally impossible to render rather than a runtime branch.
- Change no token, no primitive, and no existing route's markup.

Non-Goals, at the design level (the proposal's non-goals are not repeated):

- **No argument grammar beyond one optional argument.** The input is split on whitespace and yields a name plus at most one argument. There is no quoting, escaping, flag parsing, or `--` convention. `open "my project"` treats `"my` as the argument and fails against the slug list, which is the correct behaviour for a declared command set, not a bug.
- **No streaming and no optimistic output.** One command produces one response. The scrollback is appended only after the server responds, so it can never contain a line the server did not produce.
- **No `app/not-found.tsx`.** Next's built-in 404 is used. This change does not restyle the not-found path, and `notFound()` returning a 404 that is visually distinct from the site is a pre-existing condition.
- **No test runner.** Adding one is a separate change with its own decision about runner and DOM environment. This change keeps the command layer pure precisely so that such a change is cheap later.

## Decisions

### D1. Unknown slugs are excluded at build time, not caught at request time

`app/projects/[slug]/page.tsx` exports `generateStaticParams` returning every project slug, and `export const dynamicParams = false`.

With `dynamicParams = false`, a segment not produced by `generateStaticParams` returns 404 without the page body ever running (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`). Because slugs come from a validated CSV and the set is known during `next build`, the valid set is closed at build time and no runtime lookup is needed to decide what is valid.

The page still calls `notFound()` if its own lookup misses. That is redundancy on purpose: `dynamicParams = false` is the mechanism that makes unknown slugs cheap, and the guard is what makes the page correct on its own terms if someone later removes the export.

Alternatives considered: `dynamicParams = true` (the default) plus a `notFound()` guard — this generates and discards a page per bogus slug, which is strictly more work for the same status code. Resolving the slug in `generateMetadata` and letting the page assume presence — pushes the failure earlier but leaves the page body trusting an invariant it does not check.

### D2. `slug` and `detail` are two new field kinds, and uniqueness reuses the existing cross-record check

`PROJECT_SCHEMA` (`lib/content/schema.ts:86`) gains:

| Field | Kind | Rationale |
| --- | --- | --- |
| `slug` | `{ kind: 'slug' }` (new) | Required. Fails the build when absent, empty, uppercase, or containing a character outside `[a-z0-9-]`. |
| `detail` | `{ kind: 'optionalText' }` (new) | Optional. Empty is legal and means the project has no case-study body yet. |

Both are added to `FieldKind` (`lib/content/schema.ts:55`) as new members, so the compile-time union and the runtime switch in `checkField` stay in step the way `as const` arrays do for value sets.

`checkUniqueOrderIndex` (`lib/content/validate.ts:151`) currently hardcodes "the one `orderIndex` field." It becomes a loop over declared fields, dispatching to `checkUniqueOrderIndices` for `orderIndex` and to a new slug-uniqueness check for `slug`. The existing function already reports the file, both line numbers, and the offending value — the slug check reuses that reporting shape so the error a content owner sees is the same shape they already know.

`detail` being optional is the honest choice, not a convenience. Seven case studies do not exist yet, and inventing seven paragraphs of technical history would be the same failure as the contradictory project prose this change already rejects. A project with no `detail` renders a page with its other recorded fields and no body, and `content-model`'s existing rule — that absence is represented as absent, not substituted — is what makes that acceptable. Writing the seven bodies is a content task for the owner, not an implementation task.

Alternatives considered: deriving `slug` from `title` at render time — rejected by the spec because renaming a title would then break a published URL. Making `detail` required — would fail the build immediately and force seven fabricated case studies. Validating uniqueness in the page instead of in `validate.ts` — puts a content rule in a rendering path, which is the split `lib/content/` exists to prevent.

### D3. `detail` renders as paragraphs, with no Markdown

`components/project-detail/case-study-body.tsx` splits on `/\n{2,}/` and renders one `<p>` per block, dropping empty lines. Characters that would be Markdown syntax render as the literal characters they are.

The reason is the same as D2's: a renderer implies a grammar, and a grammar implies an expectation. A visitor who types `**bold**` into a field and sees bold text will reasonably expect the field to be Markdown elsewhere too. The absence of the grammar is stated in the proposal's non-goals and is cheaper to keep than to explain.

Alternatives considered: adding a Markdown dependency (the proposal forbids new dependencies); accepting inline `<p>` HTML in the field (puts markup in a CSV cell, and every editor that touches the file must not mangle it).

### D4. Commands resolve through a Route Handler, not a Server Action

`app/api/terminal/route.ts` exports `POST`. The client sends `{ line: string }` and receives `{ lines: string[] }` or `{ lines, navigateTo }`.

The framework's own guide is decisive here: Server Actions are for mutations, and it explicitly directs non-mutation requests to a Route Handler (`node_modules/next/dist/docs/01-app/02-guides/server-actions.md`, "Sequential dispatch on the client"). A terminal command mutates nothing.

Three further reasons, in order of weight:

1. **A Server Action's response carries a re-rendered RSC payload for the current route** (same document, "A single response carries data and UI"). Every keystroke-triggered command would re-render and re-ship the terminal page to append lines to a scrollback. That is cost paid for UI that does not change.
2. **Server Actions dispatch sequentially per client.** Acceptable here, but it is a framework scheduling rule the terminal would then depend on for no benefit.
3. **The contract stays plain data.** A `POST` returning JSON is inspectable with `curl`, and the command layer behind it is a function that takes `(argv, content)` and returns lines — no React, no action types.

`POST` is never cached by default and needs no route segment config to be uncached (`node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`, "Caching"). No `export const dynamic` is required.

Alternatives considered: Server Action with `useActionState` — re-renders the page per command (see above). Rendering the output server-side as React components — would make the scrollback a server/client boundary mismatch and would put markup in the wire format, contradicting the text-lines contract. Client-side resolution over a content payload — this is the one that was rejected hardest, because it is much cheaper and would work; see D13.

### D5. Commands fall into two resolution classes, and the split is explicit

- **Content-backed**, resolved by the Route Handler: `help`, `whoami`, `about`, `ls`, `projects`, `skills`, `certifications`, `experience`, `education`, `contact`, `socials`, `status`, `neofetch`, `open`, `uptime`, `date`.
- **Session-scoped**, resolved in the browser with no request: `history`, `clear`.

`history` and `clear` describe *this page load*, and persistence across loads is a proposal non-goal, so there is no server-side session for them to ask. Pretending otherwise would mean inventing server state the design forbids. The registry declares each command's resolution class explicitly, and the handler refuses any name whose class is session-scoped, so the two paths cannot drift on the same name.

`uptime` reports the age of the server process and says so in its own output. It is not the site's uptime, because the site has no uptime to report and a number that looks like one is a false claim.

Alternatives considered: sending `history` to the server with the session history as an argument — the client would be shipping its own state to be told what it already knows. Making all commands session-class and resolving content client-side — this is D13.

### D6. The command layer is pure; rendering is a separate concern

`lib/terminal/registry.ts` declares commands as data. Each command is `{ name, arity, summary, resolve }` where `resolve(argv, content)` returns `readonly string[]`. Nothing in `lib/terminal/` imports React, Next, or the filesystem; it receives `ContentModel` as an argument.

This is what makes D4's rejection of client-side resolution a policy rather than an accident: the layer is *capable* of running in the browser, and it is kept out of the browser by construction and review, not by inability. It also makes the layer callable from a future non-terminal surface with no adapter.

`neofetch` renders the profile beside a few derived figures, all from `lib/content/derive.ts` and `content/site.ts` — never literals. `status` prints only figures the model yields.

### D7. Terminal type reuses the `small` step; the scale is not extended

Terminal prompts and output render at `--text-small` (0.875rem / 1.5 line-height, `app/globals.css:115`), in the mono face per the `typography` delta.

The `code` step is 0.8125rem (`app/globals.css:123`), which is below the 0.85rem size-contrast floor and is sized for inline code inside a line of prose. This change therefore corrects the scale table's claim that `code` is for "terminal content" rather than adding a `terminal` step. Adding one would have been defensible; not adding one keeps the proposal's promise that `app/globals.css` is unchanged and no token is added, and 0.875rem is the correct size regardless of what it is called.

Consequence: the terminal's smallest text is 14px. It passes the floor, and it is the same size as the page's own secondary prose — so the terminal is separated from the page by its mono face, `surface-inset`, and a border, never by being smaller.

### D8. The output measure is a character width, not a rem value

The terminal region is `max-w-prose` (68rem, `--container-prose`) to match the declared container tokens, and the output region additionally caps its measure at `100ch`.

`ch` is derived from the mono face's `0` glyph, so the measure is 100 characters of the actual rendered font at any viewport or root size — it self-adjusts, needs no token, and is not a magic number tuned to one breakpoint. 68rem of 14px mono is roughly 130 characters, which is too wide to read; `100ch` brings it to a terminal-shaped measure without introducing a `max-w-[52rem]` literal.

The spec requires that output wrap at the region's width rather than at a hard-coded column, and `100ch` is a maximum on the region, not a column the text is forced into — long lines wrap, nothing is clipped.

### D9. The input is a real text control, and the caret is the platform's

`components/terminal/terminal-input.tsx` is `'use client'` and renders a real `<input>` with the prompt rendered as a sibling `<span aria-hidden="true">` plus a visually-hidden label, so the accessible name is not the decorative `$`.

Selection, caret movement, insertion, and deletion are the platform's. There is no custom caret element, no `onKeyDown` handler that reimplements Home/End/Backspace, and no caret-position state. A hand-drawn caret over a real input desynchronises from the real value as soon as selection, IME composition, autofill, or a paste happens, and the terminal prompt is a single-line control where all of those are reachable.

### D10. The live region is separate from the scrollback

The scrollback is an ordinary region with no ARIA live behaviour. A separate visually-hidden `<p aria-live="polite">` carries only the most recent command's result, so a screen reader announces each result once, politely, without re-reading the entire scrollback on every append.

Putting `aria-live` on the scrollback would make every append re-announce the whole history, which for the fifth command is five repetitions of everything before it.

The scrollback remains selectable and copyable text; nothing is rendered to canvas or as images.

### D11. `open` returns a navigation intent; the client performs the navigation

`resolve` for `open` returns the slug list on failure, or `{ navigateTo: '/projects/<slug>' }` on success. It does not call `redirect()`, because the result arrives in a fetch response, not a navigation — `redirect()` thrown inside a Route Handler would produce a redirect response the client would not follow as intended.

The client then calls `router.push(navigateTo)`, so the destination is an ordinary Server Component navigation and the case-study page is a full page in the shell. Slugs arrive in the response rather than living in the bundle.

### D12. History is React state in the client leaf, and never persisted

`history` is a `string[]` in the client component's state, appended on each executed command, capped by nothing, cleared by `clear`. It is not written to `localStorage` or `sessionStorage` and is not sent to the server. Up and down arrows move an index into that array, per the existing shell convention of no persistence.

Alternatives considered: persisting to `sessionStorage` so history survives a reload — a proposal non-goal, and it would also mean commands are retained across navigations for no benefit.

### D13. Command names ship to the client; content and slugs do not

The client bundle contains the ~19 declared command names and their usage strings, and nothing else about the content model. This is what makes Tab completion of command names possible at all, and the proposal explicitly permits it.

The alternative — passing the full content model to the client and resolving commands in the browser — is one round trip cheaper, needs no Route Handler, and would let Tab complete slugs. It is rejected because `content-model` requires that content not reach the browser, and because it moves the guarantee from "enforced by the server" to "maintained by convention." The cost is one round trip per command over data already resident in the server process, which is the cheapest possible trade at this scale. Because D6 keeps the layer pure, reversing this decision later is a change to one argument at one call site rather than a rewrite.

### D14. The command layer is written to be testable; no test runner is added here

Every command's `resolve` is a total function of `(argv, content)` returning lines, with no clock, no filesystem, and no randomness — except `date` and `uptime`, which take the current time as a parameter rather than reading it, so their output is deterministic under test.

`package.json` gains no test script and no test dependency in this change. The absence of a runner is a real gap and it is recorded as such rather than quietly worked around; adding one is its own change with its own decision about runner and DOM environment. What this change does is make that future change cheap.

## Risks / Trade-offs

- **[Case studies ship empty]** → `detail` is optional and absence is stated as absence, so the seven pages are thin on day one rather than wrong. The visible cost is that the change looks smaller than the proposal implies. Writing the seven bodies is tracked as an owner task, and `projects`/`ls`/`neofetch` still make every project reachable in the meantime.
- **[One round trip per command]** → Accepted per D13. Every command is read-only over data already in the server process, and requests are sequential by nature. If latency ever matters, `open`'s validation and `projects` are the first candidates to revisit — and D6 keeps that a small change.
- **[The terminal page ships client JavaScript]** → This is the site's first route with real behaviour, and it is the reason `app-shell` and `design-tokens` are deliberately unmodified. The boundary is one component in one route; the shell stays a Server Component tree.
- **[`dynamicParams = false` couples the route to the CSV]** → Adding a slug to the CSV requires a rebuild before the page exists. That is the intended behaviour for validated content, and the alternative (serving a project whose slug was never validated) is the failure this change exists to prevent.
- **[An argv of one optional argument is limiting]** → `open` is the only command taking an argument and slugs have no spaces. Recorded as a design non-goal rather than deferred; adding quoting later is additive and does not change the specs.
- **[Two resolution classes could drift]** → The registry declares each command's class and the handler refuses session-scoped names, so a divergence is a 400 rather than a silently wrong answer.

## Migration Plan

No migration. There is no stored state, no database, no persisted history, and no route being replaced or renamed.

Deployment is a normal static build. `next build` reads the four CSVs, validates them (failing on a missing or duplicated `slug`), generates `/projects/<slug>` for every project, and emits `/terminal` and `app/api/terminal/route.ts`.

Rollback is a revert. `content/projects.csv` keeps its two new columns; a rollback that also drops them reverts the CSV too. No data is written by this change, so there is nothing to restore.

`/terminal` is added to `PRIMARY_NAV` (`lib/navigation.ts:62`), as the proposal specifies, and also receives a secondary link on the landing page. The primary list keeps its existing length discipline: no project address is added to it (see the `project-detail` spec), so adding a project never touches navigation.

Ordering constraint for whoever implements this: `content/projects.csv`'s header must gain `slug` and `detail` in the same commit as the `PROJECT_SCHEMA` change, because `checkHeader` (`lib/content/validate.ts:53`) fails in both directions — a declared field absent from the header is a build error, and so is a header field with no rule. The build cannot succeed in an intermediate state.

## Open Questions

- Whether `detail` should become required once all seven bodies exist. This is a one-word change to the schema when it does, and it does not alter any requirement in the specs.