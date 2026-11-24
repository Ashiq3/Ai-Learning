import type { ClassId } from '../types/course';

export interface StoredLearningProgress {
  visitedByClass: Record<ClassId, number[]>;
  lastClassId: ClassId;
  lastSlideIndexByClass: Record<ClassId, number>;
}

const DEFAULT_PROGRESS: StoredLearningProgress = {
  visitedByClass: { 1: [], 2: [], 3: [] },
  lastClassId: 1,
  lastSlideIndexByClass: { 1: 0, 2: 0, 3: 0 },
};

function storageKeyForUser(uid: string): string {
  return `ai-backend-course-progress:${uid}`;
}

export function loadLearningProgress(uid: string | null | undefined): StoredLearningProgress {
  if (!uid || typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(storageKeyForUser(uid));
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StoredLearningProgress>;
    const lastClassId: ClassId =
      parsed.lastClassId === 1 || parsed.lastClassId === 2 || parsed.lastClassId === 3
        ? parsed.lastClassId
        : 1;
    return {
      visitedByClass: {
        1: Array.isArray(parsed.visitedByClass?.[1]) ? parsed.visitedByClass[1] : [],
        2: Array.isArray(parsed.visitedByClass?.[2]) ? parsed.visitedByClass[2] : [],
        3: Array.isArray(parsed.visitedByClass?.[3]) ? parsed.visitedByClass[3] : [],
      },
      lastClassId,
      lastSlideIndexByClass: {
        1: typeof parsed.lastSlideIndexByClass?.[1] === 'number' ? parsed.lastSlideIndexByClass[1] : 0,
        2: typeof parsed.lastSlideIndexByClass?.[2] === 'number' ? parsed.lastSlideIndexByClass[2] : 0,
        3: typeof parsed.lastSlideIndexByClass?.[3] === 'number' ? parsed.lastSlideIndexByClass[3] : 0,
      },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function recordSlideVisit(
  uid: string | null | undefined,
  prev: StoredLearningProgress,
  classId: ClassId,
  slideIndex: number,
  slideId: number
): StoredLearningProgress {
  const existing = prev.visitedByClass[classId] ?? [];
  const nextVisited = existing.includes(slideId) ? existing : [...existing, slideId];
  const next: StoredLearningProgress = {
    visitedByClass: {
      ...prev.visitedByClass,
      [classId]: nextVisited,
    },
    lastClassId: classId,
    lastSlideIndexByClass: {
      ...prev.lastSlideIndexByClass,
      [classId]: Math.max(0, slideIndex),
    },
  };

  if (uid && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(storageKeyForUser(uid), JSON.stringify(next));
    } catch {
      // Ignore storage quota or iframe restrictions
    }
  }

  return next;
}
