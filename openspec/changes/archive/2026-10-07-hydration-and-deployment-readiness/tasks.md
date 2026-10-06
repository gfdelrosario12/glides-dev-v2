## 1. Hydration & Semantic Markup Fixes

- [x] 1.1 Add polymorphic `as` prop to `CardDescription` in `components/ui/card.tsx` and configure `CredentialCard` to render `as="div"`.
- [x] 1.2 Refactor `ThemeToggle` in `components/layout/theme-toggle.tsx` using `useSyncExternalStore` for hydration-safe theme persistence.
- [x] 1.3 Create `useIsMounted` in `lib/hooks/use-mounted.ts` and update `MotionSection` and `ExpertiseSummary` to avoid reduced-motion hydration mismatches.
- [x] 1.4 Fix button wrapper element in `components/sections/featured-work.tsx` from `<p>` to `<div>`.
- [x] 1.5 Replace `Math.random()` in legacy CSV migration shims with deterministic row numbers in `lib/content/model.ts`.

## 2. Validation & Production Verification

- [x] 2.1 Verify complete test suite (207 tests in `node --test lib/content/*.test.ts`).
- [x] 2.2 Verify zero errors in ESLint (`npm run lint`).
- [x] 2.3 Verify complete Next.js Turbopack production build with 26 prerendered routes (`npm run build`).
- [x] 2.4 Verify production runtime HTTP responses and HTML markup tags.
- [x] 2.5 Archive change and synchronize canonical specifications.
