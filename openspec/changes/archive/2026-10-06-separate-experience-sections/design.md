# Design Document: Separate Experience Sections

## Architectural Overview

Instead of consolidating all experiences under a single timeline component with interactive filter tabs, the user requested that the portfolio clearly separates them into three independent sections.

### 1. Landing Page Modularization
Create three dedicated, fully server-rendered section components:
- `ProfessionalExperienceSection`:
  - Target ID: `professional-experience`
  - Subtitle: `Industry Operations // Enterprise IT & Support`
  - Heading: `Professional Experience`
  - Shows industry internships:
    - Dayforce Inc. — IT Service Desk Intern (July 2026 – December 2026)
    - Sun Life Global Solutions — IT Service Management Intern (2nd Semester) (March 2025 – May 2025)
    - Sun Life Global Solutions — IT Service Management Intern (1st Semester) (July 2024 – September 2025)
  - Features enterprise service tags, timeline node accentuation, case study links.
- `HackathonsSection`:
  - Target ID: `hackathons`
  - Subtitle: `Sprint Engineering // Competitions & Builds`
  - Heading: `Hackathons & Competitions`
  - Shows competitive hackathon projects:
    - UP Socompscie - HACKathon 2024
    - TON Society - Manila Bootcamp: Hackers League Hackathon
    - Phildev Inter-university TechUP Hackathon
    - Diwata Overcode - GDSC Loyola's Hackfest 2024
  - Features competition badge labels, tech stack tags, case study links.
- `OrganizationsSection`:
  - Target ID: `organizations`
  - Subtitle: `Community Leadership // Student Governance & Operations`
  - Heading: `Organizations & Community Leadership`
  - Shows developer communities, leadership, and volunteer roles:
    - CyberPH, ICPEP SE, DEVCON, Arduino Day, GDGC PUP, GDSC PUP, AWS Cloud Clubs, PUP MSC, Java User Groups, KakaComputer, The Programmer's Guild, TedxUPV.
  - Clean collapsible or structured chronological grid/timeline with role badges, organizations, dates, and case study links.

### 2. Zero Client Bundle Impact
All three components are written as pure Server Components (`async` or standard functions) importing directly from `@/lib/content/model`. This avoids any Turbopack client bundle `node:fs` bundling issues and ensures instant SSR with zero hydration lag.

### 3. Background Page Section Separation
In `app/background/page.tsx`, replace the single enclosing `<section aria-labelledby="experience-heading">` containing three sub-groups with three top-level semantic `<section>` blocks:
- `<section id="professional-experience" aria-labelledby="professional-heading">`
- `<section id="hackathons" aria-labelledby="hackathons-heading">`
- `<section id="organizations" aria-labelledby="organizations-heading">`
Followed by the Education section:
- `<section id="education" aria-labelledby="education-heading">`
