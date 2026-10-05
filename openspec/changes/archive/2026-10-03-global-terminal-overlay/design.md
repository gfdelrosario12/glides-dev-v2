# Design

## Context

Two routes exist (`app/page.tsx`, `app/design-tokens/page.tsx`) and exactly one client component (`components/layout/nav-link.tsx`, needed only for `usePathname`). `PageShell` is applied once at `app/layout.tsx:36`, so it is the only place that can own something site-wide. `lib/navigation.ts:15` declares `NavItem` as `{ href, label, external? }` — every item is a destination. Content is validated and deep-frozen at `lib/content/model.ts:205` and is never sent to the browser.

Three constraints shape this design:

- **The shell is presentational.** `app-shell` requires the shell to "not contain domain vocabulary" and to render its full structure in the initial server response. The overlay therefore cannot be owned by the header, and no route may render its own.
- **Landmarks are a hard contract.** `app-shell` requires exactly one `banner`, `main`, and `contentinfo` per page, and this change must suspend their exposure while something covers them. There is no existing scrim or overlay-surface token, so this must not introduce one.
- **Client boundaries are currently per-route.** Nothing above route level is a client component. This is the first change to place one there.

`node_modules/next/dist/docs/` was consulted for the framework surface used here; no Next.js feature is central to the approach. The platform feature is, and it is native.

## Goals / Non-Goals

**Goals:**

- Make the overlay's focus behaviour, dismissal, and inertness consequences of one platform primitive rather than hand-written logic.
- Keep exactly one terminal DOM subtree and one engine, with the viewport choosing only how it is presented and whether it is modal.
- Add no dependency, no token, no primitive, and no route.

**Non-Goals, at the design level:**

- **No in-page inline terminal.** The terminal is always an overlay. There is no embedded variant on the landing page and no second mount point.
- **No focus trap written by hand.** This is the single largest source of accessibility bugs in overlay UIs and the design deliberately removes the opportunity to write one.
- **No animation beyond scroll.** The dialog is not animated in or out, at any viewport, with or without a reduced-motion preference.
- **No per-breakpoint component.** The drawer and the covering panel are one element with two presentations; there is no `TerminalDrawer` and `TerminalFullscreen`.
- **No configurable shortcut, no multiple shortcuts, no chord sequences.** One combination, one constant.
- **No test runner.** There is none in the project today (`package.json` has only `dev`, `build`, `start`, `lint`) and this change does not add one. What it does is keep the engine pure so adding one later is cheap.

## Decisions

### D1. The overlay is a native `<dialog>` opened with `showModal()`

`components/terminal/terminal-dialog.tsx` renders one `<dialog>` and opens it imperatively through a ref, because `show`/`showModal`/`close` are DOM methods with no JSX equivalent.

This single choice supplies, from the platform rather than from this codebase:

| Requirement | Supplied by |
|---|---|
| Rendered above everything, including the `z-50` sticky header | the top layer |
| Focus cannot Tab out | modal dialog focus containment |
| Escape dismisses | the `cancel` event |
| Shell landmarks and content leave the a11y tree | everything outside a modal dialog becomes **inert** |
| Modal semantics | the element itself, without hand-written `aria-modal` |

The inert consequence is the important one. It is precisely what the `app-shell` delta requires, and it is what makes the change affordable: a hand-rolled focus trap plus a hand-applied `inert` on the shell subtree is two independent pieces of state that must agree, and when they disagree the failure is a keyboard user reaching invisible content or being unable to leave. Here there is one source of truth.

**Alternatives considered.** A `role="dialog"` div with a hand-written trap: rejected — requires implementing Tab wrap, Shift+Tab wrap, focus restoration, background inertness, and Escape, which is where these bugs live. A focus-trap library: rejected on the project's zero-dependency posture, and it would still not give top-layer rendering, inertness, or `cancel`. Always-`show()` non-modal with custom everything: rejected — same hand-written surface, plus no Escape.

### D2. The viewport chooses the open mode, not the styling

The spec distinguishes two focus contracts: contained while the terminal covers the page, not contained while it does not. The platform expresses that distinction exactly:

- **At and above the small breakpoint → `showModal()`.** Modal: top layer, `::backdrop` rendered, shell inert, focus contained, `cancel` fires on Escape.
- **Below the small breakpoint → `show()`.** Non-modal: no `::backdrop`, shell not inert, header and skip link stay visible and operable, focus **not** contained.

This is why D1 does not simply always use `showModal()`: a modal drawer would make the header inert, violating the requirement that it remain reachable. Choosing the open method by `matchMedia` is what lets one element satisfy both contracts instead of compromising one.

Two consequences to handle explicitly:

- **Escape in drawer mode is not free.** `cancel` fires only for modal dialogs, so a non-modal `<dialog>` ignores Escape. A `keydown` listener handles Escape in that mode. Both paths route to one `close()` that restores focus, so there is a single dismissal path with two triggers rather than two dismissal paths.
- **Crossing the breakpoint while open.** Per spec, `showModal()` on an already-open dialog throws `InvalidStateError`. So a `matchMedia` change while open performs `close()` immediately followed by the new mode's open call, on the same element. The React component never unmounts, so history and scrollback survive the switch; the alternative — closing outright — would silently discard a session the visitor did not ask to end.

### D3. One element, two presentations, expressed in CSS

There is one `<dialog>`; a media query decides its box. Above the breakpoint it is a centred panel; below it, `margin-inline: auto 0 0 0` with `height: 100dvh` makes it a drawer pinned to the trailing edge.

`100dvh` rather than `100vh` because a mobile browser's `100vh` exceeds the visible area behind its own chrome, which would push the drawer's prompt off-screen.

This is what makes "one engine serves every presentation" structural rather than aspirational: there is one DOM subtree, one command registry, and one client component, and the viewport only changes which method opened it and how CSS boxes it.

### D4. Navigation expresses an action or a destination

`NavItem` in `lib/navigation.ts:15` becomes a discriminated union:

```ts
export type NavItem =
  | { readonly kind: 'link'; readonly href: string; readonly label: string; readonly external?: boolean }
  | { readonly kind: 'action'; readonly id: string; readonly label: string; readonly shortcut: string };
```

`site-header.tsx` renders `kind: 'link'` through the existing `NavLink` and `kind: 'action'` through `components/terminal/terminal-trigger.tsx`, which renders a `<button>`. Both the desktop `<nav>` and the mobile `<details>` disclosure render from the same `PRIMARY_NAV`, so the `app-shell` requirement that they agree needs no special case — an action simply appears in both.

`shortcut` is declared on the action rather than hardcoded in the trigger, so the accessible name that announces it and the key handler that implements it read the same declaration. An action has no `href` by construction, which is what makes "an action item carries no destination" true of the type rather than of a convention.

Alternatives considered. A sentinel `href` like `#terminal` and an interception click handler: rejected — it puts a non-destination in a field typed as a destination, and it produces an address that does nothing. A header-level trigger rendered outside the list: rejected — it would then appear in only one of the two navigations, breaking the agreement requirement.

### D5. One client component owns the overlay, its state, and the shortcut

`components/terminal/terminal-overlay.tsx` is `'use client'` and holds: open state, scrollback lines, history, history cursor, and the keydown listener. The engine is imported into it but runs on the server for content commands.

The shortcut handler must therefore live at shell level, which makes this the first client component above route level. It is kept to one file, and the header — a Server Component — merely renders `<TerminalTrigger>`, which is a thin client child. `site-header.tsx` and `site-footer.tsx` do not become client components.

The handler's guards, in order: ignore if the event target is an editable field (`input`, `textarea`, `select`, or `contenteditable`); ignore unless the platform command modifier is held; ignore if any other modifier is held; then toggle. Ignoring other modifiers is what stops `Ctrl+Shift+\`` from opening the terminal.

Because focus is in the terminal's own input almost always, the "shortcut closes as well as opens" case is reachable only when focus is on the close control or the scrollback. That is correct rather than a gap: with focus in the input, a backtick should be typed into the input, not treated as a command.

Focus restoration is tracked explicitly in state (`document.activeElement` at open time) rather than relying on the browser's return-focus behaviour, because the engine's `open` command navigates and the opener may no longer exist when the overlay closes. Restoration is skipped if the recorded element is no longer in the document, which is what prevents the "focus is stranded" failure.

### D6. The engine is a pure module with two resolution classes

`lib/terminal/registry.ts` declares commands as `{ name, arity, class, usage, summary, resolve }`, where `resolve(argv, content)` returns `readonly string[]`. Nothing in `lib/terminal/` imports React, Next, or `node:fs`; it receives `ContentModel` as an argument.

The `class` field is `'server'` for content-backed commands and `'session'` for `history` and `clear`. Session commands are resolved in the browser with no request and the server refuses those names, so the two paths cannot drift. Keeping the layer React-free is what makes "the engine imports no client API" a checkable property, and it means the layer is callable from a future non-overlay surface with no adapter.

### D7. Content commands resolve through a Route Handler

`app/api/terminal/route.ts` exports `POST`, takes `{ line }`, and returns `{ lines }` or `{ lines, navigateTo }`.

A Server Action is the wrong tool here: the framework's own guide directs non-mutation requests to a Route Handler, and a Server Action's response carries a re-rendered RSC payload for the current route — re-shipping the whole page to append lines to a scrollback. `POST` is uncached by default, so no segment config is needed.

The request is bounded: `line` is rejected above 200 characters, and the body is rejected above 4 KB, before parsing. Next.js route handlers apply no default cap, and an unauthenticated public endpoint that buffers arbitrary JSON is an amplification path with no upside.

`open` returns a navigation intent rather than calling `redirect()` — the result arrives in a fetch response, not a navigation, and `redirect()` thrown in a Route Handler produces a response the client will not follow as intended. The client then calls `router.push`, and the terminal closes. Where the case-study route is not published, the server returns the "no case study is published" outcome rather than a navigation.

### D8. No token is added; the overlay uses the layer's existing roles

Every colour, spacing step, radius, and type step resolves to something already in `app/globals.css`:

| Role | Token | Declared value |
|---|---|---|
| Dialog surface | `--color-surface-overlay` | `#22262c` — declared for the top layer, which is what a modal dialog is |
| Drawer surface (narrow) | `--color-surface-raised` | `#131519` |
| Backdrop (wide, modal only) | `--color-surface` at 80% alpha | `#0b0c0e` / 80% |
| Primary terminal text | `--color-text` | `#e8eaed` |
| Secondary and prompt glyph | `--color-text-secondary` | `#a8aeb8` |
| Annotations, arrow, secondary line | `--color-text-muted` | `#868e9a` |
| Hairline border | `--color-border` | `#262a31` |
| Focus indication, close control border | `--color-border-strong` | `#66696e` |
| Prompt glyph accent | `--color-accent` | `#ffb020` |
| Failure text | `--color-destructive` | `#f0616d` |
| Terminal type | `--text-small` | `0.875rem`, line-height 1.5 |
| Dialog radius | `--radius-md` | `6px` |

`--color-surface-overlay`'s existing comment already reads "top layer", so the dialog is the surface that token was declared for. The backdrop is `surface` at partial alpha rather than a new scrim token, because a scrim is a dimmed page surface and introducing one would be the only token this change adds.

The overlay measure is `100ch`, the character width of the mono face — self-adjusting to the rendered font and root size, and not a magic rem value tuned to one breakpoint.

### D9. Terminal type reuses the `small` step

Terminal text renders at `--text-small` (0.875rem), the smallest step clearing the 0.85rem contrast floor. The `code` step is 0.8125rem and is sized for inline code inside a line of prose. The typography delta therefore corrects the scale table's claim that `code` is for terminal content, rather than adding a `terminal` step — which keeps `app/globals.css` untouched.

Consequence: the overlay's smallest text is 14px, the same size as the page's own secondary prose, so the terminal is separated by its mono face, its surface, and its border, never by being smaller.

## Risks / Trade-offs

- **[Modal and non-modal are different code paths]** → They are not separate implementations: the same component, the same open/close functions, the same focus restoration, differing only in `showModal()` versus `show()` and one Escape listener. The `matchMedia` change handler is the part that can go wrong, and it is verified explicitly by resizing with the terminal open.
- **[Inertness is the browser's, not ours]** → `<dialog>` inertness is well-supported, but it means the `app-shell` landmark contract now depends on a platform behaviour rather than on markup we control. Mitigation: the delta states the observable requirement ("not exposed while a covering overlay is open") rather than the mechanism, so a future move off `<dialog>` is caught by the same test.
- **[The shortcut is the first shell-level client boundary]** → It ships JavaScript to every route for a control most visitors never use. Mitigation: one small component, mounted once, and the site remains fully navigable if it never loads — which the spec requires and a task verifies.
- **[A full-screen terminal is genuinely immersive, and immersive is disorienting]** → Mitigated by the drawer at narrow widths, by Escape always working from any state including mid-command, by focus returning to the opener, and by the terminal being closeable without running anything. There is no way to make it non-disorienting; making it *dismissable without cost* is the achievable goal.
- **[`open` depends on a route this change does not build]** → Recorded as a dependency, with the honest degradation specified: an unpublished slug reports that no case study exists instead of navigating.
- **[One round trip per content command]** → Accepted. Every command is read-only over data already resident in the server process. Note this holds for a long-lived Node process; a scale-to-zero host rebuilds the frozen content model per cold start, which is a property of the deployment target, not of this change.

## Migration Plan

No migration. No stored state, no persistence, no database, no route added or renamed, and nothing written by the terminal.

Deployment is a normal build. `next build` validates content and prerenders the two existing routes; the overlay is present in the shell of both and inert until opened, so neither route's output changes for a visitor who never opens it.

Rollback is a revert. Nothing persists.

Ordering constraint: `components/layout/page-shell.tsx` gains the overlay mount point and `lib/navigation.ts` gains the action item kind in the same change, because `PageShell` renders `PRIMARY_NAV` transitively through the header and a header that receives an action item it cannot render will fail.

## Open Questions

- Whether the drawer should be resizable or draggable. It would be additive — a width token and a pointer handler — and would not change the specs, the approach, or the task breakdown.
- Whether the shortcut should be suppressed during `⌘K`-style conflicts with browser or extension shortcuts. The current rule takes the platform command modifier and nothing else, which means the site wins against a same-key browser shortcut; yielding is a one-line change to the guard.