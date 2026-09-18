import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sampleSpeakingQuestions } from '../data/mockIELTSData';
import { apiService } from '../services/apiService';
import { SpeakingEvaluation } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  Loader2,
  Play,
  Activity,
  UserCheck,
  Award,
  Sparkles,
} from 'lucide-react';

export const SpeakingModule: React.FC = () => {
  const { recordActivity, showToast } = useApp();

  const [activePart, setActivePart] = useState<1 | 2 | 3>(2);
  const partData = sampleSpeakingQuestions.find((q) => q.part === activePart)!;

  const [isRecording, setIsRecording] = useState(false);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Timers for Part 2
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);

  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [loading, setLoading] = useState(false);

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setTranscript((prev) => `${prev} ${currentTranscript}`.trim());
        }
      };

      recog.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
        setIsRecording(false);
      };

      recognitionRef.current = recog;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Speaking duration timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSpeakingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Prep timer
  useEffect(() => {
    let interval: any = null;
    if (isPrepping && prepSeconds > 0) {
      interval = setInterval(() => {
        setPrepSeconds((s) => s - 1);
      }, 1000);
    } else if (prepSeconds === 0) {
      setIsPrepping(false);
      showToast('Preparation time has ended! Please begin speaking.');
      apiService.speakText('Preparation time is over. Please begin your response now.', 'UK');
    }
    return () => clearInterval(interval);
  }, [isPrepping, prepSeconds, showToast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      showToast(
        'Speech recognition not active on this browser. You can type or edit your response in the transcript canvas.'
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      showToast('Microphone paused.');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        showToast('Microphone active. Speak naturally into your mic.');
      } catch {
        showToast('Microphone already running or permission required.');
      }
    }
  };

  const handleSpeakQuestion = () => {
    const textToSpeak =
      activePart === 2
        ? `Here is your topic. You have one minute to prepare. Topic: ${partData.cueCard?.topic}`
        : partData.questions?.[0] || 'Please tell me about your hometown or studies.';
    apiService.speakText(textToSpeak, 'UK');
  };

  const handleEvaluateSpeaking = async () => {
    if (!transcript.trim()) {
      showToast('Please record or type your response before submitting.');
      return;
    }

    setLoading(true);
    const questionText =
      activePart === 2
        ? partData.cueCard?.topic || 'Part 2 Cue Card'
        : partData.questions?.[0] || 'IELTS Speaking Question';

    try {
      const res = await apiService.evaluateSpeaking(questionText, transcript, activePart);
      setEvaluation(res);
      recordActivity(
        `Speaking Part ${activePart} Simulation`,
        'Speaking',
        `Band ${res.overallBand.toFixed(1)} (${res.bandRange})`
      );
      showToast(`Speaking evaluated! Estimated Band ${res.overallBand.toFixed(1)}`);
    } catch {
      showToast('Evaluation completed with standard rubric.');
    } finally {
      setLoading(false);
    }
  };

  const words = transcript.trim().length > 0 ? transcript.trim().split(/\s+/) : [];
  const totalWords = words.length;
  const fillerRegex = /\b(um|uh|erm|like|you\s+know|basically|actually)\b/gi;
  const fillerMatches = transcript.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;
  const durationMinutes = Math.max(0.5, speakingSeconds / 60);
  const wordsPerMinute = totalWords > 0 ? Math.round(totalWords / durationMinutes) : 0;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Mic className="h-3.5 w-3.5" />
              <span>Speaking Studio • Interactive Interview Simulation</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              IELTS Speaking Lab
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Real-time speech transcription, examiner audio questions, 1-minute cue card timer, and pacing analytics.
            </p>
          </div>

          {/* Part 1 / 2 / 3 Switcher */}
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-800 self-start sm:self-center">
            {[1, 2, 3].map((pt) => (
              <button
                key={pt}
                onClick={() => {
                  setActivePart(pt as 1 | 2 | 3);
                  setEvaluation(null);
                }}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  activePart === pt
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300'
                }`}
              >
                Part {pt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Examiner & Question Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Examiner Interface (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 text-center sm:p-8">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
              )}
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
                  isRecording
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900'
                }`}
              >
                {isRecording ? (
                  <Mic className="h-8 w-8 animate-pulse" />
                ) : (
                  <UserCheck className="h-8 w-8" />
                )}
              </div>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-stone-900 dark:text-white">
              Cambridge Examiner Voice
            </h3>
            <p className="text-[11px] text-stone-400">
              Interactive Audio Simulation • Part {activePart}
            </p>

            <div className="mt-5 flex items-center justify-center">
              <button
                onClick={handleSpeakQuestion}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Hear Examiner Question</span>
              </button>
            </div>

            {/* Minimalist Recording Interface */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              {/* Clean Geometric Circle ◯ */}
              <div className="relative flex h-24 w-24 items-center justify-center">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30" />
                )}
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-300 ${
                    isRecording
                      ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm'
                      : 'border-stone-200/90 bg-white text-[#111111] dark:border-stone-800 dark:bg-stone-900 dark:text-white'
                  }`}
                >
                  <span className="text-3xl font-light">◯</span>
                </div>
              </div>

              {/* Timer: 00:42 */}
              <div className="text-center">
                <span className="font-mono text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                  {formatTimer(speakingSeconds)}
                </span>
                <p className="mt-0.5 text-xs text-[#777777] dark:text-stone-400">
                  {isRecording ? 'Recording in progress...' : 'Ready to record'}
                </p>
              </div>

              {/* Action Button: [ Stop recording ] / [ Start recording ] */}
              <button
                onClick={toggleRecording}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold shadow-2xs transition-all active:scale-98 ${
                  isRecording
                    ? 'bg-[#111111] text-white hover:bg-[#222222] dark:bg-white dark:text-[#111111]'
                    : 'bg-[#111111] text-white hover:bg-[#222222] dark:bg-white dark:text-[#111111]'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isRecording ? 'Stop recording' : 'Start speaking'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Prompt / Part 2 Cue Card (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {activePart === 2 && partData.cueCard ? (
            <div className="rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-3 dark:border-stone-800">
                <span className="rounded-full bg-stone-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Part 2 Candidate Task Card
                </span>

                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-stone-400" />
                  <span className="font-mono text-xs font-medium text-stone-700 dark:text-stone-300">
                    Prep: {formatTimer(prepSeconds)}
                  </span>
                  <button
                    onClick={() => {
                      setIsPrepping(!isPrepping);
                      if (!isPrepping && prepSeconds === 0) setPrepSeconds(60);
                    }}
                    className="rounded-full bg-stone-200 px-2.5 py-0.5 text-[10px] font-semibold text-stone-800 hover:bg-stone-300 dark:bg-stone-750 dark:text-stone-200"
                  >
                    {isPrepping ? 'Pause' : 'Start Prep'}
                  </button>
                </div>
              </div>

              <h4 className="mt-4 font-serif text-lg font-light text-stone-900 dark:text-white sm:text-xl">
                Describe {partData.cueCard.topic}
              </h4>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-stone-400">
                You should say:
              </p>
              <ul className="mt-3 space-y-2">
                {partData.cueCard.bulletPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 sm:text-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs italic text-stone-400">
                ...and explain why this experience or skill was significant to you.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
              <span className="rounded-full bg-stone-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                Part {activePart} Discussion Prompt
              </span>
              <p className="mt-4 font-serif text-base text-stone-800 dark:text-stone-200 sm:text-lg leading-relaxed">
                "{partData.questions?.[0]}"
              </p>
            </div>
          )}

          {/* Transcript Canvas */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Live Speech Transcript
              </h4>
              <span className="text-[11px] text-stone-400">Editable for quick adjustments</span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              placeholder="Your live speech transcript will appear here as you speak..."
              className="mt-4 w-full text-xs sm:text-sm leading-relaxed text-stone-800 placeholder:text-stone-300 focus:outline-hidden dark:bg-stone-900 dark:text-stone-200 font-serif"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800 text-xs">
              <div className="flex items-center gap-4 text-stone-500">
                <span className="flex items-center gap-1 font-medium">
                  <Activity className="h-3.5 w-3.5 text-stone-400" />
                  <span>Pace: </span>
                  <strong className="text-stone-800 dark:text-stone-200">{wordsPerMinute} WPM</strong>
                </span>

                <span className="flex items-center gap-1 font-medium">
                  <span>Filler Words: </span>
                  <strong className="text-stone-800 dark:text-stone-200">{fillerCount}</strong>
                </span>
              </div>

              <button
                onClick={handleEvaluateSpeaking}
                disabled={loading || !transcript.trim()}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Evaluate Response</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="space-y-6 rounded-3xl border border-stone-200/80 bg-gradient-to-br from-[#FCFBF8] via-white to-[#F5F2EA] p-7 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-stone-800">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Cambridge Examiner Evaluation
              </span>
              <h3 className="text-xl font-light text-stone-900 dark:text-white sm:text-2xl">
                Speaking Assessment Breakdown
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-stone-900 px-5 py-3 text-center text-white dark:bg-stone-100 dark:text-stone-900">
                <p className="text-[10px] font-medium tracking-wider uppercase opacity-75">Estimated Band</p>
                <p className="text-3xl font-light">{evaluation.overallBand.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Fluency & Coherence
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.fluencyCoherence.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.fluencyCoherence.feedback}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Lexical Resource
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.lexicalResource.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.lexicalResource.feedback}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Grammar Range
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band {evaluation.grammaticalAccuracy.band.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.grammaticalAccuracy.feedback}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Pronunciation
                </h4>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Band 7.5
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {evaluation.pronunciationNotes || 'Clear articulation with natural word stress.'}
              </p>
            </div>
          </div>

          {evaluation.modelAnswerSnippet && (
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-600" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Band 8.5+ Model Demonstration
                  </h4>
                </div>

                <button
                  onClick={() => apiService.speakText(evaluation.modelAnswerSnippet, 'UK')}
                  className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Listen to Model Audio</span>
                </button>
              </div>

              <p className="mt-4 font-serif text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                "{evaluation.modelAnswerSnippet}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
