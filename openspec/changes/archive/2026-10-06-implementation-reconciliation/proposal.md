## Why

Recent UI and content changes were implemented directly in the repository without a corresponding OpenSpec proposal, leaving the behavior contract out of sync with the shipped application. This reconciliation records those changes so future work has an accurate source of truth.

## What Changes

- Replace the infrastructure topology interaction with an expertise and skillset view using labeled proficiency sliders for the owner's technical fields.
- Add a persistent site-wide light/dark mode switch with semantic token overrides and preference restoration.
- Consolidate social/contact presentation into one welcoming standalone social hub, with the landing page linking to it instead of duplicating destinations.
- Route project activity to Markdown-backed case-study pages and show a quiet empty state until authored Markdown content exists.
- Remove the global terminal overlay/navigation surface so the hero remains the single terminal experience.
- Simplify empty and status copy into concise themed states and expose the system status as Active.

## Non-goals

- Do not author case-study Markdown content in this change.
- Do not alter the CSV content model or invent new social destinations.
- Do not add user accounts, server-side theme preferences, or a CMS.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `infrastructure-expertise`: Replace topology navigation with labeled expertise sliders.
- `design-tokens`: Add a user-selectable light theme while preserving semantic token roles.
- `networking-endpoint`: Make the standalone social hub welcoming and include all declared social destinations.
- `landing-layout`: Keep one connect gateway and one hero terminal; remove duplicated social and global terminal surfaces.
- `markdown-case-studies`: Keep project activity linked to filesystem-backed Markdown case-study pages with an empty authored-content state.
- `system-status`: Present the compact status control as Active.
- `home-page`: Use the Projects section as the landing-page work surface and route its primary action there.

## Impact

The affected surfaces are the root layout and CSS tokens, header and page shell, landing-page composition, expertise and social components, project/case-study routing, and system status. No new runtime dependency or backend API is required; theme preference is stored locally in the browser and case-study prose remains filesystem-authored.
