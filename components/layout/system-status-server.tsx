import { CONTENT } from '@/lib/content/model';
import { SystemStatus, type SystemMetric } from './system-status';

export function SystemStatusServer() {
  const metrics: SystemMetric[] = [
    { label: 'Experiences', value: CONTENT.experiences.length },
    { label: 'Case Studies', value: CONTENT.caseStudies.length },
    { label: 'Certifications', value: CONTENT.certifications.length },
    { label: 'Technologies', value: CONTENT.technologies.length },
  ];

  return <SystemStatus metrics={metrics} />;
}
