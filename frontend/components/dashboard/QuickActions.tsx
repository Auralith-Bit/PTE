'use client';

import Link from 'next/link';

const quickActions = [
  {
    label: 'Start Speaking',
    href: '/practice/speaking',
    id: 'quick-speaking-btn',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    label: 'Start Writing',
    href: '/practice/writing',
    id: 'quick-writing-btn',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: 'Start Reading',
    href: '/practice/reading',
    id: 'quick-reading-btn',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Start Listening',
    href: '/practice/listening',
    id: 'quick-listening-btn',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M3 12a9 9 0 019 9" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-[17px] font-extrabold text-gray-800 mb-3">Quick Actions</h2>
      <div className="flex gap-3 flex-wrap">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            id={action.id}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-indigo-200 text-indigo-600 font-bold text-[13px] rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {action.icon}
            {action.label}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
