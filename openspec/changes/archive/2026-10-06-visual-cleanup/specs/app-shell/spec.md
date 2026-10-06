## MODIFIED Requirements

### Requirement: The window bar icons and controls enforce strict visual constraints
The system SHALL present any window controls (e.g., close, minimize, maximize) or browser chrome icons using consistent, restrained sizing. Icons SHALL NOT be arbitrarily scaled up; they must sit within adequately sized, accessible click targets while the visual stroke and dimensions remain harmonized with the rest of the typography and borders.

#### Scenario: Verifying click target versus visual size
- **WHEN** a user interacts with a window control on a touch device
- **THEN** the tappable area is large enough for accessibility, but the icon itself remains visually small and proportionate
