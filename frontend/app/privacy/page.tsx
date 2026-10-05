import type { Metadata } from 'next';

import LegalLayout from '@/components/common/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — AURALITH PTE',
  description:
    'How Auralith Bit collects, uses and handles personal data for AURALITH PTE. Our full Privacy Policy is being finalised.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <header className="legal-header">
        <p className="legal-brand">AURALITH PTE</p>
        <h1 className="legal-title">PRIVACY POLICY</h1>
        <p className="legal-subtitle">Operated by Auralith Bit</p>
      </header>

      <div className="legal-intro">
        <p className="legal-p">
          Auralith Bit is finalising our Privacy Policy for AURALITH PTE. It will be published on
          this page shortly.
        </p>
        <p className="legal-p">
          If you have a privacy question in the meantime, contact us at info@auralithbit.com.np.
        </p>
      </div>
    </LegalLayout>
  );
}