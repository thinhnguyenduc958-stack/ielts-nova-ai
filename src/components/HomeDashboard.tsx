import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { systemIELTSVocabulary } from '../data/mockIELTSData';
import {
  Sparkles,
  ArrowUpRight,
  Target,
  Flame,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Volume2,
  BookmarkPlus,
  Play,
  CheckCircle2,
  ChevronRight,
  Bot,
  Layers,
  ArrowRight,
  Lightbulb,
  Compass,
  Quote,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { userProfile, setCurrentTab, vocabulary, recentActivities, openWordLookup, showToast } = useApp();

  // Pick word of the day from personal vault or system academic library
  const vocabOfTheDay =
    vocabulary.find((v) => v.word === 'substantial') || vocabulary[0] || systemIELTSVocabulary[0];

  const breakdownSum =
    userProfile.breakdown.listening +
    userProfile.breakdown.reading +
    userProfile.breakdown.writing +
    userProfile.breakdown.speaking;

  const isAssessed = userProfile.currentBand !== 'Not assessed' && breakdownSum > 0;
  const currentOverall = isAssessed ? (breakdownSum / 4).toFixed(1) : 'Not assessed';
  const targetBandNum = parseFloat(userProfile.targetBand) || 6.5;
  const currentBandNum = isAssessed ? parseFloat(currentOverall) : 0;
  const overallProgressPct = isAssessed ? Math.min(100, Math.round((currentBandNum / targetBandNum) * 100)) : 0;

  const dailySteps = [
    {
      id: 'step-1',
      stepNum: '01',
      skill: 'Vocabulary',
      title: 'Academic Collocations for Environmental Science',
      duration: '8 min',
      xp: 25,
      status: 'active' as const,
      tab: 'vocabulary' as const,
    },
    {
      id: 'step-2',
      stepNum: '02',
      skill: 'Reading',
      title: 'Biophilic Architecture & Urban Forestry (Passage 1)',
      duration: '15 min',
      xp: 40,
      status: 'pending' as const,
      tab: 'reading' as const,
    },
    {
      id: 'step-3',
      stepNum: '03',
      skill: 'Listening',
      title: 'Campus Bicycle Hire Scheme (Section 2 Distractors)',
      duration: '12 min',
      xp: 35,
      status: 'pending' as const,
      tab: 'listening' as const,
    },
    {
      id: 'step-4',
      stepNum: '04',
      skill: 'Speaking',
      title: 'Part 2 Cue Card: Cultural Heritage in the Digital Era',
      duration: '10 min',
      xp: 45,
      status: 'pending' as const,
      tab: 'speaking' as const,
    },
  ];

  const handlePronounce = (text: string) => {
    apiService.speakText(text, userProfile.preferredVariant);
    showToast(`Playing audio (${userProfile.preferredVariant})...`);
  };

  const handleSaveToVault = (word: typeof vocabOfTheDay) => {
    openWordLookup(word.word, word.exampleSentence);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. EDITORIAL HERO & PERSONAL GREETING */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-7 transition-all duration-300 dark:border-stone-800/80 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-10 lg:p-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/80 px-3.5 py-1 text-xs font-medium text-stone-600 shadow-2xs backdrop-blur-xs dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Cambridge Band {userProfile.targetBand} Trajectory</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl lg:text-5xl">
                Chào bạn, <span className="font-semibold text-stone-950 dark:text-white">{userProfile.name}</span>.
              </h1>
              <p className="font-serif text-lg italic text-stone-600 dark:text-stone-300 sm:text-xl">
                "Quiet focus, high retention, deliberate practice."
              </p>
            </div>

            <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              Your diagnostic is calibrated toward <span className="font-semibold text-stone-800 dark:text-stone-200">Band {userProfile.targetBand}</span>.
              Today’s recommended pathway prioritizes <span className="font-semibold text-stone-800 dark:text-stone-200">Reading Passage scanning</span> and <span className="font-semibold text-stone-800 dark:text-stone-200">Writing Task 2 coherence</span>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setCurrentTab('reading')}
                className="group inline-flex items-center gap-2.5 rounded-full bg-stone-900 px-6 py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-98 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                <Play className="h-3.5 w-3.5 fill-current transition-transform group-hover:scale-110" />
                <span>Begin Today's Session</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setCurrentTab('tutor')}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/70 px-5 py-3 text-xs font-medium text-stone-700 shadow-2xs backdrop-blur-xs transition-all hover:border-stone-400 hover:bg-white dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <Bot className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
                <span>Converse with AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Minimalist Progress Dial & Telemetry Pill */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-stone-200/70 bg-white/90 p-6 shadow-2xs backdrop-blur-md dark:border-stone-800 dark:bg-stone-850/80 sm:flex-row lg:flex-col min-w-[240px]">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-stone-100 dark:stroke-stone-800"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-stone-900 dark:stroke-amber-300 transition-all duration-1000 ease-out"
                  strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (overallProgressPct || 15) / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-light text-stone-900 dark:text-stone-100">
                  {overallProgressPct}%
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-stone-400 uppercase">
                  Target Match
                </span>
              </div>
            </div>

            <div className="w-full space-y-1.5 pt-1 text-center sm:text-left lg:text-center text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-center justify-between gap-4">
                <span>Goal</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">Band {userProfile.targetBand}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Streak</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                  <Flame className="h-3 w-3 fill-current" /> {userProfile.streakDays} Days
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S LEARNING ARC (Intuitive Step Flow) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
              Curated Curriculum
            </span>
            <h2 className="text-xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              What should you study right now?
            </h2>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Total sequence: ~45 minutes
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dailySteps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => setCurrentTab(step.tab)}
              className={`group relative flex flex-col justify-between cursor-pointer rounded-3xl border p-5 transition-all duration-200 ${
                step.status === 'active'
                  ? 'border-stone-900/40 bg-white shadow-sm dark:border-stone-600 dark:bg-stone-850'
                  : 'border-stone-200/80 bg-white/60 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60 dark:hover:bg-stone-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-stone-400 dark:text-stone-500">
                    {step.stepNum}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    step.status === 'active'
                      ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                  }`}>
                    {step.skill}
                  </span>
                </div>

                <h3 className="text-xs font-semibold leading-relaxed text-stone-800 group-hover:text-stone-950 dark:text-stone-200 dark:group-hover:text-white transition-colors">
                  {step.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-[11px] text-stone-400 dark:border-stone-800 dark:text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {step.duration}
                </span>
                <span className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 font-medium">
                  Launch <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR SKILLS WITH INDIVIDUAL PERSONALITIES */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
              The 4 Competencies
            </span>
            <h2 className="text-xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              Explore IELTS Skills
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('progress')}
            className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
          >
            <span>Telemetry</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Reading Studio Personality */}
          <div
            onClick={() => setCurrentTab('reading')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs transition-all hover:border-stone-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Academic Reading
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Distraction-free typography & live word lookup
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                Live Highlighting
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-100 bg-[#FCFBF9] p-4 dark:border-stone-800 dark:bg-stone-850">
              <p className="font-serif text-xs italic leading-relaxed text-stone-700 dark:text-stone-300 line-clamp-2">
                "Biophilic architectural frameworks systematically integrate vegetative envelopes, mitigating urban heat islands while bolstering physiological well-being..."
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500">
                <span>Passage 1 • Band 7.5 Lexicon</span>
                <span className="font-mono text-stone-700 dark:text-stone-300 font-semibold">14 Questions</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-1 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>Enter Reading Chamber</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Listening Lab Personality */}
          <div
            onClick={() => setCurrentTab('listening')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs transition-all hover:border-stone-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Audio Listening Lab
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Natural accents, distractor traps & transcript sync
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950/50 dark:text-sky-300">
                Section 2 Audio
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-100 bg-[#FCFBF9] p-4 dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span className="font-medium">Campus Mobility & Rental Scheme</span>
                <span className="text-[10px] font-mono">03:45</span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {[40, 65, 30, 80, 55, 90, 45, 70, 85, 40, 60, 95, 50, 75, 60, 45, 80, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-stone-300 dark:bg-stone-700 group-hover:bg-stone-700 dark:group-hover:bg-amber-300 transition-colors"
                    style={{ height: `${h * 0.28}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-1 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>Launch Audio Session</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Writing Studio Personality */}
          <div
            onClick={() => setCurrentTab('writing')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs transition-all hover:border-stone-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100">
                  <PenTool className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Writing Studio
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Task 1 & 2 examiner criteria with instant feedback
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                TR • CC • LR • GRA
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-100 bg-[#FCFBF9] p-4 dark:border-stone-800 dark:bg-stone-850">
              <span className="text-[10px] font-semibold tracking-wide text-stone-400 uppercase">
                Task 2 Essay Prompt
              </span>
              <p className="mt-1 text-xs leading-relaxed text-stone-700 dark:text-stone-300 line-clamp-2">
                "Some argue universities should strictly prepare graduates for specific vocations, while others believe higher education should foster broad intellectual inquiry..."
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-1 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>Draft & Analyze Essay</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Speaking Lab Personality */}
          <div
            onClick={() => setCurrentTab('speaking')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs transition-all hover:border-stone-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Speaking Simulator
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Part 1-3 prompts with fluency & pronunciation assessment
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-semibold text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                Part 2 Cue Card
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-100 bg-[#FCFBF9] p-4 dark:border-stone-800 dark:bg-stone-850">
              <span className="text-[10px] font-semibold tracking-wide text-stone-400 uppercase">
                Active Topic
              </span>
              <p className="mt-1 text-xs font-medium text-stone-800 dark:text-stone-200">
                "Describe a memorable technological innovation that reshaped your community's daily habits."
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500">
                <span>1 min prep</span>
                <span>•</span>
                <span>2 min response</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-1 text-xs font-semibold text-stone-800 dark:text-stone-200">
              <span>Start Speaking Practice</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRICAL SPOTLIGHT: LEXICON NOTEBOOK & AI TUTOR DESK */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Lexicon Notebook Entry (7 cols) */}
        {vocabOfTheDay && (
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-gradient-to-b from-white to-[#FBF9F4] p-7 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium tracking-wide text-stone-500 dark:text-stone-400 uppercase">
                    Lexicon Spotlight
                  </span>
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {vocabOfTheDay.ieltsRelevance || 'Band 7.5+'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-white">
                    {vocabOfTheDay.word}
                  </h3>
                  <span className="font-mono text-xs text-stone-400 dark:text-stone-500">
                    {vocabOfTheDay.ipa}
                  </span>
                  <span className="text-xs italic text-stone-500">
                    ({vocabOfTheDay.partOfSpeech})
                  </span>
                  <button
                    onClick={() => handlePronounce(vocabOfTheDay.word)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors"
                    title="Play pronunciation"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-xs font-medium text-stone-800 dark:text-stone-200">
                  {vocabOfTheDay.meaning}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/60 bg-white/80 p-4 dark:border-stone-800 dark:bg-stone-850/60">
                <Quote className="h-3 w-3 text-stone-300 dark:text-stone-600 mb-1" />
                <p className="font-serif text-xs italic text-stone-700 dark:text-stone-300 leading-relaxed">
                  "{vocabOfTheDay.exampleSentence}"
                </p>
              </div>

              {vocabOfTheDay.collocations && vocabOfTheDay.collocations.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
                    Academic Collocations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vocabOfTheDay.collocations.map((col, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-200/60 pt-4 dark:border-stone-800">
              <button
                onClick={() => handleSaveToVault(vocabOfTheDay)}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              >
                <BookmarkPlus className="h-3.5 w-3.5 text-stone-500" />
                <span>Save to My Vault</span>
              </button>

              <button
                onClick={() => setCurrentTab('vocabulary')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-stone-950 dark:text-stone-200 dark:hover:text-white"
              >
                <span>Browse Lexicon</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* AI Tutor Quick Prompts Desk (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                  Nova AI Tutor Desk
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Direct inquiry & feedback channel
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Have a question about an IELTS reading distractor, an essay thesis, or a tricky idiom? Select a prompt to begin:
            </p>

            <div className="space-y-2 pt-1">
              {[
                'How do I elevate my Task 2 introduction to Band 8.0?',
                'Explain how to identify False vs Not Given in Reading',
                'Give me 5 C1 collocations for economic growth',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTab('tutor')}
                  className="group flex w-full items-center justify-between rounded-2xl border border-stone-200/70 bg-[#FAF9F5] p-3 text-left text-xs text-stone-700 hover:border-stone-400 hover:bg-white dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 dark:hover:border-stone-600 transition-all"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <ArrowRight className="h-3 w-3 text-stone-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setCurrentTab('tutor')}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-100 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-750 transition-colors"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Open Full Conversation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
