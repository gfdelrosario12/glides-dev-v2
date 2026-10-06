## Context

The portfolio uses Next.js 16.3.8 App Router and Tailwind CSS v4. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Provide 44x44 CSS pixels minimum touch targets for all interactive primitives via Tailwind utility classes on mobile breakpoints.
- Add horizontal scrolling command suggestions to the terminal on mobile screens.
- Enhance `next/image` usage by guaranteeing `loading="lazy"` on all below-the-fold assets.
- Suspend intensive animations when `prefers-reduced-motion` is active.

**Non-Goals:**
- No new runtime dependencies.
- No redesign of the desktop layout (only ensuring robust responsive scaling).

## Decisions

### 1. Touch Target Adjustments
- **Decision**: Update `Button` sizes (e.g., `sm` size) to ensure they have at least a `min-h-[44px]` and `min-w-[44px]` on mobile devices using Tailwind media query variants (e.g., `max-sm:min-h-[44px]`), or simply apply these constraints globally if appropriate.
- **Rationale**: Meets accessibility standards without requiring major component re-architecting.

### 2. Terminal Mobile Suggestions
- **Decision**: Create a `TerminalSuggestions` component that renders a horizontally scrollable list of frequent commands (e.g., `help`, `projects`, `clear`). This list is hidden on `sm:` and above (`max-sm:flex`).
- **Rationale**: Provides mobile users with quick actions since typing commands on mobile keyboards is tedious.

### 3. Media Optimization and Lazy Loading
- **Decision**: Audit all `<img>` tags (e.g., in Case Studies or Profile pictures) to use `next/image` where possible. For below-the-fold images, explicitly ensure `priority={false}` and `loading="lazy"`.
- **Rationale**: Leverages Next.js built-in optimizations to defer non-critical image requests.

### 4. Reduced Motion for Animations
- **Decision**: Add Tailwind's `motion-safe` variant to any continuous animation (like the pulsing dot in the `SystemStatus` component).
- **Rationale**: Native CSS media query solution requires no JavaScript logic, keeping the components server-rendered where applicable.

## Risks / Trade-offs

- [Risk] Increasing touch targets might cause layout shifts or overlaps on very narrow viewports.
  - Mitigation: Use careful flex/grid configurations and verify padding adjustments.
