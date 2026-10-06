## MODIFIED Requirements

### Requirement: Layout adopts mobile-first responsive architecture and safe-area boundaries
The page shell and header SHALL adapt gracefully across viewport widths from 320px to large screens. Safe-area padding (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) SHALL be respected so navigation and touch targets are not obscured by device notches or gestures.

#### Scenario: Viewing site on mobile screen
- **WHEN** a user navigates the site on a mobile device (320px-480px width)
- **THEN** the layout fills the viewport cleanly without horizontal overflow or clipped navigation controls

### Requirement: Mobile navigation provides accessible, touch-friendly system controls
The site header SHALL provide an intentional mobile navigation system when the viewport width is below tablet breakpoint. Navigation links SHALL have a minimum tap area of 44px by 44px, clear active states, legible numbered system indicators, and accessible keyboard dismissal.

#### Scenario: Interacting with mobile menu
- **WHEN** a user triggers the mobile navigation control
- **THEN** a structured system menu opens with touch-friendly endpoints, and dismissing it restores focus properly
