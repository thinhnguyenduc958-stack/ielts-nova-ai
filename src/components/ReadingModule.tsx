import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sampleReadingPassages } from '../data/mockIELTSData';
import { apiService } from '../services/apiService';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Highlighter,
  Volume2,
  X,
  BookmarkPlus,
  StickyNote,
  Languages,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ReadingModule: React.FC = () => {
  const { recordActivity, addVocabulary, showToast, userProfile } = useApp();
  const passage = sampleReadingPassages[0];

  const [autoSaveVocab, setAutoSaveVocab] = useState<boolean>(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'passage' | 'questions'>('passage');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [savedNotes, setSavedNotes] = useState<{ id: string; text: string; note: string }[]>([]);
  const [deepExplanations, setDeepExplanations] = useState<Record<string, any>>({});
  const [loadingExplanationFor, setLoadingExplanationFor] = useState<string | null>(null);

  const handleRequestDeepExplanation = async (q: any) => {
    setLoadingExplanationFor(q.id);
    try {
      const result = await apiService.explainReadingQuestion({
        passageTitle: passage.title,
        passageExcerpt: passage.paragraphs.slice(0, 3).join('\n\n'),
        questionPrompt: q.prompt,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        candidateAnswer: userAnswers[q.id] || 'None',
      });
      setDeepExplanations((prev) => ({ ...prev, [q.id]: result }));
    } catch {
      showToast('Explanation service unavailable.');
    } finally {
      setLoadingExplanationFor(null);
    }
  };

  // Floating Contextual Toolbar State
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const [quickTranslation, setQuickTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteInputText, setNoteInputText] = useState('');

  const passageContainerRef = useRef<HTMLDivElement>(null);

  // Floating selection handler
  const handleMouseUp = async () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (!showNoteInput) setPopoverPos(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0 && text.length < 120) {
      const anchorNode = selection.anchorNode;
      const sentenceContext = anchorNode?.parentElement?.textContent || text;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setSelectedContext(sentenceContext);
      setQuickTranslation(null);
      setShowNoteInput(false);

      // Position tooltip directly above the selection
      setPopoverPos({
        x: Math.max(16, Math.min(window.innerWidth - 320, rect.left + rect.width / 2 - 150)),
        y: Math.max(16, rect.top - 62 + window.scrollY),
      });

      // Auto-save highlighted academic words to vocabulary if enabled (Section 18)
      if (autoSaveVocab && text.split(/\s+/).length <= 4) {
        addVocabulary({
          word: text.toLowerCase(),
          meaning: 'Từ vựng đọc hiểu IELTS (Passage 1)',
          partOfSpeech: 'academic vocabulary',
          sourceContext: sentenceContext,
          exampleSentence: sentenceContext,
        });
        showToast(`Auto-saved "${text}" to vocabulary!`);
      }

      // Fetch immediate quick translation without disruption
      setTranslating(true);
      try {
        const trans = await apiService.translateAcademic(text);
        setQuickTranslation(trans.translation);
      } catch {
        setQuickTranslation('Tra cứu từ...');
      } finally {
        setTranslating(false);
      }
    } else {
      if (!showNoteInput) setPopoverPos(null);
    }
  };

  const handleSaveToVocab = () => {
    if (!selectedText) return;
    addVocabulary({
      word: selectedText.toLowerCase(),
      meaning: quickTranslation || 'Từ vựng đọc hiểu IELTS',
      partOfSpeech: 'academic vocabulary',
      sourceContext: selectedContext,
      exampleSentence: selectedContext,
    });
    showToast(`Saved "${selectedText}" to Lexicon Vault!`);
    setPopoverPos(null);
  };

  const handleSaveNote = () => {
    if (!noteInputText.trim() || !selectedText) return;
    setSavedNotes((prev) => [
      ...prev,
      { id: Date.now().toString(), text: selectedText, note: noteInputText.trim() },
    ]);
    showToast('Note added to passage margin.');
    setNoteInputText('');
    setShowNoteInput(false);
    setPopoverPos(null);
  };

  const handleAnswerSelect = (qId: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    passage.questions.forEach((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const cAns = q.correctAnswer.trim().toLowerCase();
      if (uAns === cAns || uAns.startsWith(cAns.charAt(0))) {
        correctCount++;
      }
    });

    const bandEst = correctCount >= 3 ? '7.5' : correctCount >= 2 ? '6.5' : '5.5';
    recordActivity(
      `${passage.title} (Reading Passage 1)`,
      'Reading',
      `${correctCount}/${passage.questions.length} (Band ${bandEst})`
    );
    showToast(`Reading Test Evaluated: ${correctCount}/${passage.questions.length} Correct (Band ${bandEst})`);
  };

  const fontSizes = {
    sm: 'text-xs leading-relaxed',
    base: 'text-sm leading-loose',
    lg: 'text-base leading-loose',
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Editorial Header Banner - Section 18 */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                PASSAGE 1
              </span>
              <span className="text-[11px] font-medium text-[#5C616B]">
                Academic Reading Practice
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111318] sm:text-3xl">
              {passage.title}
            </h1>
            <p className="text-xs text-[#5C616B]">{passage.topic}</p>
          </div>

          {/* Reading Ergonomics & Auto-save toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto-save highlighted words toggle */}
            <button
              onClick={() => {
                const next = !autoSaveVocab;
                setAutoSaveVocab(next);
                showToast(`Auto-save highlighted words: ${next ? 'ENABLED' : 'DISABLED'}`);
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                autoSaveVocab
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-stone-200 bg-stone-50 text-stone-600'
              }`}
              title="Toggle auto-saving highlighted words to vocabulary"
            >
              <Highlighter className="h-3.5 w-3.5" />
              <span>Auto-save to Vocab: <strong>{autoSaveVocab ? 'ON' : 'OFF'}</strong></span>
            </button>

            {/* Serif / Sans Toggle */}
            <div className="flex items-center rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium text-stone-700">
              <button
                onClick={() => setFontFamily('serif')}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  fontFamily === 'serif' ? 'bg-[#111318] text-white font-semibold' : 'text-stone-600'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  fontFamily === 'sans' ? 'bg-[#111318] text-white font-semibold' : 'text-stone-600'
                }`}
              >
                Sans
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium text-stone-700">
              <button
                onClick={() => setFontSize('sm')}
                className={`rounded-full px-2.5 py-1 ${fontSize === 'sm' ? 'bg-[#111318] text-white' : 'text-stone-600'}`}
                title="Compact text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`rounded-full px-2.5 py-1 ${fontSize === 'base' ? 'bg-[#111318] text-white' : 'text-stone-600'}`}
                title="Default text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`rounded-full px-2.5 py-1 ${fontSize === 'lg' ? 'bg-[#111318] text-white' : 'text-stone-600'}`}
                title="Spacious text"
              >
                A+
              </button>
            </div>

            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-[#111318]">
              Target: Band {passage.bandLevel}
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING CONTEXTUAL VOCABULARY DOCK */}
      {popoverPos && selectedText && (
        <div
          style={{ top: `${popoverPos.y}px`, left: `${popoverPos.x}px` }}
          className="fixed z-50 flex flex-col rounded-3xl border border-stone-200 bg-white p-3.5 shadow-xl transition-all max-w-sm"
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSaveToVocab}
              className="flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Save Word</span>
            </button>

            <button
              onClick={() => apiService.speakText(selectedText, userProfile.preferredVariant)}
              className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>Listen</span>
            </button>

            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <StickyNote className="h-3.5 w-3.5 text-amber-600" />
              <span>Note</span>
            </button>

            <button
              onClick={() => setPopoverPos(null)}
              className="ml-auto rounded-full p-1 text-stone-400 hover:text-stone-600 transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Inline Vietnamese Meaning */}
          <div className="mt-2.5 rounded-2xl bg-stone-50 p-2.5 text-xs border border-stone-200">
            <div className="flex items-center gap-1 text-[10px] font-medium text-stone-500 uppercase">
              <Languages className="h-3 w-3" />
              <span>Vietnamese Definition</span>
            </div>
            <p className="mt-0.5 font-medium text-[#111318]">
              {translating ? 'Đang phân tích ngữ cảnh...' : quickTranslation || 'Đang chuẩn bị nghĩa...'}
            </p>
          </div>

          {/* Note Input */}
          {showNoteInput && (
            <div className="mt-2 space-y-1.5 border-t border-stone-100 pt-2">
              <input
                type="text"
                value={noteInputText}
                onChange={(e) => setNoteInputText(e.target.value)}
                placeholder="Ghi chú ngoài lề (marginal note)..."
                className="w-full rounded-xl border border-stone-200 px-3 py-1.5 text-xs text-[#111318] focus:border-indigo-500 focus:outline-hidden"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  Ghi lại
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="flex rounded-full border border-stone-200 bg-stone-100 p-1 text-xs font-medium text-stone-600 lg:hidden">
        <button
          onClick={() => setActiveMobileTab('passage')}
          className={`flex-1 rounded-full py-2 transition-all ${
            activeMobileTab === 'passage'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : ''
          }`}
        >
          Passage Text
        </button>
        <button
          onClick={() => setActiveMobileTab('questions')}
          className={`flex-1 rounded-full py-2 transition-all ${
            activeMobileTab === 'questions'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : ''
          }`}
        >
          Questions ({passage.questions.length})
        </button>
      </div>

      {/* MAIN SPLIT SCREEN AREA */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT PANEL: Academic Reading Passage */}
        <div
          className={`rounded-3xl border border-stone-200 bg-white p-7 shadow-xs lg:col-span-7 lg:p-9 ${
            activeMobileTab === 'questions' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-xs text-[#5C616B]">
              <Highlighter className="h-3.5 w-3.5 text-amber-500" />
              <span>Select text to inspect meaning, listen, or auto-save</span>
            </div>
            <span className="text-[11px] font-mono text-[#5C616B]">
              Paragraphs A–{String.fromCharCode(64 + passage.paragraphs.length)}
            </span>
          </div>

          <div
            ref={passageContainerRef}
            onMouseUp={handleMouseUp}
            className={`space-y-6 text-[#111318] select-text ${
              fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            } ${fontSizes[fontSize]}`}
          >
            {passage.paragraphs.map((para, pIdx) => {
              const paragraphLetter = String.fromCharCode(65 + pIdx);

              return (
                <div key={para.id} className="relative group space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-stone-100 text-[11px] font-mono font-bold text-stone-800">
                      {paragraphLetter}
                    </span>
                    {para.title && (
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C616B]">
                        {para.title}
                      </h3>
                    )}
                  </div>

                  <p className="text-[#111318] text-justify pl-7 border-l-2 border-stone-100 group-hover:border-indigo-400 transition-colors">
                    {para.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Marginal Notes Saved for this Passage */}
          {savedNotes.length > 0 && (
            <div className="mt-8 rounded-2xl border border-stone-200 bg-[#FAF9F5] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#111318]">
                <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                <span>My Marginal Notes ({savedNotes.length})</span>
              </div>
              <div className="mt-2 divide-y divide-stone-100 text-xs">
                {savedNotes.map((n) => (
                  <div key={n.id} className="py-2">
                    <span className="font-semibold text-[#111318]">"{n.text}":</span>{' '}
                    <span className="text-stone-600">{n.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Official Cambridge Question Set */}
        <div
          className={`space-y-6 rounded-3xl border border-stone-200 bg-white p-7 shadow-xs lg:col-span-5 lg:p-8 ${
            activeMobileTab === 'passage' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#111318]">
                Questions 1–{passage.questions.length}
              </h2>
              <p className="text-[11px] text-[#5C616B]">
                Standard academic format
              </p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-[#111318]">
              {Object.keys(userAnswers).length}/{passage.questions.length} Answered
            </span>
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {passage.questions.map((q, idx) => {
              const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
              const cAns = q.correctAnswer.trim().toLowerCase();
              const isCorrect = isSubmitted && (uAns === cAns || uAns.startsWith(cAns.charAt(0)));
              const isWrong = isSubmitted && !isCorrect;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-4.5 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : isWrong
                      ? 'border-rose-200 bg-rose-50/30'
                      : 'border-stone-200 bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111318] text-xs font-semibold text-white">
                      {idx + 1}
                    </span>

                    <div className="flex-1 space-y-2.5">
                      <p className="text-xs font-medium leading-relaxed text-[#111318]">
                        {q.prompt}
                      </p>

                      {/* Options */}
                      {q.options && (
                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt) => {
                            const isSelected = userAnswers[q.id] === opt;

                            return (
                              <label
                                key={opt}
                                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-xs transition-all ${
                                  isSelected
                                    ? 'border-indigo-600 bg-white font-semibold text-[#111318] shadow-2xs'
                                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={opt}
                                  checked={isSelected}
                                  onChange={() => handleAnswerSelect(q.id, opt)}
                                  disabled={isSubmitted}
                                  className="accent-indigo-600"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Review feedback */}
                      {isSubmitted && (
                        <div className="mt-2 rounded-xl border border-stone-200 bg-white p-3 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-semibold">
                              {isCorrect ? (
                                <span className="flex items-center gap-1 text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Official Answer: {q.correctAnswer}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-rose-700">
                                  <XCircle className="h-3.5 w-3.5" /> Official Answer: {q.correctAnswer}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleRequestDeepExplanation(q)}
                              disabled={loadingExplanationFor === q.id}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 underline underline-offset-2 transition-colors cursor-pointer"
                            >
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              {loadingExplanationFor === q.id
                                ? 'Analyzing...'
                                : deepExplanations[q.id]
                                ? 'Refresh AI Breakdown'
                                : 'AI Examiner Breakdown'}
                            </button>
                          </div>

                          <p className="text-stone-600 leading-relaxed">
                            {q.explanation}
                          </p>

                          {/* Deep AI Examiner Explanation */}
                          {deepExplanations[q.id] && (
                            <div className="mt-2.5 rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-[11px] space-y-1.5">
                              <div className="font-semibold text-[#111318] flex items-center gap-1">
                                <span>Cambridge Examiner Analysis</span>
                                {deepExplanations[q.id].locationInPassage && (
                                  <span className="text-[10px] text-stone-500 font-normal">
                                    • {deepExplanations[q.id].locationInPassage}
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-600 leading-relaxed">
                                {deepExplanations[q.id].reasoning}
                              </p>
                              {deepExplanations[q.id].evidenceQuote && (
                                <div className="border-l-2 border-stone-300 pl-2 text-stone-500 italic">
                                  "{deepExplanations[q.id].evidenceQuote}"
                                </div>
                              )}
                              {Array.isArray(deepExplanations[q.id].distractorAnalysis) && (
                                <div className="space-y-1 pt-1">
                                  <span className="font-medium text-stone-700 block">Distractor Traps:</span>
                                  {deepExplanations[q.id].distractorAnalysis.map((d: any, dIdx: number) => (
                                    <div key={dIdx} className="text-stone-500">
                                      <span className="font-mono text-stone-600">{d.option}:</span> {d.reason}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
            <span className="text-xs text-[#5C616B]">Cambridge Diagnostic</span>
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer ${
                isSubmitted
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-xs'
              }`}
            >
              {isSubmitted ? 'Recorded ✓' : 'Submit Answers'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
