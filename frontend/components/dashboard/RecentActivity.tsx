'use client';

import type { ActivityItem } from '@/types';

interface RecentActivityProps {
  activities: ActivityItem[];
}

function StatusIcon({ status }: { status: ActivityItem['status'] }) {
  if (status === 'completed') {
    return (
      <div className="w-5 h-5 rounded-full bg-[#3008F8] flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === 'in_progress') {
    return (
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(48, 8, 248, 0.15)' }}>
        <div className="w-2 h-2 rounded-full bg-[#3008F8]" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 shrink-0" />
  );
}

function StatusBadge({ status }: { status: ActivityItem['status'] }) {
  const map = {
    completed: { label: 'Completed', cls: 'text-indigo-600 bg-indigo-50' },
    in_progress: { label: 'In Progress', cls: 'text-amber-600 bg-amber-50' },
    not_started: { label: 'Not Started', cls: 'text-gray-400 bg-gray-50' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '2px solid #D9D9D9' }}>
      <h2 className="text-[21px] font-extrabold text-black mb-4">Recent Activity</h2>
      <div className="flex flex-col gap-0">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 rounded-xl px-2 transition-colors cursor-pointer"
          >
            <StatusIcon status={activity.status} />
            <span className="flex-1 text-[14px] font-semibold text-gray-700">{activity.title}</span>
            <StatusBadge status={activity.status} />
            <span className="text-[12px] text-gray-400 font-medium w-14 text-right">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
