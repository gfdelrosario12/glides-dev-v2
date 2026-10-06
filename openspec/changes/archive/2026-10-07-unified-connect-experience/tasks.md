## 1. Unified Socials and Connect Component

- [x] 1.1 Implement platform SVG icons and unified channel card structure in `components/sections/socials.tsx` combining icon, name, description, clickable link, and scannable QR code.
- [x] 1.2 Refactor `app/connect/page.tsx` to remove the redundant "Online channels" link list and use the unified Connect & Socials section.
- [x] 1.3 Ensure responsive alignment: multi-column layout on desktop and centered cards when collapsed to a single column on mobile.

## 2. Verification and Spec Reconciliation

- [x] 2.1 Verify link routing, protocol safety, and QR code scannability across desktop and mobile form factors.
- [x] 2.2 Run content tests, linting, and production build (`node --test lib/content/*.test.ts && npm run lint && npm run build`).
- [x] 2.3 Archive the change and sync specifications in accordance with OpenSpec standards.
