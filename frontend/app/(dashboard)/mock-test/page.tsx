import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/common/Footer';

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

export default function MockTestPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero Section */}
      <section className="bg-[#F5F3FF] overflow-hidden">
        <div className="page-container">
          <div className="breadcrumbs w-[44%] pt-7">
            <Link href="/">Home</Link><Chevron /><span>Mock Test</span><Chevron />
          </div>
          <div className="flex items-start min-h-[486px]">
            {/* Left Content */}
            <div className="w-[44%] pt-9 pb-14 pr-6 flex-shrink-0">
              <h1 className="text-[35px] font-extrabold text-gray-900 leading-[1.18] mb-5">
                Master the Mock <span className="text-indigo-600">Test Experience</span>
                <br />
                <span className="text-indigo-600">Get Ready</span> for the Real Exam.
              </h1>
              <p className="text-gray-500 text-[17px] leading-relaxed mb-8 max-w-[460px] font-medium">
                Experience full-length PTE mock tests with AI-powered scoring,
                detailed analytics, and real exam conditions.
              </p>

              {/* Stats Row */}
              <div className="w-full max-w-[612px] h-[69px] flex items-center gap-[17px] rounded-[7px] border-[1.5px] border-gray-200 p-[7px] bg-white" style={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}>
                {/* Stat 1 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-[15px] leading-tight">12</div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide leading-tight">Tests Attempted</div>
                  </div>
                </div>

                <div className="w-[1.5px] h-[35px] bg-gray-200 flex-shrink-0" />

                {/* Stat 2 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 21v-4M8 21h8M5 10a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M7 5v12a3 3 0 003 3h4a3 3 0 003-3V5M17 5H7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-[15px] leading-tight">88%</div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide leading-tight">Average Score</div>
                  </div>
                </div>

                <div className="w-[1.5px] h-[35px] bg-gray-200 flex-shrink-0" />

                {/* Stat 3 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2.5}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-[15px] leading-tight">23 hours</div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide leading-tight">Timed Practice</div>
                  </div>
                </div>

                <div className="w-[1.5px] h-[35px] bg-gray-200 flex-shrink-0" />

                {/* Stat 4 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-[15px] leading-tight">85</div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide leading-tight">Best Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="w-[684px] relative h-[316px] mt-10 flex-shrink-0 overflow-visible">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#e0e5f2] border border-gray-200">
                 <Image src="/images/ChatGPT Image Jun 10, 2026, 12_20_03 PM 1.png" alt="Student with headphones" fill className="object-contain" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute top-0 left-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 border border-gray-100 w-[162px]">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-800 leading-tight">Full length Mock Test</div>
                  <div className="text-[10px] text-gray-500 leading-tight">Timed. 2h:15m</div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 flex flex-col border border-gray-100 w-[162px]">
                 <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Your Average Score</div>
                 <div className="text-xl font-extrabold text-gray-900">88</div>
                 <div className="text-[10px] text-gray-600 font-semibold">
                   <span className="text-red-500 font-bold">-8</span> This Week
                 </div>
              </div>

              <div className="absolute bottom-0 right-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 flex flex-col border border-gray-100 w-[162px]">
                 <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Tests Attempted</div>
                 <div className="flex items-center gap-1.5">
                   <span className="text-xl font-extrabold text-gray-900">12</span>
                 </div>
                 <div className="text-[10px] text-gray-600 font-semibold">
                   <span className="text-[#10B981] font-bold">-3</span> This week
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12">
        <div className="page-container">
        {/* Mock Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[1, 2, 1, 1].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-[#D9D9D9] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-[67px] h-[67px] rounded-full bg-[#CBC1FD] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#3008F8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-2">Full Length Mock Test {item}</h3>
              <p className="text-sm text-gray-500 mb-6">Complete PTE Academic test with all sections.</p>
              
              <div className="flex w-full justify-between px-2 text-xs text-gray-600 mb-6 font-medium">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  2h:15m<br/>Duration
                </div>
                <div className="flex items-center text-right">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  200<br/>Questions
                </div>
              </div>

              <button className="w-full bg-[#3008F8] hover:bg-[#2506c4] text-white font-semibold py-3 rounded-lg mb-4 transition-colors">
                Start Test
              </button>
              <Link href={`/mock-test/${item}`} className="text-[#3008F8] font-semibold text-sm flex items-center hover:underline">
                View Detail
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Section-wise Mock */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Section-wise Mock</h2>
          <div className="flex flex-col space-y-4">
            {[
              { title: 'Speaking', desc: 'Test your speaking skills with real exam questions.', q: 20, time: 50, color: 'bg-purple-100 text-purple-600', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /> },
              { title: 'Writing', desc: 'Test your speaking skills with real exam questions.', q: 20, time: 50, color: 'bg-blue-100 text-blue-600', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /> },
              { title: 'Listening', desc: 'Test your speaking skills with real exam questions.', q: 20, time: 50, color: 'bg-indigo-100 text-indigo-600', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /> },
              { title: 'Reading', desc: 'Test your speaking skills with real exam questions.', q: 20, time: 50, color: 'bg-purple-100 text-purple-600', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
            ].map((section, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center justify-between bg-[#F5F3FF] border-2 border-[#D9D9D9] rounded-xl py-3 md:py-5 px-4 md:px-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                  <div className={`w-12 h-12 rounded-lg bg-[#3008F826] flex items-center justify-center mr-4 shrink-0`}>
                    <svg className="w-6 h-6 text-[#3008F8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {section.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-center w-full md:w-auto justify-between md:justify-end space-x-6 md:space-x-12">
                  <div className="text-center md:text-left">
                    <div className="font-bold text-gray-900">{section.q}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="font-bold text-gray-900">{section.time} mins</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="bg-white text-[#3008F8] border border-[#3008F8] px-4 py-2 rounded-lg font-semibold text-sm flex items-center hover:bg-gray-50 transition-colors whitespace-nowrap">
                      Start Free Practice
                      <svg className="w-4 h-4 ml-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    <button className="text-[#3008F8] hover:text-[#2506c4]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mock Test Attempts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Mock Test Attempts</h2>
          <div className="overflow-x-auto border-2 border-[#D9D9D9BF] rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#000000BF]">
                  <th className="py-5 px-4 font-bold text-gray-900 w-1/3">Test Name</th>
                  <th className="py-5 px-4 font-bold text-gray-900">Score</th>
                  <th className="py-5 px-4 font-bold text-gray-900 w-1/4">Overall</th>
                  <th className="py-5 px-4 font-bold text-gray-900">Date</th>
                  <th className="py-5 px-4 font-bold text-gray-900 text-right">Review</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Full Length Mock Test 1', score: '88/100', progress: 87, date: '21 May 2026' },
                  { name: 'Full Length Mock Test 2', score: '91/100', progress: 91, date: '27 May 2026' },
                  { name: 'Speaking Mock Test', score: '85/100', progress: 84, date: '15 May 2026' },
                  { name: 'Writing Mock Test', score: '95/100', progress: 95, date: '19 May 2026' },
                  { name: 'Full Length Mock Test 3', score: '75/100', progress: 80, date: '11 May 2026' },
                ].map((attempt, idx) => (
                  <tr key={idx} className="border-b border-[#000000BF] hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-[#3B28CC] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-900 font-medium">{attempt.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-medium">{attempt.score}</td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#3B28CC] rounded-full" style={{ width: `${attempt.progress}%` }}></div>
                        </div>
                        <span className="text-gray-700 font-medium text-sm">{attempt.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-medium">{attempt.date}</td>
                    <td className="py-4 px-4 text-right">
                      <Link href="#" className="text-[#3B28CC] font-semibold hover:underline">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
