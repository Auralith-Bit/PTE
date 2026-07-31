import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

// ── Icons ──
function MicIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
      <path d="M19 11a7 7 0 0 1-14 0M12 18v4" />
    </svg>
  );
}
function DocIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
}
function StarIcon() {
  return <svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>;
}
function WaveformIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 9v6M8 6v12M12 3v18M16 7v10M20 10v4" /></svg>;
}
function RepeatIcon() {
  return <svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function GalleryIcon() {
  return <Image src="/images/gallery.png" alt="" width={18} height={18} style={{ objectFit: "contain" }} />;
}
function LectureIcon() {
  return <Image src="/images/RetellLecture.png" alt="Retell Lecture" width={24} height={24} style={{ objectFit: "contain" }} />;
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4.5 4.2V15H4a2 2 0 0 1-2-2V5z" fill="currentColor" />
      <path d="M11 11a1.6 1.6 0 0 1 1.6-1.6h7A1.6 1.6 0 0 1 21 11v5.6a1.6 1.6 0 0 1-1.6 1.6h-5.7l-3 2.8v-2.8h-.1A1.6 1.6 0 0 1 9 16.6V11z" fill="currentColor" stroke="#f3f1fd" strokeWidth="1.6" />
    </svg>
  );
}
function AIChatIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3.5V15H5a2 2 0 0 1-2-2V5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.5 7.6h6.5M6.5 10.4h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M20.5 0.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
function HeadphonesIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2" y="13" width="5" height="7" rx="2" />
      <rect x="17" y="13" width="5" height="7" rx="2" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M4 20v-1a5 5 0 0 1 10 0v1" />
      <path d="M14.5 20v-.8a4 4 0 0 1 6-3.5" />
    </svg>
  );
}
function RobotIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <circle cx="9" cy="14" r="1.2" />
      <circle cx="15" cy="14" r="1.2" />
      <path d="M12 8V4m0 0h-2m2 0h2" />
    </svg>
  );
}

const heroStats = [
  { value: "7", label: "Question Types", Icon: MicIcon },
  { value: "1200+", label: "Practice Questions", Icon: DocIcon },
  { value: "92%", label: "Student Improved", Icon: StarIcon },
];

const aiFeedbackRows = [
  { label: "Pronunciation", tag: "Good" },
  { label: "Fluency", tag: "Good" },
  { label: "Content", tag: "Good" },
];

const speakingTypes = [
  ["Read Aloud", "Read the displayed text clearly and naturally to improve pronunciation and fluency.", WaveformIcon, "read-aloud"],
  ["Repeat Sentence", "Listen carefully and repeat the sentence exactly as you hear it to improve memory.", RepeatIcon, "repeat-sentence"],
  ["Describe Image", "Analyze visual information and deliver a clear, structured response with confidence and accuracy.", GalleryIcon, "describe-image"],
  ["Retell Lecture", "Listen to a lecture and summarize the main ideas in a well-organized spoken response.", LectureIcon, "retell-lecture"],
  ["Answer Short Question", "Respond quickly and accurately to general knowledge and everyday questions with answers.", ChatIcon, "answer-short-question"],
  ["Summarize Spoken Test", "Listen to an audio recording and write a concise summary of the key information.", HeadphonesIcon, "summarize-spoken-test"],
  ["Response to a Situation", "Read a real-life scenario and provide an appropriate, effective spoken response.", PeopleIcon, "response-to-a-situation"],
  ["Read Aloud", "Read the displayed text clearly and naturally to improve pronunciation and fluency.", WaveformIcon, "read-aloud"],
] as const;

const overviewBars = [
  { label: "Pronunciation", value: 40 },
  { label: "Fluency", value: 25 },
  { label: "Content", value: 15 },
  { label: "Oral Skill", value: 5 },
];

export default function SpeakingPracticePage() {
  return (
    <main className="practice-page">
      <section className="speaking-hero">
        <div className="speaking-hero-grid">
          <div className="speaking-hero-copy">
            <div className="breadcrumbs">
              <Link href="/practice">Practice</Link><Chevron /><span>Speaking</span><Chevron />
            </div>
            <h1>Speaking Practice</h1>
            <p>
              Improve your speaking skills with AI-powered feedback, real exam
              simulations, and detailed performance insights. Practice
              confidently and boost your fluency, pronunciation, and overall
              speaking score.
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

          <div className="speaking-hero-visual">
            <span className="speaking-floating-chat"><AIChatIcon /></span>
            <Image
              src="/images/GirlSpeaking.png"
              alt="Student speaking into a headset microphone during practice"
              width={760}
              height={640}
              className="speaking-hero-image"
              priority
            />
            <div className="ai-feedback-card">
              <h4>AI Feedback</h4>
              {aiFeedbackRows.map(({ label, tag }) => (
                <div className="ai-feedback-row" key={label}>
                  <span>{label}</span>
                  <b className="tag-good">{tag}</b>
                </div>
              ))}
            </div>
            <div className="audio-bar">
              <span className="audio-mic"><MicIcon /></span>
              <div className="audio-waveform">
                {Array.from({ length: 22 }).map((_, i) => (
                  <span key={i} style={{ height: `${8 + ((i * 7) % 20)}px` }} />
                ))}
              </div>
              <span className="audio-sound-icon">
                <Image src="/images/speakingsound.png" alt="Sound" width={24} height={24} />
              </span>
              <span className="audio-time">00:32</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section speaking-types-section">
        <h2 className="section-title-center">Speaking Question Types</h2>
        <div className="speaking-types-layout">
          <div className="speaking-types-grid">
            {speakingTypes.map(([title, description, Icon, slug], i) => (
              <article className="speaking-type-card" key={`${title}-${i}`}>
                <span className="speaking-type-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="speaking-type-meta">15+ Solutions</span>
                <Link className="outline-pill-button" href={`/practice/speaking/${slug}`}>
                  Practice <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <aside className="speaking-overview-card">
            <h3>Your Speaking Overview</h3>
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
              {overviewBars.map(({ label, value }) => (
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
            <Link href="/practice/speaking" className="practice-button overview-cta">
              Start Full Test
            </Link>
          </aside>
        </div>
      </section>

      <section className="content-section">
        <div className="ai-cta-banner">
          <div className="ai-cta-copy">
            <h3>Get AI Feedback On Your Speaking</h3>
            <p>Receive instant AI-powered feedback to improve your speaking score.</p>
            <Link href="/practice/speaking" className="practice-button">
              Start Free Practicing Test <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="ai-cta-visual">
            <Image src="/images/Aifeedback.png" alt="AI Feedback" width={380} height={380} style={{ objectFit: "contain" }} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}