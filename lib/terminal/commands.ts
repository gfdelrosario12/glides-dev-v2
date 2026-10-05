/**
 * The terminal's command implementations.
 *
 * One resolver per server-class declaration in `registry.ts`, keyed by name, and
 * nothing that re-declares a command. Every figure printed here is computed from
 * the content model or from `lib/content/derive.ts`; no count, total, or year is
 * written by hand, so a command cannot disagree with the page it describes.
 *
 * This module reads content, so it must stay on the server. `registry.ts` is the
 * half the browser is allowed to see, which is why the two are separate files.
 *
 * No React, no Next, no `node:fs` — every command is a pure function of
 * `(argv, context)`, so this layer is callable from a future test runner that the
 * project does not have yet. See design decision D6.
 */

import { PROFILE, SECONDARY_ACTIONS } from '@/content/site';
import { SECTION_IDS, SOCIAL_LINKS } from '@/lib/navigation';
import { formatDateRange } from '@/lib/content/date';
import { DECLARED_COMMANDS, findDeclaration, serverDeclarations, sessionDeclarations } from './registry';
import type { Command, CommandResult, ResolveContext } from './types';

type Resolve = (argv: readonly string[], context: ResolveContext) => CommandResult;

/** Shorthand for a result that is only output. */
function lines(...output: readonly string[]): CommandResult {
  return { lines: output };
}

/** Left-align a label into a fixed column, so output reads as a table. */
function row(label: string, value: string, width = 22): string {
  return `${label.padEnd(width)}${value}`;
}

/**
 * Every technology record in use, as names.
 *
 * Reads the resolved records rather than re-deriving anything from text, so this
 * list and the `technologies` figure in `status` are two views of one set. While
 * the stacks were free text this command and the figure each normalised
 * separately and could drift; they no longer can.
 */
function technologiesInUse(context: ResolveContext): readonly string[] {
  return context.derived.technologiesInUse.map((technology) => technology.name);
}

/**
 * Edit distance, Levenshtein.
 *
 * Written out rather than pulled from a library: the project adds no
 * dependencies, and fifteen lines is cheaper than a package for one refusal
 * message.
 */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

/**
 * The closest declared name to what was typed: a prefix match if there is one,
 * otherwise the nearest name within a plausible edit distance.
 *
 * A long unrelated word gets no suggestion rather than a bad one, because
 * "did you mean" on a word nothing resembles is worse than the command list.
 */
export function suggestCommand(typed: string, candidates: readonly string[]): string | null {
  const needle = typed.toLowerCase();
  const prefixMatch = candidates.find((name) => name.startsWith(needle));
  if (prefixMatch !== undefined) return prefixMatch;

  let best: { name: string; distance: number } | null = null;
  for (const name of candidates) {
    const distance = editDistance(needle, name);
    const tolerance = Math.max(2, Math.floor(name.length / 3));
    if (distance <= tolerance && (best === null || distance < best.distance)) {
      best = { name, distance };
    }
  }
  return best?.name ?? null;
}

const RESOLVERS: Readonly<Record<string, Resolve>> = {
  whoami: () =>
    lines(row('name', PROFILE.name), row('role', PROFILE.role), '', PROFILE.summary),

  about: () => lines(...PROFILE.biography),

  ls: (_argv, context) =>
    lines(
      'sections/',
      ...Object.values(SECTION_IDS).map((id) => `  ${id}`),
      '',
      'routes/',
      '  /',
      '  /design-tokens',
      '',
      `case-studies/ (${context.derived.publishedCaseStudies.length} published)`,
      ...context.content.caseStudies.map(
        (caseStudy) =>
          `  ${caseStudy.slug}${caseStudy.status === 'published' ? '' : '  (draft)'}`,
      ),
    ),

  projects: (_argv, context) => {
    const output: string[] = [];
    for (const caseStudy of context.content.caseStudies) {
      output.push(`${caseStudy.title} (${caseStudy.slug})`);
      output.push(row('  status', caseStudy.status));
      output.push(row('  category', caseStudy.category));
      output.push(row('  stack', caseStudy.technologies.map((t) => t.name).join(', ')));
      output.push(row('  live', caseStudy.liveUrl));
      output.push(row('  source', caseStudy.githubUrl));
      output.push('');
    }
    output.push(`${context.content.caseStudies.length} case studies recorded.`);
    output.push(`${context.derived.statistics.caseStudyCount} published.`);
    output.push('Run `open <slug>` for a published case study.');
    return lines(...output);
  },


  gaps: (_argv, context) => {
    const output = [];
    const gaps = context.derived.gaps;

    for (const [collection, fields] of Object.entries(gaps.collections)) {
      output.push(`${collection}/`);
      for (const [field, records] of Object.entries(fields)) {
        if (records.length === 0) continue;
        output.push(`  ${field} (${records.length} omitted)`);
        for (const record of records) {
          output.push(`    ${record}`);
        }
      }
      output.push('');
    }

    if (gaps.blockedByCaseStudies) {
      output.push('caseStudies blocked: Cannot fill caseStudies field before case studies are published.');
      output.push('Prose completion:');
      for (const cs of gaps.caseStudyProse) {
        output.push(`  ${cs.slug}: ${cs.written}/${cs.total} sections`);
      }
    }

    if (output.length === 0 || (output.length === 1 && output[0] === '')) {
      return lines('No authorable content gaps found.');
    }

    return lines(...output);
  },
  open: (argv, context) => {
    const slug = argv[0];
    if (slug === undefined || slug === '') {
      return lines('open needs a project slug. Usage: open <project>');
    }

    const caseStudy = context.content.caseStudies.find((candidate) => candidate.slug === slug);

    if (caseStudy === undefined) {
      return lines(
        `No case study matches "${slug}".`,
        '',
        'These slugs exist:',
        ...context.content.caseStudies.map((candidate) => `  ${candidate.slug}`),
      );
    }

    // Publication is read from the content rather than held here, so this
    // command cannot offer an address the route would refuse to render.
    if (caseStudy.status !== 'published') {
      return lines(
        `No case study is published for "${slug}".`,
        '',
        `${caseStudy.title} is recorded in the content model as a draft, so its`,
        'case-study page is not published and there is nowhere to navigate to.',
      );
    }

    // A navigation intent, not a navigation. The result arrives in a fetch
    // response; `redirect()` thrown here would produce a response the client
    // would not follow as intended.
    return { lines: [`Opening ${caseStudy.title}...`], navigateTo: `/projects/${slug}` };
  },

  skills: (_argv, context) => {
    const technologies = technologiesInUse(context);
    return lines(
      ...technologies,
      '',
      `${context.derived.statistics.uniqueTechnologyCount} distinct technologies.`,
    );
  },

  certifications: (_argv, context) =>
    lines(
      ...[...context.content.certifications]
        .sort((a, b) => b.acquiredOn.year - a.acquiredOn.year)
        .map((certification) =>
          row(
            certification.acquiredOn.iso,
            `${certification.title} - ${certification.issuer}` +
              (certification.expiration === null ? '' : ` (expires ${certification.expiration.iso})`),
          ),
        ),
      '',
      `${context.derived.statistics.certificationsEarned} certifications recorded.`,
    ),

  experience: (_argv, context) => {
    const output: string[] = [];
    for (const experience of context.content.experiences) {
      output.push(`${experience.title} - ${experience.organization}`);
      output.push(row('  duration', formatDateRange(experience.startDate, experience.endDate)));
      // An unclassified record says so rather than printing nothing, which would
      // leave the row looking like a formatting slip rather than a stated absence.
      output.push(row('  track', experience.track ?? 'unclassified'));
      output.push('');
    }
    output.push(`${context.derived.statistics.rolesHeld} roles recorded.`);
    return lines(...output);
  },

  education: (_argv, context) => {
    const output: string[] = [];
    for (const record of context.content.education) {
      output.push(record.title);
      output.push(row('  institution', record.institution));
      if (record.degree !== null) output.push(row('  degree', record.degree));
      output.push(row('  period', formatDateRange(record.startDate, record.endDate)));
      output.push('');
    }
    output.push(`${context.content.education.length} records of study.`);
    return lines(...output);
  },

  contact: () => {
    const email = SECONDARY_ACTIONS.find((action) => action.href.startsWith('mailto:'));
    return lines(row('email', email === undefined ? 'not recorded' : email.href.replace('mailto:', '')));
  },

  socials: () => lines(...SOCIAL_LINKS.map((link) => row(link.label, link.href))),

  status: (_argv, context) => {
    const stats = context.derived.statistics;
    return lines(
      row('case studies', String(stats.caseStudyCount)),
      row('featured', String(stats.featuredCaseStudyCount)),
      row('technologies', String(stats.uniqueTechnologyCount)),
      row('cloud platforms', String(stats.distinctCloudPlatforms)),
      row('roles held', String(stats.rolesHeld)),
      row('leadership roles', String(stats.leadershipRoles)),
      row('certifications', String(stats.certificationsEarned)),
      row('years of practice', String(stats.yearsOfPractice)),
      '',
      'Every figure above is derived from the content model.',
    );
  },

  neofetch: (_argv, context) => {
    const stats = context.derived.statistics;
    const rule = '-'.repeat(24);
    return lines(
      rule,
      row('owner', PROFILE.name),
      row('role', PROFILE.role),
      row('case studies', String(stats.caseStudyCount)),
      row('technologies', String(stats.uniqueTechnologyCount)),
      row('cloud platforms', String(stats.distinctCloudPlatforms)),
      row('certifications', String(stats.certificationsEarned)),
      row('years of practice', String(stats.yearsOfPractice)),
      rule,
      'Figures derived from content; run `status` for the full set.',
    );
  },

  date: (_argv, context) =>
    lines(
      `Server time: ${context.now.toISOString()}`,
      `Local time: ${context.now.toString()}`,
    ),

  uptime: (_argv, context) => {
    const seconds = Math.max(0, Math.floor((context.now.getTime() - context.startedAt.getTime()) / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return lines(
      `Serving process age: ${hours}h ${minutes}m ${seconds % 60}s`,
      '',
      'This is the age of the process serving the request, not the availability',
      'of the site. No uptime is recorded for the site itself.',
    );
  },

  /**
   * `help` is generated from the declared set, so the two cannot drift: adding a
   * declaration adds its line here with no second edit.
   */
  help: () => lines(...helpLines()),
};

/** The help text, read from the declarations rather than written out. */
function helpLines(): readonly string[] {
  const width =
    DECLARED_COMMANDS.reduce((widest, command) => Math.max(widest, command.usage.length), 0) + 2;
  const render = (declarations: readonly { usage: string; summary: string }[]): readonly string[] =>
    declarations.map((command) => `  ${command.usage.padEnd(width)}${command.summary}`);

  return [
    'Available commands:',
    '',
    ...render(serverDeclarations()),
    '',
    'Session commands, resolved without a request:',
    '',
    ...render(sessionDeclarations()),
    '',
    'Tab completes command names. Escape closes the terminal.',
  ];
}

/**
 * Every declared command, each with its resolver where it has one.
 *
 * Built from the declarations rather than listed separately, so there is one
 * command set and not one per resolution class. Session commands appear here
 * without a resolver, which is how the server recognises — and refuses — them.
 */
export const COMMANDS: readonly Command[] = Object.freeze(
  DECLARED_COMMANDS.map((declaration) => {
    const resolve = RESOLVERS[declaration.name];
    return resolve === undefined ? declaration : { ...declaration, resolve };
  }),
);

const BY_NAME: ReadonlyMap<string, Command> = new Map(
  COMMANDS.map((command) => [command.name, command]),
);

/** Look a command up by exact name. */
export function findCommand(name: string): Command | undefined {
  return BY_NAME.get(name);
}

/** Whether a declared name is one this server refuses to resolve. */
export function isSessionOnly(name: string): boolean {
  return findDeclaration(name)?.class === 'session';
}

/** Expected argument count for a command. */
export function arityOf(command: Command): number {
  return command.arity === 'one' ? 1 : 0;
}

/**
 * True when the supplied argument does not match what the command declares.
 *
 * An argument given to a command that takes none is a mismatch rather than
 * something to ignore, so a mistyped command is never silently truncated into a
 * different command.
 */
export function arityMismatch(command: Command, argument: string): boolean {
  return arityOf(command) === 0 ? argument !== '' : argument === '';
}

/** A readable arity error for a command given the wrong number of arguments. */
export function arityError(command: Command, given: number): CommandResult {
  const expected = arityOf(command);
  const noun = expected === 1 ? 'argument' : 'arguments';
  return lines(
    given === 0
      ? `${command.name} needs ${expected} ${noun}. Usage: ${command.usage}`
      : `${command.name} takes ${expected} ${noun}. Usage: ${command.usage}`,
  );
}

/** A readable refusal for a name that is not a declared command. */
export function unknownCommand(name: string): CommandResult {
  const suggestion = suggestCommand(
    name,
    DECLARED_COMMANDS.map((command) => command.name),
  );
  return lines(
    `${name}: command not recognised.`,
    ...(suggestion === null ? [] : [`Did you mean ${suggestion}?`]),
    '',
    'Run `help` for the command list.',
  );
}

/** A readable refusal for a session command sent to the server. */
export function sessionOnly(command: Command): CommandResult {
  return lines(
    `${command.name} is a session command and is resolved in the browser.`,
    'It was not dispatched to the server.',
  );
}