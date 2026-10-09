import type { Metadata } from 'next';

import LegalLayout from '@/components/common/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — AURALITH PTE',
  description:
    'Privacy Policy explaining how Auralith Bit collects, uses, stores and protects information when you use AURALITH PTE.',
};

/**
 * Body text is transcribed verbatim from
 * AURALITH_PTE_Privacy_Policy.pdf. Only the repeating
 * "AURALITH PTE - Privacy Policy" / "Page N" running headers are dropped,
 * since those are exporter page furniture rather than document content, and
 * lines the PDF wrapped mid-sentence are rejoined into whole paragraphs.
 * No wording was changed.
 */
type Section = { id: number; title: string; body: string };

const SECTIONS: Section[] = [
  {
    id: 1,
    title: 'Introduction',
    body: 'This Privacy Policy explains how Auralith Bit (“we”, “us”, or “our”) collects, uses, stores, and protects information when you use AURALITH PTE, our PTE preparation and learning platform.',
  },
  {
    id: 2,
    title: 'Information We Collect',
    body: 'Depending on how you use the platform, we may collect your name, email address, account and login details, learning progress, test attempts, practice scores, written answers, essays, audio or speaking recordings, feedback, device information, technical logs, and payment-related information handled by payment providers.',
  },
  {
    id: 3,
    title: 'How We Use Information',
    body: 'We use information to manage accounts, provide learning services, evaluate responses, generate feedback and analytics, track progress, process purchases, provide support, maintain security, troubleshoot issues, improve services, and comply with legal obligations.',
  },
  {
    id: 4,
    title: 'AI-Assisted Evaluation and Audio',
    body: 'Speaking or writing submissions, including audio recordings, may be processed by automated systems or AI tools to provide feedback, estimates, and learning analytics. These evaluations are for preparation only and are not official Pearson PTE scores.',
  },
  {
    id: 5,
    title: 'Payments',
    body: 'Payments may be processed by third-party payment providers. We may receive limited transaction details needed to confirm purchases, manage subscriptions, and provide support. The provider’s own terms and privacy policy may also apply.',
  },
  {
    id: 6,
    title: 'Cookies and Technical Data',
    body: 'The platform may use cookies or similar technologies and technical logs to support sign-in, remember preferences, maintain security, understand usage, and improve performance. You can manage cookies through your browser settings, though some features may not work properly if disabled.',
  },
  {
    id: 7,
    title: 'Sharing of Information',
    body: 'We may share information with service providers supporting hosting, authentication, analytics, communication, AI, and payments, as reasonably needed. We may disclose information when required by law, to protect rights or safety, or in connection with a business transfer. We do not sell personal information as a standalone product.',
  },
  {
    id: 8,
    title: 'Data Storage and Security',
    body: 'We use reasonable technical and organizational measures designed to protect information, but no online service can guarantee absolute security. Information may be stored or processed by service providers in other locations, subject to applicable law and provider arrangements.',
  },
  {
    id: 9,
    title: 'Data Retention',
    body: 'We retain information for as long as reasonably necessary to provide services, maintain account and learning records, resolve disputes, enforce our terms, meet legal obligations, and protect security. Retention periods may vary by information type and purpose.',
  },
  {
    id: 10,
    title: 'Your Choices and Rights',
    body: 'Subject to applicable law, you may request access to, correction of, or deletion of your personal information, or ask how it is used. Some information may need to be retained for legal, operational, or security purposes. You may stop using the platform or contact us about closing your account.',
  },
  {
    id: 11,
    title: 'Children and Minors',
    body: 'If you are under the age of majority applicable to you, parental or legal guardian involvement or consent may be required by law. Please do not provide personal information unnecessary for learning activities.',
  },
  {
    id: 12,
    title: 'Third-Party Services and Links',
    body: 'AURALITH PTE may use or link to third-party services. We do not control their privacy practices; their own privacy policies and terms apply. Review those policies before sharing information with them.',
  },
  {
    id: 13,
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. The latest version will show an updated “Last Updated” date. Where required, we will provide notice of material changes.',
  },
];

const CONTACT = {
  id: 14,
  title: 'Contact Us',
  intro: 'For privacy questions, requests, or concerns, contact Auralith Bit using the details below.',
  lines: [
    'Auralith Bit',
    'Platform: AURALITH PTE',
    'Website: auralithbit.com.np',
    'Email: info@auralithbit.com.np',
    'Address: SNP-05, Milan Chowk, Bhairahawa, Nepal',
    'Contact: +977 9766715783, +977 9766715793',
  ],
};

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <header className="legal-header">
        <p className="legal-brand">AURALITH PTE</p>
        <h1 className="legal-title">PRIVACY POLICY</h1>
        <p className="legal-subtitle">
          Operated by Auralith Bit • Last Updated: 2083/06/05
        </p>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.id} className="legal-section">
          <h2 className="legal-h2">
            {section.id}. {section.title}
          </h2>
          <p className="legal-p">{section.body}</p>
        </section>
      ))}

      <section className="legal-section">
        <h2 className="legal-h2">
          {CONTACT.id}. {CONTACT.title}
        </h2>
        <p className="legal-p">{CONTACT.intro}</p>
        <div className="legal-contact">
          {CONTACT.lines.map((line, index) =>
            index === 0 ? (
              <p key={line} className="legal-contact-name">
                {line}
              </p>
            ) : (
              <p key={line} className="legal-contact-line">
                {line}
              </p>
            ),
          )}
        </div>
      </section>

      <p className="legal-copyright">© 2083 Auralith Bit. All rights reserved.</p>
    </LegalLayout>
  );
}