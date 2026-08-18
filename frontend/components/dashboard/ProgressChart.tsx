'use client';

import Link from 'next/link';

interface SectionCardProps {
  title: string;
  description: string;
  percentage: number;
  href: string;
  icon: React.ReactNode;
  color: string;
}

function CircularProgress({ pct, color }: { pct: number; color: string }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#EEF0FF" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[15px] font-extrabold text-gray-800">{pct}%</span>
      </div>
    </div>
  );
}

function SectionCard({ title, description, percentage, href, icon, color }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 flex-1 min-w-0 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#3008F8]" style={{ border: '1px solid #3008F8', backgroundColor: 'rgba(48, 8, 248, 0.08)' }}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-[14px]">{title}</h3>
          <p className="text-[12px] text-gray-400 leading-snug">{description}</p>
        </div>
      </div>
      <CircularProgress pct={percentage} color={color} />
      <Link
        href={href}
        id={`practice-${title.toLowerCase()}-btn`}
        className="block text-center bg-[#3008F8] hover:bg-[#2506c4] text-white font-bold text-[13px] rounded-xl py-2 transition-colors shadow-sm hover:shadow"
      >
        Practice
      </Link>
    </div>
  );
}

interface PracticeSectionsProps {
  speakingPct: number;
  writingPct: number;
  readingPct: number;
  listeningPct: number;
}

export default function PracticeSections({ speakingPct, writingPct, readingPct, listeningPct }: PracticeSectionsProps) {
  const sections = [
    {
      title: 'Speaking',
      description: 'Improve your pronunciation and fluency.',
      percentage: speakingPct,
      href: '/practice/speaking',
      color: '#3008F8',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: 'Writing',
      description: 'Enhance your grammar and writing skills.',
      percentage: writingPct,
      href: '/practice/writing',
      color: '#3008F8',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Reading',
      description: 'Strengthen comprehension skills.',
      percentage: readingPct,
      href: '/practice/reading',
      color: '#3008F8',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Listening',
      description: 'Develop your listening accuracy.',
      percentage: listeningPct,
      href: '/practice/listening',
      color: '#3008F8',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414M3 12a9 9 0 019 9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D9D9D9]">
      <h2 className="text-[21px] font-extrabold text-black mb-4">Practice by Section</h2>
      <div className="grid grid-cols-4 gap-4">
        {sections.map((s) => (
          <SectionCard key={s.title} {...s} />
        ))}
      </div>
    </div>
  );
}
