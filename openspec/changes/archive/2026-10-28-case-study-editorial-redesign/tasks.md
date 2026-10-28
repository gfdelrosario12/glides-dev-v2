## 1. Editorial Styling & Tokens

- [x] 1.1 Add `.article-content` editorial typography rules to `app/globals.css` with responsive font sizing, comfortable line heights, styled blockquotes, custom list markers, and styled code blocks.
- [x] 1.2 Verify dark mode and light mode contrast for `.article-content` elements.

## 2. Reading Navigation & Reader Component

- [x] 2.1 Create `components/case-study/case-study-reader.tsx` with reading progress indicator and dynamic Table of Contents.
- [x] 2.2 Update `app/case-study/[slug]/page.tsx` with custom marked renderer to assign heading IDs and extract TOC items.
- [x] 2.3 Refactor the page layout with an editorial header, quick action bar, and sticky sidebar TOC for desktop with mobile dropdown fallback.

## 3. Validation & Build

- [x] 3.1 Run unit tests `node --test lib/content/*.test.ts`.
- [x] 3.2 Run linter `npm run lint`.
- [x] 3.3 Run production build `npm run build` and verify all case study routes.
