## Purpose

Defines hidden terminal commands that return fun, non-standard responses for curious visitors.

## ADDED Requirements

### Requirement: Terminal supports easter egg commands
The system SHALL provide undocumented commands that, when executed, return playful or culturally recognizable responses without navigating away or breaking the terminal session.

#### Scenario: Running the sudo command
- **WHEN** the user executes `sudo` with or without arguments
- **THEN** the terminal responds with a permission denied or playful message indicating that the user is not in the sudoers file

#### Scenario: Running the coffee command
- **WHEN** the user executes `coffee`
- **THEN** the terminal responds with a standard HTCPCP `418 I'm a teapot` reference
