export type KnowledgeSection = {
  id: string
  label: string
  title: string
  content?: string
  formula?: string
  items?: string[]
  tone: 'blue' | 'violet' | 'orange' | 'green' | 'rose'
}

export type KnowledgeConnection = {
  title: string
  slug: string
  note: string
  type?: 'knowledge' | 'distribution' | 'data-science'
}

export type KnowledgeProperty = {
  label: string
  text: string
  formula?: string
}

export type KnowledgeVisual = {
  type: 'events' | 'sets' | 'probability' | 'tree' | 'mapping' | 'cdf' | 'pmf' | 'density' | 'joint' | 'region' | 'expectation' | 'variance' | 'relationship' | 'bound' | 'convergence' | 'clt'
  caption: string
}

export type KnowledgePoint = {
  slug: string
  chapter: string
  title: string
  englishTitle: string
  summary: string
  readTime: number
  updatedAt: string
  core: string[]
  definition: {
    intro: string
    formulas: string[]
    proof?: {
      title: string
      intro: string
      formula: string
      note: string
    }
  }
  intuition: string[]
  visual?: KnowledgeVisual
  properties: KnowledgeProperty[]
  exams: string[]
  mistakes: string[]
  prerequisites: KnowledgeConnection[]
  connections: KnowledgeConnection[]
}

export type ExamProblemType = {
  title: string
  features: string
  method: string
  steps: string[]
}

export type WorkedExampleStep = {
  text: string
  formula?: string
}

export type WorkedExample = {
  title: string
  problem: string
  analysis: string
  steps: WorkedExampleStep[]
  answer: string
  answerFormula?: string
  source: string
}

export type KnowledgeEnhancement = {
  slug: string
  lectureSummary: string[]
  problemTypes: ExamProblemType[]
  examples: WorkedExample[]
}

export type LectureExercise = {
  id: string
  title: string
  difficulty: '基础' | '强化'
  source: string
  problem: string
  focus: string
  method: string
  steps: WorkedExampleStep[]
  answer: string
  answerFormula?: string
}

export type LectureExerciseGroup = {
  slug: string
  sourceRange: string
  exercises: LectureExercise[]
}

export type StatisticsBridgeTopic = {
  id: string
  title: string
  englishTitle: string
  source: string
  summary: string
  prerequisites: string[]
  keyPoints: string[]
  formulas: { label: string; formula: string; note: string }[]
  examFocus: string[]
}

export type MachineLearningBridgeTopic = {
  id: string
  title: string
  englishTitle: string
  summary: string
  formula: string
  probabilityLink: string
  machineLearningUse: string
  studyFocus: string[]
}

export type ChapterReview = {
  id: string
  number: string
  title: string
  summary: string
  source: string
  nodeSlugs: string[]
  essentials: { title: string; note: string }[]
  formulas: { label: string; formula: string; note: string }[]
  problemTypes: { title: string; method: string }[]
  mistakes: string[]
}

export type CurriculumTopic = {
  slug: string
  title: string
  englishTitle: string
  summary: string
  subtopics: string[]
  status: 'ready' | 'structured' | 'future'
  route?: string
  prerequisites: string[]
  next: string[]
}

export type CurriculumChapter = {
  id: string
  number: string
  title: string
  englishTitle: string
  summary: string
  tone: 'blue' | 'violet' | 'orange' | 'green' | 'rose'
  status: 'active' | 'future'
  route?: string
  topics: CurriculumTopic[]
}

export type Distribution = {
  slug: string
  name: string
  englishName: string
  type: '离散型' | '连续型' | '预留'
  symbol: string
  color: string
  summary: string
  scene: string
  formula: string
  cdfFormula?: string
  cdfNote?: string
  standardizationExample?: {
    title: string
    source: string
    problem: string
    method: string
    steps: WorkedExampleStep[]
    answer: string
    answerFormula: string
  }
  parameterNotes: string[]
  expectation: string
  variance: string
  properties: string[]
  examTips: string[]
  mistakes: string[]
  status: 'ready' | 'planned'
}

export type FormulaItem = {
  category: string
  name: string
  formula: string
  condition: string
  slug?: string
  type?: 'knowledge' | 'distribution'
  keywords: string[]
}
