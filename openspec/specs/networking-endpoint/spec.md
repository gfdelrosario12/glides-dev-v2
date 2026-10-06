## Purpose

Provides a standalone, fast, mobile-first networking page optimized for in-person sharing via QR code or NFC tap.
## Requirements
### Requirement: The networking page acts as a standalone identity endpoint
The `/connect` (or equivalent) route SHALL function independently of the main portfolio, immediately presenting a welcoming introduction, the user's name and professional identity, and every declared social endpoint without requiring prior context.

#### Scenario: Accessing via NFC tap at a conference
- **WHEN** a visitor opens the page directly via a shared link
- **THEN** they see a welcoming identity, what the user does, and how to reach them

### Requirement: Social links act as clear system endpoints
Each declared contact destination SHALL be presented as a distinct interactive card combining its channel icon, name, short description, direct clickable action link, and integrated scannable QR code. The interface SHALL NOT split contact channels and QR codes into separate redundant sections. The UI SHALL prioritize speed, legibility, and immediate usability over elaborate animation.

The system SHALL support and route the authoritative channels in exact configured order:
1. LinkedIn (`https://www.linkedin.com/in/gladwindr/`)
2. GitHub (`https://github.com/gfdelrosario12`)
3. Email (`mailto:gladwin.delrosario.organizations@gmail.com`)
4. Facebook (`https://www.facebook.com/gfdelrosario0402`)
5. Twitter/X (`https://twitter.com/winontech04`)
6. Discord (`https://discord.gg/DJnbXuV7bc`)
7. Instagram (`https://www.instagram.com/glideees`)
8. Medium (`https://medium.com/@gladelrosario12`)
9. YouTube (`https://www.youtube.com/@gladwindelrosario4255`)
10. TikTok (`https://www.tiktok.com/@glideees`)
11. Dev Community (`https://dev.to/glideees`)

#### Scenario: Navigating to a professional profile on mobile
- **WHEN** a visitor views the endpoints on a phone
- **THEN** they can tap the destination reliably and it opens immediately

#### Scenario: All declared destinations are available
- **WHEN** a social destination is added or ordered in the content model
- **THEN** it appears in the standalone social hub without a component edit

### Requirement: Protocol-aware link routing and default mail handling
External web destinations SHALL open in an external context with security attributes (`target="_blank"`, `rel="noopener noreferrer"`). Non-web protocol destinations, specifically Email (`mailto:`), SHALL open directly in the user's default email client without opening blank browser tabs or leaving the current viewport.

#### Scenario: Clicking an external web link
- **WHEN** a visitor taps or clicks a web link (e.g., LinkedIn, GitHub, Dev Community)
- **THEN** the target opens in a new tab without compromising opener security

#### Scenario: Clicking the Email link
- **WHEN** a visitor taps or clicks the Email link
- **THEN** the device's default email client is launched directly without opening an empty `about:blank` browser tab

### Requirement: The interface integrates the terminal language conceptually
The page SHALL use typography, layout, and colors from the site's terminal design language to establish technical character, but SHALL NOT simply render a large, literal terminal window UI.

#### Scenario: Rendering the networking endpoint
- **WHEN** the page loads
- **THEN** it looks like an engineer's social hub without relying on a full terminal window component

### Requirement: Standalone networking page provides instant touch-first mobile access and preserved QR codes
The `/connect` route SHALL be optimized for mobile phone visitors arriving via QR code or NFC scan, presenting an integrated experience where each channel item unites direct touch navigation with an in-place scannable QR code. When collapsed to a single column on mobile, cards SHALL be centered without horizontal overflow, providing high-contrast outdoor legibility and a direct escape link back to the main portfolio.

#### Scenario: Scanning QR code or NFC tap on mobile
- **WHEN** a visitor opens `/connect` on a mobile device
- **THEN** the identity and all unified communication endpoints with integrated scannable QR codes are immediately visible and scannable without requiring navigation to a secondary section

