## Why

To monitor application traffic, page visits, performance insights, and visitor metrics on Vercel deployments, Vercel Web Analytics needs to be integrated into the application shell across all routes.

## What Changes

- Add `<Analytics />` from `@vercel/analytics/next` inside the root layout (`app/layout.tsx`).
- Ensure analytics tracking covers every route automatically without impacting server rendering or accessibility.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `app-shell`: Includes the global Vercel Web Analytics component in the root layout document structure.

## Non-goals

- Adding third-party tracking scripts outside of Vercel Analytics.
- Disrupting server-side rendering or layout landmarks.

## Impact

- `app/layout.tsx`: Renders `<Analytics />` in the root layout body.
- `openspec/specs/app-shell/spec.md`: Codifies analytics inclusion in the application shell.
