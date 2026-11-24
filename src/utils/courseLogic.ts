import type { CurriculumClass, SlideData } from '../types/course';

export interface TokenPiece {
  id: number;
  text: string;
  tokenId: number;
  colorIndex: number;
}

export interface TokenizationResult {
  pieces: TokenPiece[];
  tokenCount: number;
  charCount: number;
  estimatedCostPerMillionUsd: number;
  estimatedSingleCallUsd: number;
}

/**
 * Deterministic educational BPE-like tokenizer so students can watch words split
 * into sub-word chunks and see live token counts & API cost math.
 */
export function tokenizeText(input: string): TokenizationResult {
  if (!input) {
    return {
      pieces: [],
      tokenCount: 0,
      charCount: 0,
      estimatedCostPerMillionUsd: 0.5,
      estimatedSingleCallUsd: 0,
    };
  }

  const rawChunks = input.match(/(\s+|[A-Za-z]+|\d+|[^\sA-Za-z\d])/g) ?? [];
  const pieces: TokenPiece[] = [];
  let idx = 0;

  for (let i = 0; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];
    if (chunk === ' ' && i + 1 < rawChunks.length && /^[A-Za-z]+$/.test(rawChunks[i + 1])) {
      const nextWord = rawChunks[i + 1];
      i++;
      const combined = ` ${nextWord}`;
      if (nextWord.length > 8) {
        const splitAt = Math.ceil(nextWord.length * 0.55);
        pieces.push(makePiece(` ${nextWord.slice(0, splitAt)}`, idx++));
        pieces.push(makePiece(nextWord.slice(splitAt), idx++));
      } else {
        pieces.push(makePiece(combined, idx++));
      }
      continue;
    }

    if (/^[A-Za-z]+$/.test(chunk) && chunk.length > 8) {
      const splitAt = Math.ceil(chunk.length * 0.55);
      pieces.push(makePiece(chunk.slice(0, splitAt), idx++));
      pieces.push(makePiece(chunk.slice(splitAt), idx++));
    } else {
      pieces.push(makePiece(chunk, idx++));
    }
  }

  const tokenCount = pieces.length;
  const estimatedCostPerMillionUsd = 0.5;
  const estimatedSingleCallUsd = (tokenCount / 1_000_000) * estimatedCostPerMillionUsd;

  return {
    pieces,
    tokenCount,
    charCount: input.length,
    estimatedCostPerMillionUsd,
    estimatedSingleCallUsd,
  };
}

function makePiece(text: string, idx: number): TokenPiece {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33 + text.charCodeAt(i)) % 98000;
  }
  return {
    id: idx,
    text,
    tokenId: 1000 + Math.abs(hash),
    colorIndex: idx % 5,
  };
}

export interface ServerMetrics {
  latencyMs: number;
  cpuPct: number;
  status: 'NOMINAL' | 'ELEVATED' | 'OVERLOADED';
  statusLabel: string;
  uptimeLabel: string;
}

export function computeServerLoad(
  mode: 'laptop' | 'cloud',
  concurrentUsers: number
): ServerMetrics {
  const users = Math.max(1, concurrentUsers);
  if (mode === 'laptop') {
    const cpuPct = Math.min(100, Math.round(18 + users * 1.45));
    const latencyMs = Math.round(90 + users * users * 0.65);
    const status = users <= 15 ? 'NOMINAL' : users <= 45 ? 'ELEVATED' : 'OVERLOADED';
    const statusLabel =
      status === 'NOMINAL'
        ? 'Running OK (Small Load)'
        : status === 'ELEVATED'
          ? 'Fans Spinning Loudly'
          : 'Crashed (Out of RAM)';
    return {
      latencyMs,
      cpuPct,
      status,
      statusLabel,
      uptimeLabel: 'Sleeps when lid closes',
    };
  }

  const cpuPct = Math.min(82, Math.round(8 + users * 0.12));
  const latencyMs = Math.round(65 + users * 0.28);
  const status = users <= 320 ? 'NOMINAL' : 'ELEVATED';
  const statusLabel =
    status === 'NOMINAL' ? 'Nominal (Auto-Scaled)' : 'Elevated (Adding Nodes)';
  return {
    latencyMs,
    cpuPct,
    status,
    statusLabel,
    uptimeLabel: '99.99% Always-On (24/7)',
  };
}

export interface PostmanCallInput {
  method: 'GET' | 'POST' | 'DELETE';
  endpoint: string;
  hasValidApiKey: boolean;
  bodyText: string;
  spamCount: number;
}

export interface PostmanCallResult {
  statusCode: number;
  statusText: string;
  latencyMs: number;
  accent: 'teal' | 'orange' | 'rose';
  explanation: string;
  responseJson: string;
}

/**
 * Simulates real HTTP/API responses for the Class 2 Mini-Postman Lab.
 */
export function simulatePostmanCall(input: PostmanCallInput): PostmanCallResult {
  const cleanUrl = input.endpoint.trim();

  if (input.spamCount > 5) {
    return {
      statusCode: 429,
      statusText: 'Too Many Requests',
      latencyMs: 38,
      accent: 'orange',
      explanation:
        'Rate limit triggered! The server blocked rapid spam clicks to protect its wallet & GPUs.',
      responseJson: JSON.stringify(
        {
          error: 'rate_limit_exceeded',
          retry_after_seconds: 60,
          tip: 'Slow down or upgrade your API tier.',
        },
        null,
        2
      ),
    };
  }

  if (!input.hasValidApiKey) {
    return {
      statusCode: 401,
      statusText: 'Unauthorized',
      latencyMs: 42,
      accent: 'rose',
      explanation:
        'Rejected at the door! Missing or invalid Authorization Bearer API key in the request Headers.',
      responseJson: JSON.stringify(
        {
          error: 'invalid_api_key',
          message: 'Provide a valid Bearer key in your Backend .env vault.',
        },
        null,
        2
      ),
    };
  }

  if (!cleanUrl.startsWith('/v1/')) {
    return {
      statusCode: 404,
      statusText: 'Not Found',
      latencyMs: 54,
      accent: 'rose',
      explanation:
        'Wrong address! The server checked its menu and could not find this endpoint path (try /v1/chat or /v1/models).',
      responseJson: JSON.stringify(
        {
          error: 'route_not_found',
          requested_path: cleanUrl || '(empty)',
          available_routes: ['/v1/models', '/v1/chat', '/v1/history/42'],
        },
        null,
        2
      ),
    };
  }

  if (input.method === 'POST') {
    const check = validateJsonPayload(input.bodyText);
    if (!check.valid) {
      return {
        statusCode: 400,
        statusText: 'Bad Request',
        latencyMs: 49,
        accent: 'orange',
        explanation: `Broken JSON envelope! ${check.error}`,
        responseJson: JSON.stringify(
          {
            error: 'malformed_json',
            details: check.error,
            fix: 'Check for double quotes around keys and valid commas.',
          },
          null,
          2
        ),
      };
    }

    return {
      statusCode: 200,
      statusText: 'OK',
      latencyMs: 284,
      accent: 'teal',
      explanation:
        'Success! Valid VIP API Key + valid POST JSON body → the AI Backend processed your prompt and replied.',
      responseJson: JSON.stringify(
        {
          id: 'resp_9f2a1c',
          model: 'ai-tutor-fast',
          reply: 'An API is a strict messenger carrying JSON envelopes between Frontend and Backend!',
          usage: { input_tokens: 14, output_tokens: 18 },
        },
        null,
        2
      ),
    };
  }

  if (input.method === 'DELETE') {
    return {
      statusCode: 200,
      statusText: 'OK (Deleted)',
      latencyMs: 112,
      accent: 'teal',
      explanation: 'Success! DELETE removed the specific record identified by the URL path.',
      responseJson: JSON.stringify(
        {
          deleted: true,
          path: cleanUrl,
          message: 'Chat item removed permanently from backend storage.',
        },
        null,
        2
      ),
    };
  }

  return {
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 95,
    accent: 'teal',
    explanation: 'Success! GET safely read public/authorized data from the server without changing anything.',
    responseJson: JSON.stringify(
      {
        status: 'online',
        models: ['gemini-2.5-flash', 'gpt-4o-mini', 'claude-sonnet'],
        region: 'asia-southeast1',
      },
      null,
      2
    ),
  };
}

export function validateJsonPayload(raw: string): { valid: boolean; error: string | null } {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { valid: false, error: 'Root JSON payload must be an object { ... }.' };
    }
    return { valid: true, error: null };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid JSON syntax.',
    };
  }
}

export interface ContextWindowUsage {
  usedTokens: number;
  maxTokens: number;
  percentFull: number;
  droppedCount: number;
  keptMessages: string[];
  droppedMessages: string[];
}

/**
 * Models how an AI Context Window bucket fills up and drops the oldest messages once full.
 */
export function computeContextWindowUsage(
  messages: { text: string; tokens: number }[],
  maxTokens: number
): ContextWindowUsage {
  const safeMax = Math.max(20, maxTokens);
  let running = 0;
  const keptReversed: string[] = [];
  const droppedReversed: string[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (running + m.tokens <= safeMax) {
      running += m.tokens;
      keptReversed.push(m.text);
    } else {
      droppedReversed.push(m.text);
    }
  }

  return {
    usedTokens: running,
    maxTokens: safeMax,
    percentFull: Math.min(100, Math.round((running / safeMax) * 100)),
    droppedCount: droppedReversed.length,
    keptMessages: keptReversed.reverse(),
    droppedMessages: droppedReversed.reverse(),
  };
}

export interface SlidePacingItem {
  slideId: number;
  startMinute: number;
  endMinute: number;
  timeRangeLabel: string;
  shortStamp: string;
}

export interface ClassPacingSummary {
  totalInstructionMinutes: number;
  totalBreakMinutes: number;
  totalClassMinutes: number;
  items: SlidePacingItem[];
}

function formatMinuteStamp(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

export function getClassPacingSummary(slides: SlideData[]): ClassPacingSummary {
  let cursor = 0;
  let totalInstructionMinutes = 0;
  let totalBreakMinutes = 0;
  const items: SlidePacingItem[] = [];

  for (const slide of slides) {
    const startMinute = cursor;
    const endMinute = cursor + slide.durationMinutes;
    if (slide.isBreakSlide) {
      totalBreakMinutes += slide.durationMinutes;
    } else {
      totalInstructionMinutes += slide.durationMinutes;
    }
    cursor = endMinute;

    const padStart = String(startMinute).padStart(2, '0');
    const padEnd = String(endMinute).padStart(2, '0');

    items.push({
      slideId: slide.id,
      startMinute,
      endMinute,
      timeRangeLabel: `${formatMinuteStamp(startMinute)} – ${formatMinuteStamp(endMinute)}`,
      shortStamp: `${padStart}–${padEnd}`,
    });
  }

  return {
    totalInstructionMinutes,
    totalBreakMinutes,
    totalClassMinutes: totalInstructionMinutes + totalBreakMinutes,
    items,
  };
}

export interface ForwardReferenceViolation {
  slideId: number;
  term: string;
  introducedOnSlide: number;
}

export function validateZeroForwardReference(
  slides: SlideData[]
): ForwardReferenceViolation[] {
  const violations: ForwardReferenceViolation[] = [];

  for (let i = 0; i < slides.length; i++) {
    const current = slides[i];
    if (current.isOverviewSlide) continue;
    const studentText = `${current.headline} ${current.oneLineSummary}`.toLowerCase();

    for (let j = i + 1; j < slides.length; j++) {
      const future = slides[j];
      for (const term of future.introducesTerms) {
        const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(studentText)) {
          violations.push({
            slideId: current.id,
            term,
            introducedOnSlide: future.id,
          });
        }
      }
    }
  }

  return violations;
}

export function getCurriculumTotals(classes: CurriculumClass[]): {
  totalClasses: number;
  totalHours: number;
  readyCount: number;
} {
  return {
    totalClasses: classes.length,
    totalHours: classes.reduce((acc, c) => acc + c.durationHours, 0),
    readyCount: classes.filter((c) => c.status === 'ready').length,
  };
}

export function clampSlideIndex(index: number, totalSlides: number): number {
  if (totalSlides <= 0) return 0;
  return Math.max(0, Math.min(totalSlides - 1, index));
}

export type BackendJobId = 'bouncer' | 'referee' | 'vault' | 'engine';

export interface BackendJobTestInput {
  job: BackendJobId;
  bouncerRole?: 'stranger' | 'free' | 'pro';
  tamperedPriceBdt?: number;
  officialPriceBdt?: number;
  vaultLocation?: 'frontend' | 'backend';
  engineTask?: 'pdf' | 'notes' | 'audio';
}

export interface BackendJobTestResult {
  allowed: boolean;
  tone: 'emerald' | 'amber' | 'red';
  verdictTitle: string;
  frontendSent: string;
  backendDecided: string;
  realWorldHowToTest: string;
}

/**
 * Pure interactive simulator for Class 01 Slide 15 ("The 4 Core Backend Jobs"):
 * lets instructors and students live-test Bouncer, Referee, Vault, and Engine.
 */
export function simulateBackendJobTest(input: BackendJobTestInput): BackendJobTestResult {
  if (input.job === 'bouncer') {
    const role = input.bouncerRole ?? 'stranger';
    if (role === 'stranger') {
      return {
        allowed: false,
        tone: 'red',
        verdictTitle: 'Blocked by Bouncer — Sign-in required',
        frontendSent: 'Request: Open Private Chat History (No verified account)',
        backendDecided:
          'Denied at the door. Strangers without a verified login cannot read private user chats.',
        realWorldHowToTest:
          'Open this course app or ChatGPT in a Chrome Incognito window (logged out) and try opening private classes or past chats — the real Bouncer blocks access immediately.',
      };
    }
    if (role === 'free') {
      return {
        allowed: true,
        tone: 'amber',
        verdictTitle: 'Allowed with Free-Tier Limits',
        frontendSent: 'Request: Open Chat (Signed in as Free account)',
        backendDecided:
          'Identity verified, plan = Free. Access granted up to daily free usage limit; Pro-only features stay locked.',
        realWorldHowToTest:
          'Sign into any SaaS app with a free account and click a Pro-only button — the Backend checks your account tier and blocks the Pro action even if you inspect the button.',
      };
    }
    return {
      allowed: true,
      tone: 'emerald',
      verdictTitle: 'Allowed — Pro Identity Verified',
      frontendSent: 'Request: Open Private Chat & Pro Tools (Verified Pro account)',
      backendDecided:
        'Identity and active Pro subscription verified inside Backend. Full private chat history returned.',
      realWorldHowToTest:
        'Sign in with your real Google account in this course app — only your own email gets your private exam history and (for instructor email) the Instructor Dashboard.',
    };
  }

  if (input.job === 'referee') {
    const official = input.officialPriceBdt ?? 380;
    const tampered = Math.max(0, Math.round(input.tamperedPriceBdt ?? 1));
    const wasTampered = tampered !== official;
    return {
      allowed: !wasTampered,
      tone: wasTampered ? 'amber' : 'emerald',
      verdictTitle: wasTampered
        ? `Hack Blocked — Referee Charged Official ৳${official}`
        : `Order Verified — Charged Official ৳${official}`,
      frontendSent: `Browser screen showed: ৳${tampered} (Item: Kacchi Full × 1)`,
      backendDecided: wasTampered
        ? `Backend ignored the fake ৳${tampered} edited in Chrome Inspect, checked its own private menu (৳${official}), and refused the ৳${tampered} hack.`
        : `Backend matched item against its official private price table (৳${official}) and approved checkout.`,
      realWorldHowToTest:
        'Open Foodpanda or Daraz in Chrome → right-click a product price → Inspect → change the visible text to ৳1 → click Checkout or reload. The real Backend Referee always charges the true price.',
    };
  }

  if (input.job === 'vault') {
    const loc = input.vaultLocation ?? 'backend';
    if (loc === 'frontend') {
      return {
        allowed: false,
        tone: 'red',
        verdictTitle: 'Danger — Secret Key Exposed in Browser!',
        frontendSent: 'F12 DevTools Scan → Opened browser Sources & Network tabs',
        backendDecided:
          'LEAKED! Because the paid AI secret key was placed in Frontend code, any visitor pressed F12, copied the key, and ran up your bill.',
        realWorldHowToTest:
          'Press F12 → Sources on any webpage to prove that 100% of Frontend JavaScript is readable by any stranger in 5 seconds.',
      };
    }
    return {
      allowed: true,
      tone: 'emerald',
      verdictTitle: 'Protected — Zero Secrets Visible in F12',
      frontendSent: 'F12 DevTools Scan → Inspected every downloaded Frontend file',
      backendDecided:
        'SAFE! Paid AI credentials stay locked inside the hidden Backend Vault. The browser only ever receives the final clean text reply.',
      realWorldHowToTest:
        'Open ChatGPT or Gemini, press F12 → Sources/Elements, and search for secret keys — you will only see UI layout code, never the private backend credentials.',
    };
  }

  const task = input.engineTask ?? 'pdf';
  const taskMap = {
    pdf: {
      sent: 'Tiny request from phone: Summarize "Course_Notes.pdf" (50 pages)',
      decided:
        'Backend Engine read all 50 pages on a fast remote machine, ran the AI model, and returned a 4-bullet summary in 1.2 seconds.',
    },
    notes: {
      sent: 'Tiny request from browser: Generate 5 practice questions from Class 01',
      decided:
        'Backend Engine ran the heavy AI generation remotely without heating up the student’s phone or laptop, then returned clean text.',
    },
    audio: {
      sent: 'Voice clip uploaded from phone mic (Bangla speech, 18 seconds)',
      decided:
        'Backend Engine converted speech to text, translated it accurately, and sent back lightweight subtitle lines.',
    },
  }[task];

  return {
    allowed: true,
    tone: 'emerald',
    verdictTitle: 'Heavy Work Completed Off-Device',
    frontendSent: taskMap.sent,
    backendDecided: taskMap.decided,
    realWorldHowToTest:
      'Upload a PDF or ask a complex question on ChatGPT from an older phone — notice your phone barely warms up because the heavy Engine runs remotely on cloud machines.',
  };
}

export type SlideLessonKind = 'concept' | 'lab' | 'tool' | 'quiz' | 'break';

export function getSlideLessonKind(slide: SlideData): SlideLessonKind {
  if (slide.isBreakSlide || slide.stageType === 'break-timer') return 'break';
  if (slide.stageType === 'practice-test') return 'quiz';
  if (slide.stageType === 'tool-spotlight') return 'tool';
  if (
    slide.stageType === 'frontend-xray' ||
    slide.stageType === 'backend-jobs-lab' ||
    slide.stageType === 'server-stress' ||
    slide.stageType === 'postman-lab' ||
    slide.stageType === 'json-doctor' ||
    slide.stageType === 'database-memory' ||
    slide.stageType === 'tokenizer-context'
  ) {
    return 'lab';
  }
  return 'concept';
}

export interface GroupedSlideEntry {
  slide: SlideData;
  index: number;
  kind: SlideLessonKind;
}

export interface LessonChapterGroup {
  partTitle: string;
  slides: GroupedSlideEntry[];
  totalMinutes: number;
  labCount: number;
  quizCount: number;
}

function toChapterTitle(slide: SlideData, previousChapterTitle: string | null): string {
  if (slide.isBreakSlide || slide.stageType === 'break-timer') {
    return 'Mid-Class Break';
  }
  const raw = (slide.sectionTag.split('·')[1] ?? slide.sectionTag).trim().toUpperCase();

  if (
    raw === 'FOUNDATIONS' ||
    raw === 'ROUTE' ||
    raw === 'BRIDGE' ||
    raw === 'BIG PICTURE' ||
    raw === 'APIS & JSON' ||
    raw === 'CODE, DB & TOKENS'
  ) {
    return 'Introduction & Big Picture';
  }

  if (raw === 'PRACTICE TEST' && previousChapterTitle) {
    return previousChapterTitle;
  }

  if (raw === 'CAPSTONE TEST' || raw === 'RECAP' || raw === 'COMPLETE') {
    return 'Capstone & Wrap-Up';
  }

  const labelMap: Record<string, string> = {
    FRONTEND: 'Frontend & Browser',
    BACKEND: 'Backend & Security',
    SERVERS: 'Cloud Servers & DNS',
    'FULL ROUND-TRIP': 'Full Request Round-Trip',
    'LIVE INSPECTION': 'Live DevTools Inspection',
    'HANDS-ON': 'Hands-On Lab',
    'WHAT IS AN API': 'What Is an API?',
    'ENDPOINTS & HTTP': 'Endpoints & HTTP Methods',
    'JSON DATA': 'JSON Data & Syntax',
    'AUTH & SECURITY': 'Auth, Headers & .env Keys',
    'STATUS CODES': 'HTTP Status Codes & Rate Limits',
    'POSTMAN LAB': 'Postman Request Lab',
    'FULL AI API FLOW': 'Full AI API Flow',
    'REAL PATTERNS': 'APIs & Real Patterns',
    LANGUAGES: 'Backend Languages (Python & JS)',
    FRAMEWORKS: 'Frameworks (FastAPI & Express)',
    DATABASES: 'Databases & CRUD Memory',
    'AI TOKENS': 'AI Tokens & Context Windows',
    'FULL ARCHITECTURE': 'Production AI Architecture',
    'REAL STACKS': 'Real AI Startup Stacks',
  };

  if (labelMap[raw]) return labelMap[raw];

  return raw
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function groupSlidesByPart(slides: SlideData[]): LessonChapterGroup[] {
  const groups: LessonChapterGroup[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const kind = getSlideLessonKind(slide);
    const prev = groups[groups.length - 1];
    const chapterTitle = toChapterTitle(slide, prev?.partTitle ?? null);

    if (prev && prev.partTitle === chapterTitle) {
      prev.slides.push({ slide, index: i, kind });
      prev.totalMinutes += slide.durationMinutes;
      if (kind === 'lab') prev.labCount += 1;
      if (kind === 'quiz') prev.quizCount += 1;
    } else {
      groups.push({
        partTitle: chapterTitle,
        slides: [{ slide, index: i, kind }],
        totalMinutes: slide.durationMinutes,
        labCount: kind === 'lab' ? 1 : 0,
        quizCount: kind === 'quiz' ? 1 : 0,
      });
    }
  }

  return groups;
}

export interface ClassLearningProgress {
  visitedCount: number;
  totalSlides: number;
  percent: number;
}

export function computeClassProgress(
  visitedSlideIds: number[],
  totalSlides: number
): ClassLearningProgress {
  if (totalSlides <= 0) {
    return { visitedCount: 0, totalSlides: 0, percent: 0 };
  }
  const uniqueValid = new Set(
    visitedSlideIds.filter((id) => Number.isInteger(id) && id >= 1 && id <= totalSlides)
  );
  const visitedCount = uniqueValid.size;
  const percent = Math.min(100, Math.round((visitedCount / totalSlides) * 100));
  return { visitedCount, totalSlides, percent };
}


