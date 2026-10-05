/**
 * Types shared by the terminal engine, the server endpoint, and the overlay.
 *
 * Nothing here imports React, Next, or the filesystem. The engine is a pure
 * function of its arguments so that it can run on the server, in a browser, or
 * under a test runner that does not exist yet — see design decision D6.
 *
 * `ContentModel` is imported for its type only, so no content reaches a client
 * bundle that references this module.
 */

import type { ContentModel } from '@/lib/content/model';
import type { Derivation } from '@/lib/content/derive';

/** How many arguments a command accepts. */
export type CommandArity = 'none' | 'one';

/**
 * Where a command is resolved.
 *
 * `server` commands are facts about the site and are dispatched to the server.
 * `session` commands describe the current overlay session and are resolved in
 * the browser, because no server-side session exists to ask. The server refuses
 * every `session` name so the two paths cannot drift on one name.
 */
export type ResolutionClass = 'server' | 'session';

/** What a resolved command produced. */
export interface CommandResult {
  /** Ordered lines of selectable text. Never markup. */
  readonly lines: readonly string[];
  /**
   * A path to navigate to. Present only when the command means "go there";
   * the caller performs the navigation, so the engine never redirects.
   */
  readonly navigateTo?: string;
}

/**
 * Everything a command is allowed to read.
 *
 * Time and process age are passed in rather than read, so every command is a
 * total function of its arguments and its output is deterministic under test.
 */
export interface ResolveContext {
  readonly content: ContentModel;
  /**
   * The derived figures, passed in rather than imported.
   *
   * This is what keeps the registry importable by the browser. A value import of
   * `derive.ts` would drag the content model — and `node:fs` — into the client
   * bundle, because the registry is the same module the overlay reads command
   * names from. Both types above are type-only imports, so nothing is emitted.
   */
  readonly derived: Derivation;
  /** The moment the command was resolved. */
  readonly now: Date;
  /** When the serving process started. Reported by `uptime`, and labelled. */
  readonly startedAt: Date;
}

/**
 * One declared command, without its resolver.
 *
 * The metadata half of a command, kept separate from `Command` so the declared
 * set can live in a module with no content imports. See `registry.ts`.
 */
export interface CommandDeclaration {
  readonly name: string;
  readonly arity: CommandArity;
  readonly class: ResolutionClass;
  /** Usage line shown by `help` and by an arity error. */
  readonly usage: string;
  /** One-line description shown by `help`. */
  readonly summary: string;
}

/**
 * One declared command with its resolver attached.
 *
 * A `session` command has no resolver: the browser satisfies it locally, because
 * no server-side session exists to ask. It is still declared, so the command set
 * a visitor is offered is declared in exactly one place.
 */
export interface Command extends CommandDeclaration {
  readonly resolve?: (argv: readonly string[], context: ResolveContext) => CommandResult;
}

/** The JSON body the endpoint accepts. */
export interface TerminalRequestBody {
  readonly line: string;
}

/** The JSON body the endpoint returns. */
export interface TerminalResponseBody {
  readonly lines: readonly string[];
  readonly navigateTo?: string;
}

/**
 * The longest command line the endpoint will accept.
 *
 * A command is a name and at most one argument; anything longer is not a
 * command. Bounding it before parsing is what stops an unauthenticated public
 * endpoint from being used as a buffer amplifier.
 */
export const MAX_LINE_LENGTH = 200;

/** The largest request body the endpoint will read. */
export const MAX_BODY_BYTES = 4096;

/**
 * The keyboard shortcut that opens the terminal, declared once.
 *
 * The trigger's accessible name reads this, so what is announced and what is
 * bound cannot drift apart.
 */
export const TERMINAL_SHORTCUT = {
  /** `KeyboardEvent.key` for the non-modifier half. */
  key: '`',
  /** Human-readable form, for the accessible name. */
  label: 'Ctrl + `',
} as const;