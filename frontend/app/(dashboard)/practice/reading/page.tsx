import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

// ── Icons ──
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 5.5C6 4 8.5 4 11 5v13.5C8.5 17.5 6 17.5 4 19V5.5z" />
      <path d="M20 5.5C18 4 15.5 4 13 5v13.5c2.5-1 5-1 7 .5V5.5z" />
    </svg>
  );
}
function DocFillIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M6 2h9l5 5v15H6V2z" />
      <path d="M14 2v6h6" fill="#fff" />
    </svg>
  );
}
function TrendUpIcon() {
  return <svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-9" /><path d="M15 6h6v6" /></svg>;
}
function EditSquareIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 15h2.2l6.3-6.3a1.4 1.4 0 0 0-2-2L9.2 13v2z" />
    </svg>
  );
}
function ChecklistIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="10" height="10" rx="2" />
      <path d="M6 8l1.5 1.5L11 6" />
      <path d="M17 5h4M17 9h4M17 13h4M17 17h4M3 17h10" />
    </svg>
  );
}
function SwapIcon() {
  return <svg viewBox="0 0 24 24"><path d="M7 7h13l-3-3m3 3l-3 3M17 17H4l3-3m-3 3l3 3" /></svg>;
}
function LinesIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>;
}
function BulletListIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="1.4" fill="currentColor" stroke="none" /><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="5" cy="18" r="1.4" fill="currentColor" stroke="none" /><path d="M9 6h11M9 12h11M9 18h11" /></svg>;
}
function SearchIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-5-5" /></svg>;
}
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M6 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      <path d="M17 9l1.4 3.6L22 14l-3.6 1.4L17 19l-1.4-3.6L12 14l3.6-1.4z" />
    </svg>
  );
}

const heroStats = [
  { value: "10", label: "Question Types", Icon: BookIcon },
  { value: "1500+", label: "Practice Questions", Icon: DocFillIcon },
  { value: "95%", label: "Student Improved", Icon: TrendUpIcon },
];

const aiFeedbackRows = [
  { label: "Accuracy", tag: "Good" },
  { label: "Vocabulary", tag: "Good" },
  { label: "Speed", tag: "Good" },
  { label: "Conherence", tag: "Good" },
];

const readingTypes = [
  ["Reading & Writing: Fill in the Blanks", "Fill in the missing words by selecting the most suitable options from the list.", EditSquareIcon],
  ["Multiple Choice, Multiple Answers", "Fill in the missing words by selecting the most suitable options from the list.", ChecklistIcon],
  ["Re-order Paragraphs", "Arrange the text boxes into the correct logical order to form a meaningful passage.", SwapIcon],
  ["Reading: Fill in the Blanks", "Fill in the missing words by selecting the most suitable options from the list.", LinesIcon],
  ["Multiple Choice, Single Answer", "Fill in the missing words by selecting the most suitable options from the list.", BulletListIcon],
  ["Reading Overview Card", "Fill in the missing words by selecting the most suitable options from the list.", BookIcon],
  ["Summarize Written Text", "Fill in the missing words by selecting the most suitable options from the list.", EditSquareIcon],
  ["Highlight Correct Summary", "Fill in the missing words by selecting the most suitable options from the list.", SearchIcon],
] as const;

const overviewRows = [
  { label: "Accuracy", value: 90 },
  { label: "Vocabulary", value: 80 },
  { label: "Reading Speed", value: 75 },
  { label: "Improve", value: 95 },
];

export default function ReadingPracticePage() {
  return (
    <main className="practice-page">
      <section className="speaking-hero reading-hero">
        <div className="page-container">
        <div className="speaking-hero-grid">
          <div className="speaking-hero-copy">
            <div className="breadcrumbs">
              <Link href="/practice">Practice</Link><Chevron /><span>Reading</span><Chevron />
            </div>
            <h1>Reading Practice</h1>
            <p>
              Improve your reading skills with AI-powered practice, exam-style
              questions, and detailed explanations. Practice regularly to
              strengthen your comprehension, vocabulary, and reading accuracy
              for a higher PTE score.
            </p>
            <div className="speaking-stats">
              {heroStats.map(({ value, label, Icon }) => (
                <div className="speaking-stat" key={label}>
                  <span className="speaking-stat-icon"><Icon /></span>
                  <div>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="speaking-hero-visual reading-hero-visual">
            <span className="speaking-floating-chat reading-floating-doc"><LinesIcon /></span>
            <Image
              src="/images/girlpicreading.png"
              alt="Student reading a book during PTE reading practice"
              width={760}
              height={640}
              className="speaking-hero-image"
              priority
            />
            <div className="ai-feedback-card reading-feedback-card">
              <h4><SparkleIcon /> AI Reading Feedback</h4>
              {aiFeedbackRows.map(({ label, tag }) => (
                <div className="ai-feedback-row" key={label}>
                  <span>{label}</span>
                  <b className="tag-good">{tag}</b>
                </div>
              ))}
            </div>

          </div>
        </div>
        </div>
      </section>

      <section className="content-section speaking-types-section">
        <div className="page-container">
        <h2 className="section-title-center">Reading Question Types</h2>
        <div className="speaking-types-layout">
          <div className="speaking-types-grid">
            {readingTypes.map(([title, description, Icon], i) => (
              <article className="speaking-type-card" key={`${title}-${i}`}>
                <span className="speaking-type-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="speaking-type-meta">15+ Solutions</span>
                <Link className="outline-pill-button" href="/practice/reading">
                  Practice <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <aside className="speaking-overview-card">
            <h3>Your Reading Overview</h3>
            <div
              className="overview-donut"
              style={{
                background: "conic-gradient(var(--brand-blue) 0% 85%, #e7e3f5 85% 100%)",
              }}
            >
              <div>
                <b>85%</b>
                <small>Good</small>
              </div>
            </div>
            <div className="overview-bars">
              {overviewRows.map(({ label, value }) => (
                <div className="overview-bar-row" key={label}>
                  <div className="overview-bar-label">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="overview-bar-track">
                    <div className="overview-bar-fill" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/practice/reading" className="practice-button overview-cta">
              Start Full Test
            </Link>
          </aside>
        </div>
        </div>
      </section>

      <section className="content-section">
        <div className="page-container">
          <div className="ai-cta-banner">
          <div className="ai-cta-copy">
            <h3>Get AI Feedback On Your Reading</h3>
            <p>
              Receive instant AI-powered feedback to improve your reading score,
              comprehension, vocabulary, and overall exam perfermance.
            </p>
            <Link href="/practice/reading" className="practice-button">
              Start Free Practicing Test <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="ai-cta-visual">
            <Image src="/images/Aifeedback.png" alt="AI Feedback" width={380} height={380} style={{ objectFit: "contain" }} />
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}