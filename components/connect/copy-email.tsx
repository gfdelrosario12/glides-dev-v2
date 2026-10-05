'use client';

import { useState } from 'react';

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success ${className || ''}`}
      aria-label="Copy email address"
    >
      {copied ? 'Copied!' : 'Copy Email'}
    </button>
  );
}
