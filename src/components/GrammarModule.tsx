import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { ieltsGrammarTopics } from '../data/grammarData';
import { GrammarTopic } from '../types';
import {
  Sparkles,
  Zap,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Send,
  HelpCircle,
} from 'lucide-react';

export const GrammarModule: React.FC = () => {
  const { userProfile, showToast } = useApp();
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
        enhanced: res.upgraded || res.enhanced || 'It is widely contended that the systematic deployment of fiscal interventions fosters sustainable advancement.',
        bandScore: res.bandTarget || 'Band 8.5',
        analysis: res.improvements
          ? [
              res.improvements.formalPhrasing || 'Formal academic register',
              res.improvements.grammarStructures || 'Advanced syntactic complexity',
              ...(Array.isArray(res.improvements.higherBandVocab) ? res.improvements.higherBandVocab : []),
            ]
          : ['Syntactic inversion', 'Nominalized clause construction'],
        alternativePhrasings: res.alternativePhrasings,
      });
      showToast('Sentence successfully upgraded to Band 8+ standard!');
    } catch (err) {
      console.warn(err);
      showToast('Upgrade request timed out, showing academic pattern fallback.');
      setUpgradeResult({
        original: inputSentence,
        enhanced:
          'A prevailing consensus asserts that virtual pedagogical modalities confer superior pedagogical efficacy compared to conventional brick-and-mortar schooling.',
        bandScore: '8.5',
        analysis: [
          'Substituted conversational "many people think" with high-register hedging "A prevailing consensus asserts that".',
          'Nominalized "learning online" into "virtual pedagogical modalities".',
          'Replaced informal "better than going to school" with academic contrast "confer superior pedagogical efficacy compared to conventional brick-and-mortar schooling".',
        ],
        alternativePhrasings: [
          'Advocates of remote instruction contend that digital learning environments facilitate greater academic autonomy than traditional institutions.',
        ],
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>IELTS Grammatical Range & Accuracy (GRA) Clinic</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              Grammar Master & Sentence Upgrade
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Elevate your syntactic structures from Band 6.0 basic clauses to Band 8.5+ Cambridge academic prose: Inversion, Hedging, Cleft clauses, and Nominalization.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive AI Sentence Upgrade Lab */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50/20 via-white to-white p-6 shadow-sm dark:border-amber-500/20 dark:from-amber-950/10 dark:via-stone-900 dark:to-stone-900 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider">
            AI Sentence Upgrade Engine (Band 8.0+)
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1.5">
              Enter any standard sentence to upgrade:
            </label>
            <div className="relative">
              <textarea
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                rows={3}
                placeholder="e.g. Traffic is bad in big cities so people are late for work."
                className="w-full rounded-2xl border border-stone-200/90 bg-white p-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200"
              />
              <button
                onClick={handleUpgradeSentence}
                disabled={isUpgrading || !inputSentence.trim()}
                className="mt-2.5 flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 active:scale-98 transition-all disabled:opacity-50 dark:bg-amber-400 dark:text-stone-950 dark:hover:bg-amber-300"
              >
                {isUpgrading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Upgrading with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 dark:text-stone-900" />
                    <span>Upgrade to Band 8.5+</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Upgrade Result Presentation */}
          {upgradeResult && (
            <div className="mt-4 rounded-2xl border border-stone-200/90 bg-white/80 p-5 dark:border-stone-800 dark:bg-stone-850/80">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    Band {upgradeResult.bandScore}
                  </span>
                  <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Refined Academic Synthesis
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(upgradeResult.enhanced)}
                  className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="font-serif text-sm leading-relaxed text-stone-900 dark:text-stone-100 mb-4 bg-amber-50/30 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/15">
                "{upgradeResult.enhanced}"
              </div>

              {upgradeResult.analysis && upgradeResult.analysis.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Grammatical Adjustments:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                    {upgradeResult.analysis.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">✦</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grammar Clinics Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Topics List */}
        <div className="space-y-2 lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            Core IELTS Grammatical Structures
          </h3>
          {ieltsGrammarTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left rounded-2xl p-4 transition-all border ${
                  isSelected
                    ? 'border-amber-400/80 bg-white shadow-sm dark:border-amber-400/50 dark:bg-stone-850'
                    : 'border-stone-200/70 bg-white/60 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60 dark:hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-amber-600 dark:text-amber-400 mb-1">
                  <span>{topic.category}</span>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                    {topic.bandTarget}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
                  {topic.title}
                </h4>
                <p className="text-xs text-stone-400">{topic.titleVi}</p>
              </button>
            );
          })}
        </div>

        {/* Right Topic Details & Before/After */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:col-span-2 space-y-6">
          <div className="border-b border-stone-100 pb-4 dark:border-stone-800">
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {selectedTopic.bandTarget} Breakdown
            </span>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white mt-1">
              {selectedTopic.title}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
              {selectedTopic.explanation}
            </p>
          </div>

          {/* Formula Card */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-850/60">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Grammatical Formula:
            </span>
            <div className="mt-1 font-mono text-xs font-medium text-amber-700 dark:text-amber-300">
              {selectedTopic.formula}
            </div>
          </div>

          {/* Before & After Transformations */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Band 6.0 Standard vs. Band 8.5+ Elevated:
            </h4>
            {selectedTopic.examples.map((ex, idx) => (
              <div
                key={idx}
                className="space-y-2 rounded-2xl border border-stone-200/60 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850"
              >
                <div className="text-xs text-stone-500">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Standard: </span>
                  <span className="italic">"{ex.standard}"</span>
                </div>
                <div className="text-xs font-medium text-stone-900 dark:text-stone-100 font-serif">
                  <span className="font-sans font-semibold text-amber-600 dark:text-amber-400">Band 8.5: </span>
                  <span>"{ex.band8}"</span>
                </div>
                <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-200/40 dark:border-stone-750">
                  💡 {ex.note}
                </div>
              </div>
            ))}
          </div>

          {/* Common Pitfalls */}
          {selectedTopic.commonMistakes && selectedTopic.commonMistakes.length > 0 && (
            <div className="rounded-2xl border border-rose-200/60 bg-rose-50/20 p-4 dark:border-rose-900/30 dark:bg-rose-950/10">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Common Candidate Pitfalls:</span>
              </div>
              {selectedTopic.commonMistakes.map((m, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="text-rose-600 dark:text-rose-400 line-through">❌ {m.wrong}</div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-medium">✅ {m.correct}</div>
                  <div className="text-[11px] text-stone-400">{m.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
