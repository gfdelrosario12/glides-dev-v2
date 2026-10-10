## MODIFIED Requirements

### Requirement: Every route inherits the same shell

The shell SHALL be applied once at the root layout, so that no route can render without it. A route SHALL NOT be able to opt out of the header, footer, or main column by omission. Furthermore, the root layout SHALL incorporate global observability and telemetry including Vercel Web Analytics (`<Analytics />`), ensuring visitor traffic and page performance metrics are captured uniformly across all application router routes.

#### Scenario: A new route inherits the shell automatically

- **WHEN** a new page is added under the application router
- **THEN** it renders inside the skip link, header, constrained main column, and footer without any additional wiring

#### Scenario: The shell cannot be bypassed

- **WHEN** any route is requested
- **THEN** the response contains the same header and footer landmarks, and exactly one main region

#### Scenario: Global analytics instrumentation is present

- **WHEN** any page renders in the root layout
- **THEN** Vercel Web Analytics tracking is mounted to capture visitor interactions and route navigation
