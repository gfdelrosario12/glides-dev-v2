## Why

The portfolio's current presentation feels slightly generic and repetitive, diluting the intended "interactive developer/infrastructure environment" identity. To ensure the site feels like a real engineer designed it, we must clean up redundant visual gimmicks (like multiple duplicated terminal UI components) and refine the design language. This change replaces arbitrary generic tech skill percentages with a dynamic, connected infrastructure visualization, redesigns the Connect page into a fast, standalone networking endpoint, enforces consistent interface detailing, and implements comprehensive SEO and discoverability metadata.

## What Changes

- **BREAKING**: Replace the static numerical `tech-statistics` component with an animated, sliding horizontal infrastructure loader that visually represents technical expertise without using arbitrary proficiency percentages.
- **BREAKING**: Overhaul the `/connect` route from a generic list of links into a standalone, mobile-first networking endpoint optimized for in-person QR/NFC sharing, removing the redundant terminal component previously used there.
- Ensure the terminal UI is used *exclusively* in the Hero section, treating the terminal as an overarching design language rather than a repeated UI component.
- Enforce strict, consistent sizing and optical alignment for window bar icons and controls across the interface, keeping them accessible but visually restrained (e.g., using a larger click target around a smaller icon).
- Implement robust technical SEO, semantic HTML, structured data, and distinct Open Graph metadata across all major routes, ensuring the visual experience does not hide content from search engines.

## Capabilities

### New Capabilities
- `seo-metadata`: Implement meaningful page-specific metadata, Open Graph cards, structured data, and semantic HTML for discoverability.
- `infrastructure-expertise`: An animated, sliding, horizontally connected infrastructure visualization that replaces generic numerical stats to represent technical focus areas dynamically.
- `networking-endpoint`: A standalone, mobile-first identity and connection page optimized for QR/NFC taps, replacing the generic social links page.

### Modified Capabilities
- `connect-page`: Retiring this capability (replaced by `networking-endpoint`).
- `tech-statistics`: Retiring this capability (replaced by `infrastructure-expertise`).
- `app-shell`: Updating requirements to strictly mandate consistent, restrained window bar icon sizing and visually separated click targets.
- `landing-layout`: Enforce that the terminal component is used exclusively as a single primary interaction point (in the Hero) and is not duplicated elsewhere.

## Impact

- `app/page.tsx`, `app/connect/page.tsx`, and `components/sections/statistics.tsx` will undergo major UI rewrites.
- Layout and component files (`components/ui/*`, `components/layout/*`) will be updated for precise icon sizing, window bar constraints, and semantic HTML.
- `app/layout.tsx` and all page routes will be updated to inject comprehensive Next.js metadata and structured data objects.
