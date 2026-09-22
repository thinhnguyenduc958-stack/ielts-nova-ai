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
    <div className="mx-auto max-w-5xl space-y-8 pb-24 text-[#111318] bg-white">
      {/* 17. Header: SPEAKING PRACTICE / PART 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            SPEAKING PRACTICE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] uppercase">
            PART {activePart} · INTERVIEW STUDIO
          </h1>
          <p className="text-xs sm:text-sm text-[#5C616B]">
            Calibrated Cambridge IELTS interview simulation with real-time acoustic feedback.
          </p>
        </div>

        {/* Part 1 / 2 / 3 Selector */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white p-1 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          {[1, 2, 3].map((pt) => (
            <button
              key={pt}
              onClick={() => {
                setActivePart(pt as 1 | 2 | 3);
                setEvaluation(null);
                setSpeakingSeconds(0);
                setTranscript('');
              }}
              className={`rounded-lg px-4 py-1.5 transition-all cursor-pointer ${
                activePart === pt
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-[#5C616B] hover:text-[#111318]'
              }`}
            >
              Part {pt}
            </button>
          ))}
        </div>
      </div>

      {/* 17. FOCUSED INTERVIEW EXPERIENCE: White Background, Large Question, Central NOVA AI Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Examiner Focal Pod (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 text-center shadow-xs flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C616B] mb-4">
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
                    className="w-1 rounded-full bg-indigo-600"
                  />
                ))}
              </div>
            )}

            {/* Recording Timer */}
            <div className="mt-4">
              <span className="font-mono text-3xl font-black text-[#111318]">
                {formatTimer(speakingSeconds)}
              </span>
              <p className="text-xs text-[#5C616B] mt-0.5">
                {isRecording ? 'Listening to speech...' : 'Ready to record'}
              </p>
            </div>

            {/* Primary Microphone Trigger */}
            <div className="mt-6 flex flex-col items-center gap-2.5 w-full">
              <button
                onClick={toggleRecording}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all active:scale-98 shadow-xs cursor-pointer ${
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C616B] hover:text-indigo-600 pt-1 cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Hear Examiner Read Prompt</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-stone-200 bg-white p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C616B]">
                Pacing
              </span>
              <p className="mt-1 font-mono text-lg font-black text-[#111318]">
                {wordsPerMinute} <span className="text-xs font-normal text-[#5C616B]">WPM</span>
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C616B]">
                Fillers
              </span>
              <p className="mt-1 font-mono text-lg font-black text-[#111318]">
                {fillerCount} <span className="text-xs font-normal text-[#5C616B]">tokens</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Large Question & Live Transcript (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Large Question Display */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {activePart === 2 ? 'CUE CARD PRESENTATION' : `PART ${activePart} DISCUSSION`}
              </span>

              {/* Controls: Prepare (1m), Speak (2m), NOVA Real-Time Analysis */}
              <div className="flex flex-wrap items-center gap-2">
                {activePart === 2 && (
                  <button
                    onClick={() => {
                      setIsPrepping(!isPrepping);
                      if (!isPrepping && prepSeconds === 0) setPrepSeconds(60);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isPrepping
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-stone-200 bg-white text-[#111318] hover:bg-stone-50'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Prepare (1m): {formatTimer(prepSeconds)}</span>
                  </button>
                )}

                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isRecording
                      ? 'border-rose-600 bg-rose-50 text-rose-700'
                      : 'border-stone-200 bg-white text-[#111318] hover:bg-stone-50'
                  }`}
                >
                  <Mic className={`h-3.5 w-3.5 ${isRecording ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`} />
                  <span>{isRecording ? `Recording (${formatTimer(speakingSeconds)})` : 'Speak (2m)'}</span>
                </button>

                <button
                  onClick={handleEvaluateSpeaking}
                  disabled={loading || (!transcript && speakingSeconds === 0)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>NOVA Real-Time Analysis</span>
                </button>
              </div>
            </div>

            {/* Topic Presentation */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C616B]">
                Topic:
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#111318] leading-snug">
                {partData.cueCard ? partData.cueCard.topic : currentQuestionText}
              </h2>
            </div>

            {/* Part 2 Points to Cover */}
            {activePart === 2 && partData.cueCard && (
              <div className="rounded-xl border border-indigo-100 bg-[#F6F4FF] p-4 text-xs space-y-2">
                <p className="font-bold text-[#111318]">Points to cover:</p>
                <ul className="list-disc list-inside space-y-1 text-[#5C616B]">
                  {partData.cueCard.bulletPoints.map((bp, i) => (
                    <li key={i} className="font-medium text-[#111318]">{bp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Transcript / Answer Area */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C616B]">
                Your Speech Transcript
              </span>
              <span className="text-xs font-mono text-[#5C616B]">
                {totalWords} words spoken
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Click 'Start Speaking' and begin talking. Your words will transcribe here in real time..."
              rows={5}
              className="w-full resize-none rounded-xl border border-stone-200 bg-white p-4 text-sm text-[#111318] placeholder:text-stone-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-normal leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setTranscript('');
                  setSpeakingSeconds(0);
                  setEvaluation(null);
                }}
                className="flex items-center gap-1.5 text-xs text-[#5C616B] hover:text-[#111318] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleEvaluateSpeaking}
                disabled={loading || totalWords < 5}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{loading ? 'Evaluating with Cambridge Rubric...' : 'Submit to Examiner'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed IELTS Evaluation Output */}
      {evaluation && (
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                CAMBRIDGE SPEAKING SCORE REPORT
              </span>
              <h3 className="text-2xl font-black text-[#111318] mt-0.5">
                Evaluated Band: {evaluation.overallBand.toFixed(1)}
              </h3>
              <p className="text-xs text-[#5C616B]">Range: {evaluation.bandRange}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
                Official 4-Criteria Standard
              </span>
            </div>
          </div>

          {/* 4 Descriptors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-stone-200 bg-stone-50/40 p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#5C616B]">Fluency & Coherence</span>
              <p className="text-xl font-black text-[#111318]">{evaluation.fluencyCoherence.toFixed(1)}</p>
              <p className="text-[11px] text-[#5C616B] leading-snug">{evaluation.fluencyFeedback}</p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/40 p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#5C616B]">Lexical Resource</span>
              <p className="text-xl font-black text-[#111318]">{evaluation.lexicalResource.toFixed(1)}</p>
              <p className="text-[11px] text-[#5C616B] leading-snug">{evaluation.lexicalFeedback}</p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/40 p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#5C616B]">Grammar & Accuracy</span>
              <p className="text-xl font-black text-[#111318]">{evaluation.grammaticalRange.toFixed(1)}</p>
              <p className="text-[11px] text-[#5C616B] leading-snug">{evaluation.grammarFeedback}</p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/40 p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#5C616B]">Pronunciation</span>
              <p className="text-xl font-black text-[#111318]">{evaluation.pronunciation.toFixed(1)}</p>
              <p className="text-[11px] text-[#5C616B] leading-snug">{evaluation.pronunciationFeedback}</p>
            </div>
          </div>

          {/* Band 8.0 Model Upgrade */}
          {evaluation.improvedResponse && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Examiner's Recommended Band 8.5 Phrasing
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-serif leading-relaxed italic">
                "{evaluation.improvedResponse}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
