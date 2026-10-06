## 1. Expertise Summary Component

- [x] 1.1 In `components/sections/expertise.tsx`, rename heading to "Expertise Summary" and export `ExpertiseSummary`.
- [x] 1.2 Implement circular gauge progress indicators (0–100) for tracked programming languages with color-coded telemetry rings.

## 2. Practical Projects Component

- [x] 2.1 In `components/sections/projects.tsx`, rename "Additional Projects" to "Practical Projects" and export `PracticalProjectsSection`.

## 3. Landing Page Section Sequence

- [x] 3.1 In `app/page.tsx`, reorder sections to: Hero -> Expertise Summary -> Education -> Certifications -> Professional Experience -> Practical Projects -> Hackathons & Sprints -> Organizations & Community -> Let's Connect.

## 4. Verification

- [x] 4.1 Run `node --test lib/content/*.test.ts` to ensure content schema validation passes.
- [x] 4.2 Run `npm run lint` and `npm run build` to verify clean compilation.
