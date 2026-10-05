## Why

To enhance the engineering aesthetic and operational narrative of the portfolio, we are introducing a lightweight boot experience and a global system status indicator. This creates an engaging first impression of system initialization while providing real, unfabricated metrics about the site's content and application state.

## What Changes

- Add a global system status indicator (e.g., in the header) with a subtle operational pulse.
- Introduce an expandable status panel revealing true application metrics (e.g., number of case studies, credentials, load time, or content counts) rather than fabricated uptime.
- Implement a short, skippable boot sequence for first-time visitors displaying initialization messages.
- Add preferences to minimize or disable the boot sequence for returning users and ensure strict adherence to `prefers-reduced-motion`.

## Capabilities

### New Capabilities
- `system-status`: Defines the global status indicator and real metrics panel.
- `boot-sequence`: Defines the skippable first-visit initialization experience.

### Modified Capabilities
- `app-shell`: Updating to include the global system status indicator in the shell structure.

## Non-goals

- Fabricating infrastructure health, mock network latency, or fake "uptime" numbers.
- Forcing returning users or users with reduced motion to sit through the boot sequence.

## Impact

- **UI/UX**: Affects the initial load of the application (boot sequence overlay) and the persistent header/shell (status indicator).
- **State Management**: Requires local storage or cookies to track returning users to skip the boot sequence on subsequent visits.
- **Accessibility**: Strong dependency on `prefers-reduced-motion` media queries.
