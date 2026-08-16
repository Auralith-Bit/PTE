'use client';

import Image from 'next/image';
import Link from 'next/link';

interface UpcomingCourseProps {
  courseName: string;
  progressPct: number;
}

export default function UpcomingCourse({ courseName, progressPct }: UpcomingCourseProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📘</span>
          <h2 className="text-[15px] font-extrabold text-gray-800">Upcoming Course</h2>
        </div>
        <Image
          src="/images/cap book 1.png"
          alt="Course"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <p className="text-[14px] font-bold text-gray-700 mb-1">{courseName}</p>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-gray-400 font-medium">{progressPct}% Complete</span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <Link
        href="/courses"
        id="continue-course-btn"
        className="block text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[13px] rounded-xl py-2 transition-colors border border-indigo-200"
      >
        Continue Course →
      </Link>
    </div>
  );
}
