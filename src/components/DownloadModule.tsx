import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Apple, Globe, Download, Check, Sparkles, ArrowUpRight } from 'lucide-react';

export const DownloadModule: React.FC = () => {
  const { showToast } = useApp();
  const [downloadingApk, setDownloadingApk] = useState(false);

  const handleDownloadApk = () => {
    setDownloadingApk(true);
    showToast('Preparing IELTS NOVA AI Android package...');
    setTimeout(() => {
      setDownloadingApk(false);
      showToast('APK build scheduled. Coming soon to Google Play!');
    }, 1500);
  };

  const handleInstallPWA = () => {
    // Check if deferred PWA install prompt is available
    showToast('Add to Home Screen via browser menu (Share > Add to Home Screen) for native experience.');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-24 text-[#111111] dark:text-[#F3F4F6]">
      {/* Header */}
      <header className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <span>Multi-Platform Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] dark:text-white">
          Download IELTS NOVA AI
        </h1>
        <p className="text-base text-[#555555] dark:text-stone-400">
          Learn wherever you go • Synchronized across all your devices
        </p>
      </header>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* 1. Android */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-[#111111] dark:text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111] dark:text-white">Android</h3>
                <span className="text-xs text-[#777777] dark:text-stone-400">Android 10+</span>
              </div>
            </div>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-[#555555] dark:bg-stone-800 dark:text-stone-300">
              v1.2.0
            </span>
          </div>

          <p className="text-xs text-[#555555] dark:text-stone-400">
            Native offline vocabulary caching, voice recognition examiner, and instant audio drills.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDownloadApk}
              disabled={downloadingApk}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#222222] active:scale-98 transition-all dark:bg-white dark:text-[#111111]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{downloadingApk ? 'Downloading...' : 'Download APK'}</span>
            </button>
          </div>
        </div>

        {/* 2. iPhone & iPad */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-[#111111] dark:text-white">
                <Apple className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111] dark:text-white">iPhone & iPad</h3>
                <span className="text-xs text-[#777777] dark:text-stone-400">iOS 16+</span>
              </div>
            </div>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-[#555555] dark:bg-stone-800 dark:text-stone-300">
              TestFlight
            </span>
          </div>

          <p className="text-xs text-[#555555] dark:text-stone-400">
            Optimized for Retina displays, Dynamic Island voice timers, and Apple Pencil essay annotations.
          </p>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => showToast('TestFlight Beta opening soon for registered candidates.')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-white py-3 text-xs font-medium text-[#111111] hover:bg-stone-50 transition-all dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
            >
              <span>TestFlight</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#777777]" />
            </button>
            <button
              onClick={() => showToast('App Store build in review with Cambridge standard compliance.')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#111111] py-3 text-xs font-semibold text-white hover:bg-[#222222] transition-all dark:bg-white dark:text-[#111111]"
            >
              <span>App Store</span>
              <span className="text-[10px] text-[#777777] dark:text-stone-400">(Soon)</span>
            </button>
          </div>
        </div>

        {/* 3. Web App */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-[#111111] dark:text-white">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111] dark:text-white">Desktop & Web</h3>
                <span className="text-xs text-[#777777] dark:text-stone-400">Chrome, Safari, Edge</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              Active Now
            </span>
          </div>

          <p className="text-xs text-[#555555] dark:text-stone-400">
            Full-screen Writing Studio with split-view prompt analysis, timing countdowns, and Cambridge rubric grading.
          </p>

          <div className="pt-2">
            <button
              onClick={() => showToast('You are currently running the latest Web Studio edition.')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white py-3 text-xs font-semibold text-[#111111] hover:bg-stone-50 transition-all dark:border-stone-800 dark:bg-stone-900 dark:text-white"
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Current Session Active</span>
            </button>
          </div>
        </div>

        {/* 4. Progressive Web App (PWA) */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-[#111111] dark:text-white">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111] dark:text-white">PWA Edition</h3>
                <span className="text-xs text-[#777777] dark:text-stone-400">Zero App Store download</span>
              </div>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
              Instant
            </span>
          </div>

          <p className="text-xs text-[#555555] dark:text-stone-400">
            Install directly to your home screen or desktop dock with 1-click. Instant launch, full offline storage.
          </p>

          <div className="pt-2">
            <button
              onClick={handleInstallPWA}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#222222] active:scale-98 transition-all dark:bg-white dark:text-[#111111]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install NOVA App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
