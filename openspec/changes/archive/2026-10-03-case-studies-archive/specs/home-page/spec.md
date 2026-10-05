## MODIFIED Requirements

### Requirement: Featured case studies are selected by content, not by rule

The landing page SHALL present featured case studies, and the selection and ordering SHALL be declared in the content model. The landing page SHALL NOT contain a rule that chooses which case studies are featured. The landing page's featured section SHALL NOT name engagement categories in its prose, and SHALL NOT claim that a case study it does not show is unavailable, withheld, or available on request; a case study's availability is decided by its declared publication status, not by whether the landing page happens to feature it.

#### Scenario: The owner controls which work is featured

- **WHEN** a project is marked as featured with an order in the content model
- **THEN** it appears on the landing page in that order

#### Scenario: Unmarked projects are not shown as featured

- **WHEN** a project carries no featured marker
- **THEN** it does not appear in the featured case study section, while remaining available to the content model for other uses

#### Scenario: Unfeatured projects are not silently dropped

- **WHEN** the landing page renders
- **THEN** the featured section states the number of projects available in total when that number exceeds the number shown, so an unmarked project is never invisible without explanation

#### Scenario: The featured section names no category in its prose

- **WHEN** the landing page's featured section prose is inspected
- **THEN** it names no engagement category and no category list, because the set of categories is content and a name written into a component is a second declaration of it

#### Scenario: The featured section makes no availability claim

- **WHEN** a published case study is not featured
- **THEN** the featured section does not describe it as available on request, withheld, or otherwise not shown, because it is published and reachable from the archive

#### Scenario: The featured selection points at the rest of the work

- **WHEN** the landing page shows fewer case studies than exist
- **THEN** it offers a destination to the archive where the remaining ones are listed, so an unfeatured case study is one step away rather than unmentioned
