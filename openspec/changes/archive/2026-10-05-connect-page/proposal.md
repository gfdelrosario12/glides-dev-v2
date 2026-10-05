## Why

The portfolio site needs a dedicated Connect page to aggregate contact methods, social presence, and collaboration availability into a single, accessible destination. This provides a clear, structured way for visitors to reach out or explore external profiles, replacing scattered or hardcoded links with a cohesive contact interface powered by the existing content model.

## What Changes

- Create a new `/connect` route with the Connect page layout and design.
- Introduce a "Copy Email" feature for frictionless communication without relying solely on `mailto:` links.
- Render the structured social links (GitHub, LinkedIn, Email, etc.) derived from the `socialLinks` collection in the content model.
- Present collaboration and availability information.
- Implement a terminal-style contact interface as a playful nod to the site's engineering theme, using the same design tokens.
- Ensure all contact destinations are read from the content model rather than being hardcoded in the UI.

## Capabilities

### New Capabilities
- `connect-page`: A dedicated page serving as the primary contact and social interface for the site.

### Modified Capabilities
- 

## Impact

- **UI/UX**: Adds a new top-level `/connect` route, expanding the site's navigation.
- **Content Model**: Exposes `CONTENT.socialLinks` to the new page, ensuring single-source-of-truth for contact details.
- **Components**: Requires new reusable components for copy-to-clipboard functionality and the terminal-style contact interface.
