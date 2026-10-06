# Change Proposal: Separate Experience Sections

## Why

The portfolio's experiences (Professional Experience, Hackathons, and Student Organizations & Community) were previously consolidated into a single experience timeline with category filter tabs. The user explicitly requested to separate these into distinct, dedicated sections rather than a single unified timeline component.

Separating them into independent sections elevates industry/professional work (Dayforce Inc. and Sun Life), showcases competitive engineering achievements in hackathons (Diwata Overcode, TechUP, TON Hackers League, UP Socompscie), and clearly highlights community leadership (DEVCON, CyberPH, Google Developer Groups, AWS Cloud Clubs, etc.) with dedicated section titles, semantic headings, and clear visual boundaries.

## What Changes

1. **Dedicated Landing Page Sections**:
   - Replace the unified `ExperienceTimeline` on the landing page with three dedicated section components:
     - `ProfessionalExperienceSection`: Highlights industry internships (Dayforce Inc., Sun Life Global Solutions) with verified company roles, service desk & ITSM operations, and case study links.
     - `HackathonsSection`: Showcases competitive hackathons, product management, and blockchain dApp builds with project badges and case study links.
     - `OrganizationsSection`: Highlights student governance, developer community advocacy, and tech event operations (CyberPH, DEVCON, GDGC PUP, AWS Cloud Clubs, ICPEP, etc.).
   - Mount these as distinct `<MotionSection>` blocks in `app/page.tsx` with dedicated IDs and semantic headings.

2. **Background Page Alignment**:
   - In `app/background/page.tsx`, structure each category as its own distinct top-level `<section>` with clear headings (`<h2>`) and introductory context, so that visitors read each category as its own milestone.

3. **Navigation & Anchoring**:
   - Update `lib/navigation.ts` to support navigable anchors for `#professional-experience`, `#hackathons`, and `#organizations` (or `#experience`).

## Capabilities

### Modified Capabilities
- `landing-layout`: Presents Professional Experience, Hackathons, and Organizations & Community as distinct, dedicated sections on the home page.
- `background`: Renders Professional Experience, Hackathons, and Organizations as individual top-level sections with dedicated headings.

## Impact
- Affects `app/page.tsx`, `components/sections/`, `app/background/page.tsx`, and `lib/navigation.ts`.
