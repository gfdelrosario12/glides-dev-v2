# Change Proposal: Terminal Formatting and Source-of-Truth Data Alignment

## Why

The terminal interface formatting and output presentation required refinement to ensure visual consistency, clean information architecture, and strict adherence to the project's source-of-truth data. Unformatted data dumps, mid-word line breaking on mobile viewports, unaligned columns, and absence of persistent system identity compromised readability and authenticity.

## What Changed

1. **Persistent System Identity Header**:
   - Added an always-visible, restrained system identity strip above the scrollback in `TerminalUI` identifying the host (`gladwin.dev`), verified person (`Gladwin Ferdz Del Rosario`), role (`Infrastructure, Cloud & Cybersecurity Engineer`), and session context (`session: active`).
   - Refined `EmbeddedTerminal` window title bar with verified identity context while preserving the authentic terminal aesthetic.
   - Strictly excluded arbitrary percentages, fake CPU/RAM metrics, fabricated uptime statistics, and decorative blinking status lights.

2. **Clean Output Formatting & Visual Consistency**:
   - Standardized key-value alignment across commands with clean column padding (`padEnd(12)` to `padEnd(16)`) and colon separators.
   - Replaced fragile `break-all` wrapping with word-preserving `[overflow-wrap:anywhere] break-words` to eliminate mid-word breaks on mobile while preventing horizontal container overflow.
   - Added clean paragraph separation (`''`) between multi-paragraph prose in `about`.
   - Formatted `certifications` with ISO date tags (`[YYYY-MM]`), credential IDs, and issuer details.
   - Formatted `projects` to present all 12 verified projects from `content/projects.csv` alongside case studies.
   - Grouped `skills` by functional category (Platforms & Cloud, Languages, Frameworks, Databases, Systems) instead of dumping a flat list.
   - Updated `ls` to list all published routes (`/`, `/connect`, `/projects`, `/credentials`, `/background`, `/design-tokens`).
   - Updated `open <slug>` to accept both project slugs and case study slugs.
   - Honest, transparent `uptime` reporting clarifying process age without fabricated site availability.

3. **Source-of-Truth Synchronization**:
   - Cleaned up `terminal-suggestions.tsx` to suggest only valid declared commands (`help`, `whoami`, `projects`, `certifications`, `experience`, `clear`).
   - Cleaned up `terminal-contact.tsx` to remove decorative `"status": "Online"` and bind directly to verified contact records.

## Capabilities

### Modified Capabilities
- `terminal`: Updated specifications with authentic, restrained formatting rules, always-visible system identity requirements, and mobile text wrapping behaviors.

