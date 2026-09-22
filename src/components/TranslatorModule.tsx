import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { TranslationResult, EnglishVariant } from '../types';
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  Loader2,
  Volume2,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

type ToneOption = 'Casual' | 'Academic' | 'IELTS Band 8+';

const UK_US_VOCAB = [
  { uk: 'flat', us: 'apartment', meaning: 'căn hộ' },
  { uk: 'holiday', us: 'vacation', meaning: 'kỳ nghỉ' },
  { uk: 'underground', us: 'subway', meaning: 'tàu điện ngầm' },
  { uk: 'petrol', us: 'gasoline', meaning: 'xăng dầu' },
  { uk: 'postcode', us: 'zip code', meaning: 'mã bưu điện' },
  { uk: 'timetable', us: 'schedule', meaning: 'thời khóa biểu' },
];

export const TranslatorModule: React.FC = () => {
  const { userProfile, showToast } = useApp();

  const [sourceText, setSourceText] = useState('Urban air pollution negatively affects public health and productivity.');
  const [sourceLang, setSourceLang] = useState<'en' | 'vi'>('en');
  const [targetLang, setTargetLang] = useState<'en' | 'vi'>('vi');
  const [tone, setTone] = useState<ToneOption>('IELTS Band 8+');
  const [variant] = useState<EnglishVariant>(userProfile.preferredVariant);

  const [result, setResult] = useState<TranslationResult | null>({
    translatedText: 'Ô nhiễm không khí đô thị tác động bất lợi sâu sắc đến sức khỏe cộng đồng và năng suất kinh tế vĩ mô.',
    sourceLanguage: 'en',
    targetLanguage: 'vi',
    detectedLanguage: 'en',
    confidenceScore: 0.98,
    academicRegisterBand: 'Band 8.0+',
    suggestedIELTSVocabulary: [
      { word: 'deleterious', definition: 'gây hại, tác động tiêu cực nghiêm trọng' },
      { word: 'mitigate', definition: 'giảm nhẹ tác động rủi ro' },
      { word: 'profoundly', definition: 'một cách sâu sắc, rõ rệt' },
    ],
  });
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
  } | null>({
    original: 'Urban air pollution negatively affects public health and productivity.',
    upgraded: 'Ambient atmospheric contamination exerts profoundly deleterious repercussions upon community physiological wellbeing and macroeconomic output.',
    bandTarget: 'Band 8.5+',
    improvements: {
      formalPhrasing: 'Replaced simple phrasal verb "affects" with academic collocation "exerts profoundly deleterious repercussions upon".',
      higherBandVocab: ['ambient atmospheric contamination', 'deleterious', 'physiological wellbeing', 'macroeconomic output'],
      grammarStructures: 'Nominalized clause replacing dynamic verbs with formal academic abstract noun phrases.',
    },
  });

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
      const modeMap = tone === 'Casual' ? 'natural' : tone === 'Academic' ? 'literal' : 'ielts';
      const res = await apiService.translateText(sourceText, sourceLang, targetLang, modeMap as any, variant);
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
      const upgradeData = await apiService.upgradeSentence(sourceText, 'Band 8.5+');
      setIeltsImprovement(upgradeData);
      showToast('IELTS Sentence Upgrade generated!');
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
    <div className="mx-auto max-w-5xl space-y-8 pb-24 text-[#111318] bg-white">
      {/* 21. Header: ACADEMIC TRANSLATOR "Compare register and academic precision." */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            REGISTER COMPARISON ENGINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] uppercase">
            ACADEMIC TRANSLATOR
          </h1>
          <p className="text-xs sm:text-sm text-[#5C616B]">
            "Compare register and academic precision."
          </p>
        </div>

        {/* Tone toggle: Casual / Academic / IELTS Band 8+ */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          {(['Casual', 'Academic', 'IELTS Band 8+'] as ToneOption[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
                tone === t
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-[#5C616B] hover:text-[#111318]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Language Direction & Translation Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Source Box */}
        <div className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {sourceLang === 'en' ? 'English (Source)' : 'Tiếng Việt (Văn bản gốc)'}
              </span>

              {/* Language Direction Toggle: EN ⇄ VI */}
              <button
                onClick={handleSwap}
                className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-bold text-[#111318] hover:bg-stone-100 transition-all cursor-pointer shadow-2xs"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-600" />
                <span>{sourceLang.toUpperCase()} ⇄ {targetLang.toUpperCase()}</span>
              </button>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Nhập hoặc dán văn bản tiếng Anh / tiếng Việt..."
              rows={6}
              className="mt-4 w-full text-sm font-serif leading-relaxed text-[#111318] placeholder:text-stone-300 outline-hidden resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
            <span className="text-xs font-mono text-[#5C616B]">{sourceText.length} characters</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleImproveForIELTS}
                disabled={improving}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                {improving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>IELTS Sentence Upgrade</span>
              </button>

              <button
                onClick={handleTranslate}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />}
                <span>Translate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Target Translation Box */}
        <div className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-[#FAF9F5] p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111318]">
                  {targetLang === 'vi' ? 'Tiếng Việt' : 'English Academic'}
                </span>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">
                  {tone}
                </span>
              </div>

              {result && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(result.translatedText)}
                    className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#111318] hover:bg-stone-50 cursor-pointer shadow-2xs"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => apiService.speakText(result.translatedText, variant)}
                    className="rounded-lg p-1 text-stone-400 hover:text-[#111318] cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 min-h-[140px] text-sm font-serif leading-relaxed text-[#111318]">
              {loading ? (
                <div className="flex items-center gap-2 text-stone-400 font-sans text-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>Translating in {tone} register...</span>
                </div>
              ) : result ? (
                <p className="leading-loose font-medium">
                  {result.translatedText}
                </p>
              ) : (
                <p className="text-stone-400 italic">
                  Press "Translate" to view translation calibrated to your target tone.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-200/70 text-xs text-[#5C616B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Contextually verified translation</span>
            </span>
            <span className="font-bold text-indigo-600">{tone} Register</span>
          </div>
        </div>
      </div>

      {/* Contextual Explanation & Synonym Breakdown */}
      {ieltsImprovement && (
        <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-[#111318]">
                Contextual Explanation & Academic Transformation
              </h3>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100">
              {ieltsImprovement.bandTarget} Standard
            </span>
          </div>

          {/* Upgraded Sentence Comparison */}
          <div className="rounded-2xl border border-indigo-100 bg-[#F6F4FF] p-4.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Elevated Academic Version
            </span>
            <p className="font-serif text-sm font-semibold text-[#111318] leading-relaxed">
              "{ieltsImprovement.upgraded}"
            </p>
          </div>

          {/* Synonym Breakdown & Grammar Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Contextual Explanation */}
            <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-2">
              <h4 className="font-bold text-[#111318]">Contextual Explanation</h4>
              <p className="text-[#5C616B] leading-relaxed">
                {ieltsImprovement.improvements.formalPhrasing}
              </p>
            </div>

            {/* Synonym Breakdown */}
            <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-2">
              <h4 className="font-bold text-[#111318]">Synonym Breakdown (Band 8+)</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ieltsImprovement.improvements.higherBandVocab.map((voc, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-white border border-stone-200 px-2.5 py-1 text-[11px] font-semibold text-indigo-700"
                  >
                    {voc}
                  </span>
                ))}
              </div>
            </div>

            {/* Grammatical Architecture */}
            <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-2">
              <h4 className="font-bold text-[#111318]">Grammar Architecture</h4>
              <p className="text-[#5C616B] leading-relaxed">
                {ieltsImprovement.improvements.grammarStructures}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
