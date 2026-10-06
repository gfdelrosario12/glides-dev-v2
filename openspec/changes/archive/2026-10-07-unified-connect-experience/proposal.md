## Why

On the `/connect` networking hub, social links and scannable QR codes were previously rendered across two disconnected sections: an "Online channels" link list and a separate "Connect & Socials" QR grid. This duplication fragmented the user experience and created redundancy. By merging these into a single, intentional Connect interface, each communication channel displays its platform icon, name, description, clickable link, and corresponding QR code together in one integrated card.

## What Changes

- **Consolidate Connect / Socials page**: Replace the separate "Online channels" list and "Connect & Socials" QR band on `/connect` with a unified card grid where each channel integrates its icon, name, short description, direct action link, and scannable QR code.
- **Explicit Link ↔ QR Relationship**: Ensure every card visibly binds the direct navigation action (`Open <Platform> ↗` or `Send Email ↗`) to its scannable QR code pointing to the exact same authoritative destination.
- **Responsive Layout**: Provide a responsive multi-column grid on desktop/tablet (2-3 columns) that collapses to a single centered column on mobile, maintaining scannable QR sizes (minimum 96px) and large touch targets without horizontal overflow.
- **Preserve Site Footer**: Maintain the existing compact footer social links for secondary site-wide navigation without alteration.
- **Preserve Authoritative Destinations**: Retain all 11 verified contact destinations from the project source of truth (LinkedIn, GitHub, Email, Facebook, Twitter/X, Discord, Instagram, Medium, YouTube, TikTok, DevSite).

## Non-goals

- Redesigning the global site footer navigation.
- Removing or hiding QR codes.
- Adding arbitrary unverified contact endpoints not present in the authoritative data source.

## Capabilities

### Modified Capabilities
- `networking-endpoint`: Merge endpoint listing and QR codes into a unified touch-and-scan interface on `/connect`, removing redundant disjoint sections.
- `social-qr-codes`: Integrate QR code rendering directly within the unified channel card alongside platform icon, metadata, and direct link action.

## Impact

- `app/connect/page.tsx`: Updated to render the unified Connect & Socials interface.
- `components/sections/socials.tsx`: Updated to provide the unified channel card component with icons, names, descriptions, action links, and QR codes.
- Specifications: Delta specs updating `openspec/specs/networking-endpoint/` and `openspec/specs/social-qr-codes/`.
