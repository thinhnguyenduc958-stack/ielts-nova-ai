import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand, EnglishVariant, AppTheme } from '../types';
import {
  User,
  RotateCcw,
  Save,
  Sun,
  Moon,
  Laptop,
  Check,
  Palette,
} from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const { userProfile, updateProfile, setTargetBand, showToast, theme, setTheme, effectiveTheme, resetAllData } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [targetBand, setLocalTargetBand] = useState<IELTSBand>(userProfile.targetBand);
  const [variant, setVariant] = useState<EnglishVariant>(userProfile.preferredVariant);
  const [dailyGoal, setDailyGoal] = useState<number>(userProfile.dailyGoalMinutes);
  const [examDate, setExamDate] = useState(userProfile.examDate || '2026-11-20');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      targetBand,
      preferredVariant: variant,
      dailyGoalMinutes: dailyGoal,
      examDate,
    });
    setTargetBand(targetBand);
    showToast('Preferences saved successfully.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all application data to clean initial state?')) {
      resetAllData();
      setName('Candidate');
      setLocalTargetBand('6.5');
      setVariant('US');
      setDailyGoal(30);
    }
  };

  const themeOptions: {
    id: AppTheme;
    title: string;
    description: string;
    icon: React.ElementType;
    badge: string;
  }[] = [
    {
      id: 'light',
      title: 'Light Studio',
      description: 'Warm, high-contrast canvas optimized for daytime reading and clear typography.',
      icon: Sun,
      badge: 'Light Canvas',
    },
    {
      id: 'dark',
      title: 'Dark Studio',
      description: 'Charcoal & deep stone surfaces tailored for relaxed night study sessions.',
      icon: Moon,
      badge: 'Dark Canvas',
    },
    {
      id: 'system',
      title: 'System Default',
      description: 'Automatically synchronizes with your device operating system preference.',
      icon: Laptop,
      badge: 'System Sync',
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            <User className="h-3.5 w-3.5" />
            <span>Candidate Account & Interface Preferences</span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
            Profile & Display Settings
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Configure your IELTS target band, accent preference, daily schedule, and canvas theme mode.
          </p>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Canvas Display Mode</h3>
              <p className="text-[11px] text-stone-400">
                Active interface: <span className="font-semibold uppercase text-stone-700 dark:text-stone-300">{effectiveTheme}</span> {theme === 'system' && '(Auto OS synced)'}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            Persistent across sessions
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-[#FAF9F5] shadow-2xs dark:border-stone-100 dark:bg-stone-850'
                    : 'border-stone-200/70 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'
                }`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`} />
                      <span className="font-medium text-xs text-stone-900 dark:text-white">{opt.title}</span>
                    </div>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 dark:border-stone-800 w-full">
                  <span className="text-[10px] text-stone-400">
                    {opt.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:col-span-2">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Target & Candidate Parameters</h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-stone-500">Candidate Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:bg-white focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-stone-500">Target Band</label>
                <select
                  value={targetBand}
                  onChange={(e) => setLocalTargetBand(e.target.value as any)}
                  className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
                >
                  {['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map((b) => (
                    <option key={b} value={b}>
                      IELTS Band {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-500">Target Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-500">Preferred English Accent</label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVariant('UK')}
                  className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-xs font-medium transition-all ${
                    variant === 'UK'
                      ? 'border-stone-900 bg-[#FAF9F5] text-stone-900 dark:border-stone-100 dark:bg-stone-850 dark:text-white'
                      : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>British English (UK)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVariant('US')}
                  className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-xs font-medium transition-all ${
                    variant === 'US'
                      ? 'border-stone-900 bg-[#FAF9F5] text-stone-900 dark:border-stone-100 dark:bg-stone-850 dark:text-white'
                      : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>American English (US)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-stone-500">Daily Study Target</label>
              <div className="mt-1.5 flex gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoal(mins)}
                    className={`flex-1 rounded-full border py-2 text-xs font-medium transition-all ${
                      dailyGoal === mins
                        ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

        {/* Account Info & Reset */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 font-serif text-lg font-light text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-white">{userProfile.name}</h4>
                <p className="text-[11px] text-stone-400">IELTS Academic Candidate</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-stone-100 pt-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="font-medium text-stone-900 dark:text-white">Active</span>
              </div>
              <div className="flex justify-between">
                <span>AI Engine:</span>
                <span className="font-medium text-stone-900 dark:text-white">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between">
                <span>Active Streak:</span>
                <span className="font-medium text-amber-700 dark:text-amber-400">{userProfile.streakDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span>Active Theme:</span>
                <span className="font-medium text-stone-900 dark:text-white capitalize">{theme}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Reset Local Storage</h4>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed">
              Clear saved vocabulary items, practice attempts, and reset back to initial sample state.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3.5 flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#FAF9F5] px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-750 dark:bg-stone-800 dark:text-stone-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Study Data</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
