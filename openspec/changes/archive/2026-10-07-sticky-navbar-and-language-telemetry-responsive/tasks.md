## 1. Universal Sticky Navbar & Mobile Drawer

- [x] 1.1 Add `w-full` to `<header>` in `components/layout/site-header.tsx`.
- [x] 1.2 Refactor `MobileNavDrawer` in `components/layout/mobile-nav-drawer.tsx` to position drawer at `top-full`, portal backdrop to `document.body`, and lock body scroll safely.
- [x] 1.3 Add global `scroll-padding-top` to `app/globals.css` for sticky navbar anchor clearance.

## 2. Programming Languages Telemetry Mobile Responsiveness

- [x] 2.1 Refactor Language Telemetry header to wrap cleanly with `flex-wrap` in `components/sections/expertise.tsx`.
- [x] 2.2 Update `CircularLevel` to size `44` with `items-start` top-alignment in `components/sections/expertise.tsx`.
- [x] 2.3 Update language card text containers with `flex-wrap` headers and `break-words` descriptions.
- [x] 2.4 Verify single-column card centering and 0px horizontal overflow across 320px–480px viewports.

## 3. Validation & OpenSpec Archival

- [x] 3.1 Verify clean ESLint pass (`npm run lint`).
- [x] 3.2 Verify content unit tests (`node --test lib/content/*.test.ts`).
- [x] 3.3 Verify Next.js production build (`npm run build`).
- [x] 3.4 Validate OpenSpec change and synchronize delta specs.
- [x] 3.5 Archive change and perform final project sync.
