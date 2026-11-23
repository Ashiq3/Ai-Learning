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
