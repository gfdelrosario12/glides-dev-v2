## Context

The portfolio showcases twelve practical projects across embedded systems, IoT, cloud computing, and full-stack software development. While the project summaries are featured on the homepage, in-depth technical narratives provide valuable demonstration of architectural decision-making, engineering trade-offs, and implementation details.

## Goals / Non-Goals

**Goals:**
- Provide a dedicated Markdown article for each of the 12 projects in `content/projects.csv`.
- Link each project card on the homepage to `/case-study/${project.slug}`.
- Present each case study as a continuous, elegant editorial article with readable typography, header tags, and a prominent "<- Back to projects" button.
- Prerender routes at build time using `generateStaticParams`.
- Mark hypothetical simulation metrics clearly as demonstration content.

**Non-Goals:**
- Converting case studies into interactive widget dashboards or multi-step wizards.
- Modifying project schemas or existing CSV validation tests.

## Decisions

### 1. Markdown Storage & Resolution
Store each article as `content/case-studies-md/${project.slug}.md`. In `app/case-study/[slug]/page.tsx`, resolve metadata from both `CONTENT.projects` and `CONTENT.experiences`.

### 2. Clickable Card UX
Make the project title or full card clickable via a link overlay (`before:absolute before:inset-0`) while keeping live site and source code links placed above it with `relative z-10`.

### 3. Editorial Layout
Use the design system's container tokens (`max-w-prose`, `CONTENT_GUTTER`), clear typography hierarchy, and a demonstration notice block indicating simulated demonstration data.

## Risks / Trade-offs

- **[Risk] External link clicks triggering card navigation**: Mitigate by elevating external links with `relative z-10` above the pseudo-element overlay.
