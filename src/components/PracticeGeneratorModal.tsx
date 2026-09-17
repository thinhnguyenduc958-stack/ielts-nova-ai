import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { IELTSSkill, IELTSBand } from '../types';
import {
  Sparkles,
  X,
  Loader2,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PracticeGeneratorModal: React.FC<Props> = ({ onClose }) => {
  const { userProfile, showToast, recordActivity } = useApp();

  const [skill, setSkill] = useState<IELTSSkill>('Reading');
  const [topic, setTopic] = useState('Urban Vertical Farming & Food Security');
  const [targetBand, setTargetBand] = useState<IELTSBand>(userProfile.targetBand);
  const [questionType, setQuestionType] = useState('True / False / Not Given');

  const [loading, setLoading] = useState(false);
  const [generatedExercise, setGeneratedExercise] = useState<any | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedExercise(null);
    setSubmitted(false);
    setUserAnswers({});

    try {
      const res = await apiService.generatePractice(skill, topic, targetBand, questionType);
      setGeneratedExercise(res);
      recordActivity(`AI Generated Drill: ${topic}`, skill, `Band ${targetBand}`);
      showToast('Exercise generated successfully.');
    } catch {
      showToast('Generation failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 bg-[#FAF9F5] px-6 py-4 dark:border-stone-800 dark:bg-stone-850">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">IELTS Practice Synthesis</h3>
              <p className="text-[11px] text-stone-400">Generate on-demand exam drills with Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {!generatedExercise ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Skill Selector */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Target Skill</label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value as any)}
                    className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-200"
                  >
                    <option value="Reading">Reading</option>
                    <option value="Listening">Listening</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Grammar">Grammar</option>
                  </select>
                </div>

                {/* Target Band */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Difficulty Band</label>
                  <select
                    value={targetBand}
                    onChange={(e) => setTargetBand(e.target.value as any)}
                    className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-200"
                  >
                    <option value="5.5">Band 5.5</option>
                    <option value="6.0">Band 6.0</option>
                    <option value="6.5">Band 6.5</option>
                    <option value="7.0">Band 7.0</option>
                    <option value="7.5">Band 7.5</option>
                    <option value="8.0">Band 8.0</option>
                    <option value="8.5">Band 8.5</option>
                  </select>
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Topic / Subject</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Cognitive biases, Artificial intelligence, Coastal ecosystems"
                  className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Format</label>
                <input
                  type="text"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  placeholder="e.g. True/False/Not Given, Heading Matching, Collocations Drill"
                  className="mt-1.5 w-full rounded-full border border-stone-200 bg-[#FAF9F5] px-4 py-2.5 text-xs text-stone-900 focus:border-stone-400 focus:outline-hidden dark:border-stone-750 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 disabled:bg-stone-300 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:disabled:bg-stone-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
                      <span>Synthesizing Cambridge-calibrated exercise...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>Generate Exercise</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Drill Render */
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200/80 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-stone-850">
                <h4 className="text-sm font-semibold text-stone-900 dark:text-white">{generatedExercise.title}</h4>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{generatedExercise.instructions}</p>
              </div>

              {/* Context Reading Passage if any */}
              {generatedExercise.passage && (
                <div className="max-h-48 overflow-y-auto rounded-2xl border border-stone-100 bg-white p-4 font-serif text-xs leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300">
                  {generatedExercise.passage}
                </div>
              )}

              {/* Questions */}
              <div className="space-y-3">
                {generatedExercise.questions?.map((q: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-stone-200/80 p-4 text-xs space-y-2 dark:border-stone-800 dark:bg-stone-850/60">
                    <p className="font-medium text-stone-900 dark:text-white">
                      {idx + 1}. {q.prompt}
                    </p>

                    {q.options && (
                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt: string) => (
                          <label key={opt} className="flex items-center gap-2 text-stone-600 dark:text-stone-300 cursor-pointer">
                            <input
                              type="radio"
                              name={`gen-q-${idx}`}
                              value={opt}
                              checked={userAnswers[idx] === opt}
                              onChange={(e) => setUserAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
                              disabled={submitted}
                              className="accent-stone-900 dark:accent-stone-100"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {submitted && (
                      <div className="mt-2.5 rounded-xl bg-stone-100 p-3 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        <p className="font-semibold text-xs text-stone-900 dark:text-white">Correct Answer: {q.correctAnswer}</p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => setGeneratedExercise(null)}
                  className="rounded-full px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  Generate Another
                </button>

                <button
                  onClick={() => setSubmitted(true)}
                  disabled={submitted}
                  className="rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:bg-stone-200 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:disabled:bg-stone-800"
                >
                  {submitted ? 'Checked ✓' : 'Check Answers'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
