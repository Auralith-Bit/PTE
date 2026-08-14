import Image from 'next/image';
import Footer from '@/components/common/Footer';

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="bg-[#F5F3FF] overflow-hidden">
      <div className="page-container pt-[12px]">
        <div className="flex items-center min-h-[486px]">

          {/* ── Left Content ── */}
          <div className="w-[44%] py-14 pr-6 flex-shrink-0">
            <h1 className="text-[2rem] font-extrabold text-gray-900 leading-[1.18] mb-5">
              Achieve Your Dream{' '}
              <span className="text-[#3008F8]">PTE Score</span>
              <br />
              <span className="text-[#3008F8]">Unlock</span> Global Opportunities
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-[420px] font-medium">
              Master every section with AI-powered feedback, realistic mock tests, and personalized
              preparation.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mb-10">
              <button
                id="hero-start-practice"
                className="flex items-center gap-2 bg-[#3008F8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2506c4] transition-all duration-200 shadow-md hover:shadow-indigo-200"
              >
                Start Free Practice
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                id="hero-explore-courses"
                className="px-6 py-3 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg hover:border-[#3008F8] hover:text-[#3008F8] transition-all duration-200"
              >
                Explore Courses
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <Image src="/images/Vector.png" alt="Students icon" width={28} height={28} />
                <div>
                  <p className="text-sm font-bold text-gray-900">50,000+</p>
                  <p className="text-[11px] text-gray-500 font-medium">Happy Students</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Image src="/images/Vector (1).png" alt="Rating icon" width={28} height={28} />
                <div>
                  <p className="text-sm font-bold text-gray-900">4.8/5</p>
                  <p className="text-[11px] text-gray-500 font-medium">Average Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Image src="/images/Vector (2).png" alt="Mock test icon" width={28} height={28} />
                <div>
                  <p className="text-sm font-bold text-gray-900">100,000+</p>
                  <p className="text-[11px] text-gray-500 font-medium">Mock Test Taken</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Hero Image + Floating Cards ── */}
          <div className="w-[684px] relative h-[316px] flex-shrink-0 overflow-visible">

            {/* Dotted pattern decoration */}
            <div className="absolute right-0 top-8 w-48 h-48 hero-dots opacity-60 rounded-full" />

            {/* Floating Card: Speaking Practice */}
            <div className="absolute top-0 left-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 border border-gray-100 w-[162px]">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-[#3008F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-800 leading-tight">Speaking Practice</p>
                <p className="text-[10px] text-gray-500 leading-tight">AI Feedback</p>
              </div>
            </div>

            {/* Floating Card: Mock Test (top right) */}
            <div className="absolute top-0 right-0 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 border border-gray-100 w-[162px]">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 text-[#3008F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-[11px] font-semibold text-gray-800">Mock Test</p>
              </div>
              <p className="text-[10px] text-gray-500 mb-1">Full Length Test</p>
              <div className="flex items-center gap-1">
                <svg className="w-2.5 h-2.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] text-[#3008F8] font-semibold">5:00</p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-[717px] h-[361px]">
              <Image
                src="/images/ChatGPT Image Jun 1, 2026, 03_21_42 PM 1.png"
                alt="Student practicing PTE with AI-powered tools"
                fill
                className="object-contain rounded-tl-[15px] rounded-tr-[35px] rounded-br-[15px] rounded-bl-[35px]"
                priority
              />
            </div>

            {/* Floating Card: Writing Evaluation (middle left) */}
            <div className="absolute top-[44%] left-2 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 text-[#3008F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p className="text-[11px] font-semibold text-gray-800">Writing Evaluation</p>
              </div>
              <p className="text-[10px] text-gray-500">Score 83/100</p>
            </div>

            {/* Floating Card: Study Plan (bottom right) */}
            <div className="absolute bottom-20 right-4 z-20 bg-white rounded-xl shadow-lg px-3 py-2.5 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 text-[#3008F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[11px] font-semibold text-gray-800">Study Plan</p>
              </div>
              <p className="text-[10px] text-gray-500 mb-0.5">Daily Goal</p>
              <div className="flex items-center gap-1">
                <svg className="w-2.5 h-2.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[10px] text-gray-500">3/5 Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TRUST / PARTNERS SECTION
// ─────────────────────────────────────────────
function TrustSection() {
  return (
    <section className="bg-white mt-[80px]">
      <div className="page-container min-h-[154px] flex flex-col justify-center gap-[27px]">
        <p className="text-center font-bold text-[25px] leading-none">
          Trusted by 50,000+ students worldwide
        </p>
        <div className="border border-gray-200 rounded-[7px] py-[10px] px-[7px] flex items-center justify-center min-h-[107px] transition-all duration-300 hover:border-[#3008F8] hover:shadow-[0_10px_33px_#3008F8]" style={{ boxShadow: '1px 1px 12px 0px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center justify-evenly w-full">

          {/* Pearson PTE */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
              <span className="text-white text-[7px] font-bold">P</span>
            </div>
            <span className="font-bold text-[15px] leading-none text-black">Pearson | PTE</span>
          </div>

          {/* British Council */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-3.5 flex-shrink-0 overflow-hidden rounded-sm">
              <div className="w-full h-full bg-blue-800 relative">
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 bg-blue-900" />
                  <div className="h-[2px] bg-white" />
                  <div className="h-[3px] bg-red-600" />
                  <div className="h-[2px] bg-white" />
                  <div className="flex-1 bg-blue-900" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[2px] h-full bg-white opacity-80" />
                </div>
              </div>
            </div>
            <span className="font-bold text-[15px] leading-none text-black">BRITISH COUNCIL</span>
          </div>

          {/* Global Opportunities */}
          <div>
            <span className="font-bold text-[15px] leading-none text-black">Global Opportunities</span>
          </div>

          {/* IELTS */}
          <div>
            <span className="font-bold text-[15px] leading-none bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(97.13deg, #FF1515 12.35%, #3008F8 49.94%)' }}>IELTS</span>
          </div>

          {/* Language Cert */}
          <div>
            <div className="text-center">
              <span className="font-bold text-[15px] leading-none text-black block">Language</span>
              <span className="font-bold text-[15px] text-red-500">Cert</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FEATURES SECTION
// ─────────────────────────────────────────────
const features = [
  {
    title: 'AI Speaking Feedback',
    description:
      'Practice with confidence. Receive instant feedback on fluency, pronunciation, grammar, and vocabulary to excel in speaking quality.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: 'Writing Evaluation',
    description:
      'Write with confidence. Build your skills with grammar, vocabulary, ideas, and overall writing quality improving tools.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: 'Real Mock Test',
    description:
      'Practice under real exam conditions with timed sections, authentic question formats, and performance reports.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Vocabulary Builder',
    description:
      'Build your vocabulary with smart learning tools to improve understanding, memory & fluency, and achieve writing quality.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Score Prediction',
    description:
      'Get AI scorecard. Get a detailed overview of your score and a roadmap for improving your overall PTE performance.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Coming Soon',
    description:
      'More exciting features are on the way. Stay tuned for updates that will enhance your learning experience.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="py-14 bg-white mt-[40px]">
      <div className="page-container">
        <h2 className="text-center text-2xl font-bold text-black mb-10">
          Everything You Need To Achieve Your{' '}
          <span className="text-[#3008F8]">Target Score</span>
        </h2>

        {/* Cards Carousel */}
        <div className="relative mb-6 py-4 px-4">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="overflow-x-hidden">
          <div className="flex gap-[25px] animate-scroll">
            {[...features, ...features].map((feature, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-[10px] p-[10px] hover:border-indigo-200 transition-all duration-200 cursor-pointer w-[237px] h-[180px] flex-shrink-0 flex flex-col"
                style={{ boxShadow: '0px 4px 12px 2px rgba(0,0,0,0.25)' }}
              >
                <div className="mt-[2px] w-[50px] h-[50px] rounded-lg flex items-center justify-center text-[#3008F8] mb-[17px]" style={{ backgroundColor: '#3008F826' }}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-black text-[17px] leading-none mb-[10px]">{feature.title}</h3>
                <p className="text-black text-[12px] font-normal leading-none mt-auto pb-[3px]">{feature.description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MOCK TEST EXPERIENCE SECTION
// ─────────────────────────────────────────────

// Waveform heights to mimic audio visualization
const WAVE_HEIGHTS = [4, 8, 14, 20, 28, 32, 28, 22, 16, 24, 32, 28, 20, 12, 18, 26, 30, 24, 16, 10, 18, 26, 32, 24, 16, 10, 20, 24, 16, 10, 16, 20, 12, 8, 4];

function MockTestSection() {
  return (
    <section className="bg-white py-[25px]">
      <div className="page-container">
        <div className="w-full rounded-2xl overflow-hidden" style={{ boxShadow: '1px 1px 12px 0px #3008F833' }}>
        <div className="flex h-[301px] gap-[3px]">

          {/* ── Left Panel: Dark Indigo ── */}
          <div className="w-[calc(36%-100px)] bg-[#3008F8] p-[27px] flex flex-col justify-between">
            <div>
              <h2 className="text-[25px] font-bold text-white mb-[27px] leading-none font-[family-name:var(--font-inter)]">
                Mock Test Experience
              </h2>
              <ul className="space-y-[11px] mb-[17px]">
                {[
                  'Real Exam Simulation',
                  'Timed Practice',
                  'Instant Scoring',
                  'Detailed Analytics',
                  'Improving Weakness',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-[8px] text-white text-[18px] font-medium leading-none">
                    <div className="w-[13px] h-[13px] rounded-full bg-[#3008F8] flex items-center justify-center flex-shrink-0">
                      <svg className="w-[9px] h-[9px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button
              id="mock-test-try-free"
              className="bg-white hover:bg-gray-100 text-[#3008F8] px-[42px] py-[12px] rounded-[7px] text-[18px] font-semibold transition-colors self-start border border-[#3008F8]"
            >
              Try for free mock test
            </button>
          </div>

          {/* ── Right Panel: Test Interface ── */}
          <div className="flex-1 bg-gray-50 pt-[10px] px-[16px] pb-[16px] flex flex-col justify-start overflow-hidden">
            <div className="bg-gray-50 pt-[0px] pb-[13px] px-[13px] overflow-hidden">

              {/* Test Header */}
              <div className="flex items-center pb-[7px]">
                <div className="flex items-center gap-[7px]">
                  <svg className="w-[20px] h-[20px] text-[#3008F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-[17px] font-extrabold text-gray-900">PTE Full Length Test</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-[5px] text-gray-900">
                    <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[17px] font-mono font-extrabold text-gray-900">01:20:35</span>
                  </div>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[18px] text-gray-900">Question of 11 of 20</span>
                  <button className="text-gray-900 hover:text-gray-700 transition-colors">
                    <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Question Info */}
              <div className="mt-[5px] mb-[10px]">
                <h3 className="text-[15px] font-bold text-gray-900 mb-[3px]">Summarize Spoken Test</h3>
                <p className="text-[12px] text-gray-900">You will hear a recording. Type the summary you hear</p>
              </div>

              {/* Audio Waveform */}
              <div className="bg-gray-50 p-[7px] mt-[20px] mb-[30px] flex items-center gap-[7px]">
                <div className="flex-1 flex items-end gap-[1px] h-[27px]">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${h * 0.6667}px`,
                        animationDelay: `${(i % 8) * 0.15}s`,
                      }}
                      className={`flex-1 rounded-full ${
                        i < 22
                          ? 'bg-[#3008F8]'
                          : 'bg-gray-300 wave-bar'
                      }`}
                    />
                  ))}
                </div>
                {/* Controls */}
                <div className="flex items-center gap-[5px] flex-shrink-0">
                  <button
                    aria-label="Clear recording"
                    className="w-[18px] h-[18px] rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-[9px] h-[9px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    aria-label="Confirm recording"
                    className="w-[18px] h-[18px] rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <svg className="w-[9px] h-[9px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Answer Text Area */}
              <textarea
                className="w-full border border-gray-200 rounded-[5px] bg-white px-[15px] py-[15px] text-[12px] text-gray-400 outline-none resize-none h-[56px] placeholder-gray-300"
                placeholder="Type your answer here..."
                readOnly
              />

              {/* Next Button */}
              <div className="flex justify-end mt-[7px]">
                <button
                  id="mock-test-next"
                  className="bg-[#3008F8] text-white px-[32px] py-[5px] rounded-[5px] text-[15px] font-semibold hover:bg-[#2506c4] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS SECTION
// ─────────────────────────────────────────────
const testimonials = [
  {
    name: 'Riya Sharma',
    location: 'Nepal',
    image: '/images/image 22.png',
    text: 'The AI speaking feedback helped me improve my fluency and pronunciation significantly. I achieved a PTE score of 67 in just 3 weeks!',
    score: '67%',
    rating: '5.0',
    color: '#3008F826',
  },
  {
    name: 'Shubham Pandey',
    location: 'Nepal',
    image: '/images/image 23.png',
    text: 'The mock tests felt exactly like the real exam. The detailed one which helped me focus on my weak areas and improve faster.',
    score: '84%',
    rating: '5.0',
    color: '#F8940826',
  },
  {
    name: 'Aayusha Sapkota',
    location: 'Nepal',
    image: '/images/image 24.png',
    text: 'This writing evaluation feature gave me valuable feedback on grammar and coherence. My confidence improved with every practice session.',
    score: '82%',
    rating: '5.0',
    color: '#00F31C26',
  },
  {
    name: 'Ryan Ghimire',
    location: 'Nepal',
    image: '/images/image 25.png',
    text: 'The AI speaking feedback helped me improve my fluency and overall spoken communication significantly. I achieved a PTE score of 88 in just a few weeks.',
    score: '88%',
    rating: '5.0',
    color: '#1CE7DD26',
  },
  {
    name: 'Priyanka Thapa',
    location: 'Nepal',
    image: '/images/image 26.png',
    text: 'The platform is excellent, polished, and easy to use. This exam preparation environment was truly life-changing. I felt fully prepared to achieve high scores.',
    score: '85%',
    rating: '5.0',
    color: '#F8C80826',
  },
  {
    name: 'Aryan Chettri',
    location: 'Nepal',
    image: '/images/image 27.png',
    text: 'The AI practice environment really helped me perform better under exam conditions. I felt fully prepared to tackle my weak areas and improve faster.',
    score: '80%',
    rating: '5.0',
    color: '#08F87C26',
  },
  {
    name: 'Diya Thakar',
    location: 'Nepal',
    image: '/images/image 28.png',
    text: 'Your data-driven insights and personalized recommendations were tailored specifically for me. This helped me become confident with the exam format.',
    score: '71%',
    rating: '5.0',
    color: '#F808E826',
  },
  {
    name: 'Bibek Bhattarai',
    location: 'Nepal',
    image: '/images/image 29.png',
    text: 'Excellent speaking practice features. The platform is profoundly designed and helped me identify my weak areas and significantly improve my PTE score.',
    score: '88%',
    rating: '5.0',
    color: '#FF151526',
  },
];

function TestimonialsSection() {
  return (
    <section className="py-14 bg-white">
      <div className="page-container">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">
          Student Success Stories
        </h2>

        <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-[28px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="w-[243px] border border-gray-200 rounded-[16px] px-[17px] py-[25px] flex flex-col"
              style={{ boxShadow: '1px 1px 10px 0px #00000033' }}
            >
              {/* Quote Mark */}
              <div className="text-[37px] font-bold leading-none mb-0 font-serif" style={{ color: t.color.replace('26', 'FF') }}>"</div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-[7px] mb-[7px]">
                <div className="w-[36px] h-[36px] rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-100 bg-gray-100">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900 leading-tight">{t.name}</p>
                  <div className="flex items-center gap-[3px]">
                    <Image src="/images/Group 92.png" alt="location" width={16} height={19} className="flex-shrink-0" />
                    <p className="text-[14px] text-gray-900 leading-tight">{t.location}</p>
                  </div>
                </div>
              </div>

              {/* Quote Text */}
              <p className="text-[13px] text-gray-600 leading-relaxed flex-1 mb-[7px]">{t.text}</p>

              {/* Bottom: Score Badge + Rating */}
              <div className="flex items-center justify-between mt-[2px]">
                <span className="text-gray-900 text-[11px] font-bold px-[11px] py-[5px] rounded-full" style={{ backgroundColor: t.color }}>
                  PTE Score {t.score}
                </span>
                <div className="flex items-center gap-[5px]">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-[14px] font-semibold text-gray-700">{t.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <MockTestSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
