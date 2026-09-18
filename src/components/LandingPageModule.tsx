import React from 'react';
import { useApp } from '../context/AppContext';
import { NovaLogo, NovaSymbol } from './NovaLogo';
import { NovaOrb } from './NovaOrb';
import {
  ArrowRight,
  Mic,
  PenTool,
  Headphones,
  BookOpen,
  TrendingUp,
  Download,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Award,
  Zap,
} from 'lucide-react';

export const LandingPageModule: React.FC = () => {
  const { setCurrentTab, userProfile } = useApp();

  return (
    <div className="mx-auto max-w-6xl space-y-24 pb-28 text-[#111318] dark:text-[#F3F4F6]">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-20">
        {/* Soft atmospheric background accent */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-96 w-full -translate-x-1/2 max-w-4xl rounded-full bg-gradient-to-b from-indigo-50/70 via-purple-50/40 to-transparent blur-3xl dark:from-indigo-950/20 dark:via-purple-950/10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Bold Editorial Typography */}
          <div className="max-w-2xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-[#EEF2FF] px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span>IELTS NOVA AI • 2026 EDITION</span>
            </div>

            {/* Core Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#111318] dark:text-white uppercase leading-[1.05]">
              YOUR IELTS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 dark:from-indigo-400 dark:to-violet-400">
                JOURNEY,
              </span>
              <br />
              REIMAGINED.
            </h1>

            <p className="text-base sm:text-xl text-[#626873] dark:text-stone-300 leading-relaxed font-normal max-w-xl">
              An AI companion designed around the way you learn. Practice Speaking with real-time feedback, master Writing with official Cambridge rubrics, and achieve your target band.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-[#4338CA] hover:shadow-indigo-500/40 active:scale-98"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setCurrentTab('download')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white px-6 py-4 text-sm font-semibold text-[#111318] shadow-2xs transition-all hover:bg-stone-50 active:scale-98 dark:border-stone-800 dark:bg-stone-900 dark:text-white"
              >
                <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Download NOVA</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="flex items-center gap-6 pt-4 text-xs text-[#626873] dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Cambridge Rubric Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Target Band Calibration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Interactive NOVA AI Core Showcase */}
          <div className="relative flex flex-col items-center justify-center rounded-3xl border border-stone-200/80 bg-gradient-to-b from-white via-[#FAF9F5] to-white p-8 sm:p-12 shadow-xl shadow-stone-200/40 dark:border-stone-800 dark:from-stone-900 dark:via-stone-900/60 dark:to-stone-900 dark:shadow-none w-full max-w-md">
            <div className="absolute top-4 right-4 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              ONLINE
            </div>

            <NovaOrb
              size="hero"
              state="speaking"
              showLabel={false}
              message="Ready when you are. Let's work on your Speaking today."
            />

            {/* Quick interactive launcher pill */}
            <div className="mt-6 w-full space-y-2.5">
              <div className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white p-3 text-xs dark:border-stone-800 dark:bg-stone-850">
                <span className="text-[#626873] dark:text-stone-400">Candidate Goal</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Band {userProfile.targetBand}
                </span>
              </div>

              <button
                onClick={() => setCurrentTab('speaking')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111318] py-3 text-xs font-bold text-white transition-all hover:bg-stone-800 dark:bg-white dark:text-[#111318]"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Launch Speaking Session</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIVE CORE PILLARS OF IELTS NOVA */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Intelligent Preparation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] dark:text-white">
            Everything you need to reach Band 7.5+
          </h2>
          <p className="text-sm text-[#626873] dark:text-stone-400">
            Engineered with speech recognition, official rubric evaluators, and personal spaced repetition.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Pillar 1: AI Speaking */}
          <div
            onClick={() => setCurrentTab('speaking')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-5">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111318] dark:text-white group-hover:text-indigo-600 transition-colors">
              AI Speaking Examiner
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#626873] dark:text-stone-400">
              Simulated Part 1, 2, and 3 interviews with live voice prompts, speech-to-text transcription, and pronunciation diagnostics.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Start Speaking</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 2: AI Writing */}
          <div
            onClick={() => setCurrentTab('writing')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 mb-5">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111318] dark:text-white group-hover:text-purple-600 transition-colors">
              AI Writing Evaluation
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#626873] dark:text-stone-400">
              Instant four-criteria scoring: Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range with Band 8.0 rewrites.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Analyze Essay</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 3: Smart Vocabulary */}
          <div
            onClick={() => setCurrentTab('vocabulary')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-5">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111318] dark:text-white group-hover:text-emerald-600 transition-colors">
              Smart Lexicon Vault
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#626873] dark:text-stone-400">
              Spaced-repetition flashcards, topic-based academic collocations, and contextual vocabulary collected directly from reading passages.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Explore Vault</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 4: Listening & Reading */}
          <div
            onClick={() => setCurrentTab('listening')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-5">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111318] dark:text-white group-hover:text-blue-600 transition-colors">
              Audio & Reading Tests
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#626873] dark:text-stone-400">
              Authentic Cambridge scenarios with interactive audio players, synchronized transcripts, and paragraph analysis.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Practice Tests</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 5: Trajectory Analytics */}
          <div
            onClick={() => setCurrentTab('progress')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-7 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 sm:col-span-2 lg:col-span-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-5">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111318] dark:text-white group-hover:text-amber-600 transition-colors">
              Personal Trajectory Analytics
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#626873] dark:text-stone-400 max-w-xl">
              Real-time band tracking, breakdown across 4 sub-skills, daily practice velocity, and milestone achievement unlocked as you study.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>View Your Trajectory</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT PREVIEW MOCKUP */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/90 bg-[#FAF9F5] p-8 sm:p-12 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Cross-Platform Ecosystem
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#111318] dark:text-white">
              Take NOVA everywhere you learn.
            </h2>
            <p className="text-xs sm:text-sm text-[#626873] dark:text-stone-400 leading-relaxed">
              Available as a dedicated Android application (APK), iOS Safari Web App, desktop Progressive Web App, and in your browser with real-time cloud persistence.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('download')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#4338CA] transition-all"
              >
                <Smartphone className="h-4 w-4" />
                <span>Go to Download Center</span>
              </button>
            </div>
          </div>

          {/* Clean Editorial Device Mockup Card */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-md dark:border-stone-800 dark:bg-stone-850 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <NovaLogo size="sm" variant="compact" />
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                v2.4 Production
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#111318] dark:text-white">Speaking Part 2</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">Band 7.5</span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full w-4/5" />
              </div>
            </div>

            <p className="text-xs text-[#626873] dark:text-stone-400 italic">
              "Your lexical flexibility and response speed demonstrate clear progression towards Band 8.0."
            </p>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="text-center rounded-3xl bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] p-10 sm:p-16 text-white shadow-xl shadow-indigo-500/20 space-y-6">
        <NovaSymbol size={48} variant="white" className="mx-auto" />
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          Ready to achieve your target IELTS score?
        </h2>
        <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
          Start your personalized AI-guided preparation right now with IELTS NOVA AI.
        </p>
        <div>
          <button
            onClick={() => setCurrentTab('home')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#4F46E5] shadow-md transition-all hover:bg-indigo-50 active:scale-98"
          >
            <span>Enter Study Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
