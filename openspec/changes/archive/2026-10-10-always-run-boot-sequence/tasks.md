## 1. Implementation

- [x] 1.1 Update `components/boot-sequence.tsx` to remove `localStorage` persistence and allow the animation to display on each page load.
- [x] 1.2 Verify `SKIP SEQUENCE` closes the overlay cleanly.
- [x] 1.3 Verify `prefers-reduced-motion` suppresses the animation when requested.

## 2. Validation & Verification

- [x] 2.1 Run unit tests `node --test lib/content/*.test.ts`.
- [x] 2.2 Run linter `npm run lint`.
- [x] 2.3 Run production build `npm run build`.
