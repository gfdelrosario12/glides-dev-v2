## ADDED Requirements

### Requirement: Interactive elements meet minimum touch target sizes
All interactive primitives (such as buttons, links, and inputs) SHALL provide a minimum touch target size of 44x44 CSS pixels on touch devices to ensure reliable interaction without accidental mis-taps.

#### Scenario: Mobile buttons provide sufficient tap area
- **WHEN** the site is viewed on a mobile or touch device
- **THEN** interactive elements maintain a touch target size of at least 44x44 CSS pixels, using padding or layout minimums
