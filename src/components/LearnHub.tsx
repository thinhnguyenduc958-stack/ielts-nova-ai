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
  Clock,
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
  const { userProfile, setTargetBand, setCurrentTab } = useApp();
  const [selectedBand, setSelectedBand] = useState<IELTSBand>(userProfile.targetBand);
  const [showGenerator, setShowGenerator] = useState(false);

  const activeBandInfo = BANDS.find((b) => b.level === selectedBand) || BANDS[5];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Cambridge Calibrated • CEFR Proficiency Framework</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              Academic Skill Hub
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Targeted drills, full mock tests, and real-time AI scoring engineered specifically for the 4 official IELTS assessment domains.
            </p>
          </div>

          <button
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 self-start sm:self-center rounded-full bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 active:scale-98 transition-all dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 dark:text-amber-600" />
            <span>AI Practice Generator</span>
          </button>
        </div>
      </div>

      {/* Target Level Selector Roadmap */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Target Band Roadmap</h2>
            <p className="text-xs text-stone-400">
              Select any band level to preview syllabus requirements or switch your study focus.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-[#FAF9F5] border border-stone-200 px-3 py-1 text-xs font-medium text-stone-700 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300">
            Active Target: Band {userProfile.targetBand}
          </span>
        </div>

        {/* Horizontal Band Chips */}
        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {BANDS.map((item) => {
            const isTarget = userProfile.targetBand === item.level;
            const isViewing = selectedBand === item.level;

            return (
              <button
                key={item.level}
                onClick={() => setSelectedBand(item.level)}
                className={`flex shrink-0 flex-col items-center justify-center rounded-2xl border px-4 py-3 transition-all min-w-[100px] ${
                  isViewing
                    ? 'border-stone-900 bg-[#FAF9F5] shadow-2xs dark:border-stone-100 dark:bg-stone-850'
                    : 'border-stone-200/70 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'
                }`}
              >
                <span className={`font-serif text-lg font-light ${isViewing ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300'}`}>
                  Band {item.level}
                </span>
                <span className="mt-0.5 text-[10px] text-stone-400">
                  {isTarget ? '★ Active Goal' : `${item.modulesCount} modules`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Band Overview Detail */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#FAF9F5] p-5 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
              Band {activeBandInfo.level} — {activeBandInfo.title}
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {activeBandInfo.description}
            </p>
          </div>

          {selectedBand !== userProfile.targetBand && (
            <button
              onClick={() => setTargetBand(selectedBand)}
              className="shrink-0 self-start sm:self-auto rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              Set as Target Band
            </button>
          )}
        </div>
      </div>

      {/* 4 Skill Domains */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-light text-stone-900 dark:text-white">IELTS Skill Domains</h2>
          <p className="text-xs text-stone-400">
            Dedicated test simulators and intelligent workbenches for each examination component
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 1. LISTENING SECTION */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      01 Listening Suite
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      Sections 1-4
                    </span>
                  </div>
                  <h3 className="text-base font-light text-stone-900 dark:text-white">Audio Form & Map Completion</h3>
                </div>
              </div>

              <span className="rounded-full bg-[#FAF9F5] border border-stone-200 px-2.5 py-0.5 font-serif text-xs font-medium text-stone-800 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200">
                Band {userProfile.breakdown.listening.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-700 dark:text-stone-300">Interactive Audio Track</span>
                <span className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span>🇬🇧 UK Accent</span>
                  <span>•</span>
                  <span>🇦🇺 AU Accent</span>
                </span>
              </div>

              {/* Simulated Audio Bars */}
              <div className="mt-3 flex items-center justify-between gap-1 h-7 px-2">
                {[30, 45, 65, 40, 80, 55, 90, 70, 45, 60, 75, 40, 65, 85, 50, 70, 95, 60, 40, 55, 70, 45].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-stone-300 dark:bg-stone-600"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Practice identifying numbers, names, distractor traps, and British pronunciation in Section 2.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">
                8 Mock Audios • 40 Questions
              </span>
              <button
                onClick={() => setCurrentTab('listening')}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                <span>Enter Room</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 2. READING SECTION */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      02 Reading Suite
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      Academic Passages
                    </span>
                  </div>
                  <h3 className="text-base font-light text-stone-900 dark:text-white">Academic Texts & Live Highlight</h3>
                </div>
              </div>

              <span className="rounded-full bg-[#FAF9F5] border border-stone-200 px-2.5 py-0.5 font-serif text-xs font-medium text-stone-800 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200">
                Band {userProfile.breakdown.reading.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-700 dark:text-stone-300">Passage 1 Excerpt</span>
                <span className="rounded-full bg-stone-200/60 px-2 py-0.5 text-[9px] font-medium text-stone-700 dark:bg-stone-750 dark:text-stone-300">
                  Live Vocabulary Tokenizer
                </span>
              </div>

              <div className="mt-3 font-serif rounded-xl bg-white p-3 text-xs leading-relaxed text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                "Modern vertical forests demonstrate{' '}
                <span className="rounded bg-amber-100 px-1 py-0.5 font-sans font-medium text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                  substantial
                </span>{' '}
                reductions in urban temperature fluctuations while filtering particulate pollutants..."
              </div>

              <p className="mt-2 text-[11px] text-stone-400">
                Select any word on desktop or mobile for instant contextual translation and save to your Lexicon Vault.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">
                True/False/Not Given • Headings
              </span>
              <button
                onClick={() => setCurrentTab('reading')}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                <span>Launch Reader</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 3. WRITING SECTION */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      03 Writing Suite
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      Task 1 & Task 2
                    </span>
                  </div>
                  <h3 className="text-base font-light text-stone-900 dark:text-white">AI Examiner 4-Criteria Scoring</h3>
                </div>
              </div>

              <span className="rounded-full bg-[#FAF9F5] border border-stone-200 px-2.5 py-0.5 font-serif text-xs font-medium text-stone-800 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200">
                Band {userProfile.breakdown.writing.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-stone-200/80 bg-white p-2.5 text-center dark:border-stone-800 dark:bg-stone-900">
                  <p className="text-[9px] font-semibold text-stone-400 uppercase">Task Response</p>
                  <p className="font-serif text-sm font-normal text-stone-800 dark:text-stone-200">Band 6.5</p>
                </div>
                <div className="rounded-xl border border-stone-200/80 bg-white p-2.5 text-center dark:border-stone-800 dark:bg-stone-900">
                  <p className="text-[9px] font-semibold text-stone-400 uppercase">Coherence & Cohesion</p>
                  <p className="font-serif text-sm font-normal text-stone-800 dark:text-stone-200">Band 6.0</p>
                </div>
                <div className="rounded-xl border border-stone-200/80 bg-white p-2.5 text-center dark:border-stone-800 dark:bg-stone-900">
                  <p className="text-[9px] font-semibold text-stone-400 uppercase">Lexical Resource</p>
                  <p className="font-serif text-sm font-normal text-stone-800 dark:text-stone-200">Band 7.0</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 text-center dark:border-amber-900/60 dark:bg-amber-950/40">
                  <p className="text-[9px] font-semibold text-amber-800 uppercase dark:text-amber-300">Grammar Focus</p>
                  <p className="font-serif text-sm font-normal text-amber-900 dark:text-amber-200">Band 5.5</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Official scoring with real-time timer, word counter, and inline grammatical corrections.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">
                Band 8.5 Model Samples Included
              </span>
              <button
                onClick={() => setCurrentTab('writing')}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                <span>Draft Essay</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 4. SPEAKING SECTION */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      04 Speaking Suite
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      Parts 1, 2, 3
                    </span>
                  </div>
                  <h3 className="text-base font-light text-stone-900 dark:text-white">Voice Examiner & Mic Simulator</h3>
                </div>
              </div>

              <span className="rounded-full bg-[#FAF9F5] border border-stone-200 px-2.5 py-0.5 font-serif text-xs font-medium text-stone-800 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200">
                Band {userProfile.breakdown.speaking.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-700 dark:text-stone-300">Part 2 Cue Card Simulation</span>
                <span className="flex items-center gap-1 text-stone-600 dark:text-stone-300 text-[11px]">
                  <Clock className="h-3 w-3" />
                  1-Min Prep Timer
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3.5 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-750">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                  <Mic className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-serif text-stone-900 dark:text-stone-100">
                    "Describe a skill you learned in childhood..."
                  </p>
                  <p className="text-[10px] text-stone-400">
                    Live speech recognition transcripts your response into Cambridge criteria feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-2">
              <span className="text-xs text-stone-400">
                AI Voice Audio Prompts Included
              </span>
              <button
                onClick={() => setCurrentTab('speaking')}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                <span>Start Interview</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Generator Modal */}
      {showGenerator && <PracticeGeneratorModal onClose={() => setShowGenerator(false)} />}
    </div>
  );
};
