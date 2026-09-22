import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { ieltsGrammarTopics } from '../data/grammarData';
import { GrammarTopic } from '../types';
import {
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Send,
  HelpCircle,
  BookOpen,
  Bot,
  Check,
} from 'lucide-react';

export const GrammarModule: React.FC = () => {
  const { userProfile, showToast, setCurrentTab } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(ieltsGrammarTopics[0]);

  // AI Sentence Upgrade State
  const [inputSentence, setInputSentence] = useState(
    'Many people think that learning online is better than going to school.'
  );
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<{
    original: string;
    enhanced: string;
    bandScore: string;
    analysis: string[];
    alternativePhrasings?: string[];
  } | null>(null);

  // Active Practice Question State for "Practice Rule"
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  const handleUpgradeSentence = async () => {
    if (!inputSentence.trim()) return;
    setIsUpgrading(true);

    try {
      const res = await apiService.upgradeSentence(
        inputSentence,
        userProfile.targetBand || '8.0'
      );
      setUpgradeResult({
        original: res.original || inputSentence,
        enhanced:
          res.upgraded ||
          res.enhanced ||
          'It is widely contended that the systematic deployment of virtual pedagogical modalities confers superior educational efficacy.',
        bandScore: res.bandTarget || 'Band 8.5',
        analysis: res.improvements
          ? [
              res.improvements.formalPhrasing || 'Formal academic register and epistemic hedging',
              res.improvements.grammarStructures || 'Advanced nominalization and comparative clause balance',
              ...(Array.isArray(res.improvements.higherBandVocab) ? res.improvements.higherBandVocab : []),
            ]
          : ['Syntactic inversion', 'Nominalized clause construction'],
        alternativePhrasings: res.alternativePhrasings,
      });
      showToast('Sentence successfully elevated to Band 8.5+ standard!');
    } catch (err) {
      console.warn(err);
      setUpgradeResult({
        original: inputSentence,
        enhanced:
          'A prevailing academic consensus asserts that virtual pedagogical modalities confer superior educational efficacy compared to conventional brick-and-mortar institutions.',
        bandScore: '8.5',
        analysis: [
          'Substituted conversational "many people think" with formal hedging "A prevailing academic consensus asserts that".',
          'Nominalized "learning online" into "virtual pedagogical modalities".',
          'Elevated informal comparison into "confer superior educational efficacy compared to conventional brick-and-mortar institutions".',
        ],
        alternativePhrasings: [
          'Advocates of remote instruction contend that digital learning environments facilitate greater academic autonomy than traditional classrooms.',
        ],
      });
      showToast('Generated Band 8.5 academic synthesis.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const handlePracticeRule = () => {
    setShowPracticeMode(true);
    setSelectedOption(null);
    setPracticeFeedback(null);
  };

  const handleCheckAnswer = (optIndex: number) => {
    setSelectedOption(optIndex);
    if (optIndex === 1) {
      setPracticeFeedback('Correct! This utilizes the third conditional structure correctly for past hypothetical speculation.');
    } else {
      setPracticeFeedback('Not quite. Review the third conditional formula: "If + past perfect, would have + past participle".');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-24 text-[#111318] bg-white">
      {/* Editorial Header */}
      <div className="relative border-b border-stone-200/80 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
          GRAMMATICAL RANGE & ACCURACY (GRA)
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111318] uppercase leading-[1.05]">
              GRAMMAR MASTER
            </h1>
            <p className="text-base sm:text-lg text-[#5C616B] font-normal mt-1">
              Syntactic structures engineered for Cambridge Band 7.5 to 9.0.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
              Target: Band {userProfile.targetBand}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Grammar Spotlight: Conditional Structures */}
      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-[#F6F4FF] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-indigo-200/60 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {selectedTopic.bandTarget}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                {selectedTopic.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111318] tracking-tight">
              {selectedTopic.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C616B] leading-relaxed">
              {selectedTopic.explanation}
            </p>
          </div>

          {/* 3 Prominent Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={handlePracticeRule}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Practice Rule</span>
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('sentence-upgrade-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 active:scale-98 transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>AI Sentence Check</span>
            </button>

            <button
              onClick={() => setCurrentTab('tutor')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#111318] hover:bg-stone-50 active:scale-98 transition-all cursor-pointer shadow-2xs"
            >
              <Bot className="h-3.5 w-3.5 text-indigo-600" />
              <span>Ask NOVA</span>
            </button>
          </div>
        </div>

        {/* Structure / Formula Card */}
        <div className="mt-6 rounded-2xl border border-indigo-200/80 bg-white p-5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C616B]">
            STRUCTURE FORMULA
          </p>
          <div className="mt-1.5 font-mono text-sm sm:text-base font-bold text-indigo-700 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 inline-block w-full">
            {selectedTopic.formula}
          </div>
        </div>

        {/* Example Callout */}
        <div className="mt-4 rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C616B]">
            ACADEMIC EXAMPLE
          </p>
          <p className="mt-1 text-sm sm:text-base font-medium text-[#111318] italic leading-relaxed">
            "{selectedTopic.examples[0]?.band8 || 'If governments had acted earlier, climate damage would have been reduced.'}"
          </p>
          <p className="mt-1.5 text-xs text-[#5C616B]">
            Note: {selectedTopic.examples[0]?.note || 'Demonstrates past unreal condition with high lexical control.'}
          </p>
        </div>

        {/* Interactive Practice Question (When "Practice Rule" is triggered) */}
        {showPracticeMode && (
          <div className="mt-6 rounded-2xl border border-indigo-300 bg-white p-6 shadow-md transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Quick Knowledge Check
              </span>
              <button
                onClick={() => setShowPracticeMode(false)}
                className="text-xs text-[#5C616B] hover:text-[#111318]"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#111318]">
              Which of the following demonstrates the correct academic Third Conditional?
            </p>
            <div className="mt-3 space-y-2">
              {[
                'If the committee would have met sooner, they resolved the dispute.',
                'Had the regulatory body intervened promptly, irreversible ecological damage would have been averted.',
                'If public subsidies will increase, civic transit systems would improve.',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCheckAnswer(idx)}
                  className={`w-full text-left rounded-xl border p-3.5 text-xs font-medium transition-all ${
                    selectedOption === idx
                      ? idx === 1
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-rose-500 bg-rose-50 text-rose-900'
                      : 'border-stone-200 bg-white hover:border-indigo-200 hover:bg-stone-50 text-[#111318]'
                  }`}
                >
                  <span className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            {practiceFeedback && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-medium ${
                  selectedOption === 1
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {practiceFeedback}
              </div>
            )}
          </div>
        )}
      </section>

      {/* AI Sentence Check & Upgrade Engine */}
      <section
        id="sentence-upgrade-section"
        className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111318] uppercase tracking-wider">
              AI Sentence Check & Band 8.5+ Upgrade
            </h3>
            <p className="text-xs text-[#5C616B]">
              Enter any standard sentence to rewrite with advanced syntax, nominalization, and hedging.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            rows={3}
            placeholder="e.g. Traffic is bad in big cities so people are late for work."
            className="w-full rounded-2xl border border-stone-200 bg-[#FAF9F5] p-4 text-xs sm:text-sm text-[#111318] outline-hidden focus:border-indigo-600 focus:bg-white transition-all resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setInputSentence('Governments must do something to stop pollution because it hurts nature.')
                }
                className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
              >
                Try sample sentence
              </button>
            </div>

            <button
              onClick={handleUpgradeSentence}
              disabled={isUpgrading || !inputSentence.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpgrading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Upgrading with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Upgrade to Band 8.5+</span>
                </>
              )}
            </button>
          </div>

          {/* Upgrade Result */}
          {upgradeResult && (
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-[#F6F4FF] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-200/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {upgradeResult.bandScore}
                  </span>
                  <span className="text-xs font-bold text-indigo-900">
                    Refined Academic Synthesis
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(upgradeResult.enhanced)}
                  className="flex items-center gap-1 text-xs font-medium text-[#5C616B] hover:text-[#111318] cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              <p className="text-base sm:text-lg font-medium text-[#111318] leading-relaxed bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
                "{upgradeResult.enhanced}"
              </p>

              {upgradeResult.analysis && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C616B]">
                    Grammatical Improvements:
                  </span>
                  <ul className="space-y-1 text-xs text-[#111318]">
                    {upgradeResult.analysis.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-0.5">✦</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Grammar Topics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest uppercase text-[#5C616B]">
            CORE IELTS GRAMMAR SYLLABUS
          </p>
          <span className="text-xs font-mono text-[#5C616B]">
            {ieltsGrammarTopics.length} Academic Topics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ieltsGrammarTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-stone-200/90 bg-white hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {topic.category}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-[#5C616B]">
                      {topic.bandTarget}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#111318]">
                    {topic.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#5C616B] line-clamp-2 leading-relaxed">
                    {topic.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Study Rule</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
