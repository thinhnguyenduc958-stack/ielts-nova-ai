import React, { useState, useEffect } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { NovaOrb } from './NovaOrb';
import { NovaVoiceDialog } from './NovaVoiceDialog';
import {
  ArrowRight,
  Mic,
  Sparkles,
  ChevronRight,
  Volume2,
} from 'lucide-react';
import { NovaState } from '../types';
import { motion } from 'motion/react';

const DAILY_MESSAGES = [
  'Ready when you are.',
  "Let's work on Speaking today.",
  'Your Writing improved this week.',
  "You've learned 42 new words.",
  'Target Band 7.0 is within your reach.',
  'Focus on lexical variety in Task 2.',
];

export const HomeDashboard: React.FC = () => {
  const { userProfile, setCurrentTab } = useApp();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [orbState, setOrbState] = useState<NovaState>('idle');
  const [messageIndex, setMessageIndex] = useState(0);

  // Periodic message rotation
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

  const handleActionSelect = (act: string) => {
    setCurrentTab(act as AppTab);
  };

  const candidateName = userProfile.name ? userProfile.name.toUpperCase() : 'THỊNH';

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-24 text-[#111318] bg-white">
      {/* 8. HOME HERO: Sophisticated Editorial Composition (~50% viewport) */}
      <section className="relative pt-3 pb-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          {/* Left Column: Editorial Typography */}
          <div className="max-w-xl space-y-4">
            <p className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase">
              GOOD MORNING, {candidateName}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111318] uppercase leading-[1.04]">
              YOUR IELTS
              <br />
              JOURNEY,
              <br />
              <span className="text-indigo-600">
                REIMAGINED.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C616B] font-normal max-w-md leading-relaxed">
              An intelligent AI companion designed around the way you learn.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-indigo-600/15 transition-all hover:bg-indigo-700 active:scale-98 cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsVoiceOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-xs font-semibold text-[#111318] shadow-2xs transition-all hover:bg-stone-50 active:scale-98 cursor-pointer"
              >
                <Mic className="h-4 w-4 text-indigo-600" />
                <span>Talk to NOVA</span>
              </button>
            </div>
          </div>

          {/* Right Column: Signature NOVA AI Core on White Circular Pedestal */}
          <div className="relative flex flex-col items-center justify-center self-center lg:self-auto rounded-3xl border border-indigo-100/80 bg-white p-6 sm:p-8 shadow-[0_12px_40px_-15px_rgba(79,70,229,0.08)] w-full lg:w-auto min-w-[280px] sm:min-w-[320px]">
            <NovaOrb
              size="hero"
              state={orbState}
              interactivePanel={true}
              onActionSelect={handleActionSelect}
            />

            {/* Dynamic Companion Prompt */}
            <div className="mt-4 flex flex-col items-center text-center">
              <p className="text-xs font-medium text-[#111318] transition-opacity duration-300">
                "{DAILY_MESSAGES[messageIndex]}"
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-[#5C616B] uppercase">
                  TAP CORE FOR ACTIONS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CONTINUE LEARNING: Large Editorial Section on #F5F3FF */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest uppercase text-[#5C616B]">
            CONTINUE LEARNING
          </p>
          <span className="text-xs text-[#5C616B] font-mono">
            12 MINUTES REMAINING
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-[#F5F3FF] p-6 sm:p-8 shadow-xs">
          {/* Subtle Decorative Waveform Illustration */}
          <div className="absolute right-6 top-6 opacity-20 pointer-events-none hidden sm:flex items-center gap-1">
            {[18, 36, 24, 48, 20, 40, 28, 52, 16, 32].map((h, i) => (
              <span key={i} className="w-1.5 rounded-full bg-indigo-600" style={{ height: `${h}px` }} />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                  <Volume2 className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold tracking-wider text-indigo-700 uppercase">
                  SPEAKING · PART 2
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111318] tracking-tight leading-snug">
                Describe a technology you use every day.
              </h2>

              <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
                You will have 1 minute to prepare notes and 2 minutes to present. NOVA analyzes your fluency, lexical resource, and grammatical accuracy in real-time.
              </p>

              {/* Progress Visualization */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-[11px] font-semibold text-[#5C616B] mb-1">
                  <span>Part 2 Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-indigo-200/60 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-3/4" />
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <div className="flex items-center self-start lg:self-center">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. TODAY: Horizontal Editorial Statistics Section */}
      <section className="space-y-4">
        <p className="text-xs font-bold tracking-widest uppercase text-[#5C616B]">
          TODAY
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1 border-t border-b border-stone-200/80 py-6">
          {/* Stat 1: 12 Words learned */}
          <div
            onClick={() => setCurrentTab('vocabulary')}
            className="group cursor-pointer border-b sm:border-b-0 sm:border-r border-stone-200/80 pb-5 sm:pb-0 sm:pr-6 transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111318]">
                12
              </span>
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#111318]">
              Words learned
            </p>
            <p className="mt-1 text-xs text-[#5C616B]">
              Spaced repetition review completed for Academic Word List.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:underline">
              Open Vault <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          {/* Stat 2: 18m Practice */}
          <div
            onClick={() => setCurrentTab('listening')}
            className="group cursor-pointer border-b sm:border-b-0 sm:border-r border-stone-200/80 pb-5 sm:pb-0 sm:pr-6 transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111318]">
                18<span className="text-2xl font-bold">m</span>
              </span>
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#111318]">
              Practice
            </p>
            <p className="mt-1 text-xs text-[#5C616B]">
              Campus library audio comprehension and map labeling.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:underline">
              Audio Drills <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          {/* Stat 3: 01 Task completed */}
          <div
            onClick={() => setCurrentTab('writing')}
            className="group cursor-pointer transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111318]">
                01
              </span>
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#111318]">
              Task completed
            </p>
            <p className="mt-1 text-xs text-[#5C616B]">
              Task 2 environmental policy essay evaluated by AI examiner.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:underline">
              Writing Studio <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* 13. SKILL PROGRESS: Premium Horizontal Progress Bars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest uppercase text-[#5C616B]">
            SKILL PROGRESS
          </p>
          <span className="text-xs text-[#5C616B] font-mono">
            Scale: 9.0 Band
          </span>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {/* Listening 6.0 */}
            <div
              onClick={() => setCurrentTab('listening')}
              className="cursor-pointer space-y-2 p-2 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-wider text-[#111318]">LISTENING</span>
                <span className="font-mono text-base font-bold text-indigo-600">
                  {breakdown.listening.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.listening / 9.0) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5C616B]">
                <span>Speed & distractor recognition</span>
                <span>Target: {targetBand}</span>
              </div>
            </div>

            {/* Reading 6.5 */}
            <div
              onClick={() => setCurrentTab('reading')}
              className="cursor-pointer space-y-2 p-2 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-wider text-[#111318]">READING</span>
                <span className="font-mono text-base font-bold text-indigo-600">
                  {breakdown.reading.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.reading / 9.0) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5C616B]">
                <span>True/False/Not Given scanning</span>
                <span>Target: {targetBand}</span>
              </div>
            </div>

            {/* Writing 5.5 */}
            <div
              onClick={() => setCurrentTab('writing')}
              className="cursor-pointer space-y-2 p-2 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-wider text-[#111318]">WRITING</span>
                <span className="font-mono text-base font-bold text-indigo-600">
                  {breakdown.writing.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.writing / 9.0) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5C616B]">
                <span>Coherence & task achievement</span>
                <span>Target: {targetBand}</span>
              </div>
            </div>

            {/* Speaking 5.5 */}
            <div
              onClick={() => setCurrentTab('speaking')}
              className="cursor-pointer space-y-2 p-2 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-wider text-[#111318]">SPEAKING</span>
                <span className="font-mono text-base font-bold text-indigo-600">
                  {breakdown.speaking.toFixed(1)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(breakdown.speaking / 9.0) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5C616B]">
                <span>Fluency & pronunciation markers</span>
                <span>Target: {targetBand}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. NOVA'S INSIGHT: Visually distinctive section on a subtle tinted surface */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-[#F8FAFC] p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-indigo-600">
              NOVA'S INSIGHT
            </h3>
            <p className="text-sm sm:text-base font-medium text-[#111318] leading-relaxed">
              "Your vocabulary usage has improved this week. Your next opportunity is Speaking fluency."
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('speaking')}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <span>Practice Speaking</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trajectory Banner */}
      <section className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C616B]">Current Band:</span>
            <span className="font-mono text-lg font-black text-[#111318]">{currentOverall}</span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Target Band:</span>
            <span className="font-mono text-lg font-black text-indigo-600">{targetBand}</span>
          </div>
          <p className="text-xs text-[#5C616B]">
            Estimated timeline: 4 weeks of daily focused practice to reach Band {targetBand}.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('progress')}
          className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-[#111318] hover:bg-stone-50 transition-colors cursor-pointer"
        >
          View Full Trajectory →
        </button>
      </section>

      {/* Voice Companion Modal */}
      <NovaVoiceDialog isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
