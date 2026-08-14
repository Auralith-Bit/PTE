import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <section className="bg-[#F5F3FF]">
        <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h1 className="text-[2rem] font-extrabold text-gray-900 leading-[1.2] mb-4">
            Your Dashboard is{' '}
            <span className="text-[#3008F8]">Coming Soon</span>
          </h1>
          <p className="text-gray-600 text-[15px] font-medium mb-8 max-w-[460px]">
            Track your practice progress, scores, and performance all in one place. Start practising while we build it.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-[#3008F8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2506c4] transition-all duration-200 shadow-md"
          >
            Start Practicing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
