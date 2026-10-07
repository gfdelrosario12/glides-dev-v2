## Why

Ensure the global navigation header remains permanently sticky across all viewports and screen sizes, including when the mobile hamburger navigation drawer is open, and resolve mobile responsiveness issues in the Programming Languages / Telemetry Exposure section on narrow screens (320px–480px).

## What Changes

- **Universal Sticky Navbar & Safe-Area Clearance**:
  - Explicitly configure `<header>` with `sticky top-0 z-50 w-full` across all screen sizes.
  - Implement `scroll-padding-top: calc(4.5rem + env(safe-area-inset-top, 0px))` on `html` in `app/globals.css` to guarantee anchor navigation never obscures section headings under the sticky header.
- **Mobile Navigation Drawer Positioning & Layering**:
  - Position the mobile navigation panel directly below the sticky header (`absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-100%)] overflow-y-auto border-b border-border bg-surface-overlay shadow-2xl`).
  - Render the backdrop via React `createPortal` to `document.body` (`fixed inset-0 z-40 bg-surface/80 backdrop-blur-xs`), avoiding `backdrop-filter` containing-block traps and guaranteeing the backdrop covers the full viewport underneath the navbar (`z-50`).
  - Safely lock body scroll on menu expansion and restore prior overflow styles on unmount/close.
  - Ensure the navbar button remains pinned and visible at the top as "Close ×" when open.
- **Programming Languages Telemetry Responsive Layout**:
  - Refactor the section header with `flex-wrap items-baseline justify-between gap-x-4 gap-y-1` to prevent text-width overflow on 320px screens.
  - Anchor `CircularLevel` with `items-start` and size `44px` with baseline offset (`pt-0.5`).
  - Allow title and score to wrap gracefully with `flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5`.
  - Replace clipping `truncate` with `break-words text-[11px]` and `break-words text-[10px]` with relaxed leading on domain and evidence texts, ensuring complete readability on narrow viewports (320px, 360px, 375px, 390px, 414px, 430px, 480px) while centering single-column cards on mobile.

## Non-goals

- Altering desktop or tablet layout behavior.
- Redesigning visual themes, tokens, or color roles.
- Changing telemetry scores or language datasets.

## Capabilities

### Modified Capabilities
- `app-shell`: Sticky navbar persists permanently across all screen sizes and viewports; mobile drawer renders beneath sticky header with portaled backdrop and scroll-padding-top anchor protection.
- `infrastructure-expertise`: Programming Languages telemetry exposure grid wraps cleanly without clipping, text truncation, or horizontal overflow across 320px–480px mobile viewports.

## Impact

- `components/layout/site-header.tsx`: Explicit `w-full` on sticky header.
- `components/layout/mobile-nav-drawer.tsx`: Portaled backdrop, top-full drawer positioning, useIsMounted hook, and body scroll lock.
- `components/sections/expertise.tsx`: Responsive flex wrapping, baseline circular gauge alignment, and wrapping domain/evidence text.
- `app/globals.css`: Global `scroll-padding-top` for sticky navbar anchor clearance.
