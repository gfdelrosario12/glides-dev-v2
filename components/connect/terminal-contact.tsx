import { PROFILE } from '@/content/site';

export function TerminalContact() {
  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-md border border-border bg-surface-inset font-mono text-sm leading-relaxed text-text shadow-sm">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded bg-destructive/80" />
          <div className="h-3 w-3 rounded bg-warning/80" />
          <div className="h-3 w-3 rounded bg-success/80" />
        </div>
        <div className="ml-2 text-xs text-text-muted">gladwin@portfolio ~ contact</div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-4 sm:p-6">
        <div className="mb-2 flex items-start gap-2">
          <span className="select-none text-success">➜</span>
          <span className="select-none text-accent">~</span>
          <span className="typing-text">cat contact.json</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre text-text-muted">
{`{
  "name": "${PROFILE.name}",
  "role": "${PROFILE.role}",
  "email": "gladwin.delrosario.organizations@gmail.com",
  "location": "Philippines"
}`}
        </pre>
        <div className="mt-4 flex items-start gap-2">
          <span className="select-none text-success">➜</span>
          <span className="select-none text-accent">~</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}
