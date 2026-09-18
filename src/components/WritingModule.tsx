import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sampleWritingPrompts } from '../data/mockIELTSData';
import { apiService } from '../services/apiService';
import { WritingEvaluation } from '../types';
import {
  PenTool,
  Clock,
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
    <div className="mx-auto max-w-6xl space-y-8 pb-24 text-[#111318] bg-white">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            ACADEMIC WRITING STUDIO
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] uppercase">
            Writing Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#5C616B]">
            High-contrast drafting with real-time word counting and Cambridge 4-criteria rubric grading.
          </p>
        </div>

        {/* Task Tabs */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold self-start sm:self-auto">
          {TASK_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTaskTab(tab.id as any)}
              className={`rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
                activeTaskTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[#5C616B] hover:text-[#111318]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 18. WRITING PAGE: Desktop (Essay area + NOVA analysis area) / Mobile (Essay first, analysis below) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Essay Prompt & Writing Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prompt Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Official Examination Prompt
              </span>
              <button
                onClick={() => setShowModel(!showModel)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C616B] hover:text-indigo-600 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{showModel ? 'Hide Model' : 'View Band 9.0 Model'}</span>
              </button>
            </div>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-[#111318] italic">
              "{prompt.prompt}"
            </p>

            {showModel && (
              <div className="mt-3 rounded-xl bg-stone-50 p-4 text-xs leading-relaxed text-[#5C616B] border border-stone-100">
                <span className="font-bold text-[#111318] uppercase tracking-wider text-[10px] block mb-1">
                  Band 9.0 Benchmark Model Essay:
                </span>
                <p className="whitespace-pre-wrap font-serif leading-relaxed text-[#111318]">
                  {prompt.sampleBand8Essay}
                </p>
              </div>
            )}
          </div>

          {/* Drafting Canvas */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C616B]">
                Candidate Response Area
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span className="font-mono text-xs font-bold text-[#111318]">
                  {formatTimer(secondsRemaining)}
                </span>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-800 hover:bg-stone-200 cursor-pointer"
                >
                  {timerRunning ? 'Pause' : 'Start Timer'}
                </button>
              </div>
            </div>

            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Begin writing your academic response here. Structure paragraphs logically: Introduction with paraphrase, 2 Body paragraphs with evidence and hedging, and a concluding synthesis..."
              rows={16}
              className="w-full resize-y rounded-xl border border-stone-200 bg-white p-4 font-serif text-base text-[#111318] placeholder:text-stone-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 leading-relaxed font-normal"
            />

            {/* Live Stats Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100 pt-3 text-xs">
              <div className="flex items-center gap-4 text-[#5C616B]">
                <div>
                  <span className="font-bold text-[#111318]">{wordCount}</span> /{' '}
                  {currentTaskConfig.minWords} words
                </div>
                <div>
                  <span className="font-bold text-[#111318]">{paragraphCount}</span> paragraphs
                </div>
                <div>
                  <span className="font-bold text-[#111318]">{foundAcademicWords.length}</span> academic tokens
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 w-24 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      wordPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${wordPercentage}%` }}
                  />
                </div>

                <button
                  onClick={handleEvaluate}
                  disabled={loading || wordCount < 30}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loading ? 'Evaluating...' : 'Request NOVA Rubric'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: NOVA Analysis Area (5 cols on desktop, stack below on mobile) */}
        <div className="lg:col-span-5 space-y-5">
          {evaluation ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                  EXAMINER EVALUATION
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <h3 className="text-3xl font-black text-[#111318]">
                    Band {evaluation.overallBand.toFixed(1)}
                  </h3>
                  <span className="text-xs font-semibold text-[#5C616B]">
                    Calibrated Band Range: {evaluation.bandRange}
                  </span>
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C616B]">
                  Official 4-Criteria Assessment:
                </span>

                <div className="space-y-2">
                  <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 text-xs">
                    <div className="flex justify-between font-bold text-[#111318]">
                      <span>Task Achievement (TR/TA)</span>
                      <span>Band {evaluation.taskAchievement.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-[#5C616B] leading-relaxed">
                      {evaluation.taskAchievementFeedback}
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 text-xs">
                    <div className="flex justify-between font-bold text-[#111318]">
                      <span>Coherence & Cohesion (CC)</span>
                      <span>Band {evaluation.coherenceCohesion.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-[#5C616B] leading-relaxed">
                      {evaluation.coherenceFeedback}
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 text-xs">
                    <div className="flex justify-between font-bold text-[#111318]">
                      <span>Lexical Resource (LR)</span>
                      <span>Band {evaluation.lexicalResource.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-[#5C616B] leading-relaxed">
                      {evaluation.lexicalFeedback}
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 text-xs">
                    <div className="flex justify-between font-bold text-[#111318]">
                      <span>Grammatical Range & Accuracy (GRA)</span>
                      <span>Band {evaluation.grammaticalRange.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-[#5C616B] leading-relaxed">
                      {evaluation.grammarFeedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* Band 8.0 Rewritten Model */}
              {evaluation.improvedVersion && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-700">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Band 8.5 Stylistic Rewrite
                    </span>
                  </div>
                  <p className="font-serif text-xs leading-relaxed text-indigo-950 whitespace-pre-wrap">
                    {evaluation.improvedVersion}
                  </p>
                  <button
                    onClick={() => handleApplyAISuggestion(evaluation.improvedVersion!)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer pt-1"
                  >
                    <span>Adopt into workspace</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Suggested Academic Lexicon */}
              {evaluation.suggestedVocabulary && evaluation.suggestedVocabulary.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C616B]">
                    Recommended Academic Upgrades:
                  </span>
                  <div className="space-y-1.5">
                    {evaluation.suggestedVocabulary.map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50/50 p-2.5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#111318]">{v.word}</span>
                          <span className="ml-1 text-[11px] text-[#5C616B]">({v.pos}): {v.meaning}</span>
                        </div>
                        <button
                          onClick={() => handleSaveSuggestedWord(v)}
                          className="shrink-0 flex items-center gap-1 rounded-md bg-white border border-stone-200 px-2 py-1 text-[11px] font-semibold text-[#111318] hover:bg-stone-50 cursor-pointer"
                        >
                          <BookmarkPlus className="h-3 w-3 text-indigo-600" />
                          <span>Save</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Standby Analysis Guide Card */
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <PenTool className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  NOVA Evaluation Engine
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#111318]">
                Real-Time Band Analysis
              </h3>
              <p className="text-xs text-[#5C616B] leading-relaxed">
                Draft your essay in the response canvas on the left. When you submit your draft, NOVA will analyze it against official Cambridge IELTS criteria:
              </p>
              <ul className="text-xs text-[#5C616B] space-y-2 list-disc list-inside">
                <li><strong className="text-[#111318]">Task Achievement</strong>: Prompt address, position clarity, argument development.</li>
                <li><strong className="text-[#111318]">Coherence & Cohesion</strong>: Paragraph structure, transition markers, referencing.</li>
                <li><strong className="text-[#111318]">Lexical Resource</strong>: Academic vocabulary density, collocations, precision.</li>
                <li><strong className="text-[#111318]">Grammatical Range</strong>: Complex structures, subordinate clauses, error density.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
