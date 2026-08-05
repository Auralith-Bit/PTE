import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Navbar from '@/components/common/Navbar';
import './globals.css';

const inter = localFont({
  src: [
    { path: '../fonts/inter-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/inter-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/inter-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/inter-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PTE Prep — AI-Powered PTE Practice Platform',
  description:
    'Master every section with AI-powered feedback, realistic mock tests, and personalized PTE preparation. Join 50,000+ happy students worldwide.',
  keywords: 'PTE, PTE preparation, PTE practice, AI feedback, mock test, PTE score, English proficiency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
