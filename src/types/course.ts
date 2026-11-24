export type AppView = 'deck' | 'roadmap' | 'toolkit' | 'exam' | 'results' | 'instructor';

export type ClassId = 1 | 2 | 3;

export type SlideStageType =
  | 'hero'
  | 'route'
  | 'animated-workflow'
  | 'tool-spotlight'
  | 'comparison'
  | 'use-case-gallery'
  | 'practice-test'
  | 'visual-diagram'
  | 'break-timer'
  | 'frontend-xray'
  | 'backend-jobs-lab'
  | 'server-stress'
  | 'postman-lab'
  | 'json-doctor'
  | 'database-memory'
  | 'tokenizer-context'
  | 'code-translator'
  | 'url-dissector'
  | 'status-codes'
  | 'recap-bridge';

export interface ToolReference {
  name: string;
  role: string;
  useCase: string;
  url: string;
  category:
    | 'Frontend'
    | 'Backend & Server'
    | 'APIs'
    | 'Languages & Frameworks'
    | 'Databases'
    | 'ML & Neural Networks';
  vibeCoderTip: string;
  introducedInClass: number;
}

export interface TeacherCue {
  sayThis: string;
  realWorldAnalogy: string;
  liveDemoStep: string;
  checkQuestion: string;
  banglaPrepNote: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  explanation: string;
  payloadLabel: string;
  payloadPreview: string;
  accent?: 'teal' | 'orange' | 'blue' | 'rose';
}

export interface ToolHotspot {
  number: number;
  label: string;
  xPct: number;
  yPct: number;
  detail: string;
  vibeNote: string;
}

export interface ComparisonSide {
  title: string;
  subtitle: string;
  accent: 'teal' | 'orange' | 'blue' | 'rose';
  badge: string;
  points: string[];
  codeOrExample?: string;
}

export interface UseCaseItem {
  appName: string;
  category: string;
  userSees: string;
  behindTheScenes: string;
  realTools: string[];
  highlightMetric: string;
}

export interface PracticeQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationBanglish: string;
}

export interface DiagramCard {
  label: string;
  title: string;
  detail: string;
  accent?: 'teal' | 'orange' | 'blue' | 'rose';
}

export interface CodeLineItem {
  code: string;
  plainEnglish: string;
  banglish: string;
}

export interface SlideVisualConfig {
  // Hero
  heroBadge?: string;
  heroLines?: [string, string, string];
  heroSubtext?: string;
  heroQuoteLabel?: string;
  heroQuote?: string;
  heroLeftLabel?: string;
  heroRightLabel?: string;
  heroCenterBadge?: string;

  // Route
  routePart1?: { time: string; title: string; desc: string }[];
  routeBreakLabel?: string;
  routePart2?: { time: string; title: string; desc: string }[];

  // Animated Workflow
  workflowSteps?: WorkflowStep[];
  workflowFlowLabel?: string;

  // Tool Spotlight (Real fetched screenshot + interactive callouts)
  toolName?: string;
  toolRole?: string;
  toolImageSrc?: string;
  toolImageAlt?: string;
  toolSourceUrl?: string;
  toolOpenTip?: string;
  toolHotspots?: ToolHotspot[];

  // Comparison
  comparisonSides?: ComparisonSide[];
  comparisonTakeaway?: string;

  // Use Case Gallery
  useCases?: UseCaseItem[];

  // Practice Test
  practiceTitle?: string;
  practiceMode?: 'quick-check' | 'module-quiz' | 'capstone';
  questions?: PracticeQuestion[];

  // Visual Diagram (Optional illustration + interactive cards)
  diagramImageSrc?: string;
  diagramImageAlt?: string;
  diagramCaption?: string;
  diagramCards?: DiagramCard[];

  // Code Translator
  codeFilename?: string;
  codeLanguage?: string;
  codeLines?: CodeLineItem[];
  secondaryCodeFilename?: string;
  secondaryCodeLines?: CodeLineItem[];

  // URL Dissector
  urlSegments?: {
    part: string;
    label: string;
    meaning: string;
    accent: 'teal' | 'orange' | 'blue' | 'rose';
  }[];

  // Status Codes
  statusCodes?: {
    code: number;
    label: string;
    family: string;
    meaning: string;
    realExample: string;
    accent: 'teal' | 'orange' | 'blue' | 'rose';
  }[];

  // Recap & Next-Class Bridge
  recapItems?: { step: string; takeaway: string }[];
  nextClassPreview?: {
    classNumber: number;
    title: string;
    hook: string;
  };

  // Optional variant for bespoke labs
  labVariant?: string;
}

export interface SlideData {
  id: number;
  classId: ClassId;
  stageType: SlideStageType;
  eyebrow: string;
  sectionTag: string;
  part: 'Part 1' | 'Mid-Class Break' | 'Part 2';
  keyword: string;
  headline: string;
  oneLineSummary: string;
  durationMinutes: number;
  isBreakSlide?: boolean;
  isOverviewSlide?: boolean;
  realWorldTools?: Pick<ToolReference, 'name' | 'role' | 'useCase' | 'url'>[];
  visual: SlideVisualConfig;
  teacherCue: TeacherCue;
  introducesTerms: string[];
}

export interface ClassDeck {
  classId: ClassId;
  title: string;
  shortTitle: string;
  subtitle: string;
  durationHours: number;
  slides: SlideData[];
}

export interface CurriculumClass {
  classNumber: number;
  phase: 1 | 2 | 3 | 4;
  title: string;
  durationHours: number;
  status: 'ready' | 'planned';
  goal: string;
  keywords: string[];
  handsOnProject: string;
  tools: string[];
}

export interface CurriculumPhase {
  phase: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  classRange: string;
  totalHours: number;
}
