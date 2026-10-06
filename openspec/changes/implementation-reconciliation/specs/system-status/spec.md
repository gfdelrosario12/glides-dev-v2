## ADDED Requirements

### Requirement: The header exposes current system status as Active
The header SHALL expose a compact status control labeled Active. Activating it SHALL reveal the site's declared operational metrics and an explicit Active state.

#### Scenario: Reading current status
- **WHEN** a visitor views the header
- **THEN** they see the word Active alongside the live status indicator

#### Scenario: Inspecting metrics
- **WHEN** a visitor opens the Active control
- **THEN** the metrics panel identifies its contents as active system metrics and ends with an ACTIVE status
