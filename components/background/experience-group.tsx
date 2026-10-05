/**
 * The heading and rail above one group of experiences.
 *
 * A group is a layout device, not a data mark. The rail is a hairline in
 * `--color-border` and the group's name is text beside it, so a kind of work reads
 * as a section rather than as a state. It is deliberately not a `StatusIndicator`:
 * a track is not a condition a record is in, and giving it a tone would claim a
 * severity the content never asserted.
 *
 * The heading's `id` is built here from the group's key rather than from its label.
 * A label is a display string — it holds spaces and changes wording — and an
 * `aria-labelledby` pointing at an id derived from one would break the moment
 * either did.
 *
 * The unclassified group is named as such by its caller, not here. This component
 * knows how to draw a group; what that group is called is the content model's
 * decision, and restating the wording here would be a second place it could drift.
 */

export interface ExperienceGroupProps {
  /**
   * A slug-shaped key for the group, used to build the heading's id.
   *
   * `unclassified` is what the caller passes for the group that claims no kind.
   */
  readonly groupKey: string;
  /** The group's name as a visitor reads it. */
  readonly label: string;
  readonly children: React.ReactNode;
}

export function ExperienceGroup({ groupKey, label, children }: ExperienceGroupProps) {
  const headingId = `track-${groupKey}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div className="border-l-2 border-border pl-3">
        <h3 id={headingId} className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
          {label}
        </h3>
      </div>
      {children}
    </section>
  );
}