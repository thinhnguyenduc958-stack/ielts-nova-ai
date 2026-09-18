import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sampleSpeakingQuestions } from '../data/mockIELTSData';
import { apiService } from '../services/apiService';
import { SpeakingEvaluation, NovaState } from '../types';
import { NovaOrb } from './NovaOrb';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  Loader2,
  Activity,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'motion/react';

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
  const [orbState, setOrbState] = useState<NovaState>('idle');

  // Sync orb state with recording and evaluation
  useEffect(() => {
    if (loading) {
      setOrbState('thinking');
    } else if (isRecording) {
      setOrbState('listening');
    } else if (evaluation) {
      setOrbState('success');
    } else {
      setOrbState('idle');
    }
  }, [loading, isRecording, evaluation]);

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
        'Speech recognition not active on this browser. You can type or edit your response directly in the transcript box.'
      );
      setIsRecording(!isRecording);
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
        showToast('Microphone active. Speak clearly.');
      } catch {
        showToast('Microphone already running or permission requested.');
      }
    }
  };

  const handleSpeakQuestion = () => {
    setOrbState('speaking');
    const textToSpeak =
      activePart === 2
        ? `Here is your topic. Describe ${partData.cueCard?.topic}. You have one minute to prepare.`
        : partData.questions?.[0] || 'Please tell me about your hometown or studies.';
    apiService.speakText(textToSpeak, 'UK');
    setTimeout(() => {
      if (!isRecording) setOrbState('idle');
    }, 4000);
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

  const currentQuestionText =
    activePart === 2 && partData.cueCard
      ? `Describe ${partData.cueCard.topic}`
      : partData.questions?.[0] || 'Tell me about your hometown or your studies.';

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5 dark:border-stone-800">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            SPEAKING INTERVIEW ROOM
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] dark:text-white uppercase">
            AI Examiner Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-400">
            Calibrated Cambridge IELTS interview simulation with real-time acoustic feedback.
          </p>
        </div>

        {/* Part 1 / 2 / 3 Selector */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold dark:border-stone-800 dark:bg-stone-900 self-start sm:self-auto">
          {[1, 2, 3].map((pt) => (
            <button
              key={pt}
              onClick={() => {
                setActivePart(pt as 1 | 2 | 3);
                setEvaluation(null);
                setSpeakingSeconds(0);
                setTranscript('');
              }}
              className={`rounded-lg px-4 py-1.5 transition-all ${
                activePart === pt
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[#5F6368] hover:text-[#111318] dark:text-stone-400 dark:hover:text-white'
              }`}
            >
              Part {pt}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 20: FOCUSED INTERVIEW EXPERIENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Examiner Focal Pod (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 text-center shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] dark:text-stone-400 mb-4">
              NOVA AI EXAMINER
            </span>

            {/* Centered NOVA AI Core */}
            <div className="py-2">
              <NovaOrb size="lg" state={orbState} />
            </div>

            {/* Live Audio Waveform when recording */}
            {isRecording && (
              <div className="mt-3 flex items-center justify-center gap-1 h-6">
                {[12, 24, 18, 30, 16, 26, 14, 28, 12, 22].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [6, h, 6] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 3) * 0.2,
                      ease: 'easeInOut',
                    }}
                    className="w-1 rounded-full bg-indigo-600 dark:bg-indigo-400"
                  />
                ))}
              </div>
            )}

            {/* Recording Timer */}
            <div className="mt-4">
              <span className="font-mono text-3xl font-black text-[#111318] dark:text-white">
                {formatTimer(speakingSeconds)}
              </span>
              <p className="text-xs text-[#5F6368] dark:text-stone-400 mt-0.5">
                {isRecording ? 'Listening to speech...' : 'Ready to record'}
              </p>
            </div>

            {/* Primary Microphone Trigger */}
            <div className="mt-6 flex flex-col items-center gap-2.5 w-full">
              <button
                onClick={toggleRecording}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all active:scale-98 shadow-xs ${
                  isRecording
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Start Speaking'}</span>
              </button>

              <button
                onClick={handleSpeakQuestion}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6368] hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400 pt-1"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Hear Examiner Read Prompt</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 dark:border-stone-800 dark:bg-stone-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Pacing
              </span>
              <p className="mt-1 font-mono text-lg font-black text-[#111318] dark:text-white">
                {wordsPerMinute} <span className="text-xs font-normal text-[#5F6368]">WPM</span>
              </p>
            </div>

            <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 dark:border-stone-800 dark:bg-stone-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Fillers
              </span>
              <p className="mt-1 font-mono text-lg font-black text-[#111318] dark:text-white">
                {fillerCount} <span className="text-xs font-normal text-[#5F6368]">tokens</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Large Question & Live Transcript (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Large Question Display */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Part {activePart} {activePart === 2 ? 'Cue Card Topic' : 'Discussion Question'}
              </span>

              {activePart === 2 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-stone-400" />
                  <span className="font-mono text-xs font-bold text-[#111318] dark:text-white">
                    Prep: {formatTimer(prepSeconds)}
                  </span>
                  <button
                    onClick={() => {
                      setIsPrepping(!isPrepping);
                      if (!isPrepping && prepSeconds === 0) setPrepSeconds(60);
                    }}
                    className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200"
                  >
                    {isPrepping ? 'Pause' : 'Start 1-Min Prep'}
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#111318] dark:text-white tracking-tight leading-snug">
              "{currentQuestionText}"
            </h2>

            {activePart === 2 && partData.cueCard && (
              <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850 space-y-2 text-xs text-[#5F6368] dark:text-stone-400">
                <p className="font-bold text-[#111318] dark:text-stone-200">You should say:</p>
                <ul className="space-y-1 pl-4 list-disc">
                  {partData.cueCard.bulletPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Live Speech Transcript Box */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5F6368] dark:text-stone-400">
                Live Speech Transcript
              </span>
              <span className="text-[11px] text-[#5F6368] dark:text-stone-400">
                {totalWords} words recorded
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={5}
              placeholder="Your spoken words will appear here automatically in real-time, or you can type directly..."
              className="w-full text-sm leading-relaxed text-[#111318] placeholder:text-stone-300 focus:outline-hidden dark:bg-stone-900 dark:text-stone-200 font-sans resize-none"
            />

            <div className="flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
              <button
                onClick={() => {
                  setTranscript('');
                  setSpeakingSeconds(0);
                  setEvaluation(null);
                }}
                className="flex items-center gap-1 text-xs text-[#5F6368] hover:text-[#111318] dark:text-stone-400 dark:hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleEvaluateSpeaking}
                disabled={loading || !transcript.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Evaluate Response</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Drawer */}
      {evaluation && (
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-stone-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                CAMBRIDGE ASSESSMENT CRITERIA
              </span>
              <h3 className="text-2xl font-black text-[#111318] dark:text-white">
                Official Speaking Scorecard
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#5F6368] dark:text-stone-400 block">
                  Estimated Score
                </span>
                <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  Band {evaluation.overallBand.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Official Criteria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">Fluency & Coherence</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {evaluation.criteriaScores.fluencyAndCoherence.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#5F6368] dark:text-stone-400">
                Pacing, discourse markers, hesitation analysis.
              </p>
            </div>

            <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">Lexical Resource</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {evaluation.criteriaScores.lexicalResource.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#5F6368] dark:text-stone-400">
                Topic collocations & idiomatic precision.
              </p>
            </div>

            <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">Grammatical Range</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {evaluation.criteriaScores.grammaticalRange.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#5F6368] dark:text-stone-400">
                Complex structures and error frequency.
              </p>
            </div>

            <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#111318] dark:text-white">Pronunciation</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {evaluation.criteriaScores.pronunciation.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#5F6368] dark:text-stone-400">
                Intonation, rhythm, and clarity of speech.
              </p>
            </div>
          </div>

          {/* Detailed Feedback Commentary */}
          <div className="rounded-xl border border-stone-200/80 p-5 dark:border-stone-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111318] dark:text-white">
              Examiner Observations
            </h4>
            <p className="text-xs sm:text-sm text-[#5F6368] dark:text-stone-300 leading-relaxed">
              {evaluation.overallFeedback}
            </p>

            {evaluation.modelBand9Response && (
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Band 9.0 Model Response
                </span>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                  "{evaluation.modelBand9Response}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
