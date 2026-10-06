## ADDED Requirements

### Requirement: The terminal provides mobile command suggestion buttons
To facilitate use on touch-based devices, the terminal SHALL display a list or carousel of command suggestion buttons on mobile viewports. Activating a suggestion button SHALL input and execute the command.

#### Scenario: Suggestions appear on mobile
- **WHEN** the terminal is opened on a mobile device
- **THEN** command suggestion buttons are visible and accessible

#### Scenario: Suggestion buttons execute commands
- **WHEN** a user taps a command suggestion button
- **THEN** the corresponding command is inserted and executed, and the output is appended to the region
