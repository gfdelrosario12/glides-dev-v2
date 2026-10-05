'use client';

import { useState, useEffect, useCallback } from 'react';
import { buttonClasses } from '@/components/ui/button';

const BOOT_KEY = 'gladwin_dev_boot_completed';

const BOOT_MESSAGES = [
  'INITIALIZING SYSTEM INTERFACE...',
  'LOADING PROFILE DATA...',
  'FETCHING CASE STUDIES...',
  'VERIFYING CREDENTIALS...',
  'SYSTEM READY.'
];

export function BootSequence() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only run on client
    const isCompleted = localStorage.getItem(BOOT_KEY);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isCompleted !== 'true' && !prefersReducedMotion) {
      setTimeout(() => setIsVisible(true), 0);
    }
  }, []);

  const completeSequence = useCallback(() => {
    localStorage.setItem(BOOT_KEY, 'true');
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (step < BOOT_MESSAGES.length) {
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        completeSequence();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, step, completeSequence]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface p-6 font-mono text-text">
      <div className="w-full max-w-lg space-y-4">
        <div className="flex justify-between items-end border-b border-border pb-2">
          <span className="text-sm font-semibold tracking-widest text-text-muted">GLADWIN.DEV // BOOT</span>
          <button
            onClick={completeSequence}
            className={`${buttonClasses('secondary', 'sm')} !px-3 !py-1 text-xs`}
          >
            SKIP SEQUENCE
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          {BOOT_MESSAGES.slice(0, step).map((msg, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-success">&gt;</span>
              <span className="text-text">{msg}</span>
            </div>
          ))}
          {step < BOOT_MESSAGES.length && (
            <div className="flex gap-3 animate-pulse">
              <span className="text-accent">&gt;</span>
              <span className="text-text-muted">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
