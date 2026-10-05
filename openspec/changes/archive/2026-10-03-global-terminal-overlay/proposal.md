## Why

The site's only navigation shape is a scrollable landing page whose sections are fixed. Reaching a specific project, skill, or certification means scrolling to find it, and a keyboard-first visitor has no way to move through the content by intent at all. A terminal that indexes the validated content model solves that — but only if it is available from wherever the visitor already is, in a single gesture, without costing them their place on the page. A terminal reachable only by first navigating to its own route is one link among several, which is the problem it was meant to solve.

## What Changes

- **New: a global terminal overlay.** The terminal is opened from any route and presented over the page it was opened from, rather than occupying a route of its own. This is a **breaking** change to the presentation planned in `interactive-terminal`: that change's requirement "The terminal is a page in the shell, not an overlay" is superseded by this one.
- **One terminal engine, one implementation.** The command registry, the server-resolved command execution, history, and tab completion are a single layer used by every presentation. There is no landing-page terminal and no separate overlay terminal; the engine has no presentation of its own and the overlay is its only surface.
- **A terminal action in the global navigation.** The shared navigation definition gains a terminal entry. It is an *action*, not a link: it opens the overlay rather than navigating, so the navigation definition must be able to express an item that is not a destination.
- **A global keyboard shortcut.** <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>`</kbd> opens the terminal from any route. It is suppressed while the visitor is typing in a text field or another text control.
- **Responsive presentation.** Below the small breakpoint the terminal is a drawer that leaves the header and skip link visible and reachable. At and above it, the terminal covers the viewport.
- **Focus management.** Opening moves focus to the terminal input; <kbd>Escape</kbd> always closes and returns focus to whatever opened it; focus is contained within the terminal while it covers the page; and nothing about it prevents a visitor who prefers conventional navigation from closing it and carrying on.
- **Commands resolve on the server.** Content-backed commands are dispatched to the server and return output as text lines. The client bundle carries command names and interaction code only.
- **`typography` is MODIFIED.** Its scenario "Terminal surface is a layout, not a feature" requires a terminal-shaped region to have *no interactive behavior*, written when the surface was a reserved placeholder. An interactive terminal contradicts it directly.
- **`app-shell` is MODIFIED.** It requires exactly one `banner`, one `main`, and one `contentinfo` on every page. When the terminal covers the viewport, the shell beneath it is made inert, which suspends those landmarks for as long as the terminal is open. The shell must also be able to render a navigation item that opens a control instead of following a link.

### Supersession

This change supersedes the `terminal` and `typography` capability deltas in the in-progress `interactive-terminal` change, which has no implementation (0 of 63 tasks complete). Those two deltas must not be applied. The `project-detail` capability delta in that change is **not** superseded — the per-project case-study pages are orthogonal to this one and remain live there.

`open <project>` depends on the `/projects/[slug]` route that `interactive-terminal`'s `project-detail` capability introduces. Where that route is not yet published, `open` reports that no case study is published for the requested slug rather than navigating somewhere that does not exist.

The supersession above, the `open` dependency, and how this change is verified without a test runner are recorded in [`handoff.md`](./handoff.md).

## Capabilities

### New Capabilities
- `terminal`: The terminal engine and its global overlay presentation — the closed command registry, server-resolved execution, per-load history, tab completion, focus management, keyboard shortcut, responsive presentation, and the accessibility contract for an inherently visual interface.

### Modified Capabilities
- `app-shell`: Landmarks when a covering overlay is open, and a navigation item that opens a control instead of following a link.
- `typography`: The scenario requiring a terminal surface to be non-interactive is replaced; its mono-on-`surface-inset`, background-distinguished treatment and its size-contrast floor are kept.

`content-model`, `design-tokens`, `ui-primitives`, and `home-page` are deliberately **not** modified. The change is built to satisfy them as written rather than by relaxing them — in particular no content is shipped to the browser, no primitive is added, no token is added, and the landing page gains no client leaf.

## Non-goals

- **A terminal route.** There is no `/terminal` page. The terminal is reachable from navigation and from the keyboard shortcut, and nowhere else. A direct address to a terminal is deliberately not provided, so there is no URL to share and no route to prerender.
- **Per-project case-study pages.** Those belong to `interactive-terminal`'s `project-detail` capability and are not duplicated here.
- **A replacement shell.** The terminal is presented over the shell and is dismissed by <kbd>Escape</kbd>, by its close control, or by activating a command that navigates. The header, footer, skip link, and main region are unchanged.
- **A fake filesystem.** No `mkdir`, `cat`, `cd`, pipes, redirection, globbing, or command chaining. Commands are a declared, closed set.
- **Persistence across sessions.** History is per page load. No local storage, no session storage, no server-side history.
- **Argument completion.** The shortcut completes command names only. Completing project slugs would require a content list in the client bundle, which the content contract forbids.
- **A Markdown renderer.** Terminal output is plain lines of text.
- **Writing or editing content from the terminal.** Read-only over the content model, like the rest of the site.
- **Sound, typing animation, multiple panes, or tabbed sessions.** One scrollback per overlay session, no motion beyond scroll.
- **A configurable shortcut.** The combination is declared in one constant and is not user-configurable.

## Impact

- **New files:** `components/terminal/**` (engine-facing overlay and client leaves), `app/globals.css` unchanged, `lib/terminal/**`, `app/api/terminal/route.ts`.
- **Modified:** `lib/navigation.ts` (the navigation definition gains an action item kind and a terminal entry), `components/layout/site-header.tsx` (renders the action, mounts the overlay trigger), `components/layout/page-shell.tsx` (owns the overlay mount point and the inert boundary), `app/layout.tsx` (mounts the shortcut listener).
- **Client boundary:** the overlay introduces client components in the shell rather than confined to a single route. This is the first change to place client JavaScript above the route level, and it is scoped to the overlay and its trigger — the skip link, header structure, main region, and footer stay Server Components.
- **Unchanged:** `content/*.csv`, `lib/content/**`, every file in `components/ui/`, `components/sections/**`, `app/globals.css`, `package.json`, and both existing routes.
- **Dependencies:** none added. No command parser, no shell-emulation library, no focus-trap library.
- **Server cost:** each content-backed command is one server round-trip over data already resident in the server process.