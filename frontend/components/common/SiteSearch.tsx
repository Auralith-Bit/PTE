'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type SearchEntry = { label: string; href: string; category: string };

// Every href here has to resolve to a real route, and for question types to a
// task the backend actually seeds. An entry that lands on an empty task page is
// worse than no entry at all, so coming-soon question types are left out
// deliberately rather than added with a disabled state.
const SEARCH_INDEX: SearchEntry[] = [
  { label: 'Home', href: '/', category: 'Page' },
  { label: 'Dashboard', href: '/dashboard', category: 'Page' },
  { label: 'Practice', href: '/practice', category: 'Page' },
  { label: 'Mock Test', href: '/mock-test', category: 'Page' },
  { label: 'Courses', href: '/courses', category: 'Page' },
  { label: 'Resources', href: '/resources', category: 'Page' },

  { label: 'Speaking Practice', href: '/practice/speaking', category: 'Skill' },
  { label: 'Writing Practice', href: '/practice/writing', category: 'Skill' },
  { label: 'Listening Practice', href: '/practice/listening', category: 'Skill' },
  { label: 'Reading Practice', href: '/practice/reading', category: 'Skill' },

  { label: 'Read Aloud', href: '/practice/speaking/read-aloud', category: 'Speaking' },
  { label: 'Repeat Sentence', href: '/practice/speaking/repeat-sentence', category: 'Speaking' },
  { label: 'Describe Image', href: '/practice/speaking/describe-image', category: 'Speaking' },
  { label: 'Retell Lecture', href: '/practice/speaking/retell-lecture', category: 'Speaking' },
  { label: 'Answer Short Question', href: '/practice/speaking/answer-short-question', category: 'Speaking' },
  { label: 'Summarize Spoken Test', href: '/practice/speaking/summarize-spoken-test', category: 'Speaking' },
  { label: 'Response to a Situation', href: '/practice/speaking/response-to-a-situation', category: 'Speaking' },
  { label: 'Personal Introduction', href: '/practice/speaking/personal-introduction', category: 'Speaking' },

  { label: 'Summarize Written Text', href: '/practice/writing/summarize-written-text', category: 'Writing' },
  { label: 'Essay', href: '/practice/writing/essay', category: 'Writing' },

  { label: 'Fill in the Blanks', href: '/practice/reading/fill-in-the-blanks', category: 'Reading' },
  { label: 'Re-order Paragraphs', href: '/practice/reading/re-order-paragraphs', category: 'Reading' },
  { label: 'Multiple Choice, Single Answer', href: '/practice/reading/multiple-choice-single', category: 'Reading' },

  { label: 'Summarize Spoken Test', href: '/practice/listening/summarize-spoken-test', category: 'Listening' },
  { label: 'Multiple Choice, Single Answer', href: '/practice/listening/multiple-choice-single', category: 'Listening' },
  { label: 'Fill in the Blanks', href: '/practice/listening/fill-in-the-blanks', category: 'Listening' },

  { label: 'Vocabulary', href: '/resources', category: 'Resource' },
  { label: 'Score Prediction', href: '/resources', category: 'Resource' },
  { label: 'Sample Answer', href: '/resources', category: 'Resource' },
  { label: 'Audio Materials', href: '/resources', category: 'Resource' },
  { label: 'Tips & Strategies', href: '/resources', category: 'Resource' },
  { label: 'AI Speaking', href: '/resources', category: 'Resource' },
  { label: 'Sample Question', href: '/resources', category: 'Resource' },
];

const MAX_RESULTS = 8;

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export default function SiteSearch({
  variant,
  onNavigate,
}: {
  variant: 'inline' | 'drawer';
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
      .reduce<{ category: string; items: SearchEntry[] }[]>((acc, item) => {
        const existing = acc.find((g) => g.category === item.category);
        if (existing) existing.items.push(item);
        else acc.push({ category: item.category, items: [item] });
        return acc;
      }, []);
  }, [query]);

  const trimmed = query.trim();
  const showPanel = open && trimmed.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // A stale query left over from the previous page would pop an open panel on
  // the next one, so both the text and the panel reset whenever the route moves.
  useEffect(() => {
    setQuery('');
    setOpen(false);
  }, [pathname]);

  function go(href: string) {
    setQuery('');
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = groups[0]?.items[0];
    if (first) go(first.href);
  }

  const panelClass =
    variant === 'inline'
      ? 'absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto'
      : 'mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 max-h-72 overflow-y-auto';

  const panel = showPanel ? (
    <div className={panelClass}>
      {groups.map((group) => (
        <div key={group.category}>
          <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {group.category}
          </div>
          {group.items.map((item) => (
            <button
              key={`${variant}-${group.category}-${item.label}`}
              type="button"
              onClick={() => go(item.href)}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
      {groups.length === 0 && (
        <p className="px-4 py-2 text-sm text-gray-400">No matches for &quot;{trimmed}&quot;</p>
      )}
    </div>
  ) : null;

  if (variant === 'drawer') {
    return (
      <div ref={rootRef} className="relative mb-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search here...."
            aria-label="Search site"
            value={query}
            onChange={handleChange}
            className="w-full min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
          />
        </div>
        {panel}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-[7px] hover:border-indigo-300 transition-colors">
          <input
            type="text"
            placeholder="Search here...."
            aria-label="Search site"
            value={query}
            onChange={handleChange}
            className="bg-transparent text-sm text-gray-500 outline-none w-[110px] xl:w-[130px] placeholder-gray-400"
          />
          <SearchIcon />
        </div>
      </form>
      {panel}
    </div>
  );
}
