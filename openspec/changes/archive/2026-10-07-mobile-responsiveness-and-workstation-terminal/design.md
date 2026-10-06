# Design: Mobile Responsiveness and Workstation Terminal

## Architectural Decisions

### D1: Single-Column Container Centering on Narrow Viewports
When layouts collapse from multi-column grids (`sm:grid-cols-2`, `lg:grid-cols-3`) to a single column on mobile, cards and media containers adopt `w-full max-w-xl mx-auto sm:max-w-none` (or `max-w-sm` for compact cards like QR codes). This eliminates horizontal offset while preserving left-aligned text within card bodies for natural readability.

### D2: Terminal Argument Arity Expansion
To accommodate standard Linux CLI commands without weakening input validation:
- `CommandArity = 'none' | 'one' | 'optional' | 'any'`
- Commands with strict single-argument requirements (`open <slug>`, `cat <file>`) reject missing or multiple arguments.
- Commands with optional flags (`uname [-a]`, `vim [file]`) permit zero or one argument.
- Multi-word commands (`echo <text>`, `sudo <cmd>`, `cowsay <text>`, `grep <term>`) accept arbitrary argument counts and join them cleanly.

### D3: Workstation Developer Aesthetic
- Ubuntu terminal styling: traffic lights (`bg-destructive/80`, `bg-warning/80`, `bg-success/80`), title `gladwin@workstation: ~`, environment pill `bash 5.2`.
- Semantic color layering:
  - Prompt: `gladwin@workstation:~$` on desktop (`sm+`), compact `$` on mobile.
  - Active busy pulse: amber pulsing indicator with `running command...`.
  - Output: clean monospace table alignment and category tags.

### D4: Pure Content Model Resolution
Commands like `cat` and `grep` operate purely on the server against the deep-frozen `ContentModel`, querying real project descriptions, tech stacks, experience roles, and certifications without shipping raw records to the browser.

