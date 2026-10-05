/**
 * Turning a typed line into a command name and at most one argument.
 *
 * Deliberately the whole of the input grammar. There is no quoting, no
 * escaping, no flags, no pipes, no redirection, and no globbing — because a
 * grammar implies an expectation, and the only thing a user can usefully type
 * here is a command name and one slug.
 *
 * Splitting on whitespace means `open "my project"` treats `"my` as the argument
 * and fails against the slug list. That is the correct outcome for a closed
 * command set, not a defect to paper over with a quoting parser.
 *
 * Nothing in this file is evaluated. The returned name is looked up in the
 * registry and the argument is data.
 */

export interface ParsedLine {
  /** The declared-command candidate, lowercased. Empty when nothing was typed. */
  readonly name: string;
  /** At most one argument. Empty when none was given. */
  readonly argument: string;
}

/** Whitespace, as the separator between a command name and its argument. */
const WHITESPACE = /\s+/;

/**
 * Parse one line of input.
 *
 * Returns empty strings rather than throwing: an empty line is not an error, it
 * is simply nothing to run, and the caller decides that.
 */
export function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();
  if (trimmed === '') return { name: '', argument: '' };

  const [rawName, ...rest] = trimmed.split(WHITESPACE);
  const name = (rawName ?? '').toLowerCase();

  // Everything after the name, rejoined, so a slug never arrives split in half.
  const argument = rest.join(' ').trim();

  return { name, argument };
}