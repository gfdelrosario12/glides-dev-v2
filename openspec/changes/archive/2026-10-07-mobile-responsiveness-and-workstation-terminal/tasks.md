# Tasks: Mobile Responsiveness and Workstation Terminal

- [x] 1. Expand `CommandArity` to `'none' | 'one' | 'optional' | 'any'` in `lib/terminal/types.ts`.
- [x] 2. Declare Linux utilities, aliases, and Easter eggs in `lib/terminal/registry.ts`.
- [x] 3. Implement resolvers in `lib/terminal/commands.ts` for `pwd`, `cat`, `grep`, `echo`, `uname`, `hostname`, `tech`, `certs`, `sudo`, `apt`, `sl`, `cowsay`, `fortune`, `matrix`, `vim`, `nano`, and `rm`.
- [x] 4. Update route handling in `app/api/terminal/route.ts` to split arguments by whitespace and pass `argv`.
- [x] 5. Add browser session handling for `exit` in `components/terminal/terminal-context.tsx`.
- [x] 6. Upgrade `EmbeddedTerminal` chrome in `components/terminal/embedded-terminal.tsx` with authentic Ubuntu workstation styling.
- [x] 7. Refine `TerminalUI` in `components/terminal/terminal-ui.tsx` with responsive prompt (`gladwin@workstation:~$` / `$`) and animated command-execution state.
- [x] 8. Center single-column components on mobile across `hero.tsx`, `expertise.tsx`, `projects.tsx`, `professional-experience.tsx`, `focus-areas.tsx`, `education-summary.tsx`, `hackathons.tsx`, `organizations.tsx`, `socials.tsx`, and `terminal-contact.tsx`.
- [x] 9. Center footer colophon and navigation on mobile viewports.
- [x] 10. Verify automated tests (`node --test lib/content/*.test.ts`), `npm run lint`, and `npm run build`.
- [x] 11. Archive change and document in OpenSpec.

