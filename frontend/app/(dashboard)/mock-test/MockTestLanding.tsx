"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { errorMessage } from "@/lib/api/client";
import { mockTestApi } from "@/lib/api/mockTest";
import type { MockAttemptSummary, MockTest } from "@/types";

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

function iconFor(kind: string): React.ReactNode {
  return (
    <svg className="w-8 h-8 text-[#3008F8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const SECTION_MOCKS = [
  {
    key: "speaking",
    title: "Speaking",
    description: "Test your speaking skills with real exam questions.",
    href: "/practice/speaking",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />,
  },
  {
    key: "writing",
    title: "Writing",
    description: "Test your writing skills with real exam questions.",
    href: "/practice/writing",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
  },
  {
    key: "listening",
    title: "Listening",
    description: "Test your listening skills with real exam questions.",
    href: "/practice/listening",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />,
  },
  {
    key: "reading",
    title: "Reading",
    description: "Test your reading skills with real exam questions.",
    href: "/practice/reading",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />,
  },
];

export function MockTestLanding() {
  const router = useRouter();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [attempts, setAttempts] = useState<MockAttemptSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<number | null>(null);

  const refresh = useCallback(() => {
    mockTestApi
      .list()
      .then((data) => setTests(data.items))
      .catch((err) => setError(errorMessage(err)));
    mockTestApi
      .attempts(10)
      .then((data) => setAttempts(data.items))
      .catch(() => {
        /* attempts are optional for guests */
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleStart(id: number) {
    setStartingId(id);
    try {
      const start = await mockTestApi.start(id);
      router.push(`/mock-test/take/${start.attempt_id}`);
    } catch (err) {
      setError(errorMessage(err));
      setStartingId(null);
    }
  }

  const completed = attempts.filter((a) => a.status === "completed");
  const bestScore = completed.reduce((best, a) => Math.max(best, a.total_score ?? 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F5F3FF] overflow-hidden">
        <div className="page-container">
          <div className="breadcrumbs w-full lg:w-[44%] pt-7">
            <Link href="/">Home</Link><Chevron /><span>Mock Test</span><Chevron />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start min-h-0 lg:min-h-[486px]">
            <div className="w-full lg:w-[44%] pt-9 pb-10 lg:pb-14 lg:pr-6 lg:flex-shrink-0 min-w-0">
              <h1 className="text-[28px] sm:text-[35px] font-extrabold text-gray-900 leading-[1.18] mb-5">
                Master the Mock <span className="text-indigo-600">Test Experience</span>
              </h1>
              <p className="text-gray-500 text-[17px] leading-relaxed mb-8 max-w-[460px] font-medium">
                Experience full-length PTE mock tests with AI-powered scoring,
                detailed analytics, and real exam conditions.
              </p>

              <div className="w-full max-w-[612px] min-h-[69px] flex flex-wrap items-center gap-x-[17px] gap-y-3 rounded-[7px] border-[1.5px] border-gray-200 p-3 sm:p-[7px] bg-white" style={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-[15px] leading-tight">{completed.length}</div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide leading-tight">Tests Completed</div>
                  </div>
                </div>
                <div className="w-[1.5px] h-[35px] bg-gray-200 flex-shrink-0 hidden sm:block" />
                <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-[15px] leading-tight">{bestScore || "—"}</div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide leading-tight">Best Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[684px] relative h-[316px] mt-10 lg:w-[52%] lg:min-w-0 lg:flex-shrink-0 overflow-visible">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#e0e5f2] border border-gray-200">
                <Image src="/images/ChatGPT Image Jun 10, 2026, 12_20_03 PM 1.png" alt="Student with headphones" fill className="object-contain" />
              </div>
              <div className="absolute top-0 left-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 border border-gray-100 w-[162px]">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-800 leading-tight">Full length Mock Test</div>
                  <div className="text-[10px] text-gray-500 leading-tight">Real exam conditions</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 flex flex-col border border-gray-100 w-[162px]">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Your Best Score</div>
                <div className="text-xl font-extrabold text-gray-900">{bestScore || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="page-container">
          {error && (
            <div className="task-submit-error" style={{ marginBottom: "1rem" }}>
              <span className="task-submit-error-icon">⚠</span> {error}
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Mock Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {(loading ? [] : tests).map((test) => (
              <div key={test.id} className="bg-white rounded-2xl border-2 border-[#D9D9D9] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-[67px] h-[67px] rounded-full bg-[#CBC1FD] flex items-center justify-center mb-4">
                  {iconFor(test.kind)}
                </div>
                <h3 className="text-[19px] font-bold text-gray-900 mb-2 text-center">{test.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{test.description}</p>

                <div className="flex w-full justify-between px-2 text-xs text-gray-600 mb-6 font-medium">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {test.duration_minutes}m
                  </div>
                  <div className="flex items-center text-right">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {test.category ? `${test.category[0].toUpperCase()}${test.category.slice(1)}` : "All sections"}
                  </div>
                </div>

                <button
                  className="w-full bg-[#3008F8] hover:bg-[#2506c4] text-white font-semibold py-3 rounded-lg mb-4 transition-colors disabled:opacity-50"
                  onClick={() => handleStart(test.id)}
                  disabled={startingId === test.id}
                >
                  {startingId === test.id ? "Starting…" : "Start Test"}
                </button>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Section -wise Mock</h2>
            <div className="flex flex-col gap-6">
              {SECTION_MOCKS.map((s) => (
                <div
                  key={s.key}
                  className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-[#F4F2FD] border-2 border-[#D9D9D9] rounded-xl px-3 py-4 md:py-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#CBC1FD] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#3008F8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {s.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="text-[17px] font-semibold text-gray-900 leading-tight">{s.title}</div>
                      <div className="text-[15px] text-gray-900 mt-1">{s.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 md:mr-4">
                    <div>
                      <div className="font-bold text-gray-900 text-[17px] leading-tight">20</div>
                      <div className="text-[15px] text-gray-500">Questions</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-[17px] leading-tight">50 mins</div>
                      <div className="text-[15px] text-gray-500">Duration</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:pr-6">
                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-5 py-4 text-[#3008F8] font-bold text-[17px] hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      Start Free Practice
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </Link>
                    <span className="hidden md:inline text-gray-900 text-xl font-bold" aria-hidden="true">›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Mock Test Attempts</h2>
            <div className="overflow-x-auto border-2 border-[#D9D9D9BF] rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#000000BF]">
                    <th className="py-5 px-4 font-bold text-gray-900 w-1/3">Test Name</th>
                    <th className="py-5 px-4 font-bold text-gray-900">Score</th>
                    <th className="py-5 px-4 font-bold text-gray-900">Status</th>
                    <th className="py-5 px-4 font-bold text-gray-900">Date</th>
                    <th className="py-5 px-4 font-bold text-gray-900 text-right">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                        No mock test attempts yet.
                      </td>
                    </tr>
                  )}
                  {attempts.map((attempt) => {
                    const pct = attempt.max_score ? Math.round(((attempt.total_score ?? 0) / attempt.max_score) * 100) : 0;
                    return (
                      <tr key={attempt.id} className="border-b border-[#000000BF] hover:bg-gray-50 transition-colors">
                        <td className="py-5 px-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-[#3B28CC] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span className="text-gray-900 font-medium">{attempt.test_name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700 font-medium">
                          {attempt.total_score != null ? `${attempt.total_score}/${attempt.max_score}` : "—"}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`task-status-pill${attempt.status === "completed" ? " recorded" : ""}`}>
                            {attempt.status === "completed" ? `${pct}%` : attempt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700 font-medium">{formatDate(attempt.started_at)}</td>
                        <td className="py-4 px-4 text-right">
                          {attempt.status === "completed" ? (
                            <Link href={`/mock-test/result/${attempt.id}`} className="text-[#3B28CC] font-semibold hover:underline">View</Link>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}