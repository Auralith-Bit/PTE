import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/common/Footer';

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 1. Hero Section */}
      <section className="bg-[#F5F3FF] overflow-hidden">
        <div className="page-container pt-[12px]">
          <div className="breadcrumbs w-[44%] pt-6">
            <Link href="/">Home</Link><Chevron /><span>Courses</span><Chevron />
          </div>
          <div className="flex items-center min-h-[486px]">

          {/* Left Content */}
          <div className="w-[44%] py-14 pr-6 flex-shrink-0">
            <h1 className="text-[2rem] font-extrabold text-gray-900 leading-[1.18] mb-5">
              Master PTE with{' '}
              <span className="text-indigo-600">Structured Learning Paths</span>
            </h1>
            <p className="text-gray-900 text-[15px] leading-relaxed mb-8 max-w-[420px] font-medium">
              Choose the right course based on your current level and target score. Learn smarter and achieve more.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mb-10">
              <button className="flex items-center gap-2 bg-[#3008F8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2506c4] transition-all duration-200 shadow-md">
                Explore Courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="px-6 py-3 text-[16px] font-semibold text-[#3008F8] bg-white border-2 border-[#D9D9D9] rounded-lg hover:border-[#3008F8] transition-all duration-200">
                Take Placement Quiz
              </button>
            </div>

            {/* Stats Row */}
            <div className="w-[606px] h-[63px] flex items-center gap-[17px] rounded-[7px] border-[1.5px] border-[#D9D9D9] p-[7px] bg-white" style={{ boxShadow: '1px 1px 10px 0px #0000001A' }}>
              {/* Badge 1 */}
              <div className="flex items-center gap-2 flex-1">
                <Image src="/images/Vector.png" alt="Expert Trainers" width={28} height={28} />
                <div>
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">Expert Trainers</p>
                </div>
              </div>

              <div className="w-[1.5px] h-[35px] bg-gray-200 flex-shrink-0" />

              {/* Badge 2 */}
              <div className="flex items-center gap-2 flex-1">
                <Image src="/images/Vector (1).png" alt="AI Learning" width={28} height={28} />
                <div>
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">AI-Powered Learning</p>
                </div>
              </div>

              <div className="w-[1.5px] h-[35px] bg-gray-200 flex-shrink-0" />

              {/* Badge 3 */}
              <div className="flex items-center gap-2 flex-1">
                <Image src="/images/Vector (2).png" alt="Mock Tests" width={28} height={28} />
                <div>
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">Real Exam Simulation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="w-[694px] relative h-[326px] flex-shrink-0 overflow-visible ml-[70px]">
            <Image src="/images/Frame 1472.png" alt="Student studying" fill className="object-contain" />
          </div>

          </div>
        </div>
      </section>

      {/* 2. Choose Your Learning Path */}
      <section className="py-20">
        <div className="page-container">
        <h2 className="text-[2rem] font-extrabold text-gray-900 mb-12">Choose Your Learning Path</h2>
        
        <div className="flex justify-between gap-[33px]">
          {/* Beginner Card */}
          <div className="bg-[#F6F6F680] rounded-[10px] border-2 border-[#D9D9D9] pt-[10px] pr-[25px] pb-[10px] pl-[25px] flex flex-col shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden flex-1 min-h-[380px]">
            <div className="bg-[#E6F4EA] text-[#137333] text-xs font-bold px-3 py-1 rounded-full w-fit mb-5 tracking-wide uppercase">Beginner</div>
            <div className="flex items-center mb-5">
               <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] flex items-center justify-center mr-4">
                 <span className="text-[#137333] font-bold text-xl">🌱</span>
               </div>
               <div>
                  <h3 className="text-[19px] font-bold text-black">PTE Foundation</h3>
                 <p className="text-xs font-medium text-gray-500">Target Score: 30-50</p>
               </div>
            </div>
            <ul className="space-y-2.5 mb-5 flex-1">
              {['Grammar Basics', 'Vocabulary Building', 'Speaking Fundamentals', 'Reading Basics', 'Listening Essentials', 'Weekly Practice Tests'].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-4 h-4 text-[#137333] mr-2.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[15px] font-medium text-black">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-5 border-2 border-[#D9D9D9] rounded-lg px-5 py-3 mb-4">
               <div className="flex items-center text-xs font-bold text-black">
                  <svg className="w-[19px] h-[19px] text-[#137333] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>
                  <div className="leading-tight">Duration<br/><span className="font-extrabold text-[#137333]">4 Weeks</span></div>
               </div>
               <div className="w-[1.5px] h-[30px] bg-[#D9D9D9] flex-shrink-0" />
               <div className="flex items-center text-xs font-bold text-black">
                  <svg className="w-[19px] h-[19px] text-[#137333] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <div className="leading-tight">Lessons<br/><span className="font-extrabold text-[#137333]">40+</span></div>
               </div>
            </div>
            <div className="flex items-center justify-between">
               <div className="text-lg font-extrabold text-black">NRP 1,000</div>
                <button className="bg-[#137333] text-white font-bold py-2 px-5 rounded-lg text-sm hover:bg-[#0f5c28] transition-colors">
                  View Courses
                </button>
            </div>
          </div>

          {/* Intermediate Card */}
          <div className="bg-[#F6F6F680] rounded-[10px] border-2 border-[#D9D9D9] pt-[10px] pr-[25px] pb-[10px] pl-[25px] flex flex-col shadow-[0_8px_30px_rgba(59,40,204,0.12)] relative overflow-hidden transform scale-105 z-10 flex-1 min-h-[380px]">
            <div className="bg-[#EEF2FF] text-[#3B28CC] text-xs font-bold px-3 py-1 rounded-full w-fit mb-5 tracking-wide uppercase">Intermediate</div>
            <div className="flex items-center mb-5">
               <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center mr-4">
                 <svg className="w-6 h-6 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               </div>
               <div>
                  <h3 className="text-[19px] font-bold text-black">PTE Score Booster</h3>
                 <p className="text-xs font-medium text-gray-500">Target Score: 50-70</p>
               </div>
            </div>
            <ul className="space-y-2.5 mb-5 flex-1">
              {['Speaking Strategies', 'Easy Writing', 'Summarize Written Text', 'Reading Techniques', 'Listening Strategies', 'Weekly Mock Tests'].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-4 h-4 text-[#3B28CC] mr-2.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[15px] font-medium text-black">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-5 border-2 border-[#D9D9D9] rounded-lg px-5 py-3 mb-4">
               <div className="flex items-center text-xs font-bold text-black">
                  <svg className="w-[19px] h-[19px] text-[#3B28CC] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>
                  <div className="leading-tight">Duration<br/><span className="font-extrabold text-[#3B28CC]">6 Weeks</span></div>
               </div>
               <div className="w-[1.5px] h-[30px] bg-[#D9D9D9] flex-shrink-0" />
               <div className="flex items-center text-xs font-bold text-black">
                  <svg className="w-[19px] h-[19px] text-[#3B28CC] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <div className="leading-tight">Lessons<br/><span className="font-extrabold text-[#3B28CC]">60+</span></div>
               </div>
            </div>
            <div className="flex items-center justify-between">
               <div className="text-lg font-extrabold text-black">NRP 1,500</div>
                <button className="bg-[#3B28CC] text-white font-bold py-2 px-5 rounded-lg text-sm hover:bg-[#2d1fa3] transition-colors">
                  View Courses
                </button>
            </div>
          </div>

          {/* Advanced Card */}
          <div className="bg-[#F6F6F680] rounded-[10px] border-2 border-[#D9D9D9] pt-[10px] pr-[25px] pb-[10px] pl-[25px] flex flex-col shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden flex-1 min-h-[380px]">
            <div className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold px-3 py-1 rounded-full w-fit mb-5 tracking-wide uppercase">Advanced</div>
            <div className="flex items-center mb-5">
               <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center mr-4">
                 <svg className="w-6 h-6 text-[#7E22CE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <div>
                  <h3 className="text-[19px] font-bold text-black">PTE 80+ Mastery</h3>
                 <p className="text-xs font-medium text-gray-500">Target Score: 80-100</p>
               </div>
            </div>
            <ul className="space-y-2.5 mb-5 flex-1">
              {['Advanced Templates', 'AI Feedback & Evaluation', 'Full-Length Mock Tests', 'Performance Analytics', 'Expert Guidance & Mentoring', 'Personalized Study Plan'].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-4 h-4 text-[#7E22CE] mr-2.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[15px] font-medium text-black">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-5 border-2 border-[#D9D9D9] rounded-lg px-5 py-3 mb-4">
               <div className="flex items-center text-xs font-bold text-black">
                  <svg className="w-[19px] h-[19px] text-[#7E22CE] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>
                  <div className="leading-tight">Duration<br/><span className="font-extrabold text-[#7E22CE]">8 Weeks</span></div>
               </div>
               <div className="w-[1.5px] h-[30px] bg-[#D9D9D9] flex-shrink-0" />
               <div className="flex items-center text-xs font-bold text-black">
                  <svg className="w-[19px] h-[19px] text-[#7E22CE] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <div className="leading-tight">Lessons<br/><span className="font-extrabold text-[#7E22CE]">80+</span></div>
               </div>
            </div>
            <div className="flex items-center justify-between">
               <div className="text-lg font-extrabold text-black">NRP 3,500</div>
                <button className="bg-[#7E22CE] text-white font-bold py-2 px-5 rounded-lg text-sm hover:bg-[#6b1db5] transition-colors">
                  View Courses
                </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* 3. Skill-Based Courses */}
      <section className="bg-white py-20">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Skill-Based Courses</h2>
            <Link href="#" className="text-[#3B28CC] font-bold flex items-center hover:underline">
              View All Skills <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Speaking Mastery', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', evalText: 'AI Speaking Evaluation' },
              { title: 'Writing Excellence', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', evalText: 'AI Writing Evaluation', text2: 'Model Answers & Templates' },
              { title: 'Listening Mastery', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', evalText: 'Audio Practice Exercises' },
              { title: 'Reading Mastery', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', evalText: 'AI Speaking Evaluation' },
            ].map((skill, idx) => (
              <div key={idx} className="bg-[#F6F6F6] rounded-2xl border border-[#000000] p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#E0DAFE] flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={skill.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">{skill.title}</h3>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-sm text-black font-medium">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    25+ Video Lessons
                  </li>
                  <li className="flex items-center text-sm text-black font-medium">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    150+ Practice Questions
                  </li>
                  <li className="flex items-center text-sm text-black font-medium">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {skill.text2 || skill.evalText}
                  </li>
                  <li className="flex items-center text-sm text-black font-medium">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Progress Tracking
                  </li>
                </ul>
                <Link href="#" className="text-[#3008F8] font-bold text-sm flex items-center hover:underline">
                  Start Learning <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Comparison Table */}
      <section className="py-20">
        <div className="page-container">
        <div className="bg-white rounded-2xl border border-[#000000] overflow-hidden shadow-sm">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#000000]">
                <th className="py-5 px-6 text-left font-extrabold text-black border-r border-[#000000] w-1/4 text-[16px] bg-[#D9D9D91A]">Features</th>
                <th className="py-5 px-4 font-extrabold text-[#137333] border-r border-[#000000] bg-[#00610E1A] text-[16px]">PTE Foundation<br/><span className="text-[14px] font-bold">30-50</span></th>
                <th className="py-5 px-4 font-extrabold text-[#0284C7] border-r border-[#000000] bg-[#E1EDFA] text-[16px]">PTE Score Booster<br/><span className="text-[14px] font-bold">50-70</span></th>
                <th className="py-5 px-4 font-extrabold text-[#7E22CE] bg-[#E1D7FB] text-[16px]">PTE 80+ Mastery<br/><span className="text-[14px] font-bold">80-100</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Lessons', f: true, s: true, m: true },
                { name: 'Practice Questions', f: true, s: true, m: true },
                { name: 'AI Feedback & Evaluation', f: true, s: true, m: true },
                { name: 'Full-Length Mock Tests', f: false, s: true, m: true },
                { name: 'Study Plan', f: false, s: true, m: true },
                { name: 'Expert Mentoring', f: true, s: true, m: true },
                { name: 'Performance Analytics', f: false, s: true, m: true },
                { name: 'Certificate of Completion', f: false, s: false, m: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#000000] last:border-0 hover:bg-gray-50 transition-colors">
                   <td className="py-4 px-6 text-left text-black border-r border-[#000000] flex items-center text-[16px] bg-[#D9D9D91A]">
                      <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      {row.name}
                   </td>
                   <td className="py-4 px-4 border-r border-[#000000] bg-[#00610E1A]">
                     {row.f ? <svg className="w-6 h-6 text-[#137333] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                   </td>
                   <td className="py-4 px-4 border-r border-[#000000] bg-[#E1EDFA]">
                     {row.s ? <svg className="w-6 h-6 text-[#137333] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                   </td>
                   <td className="py-4 px-4 bg-[#E1D7FB]">
                     {row.m ? <svg className="w-6 h-6 text-[#137333] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      {/* 5. Journey & Testimonials */}
      <section className="bg-white py-20 w-full">
        <div className="page-container">
        <div className="grid grid-cols-2 gap-[20px]">
           {/* Left: Journey */}
            <div className="bg-white rounded-2xl px-8 py-8 flex flex-col items-center justify-center min-h-[400px]">
               <h2 className="text-[29px] font-extrabold text-black pt-[4px] text-center mb-8">Your PTE Learning Journey</h2>
              <div className="flex items-center justify-between relative w-full">
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-6"></div>
                 
                  <div className="flex flex-col items-center text-center">
                     <div className="w-[67px] h-[67px] rounded-full bg-[#E6F4EA] flex items-center justify-center mb-3 border-4 border-white shadow-sm">
                        <span className="text-xl">🌱</span>
                     </div>
                     <div className="font-extrabold text-black text-sm">1<br/>Foundation</div>
                     <div className="text-[10px] text-black font-medium">(Score 30-50)</div>
                  </div>

                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>

                  <div className="flex flex-col items-center text-center">
                     <div className="w-[67px] h-[67px] rounded-full bg-[#E0F2FE] flex items-center justify-center mb-3 border-4 border-white shadow-sm">
                        <span className="text-xl">📈</span>
                     </div>
                     <div className="font-extrabold text-black text-sm">2<br/>Score Booster</div>
                     <div className="text-[10px] text-black font-medium">(Score 60-70)</div>
                  </div>

                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>

                  <div className="flex flex-col items-center text-center">
                     <div className="w-[67px] h-[67px] rounded-full bg-[#F3E8FF] flex items-center justify-center mb-3 border-4 border-white shadow-sm">
                        <span className="text-xl">🎯</span>
                     </div>
                     <div className="font-extrabold text-black text-sm">3<br/>79+ Mastery</div>
                     <div className="text-[10px] text-black font-medium">(Score 80+)</div>
                  </div>

                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>

                  <div className="flex flex-col items-center text-center">
                     <div className="w-[67px] h-[67px] rounded-full bg-yellow-100 flex items-center justify-center mb-3 border-4 border-white shadow-sm">
                        <span className="text-xl">🏆</span>
                     </div>
                     <div className="font-extrabold text-black text-sm">Real Exam</div>
                     <div className="text-[10px] text-black font-medium">Achieve success.</div>
                  </div>
              </div>
           </div>

           {/* Right: Testimonials */}
            <div className="bg-white rounded-2xl border-2 border-[#D9D9D9] px-8 pt-[4px] pb-[4px] overflow-hidden">
               <div className="mb-8 pt-[4px] text-center">
                  <h2 className="text-2xl font-extrabold text-black">Recent Student Achievement</h2>
               </div>
              <div className="relative h-[280px] overflow-hidden">
                 <div className="absolute inset-0 flex flex-row gap-4 animate-scroll-horizontal w-max">
                    {[
                      { name: 'Riya Sharma', location: 'Nepal', image: '/images/image 22.png', text: 'The AI speaking feedback helped me improve my fluency and pronunciation significantly. I achieved a PTE score of 67 in just 3 weeks!', score: '67%', rating: '5.0', color: '#3008F826', fullColor: '#3008F8' },
                      { name: 'Shubham Pandey', location: 'Nepal', image: '/images/image 23.png', text: 'The mock tests felt exactly like the real exam. The detailed one which helped me focus on my weak areas and improve faster.', score: '84%', rating: '5.0', color: '#F8940826', fullColor: '#F89408' },
                      { name: 'Aayusha Sapkota', location: 'Nepal', image: '/images/image 24.png', text: 'This writing evaluation feature gave me valuable feedback on grammar and coherence. My confidence improved with every practice session.', score: '82%', rating: '5.0', color: '#00F31C26', fullColor: '#00F31C' },
                      { name: 'Ryan Ghimire', location: 'Nepal', image: '/images/image 25.png', text: 'The AI speaking feedback helped me improve my fluency and overall spoken communication significantly. I achieved a PTE score of 88.', score: '88%', rating: '5.0', color: '#1CE7DD26', fullColor: '#1CE7DD' },
                      { name: 'Priyanka Thapa', location: 'Nepal', image: '/images/image 26.png', text: 'The platform is excellent, polished, and easy to use. This exam preparation environment was truly life-changing.', score: '85%', rating: '5.0', color: '#F8C80826', fullColor: '#F8C808' },
                      { name: 'Aryan Chettri', location: 'Nepal', image: '/images/image 27.png', text: 'The AI practice environment really helped me perform better under exam conditions. I felt fully prepared to tackle my weak areas.', score: '80%', rating: '5.0', color: '#08F87C26', fullColor: '#08F87C' },
                      { name: 'Diya Thakar', location: 'Nepal', image: '/images/image 28.png', text: 'Your data-driven insights and personalized recommendations were tailored specifically for me. This helped me become confident.', score: '71%', rating: '5.0', color: '#F808E826', fullColor: '#F808E8' },
                      { name: 'Bibek Bhattarai', location: 'Nepal', image: '/images/image 29.png', text: 'Excellent speaking practice features. The platform is profoundly designed and helped me significantly improve my PTE score.', score: '88%', rating: '5.0', color: '#FF151526', fullColor: '#FF1515' },
                    ].map((t, idx) => (
                       <div key={idx} className="bg-white rounded-[16px] border border-[#D9D9D9] px-[17px] py-[20px] flex flex-col shrink-0 w-[320px]" style={{ boxShadow: '1px 1px 10px 0px #00000033' }}>
                          <div className="text-[37px] font-bold leading-none mb-0 font-serif" style={{ color: t.fullColor }}>"</div>
                          <div className="flex items-center gap-[7px] mb-[7px]">
                             <Image src={t.image} alt={t.name} width={36} height={36} className="w-[36px] h-[36px] rounded-full object-cover flex-shrink-0 border-2 border-indigo-100" />
                             <div>
                                <p className="text-[13px] font-bold text-black leading-tight">{t.name}</p>
                                <div className="flex items-center gap-[3px]">
                                   <Image src="/images/Group 92.png" alt="location" width={16} height={19} className="flex-shrink-0" />
                                   <p className="text-[14px] text-black leading-tight">{t.location}</p>
                                </div>
                             </div>
                          </div>
                          <p className="text-[13px] text-gray-600 leading-relaxed flex-1 mb-[7px]">{t.text}</p>
                          <div className="flex items-center justify-between mt-[2px]">
                             <span className="text-black text-[11px] font-bold px-[11px] py-[5px] rounded-full" style={{ backgroundColor: t.color }}>
                               PTE Score {t.score}
                             </span>
                             <div className="flex items-center gap-[5px]">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="text-[14px] font-semibold text-black">{t.rating}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                    {[
                      { name: 'Riya Sharma', location: 'Nepal', image: '/images/image 22.png', text: 'The AI speaking feedback helped me improve my fluency and pronunciation significantly. I achieved a PTE score of 67 in just 3 weeks!', score: '67%', rating: '5.0', color: '#3008F826', fullColor: '#3008F8' },
                      { name: 'Shubham Pandey', location: 'Nepal', image: '/images/image 23.png', text: 'The mock tests felt exactly like the real exam. The detailed one which helped me focus on my weak areas and improve faster.', score: '84%', rating: '5.0', color: '#F8940826', fullColor: '#F89408' },
                      { name: 'Aayusha Sapkota', location: 'Nepal', image: '/images/image 24.png', text: 'This writing evaluation feature gave me valuable feedback on grammar and coherence. My confidence improved with every practice session.', score: '82%', rating: '5.0', color: '#00F31C26', fullColor: '#00F31C' },
                      { name: 'Ryan Ghimire', location: 'Nepal', image: '/images/image 25.png', text: 'The AI speaking feedback helped me improve my fluency and overall spoken communication significantly. I achieved a PTE score of 88.', score: '88%', rating: '5.0', color: '#1CE7DD26', fullColor: '#1CE7DD' },
                    ].map((t, idx) => (
                       <div key={`dup-${idx}`} className="bg-white rounded-[16px] border border-[#D9D9D9] px-[17px] py-[20px] flex flex-col shrink-0 w-[320px]" style={{ boxShadow: '1px 1px 10px 0px #00000033' }}>
                          <div className="text-[37px] font-bold leading-none mb-0 font-serif" style={{ color: t.fullColor }}>"</div>
                          <div className="flex items-center gap-[7px] mb-[7px]">
                             <Image src={t.image} alt={t.name} width={36} height={36} className="w-[36px] h-[36px] rounded-full object-cover flex-shrink-0 border-2 border-indigo-100" />
                             <div>
                                <p className="text-[13px] font-bold text-black leading-tight">{t.name}</p>
                                <div className="flex items-center gap-[3px]">
                                   <Image src="/images/Group 92.png" alt="location" width={16} height={19} className="flex-shrink-0" />
                                   <p className="text-[14px] text-black leading-tight">{t.location}</p>
                                </div>
                             </div>
                          </div>
                          <p className="text-[13px] text-gray-600 leading-relaxed flex-1 mb-[7px]">{t.text}</p>
                          <div className="flex items-center justify-between mt-[2px]">
                             <span className="text-black text-[11px] font-bold px-[11px] py-[5px] rounded-full" style={{ backgroundColor: t.color }}>
                               PTE Score {t.score}
                             </span>
                             <div className="flex items-center gap-[5px]">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="text-[14px] font-semibold text-black">{t.rating}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
         </div>
        </div>
      </section>

      {/* 6. Why Choose Our Courses */}
      <section className="py-[30px]">
        <div className="page-container">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Why Choose Our Courses?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
           {[
             { title: 'AI Speaking Feedback', desc: 'Speak with confidence. Receive instant feedback on fluency and pronunciation.', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
             { title: 'Writing Evaluation', desc: 'Write with confidence. Receive instant feedback on grammar and logic.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
             { title: 'Real Mock Test', desc: 'Practice under real exam conditions with timed tests and accurate scoring.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
             { title: 'Vocabulary Builder', desc: 'Build your vocabulary with smart learning tools designed for memory.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
             { title: 'Personalized Plan', desc: 'Get a customized study schedule mapped to your exam date and goals.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
           ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl border-2 border-[#D9D9D9] p-[19px] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-[#D6DEFF] flex items-center justify-center mb-5 mx-auto">
                     <svg className="w-6 h-6 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                     </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-center mb-3 text-[16px]">{feature.title}</h3>
                 <p className="text-xs text-gray-500 text-center leading-relaxed flex-1">{feature.desc}</p>
           </div>
            ))}
        </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="pb-24">
        <div className="page-container">
         <div className="bg-[#E0DAFE] rounded-3xl p-[7px] md:p-[23px] flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C7D2FE] rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C7D2FE] rounded-full opacity-50 blur-3xl"></div>
            
            <div className="flex items-center z-10 mb-8 md:mb-0">
               <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                  <span className="text-4xl">🎓</span>
               </div>
               <div>
                  <h2 className="text-[22px] md:text-[28px] font-extrabold text-gray-900 mb-2">Ready to Achieve Your Target Score?</h2>
                  <p className="text-gray-700 font-medium text-[13px] md:text-[15px]">Join thousands of successful students and start your PTE journey today.</p>
               </div>
            </div>
            
            <button className="bg-[#3008F8] hover:bg-[#2506C6] text-white font-bold py-4 px-8 rounded-xl z-10 whitespace-nowrap shadow-[0_8px_30px_rgba(48,8,248,0.3)] transition-transform hover:-translate-y-1 flex items-center">
               Find My Perfect Course
               <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
         </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
