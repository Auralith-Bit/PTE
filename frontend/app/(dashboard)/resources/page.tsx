import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/common/Footer';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 1. Hero Section */}
      <section className="bg-[#F5F3FF] overflow-hidden">
        <div className="page-container pt-[12px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[486px]">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl z-10">
            <h1 className="text-[33px] font-extrabold text-black leading-[1.15] tracking-tight mb-6">
              PTE Resources
            </h1>
            <p className="text-black text-[15px] mb-10 max-w-lg leading-relaxed font-medium">
              Your one-stop library for PTE success. Explore free study materials, guides, templates, and tips to help you prepare smarter and achieve your target score.
            </p>
            
            <div className="flex items-center bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] border border-black overflow-hidden mt-8">
              <div className="flex items-center py-4 px-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-5 h-5 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <div className="font-bold text-black text-sm mb-0.5">Free & Premium</div>
                  <div className="text-xs text-black font-medium">Quality resources</div>
                </div>
              </div>
              <div className="w-[1.5px] h-[30px] bg-[#D9D9D9]"></div>
              <div className="flex items-center py-4 px-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-5 h-5 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="font-bold text-black text-sm mb-0.5">Exam-Focused</div>
                  <div className="text-xs text-black font-medium">Updated & relevant</div>
                </div>
              </div>
              <div className="w-[1.5px] h-[30px] bg-[#D9D9D9]"></div>
              <div className="flex items-center py-4 px-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-5 h-5 text-[#3B28CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <div>
                  <div className="font-bold text-black text-sm mb-0.5">Easy to Access</div>
                  <div className="text-xs text-black font-medium">Download anytime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="flex-1 relative w-full h-[450px] flex items-center justify-center">
              <Image src="/images/Frame 1654.png" alt="PTE Resources" width={600} height={400} className="w-[90%] h-[90%] object-contain rounded-3xl" />
           </div>
        </div>
        </div>
      </section>

      {/* 2. Category Cards (Horizontal scrolling list or grid) */}
      <section className="py-20 mt-[30px] overflow-hidden">
        <div className="page-container">
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll-infinite w-max">
            {[
              { title: 'Reading Practice', desc: 'Reading improves your performance.', res: '10 Resources', resColor: 'text-[#137333]', bg: 'bg-[#E6F4EA]', image: '/images/Group 268.png' },
              { title: 'Answer Question', desc: 'Respond clearly and confidently.', res: '10 Resources', resColor: 'text-[#137333]', bg: 'bg-[#E6F4EA]', image: '/images/Group 268 (1).png' },
              { title: 'Mock Test', desc: 'Free full-length for mock tests.', res: '10 Resources', resColor: 'text-red-500', bg: 'bg-red-100', image: '/images/Group 268 (2).png' },
              { title: 'Audio Materials', desc: 'Improve listening and speaking skills.', res: '10 Resources', resColor: 'text-blue-500', bg: 'bg-blue-100', image: '/images/Group 268 (3).png' },
              { title: 'Tips & Strategies', desc: 'Expert tips to improve your performance.', res: '10 Resources', resColor: 'text-orange-500', bg: 'bg-orange-100', image: '/images/Group 268 (4).png' },
              { title: 'Sample Answer', desc: 'High-scoring sample answer for practices.', res: '10 Resources', resColor: 'text-purple-600', bg: 'bg-purple-100', image: '/images/Group 268 (5).png' },
              { title: 'AI Speaking', desc: 'Plan your learning with confidence.', res: '10 Resources', resColor: 'text-red-500', bg: 'bg-red-100', image: '/images/Group 268 (6).png' },
              { title: 'Vocabulary', desc: 'Build your vocabulary with smart tools.', res: '10 Resources', resColor: 'text-[#137333]', bg: 'bg-[#E6F4EA]', image: '/images/Group 268 (7).png' },
              { title: 'Score Prediction', desc: 'Predict your PTE score accurately.', res: '10 Resources', resColor: 'text-blue-500', bg: 'bg-blue-100', image: '/images/Group 268 (8).png' },
              { title: 'Retell Lecture', desc: 'Practice retelling with ease.', res: '10 Resources', resColor: 'text-orange-500', bg: 'bg-orange-100', image: '/images/Group 268 (9).png' },
              { title: 'Sample Question', desc: 'Practice with real exam questions.', res: '10 Resources', resColor: 'text-red-500', bg: 'bg-red-100', image: '/images/Group 268 (10).png' },
              { title: 'Describe Image', desc: 'Master image description techniques.', res: '10 Resources', resColor: 'text-purple-600', bg: 'bg-purple-100', image: '/images/Group 268 (11).png' },
            ].map((cat, idx) => (
              <div key={idx} className="bg-white rounded-3xl border-2 border-[#D9D9D9] p-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow w-[220px] shrink-0">
                <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center mb-6 overflow-hidden`}>
                   <Image src={cat.image} alt={cat.title} width={40} height={40} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="font-extrabold text-black mb-3">{cat.title}</h3>
                <p className="text-sm font-medium text-black mb-8 flex-1">{cat.desc}</p>
                <div className={`font-bold text-sm ${cat.resColor}`}>
                   {cat.res}
                </div>
              </div>
            ))}
            {[
              { title: 'Reading Practice', desc: 'Reading improves your performance.', res: '10 Resources', resColor: 'text-[#137333]', bg: 'bg-[#E6F4EA]', image: '/images/Group 268.png' },
              { title: 'Answer Question', desc: 'Respond clearly and confidently.', res: '10 Resources', resColor: 'text-[#137333]', bg: 'bg-[#E6F4EA]', image: '/images/Group 268 (1).png' },
              { title: 'Mock Test', desc: 'Free full-length for mock tests.', res: '10 Resources', resColor: 'text-red-500', bg: 'bg-red-100', image: '/images/Group 268 (2).png' },
              { title: 'Audio Materials', desc: 'Improve listening and speaking skills.', res: '10 Resources', resColor: 'text-blue-500', bg: 'bg-blue-100', image: '/images/Group 268 (3).png' },
              { title: 'Tips & Strategies', desc: 'Expert tips to improve your performance.', res: '10 Resources', resColor: 'text-orange-500', bg: 'bg-orange-100', image: '/images/Group 268 (4).png' },
              { title: 'Sample Answer', desc: 'High-scoring sample answer for practices.', res: '10 Resources', resColor: 'text-purple-600', bg: 'bg-purple-100', image: '/images/Group 268 (5).png' },
              { title: 'AI Speaking', desc: 'Plan your learning with confidence.', res: '10 Resources', resColor: 'text-red-500', bg: 'bg-red-100', image: '/images/Group 268 (6).png' },
              { title: 'Vocabulary', desc: 'Build your vocabulary with smart tools.', res: '10 Resources', resColor: 'text-[#137333]', bg: 'bg-[#E6F4EA]', image: '/images/Group 268 (7).png' },
              { title: 'Score Prediction', desc: 'Predict your PTE score accurately.', res: '10 Resources', resColor: 'text-blue-500', bg: 'bg-blue-100', image: '/images/Group 268 (8).png' },
              { title: 'Retell Lecture', desc: 'Practice retelling with ease.', res: '10 Resources', resColor: 'text-orange-500', bg: 'bg-orange-100', image: '/images/Group 268 (9).png' },
              { title: 'Sample Question', desc: 'Practice with real exam questions.', res: '10 Resources', resColor: 'text-red-500', bg: 'bg-red-100', image: '/images/Group 268 (10).png' },
              { title: 'Describe Image', desc: 'Master image description techniques.', res: '10 Resources', resColor: 'text-purple-600', bg: 'bg-purple-100', image: '/images/Group 268 (11).png' },
            ].map((cat, idx) => (
              <div key={`dup-${idx}`} className="bg-white rounded-3xl border-2 border-[#D9D9D9] p-[14px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow w-[220px] shrink-0">
                <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center mb-6 overflow-hidden`}>
                   <Image src={cat.image} alt={cat.title} width={40} height={40} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="font-extrabold text-black mb-3">{cat.title}</h3>
                <p className="text-sm font-medium text-black mb-8 flex-1">{cat.desc}</p>
                <div className={`font-bold text-sm ${cat.resColor}`}>
                   {cat.res}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* 3. Popular Resources */}
      <section className="py-12 mb-20">
        <div className="page-container">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold text-black">Popular Resources</h2>
          <Link href="#" className="border border-gray-200 text-[#3B28CC] font-bold py-2.5 px-6 rounded-lg flex items-center hover:bg-gray-50 transition-colors shadow-sm text-sm">
            Practice Now <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Reading Practice', desc: 'In depth guides to understand all PTE modules.', resCount: '5 Articles', btn: 'Read Now', bg: 'bg-[#A7F3D0]', iconColor: 'text-[#065F46]', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { title: 'Vocabulary Practice', desc: 'Essential vocabulary to improve your skills.', resCount: '100+ Words', btn: 'Learn', bg: 'bg-[#6EE7B7]', iconColor: 'text-[#047857]', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            { title: 'Read Aloud Practice', desc: 'Practice with read aloud and improve your pronunciation.', resCount: '5 Voice', btn: 'Read', bg: 'bg-[#FBCFE8]', iconColor: 'text-[#BE185D]', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
            { title: 'Answer Question Practice', desc: 'High-scoring guides and understand all PTE modules.', resCount: '5 Articles', btn: 'Read Now', bg: 'bg-[#FDE68A]', iconColor: 'text-[#B45309]', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Mock Test Practice', desc: 'Mock Test Practice and understand all PTE modules.', resCount: '5 Articles', btn: 'Read Now', bg: 'bg-[#FECACA]', iconColor: 'text-[#B91C1C]', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
            { title: 'Listening Audio Practice', desc: 'Practice learning with native English audio files.', resCount: '5 Audio', btn: 'Listen', bg: 'bg-[#BAE6FD]', iconColor: 'text-[#0369A1]', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-[#D9D9D9] p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-start mb-6">
                  <div className={`w-16 h-16 rounded-xl ${item.bg} flex items-center justify-center mr-5 shrink-0`}>
                      <svg className={`w-8 h-8 ${item.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                   </div>
                   <div>
                     <h3 className="font-extrabold text-black mb-2">{item.title}</h3>
                     <p className="text-sm text-black font-medium leading-relaxed">{item.desc}</p>
                  </div>
               </div>
               <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#D9D9D9]">
                  <div className="flex items-center text-sm font-semibold text-black">
                     <svg className="w-4 h-4 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     {item.resCount}
                  </div>
                  <button className="border border-gray-200 text-[#3B28CC] font-bold py-1.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                     {item.btn}
                  </button>
                </div>
             </div>
          ))}
        </div>
        </div>
      </section>

      <Footer />
      
      {/* Hide scrollbar utility class (for the horizontal scrolling list) */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
