import { cn } from '@/lib/cn';
import type { CaseStudySnippet } from '@/lib/content/model';

/**
 * One code snippet.
 *
 * The code body is rendered exactly as declared. Two decisions follow from that
 * and both are visible in the class list:
 *
 * - `whitespace-pre`, because a leading space that indents a block and a blank
 *   line between two of them are part of the code. Collapsing them would make the
 *   page disagree with the source file, and a reader comparing the two would be
 *   comparing against a version that does not exist.
 * - `min-w-0` on the container with `overflow-x-auto` on the scroller, so a long
 *   line scrolls inside the block rather than widening the document. `min-w-0`
 *   is what allows a grid or flex child to shrink below its content's width;
 *   without it the block would push the whole page sideways on a phone.
 *
 * There is no syntax highlighting and no copy button. Highlighting needs a
 * dependency and either a client boundary or a build-time transform, and a copy
 * button needs `navigator.clipboard` and client state. Content pages here have
 * neither by design, and a highlighter that mis-tokenises code would be worse
 * than plain text. The plain reading is the honest one.
 */
export interface SnippetProps {
  readonly snippet: CaseStudySnippet;
  readonly index: number;
}

export function Snippet({ snippet, index }: SnippetProps) {
  const id = `snippet-${snippet.source.file}-${snippet.source.line}`;
  const captionId = snippet.caption === null ? undefined : `${id}-caption`;

  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
          {snippet.language}
        </span>
        {snippet.caption === null ? null : (
          <figcaption id={captionId} className="text-small text-text-secondary">
            {snippet.caption}
          </figcaption>
        )}
      </div>

      {/*
        A `pre` with an explicit `role="group"` rather than a bare one: the
        language is the only thing telling a screen-reader user what this is, so
        it names the region.
      */}
      <div className="min-w-0 overflow-x-auto rounded-sm border border-border bg-surface-inset">
        <pre
          tabIndex={0}
          role="group"
          aria-labelledby={captionId}
          aria-label={captionId === undefined ? `${snippet.language} code` : undefined}
          className={cn('min-w-0 p-3 font-mono text-code leading-relaxed text-text')}
        >
          {/*
            No trim, no collapsing, no re-indentation. Whatever the content file
            holds is what appears, including a trailing newline.
          */}
          {snippet.code}
        </pre>
      </div>

      {/*
        The index is not shown. It is the declared order, not a figure a visitor
        needs: numbering snippets would imply they are being counted against
        something, and `index` exists only to keep React's list keys stable when
        two snippets share a language.
      */}
      <span hidden data-snippet-index={index} />
    </figure>
  );
}