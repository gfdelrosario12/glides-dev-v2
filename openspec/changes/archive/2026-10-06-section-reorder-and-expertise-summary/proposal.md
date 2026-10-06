# Change Proposal: Section Reordering and Expertise Summary

## Why
The landing page requires a refined narrative flow to best position Gladwin's capabilities: starting with technical expertise and formal education, moving into verified certifications, professional industry work, practical project implementations, hackathon sprints, student leadership, and concluding with a clear connection endpoint. Furthermore, the expertise section's language indicators should use circular gauges (0–100) to visually communicate proficiency levels, and projects should be named "Practical Projects".

## What Changes
1. **Reorder Landing Page Sections**:
   - Hero
   - Expertise Summary (renamed from Infrastructure Expertise)
   - Education
   - Certifications
   - Professional Experience
   - Practical Projects (refactored from Additional Projects)
   - Hackathons & Sprints
   - Organizations & Community
   - Let's Connect

2. **Expertise Summary Refactor**:
   - Rename `InfrastructureExpertise` section heading to `Expertise Summary`.
   - Implement circular proficiency gauges (0–100) for tracked programming languages (TypeScript, JavaScript, Java, Python, SQL, C++) with level-mapped colors and telemetry aesthetics.

3. **Practical Projects Refactor**:
   - Rename "Additional Projects" heading and component to `Practical Projects`.

## Capabilities

### Modified Capabilities
- `landing-layout`: Orders sections in the exact sequence requested.
- `infrastructure-expertise`: Renames section to Expertise Summary and adds circular progress gauges for language proficiencies.

## Impact
- Affects `app/page.tsx`, `components/sections/expertise.tsx`, and `components/sections/projects.tsx`.
