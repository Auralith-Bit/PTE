import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

// ── Icon components (stroke-based, matches home page style) ──
function WaveformIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 9v6M8 6v12M12 3v18M16 7v10M20 10v4" /></svg>;
}
function TrophyIcon() {
  return <svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8 20h8" /></svg>;
}
function StarIcon() {
  return <svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>;
}
function RepeatIcon() {
  return <svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}

// ── Solid/filled icons matching the provided reference images ──
function ImageIcon() {
  return <Image src="/images/gallery.png" alt="" width={18} height={18} style={{ objectFit: "contain" }} />;
}
function LectureIcon() {
  return <Image src="/images/RetellLecture.png" alt="Retell Lecture" className="retell-lecture-icon" width={24} height={24} style={{ objectFit: "contain" }} />;
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4.5 4.2V15H4a2 2 0 0 1-2-2V5z" fill="currentColor" />
      <path d="M11 11a1.6 1.6 0 0 1 1.6-1.6h7A1.6 1.6 0 0 1 21 11v5.6a1.6 1.6 0 0 1-1.6 1.6h-5.7l-3 2.8v-2.8h-.1A1.6 1.6 0 0 1 9 16.6V11z" fill="currentColor" stroke="#f3f1fd" strokeWidth="1.6" />
    </svg>
  );
}
function InsightIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="20" width="17" height="0.5" rx="1" fill="currentColor" />
      <rect x="3" y="16" width="1.6" height="2" rx="0.8" fill="currentColor" />
      <rect x="7.6" y="13" width="1.6" height="5" rx="0.8" fill="currentColor" />
      <rect x="12.2" y="10" width="1.6" height="10" rx="0.8" fill="currentColor" />
      <rect x="16.8" y="6" width="1.6" height="14" rx="0.8" fill="currentColor" />
      <path d="M3.8 12 L17.3 3.2 L17.7 4.7 L4.0 13.5 Z" fill="currentColor" />
      <path d="M15.0 3.0 L19.5 1.6 L18.0 4.0 Z" fill="currentColor" />
    </svg>
  );
}

function RobotIcon() {
  return <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3" /><circle cx="9" cy="14" r="1.2" /><circle cx="15" cy="14" r="1.2" /><path d="M12 8V4m0 0h-2m2 0h2" /></svg>;
}
function ClockIcon() {
  return <svg viewBox="2 2 20 20"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
}
function SlidersIcon() {
  return <svg viewBox="2 3 19 17"><path d="M4 6h10M17 6h3M4 12h4M11 12h9M4 18h13" /><circle cx="14" cy="6" r="2" /><circle cx="7" cy="12" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
}
function DocIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
}
const stats = [
  { value: "12,410+", label: "Questions Practices", Icon: WaveformIcon },
  { value: "98%", label: "Average Improvement", Icon: TrophyIcon },
  { value: "50,000+", label: "Active Learners", Icon: StarIcon },
];

const questionTypes = [
  ["Read Aloud", "Read the displayed text clearly and naturally to improve pronunciation and fluency.", WaveformIcon, "read-aloud"],
  ["Repeat Sentence", "Listen carefully and repeat the sentence exactly as you hear it to improve memory.", RepeatIcon, "repeat-sentence"],
  ["Describe Image", "Analyze visual information and deliver a clear, structured response with confidence and accuracy.", ImageIcon, "describe-image"],
  ["Retell Lecture", "Listen to a lecture and summarize the main ideas in a well-organized spoken response.", LectureIcon, "retell-lecture"],
  ["Answer Short Question", "Respond quickly and accurately to general knowledge and everyday questions.", ChatIcon, "answer-short-question"],
] as const;

const practiceModes = [
  ["AI Feedback Practice", "Practice with instant AI feedback on fluency, pronunciation, grammar and content.", RobotIcon],
  ["Timed Practice", "Simulate real exam conditions with timed practice and improve your speed.", ClockIcon],
  ["Custom Practice", "Choose your question type, time and difficulty level to customize your practice.", SlidersIcon],
] as const;

const recentPractice = [
  ["Read Aloud", "Attempted on 21 May 2026", "82/100", WaveformIcon],
  ["Repeat Sentence", "Attempted on 23 May 2026", "75/100", RepeatIcon],
  ["Describe Image", "Attempted on 11 May 2026", "73/100", ImageIcon],
  ["Retell Lecture", "Attempted on 26 May 2026", "69/100", LectureIcon],
  ["Answer Short Question", "Attempted on 29 May 2026", "65/100", ChatIcon],
] as const;

const performanceMetrics = [
  { label: "Pronunciation", score: "87/100", color: "#2e10f2", value: 87 },
  { label: "Fluency", score: "87/100", color: "#16a34a", value: 87 },
  { label: "Content", score: "87/100", color: "#f97316", value: 87 },
  { label: "Grammar", score: "87/100", color: "#22d3ee", value: 87 },
];

export default function PracticePage() {
  return (
    <main className="practice-page">
      <section className="practice-hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="breadcrumbs">
              <Link href="/">Home</Link><Chevron /><span>Practice</span><Chevron />
            </div>
            <h1>Practice <em>Smarter</em> and<br /><em>Achieve</em> Higher Scores</h1>
            <p>Build confidence, improve accuracy, and master every PTE<br /> question type through targeted practice.</p>
            <div className="stats-card">
              {stats.map(({ value, label, Icon }) => (
                <div className="stat" key={label}>
                  <span className="stat-icon"><Icon /></span>
                  <span><strong>{value}</strong><small>{label}</small></span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image-wrap">
            <Image src="/images/girlPic.png" alt="Student wearing headphones and practising speaking" width={800} height={600} priority />
          </div>
        </div>
      </section>

      <section className="content-section question-section">
        <div className="section-heading">
          <h2>Practice by Question Type</h2>
          <button className="outline-link"><InsightIcon /> View Performance</button>
        </div>
        <div className="question-grid">
            {questionTypes.map(([title, description, Icon, slug]) => (
            <article className="question-card" key={title}>
              <span className="card-icon"><Icon /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link className="practice-button" href={`/practice/speaking/${slug}`}>
                Practice Now
              </Link>
              <small className="card-meta"><DocIcon /> 10 Questions</small>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section mode-section">
        <div className="section-heading">
          <h2>Practice Options</h2>
          <Link className="practice-button" href="/practice">
            Practice Now →
          </Link>
        </div>
        <div className="mode-grid">
          {practiceModes.map(([title, description, Icon], idx) => (
            <article className="mode-card" key={title}>
              <span className="mode-icon">
                {idx === 0 ? (
                  <Image src="/images/Robot.png" alt={title} width={56} height={56} style={{ objectFit: "contain", width: "100%", height: "100%", borderRadius: "50%" }} />
                ) : (
                  <Icon />
                )}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link className="text-link" href="/practice">
                  Start Practice →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section dashboard-grid">
        <article className="dashboard-card recent-card">
          <div className="card-heading">
            <h2>Your Recent Practice</h2>
            <button className="view-all">View All</button>
          </div>
          {recentPractice.map(([title, date, score, Icon]) => (
            <div className="recent-row" key={title}>
              <span className="recent-icon"><Icon /></span>
              <div>
                <h3>{title}</h3>
                <p>{date}</p>
              </div>
              <b>{score}</b>
            </div>
          ))}
        </article>

        <article className="dashboard-card performance-card">
          <div className="card-heading">
            <h2>Overall Performance</h2>
            <button className="view-all">This Month <svg className="chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
          </div>
          <div className="performance-main">
            <div
              className="donut"
              style={{
                background:
                  "conic-gradient(#2e10f2 0% 22%, #16a34a 22% 44%, #f97316 44% 66%, #22d3ee 66% 88%, #e9e9f2 88% 100%)",
              }}
            >
              <div>
                <b>88%</b>
                <small>Performance</small>
              </div>
            </div>
            <div className="performance-bars">
              {performanceMetrics.map(({ label, score, color, value }) => (
                <div className="performance-bar-row" key={label}>
                  <div className="performance-bar-label">
                    <span className="metric-label">
                      <i className="dot" style={{ background: color }} />
                      {label}
                    </span>
                    <b>{score}</b>
                  </div>
                  <div className="performance-bar-track">
                    <div className="performance-bar-fill" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="great-job">
            <span><TrophyIcon /></span>
            <div>
              <strong>Great job! You are improving consistently.</strong>
              <small>Keep practicing to achieve a perfect score!</small>
            </div>
          </div>
        </article>
      </section>

      <section className="content-section">
        <div className="daily-banner">
          <div className="daily-banner-content">
            <span className="daily-icon"><Image src="/images/dailybannericon.png" alt="Daily practice" width={64} height={64} /></span>
            <div>
              <h3>Daily Practice, Better Results</h3>
              <p>Practice a little every day and see a big improvement in your speaking score.</p>
            </div>
          </div>
          <Link href="/practice" className="practice-button">
            Start Daily Practice →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}