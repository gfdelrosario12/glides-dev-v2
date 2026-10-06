## Context

The implementation already contains a server-rendered App Router shell, CSS-first semantic tokens in `app/globals.css`, content-backed social and project records, and filesystem Markdown under `content/case-studies-md`. This reconciliation documents the current behavior without adding a new runtime dependency.

## Goals / Non-Goals

**Goals:**
- Keep expertise levels readable, labeled, and connected to the existing focus-area content.
- Make light/dark mode global, persistent, and semantic-token driven.
- Keep `/connect` as the single welcoming social hub and keep the landing page concise.
- Ensure empty Markdown case studies are honest and ready for future authoring.

**Non-Goals:**
- No case-study prose authoring, CMS, authentication, or server-side preference storage.
- No new color library or component library.

## Decisions

- Expertise levels remain presentation data in `components/sections/expertise.tsx`, with the field names and summaries supplied by the validated content model. The visible values are explicit editorial levels rather than derived record counts.
- Theme state is applied through `data-theme` on `<html>` and persisted under the `gladwin-theme` local-storage key. The semantic roles remain defined in `app/globals.css`: dark defaults include `surface #0b0c0e`, `surface-raised #131519`, `surface-inset #1a1d22`, and `surface-overlay #22262c`; light overrides use `surface #f4f1e8`, `surface-raised #fffdf7`, `surface-inset #e9e5da`, and `surface-overlay #ffffff`.
- The theme control lives in `components/layout/theme-toggle.tsx` and is mounted by `components/layout/site-header.tsx`, so every route receives the same control through the root shell.
- Project routes use `/case-study/[slug]`; the route reads `content/case-studies-md/<slug>.md` and renders `Empty / content pending` when the file is absent or blank.
- The hero is the only terminal presentation. The global terminal provider, overlay, and navigation action are not mounted by the shell.

## Risks / Trade-offs

- [Risk] Explicit expertise levels can become stale as experience changes. -> Mitigation: keep them in one small map beside the presentation and review them when content changes.
- [Risk] Local storage is unavailable or blocked in some browsers. -> Mitigation: default to dark mode and guard storage access; the UI remains usable without persistence.
- [Risk] A missing Markdown file can make a project page feel sparse. -> Mitigation: use a deliberate empty state instead of fabricated content, making the authoring boundary visible.
