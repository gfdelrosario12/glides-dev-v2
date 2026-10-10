## Context

The application is deployed on Vercel and requires production observability and visitor analytics. The official `@vercel/analytics` package provides the `<Analytics />` component optimized for Next.js App Router via `@vercel/analytics/next`.

## Goals / Non-Goals

**Goals:**
- Include `<Analytics />` from `@vercel/analytics/next` in `app/layout.tsx`.
- Enable web analytics tracking across all pages and route transitions.
- Verify TypeScript types, builds, and linting pass.

**Non-Goals:**
- Injecting third-party ad tags or tracking scripts.
- Modifying DOM landmarks (`banner`, `main`, `contentinfo`).

## Decisions

### 1. Root Layout Placement
- Mount `<Analytics />` inside `<body>` alongside `<BootSequence />` and `<PageShell>`.
- Import from `@vercel/analytics/next`, which is designed specifically for Next.js App Router and automatically instruments client-side navigation.

## Risks / Trade-offs

- **[Risk] Script blocking or layout shift** → **Mitigation**: The component renders an asynchronous, non-blocking script element that does not impact Core Web Vitals or trigger layout shifts.
