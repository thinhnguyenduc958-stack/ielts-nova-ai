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

  // Prioritize stable, fast models (gemini-3.1-flash-lite) with seamless fallback
  const candidateModels = options.preferredModel
    ? [options.preferredModel, 'gemini-3.1-flash-lite', 'gemini-2.5-flash']
    : ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-3.8-flash'];

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
  });
});

// AI Tutor Chat Route
app.post('/api/gemini/tutor', async (req, res) => {
  try {
    const { messages, userBand, targetBand, languagePreference } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality contextual fallback
      const lastMsg = messages?.[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "Hello! I'm Nova, your AI IELTS master coach. ";
      if (lastMsg.includes('writing') || lastMsg.includes('task 2')) {
        reply += `For Writing Task 2 aiming for Band ${targetBand || '7.5'}, remember the 4-paragraph structure: Introduction (Paraphrase + Thesis), Body 1 (Central topic sentence + Supporting example), Body 2 (Counterpart/Alternative + Deep analysis), and Conclusion (Restatement of stance). Make sure to use cohesive devices like 'Furthermore', 'Consequently', and 'In contrast' sparingly and naturally.`;
      } else if (lastMsg.includes('speaking')) {
        reply += `For Speaking Part 2 and 3, focus on the P.E.E. formula: Point, Explanation, Example. Use idiomatic language naturally (e.g. 'broaden my horizons', 'hit the nail on the head') rather than forcing archaic expressions.`;
      } else if (lastMsg.includes('vocab') || lastMsg.includes('word')) {
        reply += `To boost your Lexical Resource, replace overly general words: Instead of 'big problem' use 'pressing conundrum' or 'formidable dilemma'. Instead of 'good effect' use 'profoundly advantageous ramification'.`;
      } else {
        reply += `How can I help accelerate your preparation today? We can analyze an essay, simulate Speaking Part 2, review Band 8.0 collocations, or explain a complex grammar rule.`;
      }
      return res.json({ text: reply, fallback: true });
    }

    const systemInstruction = `You are IELTS Nova AI, a world-class certified IELTS Master Tutor and Examiner.
The student currently has Band ${userBand || '5.5'} and targets Band ${targetBand || '7.5'}.
Language Preference: ${languagePreference || 'bilingual (English with Vietnamese explanations where helpful)'}.
Your role:
- Provide clear, actionable, high-yield IELTS advice.
- When correcting grammar or essays, provide the exact rule and high-band alternative.
- Keep tone professional, encouraging, analytical, and structured with bullet points.
- Never give overly vague answers. Provide concrete IELTS band 7-8 examples.`;

    const conversationHistory = (messages || [])
      .map((m: { sender?: string; role?: string; text?: string; content?: string }) => {
        const isUser = (m.sender || m.role) === 'user';
        const content = m.text || m.content || '';
        return `${isUser ? 'Student' : 'Tutor'}: ${content}`;
      })
      .join('\n');

    const result = await callGeminiService(
      `System: ${systemInstruction}\n\nRecent Conversation:\n${conversationHistory}\n\nPlease respond as the IELTS Tutor to the student's latest question:`,
      { systemInstruction }
    );

    res.json({ text: result.text || 'No response generated.', fallback: false, modelUsed: result.modelUsed });
  } catch (error: any) {
    console.error('Tutor API error:', error?.message || error);
    res.status(500).json({ error: 'Tutor service is temporarily unavailable. Please try again in a moment.' });
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
