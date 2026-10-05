## Why

The site has exactly one navigation shape: a scrollable landing page whose sections are fixed and whose only interactive leaf is the active-route marker. There is no way to reach a specific project, skill, or certification directly, and no way for a keyboard-first visitor to move through the content by intent rather than by scrolling. Separately, the seven projects exist only as a two-item featured carousel plus a count — the other five have no page, so their detail is unreachable however the visitor arrives.

A terminal is the wrong answer if it is decoration: a fake shell that types out canned text and cannot be operated is worse than no shell, because it advertises an interface it does not implement. The reason to build one here is that it can be a genuine index over content that already exists and is already validated — provided it resolves commands against the real content model rather than against hardcoded strings.

## What Changes

- **New `/projects/[slug]` route.** Each project gets a case-study page rendered from the validated content model, addressed by a declared slug. This is the destination `open <project>` resolves to, and the first per-project page on the site.
- **New `slug` and `detail` columns in `content/projects.csv`.** `slug` is the stable URL segment; `detail` is the case-study body. Both are declared and validated like every other field, so a missing slug fails the build rather than producing a dead URL.
- **New `/terminal` route.** A command interpreter over the content model: `help`, `whoami`, `about`, `ls`, `projects`, `skills`, `certifications`, `experience`, `education`, `contact`, `socials`, `status`, `neofetch`, `history`, `uptime`, `date`, `clear`, and `open <project>`.
- **Commands resolve on the server.** Every command that touches content is dispatched to the server and returns rendered output lines. The client bundle carries command names and interaction code only. This is the reason `content-model` does not change — see the design for why the cheaper alternative was rejected.
- **`typography` is MODIFIED.** Its scenario "Terminal surface is a layout, not a feature" currently requires that a terminal-shaped region have *no interactive behavior*, written when the surface was a reserved placeholder. An interactive terminal contradicts it directly. The scenario is replaced to permit interactivity while keeping the mono-on-`surface-inset`, background-distinguished treatment that requirement already mandates.
- **Terminal added to the shared navigation definition**, so the desktop header and the small-width disclosure both pick it up.
- **Landing page gains a secondary link to the terminal.** Not a primary button: the one-primary-per-view rule is unchanged, and the terminal is an alternative route rather than the page's main action.

## Capabilities

### New Capabilities
- `project-detail`: The per-project case-study page — its addressable slug, its content-backed body, and the obligations that make it a real page rather than a modal.
- `terminal`: The interactive terminal — command registry and validation, server-resolved command execution, history, tab completion, focus and cursor behaviour, scrollback, and the accessibility contract that makes an inherently visual interface operable.

### Modified Capabilities
- `typography`: The scenario "Terminal surface is a layout, not a feature" is replaced. A terminal surface is no longer required to be non-interactive; its mono-on-inset, background-distinguished treatment is unchanged.

`content-model`, `app-shell`, `ui-primitives`, `home-page`, and `design-tokens` are deliberately **not** modified. The change is built to satisfy them as written rather than by relaxing them — in particular, no content is shipped to the browser, no primitive is added, no token is added, and the landing page gains no client leaf.

## Non-goals

- **A replacement shell.** The terminal is a route, not the site's frame. The header, footer, skip link, and main region are unchanged.
- **A fake filesystem.** No `mkdir`, `cat`, `cd`, pipes, redirection, globbing, or arbitrary command chaining. Commands are a declared, closed set.
- **Persistence across sessions.** History is per page load. No local storage, no session storage, no server-side history.
- **Argument completion.** Tab completes command names only. Completing project slugs would require a content list in the bundle, which the content contract forbids.
- **A Markdown renderer for `detail`.** Case-study bodies are plain paragraphs separated by blank lines. No Markdown dependency, no inline formatting, no code fences.
- **Writing or editing content from the terminal.** Read-only over the content model, like the rest of the site.
- **Sound, typing animation, multiple panes, or tabbed sessions.** One scrollback, no motion beyond scroll.
- **A fuzzy search command.** Not requested, and it would want the content payload this change deliberately avoids.

## Impact

- **New files:** `app/terminal/page.tsx`, `app/projects/[slug]/page.tsx`, `components/terminal/**`, `components/project-detail/**`, `lib/terminal/**`, and `openspec/changes/interactive-terminal/**`.
- **Modified:** `content/projects.csv` (two columns), `lib/content/schema.ts` (declare and validate the two new fields), `lib/content/model.ts` (expose them), `lib/navigation.ts` (terminal route in the shared definition).
- **Unchanged:** `app/globals.css`, `package.json`, `package-lock.json`, `tsconfig.json`, every file in `components/ui/`, and all existing routes.
- **Client boundary:** one new client component tree under `components/terminal/`, which is the first client component in the application beyond the shell's navigation leaf. It is confined to its own route.
- **Dependencies:** none added. No command parser, no Markdown parser, no shell-emulation library.
- **Server cost:** each content-backed command is one server round-trip. Commands are read-only over data already resident in the server process.