## Context

The site already uses dynamic `/case-study/[slug]` routes and content-backed cards. Experience slugs are valid route identities even when a corresponding case-study Markdown file is still empty.

## Goals / Non-Goals

**Goals:**
- Make case-study navigation obvious on every relevant card.
- Keep experience metadata honest by deriving fallback title and description from the experience record.

**Non-Goals:**
- No Markdown authoring or content model changes.

## Decisions

- Use one small presentational hint shared by all gateway card types. It is hidden at rest and revealed on hover or keyboard focus, so it does not compete with the card content.
- Keep the card's existing full-surface link behavior and route destinations unchanged.
- Resolve case-study metadata from a matching case-study record first, then a matching experience record, then a neutral slug fallback.

## Risks / Trade-offs

- [Risk] Hover is unavailable on touch devices. -> Mitigation: reveal the same hint on `focus-within`, while the card link remains directly actionable.
- [Risk] Empty experience Markdown still renders a sparse page. -> Mitigation: retain the explicit empty-content state for future authoring.
