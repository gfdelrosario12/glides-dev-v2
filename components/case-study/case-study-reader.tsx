'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface CaseStudyReaderProps {
  toc: TocItem[];
}

export function CaseStudyReader({ toc }: CaseStudyReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>('');
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  return (
    <>
      {/* Top sticky reading progress bar */}
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-accent/20 w-full"
        aria-hidden="true"
      >
        <div
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating mobile Table of Contents toggle */}
      {toc.length > 0 && (
        <div className="lg:hidden mb-8 rounded-md border border-border bg-surface-raised p-4">
          <button
            type="button"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="flex w-full items-center justify-between font-mono text-label uppercase tracking-[0.06em] text-text hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            aria-expanded={isTocOpen}
          >
            <span className="flex items-center gap-2">
              <span className="text-accent">&gt;</span> Table of Contents ({toc.length})
            </span>
            <span className="text-accent text-sm">{isTocOpen ? '▲' : '▼'}</span>
          </button>

          {isTocOpen && (
            <nav className="mt-4 border-t border-border pt-3" aria-label="Table of contents">
              <ul className="space-y-2 font-mono text-xs">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsTocOpen(false)}
                      className={`block py-1 transition-colors hover:text-accent ${
                        activeId === item.id ? 'text-accent font-semibold' : 'text-text-secondary'
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </>
  );
}

export function DesktopTableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-90px 0px -70% 0px' }
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <aside
      className="hidden lg:block w-64 shrink-0"
      aria-label="Table of contents"
    >
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-md border border-border bg-surface-raised/60 p-5 backdrop-blur-sm">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-accent mb-4 flex items-center gap-2 border-b border-border pb-2">
          <span>Contents</span>
        </p>
        <ul className="space-y-2.5 font-mono text-xs">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 10}px` }}
            >
              <a
                href={`#${item.id}`}
                className={`block py-0.5 leading-snug transition-colors hover:text-accent ${
                  activeId === item.id
                    ? 'text-accent font-medium border-l-2 border-accent pl-2 -ml-2.5'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-border pt-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.06em] text-text-muted hover:text-accent transition-colors"
          >
            &larr; Back to projects
          </Link>
        </div>
      </div>
    </aside>
  );
}
