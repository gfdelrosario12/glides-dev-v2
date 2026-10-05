## Purpose

Provides a dedicated interface for visitors to connect, find social profiles, and reach out for collaboration.

## ADDED Requirements

### Requirement: The Connect page presents configured social and professional links
The `/connect` route SHALL present all social links declared in the content model (`socialLinks`). The presentation SHALL group or list these links clearly, and any link intended to leave the site SHALL open in a new tab.

#### Scenario: All social links are displayed
- **WHEN** a visitor navigates to `/connect`
- **THEN** every active link from the `socialLinks` collection is visible and accessible

#### Scenario: External links open safely
- **WHEN** a visitor clicks a social link that leaves the site
- **THEN** it opens in a new tab, matching existing external link behavior

### Requirement: The interface provides direct copy-email functionality
The page SHALL present the primary email address and offer a one-click action to copy it to the clipboard, providing an alternative to `mailto:` links that rely on default mail clients.

#### Scenario: User copies the email address
- **WHEN** a user triggers the "Copy Email" action
- **THEN** the primary email address is placed in their clipboard and visual feedback is briefly shown

### Requirement: A terminal-style contact interface is presented
The page SHALL include a playful terminal-style contact interface, built using the site's existing design tokens and typography, that presents contact or collaboration information in a monospaced, CLI-like format.

#### Scenario: Terminal interface renders correctly
- **WHEN** the Connect page loads
- **THEN** a terminal-style block is rendered using surface and text roles from the token layer

### Requirement: Contact data is derived from the content model
Contact destinations and links SHALL NOT be hardcoded in the UI components; they SHALL be retrieved from the server-side content model (e.g., `CONTENT.socialLinks` and `PROFILE`).

#### Scenario: Data changes require no UI updates
- **WHEN** a new social link is added to the underlying CSV/content model
- **THEN** it automatically appears on the Connect page without requiring edits to the React components
