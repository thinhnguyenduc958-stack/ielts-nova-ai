import { GrammarTopic } from '../types';

export const ieltsGrammarTopics: GrammarTopic[] = [
  {
    id: 'inversion',
    title: 'Inversion for Emphasis',
    titleVi: 'Đảo ngữ nâng cao (Band 8.0+)',
    bandTarget: 'Band 8.0 - 9.0',
    category: 'Complex Structures',
    explanation: 'Inversion places negative or restrictive adverbials at the beginning of a clause, followed by an auxiliary verb and the subject. It creates authoritative academic emphasis in Task 2 essays.',
    formula: 'Negative Adverbial (Not only / Seldom / Rarely / Under no circumstances) + Auxiliary + Subject + Main Verb',
    examples: [
      {
        standard: 'People rarely realize the profound ecological consequences of overconsumption.',
        band8: 'Rarely do individuals comprehend the profound ecological repercussions of uncurbed overconsumption.',
        note: 'Fronting "Rarely" elevates grammatical range and creates formal academic gravity.',
      },
      {
        standard: 'The policy does not only reduce traffic congestion, but it also improves public health.',
        band8: 'Not only does the policy curtail vehicular congestion, but it also substantially fosters public health.',
        note: 'Subject-auxiliary inversion with "Not only does..." immediately demonstrates band 8+ syntactic control.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Seldom people understand the environmental cost.',
        correct: 'Seldom do people understand the environmental cost.',
        reason: 'Forgetting to insert the auxiliary verb (do/does/did) between the negative adverbial and the subject.',
      },
    ],
  },
  {
    id: 'hedging',
    title: 'Academic Hedging & Tentative Language',
    titleVi: 'Ngôn ngữ dè dặt / Khách quan học thuật',
    bandTarget: 'Band 7.5 - 8.5',
    category: 'Academic Style',
    explanation: 'Hedging avoids overgeneralization and dogmatic assertions. Examiners penalize absolute statements like "all children become violent" and reward nuanced qualifications like "evidence suggests a potential correlation".',
    formula: 'Subject + Tentative Verb (tends to / appears to / would seem to) + Adverb of Probability (plausibly / arguably) + Verb',
    examples: [
      {
        standard: 'Social media makes all teenagers depressed.',
        band8: 'Excessive engagement with social media arguably tends to exacerbate depressive tendencies among susceptible adolescents.',
        note: 'Replaces absolute claim with "arguably tends to exacerbate", ensuring objective academic tone.',
      },
      {
        standard: 'Electric vehicles will eliminate urban pollution completely.',
        band8: 'The widespread adoption of electric vehicles has the potential to mitigate a substantial proportion of vehicular emissions.',
        note: 'Hedging with "has the potential to mitigate a substantial proportion" avoids false absolutes.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'It is a 100% undisputed truth that technology ruins memory.',
        correct: 'A substantial body of research indicates that digital dependency may impair short-term cognitive recall.',
        reason: 'In IELTS Academic Writing, dogmatic absolutes violate academic objectivity.',
      },
    ],
  },
  {
    id: 'cleft',
    title: 'Cleft Sentences (Focus Structures)',
    titleVi: 'Câu chẻ tạo điểm nhấn (It is... that / What...)',
    bandTarget: 'Band 8.0+',
    category: 'Complex Structures',
    explanation: 'Cleft sentences split a single clause into two parts to highlight specific thematic elements or causal factors in IELTS Writing Task 2.',
    formula: 'It is/was + [Focused Element] + that/who + [Remainder of Clause] OR What + [Clause] + is/was + [Focused Element]',
    examples: [
      {
        standard: 'Government subsidies accelerate the transition toward renewable energy.',
        band8: 'It is targeted government subsidies that crucially accelerate the societal transition toward renewable alternatives.',
        note: 'Focuses direct analytical spotlight on the decisive role of state subsidies.',
      },
      {
        standard: 'Society needs systematic educational reform.',
        band8: 'What contemporary society urgently requires is systemic pedagogical restructuring.',
        note: 'Pseudo-cleft structure starting with "What..." gives powerful concluding cohesion.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'It is the government which must pay.',
        correct: 'It is the government that must intervene.',
        reason: 'In modern academic cleft sentences, "that" is preferred over "which".',
      },
    ],
  },
  {
    id: 'nominalization',
    title: 'Nominalization (Noun Packaging)',
    titleVi: 'Danh từ hóa trong văn phong học thuật',
    bandTarget: 'Band 7.5 - 9.0',
    category: 'Academic Style',
    explanation: 'Nominalization converts verbs and adjectives into dense noun phrases, which is the hallmark of Cambridge Band 8-9 academic prose.',
    formula: 'Verb/Adj clause -> Abstract Noun Phrase + Prepositional Complex',
    examples: [
      {
        standard: 'Because cities are expanding rapidly, farms are disappearing.',
        band8: 'The rapid expansion of urban conglomerates has precipitated the wholesale loss of arable agricultural land.',
        note: 'Transforms conversational clause ("expanding rapidly") into compact noun phrase ("The rapid expansion of...").',
      },
    ],
    commonMistakes: [
      {
        wrong: 'The destructioning of forests is bad.',
        correct: 'The degradation of forest ecosystems presents profound ecological hazards.',
        reason: 'Use standard academic derivational morphology rather than colloquial gerunds.',
      },
    ],
  },
];
