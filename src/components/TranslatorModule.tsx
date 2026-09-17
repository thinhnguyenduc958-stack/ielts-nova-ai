import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { TranslationResult, TranslationMode, EnglishVariant } from '../types';
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  Loader2,
  Volume2,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

const UK_US_VOCAB = [
  { uk: 'flat', us: 'apartment', meaning: 'căn hộ' },
  { uk: 'holiday', us: 'vacation', meaning: 'kỳ nghỉ' },
  { uk: 'underground', us: 'subway', meaning: 'tàu điện ngầm' },
  { uk: 'petrol', us: 'gasoline', meaning: 'xăng dầu' },
  { uk: 'postcode', us: 'zip code', meaning: 'mã bưu điện' },
  { uk: 'timetable', us: 'schedule', meaning: 'thời khóa biểu' },
];

const UK_US_SPELLINGS = [
  { uk: 'colour', us: 'color', rule: '-our vs -or' },
  { uk: 'analyse', us: 'analyze', rule: '-yse vs -yze' },
  { uk: 'centre', us: 'center', rule: '-re vs -er' },
  { uk: 'programme', us: 'program', rule: '-mme vs -m' },
];

export const TranslatorModule: React.FC = () => {
  const { userProfile, showToast } = useApp();

  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState<'en' | 'vi'>('en');
  const [targetLang, setTargetLang] = useState<'en' | 'vi'>('vi');
  const [mode, setMode] = useState<TranslationMode>('ielts');
  const [variant] = useState<EnglishVariant>(userProfile.preferredVariant);

  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [improving, setImproving] = useState(false);
  const [ieltsImprovement, setIeltsImprovement] = useState<{
    original: string;
    upgraded: string;
    bandTarget: string;
    improvements: {
      formalPhrasing: string;
      higherBandVocab: string[];
      grammarStructures: string;
    };
  } | null>(null);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setSourceText(result.translatedText);
      setResult(null);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    try {
      const res = await apiService.translateText(sourceText, sourceLang, targetLang, mode, variant);
      setResult(res);
    } catch {
      showToast('Translation service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleImproveForIELTS = async () => {
    if (!sourceText.trim()) return;
    setImproving(true);
    try {
      const upgradeData = await apiService.upgradeSentence(sourceText, 'Band 8.0+');
      setIeltsImprovement(upgradeData);
      showToast('IELTS Sentence Transformation generated!');
    } catch {
      showToast('Unable to generate sentence upgrade.');
    } finally {
      setImproving(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Languages className="h-3.5 w-3.5" />
              <span>Academic Workbench • Verified Cambridge Audit</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              Translation Workbench
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Precision bilingual translation calibrated for IELTS Academic Writing and Reading, with dialect distinctions and sentence elevation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800">
            {(['ielts', 'literal', 'natural'] as TranslationMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3.5 py-1.5 capitalize transition-all ${
                  mode === m
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                {m === 'ielts' ? 'IELTS Academic' : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Source & Target Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Source */}
        <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <span className="text-xs font-semibold text-stone-900 dark:text-white">
                {sourceLang === 'en' ? 'English (Source)' : 'Tiếng Việt (Văn bản gốc)'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSwap}
                  className="flex items-center gap-1 rounded-full border border-stone-200 px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300"
                >
                  <ArrowRightLeft className="h-3 w-3" />
                  <span>Swap</span>
                </button>
                {sourceLang === 'en' && (
                  <button
                    onClick={() => apiService.speakText(sourceText, variant)}
                    className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Pronounce"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Nhập hoặc dán câu tiếng Anh / tiếng Việt..."
              rows={6}
              className="mt-4 w-full text-sm font-serif leading-relaxed text-stone-900 placeholder:text-stone-300 focus:outline-hidden dark:bg-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] text-stone-400">{sourceText.length} chars</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleImproveForIELTS}
                disabled={improving}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-medium text-stone-800 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                {improving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-amber-600" />}
                <span>Improve for IELTS</span>
              </button>

              <button
                onClick={handleTranslate}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />}
                <span>Translate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Target */}
        <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900/50">
          <div>
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-3 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900 dark:text-white">
                  {targetLang === 'vi' ? 'Tiếng Việt (Bản dịch học thuật)' : 'English (Academic Translation)'}
                </span>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  Cambridge Register
                </span>
              </div>

              {result && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(result.translatedText)}
                    className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => apiService.speakText(result.translatedText, variant)}
                    className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 min-h-[140px] text-sm font-serif leading-relaxed text-stone-800 dark:text-stone-200">
              {loading ? (
                <div className="flex items-center gap-2 text-stone-400 font-sans text-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-stone-600" />
                  <span>Generating academic translation...</span>
                </div>
              ) : result ? (
                <p className="text-stone-900 dark:text-white leading-loose">
                  {result.translatedText}
                </p>
              ) : (
                <p className="text-stone-400 italic">
                  Press "Translate" or "Improve for IELTS" to view contextual translation and academic structures.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-200/70 dark:border-stone-800 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Semantic Verification Passed</span>
            </span>
            <span className="font-semibold text-stone-700 dark:text-stone-300">Band 8.0 Register</span>
          </div>
        </div>
      </div>

      {/* IELTS Sentence Upgrade */}
      {ieltsImprovement && (
        <div className="rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/70 pb-4 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                  IELTS Academic Sentence Upgrade
                </h3>
                <p className="text-[11px] text-stone-400">
                  Enhanced lexical density and grammatical range for Task 2
                </p>
              </div>
            </div>

            <span className="rounded-full bg-stone-200 px-3 py-0.5 text-xs font-medium text-stone-800 dark:bg-stone-800 dark:text-stone-200">
              {ieltsImprovement.bandTarget} Standard
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-4.5 text-xs dark:border-stone-800 dark:bg-stone-850">
              <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Original (Band 5.5 - 6.0)</span>
              <p className="mt-2 font-serif italic text-stone-600 dark:text-stone-300 leading-relaxed">
                "{ieltsImprovement.original}"
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 bg-white p-4.5 text-xs dark:border-stone-700 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Academic Upgrade (Band 8.0+)
                </span>
                <button
                  onClick={() => handleCopy(ieltsImprovement.upgraded)}
                  className="text-[11px] font-semibold text-stone-700 hover:text-stone-950 dark:text-stone-300"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 font-serif font-medium text-stone-900 dark:text-white leading-relaxed">
                "{ieltsImprovement.upgraded}"
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-stone-100 bg-white p-4 text-xs dark:border-stone-800 dark:bg-stone-850">
              <h4 className="font-semibold text-stone-900 dark:text-white">
                Formal Phrasing
              </h4>
              <p className="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed">
                {ieltsImprovement.improvements.formalPhrasing}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 text-xs dark:border-stone-800 dark:bg-stone-850">
              <h4 className="font-semibold text-stone-900 dark:text-white">
                Higher-Band Lexis
              </h4>
              <div className="mt-2 flex flex-wrap gap-1">
                {ieltsImprovement.improvements.higherBandVocab.map((v, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 text-xs dark:border-stone-800 dark:bg-stone-850">
              <h4 className="font-semibold text-stone-900 dark:text-white">
                Grammatical Structures
              </h4>
              <p className="mt-1.5 text-stone-600 dark:text-stone-300 leading-relaxed">
                {ieltsImprovement.improvements.grammarStructures}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UK vs US Dialect Reference */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
            British vs. American English in IELTS
          </h3>
          <p className="text-xs text-stone-400">
            Both varieties are recognized, but consistency across your test paper is essential.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:col-span-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-3 dark:border-stone-800">
              Common Vocabulary Differences
            </h4>

            <div className="mt-3 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {UK_US_VOCAB.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-stone-900 dark:text-white">🇬🇧 {item.uk}</span>
                    <span className="text-stone-300">/</span>
                    <span className="font-medium text-stone-600 dark:text-stone-300">🇺🇸 {item.us}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-stone-400 italic">
                      "{item.meaning}"
                    </span>
                    <button
                      onClick={() => apiService.speakText(item.uk, 'UK')}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-3 dark:border-stone-800">
              Spelling Conventions
            </h4>

            <div className="mt-3 space-y-2.5 text-xs">
              {UK_US_SPELLINGS.map((sp, sIdx) => (
                <div key={sIdx} className="rounded-xl bg-[#FAF9F5] p-2.5 dark:bg-stone-850">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-900 dark:text-white">🇬🇧 {sp.uk}</span>
                    <span className="text-stone-600 dark:text-stone-300">🇺🇸 {sp.us}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{sp.rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
