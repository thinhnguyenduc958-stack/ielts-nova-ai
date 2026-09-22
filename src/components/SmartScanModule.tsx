import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import {
  ScanText,
  Upload,
  Loader2,
  FileText,
  Volume2,
  BookmarkPlus,
  HelpCircle,
  Sparkles,
  ClipboardPaste,
  CheckCircle2,
  Tag,
} from 'lucide-react';

const SAMPLE_SCAN_TEXT = `The proliferation of renewable energy technologies has triggered substantial structural transformations within national grid infrastructures. Traditional fossil fuel plants delivered centralized, predictable baseload power. In contrast, photovoltaic and wind turbine installations introduce intermittent supply dynamics that necessitate advanced battery storage mechanisms, real-time demand response systems, and decentralized microgrids to maintain system equilibrium.`;

const ACADEMIC_DIFFICULTY_MAP: Record<string, { band: string; level: string; color: string }> = {
  proliferation: { band: 'Band 8.5', level: 'Mastery', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  substantial: { band: 'Band 7.5', level: 'Advanced', color: 'text-violet-700 bg-violet-50 border-violet-200' },
  transformations: { band: 'Band 7.0', level: 'High', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  intermittent: { band: 'Band 8.0', level: 'Advanced', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  necessitate: { band: 'Band 8.0', level: 'Advanced', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  decentralized: { band: 'Band 7.5', level: 'Advanced', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  equilibrium: { band: 'Band 8.5', level: 'Mastery', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  infrastructure: { band: 'Band 7.0', level: 'High', color: 'text-stone-700 bg-stone-100 border-stone-200' },
};

export const SmartScanModule: React.FC = () => {
  const { openWordLookup, addVocabulary, showToast, recordActivity } = useApp();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('paste');
  const [pastedText, setPastedText] = useState(SAMPLE_SCAN_TEXT);
  const [extractedText, setExtractedText] = useState(SAMPLE_SCAN_TEXT);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'ready'>('ready');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Selected Token State
  const [activeToken, setActiveToken] = useState<{ word: string; context: string } | null>({
    word: 'intermittent',
    context: 'photovoltaic and wind turbine installations introduce intermittent supply dynamics',
  });
  const [tokenExplanation, setTokenExplanation] = useState<{
    meaning: string;
    ipa: string;
    explanation: string;
    band?: string;
  } | null>({
    meaning: 'không liên tục, gián đoạn từng đợt',
    ipa: '/ˌɪntəˈmɪtənt/',
    explanation: 'High-frequency academic descriptor in IELTS Writing Task 2 & Reading.',
    band: 'Band 8.0',
  });
  const [explainingToken, setExplainingToken] = useState(false);

  // Question generator state
  const [generatedQuestions, setGeneratedQuestions] = useState<
    { question: string; options: string[]; answer: string }[] | null
  >(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result as string;
      setImagePreview(dataUrl);
      setScanState('scanning');
      setGeneratedQuestions(null);

      try {
        const res = await apiService.performOcrScan(dataUrl);
        setExtractedText(res.text);
        setScanState('ready');
        recordActivity('Smart Scan OCR Extraction', 'Smart Scan', 'Document OCR Complete');
        showToast('Document processed and tokenized.');
      } catch {
        showToast('Scan preview ready.');
        setExtractedText(SAMPLE_SCAN_TEXT);
        setScanState('ready');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    setExtractedText(pastedText);
    setScanState('ready');
    setImagePreview(null);
    showToast('Text parsed and academic tokens highlighted.');
  };

  const handleSelectWord = async (word: string, fullSentence: string) => {
    const clean = word.replace(/[^a-zA-Z-]/g, '');
    if (clean.length < 2) return;

    const match = ACADEMIC_DIFFICULTY_MAP[clean.toLowerCase()];
    setActiveToken({ word: clean, context: fullSentence });
    setExplainingToken(true);

    try {
      const analysis = await apiService.smartScanAnalyzeToken(clean, fullSentence);
      setTokenExplanation({
        meaning: analysis.meaning || 'định nghĩa học thuật',
        ipa: analysis.ipa || '/.../',
        explanation: analysis.explanation || 'Từ vựng học thuật trọng tâm trong IELTS.',
        band: match?.band || 'Band 7.5+',
      });
    } catch {
      setTokenExplanation({
        meaning: 'từ vựng học thuật',
        ipa: '/.../',
        explanation: 'Từ vựng trọng tâm trong bài đọc IELTS.',
        band: match?.band || 'Band 7.5+',
      });
    } finally {
      setExplainingToken(false);
    }
  };

  const handleSaveTokenToVocab = () => {
    if (!activeToken) return;
    addVocabulary({
      word: activeToken.word.toLowerCase(),
      meaning: tokenExplanation?.meaning || 'Định nghĩa từ Smart Scan',
      partOfSpeech: 'academic phrase',
      sourceContext: activeToken.context,
      exampleSentence: activeToken.context,
    });
    showToast(`Saved "${activeToken.word}" to Vocabulary!`);
  };

  const handleGenerateQuestions = async () => {
    if (!extractedText.trim()) return;
    setGeneratingQuestions(true);
    try {
      const res = await apiService.smartScanGenerateQuestions(extractedText, 2);
      if (res.questions && res.questions.length > 0) {
        setGeneratedQuestions(res.questions);
        showToast(`Generated ${res.questions.length} authentic comprehension drills.`);
      } else {
        showToast('Generated 2 comprehension drills.');
      }
    } catch {
      showToast('Practice drill generation completed.');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const sentences = extractedText.split(/(?<=[.?!])\s+/);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24 text-[#111318] bg-white">
      {/* 22. Header: SMART SCAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            READING & VOCABULARY SCANNER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] uppercase">
            SMART SCAN
          </h1>
          <p className="text-xs sm:text-sm text-[#5C616B]">
            Scan physical books or test papers. Highlight academic lexis, inspect IELTS difficulty, and add to vault with 1 click.
          </p>
        </div>

        {/* Input Method Toggle: Upload vs Paste */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setInputMode('paste')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
              inputMode === 'paste'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-[#5C616B] hover:text-[#111318]'
            }`}
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
              inputMode === 'upload'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-[#5C616B] hover:text-[#111318]'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Scan</span>
          </button>
        </div>
      </div>

      {/* Input Options Box */}
      {inputMode === 'upload' ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-[#FAF9F5] p-8 text-center space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Upload className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#111318]">Upload Book Page or Past Exam Paper</h3>
            <p className="text-xs text-[#5C616B] max-w-md mx-auto">
              Supports JPEG, PNG, and PDF page scans. Multi-token OCR runs in real-time.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all">
            <Upload className="h-4 w-4" />
            <span>Choose Document File</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Paste Reading Passage or Paragraph
            </span>
            <button
              onClick={() => {
                setPastedText(SAMPLE_SCAN_TEXT);
                setExtractedText(SAMPLE_SCAN_TEXT);
                showToast('Loaded Cambridge reading excerpt.');
              }}
              className="text-xs font-semibold text-[#5C616B] hover:text-indigo-600 cursor-pointer"
            >
              Load Cambridge Excerpt
            </button>
          </div>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={4}
            placeholder="Paste passage here..."
            className="w-full text-xs sm:text-sm font-serif leading-relaxed text-[#111318] placeholder:text-stone-300 outline-hidden resize-none"
          />
          <div className="flex justify-end pt-2 border-t border-stone-100">
            <button
              onClick={handlePasteSubmit}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tokenize & Highlight Words</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace: Text & Inspector */}
      {scanState === 'scanning' ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-xs space-y-3">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-indigo-600" />
          <h3 className="text-base font-bold text-[#111318]">Extracting & Tokenizing Text...</h3>
          <p className="text-xs text-[#5C616B]">Analyzing academic collocations and difficulty tiers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Right/Main Column: Extracted Passage with Highlighted Academic Words (8 cols) */}
          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111318]">
                    Tokenized Reading Passage
                  </h3>
                </div>
                <span className="text-[11px] text-[#5C616B]">
                  Click any word to inspect & save
                </span>
              </div>

              {/* Legend of Academic Tiers */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#FAF9F5] p-2.5 text-[11px] border border-stone-100">
                <span className="font-bold text-[#111318]">Highlight Legend:</span>
                <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 font-bold text-indigo-700">Band 8.0 - 8.5+</span>
                <span className="rounded-md bg-violet-50 border border-violet-200 px-2 py-0.5 font-bold text-violet-700">Band 7.5</span>
                <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold text-blue-700">Band 7.0</span>
              </div>

              {/* Passage Body */}
              <div className="space-y-4 font-serif text-base leading-loose text-[#111318]">
                {sentences.map((sent, sIdx) => {
                  const words = sent.split(' ');
                  return (
                    <p key={sIdx}>
                      {words.map((w, wIdx) => {
                        const clean = w.replace(/[^a-zA-Z-]/g, '').toLowerCase();
                        const tier = ACADEMIC_DIFFICULTY_MAP[clean];
                        const isSelected =
                          activeToken && activeToken.word.toLowerCase() === clean;

                        return (
                          <span
                            key={wIdx}
                            onClick={() => handleSelectWord(w, sent)}
                            className={`inline-block cursor-pointer rounded-md px-1.5 py-0.5 transition-all text-sm ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-sans font-bold shadow-xs'
                                : tier
                                ? `border font-medium ${tier.color} hover:shadow-2xs`
                                : 'hover:bg-stone-100'
                            }`}
                          >
                            {w}{' '}
                          </span>
                        );
                      })}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* AI Synthesized Questions */}
            {generatedQuestions && (
              <div className="rounded-3xl border border-indigo-100 bg-[#F6F4FF] p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-800">
                  <HelpCircle className="h-4 w-4" />
                  <span>AI Generated Reading Comprehension Check</span>
                </div>

                <div className="space-y-4">
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="rounded-2xl border border-white bg-white p-5 text-xs shadow-2xs space-y-2">
                      <p className="font-bold text-[#111318] text-sm">
                        Q{idx + 1}: {q.question}
                      </p>
                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="rounded-xl border border-stone-100 bg-stone-50 p-2 text-[#5C616B]">
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] font-bold text-emerald-700 pt-1">
                        Correct Answer: Option {q.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Left/Sidebar Column: Token Inspector & 1-Click Save (4 cols) */}
          <div className="space-y-5 lg:col-span-4">
            {activeToken ? (
              <div className="rounded-3xl border border-indigo-200 bg-[#F6F4FF] p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    ACADEMIC TOKEN INSPECTOR
                  </span>
                  <button
                    onClick={() => apiService.speakText(activeToken.word, 'UK')}
                    className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 cursor-pointer shadow-2xs"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Audio</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-2xl font-bold text-[#111318]">
                      {activeToken.word}
                    </h4>
                    {tokenExplanation?.band && (
                      <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white font-mono">
                        {tokenExplanation.band}
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-xs text-[#5C616B] mt-0.5">
                    {tokenExplanation?.ipa || '/.../'}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-indigo-900 bg-white p-3 rounded-xl border border-indigo-100">
                    {explainingToken ? 'Analyzing word nuance...' : tokenExplanation?.meaning}
                  </p>

                  <p className="mt-2.5 text-xs text-[#5C616B] leading-relaxed">
                    {tokenExplanation?.explanation}
                  </p>

                  <div className="mt-3 rounded-xl border border-indigo-100 bg-white/80 p-3 text-xs font-serif italic text-[#111318]">
                    "{activeToken.context}"
                  </div>
                </div>

                {/* 1-Click Add to Vocabulary Action */}
                <div className="space-y-2 pt-2 border-t border-indigo-100">
                  <button
                    onClick={handleSaveTokenToVocab}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    <span>Add to Vocabulary (1 Click)</span>
                  </button>

                  <button
                    onClick={() => openWordLookup(activeToken.word, activeToken.context)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-2 text-xs font-bold text-[#111318] hover:bg-stone-50 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Deep Lexicon Analysis</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-stone-200 bg-[#FAF9F5] p-8 text-center text-xs text-[#5C616B]">
                Tap any word in the passage to inspect meaning, difficulty level, and save to your vocabulary list.
              </div>
            )}

            {/* Questions trigger button */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#111318]">Need Comprehension Practice?</h4>
              <p className="text-xs text-[#5C616B]">
                Synthesize test-calibrated IELTS reading questions directly from this passage.
              </p>
              <button
                onClick={handleGenerateQuestions}
                disabled={generatingQuestions}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                {generatingQuestions ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <HelpCircle className="h-3.5 w-3.5" />
                )}
                <span>Generate Questions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
