## 1. Global Layout & Viewport Resilience

- [x] 1.1 In `app/globals.css`, enforce responsive viewport safety: ensure `overflow-x: clip`, safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`), responsive font scaling clamps, and zero horizontal spill.
- [x] 1.2 In `components/layout/page-shell.tsx` and `components/layout/site-footer.tsx`, verify responsive gutters, content constraints, and touch-target padding for all navigation items.

## 2. Intentional Mobile Navigation System

- [x] 2.1 Refactor `components/layout/site-header.tsx` to provide an accessible, styled mobile menu drawer with numbered endpoints (`01 HOME`, `02 CERTIFICATIONS`, `03 PROJECTS`, `04 BACKGROUND`, `05 CONNECT`), clear touch targets (min 44px), backdrop blur, and keyboard escape handling.
- [x] 2.2 Ensure the system status badge and theme toggle adapt seamlessly in mobile viewports without colliding or wrapping unpredictably.

## 3. Hero & Embedded Terminal Mobile Adaptation

- [x] 3.1 In `components/sections/hero.tsx`, ensure the mobile layout prioritizes identity, role description, and primary CTA above the fold, with responsive image sizing (`aspect-[4/3] sm:aspect-[3/4]`) that loads cleanly on touch devices.
- [x] 3.2 In `components/terminal/embedded-terminal.tsx` and `components/terminal/terminal-ui.tsx`, adapt terminal height (`h-64 sm:h-80`), line wrapping (`break-all sm:break-words`), prompt input sizing, and touch scroll behavior so terminal commands and help output remain legible without horizontal overflow.

## 4. Section Adaptation: Expertise, Timeline, Projects & Connect

- [x] 4.1 In `components/sections/expertise.tsx`, adapt the skillset cards into a clear vertical dependency flow on mobile with high-contrast level badges and accessible slider controls.
- [x] 4.2 In `components/sections/experience-timeline.tsx`, verify timeline rail spacing, dot positioning, and card padding on mobile screens down to 320px width.
- [x] 4.3 In `components/sections/projects.tsx`, ensure project card touch targets (Case Study link, Live Site, Source Code) have independent, spacious tap areas that do not conflict on touch devices.
- [x] 4.4 In `app/connect/page.tsx`, optimize the standalone networking hub for mobile/QR/NFC visitors with large tap targets, outdoor contrast, and instant loading.

## 5. Verification & Quality Assurance

- [x] 5.1 Run `npm run lint` and verify zero lint errors across all modified components.
- [x] 5.2 Run `npm run build` to confirm production build succeeds without TypeScript or static generation errors.
