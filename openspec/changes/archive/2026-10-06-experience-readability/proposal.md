## Why

The latest homepage implementation added experience data, improved description readability, and corrected case-study navigation directly in code. These behaviors need a recorded OpenSpec change so the archive and main specifications describe the current application.

## What Changes

- Add a homepage experience timeline sourced from the validated experience records.
- Present organization, role, track, date range, and location as a compact vertical timeline.
- Render long descriptions as readable sentence-level lists where appropriate.
- Route case-study back navigation to the homepage Projects section.

## Non-goals

- Do not replace the detailed `/background` experience timeline.
- Do not rewrite authored CSV descriptions or invent experience records.
- Do not change case-study Markdown authoring or project archive filtering.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `landing-layout`: Add the homepage experience timeline to the narrative order.
- `markdown-case-studies`: Keep case-study back navigation within the homepage Projects section.
- `home-page`: Add readable description presentation to the landing experience.

## Impact

Affected surfaces are the homepage composition, experience timeline presentation, description rendering for experience/project/case-study cards, and dynamic case-study navigation. No new dependency or backend behavior is required.
