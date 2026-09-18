import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ArrowRight,
  Bookmark,
  Zap,
  Bot,
  Layers,
  ChevronRight,
  Clock,
  Target,
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

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* SECTION 18 & 19: EDITORIAL HEADER */}
      <div className="border-b border-stone-200/80 pb-6 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {isPracticeMode ? 'SKILL LAUNCHPAD' : 'ACADEMIC FOUNDATION'}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111318] dark:text-white uppercase leading-[1.05]">
              {isPracticeMode ? 'PRACTICE' : 'LEARN'}
            </h1>
            <p className="text-base sm:text-lg text-[#5F6368] dark:text-stone-400 font-normal">
              {isPracticeMode
                ? 'What do you want to improve?'
                : 'Build your IELTS foundation.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab(isPracticeMode ? 'learn' : 'practice')}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#111318] hover:bg-stone-50 transition-colors dark:border-stone-800 dark:bg-stone-900 dark:text-white"
            >
              Switch to {isPracticeMode ? 'Library (Learn)' : 'Launchpad (Practice)'}
            </button>

            <button
              onClick={() => setShowGenerator(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW A: PRACTICE LAUNCHPAD (Section 19: What do you want to improve? Each skill gets unique visual treatment) */}
      {isPracticeMode ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. SPEAKING LAUNCHPAD - Unique Warm Amber/Indigo styling */}
            <div
              onClick={() => setCurrentTab('speaking')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 p-7 shadow-xs transition-all hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
                  <Mic className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  Current {userProfile.breakdown.speaking.toFixed(1)}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Speaking Interview
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  Face the AI examiner. Practice Part 1 introductory questions, Part 2 cue-card speeches, and Part 3 abstract discussions with instant pronunciation & fluency feedback.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-amber-100/80 pt-4 dark:border-stone-800">
                <span className="text-xs font-mono text-[#5F6368] dark:text-stone-400">
                  Part 1, 2, 3 Modules
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  Launch Studio <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* 2. WRITING LAUNCHPAD - Unique Violet styling */}
            <div
              onClick={() => setCurrentTab('writing')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/40 via-white to-purple-50/30 p-7 shadow-xs transition-all hover:border-violet-400 hover:shadow-md dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xs">
                  <PenTool className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-900 dark:bg-violet-950 dark:text-violet-200">
                  Current {userProfile.breakdown.writing.toFixed(1)}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Writing Studio
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  Compose Task 1 visual reports or Task 2 academic argumentative essays. Receive side-by-side Cambridge rubric evaluation with Band 8.0 rewrites.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-violet-100/80 pt-4 dark:border-stone-800">
                <span className="text-xs font-mono text-[#5F6368] dark:text-stone-400">
                  Task 1 & Task 2 Rubrics
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
                  Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* 3. READING LAUNCHPAD - Unique Blue styling */}
            <div
              onClick={() => setCurrentTab('reading')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/30 p-7 shadow-xs transition-all hover:border-blue-400 hover:shadow-md dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                  Current {userProfile.breakdown.reading.toFixed(1)}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Reading Drills
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  Train speed skimming, True/False/Not Given logical traps, and heading matching on authentic academic texts with instant vocabulary highlighting.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-blue-100/80 pt-4 dark:border-stone-800">
                <span className="text-xs font-mono text-[#5F6368] dark:text-stone-400">
                  3 Academic Passages
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Start Passage <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            {/* 4. LISTENING LAUNCHPAD - Unique Mint/Emerald styling */}
            <div
              onClick={() => setCurrentTab('listening')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 p-7 shadow-xs transition-all hover:border-emerald-400 hover:shadow-md dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <Headphones className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                  Current {userProfile.breakdown.listening.toFixed(1)}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Listening Lab
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  Interactive audio tracks featuring authentic British, Australian, and North American accents. Drill number dictation, map labeling, and distractors.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-emerald-100/80 pt-4 dark:border-stone-800">
                <span className="text-xs font-mono text-[#5F6368] dark:text-stone-400">
                  Sections 1 to 4 Audio
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Enter Lab <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW B: LEARN VISUAL LEARNING LIBRARY (Section 18: Vocabulary, Grammar, IELTS Skills, AI Lessons) */
        <div className="space-y-8">
          {/* 4 Large Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Vocabulary */}
            <div
              onClick={() => setCurrentTab('vocabulary')}
              className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4">
                  <Bookmark className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Vocabulary Library
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  1,200+ curated IELTS Academic keywords, 10 core topic clusters (Environment, Technology, Education, Society), interactive flashcards and collocations.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Open Lexicon Vault →
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-stone-400">
                  Spaced Repetition
                </span>
              </div>
            </div>

            {/* Section 2: Grammar */}
            <div
              onClick={() => setCurrentTab('grammar')}
              className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Grammar Master
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  Target Band 8.0+ grammatical structures: Inversion, mixed conditionals, cleft sentences, nominalization, and cohesive linking devices.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Study Grammar Rules →
                </span>
                <span className="text-xs font-mono text-[#5F6368] dark:text-stone-400">
                  Band 7 - 9 Range
                </span>
              </div>
            </div>

            {/* Section 3: IELTS Skills Roadmap */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900 md:col-span-2 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4 dark:border-stone-800">
                <div>
                  <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                    IELTS Skills Roadmap
                  </h3>
                  <p className="text-xs text-[#5F6368] dark:text-stone-400">
                    Syllabus requirements calibrated for each Cambridge band descriptor.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 self-start sm:self-auto">
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
                      className={`flex shrink-0 flex-col items-center justify-center rounded-xl border px-4 py-3 transition-all min-w-[96px] ${
                        isViewing
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs dark:border-indigo-400 dark:bg-indigo-950/40'
                          : 'border-stone-200/80 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900'
                      }`}
                    >
                      <span className={`text-base font-black ${isViewing ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#111318] dark:text-white'}`}>
                        Band {item.level}
                      </span>
                      <span className="mt-0.5 text-[10px] text-[#5F6368] dark:text-stone-400">
                        {isTarget ? '★ Active Goal' : `${item.modulesCount} modules`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Band description */}
              <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#111318] dark:text-white">
                    Band {activeBandInfo.level} — {activeBandInfo.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#5F6368] dark:text-stone-400 leading-relaxed">
                    {activeBandInfo.description}
                  </p>
                </div>
                {selectedBand !== userProfile.targetBand && (
                  <button
                    onClick={() => setTargetBand(selectedBand)}
                    className="shrink-0 rounded-lg bg-[#111318] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-stone-800 dark:bg-white dark:text-[#111318]"
                  >
                    Set as Target
                  </button>
                )}
              </div>
            </div>

            {/* Section 4: AI Lessons */}
            <div
              onClick={() => setCurrentTab('tutor')}
              className="group cursor-pointer rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 p-7 shadow-xs hover:shadow-md transition-all dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                  <Bot className="h-3 w-3" />
                  <span>AI LESSONS WITH NOVA</span>
                </div>
                <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                  Personalized 1-on-1 IELTS Sessions
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                  Practice conversational speaking, query tricky grammar dilemmas, or have NOVA breakdown complex IELTS Reading passages line-by-line.
                </p>
              </div>

              <div className="flex items-center self-start sm:self-center">
                <button
                  onClick={() => setCurrentTab('tutor')}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  Start Lesson →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generator Modal */}
      <PracticeGeneratorModal isOpen={showGenerator} onClose={() => setShowGenerator(false)} />
    </div>
  );
};
