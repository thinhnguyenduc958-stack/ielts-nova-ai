import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { NovaOrb } from './NovaOrb';
import { NovaState } from '../types';
import { Mic, MicOff, X, Volume2, VolumeX, Sparkles, Send, MessageSquare } from 'lucide-react';

interface NovaVoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaVoiceDialog: React.FC<NovaVoiceDialogProps> = ({ isOpen, onClose }) => {
  const { userProfile, showToast, setCurrentTab } = useApp();
  const [novaState, setNovaState] = useState<NovaState>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('Chào chủ nhân! Hãy nói hoặc nhập điều chủ nhân muốn luyện tập hôm nay.');
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = userProfile.preferredLanguage === 'en' ? 'en-US' : 'vi-VN';

      recognition.onstart = () => {
        setIsListening(true);
        setNovaState('listening');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setNovaState('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        // If transcript was captured, automatically send to Gemini
        if (transcript.trim()) {
          handleProcessUserQuery(transcript);
        } else {
          setNovaState('idle');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [userProfile.preferredLanguage, transcript]);

  const startListening = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported in this browser. You can type below!');
      return;
    }
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      console.warn(e);
      recognitionRef.current.stop();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (soundMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userProfile.preferredLanguage === 'en' ? 'en-GB' : 'vi-VN';
      utterance.rate = 1.0;
      utterance.onstart = () => setNovaState('speaking');
      utterance.onend = () => setNovaState('idle');
      utterance.onerror = () => setNovaState('idle');
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
      setNovaState('idle');
    }
  };

  const handleProcessUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setNovaState('thinking');

    try {
      // Send query to the centralized server-side Gemini tutor
      const prompt = `[Người dùng xưng hô là chủ nhân, bạn là NOVA AI companion cá nhân]. Yêu cầu: "${queryText}". Hãy xưng hô là NOVA và gọi người dùng là "chủ nhân", trả lời ngắn gọn, tinh tế, truyền cảm hứng, và đưa ra 1 bước thực hành cụ thể.`;
      const res = await apiService.askAITutor(prompt);

      const reply = res.reply || 'NOVA đã nhận được yêu cầu của chủ nhân. Chúng ta bắt đầu nhé!';
      setAiResponse(reply);
      speakText(reply);
    } catch (error) {
      const fallbackMsg = 'Xin lỗi chủ nhân, kết nối AI đang bận một chút. Chủ nhân hãy thử lại nhé?';
      setAiResponse(fallbackMsg);
      setNovaState('error');
      setTimeout(() => setNovaState('idle'), 3000);
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    handleProcessUserQuery(textInput);
    setTextInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/80 bg-[#FCFBF9] p-6 shadow-2xl dark:border-stone-800 dark:bg-[#14151B] sm:p-8"
      >
        {/* Header with Close and Mute */}
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-amber-500">✦</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              NOVA Voice Companion
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!soundMuted && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setSoundMuted(!soundMuted);
              }}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
              title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {soundMuted ? <VolumeX className="h-4 w-4 text-rose-500" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Central Orb Display */}
        <div className="my-6 flex flex-col items-center justify-center space-y-3">
          <NovaOrb state={novaState} size="lg" />
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {novaState === 'listening' && 'NOVA đang lắng nghe...'}
              {novaState === 'thinking' && 'NOVA đang suy nghĩ...'}
              {novaState === 'speaking' && 'NOVA đang trả lời...'}
              {novaState === 'idle' && 'NOVA đã sẵn sàng'}
              {novaState === 'error' && 'Đang kết nối lại...'}
            </div>
            {transcript && (
              <p className="mt-1 text-xs italic text-stone-500 dark:text-stone-400 line-clamp-2">
                "{transcript}"
              </p>
            )}
          </div>
        </div>

        {/* AI Response Card */}
        <div className="mb-5 max-h-48 overflow-y-auto rounded-2xl border border-stone-200/80 bg-white/70 p-4 text-xs leading-relaxed text-stone-800 dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-200">
          <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>NOVA:</span>
          </div>
          <p className="whitespace-pre-wrap">{aiResponse}</p>
        </div>

        {/* Controls: Microphone + Text fallback */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            {isListening ? (
              <button
                onClick={stopListening}
                className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-xs font-semibold text-white shadow-lg animate-pulse hover:bg-rose-600 active:scale-95"
              >
                <MicOff className="h-4 w-4" />
                <span>Dừng lắng nghe</span>
              </button>
            ) : (
              <button
                onClick={startListening}
                className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-xs font-semibold text-stone-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
              >
                <Mic className="h-4 w-4" />
                <span>Nói với NOVA</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitText} className="relative flex items-center">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Hoặc nhập câu hỏi cho NOVA..."
              className="w-full rounded-xl border border-stone-200/90 bg-white px-4 py-2.5 pr-10 text-xs text-stone-800 outline-none focus:border-amber-400 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="absolute right-2 p-1.5 text-stone-400 hover:text-amber-500 disabled:opacity-30"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px]">
            <span className="text-stone-400">Gợi ý:</span>
            <button
              onClick={() => handleProcessUserQuery('Hôm nay tôi nên luyện kỹ năng nào?')}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
            >
              Lộ trình hôm nay
            </button>
            <button
              onClick={() => handleProcessUserQuery('Cho tôi 3 collocation Band 8 chủ đề Môi trường.')}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
            >
              Collocations Band 8
            </button>
            <button
              onClick={() => {
                onClose();
                setCurrentTab('speaking');
              }}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
            >
              Mở Speaking Part 2
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
