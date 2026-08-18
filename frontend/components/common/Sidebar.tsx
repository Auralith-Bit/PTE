'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarSections = [
  {
    label: 'PRACTICE',
    items: [
      {
        name: 'Speaking',
        href: '/practice/speaking',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        ),
      },
      {
        name: 'Writing',
        href: '/practice/writing',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        name: 'Reading',
        href: '/practice/reading',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        name: 'Listening',
        href: '/practice/listening',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M3 12a9 9 0 019 9" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'TESTS',
    items: [
      {
        name: 'Mock Test',
        href: '/mock-test',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        name: 'AI Score',
        href: '/ai-score',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'LEARNING',
    items: [
      {
        name: 'Courses',
        href: '/courses',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        name: 'Resources',
        href: '/resources',
        icon: (
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex shrink-0 h-[calc(100vh-65px)] sticky top-[65px] bg-[#F5F3FF] border-r border-[#D9D9D9] flex-col overflow-y-auto py-4" style={{ width: 'clamp(200px, 16.56vw, 325px)' }}>
      <div className="flex-1 px-4 flex flex-col">

        {/* Dashboard link */}
        <Link
          href="/dashboard"
          id="sidebar-dashboard"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-150 mb-5 ${
            isActive('/dashboard')
              ? 'bg-[#E0DBFF] text-[#3008F8]'
              : 'text-gray-600 hover:bg-[#E0DBFF] hover:text-[#3008F8]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        {/* Sections */}
        {sidebarSections.map((section, sIdx) => (
          <div key={section.label} className="mb-4">
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-2">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`sidebar-${item.name.toLowerCase().replace(' ', '-')}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                    isActive(item.href)
                      ? 'bg-[#E0DBFF] text-[#3008F8]'
                      : 'text-gray-600 hover:bg-[#E0DBFF] hover:text-[#3008F8]'
                  }`}
                >
                  <span className={isActive(item.href) ? 'text-[#3008F8]' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>
            {sIdx < sidebarSections.length - 1 && (
              <div className="border-b border-gray-200 mt-3" />
            )}
          </div>
        ))}
      </div>

      {/* Go Premium Card */}
      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#4F46E5] p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">&#128081;</span>
          <span className="font-bold text-[16px]">Go Premium</span>
        </div>
        <p className="text-[13px] text-indigo-100 leading-relaxed mb-4">
          Unlock unlimited practice, AI feedback and personalized insights.
        </p>
        <Link
          href="/upgrade"
          id="upgrade-premium-btn"
          className="block text-center bg-white/20 backdrop-blur-sm text-white font-bold text-[13px] rounded-xl py-2.5 hover:bg-white/30 transition-colors border border-white/30"
        >
          Upgrade Now
        </Link>
      </div>
    </aside>
  );
}
