'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useIsMounted } from '@/lib/hooks/use-mounted';

import type { FocusAreaEvidence } from '@/lib/content/derive';
import type { Technology } from '@/lib/content/model';

interface DomainTelemetry {
  id: string;
  label: string;
  indexScore: number;
  platforms: string;
  summary: string;
  evidence: {
    projects: number;
    roles: number;
    certs: number;
    deployed: number;
    leadership?: number;
  };
}

const DOMAIN_TELEMETRY: readonly DomainTelemetry[] = [
  {
    id: 'software-development',
    label: 'Software Development',
    indexScore: 92,
    platforms: 'Next.js · Spring Boot · React · TypeScript · Java · Docker',
    summary:
      'Full-stack application architecture, decoupled REST APIs, relational databases, and production software deployment.',
    evidence: {
      projects: 10,
      roles: 2,
      certs: 1,
      deployed: 6,
      leadership: 4,
    },
  },
  {
    id: 'cloud',
    label: 'Cloud Infrastructure',
    indexScore: 88,
    platforms: 'AWS · Google Cloud · Microsoft Azure · DigitalOcean',
    summary:
      'Multi-cloud infrastructure provisioning, serverless media storage, relational database instances, and community cloud leadership.',
    evidence: {
      projects: 5,
      roles: 2,
      certs: 3,
      deployed: 2,
      leadership: 3,
    },
  },
  {
    id: 'it-operations',
    label: 'IT Operations & Service Desk',
    indexScore: 86,
    platforms: 'ITSM · Service Desk · Incident Escalation · Active Directory',
    summary:
      'Enterprise service management, tier-1/2 ticketing resolution, hardware provisioning, IP verification, and operational escalations.',
    evidence: {
      projects: 4,
      roles: 3,
      certs: 1,
      deployed: 3,
      leadership: 2,
    },
  },
  {
    id: 'infrastructure',
    label: 'Enterprise Infrastructure & Systems',
    indexScore: 82,
    platforms: 'Docker · Linux · Raspberry Pi · Arduino · NeonDB',
    summary:
      'Containerized deployments, IoT edge monitoring, hardware sensor integration, Linux server environments, and database reliability.',
    evidence: {
      projects: 6,
      roles: 2,
      certs: 1,
      deployed: 3,
      leadership: 2,
    },
  },
  {
    id: 'networking',
    label: 'Computer Networking',
    indexScore: 76,
    platforms: 'Subnetting · IP Reconciliation · MQTT · WebSockets · LAN',
    summary:
      'Computer engineering network specialisation, enterprise IP address auditing, IoT messaging protocols, and physical LAN servicing.',
    evidence: {
      projects: 4,
      roles: 1,
      certs: 1,
      deployed: 2,
      leadership: 1,
    },
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity & Governance',
    indexScore: 71,
    platforms: 'JWT · RBAC · Biometrics · IT Governance · Awareness',
    summary:
      'Organizational cybersecurity awareness strategy, tokenized authentication, biometric hotlist tracking, and IT compliance governance.',
    evidence: {
      projects: 4,
      roles: 2,
      certs: 3,
      deployed: 2,
      leadership: 1,
    },
  },
];

interface LanguageTelemetry {
  name: string;
  indexScore: number;
  domain: string;
  evidenceText: string;
  exposureTag: string;
}

const LANGUAGE_TELEMETRY: readonly LanguageTelemetry[] = [
  {
    name: 'TypeScript',
    indexScore: 91,
    domain: 'Next.js · React · Type-safe Full-Stack',
    evidenceText: '06 full-stack projects · primary web application language',
    exposureTag: 'High Exposure',
  },
  {
    name: 'JavaScript',
    indexScore: 89,
    domain: 'Node.js · Web APIs · Client Scripting',
    evidenceText: '08 repositories · browser DOM & server scripts',
    exposureTag: 'High Exposure',
  },
  {
    name: 'Java',
    indexScore: 85,
    domain: 'Spring Boot · Enterprise REST APIs · JPA',
    evidenceText: '05 backend systems · enterprise architecture & NeonDB',
    exposureTag: 'Documented Exposure',
  },
  {
    name: 'SQL',
    indexScore: 82,
    domain: 'PostgreSQL · NeonDB · MySQL · Schemas',
    evidenceText: '06 relational schemas · query modeling & transactions',
    exposureTag: 'Documented Exposure',
  },
  {
    name: 'Python',
    indexScore: 78,
    domain: 'Whisper AI · IoT Automation · Raspberry Pi',
    evidenceText: '02 IoT hardware pipelines · audio recognition & MQTT',
    exposureTag: 'Practical Exposure',
  },
  {
    name: 'C++',
    indexScore: 70,
    domain: 'Arduino · Microcontrollers · Hardware Buses',
    evidenceText: '02 embedded systems · sensor firmware & pulse monitoring',
    exposureTag: 'Practical Exposure',
  },
];

function CircularLevel({ level, size = 46 }: { level: number; size?: number }) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  const colorClass =
    level >= 90
      ? 'text-accent'
      : level >= 85
      ? 'text-info'
      : level >= 80
      ? 'text-cyan-400'
      : level >= 70
      ? 'text-warning'
      : 'text-text-muted';

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${level} of 100 experience index`}
    >
      <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border fill-transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} fill-transparent transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center font-mono text-[11px] font-semibold text-text">
        <span>{level}</span>
      </div>
    </div>
  );
}

export interface ExpertiseSummaryProps {
  readonly focusAreas?: readonly FocusAreaEvidence[];
  readonly technologies?: readonly Technology[];
}

export function ExpertiseSummary(props?: ExpertiseSummaryProps) {
  void props;
  const shouldReduceMotion = useReducedMotion();
  const mounted = useIsMounted();
  const [showMethodology, setShowMethodology] = useState(false);

  const reduceMotion = mounted ? shouldReduceMotion : false;

  return (
    <section
      id="statistics"
      aria-labelledby="expertise-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
            Telemetry // technical immersion
          </p>
          <button
            type="button"
            onClick={() => setShowMethodology(!showMethodology)}
            aria-expanded={showMethodology}
            aria-controls="methodology-panel"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:border-accent hover:bg-surface-raised hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="text-accent font-bold">ⓘ</span>
            <span>{showMethodology ? 'Hide Methodology' : 'Methodology'}</span>
          </button>
        </div>
        <h2 id="expertise-heading" className="text-title font-medium text-text">
          Expertise Summary
        </h2>
        <p className="max-w-prose text-body text-text-secondary">
          An evidence-based index of hands-on exposure across systems operations, cloud platforms, infrastructure, and software engineering.
        </p>
      </div>

      {/* Discoverable Methodology Disclosure */}
      {showMethodology && (
        <motion.div
          id="methodology-panel"
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-md border border-accent/40 bg-surface-raised p-4 sm:p-5"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.06em] text-accent">
              Experience Index // Scoring Methodology
            </span>
            <span className="font-mono text-[10px] uppercase text-text-muted">
              Source: Verified Records
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2.5 text-small text-text-secondary">
            <p className="font-medium text-text">
              The Experience Index is not a claim of subjective mastery or arbitrary percentage skill.
            </p>
            <p>
              It represents an empirical, weighted measurement of documented exposure derived directly from verified portfolio records:
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 pt-1 font-mono text-[11px]">
              <li className="rounded-xs border border-border bg-surface-inset p-2">
                <span className="text-accent font-semibold">01 · Projects (max 30 pts):</span> 5 pts per documented project in repositories
              </li>
              <li className="rounded-xs border border-border bg-surface-inset p-2">
                <span className="text-accent font-semibold">02 · Industry Roles (max 30 pts):</span> 10 pts per corporate internship / enterprise role
              </li>
              <li className="rounded-xs border border-border bg-surface-inset p-2">
                <span className="text-accent font-semibold">03 · Certifications (max 20 pts):</span> 7 pts per accredited credential (AWS, GCP, Oracle, TESDA)
              </li>
              <li className="rounded-xs border border-border bg-surface-inset p-2">
                <span className="text-accent font-semibold">04 · Deployed Systems (max 10 pts):</span> 5 pts per live production / public IoT prototype
              </li>
              <li className="rounded-xs border border-border bg-surface-inset p-2 sm:col-span-2">
                <span className="text-accent font-semibold">05 · Community Leadership (max 10 pts):</span> 2.5 pts per documented club lead, hackathon, or event ops
              </li>
            </ul>
            <p className="text-[11px] text-text-muted pt-1">
              Data verified against <code className="text-accent">content/projects.csv</code>, <code className="text-accent">content/experiences.csv</code>, and <code className="text-accent">content/certifications.csv</code>.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Domains Telemetry */}
      <div className="rounded-md border border-border bg-surface-inset p-3 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4 sm:mb-6">
          <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Infrastructure & System Domains
          </span>
          <span className="font-mono text-label uppercase tracking-[0.06em] text-success">
            Verified Index
          </span>
        </div>

        <ul className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5">
          {DOMAIN_TELEMETRY.map((domain, index) => {
            const indexStr = String(index + 1).padStart(2, '0');
            const score = domain.indexScore;
            const tag =
              score >= 90
                ? 'High Exposure'
                : score >= 80
                ? 'Documented Experience'
                : 'Practical Experience';

            return (
              <motion.li
                key={domain.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduceMotion ? { duration: 0 } : { delay: index * 0.05, duration: 0.3 }}
                className="flex flex-col justify-between rounded-sm border border-border bg-surface-raised p-4 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay w-full max-w-xl mx-auto sm:max-w-none"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                        [{indexStr}] {domain.id}
                      </p>
                      <h3 className="mt-1 text-heading font-medium text-text">{domain.label}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-heading font-semibold text-accent">
                        {score} <span className="text-[12px] font-normal text-text-muted">/ 100</span>
                      </div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
                        Experience Index
                      </p>
                    </div>
                  </div>

                  <p className="mt-1 font-mono text-[11px] text-accent/90">
                    {domain.platforms}
                  </p>

                  {/* Telemetry Progress Bar */}
                  <div className="mt-3.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase text-text-muted">
                      <span>Telemetry Level</span>
                      <span className={score >= 85 ? 'text-accent' : 'text-info'}>{tag}</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-xs bg-surface border border-border">
                      <div
                        className="h-full bg-accent transition-all duration-700 ease-out"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-small text-text-secondary leading-relaxed">
                    {domain.summary}
                  </p>
                </div>

                {/* Evidence Counters */}
                <div className="mt-4 border-t border-border pt-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
                    Documented Evidence:
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-text-secondary">
                    {domain.evidence.projects > 0 && (
                      <span className="rounded-xs border border-border bg-surface px-1.5 py-0.5">
                        {domain.evidence.projects} projects
                      </span>
                    )}
                    {domain.evidence.roles > 0 && (
                      <span className="rounded-xs border border-border bg-surface px-1.5 py-0.5 text-accent">
                        {domain.evidence.roles} industry roles
                      </span>
                    )}
                    {domain.evidence.certs > 0 && (
                      <span className="rounded-xs border border-border bg-surface px-1.5 py-0.5 text-info">
                        {domain.evidence.certs} certs
                      </span>
                    )}
                    {domain.evidence.deployed > 0 && (
                      <span className="rounded-xs border border-border bg-surface px-1.5 py-0.5">
                        {domain.evidence.deployed} deployed
                      </span>
                    )}
                    {domain.evidence.leadership && domain.evidence.leadership > 0 && (
                      <span className="rounded-xs border border-border bg-surface px-1.5 py-0.5 text-text-muted">
                        {domain.evidence.leadership} leadership
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        {/* Circular Language Telemetry Level Shower */}
        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                Programming Languages // Telemetry Exposure
              </p>
            </div>
            <span className="font-mono text-label text-accent">{LANGUAGE_TELEMETRY.length} tracked</span>
          </div>

          <div
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Programming languages"
          >
            {LANGUAGE_TELEMETRY.map((lang) => {
              return (
                <div
                  key={lang.name}
                  role="listitem"
                  className="flex items-center gap-2.5 sm:gap-3.5 rounded-sm border border-border bg-surface-raised p-2.5 sm:p-3 transition-colors hover:border-accent hover:bg-surface-overlay w-full max-w-xl mx-auto sm:max-w-none"
                >
                  <CircularLevel level={lang.indexScore} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-mono text-small font-medium text-text truncate">
                        {lang.name}
                      </h4>
                      <span className="font-mono text-[10px] text-accent font-semibold">
                        {lang.indexScore} / 100
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-text-secondary">
                      {lang.domain}
                    </p>
                    <p className="mt-1 truncate font-mono text-[10px] text-text-muted">
                      {lang.evidenceText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Backward-compatible alias
export { ExpertiseSummary as InfrastructureExpertise };