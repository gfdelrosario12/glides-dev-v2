## Why

As the portfolio approaches a mature state, we need a dedicated pass to guarantee a robust, accessible, and performant experience across all devices. This change addresses mobile usability (touch targets, layout, terminal command suggestions), ensures strict accessibility compliance (focus management, semantic HTML, screen-reader output, contrast, reduced motion), and optimizes performance (lazy-loading media, avoiding heavy animations) so the site remains fast and usable for everyone.

## What Changes

- Add mobile command suggestion buttons to the interactive terminal for easier use on touch devices.
- Guarantee that all interactive primitives (buttons, links, inputs) meet a minimum touch target size (44x44px) on touch devices.
- Enforce lazy loading and optimization for all non-critical images and media assets.
- Eliminate or pause CPU-heavy continuous animations when reduced-motion is requested or when they affect initial render performance.
- Verify and harden focus management, semantic HTML, and screen-reader announcements (especially in the terminal).

## Capabilities

### New Capabilities
- `performance`: Defines global constraints for media optimization, lazy loading, and rendering performance to ensure a fast, lightweight user experience.

### Modified Capabilities
- `terminal`: Add a requirement for mobile command suggestion buttons to improve usability on touch screens.
- `ui-primitives`: Add a requirement ensuring all interactive elements meet the minimum accessible touch target size (44x44px).

## Impact

- **UI Components:** `ui-primitives` (buttons, inputs) will have adjusted padding or minimum sizes for mobile.
- **Terminal:** The terminal UI will receive a new horizontal scrolling or wrapping list of command suggestion buttons on mobile viewports.
- **Media/Images:** All `<img>` or `next/image` components will be audited for `loading="lazy"` and optimal sizing/formats.
