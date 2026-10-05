# Tasks

## 1. Project slugs in the content model

`open <project>` resolves against declared slugs, and `openspec/specs/project-detail/spec.md` — a
main spec since `interactive-terminal` was archived — mandates that every project declares a unique
slug. No code implements it. This group closes that gap so `open` has something to resolve, and it
delivers behavior the main spec set already requires.

- [x] 1.1 Add `'slug'` to `FieldKind` in `lib/content/schema.ts` and implement its case in `checkField`: reject a value that is empty, contains a character outside `[a-z0-9-]`, or is not hyphen-separated lowercase words.
- [x] 1.2 Generalize the cross-record uniqueness check in `lib/content/validate.ts`. Replace the `checkUniqueOrderIndex` single-field dispatch with a loop over declared fields, routing `orderIndex` to the existing rule and `slug` to a new uniqueness check that reuses its failure shape (file, both line numbers, offending value).
- [x] 1.3 Add `slug: { kind: 'slug' }` to `PROJECT_SCHEMA`, `slug: string` to the `Project` interface, and `slug` to `buildProject` in `lib/content/model.ts`.
- [x] 1.4 Add a `slug` column to `content/projects.csv` with a unique hyphen-separated value per row: `etapon`, `guardian-vision`, `asteria-academy`, `trait-tech-hive`, `happy-endings`, `care-max`, `portfolio-website-v1`.
- [x] 1.5 Verify the build fails, naming the file, record, and field, when a slug is missing, uppercase, contains a space or underscore, or is duplicated across two rows.
- [x] 1.6 Confirm `app/globals.css` and every existing route are unaffected by this group.

## 2. Command engine

Nothing in `lib/terminal/` may import React, Next, or `node:fs`. Every `resolve` is a total function of `(argv, content, now)`.

- [x] 2.1 Create `lib/terminal/types.ts` with the shared types: `CommandName`, `CommandArity`, `ResolutionClass` (`'server' | 'session'`), `CommandResult` (`{ lines }` or `{ lines, navigateTo }`), and the `Command` shape carrying `name`, `arity`, `class`, `usage`, `summary`, and `resolve`.
- [x] 2.2 Create `lib/terminal/registry.ts` as the single declared command set, exported as a frozen array plus a lookup by name.
- [x] 2.3 Implement the content-backed commands against `ContentModel` and `lib/content/derive.ts`: `whoami`, `about`, `ls`, `projects`, `skills`, `certifications`, `experience`, `education`, `contact`, `socials`, `status`, `neofetch`.
- [x] 2.4 Implement `status` and `neofetch` using only figures the content model yields. No literal count, total, or year.
- [x] 2.5 Implement `date` and `uptime` taking `now` as a parameter rather than reading a clock. `uptime` must label what it measures and must not present process age as site uptime.
- [x] 2.6 Implement `open <project>` to resolve its argument against declared slugs and return `navigateTo` only when a case study is published; otherwise return the unmatched-slug error listing the slugs that exist, or the "no case study is published" outcome. It performs no navigation and calls no `redirect()`.
- [x] 2.7 Generate `help` output from the registry itself, so the help text cannot drift from the command set.
- [x] 2.8 Declare `history` and `clear` in the registry as session-class with no resolver of their own, so the command set stays in one place.
- [x] 2.9 Confirm no file under `lib/terminal/` imports `react`, `next`, `next/navigation`, or `node:fs`.

## 3. Server endpoint

- [x] 3.1 Create `lib/terminal/parse.ts`: split the input line on whitespace into a name and at most one argument. No quoting, escaping, flags, or evaluation of any kind.
- [x] 3.2 Create `app/api/terminal/route.ts` exporting `POST`. Read `{ line }`, parse it, dispatch through the registry, and return `{ lines }` or `{ lines, navigateTo }` as JSON. Set no cache directive — `POST` is uncached by default.
- [x] 3.3 Reject a request body above 4 KB and a `line` above 200 characters with a 4xx status, before parsing either, so an oversized body is never buffered into a parse.
- [x] 3.4 Return a refusal naming an unknown command and suggesting the closest declared name; a usage error for wrong arity; and a refusal for any session-class name, so the two resolution paths cannot diverge.
- [x] 3.5 Verify with `curl` that each content-backed command returns lines, that an oversized body and an over-long line are both refused, and that no response contains anything beyond the command's own output.

## 4. Overlay mount point and navigation

- [x] 4.1 Change `NavItem` in `lib/navigation.ts` into the discriminated union described in design decision D4: a link kind carrying `href`, and an action kind carrying `id`, `label`, and `shortcut`.
- [x] 4.2 Add the terminal entry to `PRIMARY_NAV` as an action item, with its `shortcut` string declared once.
- [x] 4.3 Update `site-header.tsx` to render a `kind: 'link'` item through the existing `NavLink` and a `kind: 'action'` item through the terminal trigger. Keep the header a Server Component.
- [x] 4.4 Confirm the desktop `<nav>` and the mobile `<details>` disclosure both render the action, from the same `PRIMARY_NAV`, with no additional wiring.
- [x] 4.5 Add the overlay mount point to `components/layout/page-shell.tsx`, once, below the footer so it is a sibling of the shell rather than a child of the main column.
- [x] 4.6 Confirm no route renders its own overlay or terminal control, and that the mount point exists exactly once.

## 5. The dialog element

One `<dialog>`, opened imperatively through a ref. No hand-written focus trap anywhere in this change.

- [x] 5.1 Create `components/terminal/terminal-dialog.tsx` rendering a `<dialog>` with `aria-label` identifying it as a terminal. Do not hand-write `aria-modal`, and do not add `role="dialog"`.
- [x] 5.2 Implement open, close, and mode switching against the element: `showModal()` at or above the small breakpoint, `show()` below it, and `close()` for dismissal.
- [x] 5.3 Handle the `cancel` event so Escape in modal mode routes to the same close path as everything else.
- [x] 5.4 Add a `keydown` listener for Escape to cover the non-modal drawer, where `cancel` does not fire. Confirm both paths reach one close function.
- [x] 5.5 On a `matchMedia` change while open, perform `close()` immediately followed by the new mode's open call on the same element, so history and scrollback survive. Confirm the component never unmounts across the switch.
- [x] 5.6 Style the dialog from existing token roles only: `surface-overlay` at wide widths, `surface-raised` in the drawer, `border` hairline, `radius-md`. No literal colour value.
- [x] 5.7 Style `::backdrop` as `surface` at 80% alpha, applying it only in modal mode, since a non-modal dialog renders no backdrop.
- [x] 5.8 Style the drawer with `height: 100dvh` and trailing-edge anchoring so the prompt stays on screen behind mobile browser chrome.
- [x] 5.9 Cap the output region's measure at `100ch` and the dialog's outer width at the declared container token. Confirm long lines wrap and nothing is clipped or scrolls horizontally.

## 6. Client overlay component

`components/terminal/terminal-overlay.tsx` is `'use client'` and is the first client component above route level.

- [x] 6.1 Hold open state, scrollback lines, history, and the history cursor in this one component.
- [x] 6.2 Move focus to the input on open. Record `document.activeElement` at open time for restoration.
- [x] 6.3 On close, restore focus to the recorded element, and skip restoration when that element is no longer in the document, so focus is never stranded on a removed node.
- [x] 6.4 Close immediately on Escape while a command is in flight, and discard a late response for the abandoned session rather than reopening or appending to it.
- [x] 6.5 Append output only after the server responds, so no line for a pending command is ever shown.
- [x] 6.6 Implement `history` and `clear` locally with no request, per their session class.
- [x] 6.7 Wire the up and down arrows to move through history and the current index.
- [x] 6.8 Wire Enter to dispatch, clearing the input and keeping focus in it.
- [x] 6.9 Implement Tab completion against the registry's declared names only: a unique prefix completes and appends a space, several matches print the candidates and leave the input unchanged, no match leaves it unchanged.
- [x] 6.10 Build the input as a real `<input>` with the prompt as a sibling `aria-hidden` span and a visually-hidden label, so the accessible name is not the decorative glyph. Add no custom caret and no key handler that reimplements Home, End, Backspace, Delete, or arrow editing.
- [x] 6.11 Add a visually-hidden `aria-live="polite"` region carrying only the most recent result. Put no live behaviour on the scrollback.
- [x] 6.12 On a response carrying `navigateTo`, close the overlay and call `router.push`, landing on the ordinary case-study page.
- [x] 6.13 Add no transition or animation, and no typing animation or sound.

## 7. Global keyboard shortcut

- [x] 7.1 Create `components/terminal/terminal-trigger.tsx` as a thin client child rendering a `<button>` that opens the overlay, with an accessible name that includes the declared shortcut.
- [x] 7.2 Add the keydown listener to the overlay component, ignoring the event when its target is an `input`, `textarea`, `select`, or `contenteditable`.
- [x] 7.3 Require the platform command modifier, and ignore the event when any other modifier is also held.
- [x] 7.4 Toggle the overlay on the declared combination, declaring it in exactly one constant that the trigger's accessible name also reads.
- [x] 7.5 Confirm the combination does not fire while focus is in the terminal's own input, and that the backtick reaches the input instead.

## 8. Token and typography conformance

- [x] 8.1 Set all terminal text at `--text-small` and confirm nothing on the overlay renders below the 0.85rem floor and no terminal text uses the `code` step.
- [x] 8.2 Confirm `app/globals.css` is unchanged — no colour, spacing step, radius, or type step added.
- [x] 8.3 Reference every colour by an existing role, including the backdrop as `surface` at partial alpha. Confirm no literal colour value appears in any terminal style.
- [x] 8.4 Confirm command failure is stated in the output text and not signalled by colour alone.
- [x] 8.5 Confirm every focusable terminal element shows a visible focus indication against the surface it sits on, at `border-strong` or better.

## 9. Verification

- [x] 9.1 `npm run lint` passes.
- [x] 9.2 `npm run build` passes, and the build output lists the same two routes as before with no route added.
- [x] 9.3 Confirm there is no terminal route and that no URL addresses the terminal.
- [x] 9.4 Inspect the overlay's client bundle and confirm it holds declared command names and interaction code only — no project, certification, experience, or qualification record, and no slug.
- [x] 9.5 Confirm no file under `lib/terminal/` imports React or a client-only hook.
- [x] 9.6 Confirm exactly one client component was added above route level, and that `site-header.tsx` and `site-footer.tsx` are still Server Components.
- [x] 9.7 Grep the components for hardcoded counts, totals, and years, and confirm every figure traces to the content model.
- [x] 9.8 Confirm no focus-trap library, command parser, or shell-emulation library was added, and that `package.json` and `package-lock.json` are unchanged.
- [x] 9.9 Focus walk at a wide viewport: open, confirm focus is on the input, Tab and Shift+Tab stay inside, Escape closes, and focus returns to the trigger.
- [x] 9.10 Focus walk at a narrow viewport: confirm the header and skip link remain visible and operable while the drawer is open, and that focus is not contained.
- [x] 9.11 Resize across the breakpoint with the terminal open and confirm the mode switches, the session survives, and neither `show()` nor `showModal()` throws.
- [x] 9.12 Confirm that with a covering overlay open the shell's banner, main, and contentinfo are not exposed to assistive technology, and that closing restores them.
- [x] 9.13 Confirm opening and closing the terminal adds no browser history entry, and that the back button does not reopen it.
- [x] 9.14 Confirm `open <slug>` navigates and closes for a published slug, reports without navigating for an unknown slug, and reports that no case study is published for an unpublished one.
- [x] 9.15 Confirm the terminal is never openable when client scripts fail, and that every route the shell links to remains navigable.
- [x] 9.16 Confirm the site is fully usable and every destination reachable for a visitor who never opens the terminal.

## 10. Handoff

- [x] 10.1 Record in the proposal that `interactive-terminal`'s `terminal` and `typography` capability deltas are superseded by this change and must not be applied, while its `project-detail` delta remains live.
- [x] 10.2 Record that `open` depends on the `/projects/[slug]` route from `interactive-terminal`'s `project-detail` capability, and degrades to the "no case study is published" outcome until that route ships.
- [x] 10.3 Note in the handoff that there is no test runner in the project, so `lib/terminal/` is verified by `npm run build` and `npm run lint` until one is added; the engine is pure so that adding one is cheap.