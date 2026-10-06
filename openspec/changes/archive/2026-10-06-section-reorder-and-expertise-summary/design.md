# Design Document: Section Reordering and Expertise Summary

## Implementation Details

### 1. Expertise Summary Component (`components/sections/expertise.tsx`)
- Rename heading to `Expertise Summary`.
- Export `ExpertiseSummary` (with alias `InfrastructureExpertise` for compatibility).
- Build a circular SVG gauge for programming languages:
  - Circle radius ~22px, circumference ~138.2px, strokeWidth 4px.
  - Background circle in muted border color.
  - Foreground circle with `strokeDasharray` and `strokeDashoffset` calculated from percentage (0–100).
  - Dynamic level color mapping:
    - 90–100%: Green / Emerald Accent (`text-accent`, border `border-accent/40`)
    - 80–89%: Sky / Info (`text-info`, border `border-info/40`)
    - 70–79%: Cyan / Blue (`text-cyan-400`, border `border-cyan-500/40`)
    - <70%: Amber / Warning (`text-warning`, border `border-warning/40`)
  - Center of the gauge displays the exact percentage number in monospace (`font-mono text-[11px] font-semibold text-text`).
  - Next to each gauge: language name, primary domains/use cases, and proficiency rating tag.

### 2. Practical Projects Component (`components/sections/projects.tsx`)
- Rename heading from "Additional Projects" to `Practical Projects`.
- Export `PracticalProjectsSection` (with alias `ProjectsBand` for compatibility).

### 3. Landing Page Sequence (`app/page.tsx`)
Reorder the `<MotionSection>` blocks to:
1. `Hero`
2. `ExpertiseSummary`
3. `EducationSummary`
4. `FocusAreas` (Certifications)
5. `ProfessionalExperienceSection`
6. `PracticalProjectsSection`
7. `HackathonsSection`
8. `OrganizationsSection`
9. `CallsToAction` (Let's Connect)
