## MODIFIED Requirements

### Requirement: Global keyboard shortcut toggles the terminal
The terminal SHALL be accessible from any page via a global keyboard shortcut (Cmd+K / Ctrl+K), which opens it as an overlay dialog. When explicitly embedded inline on a page, it SHALL render directly in the document flow without requiring the global overlay wrapper.

#### Scenario: Pressing the shortcut opens the overlay
- **WHEN** user presses `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- **THEN** the global terminal overlay dialog opens

#### Scenario: Embedding the terminal inline
- **WHEN** the terminal component is placed inline in a page's layout
- **THEN** it occupies the assigned layout space and accepts input without being in a dialog overlay
