import type { CaseStudyMedia, ResolvedCaseStudySection } from '@/lib/content/model';

import { Snippet } from './snippet';

/**
 * One section of a case study: its heading, its prose, and whatever else belongs
 * to it.
 *
 * This is the single layout for every section. It was tempting to give media and
 * snippets their own headings and their own region at the bottom of the page —
 * that was the previous shape — but it separates a diagram from the argument it
 * illustrates and leaves the reader to guess which of nine sections a lone code
 * block belongs to. A section key on both media and snippets is only worth
 * declaring if something reads it to place them, and this is that something.
 *
 * Because the parts are optional, one component covers every combination: a
 * section with prose and nothing else, prose and a diagram, a section satisfied
 * only by two photographs. Nothing branches on which parts happen to be present
 * beyond omitting the empty ones, so there is no path through this file that has
 * not been rendered by a record.
 */
export interface SectionBlockProps {
  readonly section: ResolvedCaseStudySection;
  /**
   * Position among the rendered sections, used only to build a stable DOM id.
   *
   * The heading id must be unique in the document and stable across renders, so
   * it is derived from the section key rather than the array index. Two case
   * studies on one page would otherwise collide.
   */
  readonly idPrefix: string;
}

export function SectionBlock({ section, idPrefix }: SectionBlockProps) {
  const headingId = `${idPrefix}-${section.key}`;

  const diagrams = section.media.filter((item) => item.kind === 'diagram');
  const photos = section.media.filter((item) => item.kind === 'photo');

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h2 id={headingId} className="text-title font-medium text-text">
        {section.label}
      </h2>

      {/*
        Diagrams lead, at the full measure of the section, before the prose they
        illustrate. A reader who has not yet read the argument gets the shape of
        the system first and the description second, which is the order the
        diagram is readable in. Photographs follow the prose instead — they are
        usually a view of something the prose has just described, so leading
        them would show the result before the reasoning.

        Both decisions come from the declared `kind`, and the split is by kind
        alone: a diagram declared for any section gets the full measure and the
        lead position. What makes Architecture special is only that its diagram
        lands before its prose, not that it is treated differently here.
      */}
      {diagrams.length === 0 ? null : (
        <div className="flex flex-col gap-4">
          {diagrams.map((item) => (
            <Figure key={`${item.section}-${item.src}`} item={item} />
          ))}
        </div>
      )}

      {section.prose === null ? null : (
        <p className="max-w-prose wrap-anywhere text-body text-text-secondary">{section.prose}</p>
      )}

      {photos.length === 0 ? null : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {photos.map((item) => (
            <li key={`${item.section}-${item.src}`} className="min-w-0">
              <Figure item={item} />
            </li>
          ))}
        </ul>
      )}

      {section.snippets.length === 0 ? null : (
        <div className="flex flex-col gap-4">
          {section.snippets.map((snippet, index) => (
            <Snippet key={`${snippet.language}-${index}`} snippet={snippet} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * One figure, with its caption when one is declared.
 *
 * The caption is a real `<figcaption>`, so a screen reader ties it to the image
 * rather than leaving it as the next loose paragraph. A record without one gets
 * no placeholder: the `alt` text already describes the image, and an empty
 * caption row would say nothing.
 *
 * Not a `next/image` component. The record declares a source and a description,
 * not a size, and reserving layout space from a guessed aspect ratio would be a
 * claim the content does not make.
 */
function Figure({ item }: { readonly item: CaseStudyMedia }) {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} className="w-full rounded-sm border border-border" />
      {item.caption === null ? null : (
        <figcaption className="text-small text-text-muted">{item.caption}</figcaption>
      )}
    </figure>
  );
}