## MODIFIED Requirements

### Requirement: Entries are ordered by recency with a total order
Each timeline SHALL order its entries by the end of the stated period, most recent first, and an entry whose period is still open (such as Student Volunteer at Java User Groups Philippines) SHALL be treated as more recent than every entry that has ended. Ended roles (including Dayforce IT Service Desk Intern, CyberPH Vice President for Operations, DEVCON Manila Program Manager, GDSC PUP Mobile Developer, and KakaComputer Field Ambassador) SHALL be ordered chronologically by verified completion date. Ties SHALL be broken so that the order does not depend on the order rows appear in the content file.

#### Scenario: Most recent comes first
- **WHEN** a timeline holds entries whose periods end in different years or months
- **THEN** the entry whose period ended last is presented first

#### Scenario: An open period outranks a finished one
- **WHEN** one entry's period is still open (e.g., Student Volunteer at Java User Groups PH) and another's ended
- **THEN** the entry with the open period is presented first

#### Scenario: Entries sharing a period keep a stable order
- **WHEN** two entries end in the same period
- **THEN** their relative order is decided by a stated secondary comparison rather than by their order in the content file, and it is the same on every build

#### Scenario: Reordering the content file does not reorder the timeline
- **WHEN** the rows of a timeline's content source are rearranged without changing any value
- **THEN** the timeline presents the same entries in the same order
