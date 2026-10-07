# Design Decisions: Universal Sticky Navbar & Language Telemetry Responsiveness

## 1. Universal Sticky Header & Containing-Block Architecture

### Problem
In CSS, when an element has `backdrop-filter` (such as `backdrop-blur-md` on `<header>`), it creates a containing block for `fixed` descendants. When the mobile nav drawer previously used `fixed inset-0` and `fixed inset-x-0 top-14` inside `<header>`, the backdrop and panel were constrained to the header's geometry, leading to clipping, misalignment on devices with safe area insets (`env(safe-area-inset-top)`), and issues with scrolling.

### Solution
- **Sticky Header**: Keep `<header>` as `sticky top-0 z-50 w-full border-b border-border bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur-md`.
- **Drawer Panel Placement**: Position `mobile-nav-panel` at `absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-100%)] overflow-y-auto`. Because `<header>` is the nearest positioned ancestor without intervening `relative` containers, `inset-x-0` spans the full viewport width and `top-full` begins precisely at the bottom edge of the sticky header.
- **Portaled Backdrop**: Use `createPortal(<div className="fixed inset-0 z-40 bg-surface/80 backdrop-blur-xs ... />", document.body)` with `useIsMounted`. The backdrop attaches directly to `document.body` where no `backdrop-filter` containing block exists, cleanly dimming the page beneath `<header>` (`z-50`) while capturing outside taps to close the drawer.
- **Anchor Offset**: Configure `scroll-padding-top: calc(4.5rem + env(safe-area-inset-top, 0px))` on `html` so anchor jumps (hash navigation) maintain appropriate clearance below the sticky navbar.

## 2. Programming Languages Telemetry Mobile Responsiveness

### Problem
On narrow mobile screens (320px–480px), the `Programming Languages // Telemetry Exposure` section previously suffered from:
1. Rigid flex row in the section header pushing "N tracked" out of the viewport on 320px screens.
2. `truncate` on domain and evidence strings cutting off descriptive text prematurely.
3. Vertical misalignment where `items-center` caused circular gauges to float awkwardly when adjacent text wrapped.
4. Rigid title-to-score flex containers risking collisions on narrow widths.

### Solution
- **Responsive Section Header**: Use `flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1`.
- **Card Alignment**: Align `CircularLevel` with `items-start` and `pt-0.5` at size `44px` so the gauge remains pinned to the top-left while multi-line text wraps alongside it.
- **Title and Score**: Wrap with `flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5`.
- **Prose Text Wrapping**: Replace `truncate` with `break-words` and `leading-relaxed` on both domain (`text-[11px]`) and evidence (`text-[10px]`) descriptions, ensuring complete legibility with zero overflow across 320px, 360px, 375px, 390px, 414px, 430px, and 480px widths.
