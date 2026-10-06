## MODIFIED Requirements

### Requirement: The card family has a fixed composition contract

The card family SHALL consist of `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`. `Card` SHALL render on `surface-raised` with a 1px `border` and a radius of at most 6px. `CardTitle` SHALL render in the `title` type step and SHALL be the card's accessible name when the card is a link or a labelled region. `CardDescription` SHALL support rendering as either a paragraph element (`<p>`) or a division element (`<div>`) via an `as` prop to ensure valid HTML semantics when wrapping block-level children.

#### Scenario: Card surface is the raised role

- **WHEN** a card is rendered
- **THEN** its background is `surface-raised`, it has a 1px `border` hairline, and its radius is at most 6px

#### Scenario: Card title names the card

- **WHEN** a card is exposed as a link or a labelled region
- **THEN** its accessible name is derived from its `CardTitle`

#### Scenario: Cards do not use elevation shadows

- **WHEN** a card is rendered
- **THEN** it is distinguished from the page by surface role and border only, and carries no drop shadow

#### Scenario: Card parts are optional but ordered

- **WHEN** a card omits one or more composition parts
- **THEN** the remaining parts keep their order, and no part is rendered out of sequence

#### Scenario: CardDescription renders as div when wrapping block content

- **WHEN** `CardDescription` is invoked with `as="div"`
- **THEN** it renders a `<div>` element with identical typographical classes (`wrap-anywhere text-small text-text-secondary`) and avoids nesting `<div>` descendants inside a `<p>` tag
