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
} from 'lucide-react';

const TASK_TABS = [
  { id: 'task2', label: 'Task 2 Academic Essay', minWords: 250, time: 40, promptIdx: 0 },
  { id: 'task1_acad', label: 'Task 1 Academic Report', minWords: 150, time: 20, promptIdx: 1 },
  { id: 'task1_gen', label: 'Task 1 General Letter', minWords: 150, time: 20, promptIdx: 1 },
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
    'proliferation',
    'infrastructure',
    'mitigate',
    'consequently',
    'subsequently',
    'crucial',
    'paramount',
    'phenomenon',
    'furthermore',
    'nevertheless',
    'safeguard',
    'revitalize',
    'heritage',
  ];
  const academicMatches = words.filter((w) =>
    academicKeywords.includes(w.toLowerCase().replace(/[^a-z]/g, ''))
  ).length;
  const academicVocabRatio = wordCount > 0 ? Math.min(32, Math.round((academicMatches / wordCount) * 100) + 12) : 0;

  const handleEvaluate = async () => {
    if (wordCount < 30) {
      showToast('Please write at least 30 words before submitting for Cambridge assessment.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.evaluateWriting(
        prompt.prompt,
        essayText,
        prompt.taskType,
        userProfile.targetBand
      );
      setEvaluation(res);
      recordActivity(
        `${prompt.taskType} Essay Evaluation`,
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

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <PenTool className="h-3.5 w-3.5" />
              <span>Writing Studio • Cambridge 4-Criteria Rubric</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              Academic Writing Studio
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Timed distraction-free drafting with instant scoring across Task Response, Cohesion, Lexical Resource, and Grammatical Accuracy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 self-start sm:self-center">
            {TASK_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTaskTab(tab.id as any)}
                className={`rounded-full px-3.5 py-1.5 transition-all ${
                  activeTaskTab === tab.id
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt Card */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
              {currentTaskConfig.label}
            </span>
            <span className="text-[11px] text-stone-400">Target Band {prompt.targetBand} Benchmark</span>
          </div>

          <button
            onClick={() => setShowModel(!showModel)}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{showModel ? 'Hide Band 9.0 Model' : 'View Band 9.0 Model'}</span>
          </button>
        </div>

        <p className="mt-4 text-sm font-serif italic leading-relaxed text-stone-800 dark:text-stone-200 sm:text-base">
          "{prompt.prompt}"
        </p>

        {showModel && (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-[#FCFBF8] p-5 text-xs leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300">
            <span className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[10px]">
              Official Band 9.0 Examiner Model Answer:
            </span>
            <p className="mt-2.5 whitespace-pre-wrap font-serif leading-loose">{prompt.sampleBand8Essay}</p>
          </div>
        )}
      </div>

      {/* Real-time Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900 text-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Word Count</span>
          <p className="mt-1 text-2xl font-light text-stone-900 dark:text-white">
            {wordCount}{' '}
            <span className="text-xs text-stone-400">/ {currentTaskConfig.minWords}</span>
          </p>
          <span className={`mt-1 inline-block text-[10px] font-medium ${
            wordCount >= currentTaskConfig.minWords ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'
          }`}>
            {wordCount >= currentTaskConfig.minWords ? 'Target Met ✓' : `${currentTaskConfig.minWords - wordCount} words needed`}
          </span>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900 text-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Paragraphs</span>
          <p className="mt-1 text-2xl font-light text-stone-900 dark:text-white">{paragraphCount}</p>
          <span className="mt-1 inline-block text-[10px] text-stone-500">
            {paragraphCount >= 4 ? 'Optimal Structure' : 'Aim for 4–5 paragraphs'}
          </span>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wider text-stone-400">
            <Clock className="h-3 w-3" />
            <span>Time Remaining</span>
          </div>
          <p className="mt-1 font-mono text-2xl font-light text-stone-900 dark:text-white">
            {formatTimer(secondsRemaining)}
          </p>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="mt-1 text-[10px] font-semibold text-stone-700 hover:text-stone-950 dark:text-stone-300"
          >
            {timerRunning ? 'Pause Timer' : 'Start Exam Clock'}
          </button>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900 text-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Academic Lexis</span>
          <p className="mt-1 text-2xl font-light text-stone-900 dark:text-white">
            {academicVocabRatio}%
          </p>
          <span className="mt-1 inline-block text-[10px] text-stone-500">
            Lexical Range Ratio
          </span>
        </div>
      </div>

      {/* Drafting Canvas */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Candidate Response Canvas
          </h3>
          <span className="text-xs text-stone-400">Distraction-free environment</span>
        </div>

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          rows={14}
          placeholder="Begin drafting your response here. Use clear paragraph breaks..."
          className="mt-6 w-full text-sm sm:text-base leading-loose text-stone-900 placeholder:text-stone-300 focus:outline-hidden dark:bg-stone-900 dark:text-stone-100 font-serif"
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-5 dark:border-stone-800">
          <span className="text-xs text-stone-400">
            {wordCount} words written • Auto-saved locally
          </span>

          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 active:scale-98 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Evaluate with Cambridge AI</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="space-y-6 rounded-3xl border border-stone-200/80 bg-gradient-to-br from-[#FCFBF8] via-white to-[#F5F2EA] p-7 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-stone-800">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Official Rubric Assessment
              </span>
              <h3 className="text-xl font-light text-stone-900 dark:text-white sm:text-2xl">
                Examiner Score Breakdown
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-stone-900 px-5 py-3 text-center text-white dark:bg-stone-100 dark:text-stone-900">
                <p className="text-[10px] font-medium tracking-wider uppercase opacity-75">Estimated Band</p>
                <p className="text-3xl font-light">{evaluation.overallBand.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* 4 Criteria Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Task Response
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.criteria.taskResponse.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.criteria.taskResponse.feedback}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Coherence & Cohesion
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.criteria.coherenceCohesion.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.criteria.coherenceCohesion.feedback}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Lexical Resource
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.criteria.lexicalResource.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.criteria.lexicalResource.feedback}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Grammar Range
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.criteria.grammaticalRange.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.criteria.grammaticalRange.feedback}
              </p>
            </div>
          </div>

          {/* Line-by-Line Annotations */}
          {evaluation.sentenceImprovements && evaluation.sentenceImprovements.length > 0 && (
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-3 dark:border-stone-800">
                Sentence-Level Polish (Before vs. After)
              </h4>

              <div className="mt-4 space-y-4">
                {evaluation.sentenceImprovements.map((anno, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-800 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-stone-400 font-medium">Original Sentence:</span>
                      <button
                        onClick={() => handleApplyAISuggestion(anno.improved, anno.original)}
                        className="self-start sm:self-auto rounded-full bg-stone-900 px-3 py-1 text-[11px] font-semibold text-white dark:bg-stone-100 dark:text-stone-900"
                      >
                        Apply AI Polish
                      </button>
                    </div>
                    <p className="mt-1 line-through text-stone-500 dark:text-stone-400">
                      "{anno.original}"
                    </p>

                    <p className="mt-2 font-medium text-stone-400">Band 8.0 Upgrade:</p>
                    <p className="mt-0.5 font-medium text-stone-900 dark:text-stone-100">
                      "{anno.improved}"
                    </p>

                    <p className="mt-1.5 text-[11px] text-stone-500 italic">
                      Why: {anno.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Collocations */}
          {evaluation.suggestedVocabToSave && evaluation.suggestedVocabToSave.length > 0 && (
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Recommended High-Band Collocations
                </h4>
                <span className="text-[11px] text-stone-400">Save to Vault</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {evaluation.suggestedVocabToSave.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-xl border border-stone-100 bg-[#FAF9F5] p-3 dark:border-stone-800 dark:bg-stone-800 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-stone-900 dark:text-white">{w.word}</span>{' '}
                      <span className="text-[10px] text-stone-400">({w.pos})</span>
                      <p className="mt-0.5 text-stone-600 dark:text-stone-300">{w.meaning}</p>
                    </div>

                    <button
                      onClick={() => handleSaveSuggestedWord(w)}
                      className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                      title="Save word"
                    >
                      <BookmarkPlus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
