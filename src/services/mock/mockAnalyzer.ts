import { v4 as uuid } from 'uuid';
import type { ResumeAnalysisResult } from '@/types/analyzer.types';

export const SUGGESTION_POOL: Array<Omit<ResumeAnalysisResult['suggestions'][number], 'id'>> = [
  {
    category: 'ATS',
    severity: 'high',
    title: 'Use standard section headings',
    detail:
      'Rename custom headings like "My Journey" to standard ones like "Experience" so ATS parsers can map them correctly.',
  },
  {
    category: 'Keywords',
    severity: 'high',
    title: 'Add role-specific keywords',
    detail:
      'The job market for this role frequently mentions "REST APIs", "CI/CD" and "Cloud Infrastructure" — none appear in your resume.',
  },
  {
    category: 'Formatting',
    severity: 'medium',
    title: 'Avoid tables and text boxes',
    detail: 'Tables and text boxes can break ATS parsing. Use plain text blocks with consistent bullet styles.',
  },
  {
    category: 'Grammar',
    severity: 'low',
    title: 'Fix inconsistent verb tense',
    detail: 'Past roles should use past tense consistently — a few bullets slip into present tense.',
  },
  {
    category: 'Content',
    severity: 'medium',
    title: 'Quantify your achievements',
    detail: 'Add measurable outcomes (%, $, time saved) to at least 3 more bullet points to strengthen impact.',
  },
  {
    category: 'Structure',
    severity: 'low',
    title: 'Trim resume to one page',
    detail: 'Recruiters spend ~7 seconds per resume — condense older roles into 2-3 bullets each.',
  },
];

export const STRENGTHS_POOL = [
  'Clear, action-oriented bullet points in recent roles',
  'Consistent reverse-chronological formatting',
  'Strong technical skills section aligned with the role',
  'Quantified impact in your most recent position',
  'Concise, keyword-rich professional summary',
];

export const WEAKNESSES_POOL = [
  'Missing measurable outcomes in older roles',
  'Summary is generic and could be tailored per application',
  'Skills section mixes soft and technical skills without grouping',
  'No links to portfolio or GitHub for technical roles',
  'Education section lacks relevant coursework or honors',
];

export const MISSING_SKILLS_POOL = [
  'TypeScript',
  'GraphQL',
  'Docker',
  'Kubernetes',
  'CI/CD Pipelines',
  'Unit Testing',
  'System Design',
  'AWS',
];

export const RECOMMENDED_KEYWORDS_POOL = [
  'cross-functional collaboration',
  'stakeholder management',
  'agile methodology',
  'performance optimization',
  'scalable architecture',
  'data-driven decision making',
];

export function pickRandom<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function randomScore(min = 55, max = 95): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockAnalysis(fileName: string): ResumeAnalysisResult {
  const ats = randomScore(60, 96);
  const grammar = randomScore(65, 98);
  const keywordMatch = randomScore(45, 90);
  const skillsMatch = randomScore(50, 92);
  const formatting = randomScore(60, 97);
  const experience = randomScore(55, 95);
  const education = randomScore(60, 98);
  const overall = Math.round(
    (ats + grammar + keywordMatch + skillsMatch + formatting + experience + education) / 7,
  );

  const suggestions = pickRandom(SUGGESTION_POOL, 4 + Math.floor(Math.random() * 2)).map((s) => ({
    ...s,
    id: uuid(),
  }));

  const missing = pickRandom(MISSING_SKILLS_POOL, 3 + Math.floor(Math.random() * 3));

  return {
    id: uuid(),
    fileName,
    analyzedAt: new Date().toISOString(),
    scores: { overall, ats, grammar, keywordMatch, skillsMatch, formatting, experience, education },
    strengths: pickRandom(STRENGTHS_POOL, 3),
    weaknesses: pickRandom(WEAKNESSES_POOL, 3),
    missingSkills: missing,
    keywordMatch: {
      matched: pickRandom(
        ['JavaScript', 'React', 'Node.js', 'Agile', 'Leadership', 'Communication'],
        4,
      ),
      missing,
      recommended: pickRandom(RECOMMENDED_KEYWORDS_POOL, 4),
    },
    suggestions,
    improvementTimeline: [
      { id: uuid(), label: 'Add missing keywords to skills section', status: overall < 70 ? 'critical' : 'pending' },
      { id: uuid(), label: 'Quantify achievements with metrics', status: 'pending' },
      { id: uuid(), label: 'Fix formatting inconsistencies', status: formatting > 80 ? 'done' : 'pending' },
      { id: uuid(), label: 'Tailor summary to target role', status: 'pending' },
    ],
    summary: `This resume scores ${overall}/100 overall. ATS compatibility is ${
      ats >= 75 ? 'strong' : 'moderate'
    }, with the biggest opportunity in ${keywordMatch < skillsMatch ? 'keyword alignment' : 'skills coverage'} for the target role.`,
  };
}
