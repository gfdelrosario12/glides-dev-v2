# Change Proposal: Mobile Responsiveness and Workstation Terminal

## Summary
Comprehensive responsiveness overhaul across narrow viewports (320px–430px) ensuring all single-column layouts and cards are horizontally centered, combined with a developer-workstation Ubuntu terminal experience featuring an expanded Linux command suite, source-of-truth portfolio commands, and developer Easter eggs.

## Motivation
1. On narrow mobile viewports, components that collapsed into a single column occasionally appeared left-aligned or visually offset rather than centered.
2. The interactive terminal required authentic Linux developer workstation conventions (`pwd`, `uname`, `hostname`, `echo`, `cat`, `grep`, `exit`, etc.), clear semantic styling, and safe interactive Easter eggs, fully backed by real content model records.

## Scope
1. **Single-Column Mobile Centering**:
   - Terminal container and terminal interface
   - Hero section images and cards
   - Expertise domain cards & programming language telemetry
   - Professional experience timeline
   - Focus areas / certification cards
   - Education cards
   - Practical project cards
   - Hackathon & sprint build cards
   - Organization & community leadership cards
   - Social cards and QR band
   - Footer colophon & navigation
2. **Terminal Workstation Capabilities**:
   - Support `none | one | optional | any` argument arities
   - Linux utilities: `ls`, `pwd`, `cat`, `grep`, `echo`, `uname`, `hostname`, `date`, `uptime`
   - Session commands: `history`, `clear`, `exit`
   - Portfolio aliases: `tech` (for `skills`), `certs` (for `certifications`)
   - Developer Easter eggs: `sudo`, `apt`, `sl`, `cowsay`, `fortune`, `matrix`, `vim`, `vi`, `nano`, `rm`
   - Authentic Ubuntu terminal chrome in `EmbeddedTerminal` with colored window controls and bash version stamp
3. **Verification & Testing**:
   - Responsive verification across 320px, 360px, 375px, 390px, 414px, and 430px viewports
   - Unit tests, linting, and build type-checking

