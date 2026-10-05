import type { ReactNode } from 'react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';

/**
 * Shared chrome for the public legal documents.
 *
 * Navbar and Footer live in no layout, so every page imports them itself. Both
 * legal routes use this wrapper to keep their document shell identical.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="legal-page min-h-screen bg-white font-sans">
      <Navbar />
      <main className="legal-body">
        <div className="page-container">
          <article className="legal-doc">{children}</article>
        </div>
      </main>
      <Footer />
    </div>
  );
}