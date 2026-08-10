'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [practiceOpen, setPracticeOpen] = useState(false);

  const navLinks = [
    { name: 'Mock Test', href: '/mock-test' },
    { name: 'Courses', href: '/courses' },
    { name: 'Resources', href: '/resources' },
  ];

  const practiceDropdown = [
    { name: 'Speaking Practice', href: '/practice/speaking' },
    { name: 'Writing Practice', href: '/practice/writing' },
    { name: 'Listening Practice', href: '/practice/listening' },
    { name: 'Reading Practice', href: '/practice/reading' },
  ];

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIndex = useMemo<{ label: string; href: string; category: string }[]>(() => [
    { label: 'Home', href: '/', category: 'Page' },
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
    { label: 'Summarize Spoken Text', href: '/practice/speaking/summarize-spoken-test', category: 'Speaking' },
    { label: 'Response to a Situation', href: '/practice/speaking/response-to-a-situation', category: 'Speaking' },
    { label: 'Summarize Written Text', href: '/practice/writing', category: 'Writing' },
    { label: 'Essay', href: '/practice/writing', category: 'Writing' },
    { label: 'Reading & Writing: Fill in the Blanks', href: '/practice/reading', category: 'Reading' },
    { label: 'Multiple Choice, Multiple Answers', href: '/practice/reading', category: 'Reading' },
    { label: 'Re-order Paragraphs', href: '/practice/reading', category: 'Reading' },
    { label: 'Reading: Fill in the Blanks', href: '/practice/reading', category: 'Reading' },
    { label: 'Multiple Choice, Single Answer', href: '/practice/reading', category: 'Reading' },
    { label: 'Highlight Correct Summary', href: '/practice/reading', category: 'Reading' },
    { label: 'Summarize Spoken Test', href: '/practice/listening/summarize-spoken-test', category: 'Listening' },
    { label: 'Multiple Choice, Multiple Answers', href: '/practice/listening/multiple-choice-multiple-answers', category: 'Listening' },
    { label: 'Multiple Choice, Single Answer', href: '/practice/listening/multiple-choice-single-answer', category: 'Listening' },
    { label: 'Fill in the Blanks', href: '/practice/listening/fill-in-the-blanks', category: 'Listening' },
    { label: 'Highlight Correct Summary', href: '/practice/listening/highlight-correct-summary', category: 'Listening' },
    { label: 'Vocabulary', href: '/resources', category: 'Resource' },
    { label: 'Score Prediction', href: '/resources', category: 'Resource' },
    { label: 'Sample Answer', href: '/resources', category: 'Resource' },
    { label: 'Audio Materials', href: '/resources', category: 'Resource' },
    { label: 'Tips & Strategies', href: '/resources', category: 'Resource' },
    { label: 'AI Speaking', href: '/resources', category: 'Resource' },
    { label: 'Sample Question', href: '/resources', category: 'Resource' },
  ], []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchIndex
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, 8)
      .reduce<{ category: string; items: typeof searchIndex }[]>((groups, item) => {
        const existing = groups.find((g) => g.category === item.category);
        if (existing) existing.items.push(item);
        else groups.push({ category: item.category, items: [item] });
        return groups;
      }, []);
  }, [searchQuery, searchIndex]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (filteredResults.length > 0) {
      router.push(filteredResults[0].items[0].href);
      setShowResults(false);
      setSearchQuery('');
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setShowResults(true);
  }

  function handleResultClick(href: string) {
    router.push(href);
    setShowResults(false);
    setSearchQuery('');
  }

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide Navbar on auth pages — they have their own headers
  const authRoutes = ['/signup', '/login'];
  const isAuthPage = authRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (isAuthPage) return null;

  return (
    <nav className="w-full bg-[#F5F3FF] sticky top-0 z-50">
      <div className="h-[65px] px-8 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/images/PTElogo.png" alt="PTE Prep" width={50} height={50} className="rounded-full bg-[rgba(74,45,219,0.2)]" />
          <span className="text-[22px] font-[800] tracking-tight">
            <span className="text-indigo-600">PTE.</span>
            <span className="text-indigo-600">Prep</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-7">
          {/* Home */}
          <Link
            href="/"
            className={`text-[18px] font-bold pb-0.5 transition-all duration-150 ${
              pathname === '/'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-indigo-600 hover:text-indigo-700 border-b-2 border-transparent'
            }`}
          >
            Home
          </Link>

          {/* Practice Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPracticeOpen(true)}
            onMouseLeave={() => setPracticeOpen(false)}
          >
            <Link
              href="/practice"
              className={`text-[18px] font-bold pb-0.5 transition-all duration-150 inline-flex items-center gap-1 ${
                pathname.startsWith('/practice')
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-indigo-600 hover:text-indigo-700 border-b-2 border-transparent'
              }`}
            >
              Practice
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${practiceOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {practiceOpen && (
              <div className="absolute top-full left-0 pt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                {practiceDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 text-[15px] font-semibold transition-colors duration-100 ${
                      pathname === item.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.href.includes('speaking') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      )}
                      {item.href.includes('writing') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      )}
                      {item.href.includes('listening') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 10a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4zM5.636 15.364A9 9 0 015 12a9 9 0 01.636-3.364" />
                      )}
                      {item.href.includes('reading') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      )}
                    </svg>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[18px] font-bold pb-0.5 transition-all duration-150 ${
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-indigo-600 hover:text-indigo-700 border-b-2 border-transparent'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Search + Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div ref={searchRef} className="relative">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-9 bg-gray-50 border border-gray-200 rounded-lg px-3 py-[7px] hover:border-indigo-300 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search here...."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent text-sm text-gray-500 outline-none w-[130px] placeholder-gray-400"
                />
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
            {showResults && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                {filteredResults.map((group) => (
                  <div key={group.category}>
                    <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {group.category}
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleResultClick(item.href)}
                        className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Log in Button */}
          <Link
            href="/login"
            className="px-5 py-[7px] text-[14px] font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log in
          </Link>

          {/* Sign Up Button */}
          <Link
            href="/register"
            className="px-5 py-[7px] text-[14px] font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
