import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { VocabularyItem } from '../types';
import { systemIELTSVocabulary } from '../data/mockIELTSData';
import { initialVocabularyTopics, ieltsTopicsRegistry } from '../data/vocabularyTopics';
import { VocabularyTopic } from '../types';
import {
  Bookmark,
  Plus,
  Search,
  Volume2,
  Trash2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
  Brain,
  Sliders,
  Check,
  Compass,
  FolderOpen,
} from 'lucide-react';

export const VocabularyModule: React.FC = () => {
  const { vocabulary, addVocabulary, updateVocabularyStatus, deleteVocabulary, showToast, openWordLookup } = useApp();

  const [activeDeck, setActiveDeck] = useState<'personal' | 'system'>(
    vocabulary.length > 0 ? 'personal' : 'system'
  );
  const [activeView, setActiveView] = useState<'inspect' | 'list' | 'topics' | 'flashcards' | 'quiz'>('inspect');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'review' | 'mastered'>('all');
  
  // Topics Database State
  const [selectedTopicId, setSelectedTopicId] = useState<string>('education');
  const [topicCategoryFilter, setTopicCategoryFilter] = useState<string>('all');
  const [topicSearch, setTopicSearch] = useState<string>('');

  const activeVocabularyList = activeDeck === 'personal' ? vocabulary : systemIELTSVocabulary;

  // Currently inspected word (defaults to 'substantial' or first in active vault)
  const defaultWord =
    activeVocabularyList.find((v) => v.word.toLowerCase() === 'substantial') ||
    activeVocabularyList[0] ||
    systemIELTSVocabulary[0];
  const [selectedWord, setSelectedWord] = useState<VocabularyItem>(defaultWord);

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newPos, setNewPos] = useState('adjective');
  const [newContext, setNewContext] = useState('');

  // Flashcards state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Filtered list
  const filteredWords = activeVocabularyList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      word: newWord.trim().toLowerCase(),
      meaning: newMeaning.trim(),
      contextMeaning: newContext.trim() || `IELTS academic context for ${newWord.trim()}`,
      partOfSpeech: newPos,
      sourceContext: newContext.trim() || `IELTS academic context for ${newWord.trim()}`,
      exampleSentence: newContext.trim() || `The policy will produce a ${newWord.trim()} improvement in urban sustainability.`,
      ipa: '/ˌædəˈkweɪt/',
      collocations: [`${newWord.trim()} impact`, `${newWord.trim()} evidence`, `${newWord.trim()} contribution`],
      synonyms: ['considerable', 'significant', 'marked'],
      antonyms: ['negligible', 'insignificant'],
      ieltsRelevance: 'Band 7.5+ Academic Essay',
      difficulty: 'advanced',
      ieltsUsageNotes: `Commonly employed in IELTS Academic Task 2 to present rigorous data arguments.`,
      status: 'learning',
      dateAdded: new Date().toISOString().split('T')[0],
      reviewCount: 0,
    };

    addVocabulary(newItem);
    setSelectedWord(newItem);
    setNewWord('');
    setNewMeaning('');
    setNewContext('');
    setShowAddModal(false);
    showToast(`Added "${newItem.word}" to Lexicon Vault!`);
  };

  // Memory status color & percentage
  const getMemoryScore = (status: VocabularyItem['status']) => {
    switch (status) {
      case 'mastered':
        return { pct: 95, label: 'Mastered', color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-400' };
      case 'review':
        return { pct: 40, label: 'Review Due', color: 'bg-amber-500', textColor: 'text-amber-700 dark:text-amber-400' };
      case 'learning':
        return { pct: 70, label: 'Active Retention', color: 'bg-sky-500', textColor: 'text-sky-700 dark:text-sky-400' };
      default:
        return { pct: 20, label: 'Newly Added', color: 'bg-slate-400', textColor: 'text-slate-600 dark:text-slate-400' };
    }
  };

  const mem = getMemoryScore(selectedWord?.status || 'new');

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Bookmark className="h-3.5 w-3.5" />
              <span>Lexical Resource & Spaced Repetition Engine</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              Academic Lexicon Vault
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Master academic collocations, precision definitions, and Cambridge exam contexts with spaced repetition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Deck Selector */}
            <div className="flex rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800">
              <button
                onClick={() => {
                  setActiveDeck('personal');
                  if (vocabulary.length > 0) setSelectedWord(vocabulary[0]);
                }}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeDeck === 'personal'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                My Vault ({vocabulary.length})
              </button>
              <button
                onClick={() => {
                  setActiveDeck('system');
                  setSelectedWord(systemIELTSVocabulary[0]);
                }}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeDeck === 'system'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                System ({systemIELTSVocabulary.length})
              </button>
            </div>

            {/* View Switcher */}
            <div className="flex rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800">
              <button
                onClick={() => setActiveView('inspect')}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeView === 'inspect'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeView === 'list'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                All Words
              </button>
              <button
                onClick={() => setActiveView('topics')}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeView === 'topics'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                Topics (200+)
              </button>
              <button
                onClick={() => {
                  setActiveView('flashcards');
                  setCardIdx(0);
                  setIsFlipped(false);
                }}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeView === 'flashcards'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => {
                  setActiveView('quiz');
                  setQuizIdx(0);
                  setQuizScore(0);
                  setSelectedQuizOpt(null);
                }}
                className={`rounded-full px-3 py-1.5 transition-all ${
                  activeView === 'quiz'
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                Quiz
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Word</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: DEEP FOCUS WORD SHOWCASE (Making the word itself the visual center) */}
      {activeView === 'inspect' && selectedWord && (
        <div className="space-y-6">
          {/* Main Hero Card for the Word */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:p-10">
            {/* Top Bar of Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 uppercase dark:border-sky-900/60 dark:bg-sky-950/60 dark:text-sky-300">
                  {selectedWord.partOfSpeech}
                </span>
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Band 7.5+ Lexical Resource
                </span>
              </div>

              {/* Status Selector & Save to Vault */}
              <div className="flex flex-wrap items-center gap-2">
                {!vocabulary.some((v) => v.id === selectedWord.id || v.word.toLowerCase() === selectedWord.word.toLowerCase()) ? (
                  <button
                    onClick={() => {
                      addVocabulary(selectedWord);
                      showToast(`Saved "${selectedWord.word}" to your Personal Vault!`);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-sky-700 active:scale-98 dark:bg-sky-600 dark:hover:bg-sky-500"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Save to My Vault</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Saved in Vault</span>
                  </span>
                )}

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mastery:</span>
                <select
                  value={selectedWord.status}
                  onChange={(e) => {
                    const newSt = e.target.value as any;
                    if (vocabulary.some((v) => v.id === selectedWord.id)) {
                      updateVocabularyStatus(selectedWord.id, newSt);
                    } else {
                      addVocabulary({ ...selectedWord, status: newSt });
                      showToast(`Saved "${selectedWord.word}" to your Personal Vault as ${newSt}!`);
                    }
                    setSelectedWord({ ...selectedWord, status: newSt });
                  }}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200"
                >
                  <option value="new">Newly Added</option>
                  <option value="learning">Active Learning</option>
                  <option value="review">Needs Review</option>
                  <option value="mastered">Mastered ✓</option>
                </select>
              </div>
            </div>

            {/* Central Word Typography Centerpiece */}
            <div className="py-8 text-center sm:py-12">
              <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                {selectedWord.word}
              </h2>

              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="font-mono text-base font-medium text-slate-400 dark:text-slate-500 sm:text-lg">
                  {selectedWord.ipa || '/səbˈstænʃəl/'}
                </span>

                <button
                  onClick={() => apiService.speakText(selectedWord.word, 'UK')}
                  className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 shadow-2xs hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/60 dark:text-sky-300"
                  title="Pronounce UK"
                >
                  <Volume2 className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  <span>🇬🇧 UK</span>
                </button>

                <button
                  onClick={() => apiService.speakText(selectedWord.word, 'US')}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  title="Pronounce US"
                >
                  <Volume2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>🇺🇸 US</span>
                </button>
              </div>

              {/* High-Impact Meaning Box */}
              <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-sky-100 bg-sky-50/50 p-4 shadow-2xs dark:border-sky-950/60 dark:bg-sky-950/30">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">Vietnamese Meaning</p>
                <p className="mt-1 text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                  {selectedWord.meaning}
                </p>
              </div>

              {/* Memory Strength Indicator */}
              <div className="mx-auto mt-6 max-w-sm space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Retention Strength:</span>
                  <span className={mem.textColor}>{mem.label} ({mem.pct}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full transition-all duration-500 ${mem.color}`} style={{ width: `${mem.pct}%` }} />
                </div>
              </div>
            </div>

            {/* Deep Focus Tabs: Collocations, IELTS Examples, Synonyms & Question Context */}
            <div className="grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 dark:border-slate-800 lg:grid-cols-3">
              {/* Collocations */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-850/60">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Essential Collocations
                  </h3>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Cambridge academic pairings that score Band 7.5+ in Writing
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(selectedWord.collocations && selectedWord.collocations.length > 0
                    ? selectedWord.collocations
                    : ['substantial impact', 'substantial progress', 'substantial amount', 'make a substantial contribution']
                  ).map((col, cIdx) => (
                    <span
                      key={cIdx}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synonyms & Nuances */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-850/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Synonyms & Register
                  </h3>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Formal alternatives for paraphrase diversity
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(selectedWord.synonyms && selectedWord.synonyms.length > 0
                    ? selectedWord.synonyms
                    : ['considerable', 'significant', 'marked', 'noteworthy', 'sizeable']
                  ).map((syn, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>

              {/* IELTS Exam Question Context */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-850/60">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    IELTS Question Context
                  </h3>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  How this word is tested in Cambridge prompts
                </p>

                <div className="mt-3 rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3 text-xs leading-relaxed text-slate-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-slate-300">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Writing Task 2 Prompt:</span>{' '}
                  "Some argue that governments should invest a{' '}
                  <span className="font-black text-sky-700 dark:text-sky-300 underline underline-offset-2">
                    substantial
                  </span>{' '}
                  portion of their budget in public transport rather than highways."
                </div>
              </div>
            </div>

            {/* IELTS Sentence Example */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-850">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Sentence Context</span>
              <p className="mt-1 text-sm italic font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                "{selectedWord.sourceContext || selectedWord.exampleSentence}"
              </p>
            </div>
          </div>

          {/* Quick Word Navigator Carousel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Switcher ({vocabulary.length} words)</h3>
              <button
                onClick={() => setActiveView('list')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                View full directory
              </button>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {vocabulary.map((w) => {
                const isSelected = selectedWord.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWord(w)}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-xs dark:border-sky-500 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span>{w.word}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({w.meaning.slice(0, 14)}...)</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL VAULT DIRECTORY & FILTER */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words, definitions, collocations..."
                className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-500"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1.5 overflow-x-auto text-xs font-semibold">
              {(['all', 'new', 'learning', 'review', 'mastered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-sky-600 text-white shadow-xs dark:bg-sky-600'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWords.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedWord(item);
                  setActiveView('inspect');
                }}
                className="group cursor-pointer flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-600"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400 transition-colors">
                          {item.word}
                        </h3>
                        <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                          {item.partOfSpeech}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-slate-400 dark:text-slate-500">{item.ipa}</p>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => apiService.speakText(item.word, 'UK')}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800 dark:hover:text-sky-400"
                        title="Pronounce UK"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteVocabulary(item.id)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="Delete word"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meaning */}
                  <div className="mt-3 rounded-xl border border-sky-50 bg-sky-50/40 p-2.5 dark:border-sky-950/60 dark:bg-sky-950/30">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.meaning}</p>
                  </div>

                  {/* Context sentence */}
                  {(item.sourceContext || item.exampleSentence) && (
                    <p className="mt-2.5 text-xs italic text-slate-600 line-clamp-2 dark:text-slate-300">
                      "{item.sourceContext || item.exampleSentence}"
                    </p>
                  )}
                </div>

                {/* Footer status pill */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Click to Focus
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredWords.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Bookmark className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">No words found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Try changing your search query or add a new word above.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW: 200+ IELTS TOPICS REGISTRY */}
      {activeView === 'topics' && (() => {
        const categories = ['all', 'Academic', 'Science', 'Nature', 'Society', 'Economy', 'Culture', 'Urban'];
        
        const filteredTopics = ieltsTopicsRegistry.filter((t) => {
          const matchCat = topicCategoryFilter === 'all' || t.category.toLowerCase() === topicCategoryFilter.toLowerCase();
          const matchSearch =
            !topicSearch ||
            t.name.toLowerCase().includes(topicSearch.toLowerCase()) ||
            t.category.toLowerCase().includes(topicSearch.toLowerCase());
          return matchCat && matchSearch;
        });

        const currentTopicData =
          initialVocabularyTopics.find((t) => t.id === selectedTopicId) ||
          initialVocabularyTopics[0];

        return (
          <div className="space-y-6">
            {/* Topic Filter & Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTopicCategoryFilter(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
                      topicCategoryFilter === cat
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  placeholder="Tìm topic (VD: Environment, AI)..."
                  className="w-full rounded-full border border-stone-200 bg-stone-50 pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-hidden dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Layout: Topics List (Left) + Selected Topic Lexicon Detail (Right) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Topics Grid Selector */}
              <div className="lg:col-span-4 space-y-2 max-h-[640px] overflow-y-auto pr-1">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-1">
                  Topics ({filteredTopics.length} / 200+ topics)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {filteredTopics.map((top) => {
                    const isSelected = selectedTopicId === top.id;
                    const hasDeepWords = initialVocabularyTopics.some((t) => t.id === top.id);

                    return (
                      <div
                        key={top.id}
                        onClick={() => setSelectedTopicId(top.id)}
                        className={`cursor-pointer rounded-2xl border p-3.5 transition-all text-left ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50/40 shadow-xs dark:border-amber-400/50 dark:bg-amber-950/20'
                            : 'border-stone-200/80 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {top.name}
                          </span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                            {top.nameVi || 'Band 7.5+'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400">
                          <span>{top.category}</span>
                          {hasDeepWords ? (
                            <span className="font-semibold text-amber-600 dark:text-amber-400">Curated Lexicon</span>
                          ) : (
                            <span>Core Topic</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Topic Deep Words Showcase */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          {currentTopicData.level} Lexicon
                        </span>
                        <span className="text-xs text-stone-400">• {currentTopicData.words.length} Academic Words</span>
                      </div>
                      <h2 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                        {currentTopicData.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          currentTopicData.words.forEach((w) => {
                            if (!vocabulary.some((v) => v.word.toLowerCase() === w.word.toLowerCase())) {
                              addVocabulary({
                                word: w.word,
                                meaning: w.meaning,
                                ipa: w.ipa,
                                partOfSpeech: w.partOfSpeech,
                                exampleSentence: w.exampleSentence,
                                collocations: w.collocations,
                                status: 'new',
                              });
                            }
                          });
                          showToast(`Added all words from "${currentTopicData.name}" to My Vault!`);
                        }}
                        className="rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-amber-400 dark:text-stone-950 transition-all"
                      >
                        + Add All to Vault
                      </button>
                    </div>
                  </div>

                  {/* Word Cards List for this Topic */}
                  <div className="mt-6 space-y-4">
                    {currentTopicData.words.map((w, idx) => {
                      const alreadyInVault = vocabulary.some(
                        (v) => v.word.toLowerCase() === w.word.toLowerCase()
                      );

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-stone-100 bg-[#FCFBF9] p-4.5 transition-all hover:border-amber-300 dark:border-stone-800 dark:bg-stone-850"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                                {w.word}
                              </h3>
                              <span className="font-mono text-xs text-stone-400">{w.ipa}</span>
                              <span className="rounded-md bg-stone-200/60 px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                {w.partOfSpeech}
                              </span>
                              <button
                                onClick={() => {
                                  apiService.speakText(w.word);
                                  showToast(`Playing audio for "${w.word}"...`);
                                }}
                                className="rounded-full p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              >
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              {!alreadyInVault ? (
                                <button
                                  onClick={() => {
                                    addVocabulary({
                                      word: w.word,
                                      meaning: w.meaning,
                                      ipa: w.ipa,
                                      partOfSpeech: w.partOfSpeech,
                                      exampleSentence: w.exampleSentence,
                                      collocations: w.collocations,
                                      status: 'learning',
                                    });
                                    showToast(`Saved "${w.word}" to Personal Vault!`);
                                  }}
                                  className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                                >
                                  <Bookmark className="h-3 w-3" />
                                  <span>Save</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Saved</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                            {w.meaning}
                          </div>

                          <div className="mt-2 rounded-xl bg-white p-3 border border-stone-100 text-xs italic text-stone-600 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300 font-serif">
                            "{w.exampleSentence}"
                          </div>

                          {w.collocations && w.collocations.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-stone-400 uppercase">
                                Collocations:
                              </span>
                              {w.collocations.map((col, ci) => (
                                <span
                                  key={ci}
                                  className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300"
                                >
                                  {col}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* VIEW 3: FLASHCARDS MODE */}
      {activeView === 'flashcards' && (
        activeVocabularyList.length > 0 ? (
          <div className="mx-auto max-w-md space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                Card {cardIdx + 1} of {activeVocabularyList.length} ({activeDeck === 'personal' ? 'My Vault' : 'System Library'})
              </span>
              <span>Tap card to flip</span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer select-none rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition-all hover:border-sky-300 min-h-[320px] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-600"
            >
              {!isFlipped ? (
                // FRONT
                <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    {activeVocabularyList[cardIdx % activeVocabularyList.length].partOfSpeech}
                  </span>
                  <h2 className="mt-6 text-3xl font-black uppercase tracking-wider text-slate-900 dark:text-white sm:text-4xl">
                    {activeVocabularyList[cardIdx % activeVocabularyList.length].word}
                  </h2>
                  <p className="mt-1 font-mono text-sm text-slate-400 dark:text-slate-500">{activeVocabularyList[cardIdx % activeVocabularyList.length].ipa}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      apiService.speakText(activeVocabularyList[cardIdx % activeVocabularyList.length].word, 'UK');
                    }}
                    className="mt-6 flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Volume2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <span>Listen UK</span>
                  </button>
                </div>
              ) : (
                // BACK
                <div className="space-y-4 flex-1 flex flex-col justify-center py-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Meaning</span>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{activeVocabularyList[cardIdx % activeVocabularyList.length].meaning}</p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs italic text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
                    "{activeVocabularyList[cardIdx % activeVocabularyList.length].sourceContext || activeVocabularyList[cardIdx % activeVocabularyList.length].exampleSentence}"
                  </div>

                  {activeVocabularyList[cardIdx % activeVocabularyList.length].collocations && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Collocations:</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{activeVocabularyList[cardIdx % activeVocabularyList.length].collocations?.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-center text-xs text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800 dark:text-slate-500">
                <span>{isFlipped ? 'Tap card to show word' : 'Tap card to show definition'}</span>
              </div>
            </div>

            {/* Flashcard Response Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const curr = activeVocabularyList[cardIdx % activeVocabularyList.length];
                  updateVocabularyStatus(curr.id, 'review');
                  setIsFlipped(false);
                  setCardIdx((prev) => (prev + 1) % activeVocabularyList.length);
                }}
                className="flex-1 rounded-2xl border border-amber-200 bg-amber-50 py-3 text-xs font-bold text-amber-800 hover:bg-amber-100 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Needs Review
              </button>
              <button
                onClick={() => {
                  const curr = activeVocabularyList[cardIdx % activeVocabularyList.length];
                  updateVocabularyStatus(curr.id, 'mastered');
                  setIsFlipped(false);
                  setCardIdx((prev) => (prev + 1) % activeVocabularyList.length);
                }}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                I Know This (Mastered)
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <Bookmark className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">Personal Deck is Empty</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              You haven't saved any words to your Personal Vault yet. Practice with the System Academic Deck to get started.
            </p>
            <button
              onClick={() => setActiveDeck('system')}
              className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
            >
              Practice with System Library
            </button>
          </div>
        )
      )}

      {/* VIEW 4: VOCABULARY QUIZ */}
      {activeView === 'quiz' && (
        activeVocabularyList.length >= 4 ? (
          <div className="mx-auto max-w-lg space-y-4">
            {(() => {
              const currentItem = activeVocabularyList[quizIdx % activeVocabularyList.length];
              const otherMeanings = activeVocabularyList
                .filter((v) => v.id !== currentItem.id)
                .map((v) => v.meaning)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
              const options = [currentItem.meaning, ...otherMeanings].sort(() => 0.5 - Math.random());

              return (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="text-xs font-bold text-sky-800 dark:text-sky-300">
                      Question {(quizIdx % activeVocabularyList.length) + 1} of {Math.min(10, activeVocabularyList.length)} ({activeDeck === 'personal' ? 'My Vault' : 'System Library'})
                    </span>
                    <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      Score: {quizScore}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Select the correct definition for:</span>
                    <h3 className="mt-1 text-2xl font-black uppercase text-slate-900 dark:text-white">{currentItem.word}</h3>
                    <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">{currentItem.ipa}</p>
                  </div>

                  <div className="space-y-2.5">
                    {options.map((opt, oIdx) => {
                      const isCorrect = opt === currentItem.meaning;
                      const isSelected = selectedQuizOpt === opt;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            if (selectedQuizOpt) return;
                            setSelectedQuizOpt(opt);
                            if (isCorrect) setQuizScore((s) => s + 1);
                          }}
                          className={`w-full rounded-xl border p-3.5 text-left text-xs font-medium transition-all ${
                            selectedQuizOpt
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : isSelected
                                ? 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-600'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-slate-750'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedQuizOpt && (
                    <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedQuizOpt(null);
                          setQuizIdx((prev) => (prev + 1) % Math.min(10, activeVocabularyList.length));
                        }}
                        className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500"
                      >
                        Next Question →
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <Bookmark className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">Need at least 4 words for a Quiz</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your personal vault has {vocabulary.length} words. You can take a quiz right now using the 20-word Cambridge System Deck.
            </p>
            <button
              onClick={() => setActiveDeck('system')}
              className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
            >
              Take Quiz with System Library
            </button>
          </div>
        )
      )}

      {/* Manual Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleManualAdd}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Word to Lexicon Vault</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Word / Collocation</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. corroborate"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Part of Speech</label>
                <select
                  value={newPos}
                  onChange={(e) => setNewPos(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-500"
                >
                  <option value="adjective">Adjective</option>
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adverb">Adverb</option>
                  <option value="phrase">Academic Collocation / Phrase</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Vietnamese Meaning / Định nghĩa</label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="e.g. xác thực, chứng thực bằng chứng cớ"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Context Sentence / IELTS Example</label>
                <textarea
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="The experimental findings corroborate the hypothesis..."
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                Save Word
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
