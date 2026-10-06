# social-qr-codes Specification

## Purpose
Defines the presentation of social and communication channels with scannable QR codes for direct mobile camera scanning and interactive desktop navigation.
## Requirements
### Requirement: Social media links include preserved scannable QR codes
The system SHALL display the user's social media profiles and communication channels in a unified interface where each channel card directly integrates a scannable QR code alongside the platform icon, name, short description, and clickable action link. The QR codes SHALL be rendered cleanly using `QRCodeSVG` with size at least 88px, black foreground on white background, and Level M error correction.

The system SHALL preserve all existing QR code scannability and visual styling, ensuring they remain clearly visible, scannable by external device cameras, and legible across light and dark themes.

#### Scenario: Viewing social links with QR codes
- **WHEN** a visitor views the unified social section or networking hub
- **THEN** each channel card displays its platform icon, name, description, direct link affordance, and integrated scannable QR code

### Requirement: Dual interactive and scannable interaction model
Each channel card SHALL provide an unmistakable link ↔ QR relationship where both the action link and the QR code matrix point to the exact same destination. Visitors on the viewing device can click or tap the card or action link, while visitors with a secondary device can scan the QR code matrix in place.

#### Scenario: Interacting with a QR code card on desktop or mobile
- **WHEN** a visitor taps or clicks the action link or QR code
- **THEN** it navigates directly to the designated profile URL or mail client

#### Scenario: Scanning a QR code with a secondary phone
- **WHEN** an in-person contact points a phone camera at any card's QR code
- **THEN** the camera detects and opens the exact destination corresponding to the card's profile

### Requirement: Protocol-aware routing behavior
External web destinations SHALL open in a secure external browser context (`target="_blank"`, `rel="noopener noreferrer"`). Direct email links (`mailto:`) SHALL open directly in the user's default email client without triggering blank browser tabs.

#### Scenario: Clicking an email QR card
- **WHEN** a visitor clicks or taps the Email card or its QR code
- **THEN** the default email client is invoked directly without opening an empty `about:blank` browser tab

#### Scenario: Clicking an external social QR card
- **WHEN** a visitor clicks or taps any external social channel (e.g., LinkedIn, GitHub, Dev Community)
- **THEN** the destination opens safely in a new browser tab

### Requirement: Authoritative channel coverage
The QR code section SHALL present all 11 authoritative destinations in exact configured sequence:
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

#### Scenario: Displaying all authoritative channels
- **WHEN** the unified connect section renders
- **THEN** all 11 configured channels appear in configured sequence with matching destinations

