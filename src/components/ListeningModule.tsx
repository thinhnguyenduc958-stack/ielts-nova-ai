import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sampleListeningTests } from '../data/mockIELTSData';
import { apiService } from '../services/apiService';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  FileAudio,
} from 'lucide-react';

const SECTIONS = [
  { num: 1, title: 'Section 1', desc: 'Social / Transactional Dialogue', badge: 'Everyday' },
  { num: 2, title: 'Section 2', desc: 'Monologue on Local Facility', badge: 'General' },
  { num: 3, title: 'Section 3', desc: 'Academic Project Discussion', badge: 'Education' },
  { num: 4, title: 'Section 4', desc: 'University Lecture', badge: 'Academic' },
];

export const ListeningModule: React.FC = () => {
  const { recordActivity, showToast } = useApp();
  const test = sampleListeningTests[0];

  const [activeSection, setActiveSection] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [accent, setAccent] = useState<'UK' | 'US' | 'AU'>('UK');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = test.durationSeconds;

  // Audio timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, duration]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis.pause();
    } else {
      setIsPlaying(true);
      if (currentTime === 0) {
        apiService.speakText(test.audioSimulatedText, accent === 'AU' ? 'UK' : accent);
      } else {
        window.speechSynthesis.resume();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    window.speechSynthesis.cancel();
  };

  const handleAnswerChange = (qId: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowTranscript(true);

    let correctCount = 0;
    test.questions.forEach((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const cAns = q.correctAnswer.trim().toLowerCase();
      if (uAns === cAns || (q.type === 'multiple-choice' && uAns.startsWith(cAns))) {
        correctCount++;
      }
    });

    const bandEstimated = correctCount === test.questions.length ? '8.0' : correctCount > 0 ? '6.5' : '5.0';
    recordActivity(
      `${test.title} (Listening Sec ${test.sectionNumber})`,
      'Listening',
      `${correctCount}/${test.questions.length} (Band ${bandEstimated})`
    );
    showToast(`Test Submitted! Band score estimated: ${bandEstimated}`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const transcriptParagraphs = [
    {
      time: 5,
      text: 'Good morning everyone, and welcome to this orientation tour of our international university sports complex.',
    },
    {
      time: 25,
      text: 'As you can see, the main Olympic-sized swimming pool is on your left, which is open daily from 6:00 AM until 10:00 PM for registered students.',
    },
    {
      time: 50,
      text: 'Regarding locker access and equipment checkout, please remember that valid student identification cards must be swiped at the front turnstile.',
    },
    {
      time: 90,
      text: 'For personal coaching or specialized fitness assessments, advance reservations can be made via the university online portal or directly at the concierge desk.',
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Headphones className="h-3.5 w-3.5" />
              <span>Audio Studio • Multi-Accent Simulation</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              {test.title}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {test.scenario}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {test.questions.length} Questions
            </span>
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Section Indicator Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SECTIONS.map((sec) => {
          const isCurrent = activeSection === sec.num;
          return (
            <button
              key={sec.num}
              onClick={() => setActiveSection(sec.num)}
              className={`rounded-2xl border p-3.5 text-left transition-all ${
                isCurrent
                  ? 'border-stone-900 bg-white shadow-2xs dark:border-stone-100 dark:bg-stone-850'
                  : 'border-stone-200/70 bg-white/60 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-stone-950 dark:text-white' : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {sec.title}
                </span>
                <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                  {sec.badge}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500 line-clamp-1">
                {sec.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Modern Audio Player */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition-transform hover:scale-105 active:scale-95 dark:bg-stone-100 dark:text-stone-900"
              aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              title="Reset Audio"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-stone-900 dark:text-white">
                  Cambridge Audio • Section {test.sectionNumber}
                </p>
                {isPlaying && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">
                Natural pace with authentic room acoustics
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Accent Selector */}
            <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800">
              {(['UK', 'US', 'AU'] as ('UK' | 'US' | 'AU')[]).map((ac) => (
                <button
                  key={ac}
                  onClick={() => setAccent(ac)}
                  className={`rounded-full px-2.5 py-1 transition-all ${
                    accent === ac
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold dark:bg-stone-700 dark:text-white'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {ac}
                </button>
              ))}
            </div>

            {/* Playback Speed */}
            <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800">
              {[0.75, 1, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`rounded-full px-2.5 py-1 transition-all ${
                    playbackSpeed === spd
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold dark:bg-stone-700 dark:text-white'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-mono text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Tactile Waveform Bars */}
        <div className="mt-6 flex items-center justify-between gap-1 h-8 px-1">
          {Array.from({ length: 48 }).map((_, i) => {
            const progressRatio = currentTime / duration;
            const barRatio = i / 48;
            const isPassed = barRatio <= progressRatio;

            const heights = [30, 55, 80, 40, 70, 95, 45, 60, 85, 35, 65, 90];
            const baseH = heights[i % heights.length];
            const animH = isPlaying ? Math.max(15, (baseH + (i % 5) * 5) % 100) : baseH;

            return (
              <div
                key={i}
                onClick={() => setCurrentTime(Math.round(barRatio * duration))}
                style={{ height: `${animH}%` }}
                className={`w-1 rounded-full cursor-pointer transition-all duration-200 ${
                  isPassed
                    ? 'bg-stone-900 dark:bg-amber-300'
                    : 'bg-stone-200 dark:bg-stone-800 hover:bg-stone-400'
                }`}
              />
            );
          })}
        </div>

        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-stone-100 dark:bg-stone-800 accent-stone-900 dark:accent-stone-100"
          />
        </div>
      </div>

      {/* Main Grid: Questions & Transcript */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                  Questions 1–{test.questions.length}
                </h3>
                <p className="text-[11px] text-stone-400">
                  Write NO MORE THAN TWO WORDS AND/OR A NUMBER
                </p>
              </div>
              <span className="text-xs text-stone-500">
                {Object.keys(userAnswers).length}/{test.questions.length} Answered
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {test.questions.map((q, idx) => {
                const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
                const cAns = q.correctAnswer.trim().toLowerCase();
                const isCorrect =
                  isSubmitted &&
                  (uAns === cAns || (q.type === 'multiple-choice' && uAns.startsWith(cAns)));
                const isWrong = isSubmitted && !isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4.5 transition-all ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/40 dark:bg-emerald-950/20'
                        : isWrong
                        ? 'border-rose-200 bg-rose-50/20 dark:border-rose-900/40 dark:bg-rose-950/20'
                        : 'border-stone-200/70 bg-[#FAF9F5]/70 dark:border-stone-800 dark:bg-stone-850/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                        {idx + 1}
                      </span>

                      <div className="flex-1 space-y-2.5">
                        <p className="text-xs font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
                          {q.prompt}
                        </p>

                        {/* Options */}
                        {q.type === 'multiple-choice' && q.options && (
                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt) => {
                              const letter = opt.charAt(0).toLowerCase();
                              const isSelected = userAnswers[q.id] === letter;

                              return (
                                <label
                                  key={opt}
                                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-xs transition-all ${
                                    isSelected
                                      ? 'border-stone-900 bg-white font-semibold text-stone-950 shadow-2xs dark:border-stone-100 dark:bg-stone-800 dark:text-white'
                                      : 'border-stone-200/70 bg-white/70 text-stone-700 hover:bg-white dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-300'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    value={letter}
                                    checked={isSelected}
                                    onChange={() => handleAnswerChange(q.id, letter)}
                                    disabled={isSubmitted}
                                    className="accent-stone-900 dark:accent-stone-100"
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Form Completion */}
                        {q.type === 'form-completion' && (
                          <div className="pt-1">
                            <input
                              type="text"
                              value={userAnswers[q.id] || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              placeholder="Nhập câu trả lời..."
                              disabled={isSubmitted}
                              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-500 focus:outline-hidden dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                            />
                          </div>
                        )}

                        {/* Result review */}
                        {isSubmitted && (
                          <div className="mt-2 rounded-xl border border-stone-200 bg-white p-3 text-xs dark:border-stone-750 dark:bg-stone-800">
                            <div className="flex items-center gap-1.5 font-semibold">
                              {isCorrect ? (
                                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Correct: {q.correctAnswer}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400">
                                  <XCircle className="h-3.5 w-3.5" /> Official Answer: {q.correctAnswer}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-stone-600 dark:text-stone-300 leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-6 border-t border-stone-100 pt-4 flex items-center justify-between dark:border-stone-800">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-950 dark:text-stone-300"
              >
                {showTranscript ? 'Hide Audio Transcript' : 'Show Synchronized Transcript'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className={`rounded-full px-6 py-2.5 text-xs font-semibold text-white transition-all ${
                  isSubmitted
                    ? 'bg-stone-400 dark:bg-stone-700 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
                }`}
              >
                {isSubmitted ? 'Section Evaluated ✓' : 'Submit Answers'}
              </button>
            </div>
          </div>
        </div>

        {/* Transcript (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <FileAudio className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                  Synchronized Transcript
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">
                Click line to jump
              </span>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              {transcriptParagraphs.map((para, idx) => {
                const isCurrentLine =
                  currentTime >= para.time &&
                  (idx === transcriptParagraphs.length - 1 ||
                    currentTime < transcriptParagraphs[idx + 1].time);

                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentTime(para.time)}
                    className={`group cursor-pointer rounded-2xl p-3.5 transition-all ${
                      isCurrentLine
                        ? 'border border-stone-900/30 bg-stone-100/70 shadow-2xs dark:border-stone-600 dark:bg-stone-800'
                        : 'border border-transparent hover:bg-stone-50 dark:hover:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                      <span className="font-mono font-medium text-stone-600 dark:text-stone-300">
                        {formatTime(para.time)}
                      </span>
                      {isCurrentLine && (
                        <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase text-[9px]">
                          Active Audio
                        </span>
                      )}
                    </div>

                    <p
                      className={`leading-relaxed ${
                        isCurrentLine
                          ? 'font-medium text-stone-950 dark:text-white'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {para.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
