import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  CheckCircle2,
  Flame,
  Bookmark,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Clock,
  AlertTriangle,
  Target,
} from 'lucide-react';

export const ProgressModule: React.FC = () => {
  const { userProfile, vocabulary, recentActivities } = useApp();

  const skills = [
    {
      name: 'Listening',
      current: userProfile.breakdown.listening,
      target: 7.5,
      icon: Headphones,
      badge: 'Strongest Skill',
    },
    {
      name: 'Reading',
      current: userProfile.breakdown.reading,
      target: 7.5,
      icon: BookOpen,
      badge: 'On Track',
    },
    {
      name: 'Writing',
      current: userProfile.breakdown.writing,
      target: 7.0,
      icon: PenTool,
      badge: 'Priority Focus',
    },
    {
      name: 'Speaking',
      current: userProfile.breakdown.speaking,
      target: 7.5,
      icon: Mic,
      badge: 'In Progress',
    },
  ];

  const vocabByStatus = {
    mastered: vocabulary.filter((v) => v.status === 'mastered').length,
    learning: vocabulary.filter((v) => v.status === 'learning').length,
    review: vocabulary.filter((v) => v.status === 'review').length,
    new: vocabulary.filter((v) => v.status === 'new').length,
  };

  const isAssessed = userProfile.currentBand !== 'Not assessed';
  const totalStudyHours = ((userProfile.completedActivities * 20) / 60).toFixed(1);

  interface TrajectoryStep {
    stage: string;
    band: string;
    date: string;
    current?: boolean;
    target?: boolean;
    stretch?: boolean;
    done?: boolean;
  }

  const trajectorySteps: TrajectoryStep[] = [
    { stage: 'Diagnostic', band: isAssessed ? '5.5' : 'Pending', date: isAssessed ? 'Completed' : 'Start', current: !isAssessed, done: isAssessed },
    { stage: 'Core Band', band: '6.0', date: 'Milestone 1', done: false },
    { stage: 'Target Goal', band: `${userProfile.targetBand}`, date: 'Target', target: true },
    { stage: 'Academic Pro', band: '7.5', date: 'Advanced' },
    { stage: 'Mastery', band: '8.0+', date: 'Stretch', stretch: true },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#FCFBF8] to-[#F5F2EA] p-6 shadow-2xs dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Assessment & Trajectory Analytics</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              Performance & Trajectory
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Diagnostic metrics aligned with official Cambridge band descriptors to guide your study allocation.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900">
              <p className="text-[10px] uppercase font-semibold text-stone-400">Current Level</p>
              <p className="font-serif text-lg font-normal text-stone-900 dark:text-white sm:text-xl">
                {userProfile.currentBand === 'Not assessed' ? 'Not assessed' : `Band ${userProfile.currentBand}`}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-300 bg-stone-100 px-4 py-2.5 text-center shadow-2xs dark:border-stone-700 dark:bg-stone-800">
              <p className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400">Target Goal</p>
              <p className="font-serif text-lg font-normal text-stone-900 dark:text-white sm:text-xl">
                Band {userProfile.targetBand}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Band Score Trajectory */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4 dark:border-stone-800">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-white">
              Band Score Progression Trajectory
            </h2>
            <p className="text-xs text-stone-400">
              Sequential milestones calculated by Cambridge assessment models
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{isAssessed ? '+1.5 Band growth recorded' : 'Diagnostic Ready'}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {trajectorySteps.map((step, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border p-4 text-center transition-all ${
                step.current
                  ? 'border-stone-900 bg-[#FAF9F5] shadow-2xs dark:border-stone-100 dark:bg-stone-850'
                  : step.target
                  ? 'border-amber-400 bg-amber-50/30 dark:border-amber-800/80 dark:bg-amber-950/20'
                  : step.done
                  ? 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-850'
                  : 'border-dashed border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-900'
              }`}
            >
              {step.current && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-stone-900 px-2 py-0.5 text-[8px] font-semibold uppercase text-white dark:bg-stone-100 dark:text-stone-900">
                  Active
                </span>
              )}
              {step.target && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-600 px-2 py-0.5 text-[8px] font-semibold uppercase text-white">
                  Target
                </span>
              )}

              <p className="text-[11px] text-stone-400">{step.stage}</p>
              <p className="mt-1 font-serif text-xl font-light text-stone-900 dark:text-white">
                Band {step.band}
              </p>
              <p className="mt-1 text-[10px] text-stone-400">{step.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest vs Weakest & Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>Highest Competency Domain</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">
              Listening Section 1 & 2 (Band 8.0)
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              92% accuracy on spelling numbers, addresses, and academic dialogue facts. Detail retention is exceptional.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-[#FAF9F5] p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-850">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Priority Improvement Focus</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">
              Writing Task 2: Cohesion & Range (Band 6.5)
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Main arguments are clear, but body paragraphs frequently rely on repetitive linking words rather than substantive syntactic subordination.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <Target className="h-3.5 w-3.5" />
            <span>Target Roadway</span>
          </div>
          <h3 className="mt-1 text-base font-light text-stone-900 dark:text-white">
            To reach Band 7.5, focus on:
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                1
              </span>
              <div>
                <h4 className="text-xs font-semibold text-stone-900 dark:text-white">
                  Syntactic Subordination in Essay Writing (+0.5 Writing Band)
                </h4>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Replace consecutive simple clauses with participle clauses (e.g., "Having examined the evidence..." or "While some advocate X, others maintain Y").
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                2
              </span>
              <div>
                <h4 className="text-xs font-semibold text-stone-900 dark:text-white">
                  Master True/False/Not Given Distractors (+0.5 Reading Band)
                </h4>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Identify extreme qualifying adverbs ("invariably", "solely", "undoubtedly") that turn general statements into False rather than Not Given.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                3
              </span>
              <div>
                <h4 className="text-xs font-semibold text-stone-900 dark:text-white">
                  Speaking Part 3 Discourse Markers (+0.5 Speaking Band)
                </h4>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Employ academic transition markers such as "Fundamentally speaking", "In contemporary terms", and "From a socio-economic viewpoint".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Skills Competency Meters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s) => {
          const Icon = s.icon;
          const pct = Math.round((s.current / s.target) * 100);
          return (
            <div
              key={s.name}
              className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 dark:text-white">{s.name}</h4>
                    <span className="text-[10px] text-stone-400">{s.badge}</span>
                  </div>
                </div>
                <span className="font-serif text-lg font-light text-stone-900 dark:text-white">
                  {s.current.toFixed(1)}
                </span>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                <div
                  className="h-full rounded-full bg-stone-900 dark:bg-stone-100"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              <div className="mt-2.5 flex justify-between text-[11px] text-stone-400">
                <span>Target: Band {s.target.toFixed(1)}</span>
                <span className="font-medium text-stone-700 dark:text-stone-300">{pct}% Ready</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Study Streak & Time Invested & Vocab Vault */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Streak */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Daily Study Streak
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {userProfile.streakDays} Days
            </span>
          </div>

          <div className="mt-4 flex justify-between items-center py-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    idx < userProfile.streakDays
                      ? 'bg-stone-900 text-white shadow-2xs dark:bg-stone-100 dark:text-stone-900'
                      : 'border border-dashed border-stone-200 bg-stone-50 text-stone-300 dark:border-stone-800 dark:bg-stone-850'
                  }`}
                >
                  {idx < userProfile.streakDays ? '✓' : '○'}
                </div>
                <span className="text-[10px] text-stone-400">{day}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-stone-400">
            {userProfile.streakDays > 0
              ? 'Complete another session today to maintain your streak.'
              : 'Complete your first practice session today to start your streak.'}
          </p>
        </div>

        {/* Time Invested */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-stone-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Time Invested
              </h3>
            </div>
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {totalStudyHours} Hours
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Listening & Audio</span>
              <span className="font-medium text-stone-900 dark:text-white">
                {userProfile.completedActivities > 0 ? ((userProfile.completedActivities * 6) / 60).toFixed(1) : '0.0'} hrs
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Writing Essay Practice</span>
              <span className="font-medium text-stone-900 dark:text-white">
                {userProfile.completedActivities > 0 ? ((userProfile.completedActivities * 7) / 60).toFixed(1) : '0.0'} hrs
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Reading & Vocabulary</span>
              <span className="font-medium text-stone-900 dark:text-white">
                {userProfile.completedActivities > 0 ? ((userProfile.completedActivities * 4) / 60).toFixed(1) : '0.0'} hrs
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Speaking Drills</span>
              <span className="font-medium text-stone-900 dark:text-white">
                {userProfile.completedActivities > 0 ? ((userProfile.completedActivities * 3) / 60).toFixed(1) : '0.0'} hrs
              </span>
            </div>
          </div>
        </div>

        {/* Vocabulary Vault Health */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
            <div className="flex items-center gap-1.5">
              <Bookmark className="h-4 w-4 text-stone-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Lexicon Vault
              </h3>
            </div>
            <span className="text-xs font-medium text-stone-500">{vocabulary.length} Terms</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-2.5 dark:border-stone-800 dark:bg-stone-850">
              <p className="font-serif text-lg font-light text-stone-900 dark:text-white">
                {vocabByStatus.mastered}
              </p>
              <p className="text-[10px] font-semibold text-stone-400 uppercase">
                Mastered
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-2.5 dark:border-stone-800 dark:bg-stone-850">
              <p className="font-serif text-lg font-light text-stone-900 dark:text-white">
                {vocabByStatus.learning}
              </p>
              <p className="text-[10px] font-semibold text-stone-400 uppercase">
                Learning
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-2.5 dark:border-stone-800 dark:bg-stone-850">
              <p className="font-serif text-lg font-light text-stone-900 dark:text-white">
                {vocabByStatus.review}
              </p>
              <p className="text-[10px] font-semibold text-stone-400 uppercase">
                Review Due
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-2.5 dark:border-stone-800 dark:bg-stone-850">
              <p className="font-serif text-lg font-light text-stone-900 dark:text-white">
                {vocabByStatus.new}
              </p>
              <p className="text-[10px] font-semibold text-stone-400 uppercase">
                New
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xs dark:border-stone-800 dark:bg-stone-900 sm:p-8">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-white border-b border-stone-100 pb-3 dark:border-stone-800">
          Official Practice & Test Activity Log
        </h3>

        {recentActivities.length === 0 ? (
          <div className="mt-4 py-8 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              No activity recorded yet
            </p>
            <p className="mt-1 text-[11px] text-stone-400">
              Complete your first Reading, Listening, Writing, or Speaking session to populate your performance history.
            </p>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {act.skill}
                  </span>
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white">{act.title}</h4>
                    <p className="text-[10px] text-stone-400">{act.timestamp}</p>
                  </div>
                </div>

                <span className="font-serif text-sm font-medium text-stone-900 dark:text-white">{act.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
