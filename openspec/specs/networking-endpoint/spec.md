## Purpose

Provides a standalone, fast, mobile-first networking page optimized for in-person sharing via QR code or NFC tap.

## Requirements

### Requirement: The networking page acts as a standalone identity endpoint
The `/connect` (or equivalent) route SHALL function independently of the main portfolio, immediately presenting a welcoming introduction, the user's name and professional identity, and every declared social endpoint without requiring prior context.

#### Scenario: Accessing via NFC tap at a conference
- **WHEN** a visitor opens the page directly via a shared link
- **THEN** they see a welcoming identity, what the user does, and how to reach them

### Requirement: Social links act as clear system endpoints
Each declared contact destination SHALL be presented as a distinct large-touch endpoint explaining its purpose, including professional network, code/projects, direct contact, or an all-in-one social destination. The UI SHALL prioritize speed, legibility, and immediate usability over elaborate animation.

#### Scenario: Navigating to a professional profile on mobile
- **WHEN** a visitor views the endpoints on a phone
- **THEN** they can tap the destination reliably and it opens immediately

#### Scenario: All declared destinations are available
- **WHEN** a social destination is added to the content model
- **THEN** it appears in the standalone social hub without a component edit

### Requirement: The interface integrates the terminal language conceptually
The page SHALL use typography, layout, and colors from the site's terminal design language to establish technical character, but SHALL NOT simply render a large, literal terminal window UI.

#### Scenario: Rendering the networking endpoint
- **WHEN** the page loads
- **THEN** it looks like an engineer's social hub without relying on a full terminal window component