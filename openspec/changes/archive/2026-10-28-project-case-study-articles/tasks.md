## 1. Case Study Articles Creation

- [x] 1.1 Author `vibecheck-ai-code-standards-review-assistant.md` in `content/case-studies-md/`.
- [x] 1.2 Author `arduino-day-philippines-2026-interactive-3d-activity-map.md` in `content/case-studies-md/`.
- [x] 1.3 Author `stampify-digital-id-verification-and-event-passport-system.md` in `content/case-studies-md/`.
- [x] 1.4 Author `guardian-vision-voice-activated-emergency-monitoring-system.md` in `content/case-studies-md/`.
- [x] 1.5 Author `siteguard-workforce-management-and-biometric-security-system.md` in `content/case-studies-md/`.
- [x] 1.6 Author `chem-z-chemistry-learning-management-system.md` in `content/case-studies-md/`.
- [x] 1.7 Author `etapon-iot-enabled-smart-waste-management-system.md` in `content/case-studies-md/`.
- [x] 1.8 Author `asteria-academy-student-information-system.md` in `content/case-studies-md/`.
- [x] 1.9 Author `traittechhive-technology-personality-assessment-platform.md` in `content/case-studies-md/`.
- [x] 1.10 Author `happy-endings-wedding-website-builder-platform.md` in `content/case-studies-md/`.
- [x] 1.11 Author `care-max-arduino-heart-rate-monitoring-system.md` in `content/case-studies-md/`.
- [x] 1.12 Author `portfolio-website-v1-professional-portfolio-platform.md` in `content/case-studies-md/`.

## 2. Navigation & Presentation Wiring

- [x] 2.1 Update `components/sections/projects.tsx` to link cards and titles to `/case-study/${project.slug}` while keeping external links clickable.
- [x] 2.2 Enhance `app/case-study/[slug]/page.tsx` with header tags, demonstration note, static params generation, and accessible back link.

## 3. Validation & Build

- [x] 3.1 Run `node --test lib/content/*.test.ts` to ensure no schema or relation regressions.
- [x] 3.2 Run `npm run lint`.
- [x] 3.3 Run `npm run build` and confirm all 12 project case study routes prerender cleanly.
