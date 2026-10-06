## Why

The portfolio currently hides the interactive terminal behind a global overlay trigger. Integrating the terminal directly into the home page landing panel creates an immediate, interactive "wow" factor, allowing visitors to explore the content model (projects, skills, experience) directly through commands as soon as they land. Adding hidden easter eggs adds personality and encourages deeper engagement.

## What Changes

- Modify the home page (`app/page.tsx` or `components/sections/hero.tsx`) to render an embedded instance of the terminal component instead of just a hero image or static text.
- Create an embedded terminal component variant (or adapt the existing one) that works inline without needing the global dialog overlay context.
- Update the terminal layout in the hero section to look like a desktop terminal window.
- Add easter egg commands to `lib/terminal/registry.ts` and `lib/terminal/commands.ts` (e.g., `sudo`, `matrix`, `coffee`).
- Incorporate the newly provided headshot images (`Grad.JPG`, `Main.JPG`) in the hero section (perhaps in the `neofetch` command output, or as a visual fallback beside the terminal).

## Capabilities

### New Capabilities
- `easter-eggs`: Defines hidden, undocumented terminal commands that return fun responses.

### Modified Capabilities
- `app-shell`: The home page landing panel requires an embedded interactive terminal rather than just static hero content.
- `terminal`: The terminal must support an inline/embedded layout alongside its existing global overlay behavior.

## Non-goals

- Refactoring the entire terminal parser or API route architecture.
- Removing the global terminal overlay (the `Cmd+K` shortcut and site header button will remain intact for access from other pages).

## Impact

- **UI Components:** `components/sections/hero.tsx`, `components/terminal/*`.
- **API/Server:** Addition of easter egg commands in `lib/terminal/commands.ts`.
