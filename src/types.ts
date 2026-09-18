export type IELTSBand = '4.0' | '4.5' | '5.0' | '5.5' | '6.0' | '6.5' | '7.0' | '7.5' | '8.0' | '8.5' | '9.0';

export type IELTSSkill = 'listening' | 'reading' | 'writing' | 'speaking' | 'vocabulary' | 'grammar';

export type VocabStatus = 'new' | 'learning' | 'review' | 'mastered';

export type EnglishVariant = 'US' | 'UK';

export type LanguagePreference = 'en' | 'vi' | 'bilingual';

export type AppTheme = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  name: string;
  targetBand: IELTSBand;
  currentBand: IELTSBand | 'Not assessed';
  breakdown: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  preferredLanguage: LanguagePreference;
  preferredVariant: EnglishVariant;
  dailyGoalMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  completedActivities: number;
  theme?: AppTheme;
  examDate?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string; // Vietnamese translation or definition
  contextMeaning: string; // Meaning in specific passage
  partOfSpeech: string;
  ipa: string;
  usAudioUrl?: string;
  ukAudioUrl?: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  ieltsRelevance: string; // e.g. "Band 7.5+ Academic Essay"
  difficulty: 'intermediate' | 'advanced' | 'mastery';
  userNotes?: string;
  ieltsUsageNotes?: string;
  status: VocabStatus;
  sourceContext?: string; // Original sentence or passage
  dateAdded: string;
  lastReviewed?: string;
  nextReviewDate?: string;
  reviewCount: number;
}

export type TranslationMode = 'literal' | 'natural' | 'ielts' | 'detailed';

export interface TranslationResult {
  translatedText: string;
  accuracyScore: number;
  ieltsCollocations?: string[];
  verificationSteps: { stepNumber: number; stepName: string; status: 'passed' | 'checked'; details: string }[];
  usUkNotes?: string;
}

export interface TranslationVerification {
  original: string;
  contextAnalysis: string;
  translation: string;
  meaningAccuracy: boolean;
  grammarAccuracy: boolean;
  missingInformation: string | null;
  addedInformation: string | null;
  registerAndFormality: string;
  usUkDifferences: string;
  verifiedSteps: string[];
}

export interface WritingEvaluation {
  overallBand: number;
  bandRange: string;
  disclaimer: string;
  criteria: {
    taskResponse: { band: number; feedback: string; strengths: string[]; weaknesses: string[] };
    coherenceCohesion: { band: number; feedback: string; strengths: string[]; weaknesses: string[] };
    lexicalResource: { band: number; feedback: string; recommendedWords: string[]; repetitiveWords: string[] };
    grammaticalRange: { band: number; feedback: string; corrections: { original: string; corrected: string; explanation: string }[] };
  };
  sentenceImprovements: { original: string; improved: string; reason: string }[];
  modelExcerpt: string;
  suggestedVocabToSave: { word: string; pos: string; meaning: string; context: string }[];
}

export interface SpeakingEvaluation {
  overallBand: number;
  bandRange: string;
  fluencyCoherence: { band: number; feedback: string };
  lexicalResource: { band: number; feedback: string; goodPhrases: string[]; betterAlternatives: string[] };
  grammaticalAccuracy: { band: number; feedback: string; corrections: { spoken: string; corrected: string; reason: string }[] };
  pronunciationNotes: string;
  modelAnswerSnippet: string;
}

export interface ReadingQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false-notgiven' | 'yes-no-notgiven' | 'matching-headings' | 'matching-info' | 'sentence-completion' | 'summary-completion';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation: string;
  paragraphRef?: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  topic: string;
  bandLevel: string;
  durationMinutes: number;
  content: string; // Multi-paragraph academic text
  paragraphs: { id: string; title?: string; text: string }[];
  questions: ReadingQuestion[];
}

export interface ListeningQuestion {
  id: string;
  type: 'multiple-choice' | 'matching' | 'form-completion' | 'note-completion' | 'sentence-completion' | 'diagram-labelling';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation: string;
  timestampSeconds?: number;
}

export interface ListeningTest {
  id: string;
  title: string;
  sectionNumber: 1 | 2 | 3 | 4;
  scenario: string;
  audioSimulatedText: string;
  durationSeconds: number;
  transcript: string;
  questions: ListeningQuestion[];
  keyVocab: { word: string; meaning: string; ipa: string }[];
}

export interface TutorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedChips?: string[];
}

export interface GeneratedExercise {
  id: string;
  skill: IELTSSkill;
  targetBand: IELTSBand;
  topic: string;
  difficulty: string;
  question: string;
  contextOrPassage?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  ieltsTip: string;
}

export type NovaState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'success' | 'error';

export interface VocabularyTopic {
  id: string;
  name: string;
  nameVi: string;
  level: string;
  icon: string;
  description: string;
  words: VocabularyItem[];
}

export interface GrammarTopic {
  id: string;
  title: string;
  titleVi: string;
  bandTarget: string;
  category: string;
  explanation: string;
  formula: string;
  examples: { standard: string; band8: string; note: string }[];
  commonMistakes: { wrong: string; correct: string; reason: string }[];
}
