import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import {
  Bot,
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
    content: `Hello. I am your Cambridge-aligned **IELTS Mentor**, tailored to your goal of **Band ${targetBand}**. Which question, prompt, or linguistic structure would you like to review today?`,
    timestamp: 'Just now',
  },
];

export const AITutorModule: React.FC = () => {
  const { userProfile, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialGreeting(userProfile.targetBand));
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<TutorPersona>('examiner');
  const [langPreference, setLangPreference] = useState<'bilingual' | 'english' | 'vietnamese'>('bilingual');
  const [expandedCorrections, setExpandedCorrections] = useState<Record<string, boolean>>({});

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
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Bot className="h-3.5 w-3.5" />
              <span>Mentor Studio • Cambridge Rubric Calibrated</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              AI Tutor & Study Companion
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Select your persona mode: official examiner rubric breakdown, friendly coaching, or surgical grammar precision.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <select
              value={langPreference}
              onChange={(e) => setLangPreference(e.target.value as any)}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-hidden dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <option value="bilingual">Bilingual (EN + VI)</option>
              <option value="english">English Only</option>
              <option value="vietnamese">Tiếng Việt</option>
            </select>

            <button
              onClick={handleResetChat}
              className="rounded-full border border-stone-200 bg-white p-2 text-stone-500 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
              title="Reset Chat"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tutor Persona Selector */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isSelected = activePersona === p.id;

          return (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-stone-900 bg-white shadow-2xs dark:border-stone-100 dark:bg-stone-850'
                  : 'border-stone-200/70 bg-white/60 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <h4
                className={`mt-2 text-xs font-semibold ${
                  isSelected ? 'text-stone-950 dark:text-white' : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {p.name}
              </h4>
              <p className="mt-0.5 text-[11px] text-stone-400 dark:text-stone-500 line-clamp-1">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Action Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_ACTION_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 rounded-full border border-stone-200/70 bg-white/80 px-3.5 py-1.5 text-xs text-stone-700 transition-all hover:bg-white dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
          >
            <span className="flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3 text-amber-600" />
              {prompt}
            </span>
          </button>
        ))}
      </div>

      {/* Chat Canvas */}
      <div className="flex h-[560px] flex-col rounded-3xl border border-stone-200/80 bg-white shadow-2xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const personaObj = PERSONAS.find((p) => p.id === (msg.persona || 'examiner'));
            const PersonaIcon = personaObj?.icon || Sparkles;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isUser
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
                  }`}
                >
                  {isUser ? userProfile.name.charAt(0) : <PersonaIcon className="h-3.5 w-3.5" />}
                </div>

                <div className="max-w-[85%] sm:max-w-[78%] space-y-2">
                  <div
                    className={`rounded-2xl p-4.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-stone-900 text-white font-medium dark:bg-stone-100 dark:text-stone-900'
                        : 'border border-stone-100 bg-[#FAF9F5] text-stone-800 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200 font-serif'
                    }`}
                  >
                    {!isUser && personaObj && (
                      <div className="mb-2 flex items-center justify-between border-b border-stone-200/60 pb-1.5 dark:border-stone-750 font-sans">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                          {personaObj.name}
                        </span>
                        <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                    {!isUser && (
                      <div className="mt-3 flex items-center justify-between border-t border-stone-200/60 pt-2 text-[11px] text-stone-400 dark:border-stone-750 font-sans">
                        <button
                          onClick={() =>
                            apiService.speakText(msg.content.replace(/[*_#]/g, ''), 'UK')
                          }
                          className="flex items-center gap-1 font-medium hover:text-stone-800 dark:hover:text-stone-200"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span>Listen Tutor Audio</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.corrections && (
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#FCFBF8] text-xs dark:border-stone-800 dark:bg-stone-850">
                      <button
                        onClick={() => toggleCorrection(msg.id)}
                        className="flex w-full items-center justify-between p-3 text-left font-medium text-stone-800 dark:text-stone-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                          Surgical Grammar & Lexicon Upgrade
                        </span>
                        {expandedCorrections[msg.id] ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {expandedCorrections[msg.id] && (
                        <div className="space-y-1.5 border-t border-stone-200/70 p-3 pt-2 text-stone-700 dark:border-stone-800 dark:text-stone-300">
                          <p>
                            <span className="text-stone-400">Original:</span> "{msg.corrections.original}"
                          </p>
                          <p className="font-medium text-stone-900 dark:text-white">
                            <span className="text-stone-400">Band 8.0+:</span> "{msg.corrections.improved}"
                          </p>
                          <p className="text-[11px] text-stone-400 italic">
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
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-600 dark:text-stone-400" />
              <span>Analyzing Cambridge assessment context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-stone-100 p-4 dark:border-stone-800">
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
              } about IELTS target Band ${userProfile.targetBand}...`}
              className="flex-1 rounded-full border border-stone-200 bg-[#FAF9F5] px-5 py-3 text-xs sm:text-sm text-stone-900 focus:border-stone-400 focus:bg-white focus:outline-hidden dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm hover:bg-stone-800 disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
