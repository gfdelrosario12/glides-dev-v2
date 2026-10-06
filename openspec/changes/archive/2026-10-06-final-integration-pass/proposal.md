## Why

As the portfolio rewrite nears completion, a final integration pass is required to ensure total fidelity to the Technical Infrastructure Editorial specifications. This change resolves lingering inconsistencies across pages (spacing, typography, colors, component behavior) and guarantees that all UI surfaces—including dynamic statistics and the terminal—are strictly bound to the unified content model rather than using hardcoded or mock data. 

## What Changes

- Audit and standardize spacing, typography, and color token usage across all routes (Home, Case Studies, Credentials, Experience, Connect) to conform with `design-tokens` and `typography` specs.
- Verify all `ui-primitives` (buttons, metadata lists, status indicators, terminal layout) render identically across pages and viewports.
- Strip any remaining obsolete portfolio UI, hardcoded legacy content, or duplicated implementations.
- Enforce the `content-model` for all statistics, ensuring dynamic counters (e.g., in the System Status pulse, Connect page, and terminal commands) accurately reflect the underlying `CONTENT` data without fabrication.

## Non-goals

- Adding new features or pages not currently specified in the architecture.
- Altering the fundamental visual design or introducing new design tokens.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None. (This pass enforces existing requirements. `.openspec.yaml` is set to `skip_specs: true`.)

## Impact

- **UI Components:** Widespread cleanup of React components to remove duplicated code and ensure token-first styling.
- **Content Integration:** Widespread hydration of hardcoded numbers/stats with `CONTENT` model references.
- **Routing/App Shell:** Minor padding and responsive layout fixes across all `app/` routes.
