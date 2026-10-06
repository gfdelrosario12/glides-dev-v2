## 1. Technical SEO & Metadata

- [x] 1.1 In `app/layout.tsx`, expand the Next.js `metadata` object to include rich Open Graph (OG) tags, Twitter card metadata, canonical URL configuration, and a generic but professional description.
- [x] 1.2 In `app/layout.tsx`, inject `<script type="application/ld+json">` for `WebSite` and `Person` structured data, deriving accurate values from `CONTENT`.
- [x] 1.3 Ensure `app/page.tsx`, `app/background/page.tsx`, `app/projects/page.tsx`, and `app/case-study/[slug]/page.tsx` each export specific `metadata` overrides (like title) tailored to their content.

## 2. Infrastructure Expertise Visualization

- [x] 2.1 Refactor `components/sections/statistics.tsx` to remove the numeric percentage grid and replace it with `InfrastructureExpertise` (a connected layout of technical domains). Use `framer-motion` for a subtle horizontal initialization sequence.
- [x] 2.2 Ensure the new layout does NOT use numeric proficiency scores, but instead labels the nodes (e.g., "Cloud", "Networking", "Security") and uses a visual loader/initialization metaphor.
- [x] 2.3 Verify `app/page.tsx` correctly imports and renders the new `InfrastructureExpertise` section, replacing the old `StatisticsBand`.

## 3. Standalone Networking Endpoint (/connect)

- [x] 3.1 Completely rewrite `app/connect/page.tsx` as a standalone, mobile-first networking endpoint optimized for QR/NFC sharing. Remove the previous `TerminalUI` component from this page entirely.
- [x] 3.2 Design the layout of `/connect` to prioritize high-contrast, large touch targets for `LinkedIn`, `GitHub`, and `Email`, explicitly labelling their intent ("Professional network", "Code / projects", "Direct contact").
- [x] 3.3 Ensure the new `/connect` route includes a subtle escape hatch (e.g., `← FULL PORTFOLIO`) back to `/`.

## 4. Window Bar & Component Consistency

- [x] 4.1 Audit `components/ui/card.tsx` (and any other components that mimic window frames/terminal headers) to enforce strict, restrained icon sizing. E.g., wrap icons in an accessible padding target (`w-8 h-8 flex items-center justify-center`) while keeping the icon itself small (e.g., `w-3 h-3`).
- [x] 4.2 Verify that the `<TerminalUI />` component is rendered ONLY in `components/sections/hero.tsx` (and potentially global command palettes if used, but absolutely not duplicated statically within page body sections).

## 5. Verification

- [x] 5.1 Run `npm run lint` to ensure no linting warnings were introduced by semantic HTML or metadata changes.
- [x] 5.2 Run `npm run build` to ensure the Next.js build is completely green.
