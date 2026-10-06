'use client';

import { motion } from 'framer-motion';

import type { FocusAreaEvidence } from '@/lib/content/derive';

const EXPERTISE_LEVELS: Record<string, number> = {
  infrastructure: 88,
  cloud: 82,
  cybersecurity: 76,
  networking: 84,
  'it-operations': 86,
};

export function InfrastructureExpertise({
  focusAreas,
}: {
  focusAreas: readonly FocusAreaEvidence[];
}) {

  return (
    <section
      id="statistics"
      aria-labelledby="expertise-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
          Expertise / skillset
        </p>
        <h2 id="expertise-heading" className="text-title font-medium text-text">
          Infrastructure expertise
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          A practical view of the fields I work in most, from systems operations to cloud and security.
        </p>
      </div>

      <div className="rounded-md border border-border bg-surface-inset p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
          <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Infrastructure map
          </span>
          <span className="font-mono text-label uppercase tracking-[0.06em] text-success">
            calibrated
          </span>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {focusAreas.map((area, index) => {
            const level = EXPERTISE_LEVELS[area.id] ?? 70;

            return (
              <motion.li
                key={area.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="rounded-sm border border-border bg-surface-raised p-4 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                      {area.id}
                    </p>
                    <h3 className="mt-1 text-heading font-medium text-text">{area.label}</h3>
                  </div>
                  <output className="font-mono text-small text-accent" htmlFor={`expertise-${area.id}`}>
                    {level}%
                  </output>
                </div>
                <input
                  id={`expertise-${area.id}`}
                  type="range"
                  min="0"
                  max="100"
                  value={level}
                  readOnly
                  aria-label={`${area.label} expertise level`}
                  className="mt-4 h-2 w-full cursor-default accent-accent"
                />
                <p className="mt-3 text-small text-text-secondary">{area.summary}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}