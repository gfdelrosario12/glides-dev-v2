/**
 * The terminal's declared command set.
 *
 * Metadata only: every command's name, arity, resolution class, usage, and
 * summary, each declared exactly once. The resolvers that satisfy those
 * declarations live in `commands.ts`.
 *
 * The split is what keeps content out of the client bundle. The browser reads
 * `COMMAND_NAMES` from here for tab completion, so this module sits in the
 * client graph. If the resolvers were here too, importing them would pull
 * `content/site.ts` — the biography, the organisations, the qualifications — into
 * that bundle with them, because a resolver reachable from a frozen array that
 * `COMMAND_NAMES` derives from cannot be tree-shaken away. Keeping declarations
 * and implementations in separate modules makes "no content record ships to the
 * browser" a property of the module graph rather than of a code review, and it
 * is the reason this file carries no content import of any kind. Do not add one.
 *
 * Nothing here imports React, Next, or `node:fs`. See design decision D6.
 */

import type { CommandDeclaration } from './types';

/**
 * The single declared command set.
 *
 * Frozen, and in one order, because `help` prints it in this order and tab
 * completion matches against it: two orders would be two answers to "what can I
 * type". Session commands are declared here alongside the server ones, so the
 * set a visitor sees in `help` is the set they can actually complete, and the
 * command set stays in one place rather than being split by resolution class.
 */
export const DECLARED_COMMANDS: readonly CommandDeclaration[] = Object.freeze([
  {
    name: 'help',
    arity: 'none',
    class: 'server',
    usage: 'help',
    summary: 'This list.',
  },
  {
    name: 'whoami',
    arity: 'none',
    class: 'server',
    usage: 'whoami',
    summary: 'Name, role, and one-line summary.',
  },
  {
    name: 'about',
    arity: 'none',
    class: 'server',
    usage: 'about',
    summary: 'The biography in full.',
  },
  {
    name: 'ls',
    arity: 'none',
    class: 'server',
    usage: 'ls',
    summary: 'Sections and destinations on this site.',
  },
  {
    name: 'projects',
    arity: 'none',
    class: 'server',
    usage: 'projects',
    summary: 'Every recorded project with its category and destinations.',
  },
  {
    name: 'open',
    arity: 'one',
    class: 'server',
    usage: 'open <project>',
    summary: 'Open a published case study by slug.',
  },
  {
    name: 'skills',
    arity: 'none',
    class: 'server',
    usage: 'skills',
    summary: 'Every distinct technology across the recorded project stacks.',
  },
  {
    name: 'certifications',
    arity: 'none',
    class: 'server',
    usage: 'certifications',
    summary: 'Recorded certifications, most recent first.',
  },
  {
    name: 'experience',
    arity: 'none',
    class: 'server',
    usage: 'experience',
    summary: 'Recorded roles, with duration and organisation.',
  },
  {
    name: 'education',
    arity: 'none',
    class: 'server',
    usage: 'education',
    summary: 'Recorded qualifications.',
  },
  {
    name: 'contact',
    arity: 'none',
    class: 'server',
    usage: 'contact',
    summary: 'How to reach the site owner.',
  },
  {
    name: 'socials',
    arity: 'none',
    class: 'server',
    usage: 'socials',
    summary: 'Declared social destinations.',
  },
  {
    name: 'status',
    arity: 'none',
    class: 'server',
    usage: 'status',
    summary: 'Figures derived from the content model.',
  },
  {
    name: 'neofetch',
    arity: 'none',
    class: 'server',
    usage: 'neofetch',
    summary: 'Profile and key figures side by side.',
  },
  {
    name: 'date',
    arity: 'none',
    class: 'server',
    usage: 'date',
    summary: "The server's current date and time.",
  },
  {
    name: 'uptime',
    arity: 'none',
    class: 'server',
    usage: 'uptime',
    summary: 'How long the serving process has been running.',
  },
  {
    name: 'gaps',
    arity: 'none',
    class: 'server',
    usage: 'gaps',
    summary: 'Unwritten authorable content, derived from the model.',
  },
  {
    name: 'history',
    arity: 'none',
    class: 'session',
    usage: 'history',
    summary: 'Commands run in this session, oldest first.',
  },
  {
    name: 'clear',
    arity: 'none',
    class: 'session',
    usage: 'clear',
    summary: 'Empty the scrollback.',
  },
] satisfies readonly CommandDeclaration[]);

const BY_NAME: ReadonlyMap<string, CommandDeclaration> = new Map(
  DECLARED_COMMANDS.map((command) => [command.name, command]),
);

/** Look a declared command up by exact name. */
export function findDeclaration(name: string): CommandDeclaration | undefined {
  return BY_NAME.get(name);
}

/**
 * Every declared command name, for tab completion. Derived, never re-listed.
 *
 * Both resolution classes, because `history` and `clear` are as typeable as any
 * other command: a completion list that silently omitted them would make a
 * declared command unreachable by keyboard.
 */
export const COMMAND_NAMES: readonly string[] = Object.freeze(
  DECLARED_COMMANDS.map((command) => command.name),
);

/** Declarations the server resolves. The endpoint serves exactly these. */
export function serverDeclarations(): readonly CommandDeclaration[] {
  return DECLARED_COMMANDS.filter((command) => command.class === 'server');
}

/** Declarations the browser resolves, with no request. */
export function sessionDeclarations(): readonly CommandDeclaration[] {
  return DECLARED_COMMANDS.filter((command) => command.class === 'session');
}