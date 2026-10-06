'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';

export interface MobileNavItem {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
}

export function MobileNavDrawer({ items }: { items: readonly MobileNavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close when pathname changes during navigation
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isOpen) {
      setIsOpen(false);
    }
  }

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className={`${buttonClasses('secondary', 'sm')} flex min-h-11 items-center gap-2 px-3`}
      >
        <span className="font-mono text-label uppercase tracking-[0.06em]">
          {isOpen ? 'Close' : 'Menu'}
        </span>
        <span
          aria-hidden="true"
          className={`font-mono text-accent transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
        >
          {isOpen ? '\u00d7' : '\u203a'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Panel */}
          <div
            id="mobile-nav-panel"
            ref={drawerRef}
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100svh-3.5rem)] overflow-y-auto border-b border-border bg-surface-overlay p-4 shadow-xl animate-in slide-in-from-top-2 duration-200"
          >
            <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
              <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                Navigation // system endpoints
              </span>
              <span className="font-mono text-label uppercase tracking-[0.06em] text-success">
                Online
              </span>
            </div>

            <nav aria-label="Mobile Primary" className="flex flex-col gap-1">
              {items.map((item, index) => {
                const isCurrent = pathname === item.href;
                const formattedIndex = String(index + 1).padStart(2, '0');

                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-12 items-center justify-between rounded-sm border border-transparent px-3 py-2 font-mono text-small transition-colors hover:border-border hover:bg-surface-raised hover:text-text text-text-secondary"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-text-muted text-label">{formattedIndex}</span>
                        <span className="uppercase tracking-[0.06em]">{item.label}</span>
                      </span>
                      <span className="text-text-muted text-label" aria-hidden="true">
                        \u2197
                      </span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`flex min-h-12 items-center justify-between rounded-sm border px-3 py-2 font-mono text-small transition-colors ${
                      isCurrent
                        ? 'border-accent bg-surface-raised text-accent font-medium'
                        : 'border-transparent text-text-secondary hover:border-border hover:bg-surface-raised hover:text-text'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`text-label ${isCurrent ? 'text-accent' : 'text-text-muted'}`}>
                        {formattedIndex}
                      </span>
                      <span className="uppercase tracking-[0.06em]">{item.label}</span>
                    </span>
                    {isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
