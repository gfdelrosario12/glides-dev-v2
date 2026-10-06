## MODIFIED Requirements

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

### Requirement: Standalone networking page provides instant touch-first mobile access and preserved QR codes
The `/connect` route SHALL be optimized for mobile phone visitors arriving via QR code or NFC scan, presenting an integrated experience where each channel item unites direct touch navigation with an in-place scannable QR code. When collapsed to a single column on mobile, cards SHALL be centered without horizontal overflow, providing high-contrast outdoor legibility and a direct escape link back to the main portfolio.

#### Scenario: Scanning QR code or NFC tap on mobile
- **WHEN** a visitor opens `/connect` on a mobile device
- **THEN** the identity and all unified communication endpoints with integrated scannable QR codes are immediately visible and scannable without requiring navigation to a secondary section
