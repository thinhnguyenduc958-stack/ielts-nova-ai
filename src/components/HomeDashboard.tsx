import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { systemIELTSVocabulary } from '../data/mockIELTSData';
import { NovaOrb } from './NovaOrb';
import { NovaVoiceDialog } from './NovaVoiceDialog';
import { NovaSymbol } from './NovaLogo';
import {
  ArrowRight,
  Mic,
  PenTool,
  Headphones,
  BookOpen,
  Volume2,
  Sparkles,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  BookmarkPlus,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { NovaState } from '../types';

export const HomeDashboard: React.FC = () => {
  const { userProfile, setCurrentTab, vocabulary, openWordLookup, showToast } = useApp();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [orbState, setOrbState] = useState<NovaState>('idle');

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const vocabOfTheDay =
    vocabulary.find((v) => v.word === 'substantial') || vocabulary[0] || systemIELTSVocabulary[0];

  const breakdown = userProfile.breakdown;
  const currentOverall = userProfile.currentBand !== 'Not assessed' ? userProfile.currentBand : '5.5';
  const targetBand = userProfile.targetBand || '7.0';
  const currentNum = parseFloat(currentOverall) || 5.5;
  const targetNum = parseFloat(targetBand) || 7.0;
  const progressPct = Math.min(100, Math.round((currentNum / targetNum) * 100));

  const handlePronounce = (text: string) => {
    apiService.speakText(text, userProfile.preferredVariant);
    showToast(`Playing audio (${userProfile.preferredVariant})...`);
  };

  // Cycle through states on orb click to make it feel alive
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
      {/* 01. EDITORIAL HERO SECTION */}
      <section className="relative pt-2 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: Editorial Bold Typography */}
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              {getGreeting()}, {userProfile.name}
            </p>

            {/* Visual Object Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111318] dark:text-white uppercase leading-[1.05]">
              YOUR IELTS
              <br />
              JOURNEY,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                REIMAGINED.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#626873] dark:text-stone-400 font-normal max-w-md leading-relaxed">
              An AI companion that helps you practice, understand and improve. Calibrated for Band {targetBand}.
            </p>

            {/* Primary Action */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-[#4338CA] active:scale-98"
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsVoiceOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white px-5 py-3.5 text-sm font-semibold text-[#111318] shadow-2xs transition-all hover:bg-stone-50 active:scale-98 dark:border-stone-800 dark:bg-stone-900 dark:text-white"
              >
                <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Talk with NOVA</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive Layered NOVA AI Core */}
          <div className="relative flex flex-col items-center justify-center self-center md:self-auto rounded-3xl border border-stone-200/90 bg-gradient-to-b from-white via-[#FAF9F5] to-white p-8 shadow-sm dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950">
            <NovaOrb
              size="hero"
              state={orbState}
              onClick={handleOrbCycle}
              message={
                orbState === 'listening'
                  ? 'Listening to speech...'
                  : orbState === 'thinking'
                  ? 'NOVA is analyzing...'
                  : orbState === 'speaking'
                  ? 'NOVA voice response active'
                  : 'Ready when you are.'
              }
            />

            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#626873] dark:text-stone-400">
                STATE: {orbState.toUpperCase()}
              </span>
              <span className="text-stone-300 dark:text-stone-600">•</span>
              <button
                onClick={handleOrbCycle}
                className="text-[10px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Tap to toggle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 02. DOMINANT "CONTINUE LEARNING" MODULE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#626873] dark:text-stone-400">
            Continue Learning
          </h2>
          <button
            onClick={() => setCurrentTab('learn')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
          >
            Curated Library →
          </button>
        </div>

        {/* Hero Learning Module Card */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold uppercase text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  Speaking • Part 2
                </span>
                <span className="text-xs text-[#626873] dark:text-stone-400">
                  Cambridge Simulation
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#111318] dark:text-white">
                Describe a technology you use every day.
              </h3>

              <p className="text-xs sm:text-sm text-[#626873] dark:text-stone-400 leading-relaxed">
                Practice 1-minute cue-card preparation and 2-minute speech delivery. NOVA analyzes your fluency, grammatical variety, and lexical resource.
              </p>

              {/* Progress bar: ████████░░ 12 min remaining */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-[#626873] dark:text-stone-400">
                  <span className="font-medium">Progress</span>
                  <span className="font-mono">12 min remaining</span>
                </div>
                <div className="h-2 w-full max-w-md rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full w-4/5" />
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="flex items-center self-start lg:self-center">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111318] px-6 py-3.5 text-xs font-bold text-white shadow-2xs transition-all hover:bg-stone-800 active:scale-98 dark:bg-white dark:text-[#111318]"
              >
                <span>CONTINUE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 03. YOUR JOURNEY / PROGRESS EXPERIENCE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#626873] dark:text-stone-400">
            Your Journey
          </h2>
          <button
            onClick={() => setCurrentTab('progress')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Detailed Analytics →
          </button>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-6">
          {/* Visual Scale: 5.5 ──────────────── 7.0 */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#111318] dark:text-white">
                  {currentOverall}
                </span>
                <span className="ml-2 text-[#626873] dark:text-stone-400 uppercase font-semibold">
                  Current Band
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {targetBand}
                </span>
                <span className="ml-2 text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                  Target Band
                </span>
              </div>
            </div>

            {/* Connecting progress line */}
            <div className="relative h-2.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* 4 Supporting Metrics: Improvement, Streak, Words, Time */}
          <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-6 dark:border-stone-800 sm:grid-cols-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                Recent Boost
              </span>
              <p className="mt-1 font-mono text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                +0.5 Band
              </p>
              <p className="text-[10px] text-[#626873] dark:text-stone-500">Lexical Resource</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                Active Streak
              </span>
              <p className="mt-1 font-mono text-base sm:text-lg font-bold text-[#111318] dark:text-white flex items-center gap-1">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                {userProfile.streakDays || 12} days
              </p>
              <p className="text-[10px] text-[#626873] dark:text-stone-500">Unbroken rhythm</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                Lexicon Vault
              </span>
              <p className="mt-1 font-mono text-base sm:text-lg font-bold text-[#111318] dark:text-white">
                {vocabulary.length || 342} words
              </p>
              <p className="text-[10px] text-[#626873] dark:text-stone-500">Spaced repetition</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                Practice Time
              </span>
              <p className="mt-1 font-mono text-base sm:text-lg font-bold text-[#111318] dark:text-white flex items-center gap-1">
                <Clock className="h-4 w-4 text-stone-400" />
                8h 42m
              </p>
              <p className="text-[10px] text-[#626873] dark:text-stone-500">Total sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. TODAY'S FOCUS (3 compact, distinct activities) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold tracking-wider uppercase text-[#626873] dark:text-stone-400">
          Today's Focus
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Focus 1: Vocabulary */}
          <div
            onClick={() => setCurrentTab('vocabulary')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="uppercase tracking-wider">Vocabulary</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] dark:bg-emerald-950/60">
                  Ready
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-[#111318] dark:text-white">
                12 words
              </p>
              <p className="mt-1 text-xs text-[#626873] dark:text-stone-400">
                Due for spaced repetition review today.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Start Review</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Focus 2: Listening */}
          <div
            onClick={() => setCurrentTab('listening')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <span className="uppercase tracking-wider">Listening</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] dark:bg-blue-950/60">
                  Section 2
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-[#111318] dark:text-white">
                18 min
              </p>
              <p className="mt-1 text-xs text-[#626873] dark:text-stone-400">
                Campus library orientation audio & note completion.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Launch Audio</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Focus 3: Writing */}
          <div
            onClick={() => setCurrentTab('writing')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                <span className="uppercase tracking-wider">Writing</span>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] dark:bg-purple-950/60">
                  Task 2
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-[#111318] dark:text-white">
                1 task
              </p>
              <p className="mt-1 text-xs text-[#626873] dark:text-stone-400">
                Environmental policy essay with Cambridge scoring.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Write Essay</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 05. IELTS SKILL MAP VISUALIZATION */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold tracking-wider uppercase text-[#626873] dark:text-stone-400">
          IELTS Skill Map
        </h2>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Listening */}
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
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(breakdown.listening / 9.0) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-[#626873] dark:text-stone-400">Target gap: -1.0</p>
            </div>

            {/* Reading */}
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
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(breakdown.reading / 9.0) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-[#626873] dark:text-stone-400">Target gap: -0.5</p>
            </div>

            {/* Writing */}
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
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(breakdown.writing / 9.0) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-[#626873] dark:text-stone-400">Target gap: -1.5</p>
            </div>

            {/* Speaking */}
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
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(breakdown.speaking / 9.0) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-[#626873] dark:text-stone-400">Target gap: -1.5</p>
            </div>
          </div>
        </div>
      </section>

      {/* 06. ACHIEVEMENTS SECTION (Refined, mature milestones) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold tracking-wider uppercase text-[#626873] dark:text-stone-400">
          Achievements & Milestones
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <span className="text-xl">🔥</span>
            <p className="mt-1 text-[11px] font-bold text-[#111318] dark:text-white">7 DAY STREAK</p>
            <p className="text-[9px] text-[#626873] dark:text-stone-500">Consistency</p>
          </div>

          <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <span className="text-xl">✍️</span>
            <p className="mt-1 text-[11px] font-bold text-[#111318] dark:text-white">FIRST ESSAY</p>
            <p className="text-[9px] text-[#626873] dark:text-stone-500">Cambridge Rubric</p>
          </div>

          <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <span className="text-xl">📚</span>
            <p className="mt-1 text-[11px] font-bold text-[#111318] dark:text-white">100 WORDS</p>
            <p className="text-[9px] text-[#626873] dark:text-stone-500">Lexicon Mastered</p>
          </div>

          <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <span className="text-xl">🎙️</span>
            <p className="mt-1 text-[11px] font-bold text-[#111318] dark:text-white">SPEAKING PRO</p>
            <p className="text-[9px] text-[#626873] dark:text-stone-500">Fluency Calibrated</p>
          </div>

          <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900 col-span-2 sm:col-span-1">
            <span className="text-xl">🎯</span>
            <p className="mt-1 text-[11px] font-bold text-[#111318] dark:text-white">READING 7.5+</p>
            <p className="text-[9px] text-[#626873] dark:text-stone-500">High Accuracy</p>
          </div>
        </div>
      </section>

      {/* Voice Companion Modal */}
      <NovaVoiceDialog isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
