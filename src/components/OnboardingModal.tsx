import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { IELTSBand, IELTSSkill } from '../types';
import { NovaOrb } from './NovaOrb';
import { ArrowRight, Clock, BookOpen, Headphones, PenTool, Mic } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { userProfile, setTargetBand, updateProfile, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedBand, setSelectedBand] = useState<IELTSBand>(userProfile.targetBand || '7.0');
  const [selectedSkills, setSelectedSkills] = useState<IELTSSkill[]>(['writing', 'speaking']);
  const [dailyMinutes, setDailyMinutes] = useState<number>(userProfile.dailyGoalMinutes || 30);
  const [userName, setUserName] = useState<string>(userProfile.name === 'Candidate' ? '' : userProfile.name);

  if (!isOpen) return null;

  const handleFinish = () => {
    setTargetBand(selectedBand);
    updateProfile({
      name: userName.trim() || 'Thịnh',
      dailyGoalMinutes: dailyMinutes,
      targetBand: selectedBand,
    });
    localStorage.setItem('ielts_nova_onboarded', 'true');
    showToast('NOVA đã sẵn sàng đồng hành cùng bạn!');
    onComplete();
  };

  const toggleSkill = (skill: IELTSSkill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-[#14151B] sm:p-8 text-[#111111] dark:text-stone-100"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Onboarding ({step}/5)</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                    : s < step
                    ? 'w-2 bg-indigo-300 dark:bg-indigo-700'
                    : 'w-2 bg-stone-200 dark:bg-stone-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <NovaOrb state="idle" size="lg" showSparkle={false} />
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-[#111111] dark:text-white">
                Chào mừng bạn đến với <span className="text-indigo-600 dark:text-indigo-400">NOVA</span>
              </h2>
              <p className="text-xs text-[#555555] dark:text-stone-400 leading-relaxed max-w-sm">
                AI Companion cá nhân hỗ trợ bạn chinh phục kỳ thi IELTS với phản hồi chính xác và thực tế.
              </p>
            </div>

            <div className="w-full pt-2 text-left">
              <label className="block text-xs font-semibold text-[#111111] dark:text-stone-300 mb-1.5">
                Tên của bạn:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ví dụ: Thịnh"
                className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-sm text-[#111111] outline-none focus:border-indigo-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-xs font-semibold text-white hover:bg-[#222222] dark:bg-white dark:text-[#111111]"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Target Band */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Mục tiêu IELTS Band của bạn
              </h3>
              <p className="text-xs text-[#555555] dark:text-stone-400">
                NOVA sẽ hiệu chỉnh bài tập và tiêu chuẩn chấm theo mục tiêu này.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {(['6.0', '6.5', '7.0', '7.5', '8.0', '8.5'] as IELTSBand[]).map((band) => (
                <button
                  key={band}
                  onClick={() => setSelectedBand(band)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                    selectedBand === band
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 font-bold'
                      : 'border-stone-200/90 bg-white text-[#555555] hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300'
                  }`}
                >
                  <span className="text-[11px] text-[#777777] font-normal">Band</span>
                  <span className="text-lg">{band}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2.5 pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 rounded-xl border border-stone-200 py-2.5 text-xs text-[#555555] hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 rounded-xl bg-[#111111] py-2.5 text-xs font-semibold text-white hover:bg-[#222222] dark:bg-white dark:text-[#111111]"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Priority Skills */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Kỹ năng bạn muốn tập trung
              </h3>
              <p className="text-xs text-[#555555] dark:text-stone-400">
                Chọn một hoặc nhiều kỹ năng ưu tiên.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { id: 'writing' as IELTSSkill, label: 'Writing (Task 1 & 2)', icon: PenTool },
                { id: 'speaking' as IELTSSkill, label: 'Speaking (AI Examiner)', icon: Mic },
                { id: 'reading' as IELTSSkill, label: 'Reading (Speed & Flow)', icon: BookOpen },
                { id: 'listening' as IELTSSkill, label: 'Listening (Audio Drills)', icon: Headphones },
              ].map((item) => {
                const isSelected = selectedSkills.includes(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSkill(item.id)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 font-semibold'
                        : 'border-stone-200/90 bg-white text-[#555555] dark:border-stone-800 dark:bg-stone-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#777777]'}`} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2.5 pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 rounded-xl border border-stone-200 py-2.5 text-xs text-[#555555] hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 rounded-xl bg-[#111111] py-2.5 text-xs font-semibold text-white hover:bg-[#222222] dark:bg-white dark:text-[#111111]"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Daily Commitment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Mục tiêu thời gian mỗi ngày
              </h3>
              <p className="text-xs text-[#555555] dark:text-stone-400">
                Học đều đặn mỗi ngày mang lại kết quả bền vững nhất.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDailyMinutes(mins)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                    dailyMinutes === mins
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 font-bold'
                      : 'border-stone-200/90 bg-white text-[#555555] dark:border-stone-800 dark:bg-stone-900'
                  }`}
                >
                  <Clock className="h-4 w-4 mb-1 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-base font-bold">{mins} phút</span>
                  <span className="text-[10px] text-[#777777]">mỗi ngày</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2.5 pt-4">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 rounded-xl border border-stone-200 py-2.5 text-xs text-[#555555] hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(5)}
                className="w-2/3 rounded-xl bg-[#111111] py-2.5 text-xs font-semibold text-white hover:bg-[#222222] dark:bg-white dark:text-[#111111]"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ready */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <NovaOrb state="idle" size="md" showSparkle={false} />
            <h3 className="text-lg font-bold text-[#111111] dark:text-white">
              Cài đặt hoàn tất cho {userName || 'bạn'}
            </h3>
            <div className="rounded-xl border border-stone-200/90 bg-stone-50/80 p-4 text-xs text-[#555555] dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 space-y-2 w-full text-left">
              <div className="flex justify-between">
                <span className="text-[#777777]">Mục tiêu:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Band {selectedBand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Thời lượng:</span>
                <span className="font-medium text-[#111111] dark:text-white">{dailyMinutes} phút / ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Kỹ năng trọng tâm:</span>
                <span className="font-medium uppercase text-[10px] text-[#111111] dark:text-white">
                  {selectedSkills.join(', ')}
                </span>
              </div>
            </div>
            <button
              onClick={handleFinish}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#222222] active:scale-98 transition-all dark:bg-white dark:text-[#111111]"
            >
              <span>BẮT ĐẦU HỌC</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
