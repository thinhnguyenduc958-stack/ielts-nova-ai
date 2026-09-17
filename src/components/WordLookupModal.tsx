import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { Volume2, Bookmark, BookmarkCheck, X, Sparkles, Loader2 } from 'lucide-react';

export const WordLookupModal: React.FC = () => {
  const { selectedLookupWord, closeWordLookup, addVocabulary, vocabulary } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userNote, setUserNote] = useState('');

  const word = selectedLookupWord?.word || '';
  const contextSentence = selectedLookupWord?.context || '';

  const isAlreadySaved = vocabulary.some((v) => v.word.toLowerCase() === word.toLowerCase());

  useEffect(() => {
    if (!word) return;
    let isMounted = true;
    setLoading(true);

    // Check if we already have it in local vocabulary
    const existing = vocabulary.find((v) => v.word.toLowerCase() === word.toLowerCase());
    if (existing) {
      setData(existing);
      setUserNote(existing.userNotes || '');
      setLoading(false);
      return;
    }

    apiService
      .explainVocabulary(word, contextSentence)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData({
            word,
            meaning: 'Definition processing',
            contextMeaning: contextSentence ? 'Contextual reading meaning' : '',
            partOfSpeech: 'term',
            ipa: '/.../',
            exampleSentence: contextSentence || `IELTS context for ${word}.`,
            synonyms: [],
            collocations: [],
            ieltsRelevance: 'Band 7.0+ Academic',
          });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [word, contextSentence, vocabulary]);

  if (!selectedLookupWord) return null;

  const handleSave = () => {
    if (!data) return;
    addVocabulary({
      word: data.word || word,
      meaning: data.meaning || 'IELTS vocabulary',
      contextMeaning: data.contextMeaning || contextSentence,
      partOfSpeech: data.partOfSpeech || 'noun',
      ipa: data.ipa || '/.../',
      exampleSentence: data.exampleSentence || contextSentence,
      synonyms: data.synonyms || [],
      antonyms: data.antonyms || [],
      collocations: data.collocations || [],
      ieltsRelevance: data.ieltsRelevance || 'Band 7.5+ Lexical Resource',
      difficulty: data.difficulty || 'advanced',
      sourceContext: contextSentence,
      userNotes: userNote,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div
        id="word-lookup-card"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 bg-[#FAF9F5] px-6 py-4 dark:border-stone-800 dark:bg-stone-850">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              IELTS Smart Lexicon Inspector
            </span>
          </div>
          <button
            onClick={closeWordLookup}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <Loader2 className="mb-3 h-6 w-6 animate-spin text-stone-700 dark:text-stone-300" />
              <p className="text-xs">Analyzing lexical context with Gemini...</p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Word & IPA */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="font-serif text-2xl font-light tracking-tight text-stone-900 dark:text-white">
                      {data.word}
                    </h3>
                    {data.partOfSpeech && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        {data.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {data.ipa && <p className="mt-0.5 font-mono text-xs text-stone-400">{data.ipa}</p>}
                </div>

                {/* Pronunciations */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => apiService.speakText(data.word, 'UK')}
                    className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
                    title="Pronounce British English"
                  >
                    <Volume2 className="h-3 w-3 text-stone-500" />
                    <span>UK</span>
                  </button>
                  <button
                    onClick={() => apiService.speakText(data.word, 'US')}
                    className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
                    title="Pronounce American English"
                  >
                    <Volume2 className="h-3 w-3 text-stone-500" />
                    <span>US</span>
                  </button>
                </div>
              </div>

              {/* Meanings */}
              <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Vietnamese Meaning / Định nghĩa:</p>
                <p className="mt-1 text-sm font-medium text-stone-900 dark:text-white">{data.meaning}</p>
                {data.contextMeaning && data.contextMeaning !== data.meaning && (
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-medium text-stone-700 dark:text-stone-300">Context Meaning:</span> {data.contextMeaning}
                  </p>
                )}
              </div>

              {/* Context or Example Sentence */}
              {(contextSentence || data.exampleSentence) && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">IELTS Context / Example:</p>
                  <div className="rounded-2xl border border-stone-100 bg-white p-3.5 font-serif text-xs italic text-stone-700 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 leading-relaxed">
                    "{contextSentence || data.exampleSentence}"
                  </div>
                </div>
              )}

              {/* Collocations */}
              {data.collocations && data.collocations.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">IELTS High-Band Collocations:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.collocations.map((col: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-xs text-stone-700 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synonyms */}
              {data.synonyms && data.synonyms.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">Band 7.5+ Synonyms:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.synonyms.map((syn: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Note Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Personal Study Note (Optional):</label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g., Use in Task 2 conclusion about environmental policy"
                  className="w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2 text-xs text-stone-800 focus:border-stone-400 focus:bg-white focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={closeWordLookup}
                  className="rounded-full px-4 py-2 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isAlreadySaved}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-2xs transition-all ${
                    isAlreadySaved
                      ? 'bg-stone-100 text-stone-700 border border-stone-200 cursor-default dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                      : 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
                  }`}
                >
                  {isAlreadySaved ? (
                    <>
                      <BookmarkCheck className="h-3.5 w-3.5 text-stone-600 dark:text-stone-300" />
                      <span>Saved in Lexicon Vault</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Save to Lexicon Vault</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
