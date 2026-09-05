import type { ResumeSectionKey, ResumeTemplateMeta } from '@/types/resume.types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const USE_MOCK_API = false; // Toggle to true to develop against mock data instead of the real backend

export const LOCAL_STORAGE_KEYS = {
  RESUME_DRAFT: 'resumeforge:draft',
  RECENT_RESUMES: 'resumeforge:recent',
  THEME_MODE: 'resumeforge:theme',
};

export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'certificates',
  'achievements',
  'languages',
  'interests',
  'references',
];

export const RESUME_TEMPLATES: ResumeTemplateMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column layout, ATS-friendly and universally readable.',
    thumbnail: 'classic',
    isPremium: false,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold sidebar with accent color, ideal for tech and design roles.',
    thumbnail: 'modern',
    isPremium: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean whitespace-driven layout that puts content first.',
    thumbnail: 'minimal',
    isPremium: false,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Structured, formal layout suited for finance, consulting and law.',
    thumbnail: 'corporate',
    isPremium: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Expressive header and color blocks for creative & marketing roles.',
    thumbnail: 'creative',
    isPremium: true,
  },
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Freelance',
  'Remote',
] as const;

export const LANGUAGE_PROFICIENCIES = ['Basic', 'Conversational', 'Fluent', 'Native'] as const;

export const ACCEPTED_RESUME_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

export const MAX_UPLOAD_SIZE_MB = 5;

/** Bounds for the Job Description Matcher textarea — mirrored server-side in server/routes/jobMatch.ts. */
export const JOB_DESCRIPTION_LIMITS = {
  MIN_CHARS: 50,
  MAX_CHARS: 20000,
};
