## Context

The portfolio features a dark infrastructure-engineered design system built on Next.js 16 App Router, Tailwind CSS v4, and semantic design tokens. The application requires comprehensive cross-device adaptation for mobile phones (320px–480px), tablets (768px), laptops (1024px), and desktops (1440px+).

## Goals / Non-Goals

**Goals:**
- Provide an intentional, mobile-first navigation drawer with numbered system endpoints, clean backdrop, and min 44px tap targets.
- Ensure all sections stack progressively from single-column mobile flows to multi-column desktop layouts.
- Prevent any accidental horizontal overflow across all screen sizes with `overflow-x: clip` and careful word-break handling.
- Adapt the Hero and `EmbeddedTerminal` so identity and primary actions remain visible above the fold on mobile without microscopic fonts or clipped lines.
- Ensure the standalone `/connect` networking page is instant, lightweight, and touch-optimized for QR and NFC scans.
- Respect `env(safe-area-inset-*)` and `prefers-reduced-motion`.

**Non-Goals:**
- No separate mobile sub-routes or desktop-vs-mobile duplicate components.
- No heavy third-party UI libraries or animation runtimes.

## Decisions

### 1. Site Header & Mobile Navigation Architecture
- Replace the simple `<details>/<summary>` dropdown in `components/layout/site-header.tsx` with an accessible, full-featured mobile menu overlay or sliding drawer.
- The mobile drawer will render numbered endpoints (`01 HOME`, `02 CERTIFICATIONS`, `03 PROJECTS`, `04 BACKGROUND`, `05 CONNECT`) with high touch affordance (min 44px height), subtle border separators, and system status integration.
- Include a backdrop blur, escape key dismissal, and clear close trigger.

### 2. Viewport Clamping & Layout Hygiene
- In `app/globals.css`, enforce `overflow-x: clip` on `html` and `body` while ensuring elements with code blocks or terminal scrollbacks contain their own local scrolling with `[scrollbar-width:thin]`.
- Enforce safe-area insets: `pt-[env(safe-area-inset-top)]`, `pb-[env(safe-area-inset-bottom)]`.
- Update `CONTENT_GUTTER` in `lib/layout.ts` to `px-4 sm:px-6 lg:px-8` with `max-w-wide mx-auto`.

### 3. Hero & Embedded Terminal Mobile Adaptation
- In `components/sections/hero.tsx`:
  - On mobile, render identity, role, and focus badges with clean vertical rhythm.
  - The photo container scales using `aspect-[4/3] sm:aspect-[3/4]` with `priority` loading so mobile users aren't delayed by large shifts.
  - In `components/terminal/embedded-terminal.tsx`: dynamically adjust height (`h-64 sm:h-80`) with `break-all sm:break-words` and `text-code` so terminal logs wrap neatly on 320px screens.

### 4. Infrastructure Expertise & Section Cards
- In `components/sections/expertise.tsx`:
  - On mobile screens (`<640px`), render single-column cards with vertical flow indicators (`↓`), clear level meters, and touch-friendly range sliders with accessible touch targets.
  - Languages wrap as neat token chips with sufficient hit padding.

### 5. Timeline & Projects Touch Enhancements
- In `components/sections/experience-timeline.tsx`: ensure left rail line is precisely aligned with bullet markers on narrow viewports (`pl-4 sm:pl-6`).
- In `components/sections/projects.tsx`: ensure external buttons (Live Site, Source Code) have clear touch areas (`py-2 min-h-[44px] flex items-center`) that don't clash with the primary card overlay link.

### 6. Standalone `/connect` Networking Page
- Ensure `app/connect/page.tsx` renders immediately with zero blocking layout shift.
- Mobile endpoints use prominent tap cards with `min-h-[64px]`, clear system typography, high contrast, and safe-area padding at the bottom.

## Risks / Trade-offs

- **[Risk]** Mobile navigation state desynchronization on resize.
  - **Mitigation:** Use a lightweight client state or responsive CSS classes (`hidden sm:flex` for desktop, `sm:hidden` for mobile overlay) so resizing to desktop automatically dismisses mobile state.
- **[Risk]** Nested link collision on project cards.
  - **Mitigation:** Use `z-10 relative` with `pointer-events-auto` on explicit external links while keeping card title `before:absolute before:inset-0` accessible for keyboard and touch.
