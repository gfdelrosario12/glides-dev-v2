import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata, MetadataList } from '@/components/ui/metadata';
import { TokenChipList } from '@/components/sections/chip';
import Link from 'next/link';

/**
 * One recorded experience, presented as an operational record.
 *
 * A Server Component taking already-resolved display values: nothing here reads
 * the content model, so a value cannot reach this view by a path the content model
 * did not validate, and nothing about a record is serialised into a client bundle.
 *
 * What an entry shows is decided by what the record declares. Every optional
 * region — responsibilities, tools, systems, the lesson, the related work — is
 * omitted entirely when the record declares none of it, because with the current
 * content most records declare none and a page of placeholders would be the normal
 * appearance of a complete record. An absent field is not news; a heading saying
 * "no lesson recorded" would put a line of negative information on fourteen of
 * twenty entries.
 *
 * `description` is the operational work, and it is transcribed as written. It is
 * the owner's account of what they actually did, and summarising or rewording it
 * would replace the evidence with a claim about it.
 */

export interface ExperienceEntryProps {
  /** Id for the entry's title element, which also names the card. */
  readonly slug: string;
  readonly titleId: string;
  /** The role, as recorded. */
  readonly role: string;
  readonly organization: string;
  /** The declared span, already formatted at the precision each date was written. */
  readonly period: string;
  /** The shape of the role — internship, leadership, membership, volunteering. */
  readonly badgeLabel: string;
  readonly location: string;
  readonly description: string;
  /** Discrete responsibilities the record enumerates. Empty renders no region. */
  readonly responsibilities: readonly string[];
  /** The owner's recorded lesson, or null when they declared none. */
  readonly lessonsLearned: string | null;
  /** Names of the capabilities and activities the record declares. */
  readonly skills: readonly string[];
  /** Names of the tools the record declares. Empty renders no region. */
  readonly tools: readonly string[];
  /** Names of the systems the record declares. Empty renders no region. */
  readonly systems: readonly string[];
  readonly caseStudies: readonly { slug: string; title: string }[];
}

export function ExperienceEntry({
  slug,
  titleId,
  role,
  organization,
  period,
  badgeLabel,
  location,
  description,
  responsibilities,
  lessonsLearned,
  skills,
  tools,
  systems,
  caseStudies,
}: ExperienceEntryProps) {
  return (
    <Card labelledBy={titleId} className="relative group hover:border-accent/50 transition-colors">
      <CardHeader>
        {/* The role leads and the organisation follows, in that order in the
            markup: a visitor scanning twenty entries is looking for what someone
            did before where they did it. */}
        <CardTitle id={titleId} level={4} className="group-hover:text-accent transition-colors">
          <Link href={`/case-study/${slug}`} className="before:absolute before:inset-0">{role}</Link>
        </CardTitle>
        <CardDescription>{organization}</CardDescription>
      </CardHeader>

      <CardContent>
        <MetadataList label={`${role} at ${organization}`}>
          <Metadata label="Period" value={period} />
          <Metadata label="Role" value={badgeLabel} />
          <Metadata label="Location" value={location} />
        </MetadataList>

        {/* The account of the work, as written. */}
        <p className="text-body text-text-secondary">{description}</p>

        {responsibilities.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Responsibilities
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-4">
              {responsibilities.map((responsibility) => (
                <li key={responsibility} className="text-small text-text-secondary">
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Tools and systems are independent regions. One record can name tools
            and no systems today, so omitting them as a pair would drop a
            declaration the visitor would otherwise see. */}
        {tools.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Tools
            </p>
            <TokenChipList labels={tools} />
          </div>
        ) : null}

        {systems.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Systems
            </p>
            <TokenChipList labels={systems} />
          </div>
        ) : null}

        {skills.length > 0 ? (
          <div className="flex flex-col gap-2">
            {/* A label, not a heading: a heading here would add twenty identical
                entries to the page outline. */}
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Capabilities
            </p>
            <TokenChipList labels={skills} />
          </div>
        ) : null}

        {lessonsLearned !== null ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Lesson learned
            </p>
            <p className="text-small text-text-secondary">{lessonsLearned}</p>
          </div>
        ) : null}

        {/*
          Related work, or nothing at all. No region, no heading, and no "no
          related work" line — the case studies a role evidences are a fact about
          the case studies, and a heading over an empty list would announce a
          relationship that is not there.
        */}
        {caseStudies.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
              Evidenced by
            </p>
            <ul className="flex flex-col gap-2">
              {caseStudies.map((caseStudy) => (
                <li key={caseStudy.slug}>
                  <a
                    className="relative z-10 text-small text-text underline decoration-border-strong underline-offset-4 hover:decoration-text"
                    href={`/projects/${caseStudy.slug}`}
                    
                  >
                    {caseStudy.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}