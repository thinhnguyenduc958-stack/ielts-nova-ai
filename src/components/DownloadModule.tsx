import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Apple,
  Laptop,
  Check,
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck,
  WifiOff,
  Headphones,
  RefreshCw,
  X,
  Mail,
} from 'lucide-react';

export const DownloadModule: React.FC = () => {
  const { showToast } = useApp();
  const [betaModalOpen, setBetaModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('macOS');
  const [emailInput, setEmailInput] = useState('');
  const [betaRequested, setBetaRequested] = useState(false);

  const handleRequestAccess = (platform: string) => {
    setSelectedPlatform(platform);
    setBetaModalOpen(true);
    setBetaRequested(false);
  };

  const handleBetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setBetaRequested(true);
    showToast(`Beta invitation registered for ${emailInput}! Check your inbox soon.`);
  };

  const platforms = [
    {
      id: 'macos',
      name: 'macOS',
      arch: 'Apple Silicon (M1/M2/M3) & Intel',
      version: 'macOS 12.0 or later',
      icon: Apple,
      badge: 'Desktop App',
      tag: 'Universal Binary',
    },
    {
      id: 'windows',
      name: 'Windows',
      arch: '64-bit Architecture & ARM64',
      version: 'Windows 10 / 11',
      icon: Laptop,
      badge: 'Desktop App',
      tag: 'Native x64 / ARM',
    },
    {
      id: 'ios',
      name: 'iOS & iPadOS',
      arch: 'Apple TestFlight & App Store',
      version: 'iOS 16.0 or later',
      icon: Smartphone,
      badge: 'Mobile Client',
      tag: 'TestFlight Beta',
    },
    {
      id: 'android',
      name: 'Android',
      arch: 'Google Play & Standalone APK',
      version: 'Android 10.0 or later',
      icon: Smartphone,
      badge: 'Mobile Client',
      tag: 'APK & Play Store',
    },
  ];

  const features = [
    {
      icon: WifiOff,
      title: 'Offline study mode',
      desc: 'Practice Cambridge reading passages, flashcards, and review notes without active internet connectivity.',
    },
    {
      icon: Headphones,
      title: 'Audio cache',
      desc: 'Pre-download complete Listening sections and examiner speeches for low-latency acoustic playback on the go.',
    },
    {
      icon: RefreshCw,
      title: 'Instant sync with web',
      desc: 'Seamless real-time synchronization keeps your band scores, practice attempts, and vocabulary dictionary up to date.',
    },
    {
      icon: Sparkles,
      title: 'Real examiner audio',
      desc: 'High-fidelity acoustic speech models calibrated specifically against official Cambridge band criteria.',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-24 text-[#111318] bg-white">
      {/* 23. Title: "Study IELTS anywhere." */}
      <div className="border-b border-stone-200/80 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
          <span className="h-2 w-2 rounded-full bg-indigo-600" />
          <span>IELTS NOVA AI NATIVE CLIENTS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111318] uppercase">
          Study IELTS anywhere.
        </h1>
        <p className="text-sm sm:text-base text-[#5C616B] max-w-2xl leading-relaxed">
          Take NOVA AI with you across desktop and mobile. Zero friction, instant cloud synchronization, and offline-first IELTS drills built for serious candidates.
        </p>
      </div>

      {/* Platform Options Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div
              key={platform.id}
              className="rounded-3xl border border-stone-200 bg-white p-7 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#111318]">{platform.name}</h3>
                      <p className="text-xs text-[#5C616B]">{platform.arch}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-stone-700">
                    {platform.tag}
                  </span>
                </div>

                <div className="rounded-xl border border-stone-100 bg-[#FAF9F5] p-3 text-xs flex items-center justify-between font-mono">
                  <span className="text-[#5C616B]">System requirement:</span>
                  <span className="font-bold text-[#111318]">{platform.version}</span>
                </div>
              </div>

              <button
                onClick={() => handleRequestAccess(platform.name)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download for {platform.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature List Section */}
      <div className="rounded-3xl border border-indigo-100 bg-[#F6F4FF] p-8 sm:p-10 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            NATIVE DESKTOP & MOBILE ADVANTAGES
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#111318]">
            Engineered for high-focus IELTS preparation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {features.map((feat, idx) => {
            const FIcon = feat.icon;
            return (
              <div key={idx} className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-indigo-100/80 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FIcon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#111318]">{feat.title}</h4>
                  <p className="text-xs text-[#5C616B] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Beta Access Modal */}
      {betaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 sm:p-8 shadow-xl space-y-5">
            <button
              onClick={() => setBetaModalOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-[#111318] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#111318]">
                {selectedPlatform} Private Beta
              </h3>
              <p className="text-xs text-[#5C616B] leading-relaxed">
                Desktop and mobile clients are currently in private beta. Early testers receive instant TestFlight links and standalone installers.
              </p>
            </div>

            {!betaRequested ? (
              <form onSubmit={handleBetaSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#5C616B] block mb-1.5">
                    Candidate Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF9F5] pl-10 pr-4 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBetaModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5C616B] hover:text-[#111318] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
                  >
                    Request Beta Access
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-center space-y-2">
                <div className="flex justify-center">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Request Confirmed!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  We've reserved your slot for the {selectedPlatform} release. An invitation with the download bundle will be dispatched to <strong>{emailInput}</strong>.
                </p>
                <button
                  onClick={() => setBetaModalOpen(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
