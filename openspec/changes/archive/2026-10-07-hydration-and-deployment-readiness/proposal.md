## Why

Resolve all identified React 19 / Next.js 16 hydration mismatches, invalid semantic HTML nesting errors, and client/server rendering inconsistencies across the portfolio. Prepare the application for public and live deployment with zero blocking console errors, 100% verified test coverage, clean ESLint pass, and successful production static builds.

## What Changes

- **Correct Semantic HTML Nesting in Card Primitives**: Provide an `as` polymorphic prop on `CardDescription` (`as="p" | "div"`) defaulting to `"p"`, and configure `CredentialCard` to render `<CardDescription as="div">` so that inner block-level elements (`<div>` rows for issuer, acquisition date, and credential ID) are never nested inside `<p>`, eliminating the `<div> cannot be a descendant of <p>` hydration error.
- **Synchronize Client Theme with Server Snapshot**: Re-architect `ThemeToggle` using React's official `useSyncExternalStore` subscription model to ensure the server snapshot and initial client hydration markup match identically (`dark` mode default with `Switch to light mode` aria label), updating seamlessly post-hydration without triggering `react-hooks/set-state-in-effect` or recoverable hydration tree regeneration.
- **Hydration-Safe Reduced Motion Handling**: Implement a shared `useIsMounted` hook using `useSyncExternalStore` so that `MotionSection` and `ExpertiseSummary` evaluate `reduceMotion` safely, eliminating initial render style divergence between SSR and browsers requesting reduced motion.
- **Eliminate Non-Deterministic Migration Shims**: Replace arbitrary `Math.random()` suffixes in legacy CSV fallback migration logic in `lib/content/model.ts` with deterministic row line references.
- **Production Deployment Validation**: Verify complete route coverage across all 26 static endpoints, 207 content tests, ESLint, and Next.js Turbopack production builds.

## Non-goals

- Altering established portfolio content, credentials, experiences, or project records.
- Introducing blanket suppression attributes like `suppressHydrationWarning` on arbitrary components.
- Redesigning visual themes, color tokens, or terminal interaction patterns.

## Capabilities

### Modified Capabilities
- `ui-primitives`: `CardDescription` supports `as="p" | "div"` polymorphism preserving styling while ensuring valid HTML nesting when wrapping block elements.
- `app-shell`: `ThemeToggle` maintains identical server and initial client hydration markup via `useSyncExternalStore`.
- `ui-animations`: Motion wrappers render server-consistent initial animation structures regardless of client-side reduced-motion media query states.

## Impact

- `components/ui/card.tsx`: Added `as` and `className` props to `CardDescription`.
- `components/credentials/card.tsx`: Render `CardDescription as="div"`.
- `components/layout/theme-toggle.tsx`: Refactored to `useSyncExternalStore`.
- `components/layout/motion-section.tsx`: Integrated `useIsMounted`.
- `components/sections/expertise.tsx`: Integrated `useIsMounted`.
- `components/layout/mobile-nav-drawer.tsx`: Initialized `prevPathname` with `pathname`.
- `components/sections/featured-work.tsx`: Changed outer button wrapper from `<p>` to `<div>`.
- `lib/hooks/use-mounted.ts`: Created reusable `useIsMounted` utility.
- `lib/content/model.ts`: Removed `Math.random()` from migration fallbacks.
