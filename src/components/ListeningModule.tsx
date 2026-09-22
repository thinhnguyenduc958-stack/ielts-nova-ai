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
  MapPin,
  Sparkles,
} from 'lucide-react';

const SECTIONS = [
  { num: 1, title: 'Section 1', desc: 'Social & Transactional Dialogue', badge: 'Everyday' },
  { num: 2, title: 'Section 2', desc: 'Local Facility & Campus Map', badge: 'General' },
  { num: 3, title: 'Section 3', desc: 'Academic Project Collaboration', badge: 'Education' },
  { num: 4, title: 'Section 4', desc: 'University Research Lecture', badge: 'Academic' },
];

export const ListeningModule: React.FC = () => {
  const { recordActivity, showToast } = useApp();
  const test = sampleListeningTests[0];

  const [activeSection, setActiveSection] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [accent, setAccent] = useState<'UK' | 'US' | 'AU'>('UK');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = test.durationSeconds || 180;

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
      `Band ${bandEstimated} (${correctCount}/${test.questions.length})`
    );
    showToast(`Scored ${correctCount}/${test.questions.length} questions correct!`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const transcriptParagraphs = [
    {
      time: 0,
      speaker: 'Receptionist',
      text: 'Good morning, welcome to Southfield Community Sports Center. How may I direct you today?',
    },
    {
      time: 25,
      speaker: 'Visitor',
      text: 'Hi there, I am interested in joining the community cycle hire scheme and would also like information about facility bookings.',
    },
    {
      time: 60,
      speaker: 'Receptionist',
      text: 'Certainly! The bike scheme operates across seven automated docking stations. Rental is completely free for the initial forty-five minutes of any journey.',
    },
    {
      time: 80,
      speaker: 'Receptionist',
      text: 'Please note however that cycling across the central pedestrian quadrangle between 11:00 AM and 2:00 PM is strictly prohibited to guarantee safety.',
    },
    {
      time: 105,
      speaker: 'Receptionist',
      text: 'If you encounter any tire puncture, please locate the yellow emergency repair docks situated right adjacent to the north athletic pavilion.',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24 text-[#111318] bg-white">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            IELTS LISTENING LABORATORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] uppercase">
            SECTION {activeSection} · AUDIO LAB
          </h1>
          <p className="text-xs sm:text-sm text-[#5C616B]">
            Authentic multi-accent English with interactive timestamp scrubbing and acoustic distractor drills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
            {test.questions.length} Questions
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-mono font-bold text-[#111318]">
            {formatTime(duration)}
          </span>
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
              className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs text-indigo-900'
                  : 'border-stone-200 bg-white hover:border-stone-300 text-[#111318]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-700' : 'text-[#111318]'}`}>
                  {sec.title}
                </span>
                <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-[#5C616B]">
                  {sec.badge}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#5C616B] line-clamp-1">
                {sec.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Audio Player with Clean Timeline & 0.8x / 1.0x / 1.2x Speed Controls */}
      <div className="rounded-3xl border border-indigo-100 bg-[#F6F4FF] p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#5C616B] hover:text-[#111318] hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
              title="Reset Audio"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-[#111318]">
                  Cambridge Track · Section {activeSection}
                </p>
                {isPlaying && (
                  <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                )}
              </div>
              <p className="text-xs text-[#5C616B]">
                {test.scenario || 'Sports & Community Center Navigation'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Accent Selector */}
            <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold shadow-2xs">
              {(['UK', 'US', 'AU'] as const).map((ac) => (
                <button
                  key={ac}
                  onClick={() => setAccent(ac)}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                    accent === ac
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'text-[#5C616B] hover:text-[#111318]'
                  }`}
                >
                  {ac}
                </button>
              ))}
            </div>

            {/* Speed controls: 0.8x / 1.0x / 1.2x */}
            <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold shadow-2xs">
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'text-[#5C616B] hover:text-[#111318]'
                  }`}
                >
                  {spd.toFixed(1)}x
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#111318] shadow-2xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Clean Timeline Waveform Scrubbing */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1 h-8 px-1">
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
                    isPassed ? 'bg-indigo-600' : 'bg-indigo-200/70 hover:bg-indigo-300'
                  }`}
                />
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-indigo-200/60 accent-indigo-600"
          />
        </div>
      </div>

      {/* Main Grid: Questions & Map / Synchronized Transcript */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Questions (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111318]">
                  Questions 1–{test.questions.length}
                </h3>
                <p className="text-[11px] text-[#5C616B]">
                  Write NO MORE THAN TWO WORDS AND/OR A NUMBER
                </p>
              </div>
              <span className="text-xs font-mono text-[#5C616B]">
                {Object.keys(userAnswers).length}/{test.questions.length} Answered
              </span>
            </div>

            {/* Interactive Campus / Facility Map Diagram for Section 2 */}
            {activeSection === 2 && (
              <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                  <MapPin className="h-4 w-4" />
                  <span>Map Diagram: Southfield Community Sports Center</span>
                </div>
                <div className="rounded-xl border border-stone-200 bg-white p-4 font-mono text-[11px] text-[#111318] text-center space-y-1">
                  <p className="font-bold text-stone-500">[ NORTH PAVILION ]</p>
                  <p className="text-indigo-600 font-bold">▲ (Yellow Emergency Repair Dock)</p>
                  <p className="text-[#5C616B]">|=== Pedestrian Quadrangle (No cycling 11am-2pm) ===|</p>
                  <p className="font-bold text-stone-500">[ RECEPTION & ENTRY DOCKS ]</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
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
                    className={`rounded-2xl border p-4 transition-all ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isWrong
                        ? 'border-rose-200 bg-rose-50/40'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                        {idx + 1}
                      </span>

                      <div className="flex-1 space-y-2">
                        <p className="text-xs font-semibold text-[#111318] leading-relaxed">
                          {q.prompt}
                        </p>

                        {/* Multiple Choice */}
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
                                      ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900'
                                      : 'border-stone-200 bg-white text-[#111318] hover:bg-stone-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    value={letter}
                                    checked={isSelected}
                                    onChange={() => handleAnswerChange(q.id, letter)}
                                    disabled={isSubmitted}
                                    className="accent-indigo-600"
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
                              placeholder="Type your answer..."
                              disabled={isSubmitted}
                              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
                            />
                          </div>
                        )}

                        {/* Result review */}
                        {isSubmitted && (
                          <div className="mt-2 rounded-xl border border-stone-200 bg-white p-3 text-xs">
                            <div className="flex items-center gap-1.5 font-bold">
                              {isCorrect ? (
                                <span className="flex items-center gap-1 text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Correct: {q.correctAnswer}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-rose-700">
                                  <XCircle className="h-3.5 w-3.5" /> Official Answer: {q.correctAnswer}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[#5C616B] leading-relaxed">
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
            <div className="mt-6 border-t border-stone-100 pt-4 flex items-center justify-between">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                {showTranscript ? 'Hide Synchronized Transcript' : 'Show Synchronized Transcript'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className={`rounded-xl px-6 py-2.5 text-xs font-bold text-white transition-all cursor-pointer ${
                  isSubmitted
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-xs'
                }`}
              >
                {isSubmitted ? 'Section Evaluated ✓' : 'Submit Answers'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized Transcript (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileAudio className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-[#111318]">
                  Synchronized Audio Transcript
                </h3>
              </div>
              <span className="text-[11px] text-[#5C616B]">
                Click line to jump
              </span>
            </div>

            {showTranscript ? (
              <div className="space-y-2.5 text-xs max-h-[500px] overflow-y-auto pr-1">
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
                          ? 'border border-indigo-200 bg-indigo-50/60 shadow-2xs'
                          : 'border border-stone-100 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#5C616B] mb-1">
                        <span className="font-mono font-bold text-[#111318]">
                          {formatTime(para.time)} · {para.speaker}
                        </span>
                        {isCurrentLine && (
                          <span className="font-bold text-indigo-700 uppercase text-[9px]">
                            Active Audio
                          </span>
                        )}
                      </div>

                      <p
                        className={`leading-relaxed ${
                          isCurrentLine
                            ? 'font-medium text-[#111318]'
                            : 'text-[#5C616B]'
                        }`}
                      >
                        {para.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-[#5C616B]">
                Transcript hidden during listening drill. Click "Show Synchronized Transcript" to view.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
