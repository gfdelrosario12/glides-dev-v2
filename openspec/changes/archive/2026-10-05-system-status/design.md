## Context

The portfolio uses Next.js 16.3.8 App Router and Tailwind CSS v4. Data for the portfolio is sourced from CSV files loaded dynamically on the server (e.g., `lib/content/model.ts`). To provide a compelling engineering narrative, we are adding a status indicator with an operational pulse to the application shell, alongside a lightweight, skippable boot sequence for first-time visitors (see proposal.md).

## Goals / Non-Goals

**Goals:**
- Implement a global system status indicator as a Client Component, mountable in the site header.
- Implement an expandable panel using `<details>`/`<summary>` or a similar semantic construct to reveal content-driven metrics.
- Implement an optional, skippable boot sequence overlay tracking user visits via `localStorage`.

**Non-Goals:**
- No new runtime dependencies for tracking or animations.
- No fabricated uptime (e.g., "99.99% uptime" strings).

## Decisions

### 1. Global Status Indicator & Panel
- **Decision**: Build `SystemStatus` component incorporating a pulsing dot and an expandable popover panel containing actual content metrics (e.g., `CONTENT.caseStudies.length`, `CONTENT.experiences.length`).
- **Tokens**: Use `--color-success` (`oklch(0.779 0.165 157)` from `app/globals.css`) for the operational pulse, and `--color-surface-overlay` (`oklch(0.267 0.013 258)`) for the panel surface.

### 2. Boot Sequence Tracking
- **Decision**: Use a simple `localStorage` flag (`gladwin_dev_boot_completed`) in a `useEffect` hook to determine if a user has seen the boot sequence.
- **Rationale**: The boot sequence should only run for first-time visitors or if explicitly triggered. This avoids flashing a loading screen on every navigation.

### 3. Boot Sequence Animation
- **Decision**: Use Tailwind CSS keyframes and React state to simulate a terminal printing initialization lines sequentially, wrapped in a `matchMedia('(prefers-reduced-motion: reduce)')` check.
- **Rationale**: Provides the requested "lightweight boot experience" while strictly adhering to accessibility guidelines.

## Risks / Trade-offs

- [Risk] Hydration mismatch if the server assumes the boot sequence should run but the client already has it disabled in `localStorage`.
  - Mitigation: Start the boot sequence disabled/hidden on the server, and only mount it dynamically on the client, or use a script tag to prevent flash-of-unwanted-content (FOUC). Given Next.js, we can render the main app immediately and float the boot overlay on top only if the client determines it's needed, though that may cause a slight flash. Alternatively, default to showing it but conditionally apply `display: none` via inline script, but a cleaner React way is a `useEffect` that initializes the boot state to true only if `localStorage` lacks the flag.

