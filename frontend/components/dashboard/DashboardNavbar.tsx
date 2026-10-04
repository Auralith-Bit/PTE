'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MobileDrawer from '@/components/common/MobileDrawer';
import NotificationBell from '@/components/common/NotificationBell';
import SiteSearch from '@/components/common/SiteSearch';

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Mock Tests', href: '/mock-test' },
    { name: 'Courses', href: '/courses' },
    { name: 'Resources', href: '/resources' },
  ];

  const practiceLinks = [
    { name: 'Speaking Practice', href: '/practice/speaking' },
    { name: 'Writing Practice', href: '/practice/writing' },
    { name: 'Listening Practice', href: '/practice/listening' },
    { name: 'Reading Practice', href: '/practice/reading' },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigating away should never leave the drawer or dropdown open.
  useEffect(() => {
    setDrawerOpen(false);
    setPracticeOpen(false);
  }, [pathname]);

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const firstName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'User';
  const initial = firstName[0]?.toUpperCase() ?? 'U';

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <nav className="w-full bg-[#F5F3FF] sticky top-0 z-50 border-b border-indigo-100">
      <div className="h-[65px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-6">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/PTElogo.png"
            alt="PTE Prep"
            width={44}
            height={44}
            className="rounded-full bg-[rgba(74,45,219,0.15)]"
          />
          <span className="hidden min-[400px]:inline text-[20px] font-[800] tracking-tight">
            <span className="text-indigo-600">PTE.</span>
            <span className="text-indigo-600">Prep</span>
          </span>
        </Link>

        {/* Center Nav Links — desktop only, the drawer handles small screens.
            `overflow-x-clip` (not `overflow-hidden`) absorbs the width deficit
            the `shrink-0` right cluster cannot, but only on the x axis: the
            Practice menu is `absolute top-full` and hangs below this row, so
            clipping both axes painted it at zero height. `clip` pairs with a
            `visible` cross axis without forcing it to `auto`, so the menu
            escapes downward and the row still cannot widen the page. */}
        <div className="hidden lg:flex items-center gap-1 min-w-0 overflow-x-clip">
          {/* Dashboard link */}
          <Link
            href="/dashboard"
            className={`px-4 py-[6px] rounded-full text-[15px] font-semibold transition-all duration-150 ${
              isActive('/dashboard')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            Dashboard
          </Link>

          {/* Practice Dropdown — hover for pointer, click for touch/keyboard */}
          <div
            className="relative"
            onMouseEnter={() => setPracticeOpen(true)}
            onMouseLeave={() => setPracticeOpen(false)}
          >
            <button
              type="button"
              onClick={() => setPracticeOpen((v) => !v)}
              aria-expanded={practiceOpen}
              aria-haspopup="true"
              className={`px-4 py-[6px] rounded-full text-[15px] font-semibold transition-all duration-150 inline-flex items-center gap-1 ${
                pathname.startsWith('/practice')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              Practice
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${practiceOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {practiceOpen && (
              <div className="absolute top-full left-0 pt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {practiceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 text-[14px] font-semibold transition-colors duration-100 ${
                      pathname === item.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.filter(l => l.name !== 'Dashboard').map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-[6px] rounded-full text-[15px] font-semibold transition-all duration-150 ${
                isActive(link.href)
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

{/* Right: Search + Bell + User. `min-w-0` lets the group shrink as
              width is lost; `shrink-0` on the items themselves keeps each
              control from being squashed into an unusable target. */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
          {/* Search Bar — inline on desktop; the drawer offers a full-width field */}
          <SiteSearch variant="inline" />

          {/* Notification Bell — items derived server-side from graded work */}
          <NotificationBell />

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              id="user-menu-btn"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
            >
              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initial}
              </div>
              {/* Name only when the bar genuinely has room. This cluster is
                  `shrink-0`, so showing the name at `sm` (640px) forced the bar
                  ~48px wider than the viewport between lg (1024px) and ~1070px,
                  where the centre nav is visible but the name plus search plus
                  bell no longer fit. The avatar and chevron stay at every width. */}
              <span className="hidden min-[1180px]:inline max-w-[120px] truncate text-[14px] font-semibold text-gray-700">{firstName}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-[13px] font-bold text-gray-800">{user?.full_name ?? firstName}</p>
                  <p className="text-[12px] text-gray-400 truncate">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2 text-[14px] font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    id="logout-btn"
                    className="w-full flex items-center gap-3 px-4 py-2 text-[14px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger — small screens only */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="lg:hidden grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} title="Menu">
        <nav className="flex flex-col p-4">
          {/* Search — inline search is lg-only, so the drawer carries it below that */}
          <SiteSearch variant="drawer" onNavigate={closeDrawer} />

          {/* Notifications — the top bar bell is cramped at phone widths, so the
              drawer carries a full-width entry with its own unread count. */}
          <div className="mb-3">
            <NotificationBell onNavigate={closeDrawer} />
          </div>

          <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-gray-800">
                {user?.full_name ?? firstName}
              </p>
              <p className="truncate text-[12px] text-gray-400">{user?.email}</p>
            </div>
          </div>

          <DashboardDrawerLink href="/dashboard" label="Dashboard" active={isActive('/dashboard')} onClick={closeDrawer} />
          <DashboardDrawerLink
            href="/practice"
            label="Practice"
            active={pathname.startsWith('/practice')}
            onClick={closeDrawer}
          />

          <p className="mt-3 mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Practice modules
          </p>
          {practiceLinks.map((item) => (
            <DashboardDrawerLink
              key={item.href}
              href={item.href}
              label={item.name}
              indent
              active={pathname === item.href}
              onClick={closeDrawer}
            />
          ))}

          <p className="mt-3 mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Explore
          </p>
          {navLinks.filter((l) => l.name !== 'Dashboard').map((link) => (
            <DashboardDrawerLink
              key={link.name}
              href={link.href}
              label={link.name}
              active={isActive(link.href)}
              onClick={closeDrawer}
            />
          ))}
          <DashboardDrawerLink href="/ai-score" label="AI Score" active={isActive('/ai-score')} onClick={closeDrawer} />

          <p className="mt-3 mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Account
          </p>
          <DashboardDrawerLink href="/dashboard/profile" label="My Profile" onClick={closeDrawer} />

          <Link
            href="/courses#choose-learning-path"
            onClick={closeDrawer}
            className="mt-3 block rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#4F46E5] px-4 py-2.5 text-center text-[14px] font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Go Premium
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-lg border border-red-200 px-3 py-2.5 text-left text-[15px] font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </nav>
      </MobileDrawer>
    </nav>
  );
}

function DashboardDrawerLink({
  href,
  label,
  active,
  indent,
  onClick,
}: {
  href: string;
  label: string;
  active?: boolean;
  indent?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-lg px-3 py-2.5 text-[15px] font-semibold transition-colors ${
        indent ? 'pl-6 text-[14px]' : ''
      } ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      {label}
    </Link>
  );
}
