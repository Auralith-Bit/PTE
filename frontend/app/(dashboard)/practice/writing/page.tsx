import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

// ── Icons ──
function DocTypeIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
}
function QuestionCircleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.9.7c0 1.6-2.4 1.6-2.4 3.3" />
      <circle cx="12" cy="16.5" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function BarsUpIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 19V13M12 19V8M19 19v-6" /></svg>;
}
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="M8 12.3l2.6 2.6L16.5 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
}
function SummarizeIcon() {
  return (
    <svg viewBox="0 0 22 22">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 15h2.2l6.3-6.3a1.4 1.4 0 0 0-2-2L9.2 13v2z" />
    </svg>
  );
}
function EssayIcon() {
  return (
    <svg viewBox="0 0 22 22">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 7h10M7 11h10M7 15h6" />
    </svg>
  );
}
const heroStats = [
  { value: "2", label: "Question Types", Icon: DocTypeIcon },
  { value: "1200+", label: "Practice Questions", Icon: QuestionCircleIcon },
  { value: "92%", label: "Student Improved", Icon: BarsUpIcon },
];

const aiFeedbackRows = [
  { label: "Content", tag: "Good" },
  { label: "Structure", tag: "Good" },
  { label: "Grammar", tag: "Good" },
  { label: "Vocabulary", tag: "Good" },
  { label: "Coherence", tag: "Good" },
];

const writingTasks = [
  {
    title: "Summarize Written Text",
    description: "Read a short passage and write a summary in your own words. Your response should be in one sentence.",
    bullets: ["Focus on main ideas and key points", "Test your reading and summarizing skills"],
    time: "Average Time: 30 mins",
    Icon: SummarizeIcon,
    image: "/images/writingtext.png",
  },
  {
    title: "Essay",
    description: "Write an essay on the given topic. Express your opinion and support it with reasons and examples.",
    bullets: ["Express your ideas clearly", "Develop arguments and examples"],
    time: "Average Time: 30 mins",
    Icon: EssayIcon,
    image: "/images/writingessay.png",
  },
];

const writingSkillPoints = [
  { title: "AI Evaluation", description: "Get instant AI feedback on your writing.", image: "/images/aievaluation.png" },
  { title: "Model Answers", description: "Read high-scoring sample answers.", image: "/images/modelanswers.png" },
  { title: "Score Improvement", description: "Track your progress and improve.", image: "/images/scoreimprovement.png" },
  { title: "Grammar & Vocabulary", description: "Enhance your grammar and vocabulary.", image: "/images/grammar&vocabulary.png" },
  { title: "Practice Anytime", description: "Practice anytime, anywhere.", image: "/images/practiceanytime.png" },
];

export default function WritingPracticePage() {
  return (
    <main className="practice-page">
      <section className="speaking-hero practice-hero">
        <div className="speaking-hero-grid">
          <div className="speaking-hero-copy">
            <div className="breadcrumbs">
              <Link href="/practice">Practice</Link><Chevron /><span>Writing</span><Chevron />
            </div>
            <h1>Writing Practice</h1>
            <p>
              Improve your writing skills with AI-powered evaluation, detailed
              feedback, and real exam-style tasks. Practice Summarize Written
              Text and Essay to build grammar, vocabulary, and confidence for
              a higher PTE score.
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

          <div className="speaking-hero-visual practice-hero-visual">
            <Image
              src="/images/girlpicwriting.png"
              alt="Student writing an essay with a laptop during PTE writing practice"
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
      </section>

      <section className="content-section writing-tasks-section">
        <div className="writing-tasks-grid">
          {writingTasks.map(({ title, description, bullets, time, Icon, image }) => (
            <article className="writing-task-card" key={title}>
              <div className="writing-task-copy">
                <div className="writing-task-heading">
                  <span className="writing-task-icon"><Icon /></span>
                  <h3>{title}</h3>
                </div>
                <p>{description}</p>
                <ul className="writing-task-bullets">
                  {bullets.map((b) => (
                    <li key={b}>
                      <span className="writing-check-icon"><CheckCircleIcon /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`writing-task-illustration${image.includes('writingtext') ? ' writing-text-illustration' : ''}`}>
                <Image src={image} alt={`${title} illustration`} width={100} height={85} />
              </div>
              <div className="writing-task-footer">
                <span className="writing-time"><ClockIcon /> {time}</span>
                <Link href="/practice/writing" className="practice-button">
                  Practice <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="practice-skills-banner">
          <h2 className="section-title-center">Improve Your Writing Skills</h2>
          <div className="practice-skills-grid">
            {writingSkillPoints.map(({ title, description, image }) => (
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
      </section>

      <section className="content-section">
        <div className="practice-cta-banner">
          <div className="practice-cta-robot-wrap">
            <Image src="/images/writingrobot.png" alt="AI robot mascot" width={140} height={140} />
          </div>
          <div className="practice-cta-copy">
            <h3>Get AI Feedback On Your Writing</h3>
            <p>Submit your answer get instant AI feedback to improve your writing score</p>
          </div>
          <Link href="/practice/writing" className="practice-button practice-cta-button">
            Start Free Practicing Test <span aria-hidden="true">→</span>
          </Link>
          <div className="practice-cta-illustration">
            <Image src="/images/writingfeedback.png" alt="Checklist illustration" width={140} height={140} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}