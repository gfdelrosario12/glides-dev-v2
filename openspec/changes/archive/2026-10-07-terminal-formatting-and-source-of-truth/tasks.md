# Implementation Tasks

- [x] Standardize text wrapping in `components/terminal/terminal-ui.tsx` using `[overflow-wrap:anywhere] break-words`.
- [x] Add always-visible, restrained system identity header bar above scrollback in `components/terminal/terminal-ui.tsx`.
- [x] Refine title bar metadata in `components/terminal/embedded-terminal.tsx`.
- [x] Update opening lines / MOTD in `components/terminal/terminal-context.tsx`.
- [x] Fix command suggestions in `components/terminal/terminal-suggestions.tsx` with valid declared commands.
- [x] Remove decorative `"status": "Online"` from `components/connect/terminal-contact.tsx`.
- [x] Reorganize `lib/terminal/commands.ts`:
  - [x] Format `whoami` with aligned key-values and concise focus areas.
  - [x] Insert paragraph spacing in `about`.
  - [x] Include all published routes in `ls`.
  - [x] Display all 12 verified projects from `content/projects.csv` in `projects`.
  - [x] Group technologies by category in `skills`.
  - [x] Format `certifications` with ISO dates, credential IDs, and issuer metadata.
  - [x] Format `experience` with uniform label widths and track information.
  - [x] Format `education` with structured metadata.
  - [x] Format `contact` and `socials` with aligned destinations.
  - [x] Align `status` and `neofetch` with dynamic rule separators and verified project metrics.
  - [x] Retain honest process age in `uptime`.
- [x] Verify complete test suite (207 passing tests).
- [x] Verify ESLint (0 errors, 0 warnings).
- [x] Verify Next.js Turbopack build (24/24 static routes generated).
- [x] Update `openspec/specs/terminal/spec.md`.
- [x] Archive change documentation in `openspec/changes/archive/2026-10-07-terminal-formatting-and-source-of-truth/`.

