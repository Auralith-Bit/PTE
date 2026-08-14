import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

// ── Icons ──
function HeadphonesIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="2" y="13" width="5" height="7" rx="2" /><rect x="17" y="13" width="5" height="7" rx="2" /></svg>;
}
function DocTypeIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
}
function BarsUpIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 19V13M12 19V8M19 19v-6" /></svg>;
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
}
function SummarizeIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M8 8h5M8 16h6" /></svg>;
}
function MultiCheckIcon() {
  return (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RadioIcon() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function BlanksIcon() {
  return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 12h4M13 12h4M7 16h6" /></svg>;
}
function HighlightIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 7h10M7 11h10M7 15h6" />
      <path d="M4 3v18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const heroStats = [
  { value: "5", label: "Question Types", Icon: DocTypeIcon },
  { value: "1200+", label: "Practice Questions", Icon: HeadphonesIcon },
  { value: "92%", label: "Student Improved", Icon: BarsUpIcon },
];

const aiFeedbackRows = [
  { label: "Listening", tag: "Good" },
  { label: "Comprehension", tag: "Good" },
  { label: "Summary", tag: "Good" },
];

const listeningTasks = [
  {
    title: "Summarize Spoken Test",
    description: "Listen to a short audio and write a summary in one sentence.",
    time: "Average Time 10 mins",
    Icon: SummarizeIcon,
    slug: "summarize-spoken-test",
  },
  {
    title: "Multiple Choice Multiple Answers",
    description: "Listen to the audio and select all the correct answers.",
    time: "Average Time 10 mins",
    Icon: MultiCheckIcon,
    slug: "multiple-choice-multiple-answers",
  },
  {
    title: "Multiple Choice Single Answer",
    description: "Listen to the audio and choose the single best answer.",
    time: "Average Time 10 mins",
    Icon: RadioIcon,
    slug: "multiple-choice-single-answer",
  },
  {
    title: "Fill in the Blanks",
    description: "Listen to the audio and fill in the missing words in the blanks.",
    time: "Average Time 10 mins",
    Icon: BlanksIcon,
    slug: "fill-in-the-blanks",
  },
  {
    title: "Highlight Correct Summary",
    description: "Listen to the audio and highlight the correct summary.",
    time: "Average Time 10 mins",
    Icon: HighlightIcon,
    slug: "highlight-correct-summary",
  },
];

const listeningSkillPoints = [
  { title: "Real Exam Audio", description: "Practice with real PTE exam-style audio.", image: "/images/realexamaudio.png" },
  { title: "Smart Note-Taking", description: "Learn effective note-taking techniques.", image: "/images/smartnotetaking.png" },
  { title: "Better Accuracy", description: "Improve accuracy with regular practice.", image: "/images/scoreimprovement.png" },
  { title: "Performance Tracking", description: "Track your performance and progress.", image: "/images/performancetracking.png" },
  { title: "Practice Anywhere", description: "Access listening practice anytime, anywhere.", image: "/images/practiceanywhere.png" },
];

export default function ListeningPracticePage() {
  return (
    <main className="practice-page">
      <section className="speaking-hero practice-hero">
        <div className="page-container">
        <div className="speaking-hero-grid">
          <div className="speaking-hero-copy">
            <div className="breadcrumbs">
              <Link href="/practice">Practice</Link><Chevron /><span>Listening</span><Chevron />
            </div>
            <h1>Listening Practice</h1>
            <p>
              Improve your listening skills with real PTE exam-style audio,
              AI-powered feedback, and regular practice to strengthen your
              comprehension, note-taking, and overall performance. Build
              confidence to achieve your target PTE score.
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

          <div className="speaking-hero-visual practice-hero-visual listening-hero-visual">
            <Image
              src="/images/girlpiclistening.png"
              alt="Student wearing headphones during PTE listening practice"
              width={760}
              height={640}
              className="speaking-hero-image"
              priority
            />
            <div className="ai-feedback-card practice-feedback-card">
              <h4>AI Feedback</h4>
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

      <section className="content-section listening-tasks-section">
        <div className="page-container">
        <h2 className="section-title-center">Listening Question Types</h2>
        <div className="listening-tasks-grid">
          {listeningTasks.map(({ title, description, time, Icon, slug }) => (
            <article className="listening-task-card" key={title}>
              <span className="listening-task-icon"><Icon /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="listening-task-time"><ClockIcon /> {time}</span>
              <Link href={`/practice/listening/${slug}`} className="practice-button">
                Practice <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="practice-skills-banner">
          <h2 className="section-title-center">Improve Your Listening Skills</h2>
          <div className="practice-skills-grid">
            {listeningSkillPoints.map(({ title, description, image }) => (
              <div className="practice-skill-item" key={title}>
                <span className="practice-skill-icon">
                  <Image src={image} alt={title} width={40} height={40} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className="content-section">
        <div className="page-container">
          <div className="practice-cta-banner">
          <div className="practice-cta-robot-wrap">
            <Image src="/images/writingrobot.png" alt="AI robot mascot" width={140} height={140} />
          </div>
          <div className="practice-cta-copy">
            <h3>Get AI Feedback On Your Listening</h3>
            <p>Get instant AI feedback on your performance and identify your weak areas to improve faster.</p>
          </div>
          <Link href="/practice/listening" className="practice-button practice-cta-button">
            Start Free Practicing Test <span aria-hidden="true">→</span>
          </Link>
          <div className="practice-cta-illustration">
            <Image src="/images/writingfeedback.png" alt="Checklist illustration" width={140} height={140} />
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
