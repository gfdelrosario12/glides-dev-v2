## Why

The portfolio features twelve practical projects in `content/projects.csv`, but currently project cards do not link directly to written case study articles, and `content/case-studies-md/` has no corresponding Markdown articles. Visitors should be able to click any project to read a comprehensive, well-structured, realistic demonstration case study article presented in a clean editorial layout.

## What Changes

1. **Case Study Articles**: Author twelve high-quality, continuous Markdown case study articles in `content/case-studies-md/` corresponding to the twelve projects in `content/projects.csv`:
   - `vibecheck-ai-code-standards-review-assistant.md`
   - `arduino-day-philippines-2026-interactive-3d-activity-map.md`
   - `stampify-digital-id-verification-and-event-passport-system.md`
   - `guardian-vision-voice-activated-emergency-monitoring-system.md`
   - `siteguard-workforce-management-and-biometric-security-system.md`
   - `chem-z-chemistry-learning-management-system.md`
   - `etapon-iot-enabled-smart-waste-management-system.md`
   - `asteria-academy-student-information-system.md`
   - `traittechhive-technology-personality-assessment-platform.md`
   - `happy-endings-wedding-website-builder-platform.md`
   - `care-max-arduino-heart-rate-monitoring-system.md`
   - `portfolio-website-v1-professional-portfolio-platform.md`
   Each article follows a clear, narrative structure: project background, problem, objectives, approach, technologies used, implementation, challenges, results, and lessons learned, while clearly indicating simulated demonstration metrics.

2. **Project Card Interactivity**:
   - Update `components/sections/projects.tsx` so each project card / title links to `/case-study/${project.slug}`.
   - Maintain external links to Live Site and Source Code without event collision.

3. **Case Study Article Page Enhancement**:
   - Update `app/case-study/[slug]/page.tsx` with editorial typography, tags (category, tech stack), direct back links to `#projects`, responsive padding, and static generation (`generateStaticParams`).

## Capabilities

### Modified Capabilities
- `markdown-case-studies`: Extends the requirement so all projects in `content/projects.csv` link to corresponding Markdown case study articles, rendered as readable editorial narratives.

## Non-goals

- Altering the CSV schemas or breaking content parser rules.
- Turning the case studies into heavy interactive dashboards or multi-card tabbed applications.
- Changing verified facts in experiences or certifications.

## Impact

- `content/case-studies-md/*.md`: 12 new case study Markdown articles.
- `components/sections/projects.tsx`: Card title/wrapper link to `/case-study/${project.slug}`.
- `app/case-study/[slug]/page.tsx`: Enhanced editorial layout with metadata and static params.
