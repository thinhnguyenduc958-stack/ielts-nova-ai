import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Apple, Globe, Download, Check, Sparkles, Monitor, ArrowRight } from 'lucide-react';

export const DownloadModule: React.FC = () => {
  const { showToast } = useApp();
  const [downloadingApk, setDownloadingApk] = useState(false);

  const handleDownloadApk = () => {
    setDownloadingApk(true);
    showToast('Starting direct download: ielts-nova-v2.4.apk (38 MB)...');
    setTimeout(() => {
      // Trigger a simulated browser download of the APK file
      const dummyBlob = new Blob(['IELTS NOVA AI Android Production Package v2.4'], {
        type: 'application/vnd.android.package-archive',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dummyBlob);
      link.download = 'ielts-nova-v2.4.apk';
      link.click();
      setDownloadingApk(false);
      showToast('Download started: ielts-nova-v2.4.apk');
    }, 1200);
  };

  const handleInstallPWA = () => {
    showToast('PWA Install ready: Tap your browser menu or "Add to Home Screen" to install.');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-24 text-[#111318] dark:text-[#F3F4F6]">
      {/* Editorial Header */}
      <header className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <span>Cross-Platform Ecosystem</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111318] dark:text-white uppercase">
          TAKE NOVA WITH YOU
        </h1>
        <p className="text-sm sm:text-base text-[#626873] dark:text-stone-400 max-w-xl">
          Learn anywhere on Android, iPhone, iPad, Mac, and Windows with synchronized progress, offline vocabulary, and instant speech recognition.
        </p>
      </header>

      {/* SUBTLE DIVIDER */}
      <hr className="border-stone-200/80 dark:border-stone-800" />

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* 1. ANDROID — DIRECT APK */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111318] dark:text-white">Android</h3>
                  <span className="text-xs text-[#626873] dark:text-stone-400">Android 10.0 or later</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Direct APK
              </span>
            </div>

            {/* File Info Box */}
            <div className="rounded-xl border border-stone-100 bg-[#FAF9F5] p-3 text-xs space-y-1 dark:border-stone-800 dark:bg-stone-850">
              <div className="flex justify-between font-mono">
                <span className="text-[#626873] dark:text-stone-400">File:</span>
                <span className="font-bold text-[#111318] dark:text-white">ielts-nova-v2.4.apk</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#626873] dark:text-stone-400">Size:</span>
                <span className="font-bold text-[#111318] dark:text-white">38 MB</span>
              </div>
            </div>

            {/* What's new */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                What's New in v2.4:
              </span>
              <ul className="text-xs text-[#626873] dark:text-stone-400 space-y-1 list-disc list-inside">
                <li>Offline Lexicon Spaced Repetition cards</li>
                <li>Enhanced low-latency Speaking audio recognition</li>
                <li>Background audio playback for Listening sections</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleDownloadApk}
            disabled={downloadingApk}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-3.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-[#4338CA] active:scale-98 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>{downloadingApk ? 'Downloading APK...' : 'Download APK (38 MB)'}</span>
          </button>
        </div>

        {/* 2. IPHONE & IPAD */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-[#111318] dark:bg-stone-800 dark:text-white">
                  <Apple className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111318] dark:text-white">iPhone & iPad</h3>
                  <span className="text-xs text-[#626873] dark:text-stone-400">iOS / iPadOS 16.4+</span>
                </div>
              </div>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-[#626873] dark:bg-stone-800 dark:text-stone-300">
                TestFlight / Web App
              </span>
            </div>

            {/* Step-by-step instructions */}
            <div className="rounded-xl border border-stone-100 bg-[#FAF9F5] p-3.5 text-xs space-y-1.5 dark:border-stone-800 dark:bg-stone-850">
              <span className="font-bold text-[#111318] dark:text-white">Installation Instructions:</span>
              <ol className="text-[#626873] dark:text-stone-400 space-y-1 list-decimal list-inside text-[11px]">
                <li>Open this site in Safari on your iPhone or iPad</li>
                <li>Tap the Share button in the toolbar (square with up arrow)</li>
                <li>Scroll down and select "Add to Home Screen"</li>
                <li>Enjoy full-screen native iOS performance with offline sync</li>
              </ol>
            </div>

            {/* What's new */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                What's New in iOS build:
              </span>
              <ul className="text-xs text-[#626873] dark:text-stone-400 space-y-1 list-disc list-inside">
                <li>Retina display typography optimization</li>
                <li>Safari WebKit audio waveform capture</li>
                <li>Smooth gesture-driven flashcard swiping</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => showToast('Follow the 4 steps above in Safari to install instantly on your iPhone/iPad.')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white py-3.5 text-xs font-bold text-[#111318] shadow-2xs hover:bg-stone-50 active:scale-98 transition-all dark:border-stone-800 dark:bg-stone-850 dark:text-white"
          >
            <span>View Safari Instructions</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 3. PROGRESSIVE WEB APP (PWA) */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Monitor className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111318] dark:text-white">Desktop App (PWA)</h3>
                  <span className="text-xs text-[#626873] dark:text-stone-400">Chrome, Edge, Brave, Safari</span>
                </div>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Installed PWA
              </span>
            </div>

            <p className="text-xs text-[#626873] dark:text-stone-400 leading-relaxed">
              Install IELTS NOVA AI directly to your macOS Dock, Windows Taskbar, or Chromebook launcher. Runs in a dedicated native window with keyboard shortcuts.
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                Desktop Perks:
              </span>
              <ul className="text-xs text-[#626873] dark:text-stone-400 space-y-1 list-disc list-inside">
                <li>Full-screen Writing editor with distraction-free mode</li>
                <li>Split-screen Reading passages with synchronized questions</li>
                <li>High-fidelity microphone recording for Speaking simulations</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleInstallPWA}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111318] py-3.5 text-xs font-bold text-white shadow-2xs hover:bg-stone-800 active:scale-98 transition-all dark:bg-white dark:text-[#111318]"
          >
            <Download className="h-4 w-4" />
            <span>Install Desktop App</span>
          </button>
        </div>

        {/* 4. CLOUD WEB BROWSER */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111318] dark:text-white">Web Browser</h3>
                  <span className="text-xs text-[#626873] dark:text-stone-400">Any modern browser</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Instant Access
              </span>
            </div>

            <p className="text-xs text-[#626873] dark:text-stone-400 leading-relaxed">
              No download required. Access your complete IELTS preparation library, mock exams, vocabulary vault, and AI tutor directly in your browser.
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] dark:text-stone-400">
                Browser Capabilities:
              </span>
              <ul className="text-xs text-[#626873] dark:text-stone-400 space-y-1 list-disc list-inside">
                <li>Automatic cloud sync for all study sessions</li>
                <li>Instant switching between light and dark themes</li>
                <li>Zero installation footprint</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => showToast('You are currently running the full Web version of IELTS NOVA AI!')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white py-3.5 text-xs font-bold text-[#111318] shadow-2xs hover:bg-stone-50 active:scale-98 transition-all dark:border-stone-800 dark:bg-stone-850 dark:text-white"
          >
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Currently Active</span>
          </button>
        </div>
      </div>
    </div>
  );
};
