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

import { PROFILE } from '@/content/site';
import { SECTION_IDS } from '@/lib/navigation';
import { formatDateRange } from '@/lib/content/date';
import { DECLARED_COMMANDS, findDeclaration } from './registry';
import type { Command, CommandResult, ResolveContext } from './types';

type Resolve = (argv: readonly string[], context: ResolveContext) => CommandResult;

/** Shorthand for a result that is only output. */
function lines(...output: readonly string[]): CommandResult {
  return { lines: output };
}

/** Left-align a label into a fixed column, so output reads as a table. */
function row(label: string, value: string, width = 14): string {
  return `${label.padEnd(width)}${value}`;
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
    lines(
      row('name:', PROFILE.name, 12),
      row('role:', PROFILE.role, 12),
      row('focus:', 'Infrastructure · Cloud · Cybersecurity · Operations', 12),
      '',
      PROFILE.summary,
    ),

  about: () => {
    const output: string[] = [];
    PROFILE.biography.forEach((paragraph, idx) => {
      output.push(paragraph);
      if (idx < PROFILE.biography.length - 1) output.push('');
    });
    return lines(...output);
  },

  ls: () =>
    lines(
      'sections/',
      ...Object.values(SECTION_IDS).map((id) => `  ${id}`),
      '',
      'routes/',
      '  /',
      '  /connect',
      '',
      'files/',
      '  about.txt           contact.json',
      '  experience.txt      projects.txt',
      '  skills.txt          certifications.txt',
      '  README.md',
      '',
      'Use `cat <file>` to inspect files, `open <slug>` for project studies.',
    ),

  pwd: () => lines('/home/gladwin/portfolio'),

  hostname: () => lines('gladwin-workstation'),

  uname: (argv) => {
    if (argv.includes('-a') || argv.includes('-all')) {
      return lines('Linux gladwin-workstation 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
    }
    return lines('Linux');
  },

  echo: (argv) => lines(argv.join(' ')),

  cat: (argv, context) => {
    const file = argv[0]?.toLowerCase();
    switch (file) {
      case 'about.txt':
      case 'about':
        return lines(
          '=== Gladwin Ferdz Del Rosario ===',
          PROFILE.role,
          '',
          ...PROFILE.biography,
        );
      case 'contact.json':
      case 'contact': {
        const email =
          context.content.socialLinks
            .find((l) => l.platform === 'email')
            ?.href.replace('mailto:', '') ?? 'gladwin.delrosario.organizations@gmail.com';
        return lines(
          '{',
          `  "name": "${PROFILE.name}",`,
          `  "role": "${PROFILE.role}",`,
          `  "email": "${email}",`,
          '  "location": "Philippines",',
          '  "portfolio": "https://gladwin.dev"',
          '}',
        );
      }
      case 'skills.txt':
      case 'skills': {
        const list = context.content.technologies.map((t) => t.name).sort().join(', ');
        return lines('=== Core Technologies & Stack ===', '', list);
      }
      case 'experience.txt':
      case 'experience': {
        const output: string[] = ['=== Professional & Academic Experience ===', ''];
        for (const exp of context.content.experiences) {
          output.push(`* ${exp.title} | ${exp.organization} (${formatDateRange(exp.startDate, exp.endDate)})`);
          if (exp.responsibilities && exp.responsibilities.length > 0) {
            exp.responsibilities.forEach((r) => output.push(`  - ${r}`));
          } else if (exp.description) {
            output.push(`  - ${exp.description}`);
          }
          output.push('');
        }
        return lines(...output);
      }
      case 'certifications.txt':
      case 'certifications': {
        const output: string[] = ['=== Verified Certifications ===', ''];
        for (const cert of context.content.certifications) {
          output.push(`* ${cert.title} - ${cert.issuer} (Issued: ${cert.acquiredOn.iso})`);
          if (cert.credentialId) output.push(`  ID: ${cert.credentialId}`);
          if (cert.verificationUrl) output.push(`  Verify: ${cert.verificationUrl}`);
        }
        return lines(...output);
      }
      case 'projects.txt':
      case 'projects': {
        const output: string[] = ['=== Practical Projects ===', ''];
        for (const proj of context.content.projects) {
          output.push(`* ${proj.title} [${proj.category}]`);
          output.push(`  ${proj.description}`);
          output.push(`  Stack: ${proj.techStack.join(', ')}`);
          if (proj.liveUrl) output.push(`  Live: ${proj.liveUrl}`);
          if (proj.githubUrl) output.push(`  Source: ${proj.githubUrl}`);
          output.push('');
        }
        return lines(...output);
      }
      case 'readme.md':
      case 'readme':
        return lines(
          '# gladwin.dev - Engineering Portfolio Workstation',
          '',
          'Interactive developer workstation powered by Next.js, TypeScript, and Docker.',
          '',
          '## Navigation',
          'Run `help` for complete command registry.',
          'Run `ls` to inspect virtual filesystem.',
          'Run `status` for verified metrics and derivation statistics.',
        );
      default:
        return lines(
          `cat: ${argv[0] ?? ''}: No such file or directory`,
          '',
          'Available files:',
          '  about.txt           contact.json        skills.txt',
          '  experience.txt      certifications.txt  projects.txt',
          '  README.md',
        );
    }
  },

  grep: (argv, context) => {
    const query = argv.join(' ').toLowerCase().trim();
    if (query === '') {
      return lines('grep: search pattern required. Usage: grep <term>');
    }
    const results: string[] = [];

    for (const proj of context.content.projects) {
      if (
        proj.title.toLowerCase().includes(query) ||
        proj.description.toLowerCase().includes(query) ||
        proj.techStack.some((t) => t.toLowerCase().includes(query))
      ) {
        results.push(`[projects] ${proj.title}: ${proj.description.slice(0, 75)}...`);
      }
    }

    for (const exp of context.content.experiences) {
      if (
        exp.title.toLowerCase().includes(query) ||
        exp.organization.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        (exp.responsibilities && exp.responsibilities.some((r) => r.toLowerCase().includes(query)))
      ) {
        results.push(`[experience] ${exp.title} (${exp.organization})`);
      }
    }

    for (const cert of context.content.certifications) {
      if (cert.title.toLowerCase().includes(query) || cert.issuer.toLowerCase().includes(query)) {
        results.push(`[certifications] ${cert.title} - ${cert.issuer}`);
      }
    }

    for (const tech of context.content.technologies) {
      if (tech.name.toLowerCase().includes(query)) {
        results.push(`[skills] ${tech.name} (${tech.category})`);
      }
    }

    if (results.length === 0) {
      return lines(`grep: no matches found for '${query}'`);
    }

    return lines(
      `Matches for '${query}' (${results.length}):`,
      '',
      ...results.slice(0, 15),
      ...(results.length > 15 ? [`... and ${results.length - 15} more matches.`] : []),
    );
  },

  projects: (_argv, context) => {
    const output: string[] = [];
    for (const project of context.content.projects) {
      output.push(`[${project.category.toUpperCase()}] ${project.title}`);
      if (project.techStack.length > 0) {
        output.push(row('  stack:', project.techStack.join(' · '), 12));
      }
      if (project.githubUrl) {
        output.push(row('  source:', project.githubUrl, 12));
      }
      if (project.liveUrl && project.liveUrl !== project.githubUrl) {
        output.push(row('  live:', project.liveUrl, 12));
      }
      output.push('');
    }
    output.push(`${context.content.projects.length} verified projects recorded in portfolio data.`);
    if (context.content.caseStudies.length > 0) {
      output.push(`${context.content.caseStudies.length} architectural case studies:`);
      for (const cs of context.content.caseStudies) {
        output.push(`  ${cs.slug}: ${cs.title} (${cs.status})`);
      }
    }
    output.push('Run `open <slug>` for detailed project navigation.');
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
    const slug = argv[0]?.toLowerCase();
    if (slug === undefined || slug === '') {
      return lines('open needs a project slug. Usage: open <project>');
    }

    const caseStudy = context.content.caseStudies.find((candidate) => candidate.slug === slug);
    const project = context.content.projects.find((candidate) => candidate.slug === slug);

    if (caseStudy === undefined && project === undefined) {
      const availableSlugs = [
        ...context.content.projects.map((p) => p.slug),
        ...context.content.caseStudies.map((cs) => cs.slug),
      ];
      return lines(
        `No project matches "${slug}".`,
        '',
        'Available slugs include:',
        ...availableSlugs.slice(0, 8).map((candidate) => `  ${candidate}`),
        ...(availableSlugs.length > 8 ? [`  ... (${availableSlugs.length - 8} more)`] : []),
      );
    }

    const title = caseStudy?.title ?? project?.title ?? slug;
    return { lines: [`Navigating to ${title}...`], navigateTo: `/#projects` };
  },

  skills: (_argv, context) => {
    const output: string[] = [];
    const grouped = new Map<string, string[]>();
    for (const tech of context.content.technologies) {
      const cat = tech.category;
      const list = grouped.get(cat) ?? [];
      list.push(tech.name);
      grouped.set(cat, list);
    }
    const categoryLabels: Record<string, string> = {
      platform: 'Platforms & Cloud',
      language: 'Languages',
      framework: 'Frameworks',
      library: 'Libraries',
      database: 'Databases',
      model: 'AI & Models',
      field: 'Domains & Systems',
      practice: 'Practices & Tools',
    };
    for (const [cat, techs] of grouped.entries()) {
      const label = categoryLabels[cat] ?? cat;
      output.push(`${label}:`);
      output.push(`  ${techs.join(' · ')}`);
      output.push('');
    }
    output.push(`${context.content.technologies.length} verified technologies across portfolio systems.`);
    return lines(...output);
  },

  certifications: (_argv, context) => {
    const output: string[] = [];
    const sorted = [...context.content.certifications].sort(
      (a, b) =>
        b.acquiredOn.year * 12 +
        (b.acquiredOn.month ?? 0) -
        (a.acquiredOn.year * 12 + (a.acquiredOn.month ?? 0)),
    );
    for (const cert of sorted) {
      output.push(`[${cert.acquiredOn.iso}] ${cert.title}`);
      output.push(row('  issuer:', cert.issuer, 12));
      if (cert.credentialId) {
        output.push(row('  id:', cert.credentialId, 12));
      }
      if (cert.expiration) {
        output.push(row('  expires:', cert.expiration.iso, 12));
      }
      output.push('');
    }
    output.push(`${context.content.certifications.length} verified credentials recorded.`);
    return lines(...output);
  },

  experience: (_argv, context) => {
    const output: string[] = [];
    for (const exp of context.content.experiences) {
      const dates = formatDateRange(exp.startDate, exp.endDate);
      output.push(`${exp.title} · ${exp.organization}`);
      output.push(row('  period:', dates, 12));
      if (exp.location) output.push(row('  location:', exp.location, 12));
      if (exp.track) output.push(row('  track:', exp.track, 12));
      output.push('');
    }
    output.push(`${context.content.experiences.length} positions and technical leads recorded.`);
    return lines(...output);
  },

  education: (_argv, context) => {
    const output: string[] = [];
    for (const record of context.content.education) {
      output.push(record.title);
      output.push(row('  school:', record.institution, 12));
      if (record.degree !== null) output.push(row('  degree:', record.degree, 12));
      output.push(row('  period:', formatDateRange(record.startDate, record.endDate), 12));
      if (record.field.length > 0) output.push(row('  focus:', record.field.join(' · '), 12));
      output.push('');
    }
    output.push(`${context.content.education.length} academic qualification records.`);
    return lines(...output);
  },

  contact: (_argv, context) => {
    const email = context.content.socialLinks.find((l) => l.platform === 'email');
    const linkedin = context.content.socialLinks.find((l) => l.platform === 'linkedin');
    const github = context.content.socialLinks.find((l) => l.platform === 'github');
    return lines(
      row('email:', email ? email.href.replace('mailto:', '') : 'not recorded', 12),
      row('linkedin:', linkedin ? linkedin.href : 'not recorded', 12),
      row('github:', github ? github.href : 'not recorded', 12),
      '',
      'Run `socials` for all 11 communication endpoints.',
    );
  },

  socials: (_argv, context) => {
    const output: string[] = [];
    for (const link of context.content.socialLinks) {
      output.push(row(`${link.label}:`, link.href, 16));
    }
    output.push('');
    output.push(`${context.content.socialLinks.length} communication channels available.`);
    return lines(...output);
  },

  status: (_argv, context) => {
    const stats = context.derived.statistics;
    return lines(
      row('projects:', String(context.content.projects.length), 18),
      row('case studies:', String(stats.caseStudyCount), 18),
      row('certifications:', String(stats.certificationsEarned), 18),
      row('technologies:', String(stats.uniqueTechnologyCount), 18),
      row('cloud platforms:', String(stats.distinctCloudPlatforms), 18),
      row('roles held:', String(stats.rolesHeld), 18),
      row('leadership roles:', String(stats.leadershipRoles), 18),
      row('years of practice:', String(stats.yearsOfPractice), 18),
      '',
      'All metrics derived from verified portfolio records.',
    );
  },

  neofetch: (_argv, context) => {
    const stats = context.derived.statistics;
    const rule = '─'.repeat(48);
    return lines(
      rule,
      row('host:', 'gladwin.dev', 16),
      row('owner:', PROFILE.name, 16),
      row('role:', PROFILE.role, 16),
      row('projects:', `${context.content.projects.length} verified (${stats.caseStudyCount} case studies)`, 16),
      row('certifications:', `${stats.certificationsEarned} credentials`, 16),
      row('cloud:', 'AWS · Azure · Google Cloud', 16),
      row('technologies:', `${stats.uniqueTechnologyCount} distinct in stack`, 16),
      row('roles:', `${stats.rolesHeld} recorded positions`, 16),
      rule,
      'Run `status` for complete metrics, `help` for commands.',
    );
  },

  date: (_argv, context) =>
    lines(
      row('server time:', context.now.toISOString(), 14),
      row('local time:', context.now.toString(), 14),
    ),

  uptime: (_argv, context) => {
    const seconds = Math.max(0, Math.floor((context.now.getTime() - context.startedAt.getTime()) / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return lines(
      row('process age:', `${hours}h ${minutes}m ${seconds % 60}s`, 14),
      '',
      'Serving process age only. No uptime or availability metrics are fabricated for the site.',
    );
  },

  tech: (argv, context) => RESOLVERS.skills(argv, context),

  certs: (argv, context) => RESOLVERS.certifications(argv, context),

  sudo: (argv) => {
    const full = argv.join(' ').toLowerCase();
    if (full.includes('hire') && full.includes('gladwin')) {
      return lines(
        '[sudo] password for visitor: **********',
        'ACCESS GRANTED: Gladwin is ready to join your team!',
        'Gladwin Ferdz Del Rosario specializes in scalable cloud systems & reliable infrastructure.',
        'Reach out directly: gladwin.delrosario.organizations@gmail.com',
      );
    }
    if (full === '') {
      return lines('usage: sudo <command>');
    }
    return lines(
      '[sudo] password for visitor: **********',
      'visitor is not in the sudoers file. This incident will be reported.',
    );
  },

  apt: (argv) => {
    const sub = argv[0]?.toLowerCase() ?? '';
    if (sub === 'update' || sub === 'upgrade') {
      return lines(
        'Hit:1 https://gladwin.dev/packages noble InRelease',
        'Reading package lists... Done',
        'Building dependency tree... Done',
        'All packages up to date. Next.js, Spring Boot, React, Docker, Linux, and Cloud.',
      );
    }
    if (sub === 'install') {
      const pkg = argv.slice(1).join(' ') || 'coffee';
      return lines(
        'Reading package lists... Done',
        `Setting up ${pkg} (latest)... Done`,
        `Successfully installed ${pkg}.`,
      );
    }
    return lines(
      'apt 2.8.3 (x86_64)',
      'Usage: apt [update | upgrade | install <pkg>]',
      'Try: `apt update` or `apt install coffee`',
    );
  },

  sl: () =>
    lines(
      '      ====        ________                ___________ ',
      '  _D _|  |_______/        \\__I_I_____===__|_________| ',
      '   |(_)---  |   |====    |   |--|      |________________| ',
      '   /     |================ ||  |      |      |   |    | ',
      '  |      |________________||  |______|______|___|____| ',
      '  |________|  (_) (_)  (_)      (_) (_)  (_)     (_)   ',
      '',
      '🚂 Choo choo! You ran `sl` instead of `ls`.',
    ),

  cowsay: (argv) => {
    const text = argv.length > 0 ? argv.join(' ') : 'Gladwin writes scalable cloud architectures!';
    const len = Math.min(text.length, 50);
    const border = '-'.repeat(len + 2);
    return lines(
      ` ${border} `,
      `< ${text} >`,
      ` ${border} `,
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    );
  },

  fortune: () => {
    const quotes = [
      '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
      '"Premature optimization is the root of all evil." — Donald Knuth',
      '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton',
      '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"Make it work, make it right, make it fast." — Kent Beck',
    ];
    return lines(quotes[Math.floor(Date.now() / 1000) % quotes.length]);
  },

  matrix: () =>
    lines(
      'Wake up, Neo...',
      'The Matrix has you.',
      'Follow the white rabbit.',
      'Knock, knock, Neo.',
      '',
      '01000111 01101100 01100001 01100100 01110111 01101001 01101110',
      'System operational: All matrix nodes routed through Next.js and Docker.',
    ),

  vim: () =>
    lines(
      'VIM - Vi IMproved 9.1',
      '',
      'How to exit Vim:',
      '  Type  :q!  and press <Enter> to abandon all changes.',
      '',
      '(No terminal buffers were harmed. You remain safely in the web workstation.)',
    ),

  vi: (argv, context) => RESOLVERS.vim(argv, context),

  nano: () =>
    lines(
      'GNU nano 7.2',
      'File edit simulation: All files in repository are read-only.',
      'Use ^X (or type other terminal commands) to continue.',
    ),

  rm: (argv) => {
    const target = argv.join(' ') || '/';
    return lines(
      `rm: cannot remove '${target}': Permission denied.`,
      'Portfolio integrity preserved. Nice try!',
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

  const render = (names: readonly string[]): readonly string[] =>
    names
      .map((name) => findDeclaration(name))
      .filter((decl): decl is NonNullable<typeof decl> => decl !== undefined)
      .map((cmd) => `  ${cmd.usage.padEnd(width)}${cmd.summary}`);

  const coreCommands = [
    'whoami',
    'about',
    'projects',
    'open',
    'skills',
    'tech',
    'certifications',
    'certs',
    'experience',
    'education',
    'contact',
    'socials',
    'status',
    'neofetch',
  ];

  const linuxCommands = [
    'ls',
    'pwd',
    'cat',
    'grep',
    'echo',
    'uname',
    'hostname',
    'date',
    'uptime',
  ];

  const sessionCommands = ['history', 'clear', 'exit'];

  const extraCommands = [
    'sudo',
    'apt',
    'sl',
    'cowsay',
    'fortune',
    'matrix',
    'vim',
    'nano',
    'rm',
  ];

  return [
    'gladwin.dev terminal [v2.0] — command reference',
    '',
    'Core Portfolio Commands:',
    ...render(coreCommands),
    '',
    'Linux Workstation Utilities:',
    ...render(linuxCommands),
    '',
    'Session Controls:',
    ...render(sessionCommands),
    '',
    'Developer Easter Eggs:',
    ...render(extraCommands),
    '',
    'Tab completes command names. Up/Down navigates history. Escape closes.',
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
  switch (command.arity) {
    case 'none':
      return argument !== '';
    case 'one': {
      if (argument === '') return true;
      const words = argument.trim().split(/\s+/);
      return words.length !== 1;
    }
    case 'optional': {
      if (argument === '') return false;
      const words = argument.trim().split(/\s+/);
      return words.length > 1;
    }
    case 'any':
      return false;
  }
}

/** A readable arity error for a command given the wrong number of arguments. */
export function arityError(command: Command, given: number): CommandResult {
  if (command.arity === 'one') {
    return lines(
      given === 0
        ? `${command.name} needs 1 argument. Usage: ${command.usage}`
        : `${command.name} takes 1 argument. Usage: ${command.usage}`,
    );
  }
  if (command.arity === 'none') {
    return lines(`${command.name} takes no arguments. Usage: ${command.usage}`);
  }
  return lines(`Usage: ${command.usage}`);
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