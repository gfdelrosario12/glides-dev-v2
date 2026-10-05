/**
 * The terminal's command endpoint.
 *
 * A read-only query over data the server already holds, so it is a Route Handler
 * rather than a Server Action: an action's response carries a re-rendered RSC
 * payload for the current route, which would re-ship the page to append lines to
 * a scrollback. `POST` is uncached by default, so no segment config is needed.
 *
 * No content crosses into this module's request handling. The caller sends a
 * typed line; the server resolves it against the content model and returns lines
 * of text.
 */

import { CONTENT } from '@/lib/content/model';
import { parseLine } from '@/lib/terminal/parse';
import {
  arityError,
  arityMismatch,
  findCommand,
  sessionOnly,
  unknownCommand,
} from '@/lib/terminal/commands';
import {
  MAX_BODY_BYTES,
  MAX_LINE_LENGTH,
  type ResolveContext,
  type TerminalResponseBody,
} from '@/lib/terminal/types';
import { DERIVED } from '@/lib/content/derive';

/**
 * The resolution context for one request.
 *
 * Process age is computed here, on the server, rather than in the registry, so
 * that no module the browser might import touches `process`.
 */
function resolveContext(): ResolveContext {
  return {
    content: CONTENT,
    now: new Date(),
    startedAt: new Date(Date.now() - process.uptime() * 1000),
    derived: DERIVED,
  };
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  // Bounded before reading, so an oversized body is never buffered into a parse.
  const declaredLength = request.headers.get('content-length');
  if (declaredLength !== null && Number(declaredLength) > MAX_BODY_BYTES) {
    return json({ error: `Request body exceeds ${MAX_BODY_BYTES} bytes.` }, 413);
  }

  const body = await request.text().catch(() => null);
  if (body === null) {
    return json({ error: 'Request body could not be read.' }, 400);
  }

  if (body.length > MAX_BODY_BYTES) {
    return json({ error: `Request body exceeds ${MAX_BODY_BYTES} bytes.` }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return json({ error: 'Request body must be JSON with a "line" property.' }, 400);
  }

  const line =
    typeof parsed === 'object' && parsed !== null ? (parsed as { line?: unknown }).line : undefined;

  if (typeof line !== 'string') {
    return json({ error: '"line" must be a string.' }, 400);
  }

  if (line.length > MAX_LINE_LENGTH) {
    return json({ error: `A command line is limited to ${MAX_LINE_LENGTH} characters.` }, 400);
  }

  const { name, argument } = parseLine(line);

  // An empty line is not a command; the client discards it without a request.
  if (name === '') {
    return json({ lines: [] } satisfies TerminalResponseBody);
  }

  const command = findCommand(name);

  if (command === undefined) {
    const result = unknownCommand(name);
    return json({ lines: result.lines } satisfies TerminalResponseBody, 400);
  }

  // Session commands describe the browser's overlay, not the site. Refusing them
  // here keeps the two resolution paths from drifting on one name.
  if (command.class === 'session') {
    const result = sessionOnly(command);
    return json({ lines: result.lines } satisfies TerminalResponseBody, 400);
  }

  const argv = argument === '' ? [] : [argument];
  if (arityMismatch(command, argument)) {
    const result = arityError(command, argv.length);
    return json({ lines: result.lines } satisfies TerminalResponseBody, 400);
  }

  const resolved = command.resolve?.(argv, resolveContext());
  if (resolved === undefined) {
    // Unreachable for a server-class command; a missing resolver is a bug in
    // the registry rather than in the input, so it is a 500 rather than a 400.
    return json({ error: `${command.name} has no resolver.` }, 500);
  }

  return json({
    lines: resolved.lines,
    ...(resolved.navigateTo === undefined ? {} : { navigateTo: resolved.navigateTo }),
  } satisfies TerminalResponseBody);
}