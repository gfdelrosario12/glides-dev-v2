'use client';

import { useState, useRef, useEffect } from 'react';

export interface SystemMetric {
  label: string;
  value: number;
}

interface SystemStatusProps {
  metrics: SystemMetric[];
}

export function SystemStatus({ metrics }: SystemStatusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="system-status-panel"
        className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success text-sm font-mono text-text-muted hover:text-text"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
        </span>
        <span className="hidden sm:inline">Active</span>
      </button>

      {isOpen && (
        <div
          id="system-status-panel"
          className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 origin-top-left sm:origin-top-right rounded-md border border-border bg-surface-overlay p-4 shadow-lg text-sm z-50 animate-in fade-in zoom-in-95 duration-200"
        >
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Active / system metrics
          </h3>
          <ul className="flex flex-col gap-2">
            {metrics.map((metric) => (
              <li key={metric.label} className="flex items-center justify-between font-mono">
                <span className="text-text-muted">{metric.label}</span>
                <span className="font-medium text-text">{metric.value}</span>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between border-t border-border pt-2 font-mono">
              <span className="text-text-muted">Status</span>
              <span className="font-medium text-success">ACTIVE</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
