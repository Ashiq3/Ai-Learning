import type { ClassDeck, ClassId } from '../types/course';
import { CLASS_1_SLIDES } from './class1Slides';
import { CLASS_2_SLIDES } from './class2Slides';
import { CLASS_3_SLIDES } from './class3Slides';

export const COURSE_DECKS: Record<ClassId, ClassDeck> = {
  1: {
    classId: 1,
    title: 'Frontend vs Backend, Cloud Servers & How the Web Moves Requests',
    shortTitle: 'Class 01 · Web & Servers',
    subtitle: 'HTML/CSS/JS, Chrome DevTools Elements & Network, Railway Cloud & DNS',
    durationHours: 3,
    slides: CLASS_1_SLIDES,
  },
  2: {
    classId: 2,
    title: 'APIs, HTTP Methods, JSON Envelopes, API Keys & Status Codes',
    shortTitle: 'Class 02 · APIs & Postman',
    subtitle: 'Endpoints, GET/POST/PATCH/DELETE, JSON Doctor, .env Vault & Postman v12',
    durationHours: 3,
    slides: CLASS_2_SLIDES,
  },
  3: {
    classId: 3,
    title: 'Python vs JS, Backend Frameworks, Databases & AI Tokens',
    shortTitle: 'Class 03 · Code, DB & Tokens',
    subtitle: 'FastAPI Swagger UI, Express, Supabase CRUD Memory, Tiktokenizer & Context Window',
    durationHours: 3,
    slides: CLASS_3_SLIDES,
  },
};

export const READY_CLASS_IDS: ClassId[] = [1, 2, 3];
