import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand } from '../types';
import {
  Sparkles,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ArrowRight,
  Bookmark,
  Zap,
  Bot,
  Award,
  X,
} from 'lucide-react';
import { PracticeGeneratorModal } from './PracticeGeneratorModal';

const BANDS: { level: IELTSBand; title: string; description: string; modulesCount: number }[] = [
  { level: '4.5', title: 'Foundation English', description: 'Essential sentence structures, core 1,000 vocabulary words, listening for numbers and names.', modulesCount: 12 },
  { level: '5.0', title: 'Elementary IELTS', description: 'Simple past vs present perfect, short listening conversations, basic paragraph structure.', modulesCount: 16 },
  { level: '5.5', title: 'Pre-Intermediate IELTS', description: 'Comparative forms, Writing Task 1 overview, basic True/False/Not Given scanning.', modulesCount: 20 },
  { level: '6.0', title: 'Competent User Foundation', description: 'Cohesive devices, academic collocations, Speaking Part 2 structured response formula.', modulesCount: 24 },
  { level: '6.5', title: 'Intermediate Mastery', description: 'Complex sentence variety, Task 2 balanced arguments, matching headings in Reading.', modulesCount: 28 },
  { level: '7.0', title: 'Advanced Academic IELTS', description: 'Lexical resource elevation, nuanced hedging (tentative language), high-speed listening distractors.', modulesCount: 32 },
  { level: '7.5', title: 'High-Proficiency IELTS', description: 'Stylistic precision, academic idiomatic collocations, cohesive progression across complex essays.', modulesCount: 36 },
  { level: '8.0', title: 'Expert Academic Command', description: 'Near-native fluency, flawless grammatical accuracy, sophisticated thesis synthesis.', modulesCount: 40 },
  { level: '8.5', title: 'Mastery Level', description: 'Flawless academic nuance, rapid inference in dense reading passages, subtle speaker irony.', modulesCount: 44 },
];

export const LearnHub: React.FC = () => {
  const { userProfile, setTargetBand, setCurrentTab, currentTab } = useApp();
  const [selectedBand, setSelectedBand] = useState<IELTSBand>(userProfile.targetBand);
  const [showGenerator, setShowGenerator] = useState(false);

  const isPracticeMode = currentTab === 'practice';
  const activeBandInfo = BANDS.find((b) => b.level === selectedBand) || BANDS[5];

  // ESC key listener to close Learn or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showGenerator) {
          setShowGenerator(false);
        } else {
          setCurrentTab('home');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGenerator, setCurrentTab]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-24 text-[#111318] bg-white">
      {/* 15 & 16. EDITORIAL HEADER */}
      <div className="relative border-b border-stone-200/80 pb-6">
        {/* Top Header Row with Category and Close (X) Button */}
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            {isPracticeMode ? 'SKILL LAUNCHPAD' : 'CONTENT LIBRARY'}
          </span>

          <button
            id="btn-close-learn"
            data-testid="close-learn"
            onClick={() => setCurrentTab('home')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#5C616B] hover:text-[#111318] hover:bg-stone-100 active:scale-95 transition-all shadow-2xs cursor-pointer z-30 shrink-0"
            aria-label="Close"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111318] uppercase leading-[1.05]">
              {isPracticeMode ? 'PRACTICE' : 'LEARN'}
            </h1>
            <p className="text-base sm:text-lg text-[#5C616B] font-normal">
              {isPracticeMode
                ? 'What do you want to improve?'
                : 'Build your academic foundation.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentTab(isPracticeMode ? 'learn' : 'practice')}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#111318] hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Switch to {isPracticeMode ? 'Library (Learn)' : 'Launchpad (Practice)'}
            </button>

            <button
              onClick={() => setShowGenerator(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* 16. PRACTICE PAGE: Four Large Visual Areas (Speaking, Writing, Reading, Listening) */}
      {isPracticeMode ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. SPEAKING - Unique Amber Accent */}
            <div
              onClick={() => setCurrentTab('speaking')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-amber-200/80 bg-[#FFFBEB] p-7 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
                    <Mic className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
                    Band {userProfile.breakdown.speaking.toFixed(1)}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-2xl font-black text-[#111318]">
                    Speaking
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                    Interactive AI examiner interview across Parts 1, 2, and 3. Real-time evaluation of fluency, lexical resource, and pronunciation.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-amber-200/60 pt-4 space-y-3">
                <div className="flex justify-between text-[11px] font-semibold text-[#5C616B]">
                  <span>Fluency Progress</span>
                  <span>{Math.round((userProfile.breakdown.speaking / 9.0) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-amber-200/60 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(userProfile.breakdown.speaking / 9.0) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-amber-900">
                    Live Audio Studio
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                    Practice Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WRITING - Unique Violet Accent */}
            <div
              onClick={() => setCurrentTab('writing')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-violet-200/80 bg-[#F5F3FF] p-7 shadow-xs hover:border-violet-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xs">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-900 border border-violet-200">
                    Band {userProfile.breakdown.writing.toFixed(1)}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-2xl font-black text-[#111318]">
                    Writing
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                    Essay studio for Task 1 reports and Task 2 academic essays. Instant Cambridge rubric scoring with side-by-side Band 8.0 rewrites.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-violet-200/60 pt-4 space-y-3">
                <div className="flex justify-between text-[11px] font-semibold text-[#5C616B]">
                  <span>Writing Progress</span>
                  <span>{Math.round((userProfile.breakdown.writing / 9.0) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-violet-200/60 overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{ width: `${(userProfile.breakdown.writing / 9.0) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-violet-900">
                    Task 1 & 2 Workspace
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 group-hover:translate-x-1 transition-transform">
                    Practice Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* 3. READING - Unique Blue Accent */}
            <div
              onClick={() => setCurrentTab('reading')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-blue-200/80 bg-[#EFF6FF] p-7 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-900 border border-blue-200">
                    Band {userProfile.breakdown.reading.toFixed(1)}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-2xl font-black text-[#111318]">
                    Reading
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                    Authentic academic passages with timed speed drills, True/False/Not Given traps, and paragraph heading matching.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-blue-200/60 pt-4 space-y-3">
                <div className="flex justify-between text-[11px] font-semibold text-[#5C616B]">
                  <span>Reading Accuracy</span>
                  <span>{Math.round((userProfile.breakdown.reading / 9.0) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-blue-200/60 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(userProfile.breakdown.reading / 9.0) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-blue-900">
                    3 Academic Passages
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                    Practice Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* 4. LISTENING - Unique Mint/Emerald Accent */}
            <div
              onClick={() => setCurrentTab('listening')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-[#ECFDF5] p-7 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
                    Band {userProfile.breakdown.listening.toFixed(1)}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-2xl font-black text-[#111318]">
                    Listening
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                    Interactive audio drills with authentic British, Australian, and North American accents. Section 1 to Section 4 audio tracks.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-emerald-200/60 pt-4 space-y-3">
                <div className="flex justify-between text-[11px] font-semibold text-[#5C616B]">
                  <span>Listening Accuracy</span>
                  <span>{Math.round((userProfile.breakdown.listening / 9.0) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-emerald-200/60 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${(userProfile.breakdown.listening / 9.0) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-emerald-900">
                    Sections 1-4 Audio
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    Practice Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 15. LEARN PAGE: Premium Content Library (Vocabulary, Grammar, AI Lessons, IELTS Skills) */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: VOCABULARY - Build your word bank */}
            <div
              onClick={() => setCurrentTab('vocabulary')}
              className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-7 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <Bookmark className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
                  VOCABULARY
                </span>
                <h3 className="text-2xl font-black text-[#111318] mt-1">
                  Build your word bank.
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                  1,200+ curated IELTS Academic keywords across 10 high-frequency topic clusters. Spaced repetition flashcards and academic collocations.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Open Vocabulary Vault <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-mono text-[#5C616B]">
                  Spaced Repetition
                </span>
              </div>
            </div>

            {/* Section 2: GRAMMAR - Build accuracy */}
            <div
              onClick={() => setCurrentTab('grammar')}
              className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-7 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
                  GRAMMAR
                </span>
                <h3 className="text-2xl font-black text-[#111318] mt-1">
                  Build accuracy.
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                  Target Band 8.0+ grammatical structures: Inversion, mixed conditionals, cleft sentences, nominalization, and academic cohesion.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Study Grammar Rules <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-mono text-[#5C616B]">
                  Band 7 - 9 Range
                </span>
              </div>
            </div>

            {/* Section 3: AI LESSONS - Learn with NOVA */}
            <div
              onClick={() => setCurrentTab('tutor')}
              className="group cursor-pointer rounded-2xl border border-indigo-100 bg-[#F5F3FF] p-7 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                  <Bot className="h-3 w-3" />
                  <span>AI LESSONS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111318]">
                  Learn with NOVA.
                </h3>
                <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                  Personalized 1-on-1 IELTS sessions. Practice speaking dialogues, test tricky grammar dilemmas, or breakdown complex Academic Reading passages line-by-line.
                </p>
              </div>

              <div className="flex items-center self-start sm:self-center">
                <button
                  onClick={() => setCurrentTab('tutor')}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Start Lesson →
                </button>
              </div>
            </div>

            {/* Section 4: IELTS SKILLS - Master the exam */}
            <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-xs md:col-span-2 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
                    IELTS SKILLS
                  </span>
                  <h3 className="text-2xl font-black text-[#111318] mt-0.5">
                    Master the exam.
                  </h3>
                  <p className="text-xs text-[#5C616B]">
                    Syllabus requirements calibrated for each Cambridge band descriptor.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 self-start sm:self-auto">
                  Active Goal: Band {userProfile.targetBand}
                </span>
              </div>

              {/* Band selection scrollbar */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {BANDS.map((item) => {
                  const isViewing = selectedBand === item.level;
                  const isTarget = userProfile.targetBand === item.level;

                  return (
                    <button
                      key={item.level}
                      onClick={() => setSelectedBand(item.level)}
                      className={`flex shrink-0 flex-col items-center justify-center rounded-xl border px-4 py-3 transition-all min-w-[96px] cursor-pointer ${
                        isViewing
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs text-indigo-600'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-[#111318]'
                      }`}
                    >
                      <span className="text-base font-black">
                        Band {item.level}
                      </span>
                      <span className="mt-0.5 text-[10px] text-[#5C616B]">
                        {isTarget ? '★ Active Goal' : `${item.modulesCount} modules`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Band details */}
              <div className="rounded-xl bg-[#F8FAFC] border border-stone-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#111318]">
                    Band {activeBandInfo.level} — {activeBandInfo.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#5C616B] leading-relaxed">
                    {activeBandInfo.description}
                  </p>
                </div>
                {selectedBand !== userProfile.targetBand && (
                  <button
                    onClick={() => setTargetBand(selectedBand)}
                    className="shrink-0 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Set as Target
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Generator Modal */}
      {showGenerator && (
        <PracticeGeneratorModal isOpen={showGenerator} onClose={() => setShowGenerator(false)} />
      )}
    </div>
  );
};
