import { Button } from '@/components/ui/button';
import { FOCUS_AREAS, PRIMARY_ACTION, PROFILE } from '@/content/site';
import { EmbeddedTerminal } from '@/components/terminal/embedded-terminal';
import Image from 'next/image';

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="py-8 sm:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Left column: Text content */}
        <div className="flex flex-col gap-6 lg:w-1/2">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            {FOCUS_AREAS.map((area) => area.label).join(' · ')}
          </p>

          <div className="flex flex-col gap-3">
            <h1 id="hero-name" className="max-w-3xl text-display font-medium text-text">
              {PROFILE.name}
            </h1>
            <p className="max-w-2xl text-title text-text-secondary">{PROFILE.role}</p>
            <p className="max-w-2xl text-body text-text-muted">{PROFILE.roleLine}</p>
          </div>

          <p className="max-w-prose text-body text-text-secondary">{PROFILE.summary}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant={PRIMARY_ACTION.variant} href={PRIMARY_ACTION.href}>
              {PRIMARY_ACTION.label}
            </Button>
          </div>

          <div className="mt-4 w-full">
            <EmbeddedTerminal />
          </div>
        </div>

        {/* Right column: Images */}
        <div className="flex flex-col gap-4 lg:w-5/12">
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src="/images/Main.JPG"
              alt="Gladwin"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {/* <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src="/images/Grad.JPG"
              alt="Graduation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div> */}
        </div>

      </div>
    </section>
  );
}
