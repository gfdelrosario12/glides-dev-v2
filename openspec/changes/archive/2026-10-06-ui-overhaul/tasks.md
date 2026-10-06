## 1. Landing Page Layout & Stats Update

- [x] 1.1 In `app/page.tsx`, remove `<Biography />` and move `<StatisticsBand />` above `<EducationSummary />`. Check and ensure no redundant terminal overlays exist in the layout.
- [x] 1.2 In `lib/content/derive.ts`, rewrite `deriveStatistics` to calculate tech stack expertise (e.g., counting tool/skill frequency across projects and experiences).
- [x] 1.3 In `components/sections/statistics.tsx`, update the UI to display the new tech expertise stats visually instead of the old numeric counts.

## 2. Socials Section with QR Codes

- [x] 2.1 Install a QR code rendering library (e.g., `npm i qrcode.react`).
- [x] 2.2 Create `components/sections/socials.tsx` that iterates over `CONTENT.socialLinks` and displays the link along with a generated QR code.
- [x] 2.3 Add `<SocialsBand />` to `app/page.tsx`.

## 3. Markdown Case Studies & Routing

- [x] 3.1 Install a Markdown parsing library (e.g., `npm i marked` and `@types/marked`).
- [x] 3.2 Create the dynamic route `app/case-study/[slug]/page.tsx` that reads from `content/case-studies-md/[slug].md` and renders the HTML.
- [x] 3.3 Update the card components for Experiences, Certifications, and Projects to wrap the card content in a `<Link>` pointing to their respective `/case-study/[slug]` route, ensuring nested external links (like Live Site) still function correctly (using `object` or `div` layering to avoid hydration errors from nested `<a>` tags).

## 4. Animations

- [x] 4.1 Install `framer-motion`.
- [x] 4.2 Wrap the major sections in `app/page.tsx` with Framer Motion `motion.div` components utilizing `initial`, `whileInView`, and `viewport={{ once: true }}` for smooth scroll-triggered fade-up animations.

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run build` to ensure the new routes and dependencies compile successfully.
