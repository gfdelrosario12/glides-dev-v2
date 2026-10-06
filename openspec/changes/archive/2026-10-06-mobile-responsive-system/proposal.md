## Why

The portfolio's visual identity, terminal interface, and infrastructure design language must adapt naturally across all device sizes—mobile phones (320px–480px), tablets (768px), laptops (1024px), and large displays (1440px+). Rather than shrinking desktop layouts, every section requires mobile-first responsive architecture: preventing horizontal overflow, providing touch-friendly tap targets, restructuring dense diagrams and tables into clean vertical flows, ensuring legible monospace typography, and preserving full performance and accessibility.

## What Changes

- **Site Header & Navigation**: Rebuild mobile navigation with an intentional, accessible full-screen or sliding drawer menu for small screens with clear numbered system endpoints (`01 HOME`, `02 EXPERTISE`, etc.), minimum 44px touch targets, safe-area padding (`env(safe-area-inset-top)`), and smooth backdrop transitions.
- **Hero & Embedded Terminal**: Ensure Hero stacks gracefully on mobile with priority content (Identity, Role, Focus summary, Primary CTA) prominent above the fold. Optimize the `EmbeddedTerminal` height, text wrap, font sizing (`text-code`/`text-small`), and scroll container so long terminal lines wrap without causing viewport horizontal overflow.
- **Infrastructure Expertise Visualization**: Transform the expertise skillset and language inventory into an adaptive layout. On mobile devices, ensure the calibration and expertise nodes flow as connected vertical dependency nodes with legible progress indicators, clear focus labels, and touch-friendly interaction without relying on hover states.
- **Experience Timeline & Projects**: Ensure timeline cards stack chronologically with left-rail connector lines that adjust appropriately for small viewports. Adapt project cards for touch with clear, non-overlapping tap targets for Case Studies, Live Site, and Source Code links.
- **Standalone Networking (/connect)**: Ensure `/connect` functions as an instantaneous, lightweight, high-contrast mobile-first networking card optimized for QR and NFC scans, with no loading barriers, immediate tap destinations (LinkedIn, GitHub, Email), and safe-area padding.
- **Typography, Safe Areas & Global Overflow**: Add global viewport-aware layout utilities, responsive clamp typography adjustments, `overflow-x: clip`, and safe-area insets (`env(safe-area-inset-*)`) across all pages.

## Non-goals

- Do not create a separate "mobile-only" website or stripped-down alternate theme; mobile and desktop share the exact same aesthetic and system architecture.
- Do not add heavy JavaScript animation dependencies; rely on CSS Grid/Flexbox and Framer Motion with `useReducedMotion` checks.
- Do not alter the underlying CSV data models or filesystem content.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-shell`: Enforce mobile-first responsive layout, safe-area insets, accessible touch targets (min 44px), and responsive navigation drawer.
- `landing-layout`: Optimize hero, terminal, expertise, education, timeline, and projects for seamless vertical stacking and zero horizontal overflow.
- `infrastructure-expertise`: Ensure expertise metrics and nodes adapt from horizontal grid to connected vertical flow on small screens.
- `networking-endpoint`: Ensure the `/connect` standalone route has instant mobile first-paint, touch-friendly endpoint cards, and high outdoor legibility.

## Impact

Affects layout primitives (`components/layout/site-header.tsx`, `components/layout/page-shell.tsx`, `app/globals.css`, `lib/layout.ts`), landing sections (`components/sections/hero.tsx`, `components/sections/expertise.tsx`, `components/sections/experience-timeline.tsx`, `components/sections/projects.tsx`), and the standalone `/connect` page. All builds and lint checks remain strictly green.
