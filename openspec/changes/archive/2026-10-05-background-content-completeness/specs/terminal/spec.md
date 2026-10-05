## ADDED Requirements

### Requirement: The terminal reports unwritten authorable content
The terminal SHALL declare a `gaps` command that reports the model's account of unwritten authorable content. The command SHALL report each authorable field, how many records leave it empty, and which records.

#### Scenario: The gaps command reports missing authorable content
- **WHEN** a user executes `gaps`
- **THEN** the output lists each authorable field, how many records omit it, and the identifiers of those records

#### Scenario: Gaps are resolved on the server
- **WHEN** the `gaps` command is executed
- **THEN** the report is resolved on the server using the model's derivation, so no content value or record enters a client bundle to compute the report

#### Scenario: Unpublishable case studies block the caseStudies field
- **WHEN** a case study is in draft and unpublished
- **THEN** the `gaps` command reports that the `caseStudies` field on experiences and certifications cannot be filled before case studies are published, and reports each case study's prose completion
