import Image from 'next/image';

import { PROFILE } from '@/content/site';

/**
 * The profile photograph.
 *
 * Served through `next/image` with an explicit intrinsic size, so the browser is
 * told the dimensions before the file arrives and the layout does not shift when
 * it does.
 *
 * The frame is a fixed aspect container with `object-cover`. That matters here
 * because the source is a 3:2 landscape photograph: a fixed-ratio frame with
 * cover keeps the frame from changing shape as `sizes` hands the browser a
 * narrower or wider file, while any crop is confined to a box the layout has
 * already reserved space for.
 *
 * No caption: the name is already the page's first heading, and repeating it
 * here would add a second, competing announcement of the same fact.
 */
export function Profile() {
  return (
    <div className="min-w-0">
      <div className="aspect-[3/2] overflow-hidden rounded-md border border-border bg-surface-inset">
        <Image
          src={PROFILE.image.src}
          width={PROFILE.image.width}
          height={PROFILE.image.height}
          alt={PROFILE.image.alt}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 40vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}