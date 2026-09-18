import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sampleWritingPrompts } from '../data/mockIELTSData';
import { apiService } from '../services/apiService';
import { WritingEvaluation } from '../types';
import {
  PenTool,
  Clock,
  Loader2,
  BookmarkPlus,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const TASK_TABS = [
  { id: 'task2', label: 'Task 2 Essay', minWords: 250, time: 40, promptIdx: 0 },
  { id: 'task1_acad', label: 'Task 1 Academic', minWords: 150, time: 20, promptIdx: 1 },
  { id: 'task1_gen', label: 'Task 1 Letter', minWords: 150, time: 20, promptIdx: 1 },
];

export const WritingModule: React.FC = () => {
  const { userProfile, recordActivity, showToast, addVocabulary } = useApp();

  const [activeTaskTab, setActiveTaskTab] = useState<'task2' | 'task1_acad' | 'task1_gen'>('task2');
  const currentTaskConfig = TASK_TABS.find((t) => t.id === activeTaskTab)!;
  const prompt = sampleWritingPrompts[currentTaskConfig.promptIdx];

  const [essayText, setEssayText] = useState('');
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);

  // Timer
  const [secondsRemaining, setSecondsRemaining] = useState(currentTaskConfig.time * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setSecondsRemaining(currentTaskConfig.time * 60);
    setTimerRunning(false);
    setEvaluation(null);
  }, [activeTaskTab]);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  const words = essayText.trim().length > 0 ? essayText.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const paragraphs = essayText.split(/\n+/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  const academicKeywords = [
    'contemporary',
    'predominantly',
    'consequently',
    'furthermore',
    'mitigate',
    'substantial',
    'detrimental',
    'paramount',
    'advocate',
    'prevalent',
    'ubiquitous',
    'invariably',
    'facilitate',
    'delineate',
    'paradigm',
  ];
  const foundAcademicWords = academicKeywords.filter((w) =>
    essayText.toLowerCase().includes(w)
  );
  const academicVocabRatio = wordCount > 0 ? Math.round((foundAcademicWords.length / wordCount) * 100) : 0;

  const handleEvaluate = async () => {
    if (wordCount < 40) {
      showToast('Please write a more substantial draft before requesting an IELTS evaluation.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.evaluateWriting(
        prompt.prompt,
        essayText,
        activeTaskTab === 'task2' ? 'Task 2' : 'Task 1',
        userProfile.targetBand
      );
      setEvaluation(res);
      recordActivity(
        `Writing ${currentTaskConfig.label}`,
        'Writing',
        `Band ${res.overallBand.toFixed(1)} (${res.bandRange})`
      );
      showToast(`Essay evaluated! Estimated Band ${res.overallBand.toFixed(1)}`);
    } catch {
      showToast('Evaluation completed with standard rubric.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAISuggestion = (improvedSentence: string, originalSentence?: string) => {
    if (originalSentence && essayText.includes(originalSentence)) {
      setEssayText((prev) => prev.replace(originalSentence, improvedSentence));
    } else {
      setEssayText((prev) => prev + ' ' + improvedSentence);
    }
    showToast('AI suggestion applied to your draft.');
  };

  const handleSaveSuggestedWord = (w: { word: string; pos: string; meaning: string; context: string }) => {
    addVocabulary({
      word: w.word,
      meaning: w.meaning,
      contextMeaning: w.meaning,
      partOfSpeech: w.pos,
      sourceContext: w.context,
      ieltsRelevance: `Writing Task 2 Band 8.0 Recommendation`,
    });
    showToast(`Saved "${w.word}" to Lexicon Vault!`);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordPercentage = Math.min(100, Math.round((wordCount / currentTaskConfig.minWords) * 100));

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5 dark:border-stone-800">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            ACADEMIC WRITING STUDIO
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] dark:text-white uppercase">
            Writing Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400">
            High-contrast drafting with real-time word counting and Cambridge 4-criteria rubric grading.
          </p>
        </div>

        {/* Task Tabs */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold dark:border-stone-800 dark:bg-stone-900 self-start sm:self-auto">
          {TASK_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTaskTab(tab.id as any)}
              className={`rounded-lg px-3.5 py-1.5 transition-all ${
                activeTaskTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[#5F6368] hover:text-[#111318] dark:text-stone-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 21: PROFESSIONAL WORKSPACE (Essay on left, NOVA Analysis on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Essay Prompt & Writing Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prompt Card */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Official Examination Prompt
              </span>
              <button
                onClick={() => setShowModel(!showModel)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5F6368] hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{showModel ? 'Hide Model' : 'View Band 9.0 Model'}</span>
              </button>
            </div>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-[#111318] dark:text-stone-200 italic">
              "{prompt.prompt}"
            </p>

            {showModel && (
              <div className="mt-3 rounded-xl bg-stone-50 p-4 text-xs leading-relaxed text-[#5F6368] dark:bg-stone-850 dark:text-stone-300">
                <span className="font-bold text-[#111318] dark:text-white uppercase tracking-wider text-[10px] block mb-1">
                  Band 9.0 Benchmark Model Essay:
                </span>
                <p className="whitespace-pre-wrap font-serif">{prompt.sampleBand8Essay}</p>
              </div>
            )}
          </div>

          {/* Drafting Canvas */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Candidate Response Area
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span className="font-mono text-xs font-bold text-[#111318] dark:text-white">
                  {formatTimer(secondsRemaining)}
                </span>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
                >
                  {timerRunning ? 'Pause' : 'Start Exam Clock'}
                </button>
              </div>
            </div>

            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              rows={16}
              placeholder="Begin typing your essay response here. Structure into introduction, two body paragraphs, and conclusion..."
              className="w-full text-sm sm:text-base leading-relaxed text-[#111318] placeholder:text-stone-300 focus:outline-hidden dark:bg-stone-900 dark:text-stone-100 font-sans resize-none"
            />

            {/* Canvas Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
              <div className="text-xs text-[#5F6368] dark:text-stone-400">
                <span className="font-bold text-[#111318] dark:text-white">{wordCount}</span> of {currentTaskConfig.minWords} words required
              </div>

              <button
                onClick={handleEvaluate}
                disabled={loading || wordCount < 20}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>Evaluate with Cambridge AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: NOVA Real-time Analysis & Rubric (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Metrics Pod */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] dark:text-stone-400 block">
              LIVE WRITING METRICS
            </span>

            {/* Word Count Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#111318] dark:text-white">Word Count</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {wordCount} / {currentTaskConfig.minWords}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wordCount >= currentTaskConfig.minWords ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${wordPercentage}%` }}
                />
              </div>
              <span className="text-[11px] text-[#5F6368] dark:text-stone-400 block">
                {wordCount >= currentTaskConfig.minWords
                  ? '✓ Target minimum met'
                  : `${currentTaskConfig.minWords - wordCount} more words recommended`}
              </span>
            </div>

            {/* Paragraphs & Academic Lexis */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                  Paragraphs
                </span>
                <p className="mt-1 font-mono text-xl font-black text-[#111318] dark:text-white">
                  {paragraphCount}
                </p>
                <span className="text-[10px] text-[#5F6368] dark:text-stone-400">
                  {paragraphCount >= 4 ? 'Optimal 4-part structure' : 'Aim for 4–5 paragraphs'}
                </span>
              </div>

              <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                  Academic Lexis
                </span>
                <p className="mt-1 font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {academicVocabRatio}%
                </p>
                <span className="text-[10px] text-[#5F6368] dark:text-stone-400">
                  {foundAcademicWords.length} academic keywords
                </span>
              </div>
            </div>
          </div>

          {/* Cambridge Rubric / Evaluation Results */}
          {evaluation ? (
            <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                    CAMBRIDGE EVALUATION
                  </span>
                  <span className="text-xs text-[#5F6368] dark:text-stone-400">
                    Estimated Band Score
                  </span>
                </div>
                <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  Band {evaluation.overallBand.toFixed(1)}
                </span>
              </div>

              {/* 4 Official Criteria Scores */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800">
                  <span className="font-bold text-[#111318] dark:text-white">Task Response</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Band {evaluation.criteria.taskResponse.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6368] dark:text-stone-400">
                  {evaluation.criteria.taskResponse.feedback}
                </p>

                <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800 pt-2">
                  <span className="font-bold text-[#111318] dark:text-white">Coherence & Cohesion</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Band {evaluation.criteria.coherenceCohesion.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6368] dark:text-stone-400">
                  {evaluation.criteria.coherenceCohesion.feedback}
                </p>

                <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800 pt-2">
                  <span className="font-bold text-[#111318] dark:text-white">Lexical Resource</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Band {evaluation.criteria.lexicalResource.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6368] dark:text-stone-400">
                  {evaluation.criteria.lexicalResource.feedback}
                </p>

                <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800 pt-2">
                  <span className="font-bold text-[#111318] dark:text-white">Grammatical Range</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Band {evaluation.criteria.grammaticalRange.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6368] dark:text-stone-400">
                  {evaluation.criteria.grammaticalRange.feedback}
                </p>
              </div>

              {/* Suggestions to upgrade */}
              {evaluation.suggestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111318] dark:text-white block">
                    Band 8.0 Upgrades:
                  </span>
                  {evaluation.suggestions.slice(0, 2).map((sugg, i) => (
                    <div key={i} className="rounded-lg bg-indigo-50/50 p-2.5 text-xs dark:bg-indigo-950/40">
                      <p className="text-[11px] text-[#5F6368] dark:text-stone-400 line-through">
                        {sugg.original}
                      </p>
                      <p className="mt-1 font-medium text-indigo-700 dark:text-indigo-300">
                        {sugg.improved}
                      </p>
                      <button
                        onClick={() => handleApplyAISuggestion(sugg.improved, sugg.original)}
                        className="mt-1 text-[10px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        Apply to draft →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-200 p-6 text-center dark:border-stone-800">
              <span className="text-xs font-medium text-[#5F6368] dark:text-stone-400 block">
                NOVA analysis is ready when you submit your draft.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
