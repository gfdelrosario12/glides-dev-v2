## Context

See proposal.md - Why. We want to embed the terminal directly into the hero section, while keeping the global dialog (Cmd+K) intact.

## Goals / Non-Goals

**Goals:**
- Extract the core visual and interactive terminal (`TerminalView` or similar) from the `TerminalDialog`/`TerminalOverlay` wrapper, allowing it to be used inline.
- Place the inline terminal in `components/sections/hero.tsx`.
- Include the newly provided `Grad.JPG` or `Main.JPG` in the hero layout (e.g., alongside the bio, or in a responsive flex/grid).
- Add `sudo` and `coffee` commands to the terminal registry.

**Non-Goals:**
- Removing the global dialog overlay.

## Decisions

### 1. Terminal Component Refactoring
- **Decision**: Refactor `components/terminal/terminal-overlay.tsx`. Currently, it might tightly couple the dialog UI with the terminal interface. Extract a `TerminalUI` component that just renders the scrollback, input line, and suggestions. The `TerminalOverlay` will then just wrap `TerminalUI` in a `dialog` or framer-motion modal, while `Hero` will embed `TerminalUI` in a `div`.
- **Rationale**: Reusability without duplicating terminal state logic.

### 2. Easter Eggs
- **Decision**: Add `sudo` and `coffee` as `class: 'session'` or `class: 'server'` commands. Wait, `sudo` takes arguments, so `arity: 'one'` (or `any` if supported, otherwise just `arity: 'none'` and ignore arguments using the `parseLine` logic, or we can make it a server command). We will implement them in `lib/terminal/commands.ts`.
- **Rationale**: Follows existing terminal command patterns.

## Risks / Trade-offs

- [Risk] Having two terminal instances (inline and overlay) mounted simultaneously might cause focus fights or duplicate IDs.
  - Mitigation: Ensure `useId` or unique identifiers are used for inputs if needed, and `terminal-context` is provided globally or locally appropriately.
