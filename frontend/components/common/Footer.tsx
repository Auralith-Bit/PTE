'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type LinkItem = { label: string; href?: string; icon?: string };

const footerColumns: Record<string, LinkItem[]> = {
  Platform: [
    { label: 'Practice', href: '/practice', icon: '/images/Group 10.png' },
    { label: 'Mock Test', icon: '/images/Vector (1).png' },
    { label: 'Study Plan', icon: '/images/Group.png' },
    { label: 'Speaking Practice', href: '/practice/speaking', icon: '/images/Group (1).png' },
    { label: 'Vocabulary', icon: '/images/Vector (1).png' },
  ],
  Courses: [
    { label: 'PTE Courses', icon: '/images/Vector (2).png' },
    { label: 'Beginner Courses', icon: '/images/Vector (2).png' },
    { label: 'Advance Courses', icon: '/images/Vector (2).png' },
    { label: 'Free Courses', icon: '/images/Vector (2).png' },
    { label: 'Live Courses', icon: '/images/Vector (2).png' },
  ],
  Resources: [
    { label: 'Study Guide', icon: '/images/Group.png' },
    { label: 'Sample Questions', icon: '/images/Vector (4).png' },
    { label: 'Download', icon: '/images/Vector (3).png' },
    { label: 'Blogs and Tips', icon: '/images/Vector (4).png' },
    { label: 'About Us', icon: '/images/Vector (4).png' },
  ],
  Support: [
    { label: 'Help Center', icon: '/images/Vector (5).png' },
    { label: 'FAQ', icon: '/images/Vector (6).png' },
    { label: 'Privacy Policy', icon: '/images/Vector (7).png' },
    { label: 'Terms of Services', icon: '/images/Vector (4).png' },
    { label: 'Contact Us', icon: '/images/Vector (4).png' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#F5F3FF]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-5 gap-8 mb-8">

          {/* Brand Column */}
          <div className="col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/PTElogo.png" alt="PTE Prep Logo" width={48} height={48} className="rounded-full bg-[rgba(74,45,219,0.2)] flex-shrink-0" />
              <span className="text-[17px] font-bold">
                <span className="text-gray-900">PTE.</span>
                <span className="text-gray-900">Prep</span>
              </span>
            </div>
            <p className="text-[15px] text-gray-900 leading-relaxed mb-5">
              Your complete PTE preparation partner. Practice daily, Achieve your target score with
              confidence.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerColumns).map(([category, links]) => (
            <div key={category} className="border-l border-gray-300 pl-6">
              <h4 className="font-bold text-gray-900 text-[21px] mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href || '#'}
                      className="text-[15px] text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                    >
                      {item.icon ? (
                        <Image
                          src={item.icon}
                          alt=""
                          width={14}
                          height={14}
                          className="flex-shrink-0"
                        />
                      ) : (
                        <svg
                          className="w-3 h-3 text-indigo-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-[107px] mb-5">
          {/* Card 1: Security Badge */}
          <div className="flex items-center gap-3 h-[77px] rounded-[10px] bg-white border border-gray-200 pl-[10px] pr-[27px] w-[320px]" style={{ boxShadow: '1px 1px 10px 0px #00000033' }}>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">100% Secure & Trusted</p>
                <p className="text-xs text-gray-500 mt-[1px] leading-relaxed">Your data is safe with us. We never share your information.</p>
            </div>
          </div>

          {/* Card 2: Stay Updated */}
          <div className="flex items-center gap-3 h-[77px] rounded-[10px] bg-white border border-gray-200 pl-[10px] pr-[27px]  w-[320px]" style={{ boxShadow: '1px 1px 10px 0px #00000033' }}>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Stay Updated</p>
              <p className="text-xs text-gray-500 mt-[1px] leading-relaxed">Subscribe to get the latest tips, free materials and exclusive offers.</p>
            </div>
          </div>

          {/* Card 3: Email + Subscribe */}
          <div className="flex items-center gap-3 h-[77px] rounded-[10px] bg-[#F5F3FF] px-[27px] flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 bg-white placeholder-gray-400 transition-colors"
                />
                <button
                  onClick={() => setEmail('')}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        {/* Copyright Bar */}
        <div className="w-full h-[53px] rounded-[10px] bg-[#3008F826] pt-[10px] pb-[10px] pl-[27px] pr-[27px] flex items-center justify-between mt-[10px]">
          <p className="text-[14px] text-gray-900">© 2026 PTE Prep. All right reserved.</p>
          <p className="text-[14px] text-gray-900">Made with passion for your success</p>
        </div>
      </div>
    </footer>
  );
}
