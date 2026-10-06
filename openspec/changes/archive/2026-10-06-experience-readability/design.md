## Context

The existing content model validates `experiences.csv`, project records, and case-study records. The landing page already composes server-rendered sections, and dynamic case-study pages use the App Router with filesystem Markdown.

## Goals / Non-Goals

**Goals:**
- Reuse the validated experience ordering and date formatting for the homepage timeline.
- Keep detailed background cards available while making the landing view scannable.
- Improve long-description scanning without editing source CSV prose.
- Keep case-study navigation anchored to the homepage Projects section.

**Non-Goals:**
- No new content source, dependency, or data mutation.

## Decisions

- The homepage timeline consumes the existing grouped experience model and renders a vertical rail with one node per record.
- Description readability is a presentation transformation: sentence boundaries are detected at punctuation followed by whitespace and a new sentence start; original text remains unchanged in the content model.
- Case-study return navigation uses the stable homepage Projects fragment, `/#projects`, rather than the archive route.

## Risks / Trade-offs

- [Risk] Automated sentence boundaries may not split every authored style perfectly. -> Mitigation: preserve the original text and fall back to one paragraph when no safe boundary is found.
- [Risk] The homepage timeline adds vertical length. -> Mitigation: keep each node compact and leave detailed responsibilities on `/background`.
