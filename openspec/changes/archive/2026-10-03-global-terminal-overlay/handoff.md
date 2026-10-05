# Handoff

## Supersession (task 10.1)

`interactive-terminal`'s `terminal` and `typography` capability deltas are **superseded by this
change and must not be applied.** `interactive-terminal` has no implementation (0 of 63 tasks
complete), so there is nothing to unwrite. Its `project-detail` delta is **not** superseded — the
per-project case-study pages are orthogonal and remain live in that change.

The specific requirement that no longer applies: `interactive-terminal`'s `terminal` delta requires
"The terminal is a page in the shell, not an overlay", and its `typography` delta requires a
terminal-shaped region to have *no interactive behaviour*. Both are reversed here, by this change's
own deltas to the same two capabilities.

## The `open` dependency (task 10.2)

`open <slug>` depends on the `/projects/[slug]` route that `interactive-terminal`'s `project-detail`
capability introduces. Until that route ships, `PUBLISHED_CASE_STUDIES` in
`lib/terminal/commands.ts` is empty and `open` reports:

```
No case study is published for "etapon".

eTapon: An IoT-Enabled Smart Trash Bin is recorded in the content model, but its case-study
page is not published yet, so there is nowhere to navigate to.
```

This is the honest degradation, not a stub: an unmatched slug is a different message that lists the
slugs that exist, so "I do not have that project" and "I have it but cannot show you yet" stay
distinguishable. Publishing a case study is a one-word change — add its slug to the list — and the
client path (`closeTerminal()` then `router.push`) already ships.

Verified end to end by temporarily adding the route and one published slug: the terminal closed and
`/projects/etapon` rendered the ordinary case-study page inside the shell, header and footer intact.
The scaffold was removed; the shipped build has no `/projects` route.

## How this is verified (task 10.3)

**There is no test runner in the project.** `package.json` has only `dev`, `build`, `start`, and
`lint`, and this change adds none. Until one exists, `lib/terminal/` is verified by:

- `npm run lint` — clean, no warnings.
- `npm run build` — passes; the route table is unchanged apart from the `ƒ /api/terminal` handler.
- `curl` against `/api/terminal` — every content-backed command returns lines; unknown command,
  wrong arity, and session-class names are refused; a 4 KB+ body is refused with 413 and a 201+
  character line with 400; no response carries a key other than `lines` / `navigateTo`.
- Static greps — no content record, slug, or literal colour in the terminal's client chunk; no
  client API imported from `lib/terminal/`; no token added to `app/globals.css`.
- A headless Chromium walk driven over the DevTools Protocol, covering opening, focus landing and
  restoration, focus containment and its absence in the drawer, Escape from every state including
  mid-request, the breakpoint switch with the session intact, the shortcut's guards, tab completion,
  history arrows, and `open`.

The engine is deliberately pure so that adding a runner later is cheap: `lib/terminal/` imports no
React, no Next, and no `node:fs`; every `resolve` is a total function of `(argv, context)` with time
passed in rather than read; and the browser-facing half of the registry is a table of strings. The
first tests written against this module should be `parseLine` and the `COMMANDS` table.

## Judgement calls worth reviewing

Four places where the artifacts left a choice, and what was chosen:

1. **`lib/terminal/registry.ts` holds declarations, `lib/terminal/commands.ts` holds resolvers.**
   One command set is still declared exactly once. The split exists because the browser reads
   command names from the registry for tab completion: with the resolvers in the same module, the
   biography, the organisations, and the qualifications they print land in the client bundle, because
   a resolver reachable from a frozen array that `COMMAND_NAMES` derives from cannot be
   tree-shaken. `registry.ts` carries no content import, which makes "no content record ships to the
   browser" a property of the module graph instead of of a code review.

2. **Tab falls through to the platform when there is nothing to complete.** Tab is bound to command
   completion and to nothing else, and completion consumes the keystroke only when the word under
   the caret matches a declared name. An empty input or an unmatched word leaves the default alone.
   Binding Tab unconditionally would satisfy the completion requirement but make the containment
   scenarios unreachable, since focus could never leave the input to begin with.

3. **The interactive state lives in `terminal-context.tsx`, not `terminal-overlay.tsx`.** Design
   decision D5 puts the state in the overlay component, but the header's control and the overlay are
   DOM siblings, so a provider above both is structurally required; `terminal-overlay.tsx` renders
   the dialog's contents and decides nothing, and `terminal-trigger.tsx` is the thin client child.
   One client component owns all the state, which is the property D5 and task 6.1 are actually
   protecting.

4. **The trigger uses the shell's `label` type step.** The 0.85rem floor is scoped by the typography
   delta to a terminal *surface*, and the trigger is a header control, sitting on the same
   `surface` as every other header control and built from the same `buttonClasses('secondary', 'sm')`
   recipe so it is the same control everywhere. Everything inside the dialog renders at
   `--text-small`.

One behaviour is a platform limitation rather than a choice, and it is worth stating plainly: at the
headless wrap point, Tab parks on `document.body` instead of cycling, because there is no browser
chrome to cycle to. A bare `<dialog>` opened with `showModal()` and no project code reproduces it
exactly. What matters held in every case: focus never reaches a content element of the page, and the
landmarks are absent from the accessibility tree for exactly as long as the terminal covers it.