## Purpose

Provides a standalone, fast, mobile-first networking page optimized for in-person sharing via QR code or NFC tap.

## ADDED Requirements

### Requirement: The networking page acts as a standalone identity endpoint
The `/connect` (or equivalent) route SHALL function independently of the main portfolio, immediately presenting the user's name, professional identity, current context, and primary network endpoints (LinkedIn, GitHub, Email) without requiring prior context.

#### Scenario: Accessing via NFC tap at a conference
- **WHEN** a visitor opens the page directly via a shared link
- **THEN** they instantly see who the user is, what they do, and how to reach them

### Requirement: Social links act as clear system endpoints
Each contact destination SHALL be presented as a distinct "endpoint" explaining its purpose (e.g., "Professional network", "Code / projects"). The UI SHALL prioritize large tap targets, speed, and immediate usability over elaborate animations.

#### Scenario: Navigating to a professional profile on mobile
- **WHEN** a visitor views the endpoints on a phone
- **THEN** they can tap the destination reliably and it opens immediately

### Requirement: The interface integrates the terminal language conceptually
The page SHALL use typography, layout, and colors from the site's terminal design language to establish technical character, but SHALL NOT simply render a large, literal terminal window UI.

#### Scenario: Rendering the networking page
- **WHEN** the page loads
- **THEN** it looks like an engineer's system endpoint without relying on a full terminal window component
