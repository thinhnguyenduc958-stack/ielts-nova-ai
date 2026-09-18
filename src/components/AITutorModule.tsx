import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
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
} from 'lucide-react';

type TutorPersona = 'examiner' | 'study_buddy' | 'grammar_doctor' | 'vocab_coach';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: TutorPersona;
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

const QUICK_ACTION_PROMPTS = [
  'Explain why option B was incorrect in Reading',
  'Give me Band 8 synonyms for "crucial" and "problem"',
  'Check my Task 2 thesis statement for coherence',
  'Practice Speaking Part 1 questions on Hometown',
];

const getInitialGreeting = (targetBand: string): ChatMessage[] => [
  {
    id: 'welcome',
    role: 'assistant',
    persona: 'examiner',
    content: `Hello! I am your Cambridge-aligned **NOVA AI IELTS Mentor**, calibrated to your goal of **Band ${targetBand}**. Which question, prompt, or linguistic structure would you like to master today?`,
    timestamp: 'Just now',
  },
];

export const AITutorModule: React.FC = () => {
  const { userProfile, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialGreeting(userProfile.targetBand)
  );
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<TutorPersona>('examiner');
  const [langPreference, setLangPreference] = useState<'bilingual' | 'english' | 'vietnamese'>('bilingual');
  const [expandedCorrections, setExpandedCorrections] = useState<Record<string, boolean>>({});
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleCorrection = (msgId: string) => {
    setExpandedCorrections((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const promptWithPersona = `[Persona: ${activePersona} - ${
        PERSONAS.find((p) => p.id === activePersona)?.tone
      }]. ${text} (Explain in ${langPreference} format, tailored for someone targeting IELTS Band ${userProfile.targetBand})`;

      const response = await apiService.askAITutor(promptWithPersona, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        persona: activePersona,
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        corrections:
          text.toLowerCase().includes('check') || text.toLowerCase().includes('thesis')
            ? {
                original: text,
                improved:
                  'While some contend that technological disruption eliminates employment, I maintain that it primarily cultivates specialized vocations.',
                explanation:
                  'Incorporates concession clause ("While some contend...") and academic collocation ("cultivates specialized vocations").',
              }
            : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      showToast('Tutor response interrupted. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(getInitialGreeting(userProfile.targetBand));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* SECTION 22: ELEGANT CONVERSATIONAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5 dark:border-stone-800">
        <div className="flex items-center gap-3.5">
          <NovaOrb size="sm" state={loading ? 'thinking' : 'idle'} />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              CONVERSATIONAL INTELLIGENCE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111318] dark:text-white uppercase">
              NOVA AI Tutor
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Instant Voice Option */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Voice Mode</span>
          </button>

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
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-[#5F6368] hover:border-indigo-200 hover:text-indigo-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 transition-colors"
          >
            <Lightbulb className="h-3 w-3 text-amber-500" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Large Centered Dialogue Area */}
      <div className="flex h-[540px] flex-col rounded-2xl border border-stone-200/90 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 overflow-hidden">
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
                <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-stone-100 text-[#111318] dark:bg-stone-800 dark:text-white'
                        : 'border border-stone-200/80 bg-white text-[#111318] shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {!isUser && personaObj && (
                      <div className="mb-2 flex items-center justify-between border-b border-stone-100 pb-1.5 dark:border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {personaObj.name}
                        </span>
                        <span className="text-[10px] text-[#5F6368] dark:text-stone-500">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed text-[#111318] dark:text-stone-100">
                      {msg.content}
                    </div>

                    {!isUser && (
                      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-[11px] text-[#5F6368] dark:border-stone-800">
                        <button
                          onClick={() =>
                            apiService.speakText(msg.content.replace(/[*_#]/g, ''), 'UK')
                          }
                          className="flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Listen audio</span>
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

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#5F6368] dark:text-stone-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>NOVA is thinking and aligning with Cambridge descriptors...</span>
            </div>
          )}

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
              placeholder={`Ask ${
                PERSONAS.find((p) => p.id === activePersona)?.name
              } about target Band ${userProfile.targetBand}...`}
              className="flex-1 rounded-xl border border-stone-200/90 bg-white px-4 py-2.5 text-xs sm:text-sm text-[#111318] placeholder:text-[#5F6368] focus:border-indigo-600 focus:outline-hidden dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
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

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 disabled:opacity-30 transition-all"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Voice Companion Dialog */}
      <NovaVoiceDialog isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
