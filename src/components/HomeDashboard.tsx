import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NovaOrb } from './NovaOrb';
import { NovaVoiceDialog } from './NovaVoiceDialog';
import { NovaSymbol } from './NovaLogo';
import {
  ArrowRight,
  Mic,
  Sparkles,
  Flame,
  Clock,
  TrendingUp,
  Award,
  CheckCircle2,
  Bookmark,
  Headphones,
  PenTool,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { NovaState } from '../types';

const DAILY_MESSAGES = [
  'Ready when you are.',
  "Let's work on Speaking today.",
  'Your Writing improved this week.',
  "You've learned 42 new words.",
  'Target Band 7.0 is within your reach.',
  'Focus on lexical variety in Task 2.',
];

export const HomeDashboard: React.FC = () => {
  const { userProfile, setCurrentTab, vocabulary } = useApp();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [orbState, setOrbState] = useState<NovaState>('idle');
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate dynamic message periodically to keep the interface alive
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DAILY_MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const breakdown = userProfile.breakdown;
  const currentOverall = userProfile.currentBand !== 'Not assessed' ? userProfile.currentBand : '5.5';
  const targetBand = userProfile.targetBand || '7.0';
  const currentNum = parseFloat(currentOverall) || 5.5;
  const targetNum = parseFloat(targetBand) || 7.0;
  const progressPct = Math.min(100, Math.round((currentNum / targetNum) * 100));

  // Toggle orb states interactively
  const handleOrbCycle = () => {
    const states: NovaState[] = ['idle', 'listening', 'thinking', 'speaking', 'success'];
    const nextIdx = (states.indexOf(orbState) + 1) % states.length;
    setOrbState(states[nextIdx]);
    if (states[nextIdx] === 'listening') {
      setIsVoiceOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* 1. HOME HERO (Section 6 & 7 & 8: Editorial Composition with balanced NOVA visual) */}
      <section className="relative pt-2 pb-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          {/* Left Column: Bold Editorial Typography */}
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-[11px] font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NOVA EDITORIAL INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111318] dark:text-white uppercase leading-[1.05]">
              YOUR IELTS
              <br />
              JOURNEY,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                REIMAGINED.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5F6368] dark:text-stone-400 font-normal max-w-md leading-relaxed">
              An intelligent companion for your IELTS journey.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-98"
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsVoiceOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-semibold text-[#111318] shadow-2xs transition-all hover:bg-stone-50 active:scale-98 dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:hover:bg-stone-850"
              >
                <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Talk to NOVA</span>
              </button>
            </div>
          </div>

          {/* Right Column: Signature NOVA AI Core & Dynamic Message */}
          <div className="relative flex flex-col items-center justify-center self-center lg:self-auto rounded-3xl border border-stone-200/90 bg-gradient-to-b from-white via-indigo-50/20 to-white p-8 sm:p-10 shadow-sm dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 w-full lg:w-auto min-w-[280px] sm:min-w-[320px]">
            <NovaOrb
              size="hero"
              state={orbState}
              onClick={handleOrbCycle}
            />

            {/* Section 8: Dynamic NOVA Daily Message */}
            <div className="mt-4 flex flex-col items-center text-center">
              <p className="font-serif italic text-sm font-medium text-[#111318] dark:text-stone-200 transition-opacity duration-300">
                "{DAILY_MESSAGES[messageIndex]}"
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#5F6368] dark:text-stone-400">
                  {orbState.toUpperCase()}
                </span>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <button
                  onClick={handleOrbCycle}
                  className="text-[10px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Tap core to interact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DOMINANT CONTINUE LEARNING (Section 9: One dominant learning experience with subtle tinting) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider uppercase text-[#5F6368] dark:text-stone-400">
            CONTINUE LEARNING
          </p>
          <span className="text-xs text-[#5F6368] dark:text-stone-400 font-mono">
            12 min remaining
          </span>
        </div>

        {/* Large Elegant Surface with subtle tinting */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/30 p-6 sm:p-8 shadow-xs dark:border-indigo-950 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  SPEAKING · PART 2
                </span>
                <span className="text-xs text-[#5F6368] dark:text-stone-400">
                  Cambridge Cue-Card Simulation
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111318] dark:text-white tracking-tight">
                Describe a technology you use every day.
              </h2>

              <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400 leading-relaxed">
                You will have 1 minute to prepare notes and 2 minutes to present. NOVA analyzes your fluency, lexical resource, and grammatical range in real-time.
              </p>

              {/* Progress visual bar */}
              <div className="pt-2 max-w-md">
                <div className="h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full w-3/4" />
                </div>
              </div>
            </div>

            {/* Direct Continue Button */}
            <div className="flex items-center self-start lg:self-center">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111318] px-7 py-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-stone-800 active:scale-98 dark:bg-white dark:text-[#111318] dark:hover:bg-stone-100"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S FOCUS (Section 10: Three visually distinct metrics using typography and spacing) */}
      <section className="space-y-4">
        <p className="text-xs font-bold tracking-wider uppercase text-[#5F6368] dark:text-stone-400">
          TODAY'S FOCUS
        </p>

        {/* Expressive typographic spacing without generic identical boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
          {/* Metric 1: 12 WORDS */}
          <div
            onClick={() => setCurrentTab('vocabulary')}
            className="group cursor-pointer border-b sm:border-b-0 sm:border-r border-stone-200/80 dark:border-stone-800 pb-5 sm:pb-0 sm:pr-6 transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Spaced Repetition
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111318] dark:text-white">
                12
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                WORDS
              </span>
            </div>
            <p className="mt-2 text-xs text-[#5F6368] dark:text-stone-400 leading-relaxed">
              Targeted academic collocations ready for review today.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              Review Vault <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          {/* Metric 2: 18 MINUTES */}
          <div
            onClick={() => setCurrentTab('listening')}
            className="group cursor-pointer border-b sm:border-b-0 sm:border-r border-stone-200/80 dark:border-stone-800 pb-5 sm:pb-0 sm:pr-6 transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Audio Lab
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111318] dark:text-white">
                18
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                MINUTES
              </span>
            </div>
            <p className="mt-2 text-xs text-[#5F6368] dark:text-stone-400 leading-relaxed">
              Campus library orientation audio drill in Section 2.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
              Start Audio <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          {/* Metric 3: 1 TASK */}
          <div
            onClick={() => setCurrentTab('writing')}
            className="group cursor-pointer transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Academic Studio
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111318] dark:text-white">
                1
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                TASK
              </span>
            </div>
            <p className="mt-2 text-xs text-[#5F6368] dark:text-stone-400 leading-relaxed">
              Task 2 environmental policy essay with AI examiner feedback.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:underline">
              Write Essay <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* 4. NOVA'S INSIGHT (Section 13: Functional, actionable AI intelligence) */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-[#FFFFFF] p-6 sm:p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              NOVA'S INSIGHT
            </h3>
            <p className="text-sm sm:text-base font-medium text-[#111318] dark:text-white leading-relaxed">
              "Your vocabulary usage improved this week, but Speaking fluency remains your main practice opportunity."
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
              >
                <span>Practice Speaking</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IELTS SKILL VISUALIZATION (Section 11: Elegant horizontal progress overview) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider uppercase text-[#5F6368] dark:text-stone-400">
            IELTS SKILL OVERVIEW
          </p>
          <span className="text-xs text-[#5F6368] dark:text-stone-400">
            Target Scale: 9.0
          </span>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Listening 6.0 */}
            <div
              onClick={() => setCurrentTab('listening')}
              className="cursor-pointer space-y-2 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">LISTENING</span>
                <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {breakdown.listening.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(breakdown.listening / 9.0) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5F6368] dark:text-stone-400">
                <span>Auditory trap analysis</span>
                <span>Goal: {targetBand}</span>
              </div>
            </div>

            {/* Reading 6.5 */}
            <div
              onClick={() => setCurrentTab('reading')}
              className="cursor-pointer space-y-2 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">READING</span>
                <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {breakdown.reading.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(breakdown.reading / 9.0) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5F6368] dark:text-stone-400">
                <span>Academic passage speed</span>
                <span>Goal: {targetBand}</span>
              </div>
            </div>

            {/* Writing 5.5 */}
            <div
              onClick={() => setCurrentTab('writing')}
              className="cursor-pointer space-y-2 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">WRITING</span>
                <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {breakdown.writing.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(breakdown.writing / 9.0) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5F6368] dark:text-stone-400">
                <span>Task 2 cohesive devices</span>
                <span>Goal: {targetBand}</span>
              </div>
            </div>

            {/* Speaking 5.5 */}
            <div
              onClick={() => setCurrentTab('speaking')}
              className="cursor-pointer space-y-2 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">SPEAKING</span>
                <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {breakdown.speaking.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(breakdown.speaking / 9.0) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5F6368] dark:text-stone-400">
                <span>Part 2 topic coherence</span>
                <span>Goal: {targetBand}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROGRESS (Section 12: CURRENT BAND 5.5, TARGET 7.0 with beautiful progress path) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider uppercase text-[#5F6368] dark:text-stone-400">
            PROGRESS & TRAJECTORY
          </p>
          <button
            onClick={() => setCurrentTab('progress')}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Analytics Hub →
          </button>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-mono text-3xl font-black text-[#111318] dark:text-white">
                  {currentOverall}
                </span>
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                  Current Band
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {targetBand}
                </span>
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Target Band
                </span>
              </div>
            </div>

            {/* Progress Path Line */}
            <div className="relative h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Reward Metrics */}
          <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-5 dark:border-stone-800 sm:grid-cols-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Recent Boost
              </span>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                +0.5 Band
              </p>
              <p className="text-[10px] text-[#5F6368] dark:text-stone-500">Lexical Resource</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Study Streak
              </span>
              <p className="mt-1 font-mono text-lg font-bold text-[#111318] dark:text-white flex items-center gap-1">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                {userProfile.streakDays || 12} days
              </p>
              <p className="text-[10px] text-[#5F6368] dark:text-stone-500">Unbroken habit</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Lexicon Vault
              </span>
              <p className="mt-1 font-mono text-lg font-bold text-[#111318] dark:text-white">
                {vocabulary.length || 342} words
              </p>
              <p className="text-[10px] text-[#5F6368] dark:text-stone-500">Active vocabulary</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Time Invested
              </span>
              <p className="mt-1 font-mono text-lg font-bold text-[#111318] dark:text-white flex items-center gap-1">
                <Clock className="h-4 w-4 text-stone-400" />
                8h 42m
              </p>
              <p className="text-[10px] text-[#5F6368] dark:text-stone-500">Total sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Companion Modal */}
      <NovaVoiceDialog isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
