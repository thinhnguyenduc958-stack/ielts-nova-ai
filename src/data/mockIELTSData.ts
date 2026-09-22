import { ReadingPassage, ListeningTest, VocabularyItem, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_nova_01',
  name: 'Candidate',
  targetBand: '6.5',
  currentBand: 'Not assessed',
  breakdown: {
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
  },
  preferredLanguage: 'vi',
  preferredVariant: 'US',
  dailyGoalMinutes: 30,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  completedActivities: 0,
  theme: 'system',
};

// Built-in System IELTS Academic Vocabulary Dictionary (Preserved System Content)
export const systemIELTSVocabulary: VocabularyItem[] = [
  {
    id: 'vocab-1',
    word: 'substantial',
    meaning: 'đáng kể, lớn lao, có giá trị thực sự',
    contextMeaning: 'Đáng kể về số lượng và sức nặng chứng cứ',
    partOfSpeech: 'adjective',
    ipa: '/səbˈstæn.ʃəl/',
    exampleSentence: 'There is substantial empirical evidence suggesting that air quality directly influences cognitive performance.',
    synonyms: ['considerable', 'significant', 'momentous', 'profound'],
    antonyms: ['negligible', 'trivial', 'inconsequential'],
    collocations: ['substantial evidence', 'substantial progress', 'substantial portion', 'substantial difference'],
    ieltsRelevance: 'Band 7.5+ Academic Task 1 & 2 Lexical Resource',
    difficulty: 'advanced',
    status: 'learning',
    sourceContext: 'Substantial empirical evidence indicates that vegetated towers mitigate ambient urban heat.',
    dateAdded: '2025-05-10',
    reviewCount: 4,
  },
  {
    id: 'vocab-2',
    word: 'mitigate',
    meaning: 'giảm nhẹ, làm dịu bớt (tác hại, rủi ro)',
    contextMeaning: 'Làm suy giảm mức độ nhiệt độ đô thị',
    partOfSpeech: 'verb',
    ipa: '/ˈmɪt.ɪ.ɡeɪt/',
    exampleSentence: 'Governments should enact stringent regulations to mitigate the adverse repercussions of industrial pollution.',
    synonyms: ['alleviate', 'attenuate', 'diminish', 'curb'],
    antonyms: ['exacerbate', 'aggravate', 'intensify'],
    collocations: ['mitigate the impact', 'mitigate climate change', 'mitigate the risks', 'mitigate damage'],
    ieltsRelevance: 'Band 8.0+ Writing Task 2 Problem-Solution Essays',
    difficulty: 'advanced',
    status: 'review',
    sourceContext: 'Vegetated towers not only mitigate ambient urban heat island phenomena...',
    dateAdded: '2025-05-11',
    reviewCount: 6,
  },
  {
    id: 'vocab-3',
    word: 'corroborate',
    meaning: 'chứng thực, củng cố bằng bằng chứng mới',
    contextMeaning: 'Chứng minh tính xác thực của giả thuyết nghiên cứu',
    partOfSpeech: 'verb',
    ipa: '/kəˈrɒb.ə.reɪt/',
    exampleSentence: 'Subsequent experimental trials have corroborated earlier epidemiological findings.',
    synonyms: ['substantiate', 'verify', 'authenticate', 'validate'],
    antonyms: ['refute', 'contradict', 'disprove'],
    collocations: ['corroborate the hypothesis', 'corroborate the testimony', 'corroborate evidence'],
    ieltsRelevance: 'Band 8.0+ Academic Reading & Writing',
    difficulty: 'mastery',
    status: 'new',
    sourceContext: 'Archaeological excavations in the delta corroborate ancient maritime chronicles.',
    dateAdded: '2025-05-12',
    reviewCount: 2,
  },
  {
    id: 'vocab-4',
    word: 'ubiquitous',
    meaning: 'Phổ biến, có mặt khắp nơi',
    contextMeaning: 'Hiện diện ở mọi phương diện đời sống số',
    partOfSpeech: 'adjective',
    ipa: '/juːˈbɪk.wɪ.təs/',
    exampleSentence: 'Smartphones have become ubiquitous in modern society.',
    synonyms: ['omnipresent', 'pervasive', 'prevalent', 'universal'],
    antonyms: ['scarce', 'rare', 'infrequent'],
    collocations: ['ubiquitous presence', 'ubiquitous influence', 'become ubiquitous'],
    ieltsRelevance: 'Band 7.5+',
    difficulty: 'advanced',
    status: 'mastered',
    sourceContext: 'The ubiquitous integration of automated navigation tools has transformed global logistics.',
    dateAdded: '2025-05-08',
    reviewCount: 12,
  },
  {
    id: 'vocab-5',
    word: 'unprecedented',
    meaning: 'chưa từng có tiền lệ, vô tiền khoáng hậu',
    contextMeaning: 'Mức độ tăng trưởng chưa từng thấy trong lịch sử',
    partOfSpeech: 'adjective',
    ipa: '/ʌnˈpres.ɪ.den.tɪd/',
    exampleSentence: 'The global economy witnessed an unprecedented influx of venture capital towards renewable energy solutions.',
    synonyms: ['unparalleled', 'singular', 'novel', 'unmatched'],
    antonyms: ['customary', 'precedented', 'routine'],
    collocations: ['unprecedented growth', 'unprecedented challenge', 'at an unprecedented rate'],
    ieltsRelevance: 'Band 7.0+ Academic Writing Task 1 & 2',
    difficulty: 'intermediate',
    status: 'learning',
    sourceContext: 'The rapid acceleration of demographic urbanization precipitated unprecedented dilemmas.',
    dateAdded: '2025-05-14',
    reviewCount: 5,
  },
  {
    id: 'vocab-6',
    word: 'exacerbate',
    meaning: 'làm trầm trọng thêm, làm tệ hơn',
    contextMeaning: 'Làm xấu đi khủng hoảng nhà ở hiện hữu',
    partOfSpeech: 'verb',
    ipa: '/ɪɡˈzæs.ə.beɪt/',
    exampleSentence: 'Escalating interest rates will inevitably exacerbate the existing housing affordability crisis.',
    synonyms: ['worsen', 'aggravate', 'compound', 'intensify'],
    antonyms: ['alleviate', 'ameliorate', 'relieve'],
    collocations: ['exacerbate the problem', 'exacerbate tension', 'exacerbate symptoms'],
    ieltsRelevance: 'Band 8.0+ Writing Task 2 Cause-Effect',
    difficulty: 'advanced',
    status: 'new',
    sourceContext: 'Unregulated tourism will exacerbate soil erosion along the fragile coastline.',
    dateAdded: '2025-05-15',
    reviewCount: 1,
  },
];

export const sampleVocabulary = systemIELTSVocabulary;

export const sampleReadingPassages: ReadingPassage[] = [
  {
    id: 'read-01',
    title: 'Urban Architecture and the Rise of Vertical Forests',
    topic: 'Urban Planning & Environmental Science',
    bandLevel: 'Band 7.0 - 8.0',
    durationMinutes: 20,
    content: `The rapid acceleration of demographic urbanization during the early 21st century has precipitated unprecedented logistical, spatial, and ecological dilemmas across modern metropolises. Traditional horizontal expansion is no longer economically or environmentally feasible, forcing urban planners to adopt vertical sustainability frameworks.

Crucially, contemporary structural engineers have begun incorporating biophilic architecture—integrating living plant ecosystems directly onto exterior building facades. Substantial empirical evidence indicates that vegetated towers not only mitigate ambient urban heat island phenomena but also significantly enhance psychological well-being among urban inhabitants.

In cities like Milan, Singapore, and Sydney, vertical forests (Bosco Verticale) host thousands of trees, shrubs, and perennial flora suspended along cantilevered balconies. These botanical envelopes actively sequester carbon dioxide, attenuate particulate air pollution, and provide avian habitats amidst concrete density. Furthermore, evapotranspiration from the dense foliage creates a microclimate buffer that reduces interior thermal loads by up to 30%, curtailing seasonal reliance on artificial air conditioning.

Nevertheless, detractors emphasize the prohibitive capital expenditures required to install and perpetually maintain sophisticated automated hydration conduits at high altitudes. Structural calculations must account for intense wind shear and substantial soil moisture mass under storm conditions. Unless municipal governments formulate targeted fiscal subsidies, widespread adoption may remain confined to affluent enclaves.`,
    paragraphs: [
      {
        id: 'p-1',
        title: 'Paragraph A: The Urbanization Challenge',
        text: 'The rapid acceleration of demographic urbanization during the early 21st century has precipitated unprecedented logistical, spatial, and ecological dilemmas across modern metropolises. Traditional horizontal expansion is no longer economically or environmentally feasible, forcing urban planners to adopt vertical sustainability frameworks.',
      },
      {
        id: 'p-2',
        title: 'Paragraph B: Principles of Biophilic Architecture',
        text: 'Crucially, contemporary structural engineers have begun incorporating biophilic architecture—integrating living plant ecosystems directly onto exterior building facades. Substantial empirical evidence indicates that vegetated towers not only mitigate ambient urban heat island phenomena but also significantly enhance psychological well-being among urban inhabitants.',
      },
      {
        id: 'p-3',
        title: 'Paragraph C: Environmental Mechanisms in Practice',
        text: 'In cities like Milan, Singapore, and Sydney, vertical forests (Bosco Verticale) host thousands of trees, shrubs, and perennial flora suspended along cantilevered balconies. These botanical envelopes actively sequester carbon dioxide, attenuate particulate air pollution, and provide avian habitats amidst concrete density. Furthermore, evapotranspiration from the dense foliage creates a microclimate buffer that reduces interior thermal loads by up to 30%, curtailing seasonal reliance on artificial air conditioning.',
      },
      {
        id: 'p-4',
        title: 'Paragraph D: Structural & Financial Impediments',
        text: 'Nevertheless, detractors emphasize the prohibitive capital expenditures required to install and perpetually maintain sophisticated automated hydration conduits at high altitudes. Structural calculations must account for intense wind shear and substantial soil moisture mass under storm conditions. Unless municipal governments formulate targeted fiscal subsidies, widespread adoption may remain confined to affluent enclaves.',
      },
    ],
    questions: [
      {
        id: 'rq-1',
        type: 'true-false-notgiven',
        prompt: 'Traditional horizontal city expansion is currently regarded as both economically and ecologically sustainable.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        explanation: 'Paragraph A directly states: "Traditional horizontal expansion is no longer economically or environmentally feasible".',
        paragraphRef: 'p-1',
      },
      {
        id: 'rq-2',
        type: 'multiple-choice',
        prompt: 'According to Paragraph C, how does dense balcony foliage affect interior temperatures?',
        options: [
          'A) It raises the ambient humidity beyond comfortable levels.',
          'B) It buffers interior thermal loads through evapotranspiration, lowering cooling demands by up to 30%.',
          'C) It relies entirely on artificial misting systems to keep residents cool.',
          'D) It causes structural heat retention during the winter months.',
        ],
        correctAnswer: 'B',
        explanation: 'Paragraph C explains that evapotranspiration creates a microclimate buffer reducing interior thermal loads by up to 30%, curtailing reliance on air conditioning.',
        paragraphRef: 'p-3',
      },
      {
        id: 'rq-3',
        type: 'multiple-choice',
        prompt: 'Summary Completion: Complete the summary below using NO MORE THAN TWO WORDS from Paragraph C: Vertical foliage creates a microclimate buffer that curtails seasonal reliance on ______.',
        options: [
          'A) artificial air conditioning',
          'B) particulate air pollution',
          'C) municipal water subsidies',
          'D) concrete cantilevers',
        ],
        correctAnswer: 'A) artificial air conditioning',
        explanation: 'Paragraph C specifies that evapotranspiration creates a microclimate buffer, "curtailing seasonal reliance on artificial air conditioning."',
        paragraphRef: 'p-3',
      },
      {
        id: 'rq-4',
        type: 'matching-headings',
        prompt: 'Which heading best fits Paragraph D?',
        options: [
          'i. Biological diversity in urban canopies',
          'ii. Engineering constraints and economic limitations',
          'iii. International architectural awards',
          'iv. The psychological benefits of green spaces',
        ],
        correctAnswer: 'ii. Engineering constraints and economic limitations',
        explanation: 'Paragraph D outlines the high capital costs, automated hydration challenges, wind shear calculations, and risk of remaining confined to affluent enclaves.',
        paragraphRef: 'p-4',
      },
    ],
  },
];

export const sampleListeningTests: ListeningTest[] = [
  {
    id: 'listen-01',
    title: 'University Campus Sustainable Mobility Initiative',
    sectionNumber: 2,
    scenario: 'A university campus coordinator briefs new international students on the green transport network, rental hubs, and cycling safety policies.',
    durationSeconds: 150,
    audioSimulatedText: `Welcome everyone to Northfield University! Today I will outline our Campus Sustainable Mobility Scheme. First, let us look at the bicycle rental stations. There are three primary hubs: the Central Library, the Sports Pavilion, and the North Residence Hall. To access a bicycle, you must download the CampusRide application and link your student identification card. Rental is free for the first forty-five minutes. After that, a nominal fee of one pound fifty per half-hour applies. 
Please note safety regulations: helmets are mandatory throughout the internal perimeter, and cycling across the pedestrian quadrangle between 11 AM and 2 PM is strictly prohibited due to heavy foot traffic. If you encounter any mechanical breakdown, yellow emergency repair docks with pneumatic pumps and hex keys are situated directly adjacent to every bike rack.`,
    transcript: `[00:00] Coordinator: "Welcome everyone to Northfield University! Today I will outline our Campus Sustainable Mobility Scheme. 
[00:20] First, let us look at the bicycle rental stations. There are three primary hubs: the Central Library, the Sports Pavilion, and the North Residence Hall. 
[00:45] To access a bicycle, you must download the CampusRide application and link your student identification card. 
[01:05] Rental is free for the first forty-five minutes. After that, a nominal fee of one pound fifty per half-hour applies. 
[01:25] Please note safety regulations: helmets are mandatory throughout the internal perimeter, and cycling across the pedestrian quadrangle between 11 AM and 2 PM is strictly prohibited due to heavy foot traffic. 
[01:50] If you encounter any mechanical breakdown, yellow emergency repair docks with pneumatic pumps and hex keys are situated directly adjacent to every bike rack."`,
    keyVocab: [
      { word: 'pedestrian', meaning: 'người đi bộ', ipa: '/pəˈdes.tri.ən/' },
      { word: 'prohibited', meaning: 'bị cấm đoán theo luật', ipa: '/prəˈhɪb.ɪ.tɪd/' },
      { word: 'adjacent', meaning: 'kế bên, tiếp giáp', ipa: '/əˈdʒeɪ.sənt/' },
      { word: 'pneumatic', meaning: 'chạy bằng khí nén / bơm hơi', ipa: '/njuːˈmæt.ɪk/' },
    ],
    questions: [
      {
        id: 'lq-1',
        type: 'form-completion',
        prompt: 'Free cycling duration: first [ ______ ] minutes.',
        correctAnswer: '45',
        explanation: 'The speaker states: "Rental is free for the first forty-five minutes."',
        timestampSeconds: 65,
      },
      {
        id: 'lq-2',
        type: 'multiple-choice',
        prompt: 'Cycling is forbidden across the pedestrian quadrangle during which hours?',
        options: [
          'A) 9:00 AM - 11:00 AM',
          'B) 11:00 AM - 2:00 PM',
          'C) 1:00 PM - 4:00 PM',
          'D) After 6:00 PM',
        ],
        correctAnswer: 'B',
        explanation: 'The coordinator highlights: "cycling across the pedestrian quadrangle between 11 AM and 2 PM is strictly prohibited".',
        timestampSeconds: 85,
      },
      {
        id: 'lq-3',
        type: 'form-completion',
        prompt: 'Color of emergency repair docks: [ ______ ].',
        correctAnswer: 'yellow',
        explanation: 'The speaker describes: "yellow emergency repair docks with pneumatic pumps".',
        timestampSeconds: 110,
      },
    ],
  },
];

export const sampleWritingPrompts = [
  {
    id: 'w-task2-01',
    taskType: 'Task 2',
    prompt: 'Some people argue that technological progress leads to the loss of traditional cultural customs and identity. Others believe that technology actually helps preserve and disseminate cultural heritage. Discuss both views and give your own opinion.',
    targetBand: '7.5',
    recommendedWordCount: 250,
    timeLimitMinutes: 40,
    sampleBand8Essay: `The rapid proliferations of digital technology and globalized communication networks have ignited vigorous debates concerning cultural continuity. While a cohort of commentators asserts that technological homogeneity erodes ancestral customs, I contend that innovative digital tools serve as indispensable instruments for cataloging, safeguarding, and revitalizing cultural legacies.

On the one hand, valid concerns exist regarding cultural dilution. The pervasive reach of global streaming conglomerates and social media platforms frequently propagates Western linguistic and aesthetic standards, subtly displacing localized folklore and dialectal richness among younger demographics. Furthermore, traditional craftsmanship risks obsolescence as automated industrial manufacturing supplants artisanal practices. Consequently, communities lacking technological infrastructure may witness their customs marginalized in an increasingly digitalized global sphere.

Conversely, technological innovations afford unparalleled avenues for cultural preservation. High-resolution 3D laser photogrammetry allows archaeological institutions to construct digital twins of vulnerable historical sanctuaries, shielding fragile architecture from natural degradation and mass tourism. Moreover, linguistic archiving applications and artificial intelligence algorithms are presently deployed to document endangered indigenous languages, recording phonetics and syntax before native speakers vanish. In Vietnam, for instance, traditional folk genres such as 'Quan Họ' or 'Ca Trù' have found renewed vitality through digital archives accessible to diaspora communities worldwide.

In conclusion, whereas unchecked consumerist technologies can inadvertently foster cultural assimilation, their conscious application functions as an unprecedented bastion for cultural preservation. If leveraged judiciously, digital innovation guarantees that ancestral identities flourish rather than perish in the modern era.`,
  },
  {
    id: 'w-task1-01',
    taskType: 'Task 1',
    prompt: 'The chart below shows the proportions of renewable energy generation (hydroelectric, wind, solar, and biomass) across four European countries in 2015 and 2025.',
    targetBand: '7.0',
    recommendedWordCount: 150,
    timeLimitMinutes: 20,
    sampleBand8Essay: `The bar chart delineates the proportion of renewable electricity derived from four distinct sources—hydroelectric, wind, solar, and biomass—in four European nations between 2015 and 2025.

Overall, it is manifest that all surveyed nations witnessed an upward trajectory in their renewable energy yields over the ten-year timeframe, with wind and solar recording the most pronounced accelerations. Furthermore, Germany consistently maintained the paramount share across nearly all sectors.`,
  },
];

export const sampleSpeakingQuestions = [
  {
    id: 'spk-part1',
    part: 1,
    topic: 'Hometown & Urban Living',
    questions: [
      'Can you describe the neighborhood where you currently reside?',
      'Has your hometown changed substantially over the past decade?',
      'What kinds of recreational amenities are available for young people in your area?',
    ],
  },
  {
    id: 'spk-part2',
    part: 2,
    topic: 'Problem Solving & Critical Decisions',
    cueCard: {
      topic: 'Describe a time you solved a problem.',
      bulletPoints: [
        'what the problem was',
        'how you solved it',
        'what the result was',
      ],
      prepTimeSeconds: 60,
      speakingTimeSeconds: 120,
    },
  },
  {
    id: 'spk-part3',
    part: 3,
    topic: 'Technological Transformation in Education',
    questions: [
      'In what ways will artificial intelligence alter the role of traditional classroom educators?',
      'Do you believe autonomous online learning can completely replace university campuses?',
      'How can governments ensure equitable educational access for impoverished communities?',
    ],
  },
];

export const usVsUkVocabulary = [
  { us: 'apartment', uk: 'flat', meaning: 'căn hộ', ipaUs: '/əˈpɑːrt.mənt/', ipaUk: '/əˈpɑːt.mənt/', note: 'Very frequent in IELTS Listening Section 1 accomodation forms' },
  { us: 'elevator', uk: 'lift', meaning: 'thang máy', ipaUs: '/ˈel.ə.veɪ.t̬ɚ/', ipaUk: '/ˈel.ɪ.veɪ.tər/', note: 'Appears in directions and campus maps' },
  { us: 'vacation', uk: 'holiday', meaning: 'kỳ nghỉ', ipaUs: '/veɪˈkeɪ.ʃən/', ipaUk: '/ˈhɒl.ə.deɪ/', note: 'Both accepted in writing; be consistent in spelling' },
  { us: 'color', uk: 'colour', meaning: 'màu sắc', ipaUs: '/ˈkʌl.ɚ/', ipaUk: '/ˈkʌl.ər/', note: 'Standard -or vs -our spelling convention' },
  { us: 'center', uk: 'centre', meaning: 'trung tâm', ipaUs: '/ˈsen.t̬ɚ/', ipaUk: '/ˈsen.tər/', note: 'Frequent in IELTS sports centre / shopping centre' },
  { us: 'sidewalk', uk: 'pavement', meaning: 'vỉa hè', ipaUs: '/ˈsaɪd.wɑːk/', ipaUk: '/ˈpeɪv.mənt/', note: 'Essential in IELTS Listening navigation' },
  { us: 'garbage / trash', uk: 'rubbish', meaning: 'rác thải', ipaUs: '/ˈɡɑːr.bɪdʒ/', ipaUk: '/ˈrʌb.ɪʃ/', note: 'Important in environmental essays' },
  { us: 'schedule', uk: 'timetable', meaning: 'lịch trình', ipaUs: '/ˈskedʒ.uːl/', ipaUk: '/ˈtaɪmˌteɪ.bəl/', note: 'UK pronunciation starts with /ʃ/' },
];
