import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { systemIELTSVocabulary } from '../data/mockIELTSData';
import { NovaMasterGreetingButton } from './NovaMasterGreetingButton';
import { NovaVoiceDialog } from './NovaVoiceDialog';
import {
  ArrowRight,
  Volume2,
  BookmarkPlus,
  Play,
  CheckCircle2,
  Bot,
  Compass,
  Sparkles,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { userProfile, setCurrentTab, vocabulary, recentActivities, openWordLookup, showToast } =
    useApp();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const vocabOfTheDay =
    vocabulary.find((v) => v.word === 'substantial') || vocabulary[0] || systemIELTSVocabulary[0];

  const breakdownSum =
    userProfile.breakdown.listening +
    userProfile.breakdown.reading +
    userProfile.breakdown.writing +
    userProfile.breakdown.speaking;

  const isAssessed = userProfile.currentBand !== 'Not assessed' && breakdownSum > 0;
  const currentOverall = isAssessed ? (breakdownSum / 4).toFixed(1) : '5.5';
  const targetBandNum = parseFloat(userProfile.targetBand) || 7.0;
  const currentBandNum = parseFloat(currentOverall) || 5.5;
  const progressPct = Math.min(100, Math.round((currentBandNum / targetBandNum) * 100));

  const handlePronounce = (text: string) => {
    apiService.speakText(text, userProfile.preferredVariant);
    showToast(`Playing audio (${userProfile.preferredVariant})...`);
  };

  const handleSaveToVault = (word: typeof vocabOfTheDay) => {
    openWordLookup(word.word, word.exampleSentence);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-24 text-[#111111] dark:text-[#F3F4F6]">
      {/* 01. HEADER & TYPOGRAPHIC HIERARCHY */}
      <header className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <span>IELTS NOVA AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] dark:text-white">
          {getGreeting()}, {userProfile.name}
        </h1>
        <p className="text-base text-[#555555] dark:text-stone-400">
          Your personal learning journey • Calibrated for Band {userProfile.targetBand}
        </p>
      </header>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* 02. NOVA AI CORE INTERACTION */}
      <section aria-label="NOVA AI Assistant" className="py-2">
        <NovaMasterGreetingButton onOpenVoiceMode={() => setIsVoiceOpen(true)} />
      </section>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* 03. CONTINUE LEARNING (Editorial Clean Layout) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-[#111111] uppercase dark:text-stone-200">
            Continue learning
          </h2>
          <button
            onClick={() => setCurrentTab('learn')}
            className="text-xs font-medium text-[#555555] hover:text-[#111111] dark:text-stone-400 dark:hover:text-white transition-colors"
          >
            All modules →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Primary recommended active lesson */}
          <div
            onClick={() => setCurrentTab('speaking')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs transition-all hover:border-stone-300 hover:shadow-xs dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-center justify-between text-xs text-[#777777] dark:text-stone-400">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">Speaking</span>
              <span>Part 2 • 10 min</span>
            </div>
            <h3 className="mt-2.5 text-base font-bold text-[#111111] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Describe a technology that you use every day
            </h3>
            <p className="mt-1 text-xs text-[#555555] dark:text-stone-400 line-clamp-2">
              Practice cue card fluency, lexical flexibility, and grammar accuracy with AI examiner.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#111111] dark:text-stone-200">
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Secondary recommended writing task */}
          <div
            onClick={() => setCurrentTab('writing')}
            className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs transition-all hover:border-stone-300 hover:shadow-xs dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-center justify-between text-xs text-[#777777] dark:text-stone-400">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">Writing Task 2</span>
              <span>Academic • 40 min</span>
            </div>
            <h3 className="mt-2.5 text-base font-bold text-[#111111] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Global Climate Action & Government Responsibility
            </h3>
            <p className="mt-1 text-xs text-[#555555] dark:text-stone-400 line-clamp-2">
              Evaluate coherence, cohesion, and Band 8.0 grammatical range with real-time feedback.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#111111] dark:text-stone-200">
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* 04. TODAY'S FOCUS (Clean editorial metric row) */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight text-[#111111] uppercase dark:text-stone-200">
          Today's focus
        </h2>
        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="text-center sm:text-left">
            <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
              {vocabulary.length || 12}
            </span>
            <span className="mt-0.5 block text-xs text-[#555555] dark:text-stone-400">
              words reviewed
            </span>
          </div>
          <div className="border-x border-stone-100 dark:border-stone-800 px-4 text-center sm:text-left">
            <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
              {userProfile.dailyGoalMinutes || 18}
            </span>
            <span className="mt-0.5 block text-xs text-[#555555] dark:text-stone-400">
              min practiced
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
              {userProfile.completedActivities || 1}
            </span>
            <span className="mt-0.5 block text-xs text-[#555555] dark:text-stone-400">
              task completed
            </span>
          </div>
        </div>
      </section>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* 05. YOUR PROGRESS (Clean visualization) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-[#111111] uppercase dark:text-stone-200">
            Your progress
          </h2>
          <span className="text-xs font-medium text-[#777777] dark:text-stone-400">
            Current Band {currentOverall} → Goal {userProfile.targetBand}
          </span>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#111111] dark:text-white">
                {currentOverall}
              </span>
              <span className="text-xs text-[#555555] dark:text-stone-400">Current</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[#555555] dark:text-stone-400">Target</span>
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {userProfile.targetBand}
              </span>
            </div>
          </div>

          {/* Clean minimal progress line */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
            <div
              className="h-full rounded-full bg-[#111111] dark:bg-indigo-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#777777] dark:text-stone-400 pt-1">
            <span>Progress: {progressPct}% toward target</span>
            <button
              onClick={() => setCurrentTab('progress')}
              className="font-medium text-[#111111] hover:underline dark:text-stone-200"
            >
              Detailed analysis →
            </button>
          </div>
        </div>
      </section>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* 06. LEXICAL SPOTLIGHT (Word of the Day — Clean White Card) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-[#111111] uppercase dark:text-stone-200">
            Academic lexicon spotlight
          </h2>
          <button
            onClick={() => setCurrentTab('vocabulary')}
            className="text-xs font-medium text-[#555555] hover:text-[#111111] dark:text-stone-400 dark:hover:text-white"
          >
            200+ topics →
          </button>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-[#111111] dark:text-white">
                {vocabOfTheDay.word}
              </h3>
              <span className="text-xs text-[#777777] dark:text-stone-400 font-mono">
                {vocabOfTheDay.ipa}
              </span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-[#555555] dark:bg-stone-800 dark:text-stone-300">
                {vocabOfTheDay.partOfSpeech}
              </span>
            </div>
            <button
              onClick={() => handlePronounce(vocabOfTheDay.word)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-[#555555] hover:text-[#111111] hover:border-stone-300 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300 dark:hover:text-white transition-colors"
              title="Listen pronunciation"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-[#555555] dark:text-stone-300">
            {vocabOfTheDay.meaning}
          </p>

          <blockquote className="border-l-2 border-stone-200 pl-3 py-0.5 text-xs italic text-[#777777] dark:border-stone-700 dark:text-stone-400">
            "{vocabOfTheDay.exampleSentence}"
          </blockquote>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#777777] dark:text-stone-400">
              {vocabOfTheDay.ieltsRelevance || 'Band 7.5+ Writing & Speaking'}
            </span>
            <button
              onClick={() => handleSaveToVault(vocabOfTheDay)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Save to vocabulary vault</span>
            </button>
          </div>
        </div>
      </section>

      {/* Voice Companion Dialog */}
      <NovaVoiceDialog isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
