## MODIFIED Requirements

### Requirement: Entries are grouped by the kind of work they represent
Each experience SHALL declare which kind of work it represents, from a declared set, and
the experience timeline SHALL group entries by that declaration. An entry declaring none
SHALL still be presented, in a group that does not claim a kind for it. The experience timeline SHALL present all five declared kinds. Its introduction SHALL state the unclassified remainder rather than implying the grouping is complete.

#### Scenario: Entries sharing a kind are grouped together
- **WHEN** two experiences declare the same kind of work
- **THEN** they appear in the same group on the timeline

#### Scenario: An unclassified entry is still presented
- **WHEN** an experience declares no kind of work
- **THEN** it appears on the timeline in a group that states no kind, rather than being omitted or assigned one

#### Scenario: An undeclared kind fails the build
- **WHEN** an experience declares a kind that is not one of the declared values
- **THEN** the build fails naming the file, the record, and the offending value, and names the permitted kinds

#### Scenario: Groups appear in a declared order, not an alphabetical accident
- **WHEN** the timeline is rendered
- **THEN** its groups appear in one stated order, and that order does not change when a kind's name would sort differently

#### Scenario: The unclassified count is stated in the introduction
- **WHEN** the timeline renders groups for the declared kinds
- **THEN** the page's introduction reads the derived account to state the unclassified count, explicitly presenting the unclassified remainder rather than implying the grouping is complete
