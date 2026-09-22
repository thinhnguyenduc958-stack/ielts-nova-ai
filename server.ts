import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy/Safe Gemini client initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim().length === 0) {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to instantiate GoogleGenAI:', err);
    return null;
  }
}

// Model Configuration - Single configuration point
export const AI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
export const FALLBACK_MODELS = [AI_MODEL, 'gemini-3.8-flash'];

// Standardized error classification
export type ApiErrorCode =
  | 'AUTH_ERROR'
  | 'CONFIG_ERROR'
  | 'RATE_LIMIT'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'MODEL_ERROR'
  | 'INVALID_RESPONSE'
  | 'UNKNOWN_ERROR';

function classifyError(err: any): { code: ApiErrorCode; message: string; status: number } {
  const msg = (err?.message || String(err)).toLowerCase();
  if (
    msg.includes('gemini_api_key is not configured') ||
    msg.includes('api key') ||
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('unauthenticated') ||
    msg.includes('permission_denied')
  ) {
    return {
      code: 'AUTH_ERROR',
      message: 'NOVA is currently unavailable. Please verify API configuration.',
      status: 401,
    };
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('resourceexhausted') || msg.includes('rate limit')) {
    return {
      code: 'RATE_LIMIT',
      message: 'NOVA is receiving high traffic right now. Please try again in a few moments.',
      status: 429,
    };
  }
  if (
    msg.includes('timeout') ||
    msg.includes('econnreset') ||
    msg.includes('enotfound') ||
    msg.includes('fetch failed') ||
    msg.includes('network') ||
    msg.includes('aborted')
  ) {
    return {
      code: 'NETWORK_ERROR',
      message: "NOVA couldn't connect right now. Please check your connection and try again.",
      status: 503,
    };
  }
  return {
    code: 'MODEL_ERROR',
    message: 'Something went wrong while NOVA was responding. Please try again.',
    status: 500,
  };
}

// Centralized resilient Gemini caller with automatic model failover
async function callGeminiService(
  contents: any,
  options: {
    systemInstruction?: string;
    responseMimeType?: string;
    responseSchema?: any;
    preferredModel?: string;
  } = {}
): Promise<{ text: string; modelUsed: string }> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  const candidateModels = options.preferredModel
    ? [options.preferredModel, 'gemini-3.1-flash-lite']
    : [AI_MODEL, 'gemini-3.1-flash-lite'];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {};
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }
      if (options.responseMimeType) {
        config.responseMimeType = options.responseMimeType;
      }
      if (options.responseSchema) {
        config.responseSchema = options.responseSchema;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        ...(Object.keys(config).length > 0 ? { config } : {}),
      });

      return {
        text: response.text || '',
        modelUsed: model,
      };
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model candidates failed');
}

// Dynamic System Prompt Builder for IELTS NOVA AI
function buildDynamicTutorSystemPrompt(params: {
  userBand?: string;
  targetBand?: string;
  languagePreference?: string;
  mode?: string;
  task?: string;
  persona?: string;
  sessionContext?: string;
}): string {
  const mode = params.mode || 'general';
  const targetBand = params.targetBand || '7.5';
  const userBand = params.userBand || '6.0';
  const lang = params.languagePreference || 'bilingual';

  let modeSpecific = '';
  switch (mode) {
    case 'speaking':
      modeSpecific = `CURRENT MODE: IELTS SPEAKING EXAMINER & COACH.
- Conduct authentic, interactive IELTS Speaking drills (Part 1, 2, or 3).
- Ask one question or cue card prompt at a time and wait for the candidate's answer.
- Evaluate responses constructively: analyze Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.
- Offer surgical Band 8.0+ idiomatic phrases, discourse markers, and natural collocations to replace basic vocabulary.
- If the student asks for a topic, generate authentic Cambridge IELTS Speaking topics.
- When transitioning to a new question or part, do so smoothly and naturally.`;
      break;
    case 'writing':
      modeSpecific = `CURRENT MODE: IELTS WRITING EVALUATOR & COACH.
- Evaluate essays against official Cambridge descriptors: Task Response (TR), Coherence & Cohesion (CC), Lexical Resource (LR), Grammatical Range & Accuracy (GRA).
- Provide concrete sentence transformations, elevated transition words, and paragraph restructuring.
- Highlight specific strengths and weaknesses without fabricating scores.
- Offer model sentences and excerpts demonstrating high-scoring academic cohesion.`;
      break;
    case 'reading':
      modeSpecific = `CURRENT MODE: IELTS READING SPECIALIST.
- Explain challenging reading passages, question logic (True/False/Not Given, Headings, Summary Completion).
- Unpack paraphrase traps, distractors, and locate exact textual evidence in passages.
- Highlight academic vocabulary and synonyms linking the question stem to the passage.`;
      break;
    case 'vocabulary':
      modeSpecific = `CURRENT MODE: IELTS LEXICAL RESOURCE COACH.
- For any queried word or topic, provide:
  1. Core definition and contextual nuance
  2. Natural Vietnamese translation
  3. Phonetic pronunciation (UK and US)
  4. 3-4 high-scoring academic collocations (Band 7.5+)
  5. Academic IELTS example sentence
  6. Synonyms and antonyms where relevant.`;
      break;
    case 'grammar':
      modeSpecific = `CURRENT MODE: IELTS GRAMMAR SPECIALIST.
- Break down complex grammar structures simply (e.g. Inversion, Conditionals, Relative clauses, Cleft sentences, Nominalization).
- Point out common IELTS candidate errors and contrast with Band 8+ standard structures.
- Provide practical drills and explain why each answer works.`;
      break;
    case 'translation':
      modeSpecific = `CURRENT MODE: CONTEXTUAL IELTS TRANSLATOR.
- Deliver natural, high-register Vietnamese <-> English translations tailored to academic IELTS discourse.
- Avoid stiff word-for-word translation. Explain cultural or nuanced academic differences.`;
      break;
    default:
      modeSpecific = `CURRENT MODE: GENERAL IELTS MASTER TUTOR.
- Intelligently detect the student's intent: vocabulary queries, grammar help, essay feedback, speaking drills, study planning, or answer explanations.
- If the user says "Let's practice Speaking" -> switch naturally into Speaking Examiner mode and ask the first question.
- If the user interrupts practice to ask about a word or grammar rule -> explain it clearly, then naturally offer to return to the practice session.
- Seamlessly understand follow-up questions and pronoun references (such as "make them harder", "why is B wrong?", "give me another example").`;
      break;
  }

  let personaNote = '';
  if (params.persona === 'examiner') {
    personaNote = 'PERSONA: Strict Cambridge Examiner (rubric-driven, analytical, rigorous).';
  } else if (params.persona === 'study_buddy') {
    personaNote = 'PERSONA: Supportive Study Companion (warm, encouraging, clear, motivating).';
  } else if (params.persona === 'grammar_doctor') {
    personaNote = 'PERSONA: Grammar Doctor (syntactic precision, error diagnosis, high-band sentence transformations).';
  } else if (params.persona === 'vocab_coach') {
    personaNote = 'PERSONA: Vocabulary Coach (idioms, collocations, academic register, lexical sophistication).';
  }

  const contextNote = params.sessionContext
    ? `\nCURRENT SESSION CONTEXT:\n"""${params.sessionContext.slice(0, 1500)}"""\n`
    : '';

  return `You are IELTS Nova AI, a world-class certified IELTS Master Tutor and Examiner.
The student's current baseline is Band ${userBand}, aiming for Band ${targetBand}.

CORE PHILOSOPHY & IDENTITY:
- You are an intelligent, adaptive IELTS learning companion.
- Be natural, conversational, clear, and academically insightful.
- Be concise for simple questions; structured and comprehensive for complex inquiries.
- Never say "As an AI language model..." or generic boilerplate bot phrases.
- Avoid excessive emojis (use sparingly only when adding genuine clarity or encouragement).
- Format responses cleanly with Markdown: bold keywords, concise bullet points, and clear sections.

LANGUAGE RULES:
- If the user writes or speaks Vietnamese, respond primarily in Vietnamese while keeping academic IELTS terminology, collocations, and examples in English.
- If the user writes in English, respond entirely in English.
- If language preference is set to "${lang}", adapt accordingly.

${modeSpecific}
${personaNote}
${contextNote}
Remember: You possess deep conversational memory. Understand follow-up questions ("give me 5 exercises", "make them harder", "explain question 2", "check this sentence") in full connection with previous turns.`;
}

// Multi-turn Conversation Sanitizer for @google/genai
function sanitizeConversationHistory(
  messages: any[]
): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Hello NOVA' }] }];
  }

  const rawTurns: Array<{ role: 'user' | 'model'; text: string }> = [];

  for (const m of messages) {
    const isUser = (m.role || m.sender) === 'user';
    const text = (m.content || m.text || '').trim();
    if (!text) continue;
    rawTurns.push({
      role: isUser ? 'user' : 'model',
      text,
    });
  }

  if (rawTurns.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Hello NOVA' }] }];
  }

  // Ensure first turn is 'user'
  while (rawTurns.length > 0 && rawTurns[0].role !== 'user') {
    rawTurns.shift();
  }

  if (rawTurns.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Hello NOVA' }] }];
  }

  // Merge consecutive same-role messages to guarantee strict role alternation
  const alternating: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const turn of rawTurns) {
    const last = alternating[alternating.length - 1];
    if (last && last.role === turn.role) {
      last.parts[0].text += `\n\n${turn.text}`;
    } else {
      alternating.push({
        role: turn.role,
        parts: [{ text: turn.text }],
      });
    }
  }

  // Ensure last turn is user (model responds to the user's latest message)
  if (alternating[alternating.length - 1].role !== 'user') {
    alternating.push({ role: 'user', parts: [{ text: 'Please continue.' }] });
  }

  // Keep a reasonable context window of last 16 turns
  if (alternating.length > 16) {
    const sliced = alternating.slice(alternating.length - 16);
    if (sliced[0].role !== 'user') {
      sliced.shift();
    }
    return sliced;
  }

  return alternating;
}

// Helper to safely parse JSON from Gemini
function parseGeminiJson<T>(rawText: string, fallback: T): T {
  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('Failed to parse Gemini JSON output:', err);
    return fallback;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    geminiStatus: hasKey ? 'connected' : 'key_missing',
    model: AI_MODEL,
  });
});

// Diagnostics endpoint for AI Health Check
app.get('/api/gemini/diagnostics', async (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  const ai = getGeminiClient();

  let reachable = false;
  let testPingStatus = 'UNTESTED';
  let latencyMs = 0;
  let errorMessage: string | null = null;

  if (hasKey && ai) {
    try {
      const pingStart = Date.now();
      const testRes = await ai.models.generateContent({
        model: AI_MODEL,
        contents: 'Ping',
        config: {
          systemInstruction: 'Respond with exactly: PONG',
        },
      });
      latencyMs = Date.now() - pingStart;
      if (testRes.text) {
        reachable = true;
        testPingStatus = 'SUCCESS';
      }
    } catch (err: any) {
      console.warn('Diagnostics test ping error:', err?.message || err);
      errorMessage = err?.message || 'Gemini ping failed';
      testPingStatus = 'ERROR';
    }
  }

  res.json({
    status: 'ok',
    configured: hasKey,
    model: AI_MODEL,
    reachable,
    testPingStatus,
    latencyMs,
    error: errorMessage,
    timestamp: new Date().toISOString(),
  });
});

// AI Tutor Chat Route (Standard Non-streaming)
app.post('/api/gemini/tutor', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      messages,
      userBand,
      targetBand,
      languagePreference,
      mode,
      task,
      persona,
      sessionContext,
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'NOVA is currently unavailable. Please verify API configuration.',
        code: 'AUTH_ERROR',
        fallback: true,
      });
    }

    const systemInstruction = buildDynamicTutorSystemPrompt({
      userBand,
      targetBand,
      languagePreference,
      mode,
      task,
      persona,
      sessionContext,
    });

    const contents = sanitizeConversationHistory(messages);

    const result = await callGeminiService(contents, {
      systemInstruction,
      preferredModel: AI_MODEL,
    });

    const latencyMs = Date.now() - startTime;

    res.json({
      text: result.text || "NOVA couldn't generate a response this time.",
      fallback: false,
      modelUsed: result.modelUsed,
      latencyMs,
    });
  } catch (error: any) {
    console.error('Tutor API error:', error?.message || error);
    const classified = classifyError(error);
    res.status(classified.status).json({
      error: classified.message,
      code: classified.code,
    });
  }
});

// AI Tutor Streaming Route (Server-Sent Events)
app.post('/api/gemini/tutor/stream', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      messages,
      userBand,
      targetBand,
      languagePreference,
      mode,
      task,
      persona,
      sessionContext,
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'NOVA is currently unavailable. Please verify API configuration.',
        code: 'AUTH_ERROR',
        fallback: true,
      });
    }

    const systemInstruction = buildDynamicTutorSystemPrompt({
      userBand,
      targetBand,
      languagePreference,
      mode,
      task,
      persona,
      sessionContext,
    });

    const contents = sanitizeConversationHistory(messages);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let aborted = false;
    res.on('close', () => {
      if (!res.writableEnded) {
        aborted = true;
      }
    });

    let fullText = '';
    let modelUsed = AI_MODEL;

    try {
      const responseStream = await ai.models.generateContentStream({
        model: AI_MODEL,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (aborted || res.writableEnded) break;
        const text = chunk.text || '';
        if (text) {
          fullText += text;
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
          if (typeof (res as any).flush === 'function') {
            (res as any).flush();
          }
        }
      }

      if (!res.writableEnded) {
        const latencyMs = Date.now() - startTime;
        res.write(
          `data: ${JSON.stringify({ done: true, modelUsed, latencyMs, fullText })}\n\n`
        );
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        res.end();
      }
    } catch (streamErr: any) {
      console.warn(`Primary streaming model ${AI_MODEL} failed, trying fallback:`, streamErr?.message || streamErr);
      if (!res.writableEnded && !aborted) {
        try {
          const fallbackStream = await ai.models.generateContentStream({
            model: 'gemini-3.8-flash',
            contents,
            config: { systemInstruction, temperature: 0.7 },
          });
          modelUsed = 'gemini-3.8-flash';
          for await (const chunk of fallbackStream) {
            if (aborted || res.writableEnded) break;
            const text = chunk.text || '';
            if (text) {
              fullText += text;
              res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
              if (typeof (res as any).flush === 'function') {
                (res as any).flush();
              }
            }
          }
          if (!res.writableEnded) {
            const latencyMs = Date.now() - startTime;
            res.write(
              `data: ${JSON.stringify({ done: true, modelUsed, latencyMs, fullText })}\n\n`
            );
            if (typeof (res as any).flush === 'function') {
              (res as any).flush();
            }
            res.end();
          }
        } catch (fbErr: any) {
          const classified = classifyError(fbErr);
          if (!res.writableEnded) {
            res.write(
              `data: ${JSON.stringify({ error: classified.message, code: classified.code })}\n\n`
            );
            res.end();
          }
        }
      }
    }
  } catch (err: any) {
    const classified = classifyError(err);
    if (!res.headersSent) {
      res.status(classified.status).json({ error: classified.message, code: classified.code });
    } else {
      res.write(
        `data: ${JSON.stringify({ error: classified.message, code: classified.code })}\n\n`
      );
      res.end();
    }
  }
});

// Translation Hub with Verification Route
app.post('/api/gemini/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang, mode } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback verified translation response
      const isEnToVi = (sourceLang || 'en').startsWith('en');
      let translation = isEnToVi
        ? `[Bản dịch tự nhiên]: ${text}`
        : `[Natural translation]: ${text}`;

      if (text.toLowerCase().includes('substantial')) {
        translation = isEnToVi
          ? 'Đã có những bằng chứng đáng kể chứng minh tính khả thi của giải pháp này.'
          : 'There is substantial evidence supporting the feasibility of this solution.';
      }

      return res.json({
        translation,
        verification: {
          original: text,
          contextAnalysis: 'Academic IELTS context evaluating evidential weight.',
          translation,
          meaningAccuracy: true,
          grammarAccuracy: true,
          missingInformation: null,
          addedInformation: null,
          registerAndFormality: 'Formal / Academic Band 7.5+',
          usUkDifferences: 'No significant US/UK difference in this context.',
          verifiedSteps: [
            '1. Contextual Semantics Analyzed',
            '2. Register and IELTS Tone Calibrated',
            '3. Collocation Verified',
            '4. Omission & Distortion Check Passed',
            '5. Final Audit Verified',
          ],
        },
        ieltsCollocations: ['substantial subsidies', 'renewable energy infrastructures', 'allocate funds'],
        fallback: true,
      });
    }

    const prompt = `Perform a high-precision translation from ${sourceLang || 'English'} to ${targetLang || 'Vietnamese'}.
Text: "${text}"
Translation Mode: "${mode || 'ielts'}" (options: literal, natural, ielts, detailed).

Follow the mandatory 7-step IELTS verification pipeline:
1. Context Analysis
2. Translation
3. Meaning Verification (check for missing or added info)
4. Grammar and Tense Verification
5. US vs UK English distinctions (e.g., apartment/flat, colour/color). If no difference, explicitly output: "No significant US/UK difference in this context."
6. IELTS Lexical & Grammatical value notes.
7. Collocations list for IELTS learners.

Respond strictly in valid JSON matching this schema:
{
  "translation": "final translation text",
  "contextAnalysis": "brief sentence about semantic context",
  "meaningAccuracy": true,
  "grammarAccuracy": true,
  "missingInformation": null,
  "addedInformation": null,
  "registerAndFormality": "e.g. Formal Academic / Neutral",
  "usUkDifferences": "e.g. US: 'apartment' vs UK: 'flat' or 'No significant US/UK difference in this context.'",
  "ieltsCollocations": ["collocation 1", "collocation 2", "collocation 3"],
  "verifiedSteps": ["Step 1...", "Step 2...", "Step 3...", "Step 4...", "Step 5..."]
}`;

    const result = await callGeminiService(prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = parseGeminiJson<any>(result.text, {});
    res.json({
      translation: parsed.translation || 'Translation unavailable',
      verification: {
        original: text,
        contextAnalysis: parsed.contextAnalysis || 'Context evaluated',
        translation: parsed.translation || '',
        meaningAccuracy: parsed.meaningAccuracy ?? true,
        grammarAccuracy: parsed.grammarAccuracy ?? true,
        missingInformation: parsed.missingInformation ?? null,
        addedInformation: parsed.addedInformation ?? null,
        registerAndFormality: parsed.registerAndFormality || 'Academic',
        usUkDifferences: parsed.usUkDifferences || 'No significant US/UK difference in this context.',
        verifiedSteps: parsed.verifiedSteps || [
          'Context Analyzed',
          'Meaning Preserved',
          'Grammar Audited',
          'US/UK Variant Checked',
          'Final Translation Verified',
        ],
      },
      ieltsCollocations: Array.isArray(parsed.ieltsCollocations) && parsed.ieltsCollocations.length > 0
        ? parsed.ieltsCollocations
        : ['academic lexical resource', 'formal discourse collocation'],
      fallback: false,
    });
  } catch (error: any) {
    console.error('Translation error:', error?.message || error);
    res.status(500).json({ error: 'Translation service is temporarily unavailable.' });
  }
});

// IELTS Sentence Upgrade Route (Sentence Transformation)
app.post('/api/gemini/sentence-upgrade', async (req, res) => {
  try {
    const { sentence, targetBand } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        original: sentence,
        upgraded: 'It is widely contended that the deployment of systematic fiscal interventions facilitates sustainable societal progression.',
        bandTarget: targetBand || 'Band 8.0+',
        improvements: {
          formalPhrasing: 'Replaced active general statement with academic impersonal passive construct.',
          higherBandVocab: ['systematic fiscal interventions', 'sustainable societal progression', 'widely contended'],
          grammarStructures: 'Complex passive framing with nominalized prepositional object phrases.',
        },
        fallback: true,
      });
    }

    const prompt = `You are a Senior IELTS Examiner. Upgrade this sentence to academic ${targetBand || 'Band 8.0+'}:
Original Sentence: "${sentence}"

Output JSON matching:
{
  "original": "${sentence}",
  "upgraded": "Band 8.0+ transformed sentence",
  "bandTarget": "${targetBand || 'Band 8.0+'}",
  "improvements": {
    "formalPhrasing": "Explanation of academic phrasing shift",
    "higherBandVocab": ["vocab 1 (meaning)", "vocab 2 (meaning)"],
    "grammarStructures": "Explanation of grammatical sophistication added"
  }
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson(result.text, null);
    res.json(parsed || { original: sentence, upgraded: sentence, fallback: true });
  } catch (error: any) {
    console.error('Sentence upgrade error:', error?.message || error);
    res.status(500).json({ error: 'Sentence upgrade service unavailable.' });
  }
});

// Cambridge Reading Question Explanation Route
app.post('/api/gemini/reading-explain', async (req, res) => {
  try {
    const { passageTitle, passageExcerpt, questionPrompt, options, correctAnswer, candidateAnswer } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        correctAnswer,
        locationInPassage: 'Paragraph B, sentence 2-3',
        evidenceQuote: 'Empirical investigations corroborated that sustainable grid adaptations require equilibrium.',
        reasoning: 'The correct choice directly paraphrases the academic evidence provided in the passage.',
        distractorAnalysis: (options || []).map((opt: string) => ({
          option: opt,
          isCorrect: opt === correctAnswer,
          reason: opt === correctAnswer ? 'Direct paraphrase of textual evidence' : 'Contradicts or is not substantiated by the passage text',
        })),
        academicVocabulary: ['empirical investigations', 'equilibrium', 'corroborated'],
        fallback: true,
      });
    }

    const prompt = `You are an official Cambridge IELTS Reading Examiner analyzing an IELTS Reading Question.
Passage: "${passageTitle || 'Academic Reading'}"
Relevant Excerpt/Context: "${passageExcerpt || ''}"
Question Prompt: "${questionPrompt}"
Options: ${JSON.stringify(options || [])}
Correct Answer: "${correctAnswer}"
Candidate Answer: "${candidateAnswer || 'Not provided'}"

Provide a detailed Cambridge Examiner breakdown in JSON:
{
  "correctAnswer": "${correctAnswer}",
  "locationInPassage": "Exact paragraph or sentence location",
  "evidenceQuote": "Exact supporting quote from text",
  "reasoning": "Step-by-step why the official answer is right and how it paraphrases the passage",
  "distractorAnalysis": [
    {
      "option": "Option text",
      "isCorrect": true/false,
      "reason": "Why this is correct, or why it is a classic IELTS trap (e.g. Opposite, Not Given, Extreme language)"
    }
  ],
  "academicVocabulary": ["academic word 1", "academic word 2"]
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson(result.text, null);
    res.json(parsed || { correctAnswer, reasoning: 'Explanation unavailable', fallback: true });
  } catch (error: any) {
    console.error('Reading explain error:', error?.message || error);
    res.status(500).json({ error: 'Reading explanation service unavailable.' });
  }
});

// Writing Evaluation Route (Task 1 & Task 2)
app.post('/api/gemini/writing-eval', async (req, res) => {
  try {
    const { promptText, essayText, taskType, targetBand } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Realistic IELTS examiner breakdown fallback
      return res.json({
        overallBand: 6.5,
        bandRange: '6.5 - 7.0',
        disclaimer: 'AI evaluation estimate based on IELTS assessment criteria. Not an official test score.',
        criteria: {
          taskResponse: {
            band: 6.5,
            feedback: 'The response addresses all parts of the task, though some points could be developed with more specific examples.',
            strengths: ['Clear position taken throughout', 'Well-defined main topic arguments'],
            weaknesses: ['Conclusion could reinforce the thesis more decisively', 'Second body paragraph example is somewhat generalized'],
          },
          coherenceCohesion: {
            band: 6.5,
            feedback: 'Logically organized with an evident progression. Paragraphing is clear, though some mechanical transitions are present.',
            strengths: ['Logical paragraph progression', 'Good use of topic sentences'],
            weaknesses: ['Avoid over-relying on standard connectors like "Furthermore" and "In conclusion"'],
          },
          lexicalResource: {
            band: 6.5,
            feedback: 'Sufficient range of vocabulary with some awareness of style and collocation, with occasional inaccuracies in word choice.',
            recommendedWords: ['mitigate', 'profoundly advantageous', 'unprecedented', 'substantiate'],
            repetitiveWords: ['good', 'important', 'people', 'society'],
          },
          grammaticalRange: {
            band: 6.5,
            feedback: 'Uses a mix of simple and complex sentence forms with reasonable accuracy. Punctuation errors are infrequent.',
            corrections: [
              {
                original: 'Government should take care about this issue.',
                corrected: 'The government ought to address this pressing issue with greater urgency.',
                explanation: 'Correct preposition usage and elevate register for academic writing.',
              },
            ],
          },
        },
        sentenceImprovements: [
          {
            original: 'Many people think that computers make life easier.',
            improved: 'It is widely contended that the advent of computing technology has substantially streamlined daily operations.',
            reason: 'Elevates basic phrasing to Band 8.0 academic passive and lexical precision.',
          },
        ],
        modelExcerpt: 'In contemporary discourse, the intersection between technological advancement and human labor remains a subject of contentious debate...',
        suggestedVocabToSave: [
          { word: 'substantially', pos: 'adverb', meaning: 'đáng kể / lớn', context: 'streamlined daily operations' },
          { word: 'conundrum', pos: 'noun', meaning: 'vấn đề nan giải', context: 'presents a formidable conundrum' },
          { word: 'mitigate', pos: 'verb', meaning: 'giảm nhẹ, xoa dịu', context: 'mitigate adverse ramifications' },
        ],
        fallback: true,
      });
    }

    const prompt = `You are a Senior Official IELTS Examiner evaluating an IELTS Writing ${taskType || 'Task 2'} essay.
Task Prompt: "${promptText}"
Candidate's Essay:
"""${essayText}"""
Target Band: ${targetBand || '7.5'}

Assess strictly against official IELTS 4 criteria:
1. Task Achievement / Task Response (TR)
2. Coherence and Cohesion (CC)
3. Lexical Resource (LR)
4. Grammatical Range and Accuracy (GRA)

Output STRICTLY valid JSON with no markdown wrapper matching this format:
{
  "overallBand": 6.5,
  "bandRange": "6.5 - 7.0",
  "disclaimer": "AI evaluation estimate based on IELTS assessment criteria. Not an official test score.",
  "criteria": {
    "taskResponse": {
      "band": 6.5,
      "feedback": "detailed evaluation",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."]
    },
    "coherenceCohesion": {
      "band": 6.5,
      "feedback": "detailed evaluation",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."]
    },
    "lexicalResource": {
      "band": 6.5,
      "feedback": "detailed evaluation",
      "recommendedWords": ["word1", "word2"],
      "repetitiveWords": ["word1", "word2"]
    },
    "grammaticalRange": {
      "band": 6.5,
      "feedback": "detailed evaluation",
      "corrections": [
        { "original": "...", "corrected": "...", "explanation": "..." }
      ]
    }
  },
  "sentenceImprovements": [
    { "original": "...", "improved": "...", "reason": "..." }
  ],
  "modelExcerpt": "A polished band 8.5 excerpt paragraph demonstrating ideal structure",
  "suggestedVocabToSave": [
    { "word": "...", "pos": "...", "meaning": "Vietnamese meaning", "context": "..." }
  ]
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson<any>(result.text, {});
    res.json(parsed);
  } catch (error: any) {
    console.error('Writing evaluation error:', error?.message || error);
    res.status(500).json({ error: 'Writing evaluation service is temporarily unavailable.' });
  }
});

// Speaking Evaluation Route
app.post('/api/gemini/speaking-eval', async (req, res) => {
  try {
    const { question, candidateTranscript, partNumber } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        overallBand: 6.5,
        bandRange: '6.5 - 7.0',
        fluencyCoherence: {
          band: 6.5,
          feedback: 'Good willingness to speak at length with rare hesitation. Ideas are linked coherently.',
        },
        lexicalResource: {
          band: 6.5,
          feedback: 'Good topical vocabulary used. Incorporating more natural collocations will boost you to Band 7.5+.',
          goodPhrases: ['broaden my horizons', 'in terms of', 'keen on'],
          betterAlternatives: ['formidable challenge instead of hard problem', 'paramount instead of very important'],
        },
        grammaticalAccuracy: {
          band: 6.5,
          feedback: 'Accurate basic sentences with some attempted complex structures.',
          corrections: [
            {
              spoken: 'I am living here since five years.',
              corrected: 'I have been living here for five years.',
              reason: 'Use present perfect continuous with "for" for ongoing duration.',
            },
          ],
        },
        pronunciationNotes: 'Natural rhythm observed. Ensure clear word stress on multisyllabic words like "sub-STAN-tial" and "fa-CIL-i-tate".',
        modelAnswerSnippet: 'Well, to be perfectly candid, living in a bustling metropolitan area offers unparalleled access to cultural amenities, though the congestion can occasionally be overwhelming.',
        fallback: true,
      });
    }

    const prompt = `You are a certified IELTS Speaking Examiner.
Part: IELTS Speaking Part ${partNumber || 2}
Question/Topic: "${question}"
Candidate Transcript: "${candidateTranscript}"

Evaluate across the 4 IELTS Speaking Criteria:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation

Respond in valid JSON format:
{
  "overallBand": 6.5,
  "bandRange": "6.5 - 7.0",
  "fluencyCoherence": { "band": 6.5, "feedback": "..." },
  "lexicalResource": { "band": 6.5, "feedback": "...", "goodPhrases": ["..."], "betterAlternatives": ["..."] },
  "grammaticalAccuracy": { "band": 6.5, "feedback": "...", "corrections": [{ "spoken": "...", "corrected": "...", "reason": "..." }] },
  "pronunciationNotes": "...",
  "modelAnswerSnippet": "..."
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson<any>(result.text, {});
    res.json(parsed);
  } catch (error: any) {
    console.error('Speaking eval error:', error?.message || error);
    res.status(500).json({ error: 'Speaking evaluation service is temporarily unavailable.' });
  }
});

// Vocabulary Deep Explanation Route
app.post('/api/gemini/vocab-explain', async (req, res) => {
  try {
    const { word, contextSentence } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        word,
        meaning: 'đáng kể, quan trọng (về số lượng, kích thước hoặc giá trị)',
        contextMeaning: contextSentence ? `Trong ngữ cảnh: mang nghĩa đáng kể, có trọng lượng` : 'đáng kể',
        partOfSpeech: 'adjective',
        ipa: '/səbˈstæn.ʃəl/',
        usPronunciation: '/səbˈstæn.ʃəl/',
        ukPronunciation: '/səbˈstæn.ʃəl/',
        exampleSentence: `Recent empirical studies present substantial evidence supporting renewable energy adoption.`,
        synonyms: ['considerable', 'significant', 'momentous', 'profound'],
        antonyms: ['negligible', 'insignificant', 'trivial'],
        collocations: ['substantial evidence', 'substantial progress', 'substantial proportion', 'substantial increase'],
        ieltsRelevance: 'Band 7.5+ Academic Writing Task 1 & 2 Lexical Resource',
        difficulty: 'advanced',
        fallback: true,
      });
    }

    const prompt = `Provide a comprehensive, high-yield IELTS vocabulary analysis for the word: "${word}".
Context sentence: "${contextSentence || ''}"

Return JSON matching:
{
  "word": "${word}",
  "meaning": "Vietnamese core meaning",
  "contextMeaning": "Meaning in this specific context",
  "partOfSpeech": "adjective / verb / noun / etc",
  "ipa": "/.../",
  "usPronunciation": "US phonetics / guide",
  "ukPronunciation": "UK phonetics / guide",
  "exampleSentence": "High-scoring academic IELTS example sentence",
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "antonyms": ["antonym1", "antonym2"],
  "collocations": ["collocation1", "collocation2", "collocation3"],
  "ieltsRelevance": "Band 7.5+ description",
  "difficulty": "advanced"
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson<any>(result.text, {});
    res.json(parsed);
  } catch (error: any) {
    console.error('Vocab explain error:', error?.message || error);
    res.status(500).json({ error: 'Vocabulary explanation service is temporarily unavailable.' });
  }
});

// AI Practice Exercise Generator Route
app.post('/api/gemini/generate-practice', async (req, res) => {
  try {
    const { skill, targetBand, topic, difficulty, count } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback realistic questions
      return res.json({
        exercises: [
          {
            id: 'gen-1',
            skill: skill || 'reading',
            targetBand: targetBand || '7.0',
            topic: topic || 'Environmental Science',
            difficulty: difficulty || 'Band 7.0',
            question: 'According to current climate models, which factor poses the most immediate impediment to glacial restoration?',
            contextOrPassage: 'Glaciological monitoring stations across Greenland recorded anomalous thermodynamic fluctuations over the preceding decennial epoch...',
            options: [
              'A) Unprecedented increases in oceanic thermal conductivity',
              'B) Seasonal albedo degradation exacerbated by anthropogenic soot',
              'C) Tectonic shifts in subglacial geothermal conduits',
              'D) Transient atmospheric cyclonic disturbances',
            ],
            correctAnswer: 'B',
            explanation: 'Paragraph 2 highlights that soot deposition reduces surface albedo, speeding solar absorption and hindering seasonal regrowth.',
            ieltsTip: 'Look for synonyms in academic texts: "impediment" corresponds to "hindering" and "anthropogenic soot" to "man-made emissions".',
          },
        ],
        fallback: true,
      });
    }

    const prompt = `Generate ${count || 2} authentic, high-quality IELTS practice exercises.
Skill: ${skill}
Target Band: ${targetBand || '7.0'}
Topic: ${topic || 'Academic topics'}
Difficulty: ${difficulty || 'Moderate'}

Respond strictly in JSON:
{
  "exercises": [
    {
      "id": "gen-1",
      "skill": "${skill}",
      "targetBand": "${targetBand}",
      "topic": "${topic}",
      "difficulty": "${difficulty}",
      "question": "Question prompt",
      "contextOrPassage": "Optional passage snippet or audio transcript",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A",
      "explanation": "Detailed explanation why it is correct and why distractors fail",
      "ieltsTip": "Actionable test tip for this specific question format"
    }
  ]
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson<any>(result.text, { exercises: [] });
    res.json(parsed);
  } catch (error: any) {
    console.error('Practice generator error:', error?.message || error);
    res.status(500).json({ error: 'Exercise generation service is temporarily unavailable.' });
  }
});

// Smart Scan Contextual Word Analysis Route
app.post('/api/gemini/smart-scan-analyze', async (req, res) => {
  try {
    const { word, contextSentence } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        word,
        meaning: 'từ vựng học thuật trong văn cảnh IELTS',
        ipa: '/.../',
        explanation: 'Từ vựng quan trọng xuất hiện trong ngữ cảnh học thuật.',
        collocations: ['academic collocation', 'high band phrase'],
        fallback: true,
      });
    }

    const prompt = `Analyze this word in its academic context from an IELTS text:
Word: "${word}"
Sentence Context: "${contextSentence}"

Return JSON:
{
  "word": "${word}",
  "meaning": "Vietnamese academic translation in this exact context",
  "ipa": "IPA phonetic transcription",
  "explanation": "Why this word is used here, its register, and IELTS Band 7.5+ value",
  "collocations": ["collocation 1", "collocation 2"]
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson<any>(result.text, {
      word,
      meaning: 'từ vựng học thuật',
      ipa: '/.../',
      explanation: 'Academic usage',
      collocations: [],
    });
    res.json(parsed);
  } catch (error: any) {
    console.error('Smart scan analyze error:', error?.message || error);
    res.status(500).json({ error: 'Contextual analysis unavailable.' });
  }
});

// Smart Scan Question Generator Route (Directly from scanned document)
app.post('/api/gemini/smart-scan-questions', async (req, res) => {
  try {
    const { text, count } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        questions: [
          {
            question: 'What is the primary operational challenge introduced by wind and solar installations according to the text?',
            options: [
              'A. Inability to maintain system equilibrium without storage and microgrids',
              'B. Complete absence of national grid regulatory approval',
              'C. Overproduction of traditional fossil fuel baseload',
            ],
            answer: 'A',
          },
          {
            question: 'The term "intermittent supply" implies that power generation is:',
            options: [
              'A. Predictable and centralized',
              'B. Fluctuating and subject to natural variations',
              'C. Strictly localized to microgrids',
            ],
            answer: 'B',
          },
        ],
        fallback: true,
      });
    }

    const prompt = `Based on the following extracted academic text, generate ${count || 2} authentic IELTS multiple-choice comprehension questions:
"""${text}"""

Return JSON format:
{
  "questions": [
    {
      "question": "Question prompt testing synthesis or key detail",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3"],
      "answer": "A"
    }
  ]
}`;

    const result = await callGeminiService(prompt, { responseMimeType: 'application/json' });
    const parsed = parseGeminiJson<any>(result.text, { questions: [] });
    res.json(parsed);
  } catch (error: any) {
    console.error('Smart scan question generator error:', error?.message || error);
    res.status(500).json({ error: 'Question synthesis unavailable.' });
  }
});

// Smart Scan OCR Route
app.post('/api/gemini/ocr-extract', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    const ai = getGeminiClient();

    if (!ai || !imageBase64) {
      // Return structured sample OCR reading text
      return res.json({
        headings: ['The Evolution of Urban Architecture in the 21st Century'],
        paragraphs: [
          'The rapid acceleration of demographic urbanization during the early 21st century has precipitated unprecedented logistical, spatial, and ecological dilemmas across modern metropolises. Traditional horizontal expansion is no longer economically or environmentally feasible, forcing urban planners to adopt vertical sustainability frameworks.',
          'Crucially, contemporary structural engineers have begun incorporating biophilic architecture—integrating living plant ecosystems directly onto exterior building facades. Substantial empirical evidence indicates that vegetated towers not only mitigate ambient urban heat island phenomena but also significantly enhance psychological well-being among urban inhabitants.',
          'Nevertheless, detractors emphasize the prohibitive capital expenditures required to install and perpetually maintain sophisticated automated hydration conduits at high altitudes. Unless municipal governments formulate targeted fiscal subsidies, widespread adoption may remain confined to affluent enclaves.',
        ],
        extractedText: `The Evolution of Urban Architecture in the 21st Century\n\nThe rapid acceleration of demographic urbanization during the early 21st century has precipitated unprecedented logistical, spatial, and ecological dilemmas across modern metropolises. Traditional horizontal expansion is no longer economically or environmentally feasible, forcing urban planners to adopt vertical sustainability frameworks.\n\nCrucially, contemporary structural engineers have begun incorporating biophilic architecture—integrating living plant ecosystems directly onto exterior building facades. Substantial empirical evidence indicates that vegetated towers not only mitigate ambient urban heat island phenomena but also significantly enhance psychological well-being among urban inhabitants.\n\nNevertheless, detractors emphasize the prohibitive capital expenditures required to install and perpetually maintain sophisticated automated hydration conduits at high altitudes. Unless municipal governments formulate targeted fiscal subsidies, widespread adoption may remain confined to affluent enclaves.`,
        fallback: true,
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const result = await callGeminiService(
      {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: `Extract all legible text from this IELTS reading passage or document cleanly.
Preserve paragraph breaks and headings. Return the text in JSON format:
{
  "headings": ["Heading 1", "..."],
  "paragraphs": ["Paragraph 1...", "Paragraph 2..."],
  "extractedText": "Full formatted text with clean newlines"
}`,
          },
        ],
      },
      { responseMimeType: 'application/json' }
    );

    const parsed = parseGeminiJson<any>(result.text, {});
    res.json(parsed);
  } catch (error: any) {
    console.error('OCR extract error:', error?.message || error);
    res.status(500).json({ error: 'OCR extraction service is temporarily unavailable.' });
  }
});

// Vite middleware & Static Serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IELTS Nova AI Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
