# Design Decisions: Terminal Formatting and Information Presentation

## D1: Always-Visible System Identity Strip
Rather than placing decorative dashboard widgets inside the terminal, the terminal chrome renders a persistent single-line status bar above the scrollback:
- Identifies host: `gladwin.dev`
- Identifies engineer: `Gladwin Ferdz Del Rosario`
- Identifies professional direction: `Infrastructure, Cloud & Cybersecurity`
- Identifies session: `active`
This strip stays permanently visible even when the user executes `clear` or fills the scrollback buffer. It remains strictly restrained, non-intrusive, and contains zero fabricated metrics.

## D2: Word-Preserving Text Wrapping
On narrow viewports (mobile screens < 640px), previous CSS utilized `break-all`, which split normal English words across syllables (e.g., `certific-` on line 1, `ations` on line 2). The Line component was refactored to use `whitespace-pre-wrap [overflow-wrap:anywhere] break-words`, preserving natural word boundaries while still allowing ultra-long unbroken strings (e.g., long repository URLs or verification tokens) to break safely without overflowing the container horizontally.

## D3: Standardized Key-Value Alignment
All commands outputting structured records (`whoami`, `status`, `neofetch`, `education`, `experience`, `projects`, `certifications`, `contact`, `socials`) share consistent column padding (`padEnd(12)` to `padEnd(16)`). On small screens, this ensures the label does not occupy excessive width, allowing the corresponding values ample space.

## D4: Category Grouping for Skills
Rather than dumping 20+ technologies in a single vertical list, `skills` groups technologies by their declared schema categories (`Platforms & Cloud`, `Languages`, `Frameworks`, `Databases`, `Domains & Systems`), rendering readable bulleted summaries that consume fewer vertical lines in the terminal viewport.

## D5: Direct Grounding in Verified Content Sources
- `projects` displays the 12 projects from `content/projects.csv`, each categorized with live links and tech stacks.
- `certifications` surfaces exact credential IDs and expiration dates from `content/certifications.csv`.
- `uptime` explicitly disclaims measuring website availability, truthfully reporting process age.
- `terminal-contact` and `terminal-suggestions` were purged of decorative statuses and invalid command names.

