## Why

The portfolio's experiences section currently groups diverse experiences across organizations, hackathons, and corporate work in a single mixed or multi-track list without clear high-level distinction between organizations, hackathons, and professional experience. Separating these three primary categories and recording the Dayforce IT Service Management internship provides clear career context for recruiters and visitors.

## What Changes

- Add `IT Service Desk Intern` at `Dayforce Inc.` (July 2026 to December 2026) to `content/experiences.csv`.
- In the Experiences presentation (both landing page `ExperienceTimeline` and `/background`), explicitly separate and present:
  1. Professional Experience (Industry internships & professional roles)
  2. Hackathons (Competitions & hackathon engineering)
  3. Student Organizations & Community (Student leadership, clubs, dev communities, and volunteering)
- Ensure tabbed or clearly separated grouped views provide seamless navigation across the three distinct experience tracks.

## Non-goals

- Do not alter other content files (projects, education, certifications).
- Do not add server-side database requirements.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `background`: Update experience classification and presentation into explicit Professional Experience, Hackathons, and Organizations & Community groupings.
- `landing-layout`: Update the landing page experience section to separate and present professional experience, hackathons, and organizations clearly.

## Impact

Affects `content/experiences.csv`, `components/sections/experience-timeline.tsx`, and `app/background/page.tsx`.
