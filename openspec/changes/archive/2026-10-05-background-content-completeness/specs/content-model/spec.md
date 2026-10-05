## ADDED Requirements

### Requirement: The model declares which fields are authorable gaps
The schema SHALL declare, per collection, which fields are authorable—fields whose absence means nobody has written them, rather than a legitimate stated state. The model SHALL derive an account of which records leave an authorable field empty, and which fields are empty on every record.

#### Scenario: Authorable fields are declared in the schema
- **WHEN** the schema is inspected
- **THEN** it explicitly declares authorable fields for each collection, distinguishing them from optional fields whose absence is a legitimate stated state

#### Scenario: Gaps are derived by the model
- **WHEN** the content model is queried for unwritten content
- **THEN** it returns a derived per-collection, per-field account of which records leave an authorable field empty
