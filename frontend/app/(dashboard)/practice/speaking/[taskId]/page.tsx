"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ══════════════════════════════════════════════
// Icons
// ══════════════════════════════════════════════
function WaveformIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 9v6M8 6v12M12 3v18M16 7v10M20 10v4" /></svg>;
}
function RepeatIcon() {
  return <svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function ImageTypeIcon() {
  return <Image src="/images/gallery.png" alt="" width={14} height={14} style={{ objectFit: "contain" }} />;
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
function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
function ChevronLeftIcon() {
  return <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>;
}
function InfoIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></svg>;
}
function BulletDotIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></svg>;
}
function MicIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
      <path d="M19 11a7 7 0 0 1-14 0M12 18v4" />
    </svg>
  );
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24"><polygon points="6,3 20,12 6,21" /></svg>;
}
function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ══════════════════════════════════════════════
// Shared task metadata (drives top tab bar + sidebar list)
// ══════════════════════════════════════════════
const speakingTasks = [
  { id: "read-aloud", label: "Read Aloud", Icon: WaveformIcon },
  { id: "repeat-sentence", label: "Repeat Sentence", Icon: RepeatIcon },
  { id: "describe-image", label: "Describe Image", Icon: ImageTypeIcon },
  { id: "retell-lecture", label: "Retell Lecture", Icon: LectureIcon },
  { id: "answer-short-question", label: "Answer Short Question", Icon: ChatIcon },
] as const;

// ══════════════════════════════════════════════
// Shared UI pieces
// ══════════════════════════════════════════════
function TaskTopBar({ activeTaskId }: { activeTaskId: string }) {
  const activeTask = speakingTasks.find((t) => t.id === activeTaskId);
  return (
    <div className="task-topbar">
      <div className="task-topbar-left">
        <Link href="/practice" className="task-tab">Practice</Link>
        <span className="task-tab-sep">›</span>
        <Link href="/practice/speaking" className="task-tab">Speaking</Link>
        <span className="task-tab-sep">›</span>
        <span className="task-tab active">{activeTask?.label ?? activeTaskId}</span>
      </div>
      <Link href="/practice/speaking" className="task-exit-btn">
        <XIcon /> Exit Practice
      </Link>
    </div>
  );
}

function TaskSidebar({
  activeTaskId,
  questionCount,
  progress,
}: {
  activeTaskId: string;
  questionCount: number;
  progress: { current: number; total: number };
}) {
  const percent = Math.round((progress.current / progress.total) * 100);
  return (
    <aside className="task-sidebar">
      <h2 className="task-sidebar-title">Question Type</h2>
      <ul className="task-type-list">
        {speakingTasks.map((task) => {
          const isActive = task.id === activeTaskId;
          return (
            <li key={task.id}>
              <Link
                href={`/practice/speaking/${task.id}`}
                className={`task-type-item${isActive ? " active" : ""}`}
              >
                <span className="task-type-icon"><task.Icon /></span>
                <span className="task-type-label">
                  {task.id === "answer-short-question" ? "Answer Short Question" : task.label}
                </span>
                <span className="task-type-count">
                  {isActive ? `${questionCount}/${progress.total}` : `0/${progress.total}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="task-progress-card">
        <h3>Your Progress</h3>
        <div className="task-progress-track">
          <div className="task-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="task-progress-label">{percent}% Completed</span>
      </div>
    </aside>
  );
}

function TaskInfoPanels({
  instructions,
  tips,
  currentIndex,
  totalQuestions,
  recordedSet,
  onNavigate,
}: {
  instructions: string[];
  tips: string[];
  currentIndex: number;
  totalQuestions: number;
  recordedSet: Set<number>;
  onNavigate: (index: number) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  return (
    <aside className="task-side-right">
      <div className="task-info-card">
        <h3 className="task-info-title"><InfoIcon /> Instructions</h3>
        <ul className="task-bullet-list">
          {instructions.map((line) => (
            <li key={line}>
              <span className="task-bullet-icon"><BulletDotIcon /></span>
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="task-info-card">
        <h3 className="task-info-title"><InfoIcon /> Tips</h3>
        <ul className="task-bullet-list">
          {tips.map((line) => (
            <li key={line}>
              <span className="task-bullet-icon"><BulletDotIcon /></span>
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="task-info-card">
        <h3 className="task-info-title"><InfoIcon /> Question Progress</h3>
        <div className="task-progress-grid">
          {(showAll ? Array.from({ length: totalQuestions }, (_, i) => i) : Array.from({ length: Math.min(10, totalQuestions) }, (_, i) => i)).map((i) => (
            <button
              key={i}
              type="button"
              className={`task-progress-box${i === currentIndex ? " active" : ""}${recordedSet.has(i) ? " recorded" : ""}`}
              onClick={() => onNavigate(i)}
              aria-label={`Go to question ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button type="button" className="task-progress-view-all" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show Less" : `View All ${totalQuestions} Questions`}
        </button>
      </div>
    </aside>
  );
}

function TaskFooterNav({
  current,
  total,
  onPrevious,
  onNext,
}: {
  current: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="task-footer-nav">
      <button type="button" className="task-nav-btn" onClick={onPrevious} disabled={current === 1}>
        <ChevronLeftIcon /> Previous
      </button>
      <span className="task-question-count">Question {current} of {total}</span>
      <button type="button" className="practice-button task-nav-btn-next" onClick={onNext}>
        Next <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════
// Read Aloud task (fully implemented)
// ══════════════════════════════════════════════
const READ_ALOUD_TEXTS = [
  "The rapid advancement of technology has transformed the way we live, work and communicate. Artificial intelligence and automation are becoming increasingly integrated in our daily routines, offering both opportunities and challenges. As we embrace these changes, it is essential to adapt and acquire new skills to remain relevant in this ever-evolving world.",
  "Climate change remains one of the most pressing issues of our time, affecting ecosystems, economies, and communities worldwide. Governments and organizations are increasingly investing in renewable energy and sustainable practices to reduce carbon emissions and mitigate long-term environmental damage.",
  "Effective communication is a cornerstone of successful teamwork in any organization. Clear, concise, and respectful dialogue helps prevent misunderstandings and builds trust among colleagues, ultimately leading to higher productivity and a more positive work environment.",
  "The rise of remote work has reshaped traditional office culture, giving employees greater flexibility while also introducing new challenges around collaboration and work-life balance. Companies are experimenting with hybrid models to find an approach that suits both business needs and employee wellbeing.",
  "Reading regularly has been shown to improve vocabulary, critical thinking, and empathy. By exposing readers to diverse perspectives and unfamiliar situations, books encourage a deeper understanding of the world and the people who inhabit it.",
  "Urban planning plays a crucial role in shaping how cities function and how residents experience daily life. Thoughtful design of public spaces, transportation networks, and housing can significantly improve quality of life while reducing environmental impact.",
  "The global shift toward e-commerce has changed consumer behavior dramatically over the past decade. Businesses must now prioritize digital experience, fast delivery, and personalized service to remain competitive in an increasingly crowded marketplace.",
  "Scientific research relies heavily on collaboration across disciplines to solve complex problems. By combining expertise from fields such as biology, computer science, and engineering, researchers can develop innovative solutions to challenges that no single discipline could address alone.",
  "Financial literacy is an essential life skill that is often overlooked in traditional education systems. Understanding concepts such as budgeting, saving, and investing empowers individuals to make informed decisions and build long-term financial security.",
  "Travel broadens perspective by exposing individuals to different cultures, languages, and ways of life. Even short trips to unfamiliar places can challenge assumptions and foster a greater appreciation for the diversity of human experience.",
];
const TOTAL_QUESTIONS = READ_ALOUD_TEXTS.length;
const RECORD_LIMIT_SECONDS = 60;

const readAloudInstructions = [
  "Read the text aloud clearly and naturally.",
  "You will have up to 60 seconds to record.",
  "You can't re-record once you submit.",
  "Make sure to speak in a quiet environment.",
];
const readAloudTips = [
  "Speak clearly and at a moderate pace.",
  "Pronounce every word accurately.",
  "Maintain good fluency and intonation.",
];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ReadAloudTask() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedSet, setRecordedSet] = useState<Set<number>>(new Set());
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set(new Set([0])));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= RECORD_LIMIT_SECONDS) {
            setIsRecording(false);
            setHasRecorded(true);
            setRecordedSet((p) => new Set(p).add(currentIndex));
            return RECORD_LIMIT_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  function handleMicClick() {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      setRecordedSet((prev) => new Set(prev).add(currentIndex));
    } else {
      setElapsedSeconds(0);
      setHasRecorded(false);
      setIsRecording(true);
    }
  }

  function resetForQuestion() {
    setIsRecording(false);
    setElapsedSeconds(0);
    setHasRecorded(false);
  }

  function goToPrevious() {
    const next = Math.max(0, currentIndex - 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToNext() {
    const next = Math.min(TOTAL_QUESTIONS - 1, currentIndex + 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToQuestion(index: number) {
    setVisitedSet((prev) => new Set(prev).add(index));
    setCurrentIndex(index);
    resetForQuestion();
  }

  return (
    <div className="task-page">
      <TaskTopBar activeTaskId="read-aloud" />

      <div className="task-layout">
        <TaskSidebar
          activeTaskId="read-aloud"
          questionCount={currentIndex + 1}
          progress={{ current: recordedSet.size, total: TOTAL_QUESTIONS }}
        />

        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon"><WaveformIcon /></span>
            <h1>Read Aloud</h1>
          </div>
          <p className="task-main-sub">
            Read the following text aloud as clearly and naturally as possible.
          </p>

          <h3 className="task-block-label">Text to Read</h3>
          <div className="task-text-box">{READ_ALOUD_TEXTS[currentIndex]}</div>

          <div className="task-recording-row">
            <h3 className="task-block-label">Your Recording</h3>
            <span className={`task-status-pill${hasRecorded ? " recorded" : ""}`}>
              {hasRecorded ? "Recorded" : "Not Recorded"}
            </span>
          </div>

          <div className="task-recording-box">
            <button
              type="button"
              className={`task-mic-button${isRecording ? " recording" : ""}`}
              onClick={handleMicClick}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <MicIcon />
            </button>
            <p className="task-recording-title">
              {isRecording
                ? "Recording… click the microphone to stop"
                : hasRecorded
                ? "Recording complete"
                : "Click the microphone to start recording"}
            </p>
            <p className="task-recording-sub">You will have up to {RECORD_LIMIT_SECONDS} seconds to read aloud.</p>
            <div className="task-timer">
              <ClockIcon /> {formatTime(elapsedSeconds)} / {formatTime(RECORD_LIMIT_SECONDS)}
            </div>
          </div>

          <TaskFooterNav
            current={currentIndex + 1}
            total={TOTAL_QUESTIONS}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        </section>

        <TaskInfoPanels
          instructions={readAloudInstructions}
          tips={readAloudTips}
          currentIndex={currentIndex}
          totalQuestions={TOTAL_QUESTIONS}
          recordedSet={recordedSet}
          onNavigate={goToQuestion}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Repeat Sentence task
// ══════════════════════════════════════════════
const REPEAT_SENTENCES = [
  "The professor explained that the experiment yielded unexpected results.",
  "Students are required to submit their assignments before the deadline.",
  "The new policy will take effect starting next month.",
  "Climate change is one of the most significant challenges facing humanity today.",
  "The company decided to expand its operations into international markets.",
  "Regular exercise and a balanced diet are essential for maintaining good health.",
  "The museum houses an impressive collection of modern art from around the world.",
  "Advances in technology have revolutionized the way we communicate with each other.",
  "The government announced new measures to reduce carbon emissions by thirty percent.",
  "Research shows that reading for pleasure improves both vocabulary and comprehension.",
];
const REPEAT_TOTAL = REPEAT_SENTENCES.length;
const REPEAT_TIME_LIMIT = 15;

const repeatSentenceInstructions = [
  "Listen to the sentence carefully when you click play.",
  "After listening, click the microphone to repeat the sentence.",
  "You will have up to 15 seconds to record your response.",
  "Try to repeat the sentence exactly as you heard it.",
];
const repeatSentenceTips = [
  "Focus on key words and sentence structure.",
  "Don't panic if you miss a word — keep going.",
  "Practice note-taking for longer sentences.",
];

function RepeatSentenceTask() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedSet, setRecordedSet] = useState<Set<number>>(new Set());
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set(new Set([0])));
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= REPEAT_TIME_LIMIT) {
            setIsRecording(false);
            setHasRecorded(true);
            setRecordedSet((p) => new Set(p).add(currentIndex));
            return REPEAT_TIME_LIMIT;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  function handleMicClick() {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      setRecordedSet((prev) => new Set(prev).add(currentIndex));
    } else {
      setElapsedSeconds(0);
      setHasRecorded(false);
      setIsRecording(true);
    }
  }

  function handlePlayClick() {
    if (isPlaying) return;
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  }

  function resetForQuestion() {
    setIsRecording(false);
    setElapsedSeconds(0);
    setHasRecorded(false);
    setIsPlaying(false);
  }

  function goToPrevious() {
    const next = Math.max(0, currentIndex - 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToNext() {
    const next = Math.min(REPEAT_TOTAL - 1, currentIndex + 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToQuestion(index: number) {
    setVisitedSet((prev) => new Set(prev).add(index));
    setCurrentIndex(index);
    resetForQuestion();
  }

  return (
    <div className="task-page">
      <TaskTopBar activeTaskId="repeat-sentence" />
      <div className="task-layout">
        <TaskSidebar
          activeTaskId="repeat-sentence"
          questionCount={currentIndex + 1}
          progress={{ current: recordedSet.size, total: REPEAT_TOTAL }}
        />
        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon"><RepeatIcon /></span>
            <h1>Repeat Sentence</h1>
          </div>
          <p className="task-main-sub">
            Listen to the sentence and repeat it exactly as you hear it.
          </p>

          <h3 className="task-block-label">Audio Playback</h3>
          <div className="task-text-box" style={{ display: "flex", alignItems: "center", gap: "1rem", minHeight: "12vh" }}>
            <button
              type="button"
              className={`task-mic-button${isPlaying ? " recording" : ""}`}
              onClick={handlePlayClick}
              disabled={isPlaying}
              style={{ width: "48px", height: "48px", flexShrink: 0 }}
              aria-label="Play audio"
            >
              <PlayIcon />
            </button>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>
                {isPlaying ? "Playing audio…" : "Click play to listen to the sentence"}
              </p>
              <p style={{ margin: "0.25rem 0 0", color: "#55556b", fontSize: "0.9rem" }}>
                Sentence {currentIndex + 1} of {REPEAT_TOTAL}
              </p>
            </div>
          </div>

          <div className="task-recording-row">
            <h3 className="task-block-label">Your Recording</h3>
            <span className={`task-status-pill${hasRecorded ? " recorded" : ""}`}>
              {hasRecorded ? "Recorded" : "Not Recorded"}
            </span>
          </div>
          <div className="task-recording-box">
            <button
              type="button"
              className={`task-mic-button${isRecording ? " recording" : ""}`}
              onClick={handleMicClick}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <MicIcon />
            </button>
            <p className="task-recording-title">
              {isRecording ? "Recording… click to stop" : hasRecorded ? "Recording complete" : "Click the microphone to start recording"}
            </p>
            <p className="task-recording-sub">You will have up to {REPEAT_TIME_LIMIT} seconds to repeat the sentence.</p>
            <div className="task-timer">
              <ClockIcon /> {formatTime(elapsedSeconds)} / {formatTime(REPEAT_TIME_LIMIT)}
            </div>
          </div>
          <TaskFooterNav current={currentIndex + 1} total={REPEAT_TOTAL} onPrevious={goToPrevious} onNext={goToNext} />
        </section>
        <TaskInfoPanels
          instructions={repeatSentenceInstructions}
          tips={repeatSentenceTips}
          currentIndex={currentIndex}
          totalQuestions={REPEAT_TOTAL}
          recordedSet={recordedSet}
          onNavigate={goToQuestion}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Describe Image task
// ══════════════════════════════════════════════
const DESCRIBE_IMAGES = [
  { image: "/images/describeimage1.png" },
  { image: "/images/describeimage2.png" },
  { image: "/images/describeimage3.png" },
  { image: "/images/describeimage4.png" },
  { image: "/images/describeimage5.png" },
  { image: "/images/describeimage6.png" },
  { image: "/images/describeimage7.png" },
  { image: "/images/describeimage8.png" },
  { image: "/images/describeimage9.png" },
  { image: "/images/describeimage10.png" },
];
const DESCRIBE_TOTAL = DESCRIBE_IMAGES.length;
const DESCRIBE_TIME_LIMIT = 60;

const describeImageInstructions = [
  "Look at the image description carefully before recording.",
  "Describe the image in detail within the time limit.",
  "Cover the main features, objects, and any activity shown.",
  "Speak clearly and organize your response logically.",
];
const describeImageTips = [
  "Start with an overview, then describe specific details.",
  "Use descriptive language and spatial references.",
  "Practice structuring your response in 60 seconds.",
];

function DescribeImageTask() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedSet, setRecordedSet] = useState<Set<number>>(new Set());
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set(new Set([0])));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startObjectPosition = useRef(0);
  const [objectPositionX, setObjectPositionX] = useState(0);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= DESCRIBE_TIME_LIMIT) {
            setIsRecording(false);
            setHasRecorded(true);
            setRecordedSet((p) => new Set(p).add(currentIndex));
            return DESCRIBE_TIME_LIMIT;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  function handleMicClick() {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      setRecordedSet((prev) => new Set(prev).add(currentIndex));
    } else {
      setElapsedSeconds(0);
      setHasRecorded(false);
      setIsRecording(true);
    }
  }

  function resetForQuestion() {
    setIsRecording(false);
    setElapsedSeconds(0);
    setHasRecorded(false);
    setObjectPositionX(0);
  }

  function goToPrevious() {
    const next = Math.max(0, currentIndex - 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToNext() {
    const next = Math.min(DESCRIBE_TOTAL - 1, currentIndex + 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToQuestion(index: number) {
    setVisitedSet((prev) => new Set(prev).add(index));
    setCurrentIndex(index);
    resetForQuestion();
  }

  function handleDragStart(e: React.MouseEvent | React.TouchEvent) {
    const container = dragContainerRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].pageX : e.pageX;
    startObjectPosition.current = objectPositionX;

    function onMove(ev: MouseEvent | TouchEvent) {
      if (!isDragging.current) return;
      const x = "touches" in ev ? ev.touches[0].pageX : ev.pageX;
      const walk = x - startX.current;
      const containerWidth = container.offsetWidth;
      const percentPerPx = 100 / (containerWidth * 1.8);
      const delta = walk * percentPerPx * -1;
      const clamped = Math.max(0, Math.min(100, startObjectPosition.current + delta));
      setObjectPositionX(clamped);
    }

    function onEnd() {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
  }

  const currentImage = DESCRIBE_IMAGES[currentIndex];

  return (
    <div className="task-page">
      <TaskTopBar activeTaskId="describe-image" />
      <div className="task-layout">
        <TaskSidebar
          activeTaskId="describe-image"
          questionCount={currentIndex + 1}
          progress={{ current: recordedSet.size, total: DESCRIBE_TOTAL }}
        />
        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon"><ImageTypeIcon /></span>
            <h1>Describe Image</h1>
          </div>
          <p className="task-main-sub">
            Study the image below and describe it in detail.
          </p>

          <h3 className="task-block-label">Image to Describe</h3>
          <div className="task-text-box">
            {currentImage.image ? (
              currentIndex === 5 ? (
                <div
                  ref={dragContainerRef}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                  style={{
                    overflow: "hidden",
                    borderRadius: 8,
                    cursor: "grab",
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={currentImage.image}
                    alt="Image to describe"
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "cover",
                      objectPosition: `${objectPositionX}% 50%`,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              ) : currentIndex === 4 ? (
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: 8,
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={currentImage.image}
                    alt="Image to describe"
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : currentIndex === 8 || currentIndex === 9 ? (
                <div
                  style={{
                    borderRadius: 8,
                    height: 350,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1.7rem", margin: "12px 0 4px", textAlign: "center" }}>
                    {currentIndex === 8 ? "The Process of Starting Business" : "The Food Delivery Process"}
                  </div>
                  <div
                    ref={dragContainerRef}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    style={{
                      flex: 1,
                      width: "100%",
                      minHeight: 0,
                      overflow: "hidden",
                      borderRadius: 8,
                      cursor: "grab",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      userSelect: "none",
                    }}
                  >
                    <img
                      src={currentImage.image}
                      alt="Image to describe"
                      style={{
                        width: "85%",
                        height: "85%",
                        objectFit: "cover",
                        objectPosition: `${objectPositionX}% 50%`,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: 8,
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={currentImage.image}
                    alt="Image to describe"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )
            ) : null}
          </div>

          <div className="task-recording-row">
            <h3 className="task-block-label">Your Recording</h3>
            <span className={`task-status-pill${hasRecorded ? " recorded" : ""}`}>
              {hasRecorded ? "Recorded" : "Not Recorded"}
            </span>
          </div>
          <div className="task-recording-box">
            <button
              type="button"
              className={`task-mic-button${isRecording ? " recording" : ""}`}
              onClick={handleMicClick}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <MicIcon />
            </button>
            <p className="task-recording-title">
              {isRecording ? "Recording… click to stop" : hasRecorded ? "Recording complete" : "Click the microphone to start recording"}
            </p>
            <p className="task-recording-sub">You will have up to {DESCRIBE_TIME_LIMIT} seconds to describe the image.</p>
            <div className="task-timer">
              <ClockIcon /> {formatTime(elapsedSeconds)} / {formatTime(DESCRIBE_TIME_LIMIT)}
            </div>
          </div>
          <TaskFooterNav current={currentIndex + 1} total={DESCRIBE_TOTAL} onPrevious={goToPrevious} onNext={goToNext} />
        </section>
        <TaskInfoPanels
          instructions={describeImageInstructions}
          tips={describeImageTips}
          currentIndex={currentIndex}
          totalQuestions={DESCRIBE_TOTAL}
          recordedSet={recordedSet}
          onNavigate={goToQuestion}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Retell Lecture task
// ══════════════════════════════════════════════
const RETELL_LECTURES = [
  { title: "The Water Cycle", notes: "The water cycle describes how water moves through the environment. Evaporation turns water into vapor, which rises and forms clouds. When clouds cool, condensation occurs and precipitation falls back to Earth, replenishing rivers, lakes, and groundwater." },
  { title: "Photosynthesis", notes: "Plants convert sunlight, carbon dioxide, and water into glucose and oxygen through photosynthesis. This process occurs mainly in leaves using chlorophyll. Photosynthesis is essential for life on Earth as it produces oxygen and forms the base of food chains." },
  { title: "The Industrial Revolution", notes: "The Industrial Revolution began in Britain in the late 18th century. It marked a shift from manual production to machine manufacturing. New inventions like the steam engine and power loom transformed textiles, transportation, and communication, reshaping society." },
  { title: "Plate Tectonics", notes: "The Earth's outer shell is divided into several plates that float on the semi-fluid mantle beneath. These plates move very slowly, driven by convection currents. Where plates collide, mountains form; where they pull apart, new crust is created at mid-ocean ridges." },
  { title: "Supply and Demand", notes: "In economics, supply and demand determine market prices. When demand exceeds supply, prices rise. When supply exceeds demand, prices fall. Producers and consumers interact in markets to reach equilibrium, where the quantity demanded equals the quantity supplied." },
  { title: "The Human Brain", notes: "The human brain contains approximately 86 billion neurons connected by trillions of synapses. The cerebrum handles thinking and memory, the cerebellum controls movement, and the brainstem regulates basic functions like breathing and heart rate." },
  { title: "Globalization", notes: "Globalization refers to the increasing interconnectedness of economies, cultures, and populations worldwide. Driven by trade, technology, and migration, it has created economic growth but also raised concerns about inequality, cultural homogenization, and environmental impact." },
  { title: "Artificial Intelligence", notes: "Artificial intelligence aims to create machines that can perform tasks requiring human intelligence. Machine learning, a subset of AI, allows systems to learn from data. Applications include speech recognition, medical diagnosis, and autonomous vehicles." },
  { title: "Ocean Currents", notes: "Ocean currents are continuous movements of seawater driven by wind, temperature, and salinity differences. They distribute heat around the globe, affecting weather patterns and marine ecosystems. The Gulf Stream, for example, keeps Western Europe warmer than it would otherwise be." },
  { title: "Renewable Energy", notes: "Renewable energy comes from naturally replenishing sources like sunlight, wind, and water. Solar panels convert sunlight to electricity, wind turbines harness wind energy, and hydroelectric dams generate power from flowing water. These sources reduce reliance on fossil fuels." },
];
const RETELL_TOTAL = RETELL_LECTURES.length;
const RETELL_TIME_LIMIT = 60;

const retellLectureInstructions = [
  "You will hear the lecture once.",
  "You will have 10 seconds to prepare.",
  "You will have up to 60 seconds to retell the lecture.",
  "Retell the lecture in as much detail as you can.",
];
const retellLectureTips = [
  "Identify 2-3 main points before you start speaking.",
  "Use connecting words like 'firstly', 'additionally', 'in conclusion'.",
  "Keep your response organized and concise.",
];

function RetellLectureTask() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedSet, setRecordedSet] = useState<Set<number>>(new Set());
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set(new Set([0])));
  const [showQuestion, setShowQuestion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= RETELL_TIME_LIMIT) {
            setIsRecording(false);
            setHasRecorded(true);
            setRecordedSet((p) => new Set(p).add(currentIndex));
            return RETELL_TIME_LIMIT;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  function handleMicClick() {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      setRecordedSet((prev) => new Set(prev).add(currentIndex));
    } else {
      setElapsedSeconds(0);
      setHasRecorded(false);
      setIsRecording(true);
    }
  }

  function handlePlayClick() {
    if (isPlaying) return;
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  }

  function resetForQuestion() {
    setIsRecording(false);
    setElapsedSeconds(0);
    setHasRecorded(false);
    setShowQuestion(false);
    setIsPlaying(false);
  }

  function goToPrevious() {
    const next = Math.max(0, currentIndex - 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToNext() {
    const next = Math.min(RETELL_TOTAL - 1, currentIndex + 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToQuestion(index: number) {
    setVisitedSet((prev) => new Set(prev).add(index));
    setCurrentIndex(index);
    resetForQuestion();
  }

  const currentLecture = RETELL_LECTURES[currentIndex];

  return (
    <div className="task-page">
      <TaskTopBar activeTaskId="retell-lecture" />
      <div className="task-layout">
        <TaskSidebar
          activeTaskId="retell-lecture"
          questionCount={currentIndex + 1}
          progress={{ current: recordedSet.size, total: RETELL_TOTAL }}
        />
        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon"><LectureIcon /></span>
            <h1>Retell Lecture</h1>
          </div>
          <p className="task-main-sub">
            You will hear a lecture. Listen carefully and then, in your own words, retell the lecture in as much detail as you can.
          </p>

          <h3 className="task-block-label">Steps</h3>
          <div className="task-steps-box">
            <ul className="task-steps">
              <li><span className="task-step-number">1</span> You will hear the lecture once.</li>
              <li><span className="task-step-number">2</span> You will have 10 seconds to prepare.</li>
              <li><span className="task-step-number">3</span> You will have up to {RETELL_TIME_LIMIT} seconds to retell the lecture.</li>
            </ul>
          </div>

          <div className="task-audio-header">
            <h3 className="task-block-label">Lecture Audio</h3>
            <button
              type="button"
              className="task-show-hide-btn"
              onClick={() => setShowQuestion((v) => !v)}
              aria-label={showQuestion ? "Hide Question" : "Show Question"}
            >
              <EyeIcon />
              {showQuestion ? "Hide Question" : "Show Question"}
            </button>
          </div>
          <div className="task-audio-box">
            <button
              type="button"
              className={`task-mic-button${isPlaying ? " recording" : ""}`}
              onClick={handlePlayClick}
              disabled={isPlaying}
              aria-label="Play lecture audio"
            >
              <SpeakerIcon />
            </button>
            <p className="task-recording-title">
              {isPlaying ? "Playing lecture…" : "Click play to listen to the lecture."}
            </p>
          </div>
          {showQuestion && (
            <div className="task-question-box">
              <p style={{ margin: "0 0 0.75rem", fontWeight: 800, fontSize: "1.05rem" }}>{currentLecture.title}</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{currentLecture.notes}</p>
            </div>
          )}

          <div className="task-recording-row">
            <h3 className="task-block-label">Your Recording</h3>
            <span className={`task-status-pill${hasRecorded ? " recorded" : ""}`}>
              {hasRecorded ? "Recorded" : "Not Recorded"}
            </span>
          </div>
          <div className="task-recording-box">
            <button
              type="button"
              className={`task-mic-button${isRecording ? " recording" : ""}`}
              onClick={handleMicClick}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <MicIcon />
            </button>
            <p className="task-recording-title">
              {isRecording ? "Recording… click to stop" : hasRecorded ? "Recording complete" : "Click the microphone to start recording"}
            </p>
            <p className="task-recording-sub">You will have up to {RETELL_TIME_LIMIT} seconds to retell the lecture.</p>
            <div className="task-timer">
              <ClockIcon /> {formatTime(elapsedSeconds)} / {formatTime(RETELL_TIME_LIMIT)}
            </div>
          </div>
          <TaskFooterNav current={currentIndex + 1} total={RETELL_TOTAL} onPrevious={goToPrevious} onNext={goToNext} />
        </section>
        <TaskInfoPanels
          instructions={retellLectureInstructions}
          tips={retellLectureTips}
          currentIndex={currentIndex}
          totalQuestions={RETELL_TOTAL}
          recordedSet={recordedSet}
          onNavigate={goToQuestion}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Answer Short Question task
// ══════════════════════════════════════════════
const SHORT_QUESTIONS = [
  { question: "What is the largest ocean on Earth?", answer: "The Pacific Ocean" },
  { question: "What gas do plants absorb from the atmosphere?", answer: "Carbon dioxide" },
  { question: "How many continents are there on Earth?", answer: "Seven" },
  { question: "What is the chemical symbol for water?", answer: "H2O" },
  { question: "Which planet is known as the Red Planet?", answer: "Mars" },
  { question: "What is the main language spoken in Brazil?", answer: "Portuguese" },
  { question: "What device measures temperature?", answer: "A thermometer" },
  { question: "What is the boiling point of water in Celsius?", answer: "100 degrees" },
  { question: "Which organ pumps blood throughout the body?", answer: "The heart" },
  { question: "What is the capital of Japan?", answer: "Tokyo" },
];
const SHORT_TOTAL = SHORT_QUESTIONS.length;
const SHORT_TIME_LIMIT = 10;

const shortQuestionInstructions = [
  "Read the question displayed on screen.",
  "Provide a brief and accurate answer.",
  "You will have up to 10 seconds to respond.",
  "Speak clearly and directly.",
];
const shortQuestionTips = [
  "Keep your answer short — one or two words is fine.",
  "Don't overthink — answer with your first instinct.",
  "If unsure, give the most reasonable answer.",
];

function AnswerShortQuestionTask() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedSet, setRecordedSet] = useState<Set<number>>(new Set());
  const [visitedSet, setVisitedSet] = useState<Set<number>>(new Set(new Set([0])));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= SHORT_TIME_LIMIT) {
            setIsRecording(false);
            setHasRecorded(true);
            setRecordedSet((p) => new Set(p).add(currentIndex));
            return SHORT_TIME_LIMIT;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  function handleMicClick() {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      setRecordedSet((prev) => new Set(prev).add(currentIndex));
    } else {
      setElapsedSeconds(0);
      setHasRecorded(false);
      setIsRecording(true);
    }
  }

  function resetForQuestion() {
    setIsRecording(false);
    setElapsedSeconds(0);
    setHasRecorded(false);
  }

  function goToPrevious() {
    const next = Math.max(0, currentIndex - 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToNext() {
    const next = Math.min(SHORT_TOTAL - 1, currentIndex + 1);
    setCurrentIndex(next);
    setVisitedSet((prev) => new Set(prev).add(next));
    resetForQuestion();
  }

  function goToQuestion(index: number) {
    setVisitedSet((prev) => new Set(prev).add(index));
    setCurrentIndex(index);
    resetForQuestion();
  }

  const currentQ = SHORT_QUESTIONS[currentIndex];

  return (
    <div className="task-page">
      <TaskTopBar activeTaskId="answer-short-question" />
      <div className="task-layout">
        <TaskSidebar
          activeTaskId="answer-short-question"
          questionCount={currentIndex + 1}
          progress={{ current: recordedSet.size, total: SHORT_TOTAL }}
        />
        <section className="task-main">
          <div className="task-main-header">
            <span className="task-main-header-icon"><ChatIcon /></span>
            <h1>Answer Short Question</h1>
          </div>
          <p className="task-main-sub">
            Read the question and provide a short, accurate answer.
          </p>

          <h3 className="task-block-label">Question</h3>
          <div className="task-text-box" style={{ display: "flex", alignItems: "center", minHeight: "12vh" }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.6 }}>{currentQ.question}</p>
          </div>

          <div className="task-recording-row">
            <h3 className="task-block-label">Your Recording</h3>
            <span className={`task-status-pill${hasRecorded ? " recorded" : ""}`}>
              {hasRecorded ? "Recorded" : "Not Recorded"}
            </span>
          </div>
          <div className="task-recording-box">
            <button
              type="button"
              className={`task-mic-button${isRecording ? " recording" : ""}`}
              onClick={handleMicClick}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <MicIcon />
            </button>
            <p className="task-recording-title">
              {isRecording ? "Recording… click to stop" : hasRecorded ? "Recording complete" : "Click the microphone to start recording"}
            </p>
            <p className="task-recording-sub">You will have up to {SHORT_TIME_LIMIT} seconds to answer.</p>
            <div className="task-timer">
              <ClockIcon /> {formatTime(elapsedSeconds)} / {formatTime(SHORT_TIME_LIMIT)}
            </div>
          </div>
          <TaskFooterNav current={currentIndex + 1} total={SHORT_TOTAL} onPrevious={goToPrevious} onNext={goToNext} />
        </section>
        <TaskInfoPanels
          instructions={shortQuestionInstructions}
          tips={shortQuestionTips}
          currentIndex={currentIndex}
          totalQuestions={SHORT_TOTAL}
          recordedSet={recordedSet}
          onNavigate={goToQuestion}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Fallback for unknown task types
// ══════════════════════════════════════════════
function ComingSoonTask({ taskId }: { taskId: string }) {
  const task = speakingTasks.find((t) => t.id === taskId);
  return (
    <div className="task-page">
      <TaskTopBar activeTaskId={taskId} />
      <div className="task-coming-soon">
        <h1>{task ? task.label : "Task"}</h1>
        <p>This task type is coming soon.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Dynamic dispatcher — params.taskId decides which task renders
// ══════════════════════════════════════════════
export default function TaskPage({ params }: { params: { taskId: string } }) {
  const { taskId } = params;

  if (taskId === "read-aloud") return <ReadAloudTask />;
  if (taskId === "repeat-sentence") return <RepeatSentenceTask />;
  if (taskId === "describe-image") return <DescribeImageTask />;
  if (taskId === "retell-lecture") return <RetellLectureTask />;
  if (taskId === "answer-short-question") return <AnswerShortQuestionTask />;

  return <ComingSoonTask taskId={taskId} />;
}