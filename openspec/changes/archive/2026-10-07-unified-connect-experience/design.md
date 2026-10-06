## Context

See `proposal.md` for motivation. Currently, `app/connect/page.tsx` renders a column of text-based link buttons followed by `<SocialsBand />` which renders another separate grid of cards with QR codes. Both read the same `CONTENT.socialLinks` array.

## Goals / Non-Goals

**Goals:**
- Provide a single unified Connect / Socials section where every channel item contains its icon, name, short description, clickable link, and scannable QR code.
- Communicate a clear 1:1 relationship between the direct link action and the QR code for in-person or cross-device scanning.
- Implement responsive multi-column layout on desktop/tablet that collapses to a centered single column on mobile.
- Use existing token values defined in `app/globals.css` (`--color-surface-raised: #131519`, `--color-surface-overlay: #22262c`, `--color-border: #262a31`, `--color-border-strong: #66696e`, `--color-accent: #ffb020`, `--color-text: #e8eaed`, `--color-text-secondary: #a8aeb8`, `--color-text-muted: #868e9a`).
- Zero new runtime dependencies (use existing `qrcode.react`).

**Non-Goals:**
- Removing or hiding QR codes.
- Redesigning the site footer or global navigation.

## Decisions

### Decision: Unified Card Component with Paired Link and QR Code
- **Choice**: Design each channel item as a cohesive card containing:
  - Header: Platform SVG icon + Platform Name + Platform badge
  - Description: Descriptive text from `endpointDetails`
  - Action link: Dedicated primary navigation button/link (`Open <Platform> ↗` or `Send Email ↗`), protocol-aware (`target="_blank"` with `rel="noopener noreferrer"` for external URLs, default client handling for `mailto:`)
  - QR Code: High-contrast scannable QR code (`QRCodeSVG`, size 96-104px, Level M, `#000000` on `#ffffff`) enclosed in a high-contrast container clearly marked with scan affordance
- **Rationale**: Keeps the link and the QR code inextricably bound so visitors immediately understand they point to the identical channel destination.
- **Alternatives considered**:
  - Popover/Modal QR code: Adds unnecessary clicks and is harder to quickly scan at in-person conferences.
  - Links without QR codes: Violates explicit requirements to retain QR codes for in-person networking.

### Decision: Responsive Grid with Single-Column Centering
- **Choice**: Use a CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`) where cards stretch gracefully, and single-column mobile views center the cards (`w-full max-w-md mx-auto`).
- **Rationale**: Satisfies the project mobile responsiveness rule requiring single-column items to be centered.

## Risks / Trade-offs

- **[Risk]**: QR code readability at smaller sizes.
  - **Mitigation**: Keep QR code size at minimum 96px with white background padding (`p-2`) and error correction level `M`, which remains easily scannable on modern smartphone cameras.
- **[Risk]**: Email protocol opening behavior.
  - **Mitigation**: Use `mailto:` without `target="_blank"` to prevent empty browser windows while allowing default email client invocation.
