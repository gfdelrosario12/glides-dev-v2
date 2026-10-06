## 1. Landing Page Section Components

- [x] 1.1 Create `components/sections/professional-experience.tsx` for industry internships (Dayforce Inc. and Sun Life Global Solutions).
- [x] 1.2 Create `components/sections/hackathons.tsx` for hackathon projects and competitions.
- [x] 1.3 Create `components/sections/organizations.tsx` for student organizations and community leadership.
- [x] 1.4 Update `app/page.tsx` to include `ProfessionalExperienceSection`, `HackathonsSection`, and `OrganizationsSection` as distinct `<MotionSection>` blocks in document order.

## 2. Background Page Updates

- [x] 2.1 In `app/background/page.tsx`, split the experiences into three dedicated top-level `<section>` elements with their own headings and intro descriptions.

## 3. Navigation Update

- [x] 3.1 Update `lib/navigation.ts` to include navigation anchors for the new sections if appropriate.

## 4. Verification

- [x] 4.1 Run `node --test lib/content/*.test.ts` to verify content schema tests.
- [x] 4.2 Run `npm run lint` and `npm run build` to verify clean compilation.
