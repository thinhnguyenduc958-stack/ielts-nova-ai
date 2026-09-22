import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand, EnglishVariant, AppTheme } from '../types';
import {
  User,
  RotateCcw,
  Save,
  Check,
  Award,
  Calendar,
  Globe,
  TrendingDown,
  TrendingUp,
  Download,
  Edit3,
  Sparkles,
  FileText,
  Target,
} from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const { userProfile, updateProfile, setTargetBand, showToast, resetAllData } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);

  // Form states
  const [name, setName] = useState(userProfile.name || 'Candidate Alex Nguyen');
  const [candidateId] = useState(userProfile.id || 'IELTS-NV-9482');
  const [targetBand, setLocalTargetBand] = useState<IELTSBand>(userProfile.targetBand || '7.5');
  const [examDate, setExamDate] = useState(userProfile.examDate || '2026-11-20');
  const [targetCountry, setTargetCountry] = useState(userProfile.targetCountry || 'United Kingdom');
  const [weakestSkill, setWeakestSkill] = useState(userProfile.weakestSkill || 'Writing (Task 2)');
  const [strongestSkill, setStrongestSkill] = useState(userProfile.strongestSkill || 'Listening (Section 4)');
  const [variant, setVariant] = useState<EnglishVariant>(userProfile.preferredVariant || 'UK');
  const [dailyGoal, setDailyGoal] = useState<number>(userProfile.dailyGoalMinutes || 45);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateProfile({
      name,
      targetBand,
      examDate,
      targetCountry,
      weakestSkill,
      strongestSkill,
      preferredVariant: variant,
      dailyGoalMinutes: dailyGoal,
    });
    setTargetBand(targetBand);
    setIsEditing(false);
    showToast('Candidate profile updated successfully.');
  };

  const handleExportStudyRecord = () => {
    const record = {
      candidateName: name,
      candidateId: candidateId,
      targetBand: targetBand,
      examDate: examDate,
      targetCountry: targetCountry,
      strongestSkill: strongestSkill,
      weakestSkill: weakestSkill,
      completedActivities: userProfile.completedActivities,
      streakDays: userProfile.streakDays,
      dailyGoalMinutes: dailyGoal,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-record-${candidateId.toLowerCase()}.json`;
    a.click();
    showToast('Study record exported (JSON).');
  };

  const handleReset = () => {
    if (window.confirm('Reset all candidate progress and restore default profile?')) {
      resetAllData();
      setName('Candidate');
      setLocalTargetBand('6.5');
      showToast('Profile reset to default.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-24 text-[#111318] bg-white">
      {/* 24. Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
            CANDIDATE DOSSIER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111318] uppercase">
            Personal Study Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#5C616B]">
            Official candidate record, target band calibration, and academic performance telemetry.
          </p>
        </div>

        {/* Action Buttons: Edit Profile, Change Target, Export Study Record */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-[#111318] hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
          >
            <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={() => setShowTargetModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs"
          >
            <Target className="h-3.5 w-3.5" />
            <span>Change Target</span>
          </button>

          <button
            onClick={handleExportStudyRecord}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Study Record</span>
          </button>
        </div>
      </div>

      {/* Candidate Identification Card */}
      <div className="rounded-3xl border border-stone-200 bg-white p-7 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-md shadow-indigo-600/20">
              {name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-[#111318] tracking-tight">
                  {name}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Active Candidate
                </span>
              </div>
              <p className="font-mono text-xs font-semibold text-[#5C616B]">
                ID: <span className="text-[#111318]">{candidateId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-100 bg-[#F6F4FF] px-5 py-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C616B] block">
                TARGET BAND
              </span>
              <span className="text-2xl font-black text-indigo-600 font-mono">
                {targetBand}
              </span>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C616B] block">
                CURRENT BAND
              </span>
              <span className="text-2xl font-black text-[#111318] font-mono">
                {userProfile.currentBand}
              </span>
            </div>
          </div>
        </div>

        {/* Candidate Detail Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
          {/* Target Country */}
          <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C616B]">
              <Globe className="h-4 w-4 text-indigo-600" />
              <span>Target Country</span>
            </div>
            <p className="text-base font-bold text-[#111318]">{targetCountry}</p>
            <p className="text-[11px] text-[#5C616B]">Visa & Academic standard</p>
          </div>

          {/* Test Date */}
          <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C616B]">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>Exam Date</span>
            </div>
            <p className="text-base font-bold text-[#111318] font-mono">{examDate}</p>
            <p className="text-[11px] text-[#5C616B]">Official British Council date</p>
          </div>

          {/* Strongest Skill */}
          <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Strongest Skill</span>
            </div>
            <p className="text-base font-bold text-[#111318]">{strongestSkill}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">High consistency</p>
          </div>

          {/* Weakest Skill */}
          <div className="rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <TrendingDown className="h-4 w-4 text-amber-600" />
              <span>Focus / Weakest Skill</span>
            </div>
            <p className="text-base font-bold text-[#111318]">{weakestSkill}</p>
            <p className="text-[11px] text-amber-700 font-semibold">Primary coaching focus</p>
          </div>
        </div>
      </div>

      {/* Profile Edit Mode Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="rounded-3xl border border-indigo-200 bg-[#F6F4FF] p-7 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#111318]">Edit Candidate Profile</h3>
            <p className="text-xs text-[#5C616B]">Update your official candidate parameters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-[#111318] block mb-1">Candidate Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-[#111318] block mb-1">Target Country</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-[#111318] block mb-1">Official Test Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-[#111318] block mb-1">Daily Study Target</label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
              >
                <option value={15}>15 Minutes (Light)</option>
                <option value={30}>30 Minutes (Standard)</option>
                <option value={45}>45 Minutes (Intensive)</option>
                <option value={60}>60 Minutes (Immersion)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#111318] block mb-1">Strongest Skill</label>
              <input
                type="text"
                value={strongestSkill}
                onChange={(e) => setStrongestSkill(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-[#111318] block mb-1">Weakest Skill / Primary Focus</label>
              <input
                type="text"
                value={weakestSkill}
                onChange={(e) => setWeakestSkill(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-[#111318] outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-[#5C616B] hover:text-[#111318] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Target Change Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#111318]">Calibrate Target Band</h3>
              <p className="text-xs text-[#5C616B]">
                Select your desired IELTS Academic overall band score.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {(['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'] as IELTSBand[]).map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => {
                    setLocalTargetBand(band);
                    setTargetBand(band);
                    updateProfile({ targetBand: band });
                    setShowTargetModal(false);
                    showToast(`Target Band updated to ${band}`);
                  }}
                  className={`rounded-2xl border p-3.5 text-center font-mono text-sm font-black transition-all cursor-pointer ${
                    targetBand === band
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : 'border-stone-200 bg-white text-[#111318] hover:border-indigo-300'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#5C616B] hover:text-[#111318] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Section */}
      <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#111318]">Reset Candidate Database</h4>
          <p className="text-xs text-[#5C616B]">
            Clear locally saved test attempts, vocabulary notes, and calibration logs.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-[#5C616B] hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Data</span>
        </button>
      </div>
    </div>
  );
};
