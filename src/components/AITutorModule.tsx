import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../context/AppContext';
import { apiService, TutorChatOptions } from '../services/apiService';
import { NovaSymbol } from './NovaLogo';
import { NovaOrb } from './NovaOrb';
import { NovaVoiceDialog } from './NovaVoiceDialog';
import {
  Sparkles,
  Send,
  Loader2,
  Volume2,
  RotateCcw,
  Lightbulb,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Mic,
  Square,
  Copy,
  Check,
  AlertCircle,
  Activity,
  Layers,
  BookOpen,
  PenTool,
  MessageSquare,
  Wand2,
} from 'lucide-react';

export type TutorPersona = 'examiner' | 'study_buddy' | 'grammar_doctor' | 'vocab_coach';
export type TutorLearningMode = 'auto' | 'speaking' | 'writing' | 'reading' | 'vocab' | 'grammar';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: TutorPersona;
  mode?: string;
  modelUsed?: string;
  latencyMs?: number;
  isStreaming?: boolean;
  error?: {
    message: string;
    code?: string;
  };
  corrections?: {
    original: string;
    improved: string;
    explanation: string;
  };
}

const PERSONAS: {
  id: TutorPersona;
  name: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
  tone: string;
}[] = [
  {
    id: 'examiner',
    name: 'Examiner Mode',
    desc: 'Rigorous scoring & rubric criteria',
    icon: ShieldCheck,
    tone: 'Strict Cambridge standard evaluation',
  },
  {
    id: 'study_buddy',
    name: 'Study Companion',
    desc: 'Encouraging & concise advice',
    icon: UserCheck,
    tone: 'Supportive guidance and confidence building',
  },
  {
    id: 'grammar_doctor',
    name: 'Grammar Doctor',
    desc: 'Syntactic upgrades & correction',
    icon: Stethoscope,
    tone: 'Deep syntactic analysis and error remediation',
  },
  {
    id: 'vocab_coach',
    name: 'Vocabulary Coach',
    desc: 'Collocations & C1/C2 idioms',
    icon: GraduationCap,
    tone: 'Lexical resource elevation to Band 8+',
  },
];

const LEARNING_MODES: {
  id: TutorLearningMode;
  name: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'auto', name: 'Smart Auto', icon: Wand2 },
  { id: 'speaking', name: 'Speaking', icon: Mic },
  { id: 'writing', name: 'Writing', icon: PenTool },
  { id: 'reading', name: 'Reading', icon: BookOpen },
  { id: 'vocab', name: 'Vocabulary', icon: GraduationCap },
  { id: 'grammar', name: 'Grammar', icon: Stethoscope },
];

const QUICK_ACTION_PROMPTS = [
  'Explain the Present Perfect tense with IELTS Band 7+ examples',
  'Give me Band 8 synonyms and collocations for "crucial" and "problem"',
  "Let's practice Speaking Part 1 questions on Hometown",
  'Check my Task 2 thesis statement for cohesion and lexical range',
  'Giải thích sự khác biệt giữa Band 6 và Band 7 môn Speaking',
];

const getInitialGreeting = (targetBand: string): ChatMessage[] => [
  {
    id: 'welcome',
    role: 'assistant',
    persona: 'examiner',
    content: `Hello! I am your Cambridge-calibrated **NOVA AI IELTS Mentor**, tuned to your target of **Band ${targetBand}**.\n\nYou can ask me grammar questions, share essay drafts, practice Speaking prompts, or ask for explanations in **English** or **Tiếng Việt**. What would you like to master today?`,
    timestamp: 'Just now',
    modelUsed: 'gemini-3.1-flash-lite',
  },
];

export const AITutorModule: React.FC = () => {
  const { userProfile, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialGreeting(userProfile.targetBand)
  );
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activePersona, setActivePersona] = useState<TutorPersona>('examiner');
  const [activeMode, setActiveMode] = useState<TutorLearningMode>('auto');
  const [langPreference, setLangPreference] = useState<'bilingual' | 'english' | 'vietnamese'>('bilingual');
  const [expandedCorrections, setExpandedCorrections] = useState<Record<string, boolean>>({});
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Diagnostics info
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [diagData, setDiagData] = useState<{
    status: string;
    configured: boolean;
    model: string;
    reachable: boolean;
    latencyMs: number;
    error: string | null;
  } | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const toggleCorrection = (msgId: string) => {
    setExpandedCorrections((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Copied to clipboard');
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
    );
  };

  const handleFetchDiagnostics = async () => {
    setDiagLoading(true);
    setShowDiagModal(true);
    try {
      const res = await apiService.getDiagnostics();
      setDiagData(res);
    } catch (err: any) {
      setDiagData({
        status: 'error',
        configured: false,
        model: 'unknown',
        reachable: false,
        latencyMs: 0,
        error: err?.message || 'Failed to ping Gemini backend',
      });
    } finally {
      setDiagLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string, isRetry = false) => {
    const text = (textToSend || inputText).trim();
    if (!text || isStreaming) return;

    // Abort previous if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    let updatedMessages: ChatMessage[];

    if (isRetry) {
      // Remove previous failed assistant message
      updatedMessages = messages.filter((m) => !m.error);
    } else {
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updatedMessages = [...messages, userMsg];
      setInputText('');
    }

    // Add assistant placeholder
    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      persona: activePersona,
      mode: activeMode,
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages([...updatedMessages, assistantPlaceholder]);
    setIsStreaming(true);

    // Prepare history payload for API
    const historyPayload = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const options: TutorChatOptions = {
      messages: historyPayload,
      userBand: userProfile.currentBand || '6.0',
      targetBand: userProfile.targetBand || '7.5',
      languagePreference: langPreference,
      mode: activeMode === 'auto' ? undefined : activeMode,
      persona: activePersona,
      sessionContext: `User is studying on IELTS NOVA AI. Target Band is ${userProfile.targetBand}.`,
    };

    let accumulatedText = '';

    await apiService.tutorChatStream(
      options,
      {
        onChunk: (chunk: string) => {
          accumulatedText += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: accumulatedText }
                : msg
            )
          );
        },
        onDone: (fullText: string, meta) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: fullText || accumulatedText,
                    isStreaming: false,
                    modelUsed: meta.modelUsed,
                    latencyMs: meta.latencyMs,
                  }
                : msg
            )
          );
        },
        onError: (err) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    isStreaming: false,
                    error: {
                      message: err.message,
                      code: err.code,
                    },
                  }
                : msg
            )
          );
        },
      },
      abortController.signal
    );
  };

  const handleResetChat = () => {
    if (isStreaming) {
      handleStopGeneration();
    }
    setMessages(getInitialGreeting(userProfile.targetBand));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* SECTION: ELEGANT CONVERSATIONAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5 dark:border-stone-800">
        <div className="flex items-center gap-3.5">
          <NovaOrb size="sm" state={isStreaming ? 'thinking' : 'idle'} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                NOVA AI TUTOR CORE V4
              </span>
              <button
                onClick={handleFetchDiagnostics}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors"
                title="View AI Diagnostics"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111318] dark:text-white uppercase">
              NOVA AI Mentor
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Instant Voice Option */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Voice Mode</span>
          </button>

          {/* Language preference dropdown */}
          <select
            value={langPreference}
            onChange={(e) => setLangPreference(e.target.value as any)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#111318] focus:outline-hidden dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
            aria-label="Language Mode"
          >
            <option value="bilingual">Bilingual (EN + VI)</option>
            <option value="english">English Only</option>
            <option value="vietnamese">Tiếng Việt</option>
          </select>

          {/* Reset chat button */}
          <button
            onClick={handleResetChat}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#5F6368] hover:text-[#111318] hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            title="Reset Chat"
            aria-label="Reset Chat"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Bar (Smart Auto, Speaking, Writing, Reading, Vocab, Grammar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400 shrink-0 mr-1 flex items-center gap-1">
          <Layers className="h-3 w-3" /> Focus:
        </span>
        {LEARNING_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-[#5F6368] hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{mode.name}</span>
            </button>
          );
        })}
      </div>

      {/* Persona Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isSelected = activePersona === p.id;

          return (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs dark:border-indigo-400 dark:bg-indigo-950/40'
                  : 'border-stone-200/80 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 text-[#5F6368] dark:bg-stone-800 dark:text-stone-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="overflow-hidden">
                <h4
                  className={`text-xs font-bold truncate ${
                    isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#111318] dark:text-white'
                  }`}
                >
                  {p.name}
                </h4>
                <p className="text-[10px] text-[#5F6368] dark:text-stone-400 truncate">
                  {p.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_ACTION_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            disabled={isStreaming}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-[#5F6368] hover:border-indigo-200 hover:text-indigo-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 transition-colors disabled:opacity-50"
          >
            <Lightbulb className="h-3 w-3 text-amber-500 shrink-0" />
            <span className="truncate max-w-xs">{p}</span>
          </button>
        ))}
      </div>

      {/* Large Centered Dialogue Area */}
      <div className="flex h-[560px] flex-col rounded-2xl border border-stone-200/90 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const personaObj = PERSONAS.find((p) => p.id === (msg.persona || 'examiner'));

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isUser
                      ? 'bg-[#111318] text-white dark:bg-white dark:text-[#111318]'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}
                >
                  {isUser ? userProfile.name.charAt(0) : <NovaSymbol size={18} variant="indigo" />}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[85%] sm:max-w-[82%] space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-stone-100 text-[#111318] dark:bg-stone-800 dark:text-white'
                        : 'border border-stone-200/80 bg-white text-[#111318] shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-2 flex items-center justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {personaObj?.name || 'NOVA AI'}
                          </span>
                          {msg.modelUsed && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                              {msg.modelUsed}
                            </span>
                          )}
                          {msg.latencyMs && (
                            <span className="text-[9px] text-stone-400">
                              {(msg.latencyMs / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#5F6368] dark:text-stone-500">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    {/* Content / Markdown / Stream */}
                    {msg.error ? (
                      <div className="space-y-2 py-1">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{msg.error.message}</span>
                        </div>
                        <button
                          onClick={() => handleSendMessage(undefined, true)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Retry question</span>
                        </button>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-[#111318] dark:text-stone-100 leading-relaxed space-y-2">
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <>
                            <div className="markdown-content">
                              <Markdown>{msg.content || (msg.isStreaming ? '...' : '')}</Markdown>
                            </div>
                            {msg.isStreaming && (
                              <span className="inline-block h-3.5 w-1.5 bg-indigo-600 animate-pulse ml-1 align-middle rounded-xs" />
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Action buttons (Listen, Copy) */}
                    {!isUser && !msg.error && msg.content && (
                      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-[11px] text-[#5F6368] dark:border-stone-800">
                        <button
                          onClick={() =>
                            apiService.speakText(msg.content.replace(/[*_#`]/g, ''), 'UK')
                          }
                          className="flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Listen (UK)</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[#5F6368] hover:text-[#111318] dark:hover:text-stone-200 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-[10px] text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span className="text-[10px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Corrections upgrade */}
                  {msg.corrections && (
                    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white text-xs dark:border-stone-800 dark:bg-stone-900">
                      <button
                        onClick={() => toggleCorrection(msg.id)}
                        className="flex w-full items-center justify-between p-3 text-left font-bold text-[#111318] dark:text-stone-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Surgical Band 8.0 Recommendation</span>
                        </span>
                        {expandedCorrections[msg.id] ? (
                          <ChevronUp className="h-3.5 w-3.5 text-[#5F6368]" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-[#5F6368]" />
                        )}
                      </button>
                      {expandedCorrections[msg.id] && (
                        <div className="border-t border-stone-100 bg-stone-50 p-3 space-y-2 dark:border-stone-800 dark:bg-stone-850">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Original:</span>
                            <p className="mt-0.5 text-xs text-[#5F6368] line-through dark:text-stone-400">{msg.corrections.original}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Band 8+ Equivalent:</span>
                            <p className="mt-0.5 text-xs font-bold text-[#111318] dark:text-white">{msg.corrections.improved}</p>
                          </div>
                          <p className="text-[11px] text-[#5F6368] italic">
                            {msg.corrections.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice & Text options */}
        <div className="border-t border-stone-100 p-3.5 sm:p-4 bg-white dark:border-stone-800 dark:bg-stone-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isStreaming
                  ? 'NOVA is generating response...'
                  : `Ask ${PERSONAS.find((p) => p.id === activePersona)?.name} about Band ${userProfile.targetBand}...`
              }
              disabled={isStreaming}
              className="flex-1 rounded-xl border border-stone-200/90 bg-white px-4 py-2.5 text-xs sm:text-sm text-[#111318] placeholder:text-[#5F6368] focus:border-indigo-600 focus:outline-hidden dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 disabled:bg-stone-50 dark:disabled:bg-stone-850"
            />

            {/* Instant Voice Trigger */}
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-indigo-600 hover:bg-indigo-50 dark:border-stone-800 dark:bg-stone-900 dark:text-indigo-400 transition-colors"
              title="Voice Mode"
              aria-label="Voice Mode"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Send or Stop button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="flex h-10 px-3.5 items-center justify-center gap-1.5 rounded-xl bg-stone-900 text-white shadow-xs hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 transition-all font-semibold text-xs"
                title="Stop generation"
                aria-label="Stop generation"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 disabled:opacity-30 transition-all"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Diagnostics Modal */}
      {showDiagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-[#111318] dark:text-white">
                  NOVA AI System Diagnostics
                </h3>
              </div>
              <button
                onClick={() => setShowDiagModal(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              {diagLoading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>Pinging Gemini infrastructure...</span>
                </div>
              ) : diagData ? (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-stone-50 p-2.5 dark:bg-stone-800">
                    <span className="text-stone-500">API Key Configured:</span>
                    <span className={`font-bold ${diagData.configured ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {diagData.configured ? 'Valid (Server Secret)' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-stone-50 p-2.5 dark:bg-stone-800">
                    <span className="text-stone-500">Active Model:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {diagData.model}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-stone-50 p-2.5 dark:bg-stone-800">
                    <span className="text-stone-500">Reachability:</span>
                    <span className={`font-bold ${diagData.reachable ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {diagData.reachable ? 'Reachable (OK)' : 'Unreachable'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-stone-50 p-2.5 dark:bg-stone-800">
                    <span className="text-stone-500">Roundtrip Latency:</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-200">
                      {diagData.latencyMs} ms
                    </span>
                  </div>
                  {diagData.error && (
                    <div className="rounded-lg bg-rose-50 p-2.5 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <span className="font-bold">Error:</span> {diagData.error}
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleFetchDiagnostics}
                className="rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Re-test
              </button>
              <button
                onClick={() => setShowDiagModal(false)}
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Companion Dialog */}
      <NovaVoiceDialog isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
