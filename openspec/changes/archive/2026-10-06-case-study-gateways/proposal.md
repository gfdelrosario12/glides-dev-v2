## Why

Experience records already navigate to case-study routes, but the interaction is implicit and experience routes lack an explicit case-study contract. Gateway cards should make that path discoverable and consistent across the portfolio.

## What Changes

- Treat experiences, projects, credentials, and case-study cards as explicit case-study gateways.
- Reveal `Read my case study about this` on hover and focus for gateway cards.
- Derive experience case-study metadata from the experience record when no case-study record exists.

## Non-goals

- Do not author Markdown case-study content.
- Do not change the content model or add new case-study records.
- Do not replace the existing empty-content state or Projects back link.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `markdown-case-studies`: Make all portfolio gateway behavior explicit and discoverable.

## Impact

Affected components are experience, credential, project, archive cards, and the dynamic case-study metadata route. No new dependency or data source is required.
