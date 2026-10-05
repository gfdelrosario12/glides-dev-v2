## MODIFIED Requirements

### Requirement: `open` navigates only to a published destination

The `open` command SHALL resolve its argument against the case studies the content model declares, and SHALL navigate to the matching case study only when that case study is published. The set of navigable destinations SHALL be obtained from the content model's own publication status and SHALL NOT be maintained as a list inside the terminal. An argument that matches no case study, or whose case study is not published, SHALL print an error and SHALL NOT navigate.

#### Scenario: A known published slug navigates

- **WHEN** a user enters `open <slug>` for a case study the content model declares published
- **THEN** the terminal closes and the browser navigates to that case study's address, rendering the case-study page

#### Scenario: An unknown slug does not navigate

- **WHEN** a user enters `open nonexistent`
- **THEN** the terminal prints an error naming the unmatched argument, lists the slugs that exist, and the terminal remains open on the same route

#### Scenario: An unpublished slug is reported honestly

- **WHEN** a user enters `open <slug>` for a case study the content model does not declare published
- **THEN** the terminal states that no case study is published for that slug, and does not navigate

#### Scenario: Navigation lands on a full page

- **WHEN** the terminal navigates
- **THEN** the destination is the ordinary case-study page in the shell, not a client-side view of it

#### Scenario: Publishing a case study needs no terminal edit

- **WHEN** a case study is marked published in the content
- **THEN** the terminal offers it, with no edit to the terminal's own source, because the terminal reads the content's declaration rather than holding a list

#### Scenario: Unpublishing withdraws the offer

- **WHEN** a case study that the terminal could open becomes unpublished
- **THEN** the terminal reports it as unpublished, matching what the route does with that address
