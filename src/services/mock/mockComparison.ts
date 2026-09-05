import { v4 as uuid } from 'uuid';
import type { ResumeComparisonResult, ResumeComparisonSide } from '@/types/comparison.types';
import {
  pickRandom,
  randomScore,
  STRENGTHS_POOL,
  WEAKNESSES_POOL,
  MISSING_SKILLS_POOL,
  RECOMMENDED_KEYWORDS_POOL,
} from '@/services/mock/mockAnalyzer';

const SKILLS_POOL = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'GraphQL',
  'Docker',
  'AWS',
  'Agile',
  'Leadership',
  'Communication',
  'Project Management',
  'CI/CD',
];

const EXPERIENCE_POOL = [
  'Senior Software Engineer — Acme Corp (3 yrs)',
  'Frontend Developer — Bright Labs (2 yrs)',
  'Backend Engineer — DataStream Inc. (4 yrs)',
  'Full Stack Developer — Nimbus Tech (2 yrs)',
  'Software Engineering Intern — Vertex Systems (1 yr)',
  'Team Lead — Orbit Solutions (3 yrs)',
];

const EDUCATION_POOL = [
  'B.S. Computer Science — State University',
  'M.S. Software Engineering — Tech Institute',
  'B.A. Information Systems — City College',
  'Associate Degree — Community College',
];

const CERTIFICATIONS_POOL = [
  'AWS Certified Solutions Architect',
  'Certified Scrum Master',
  'Google Cloud Professional Engineer',
  'Meta Front-End Developer Certificate',
  'PMP Certification',
];

const PROJECTS_POOL = [
  'E-commerce Platform Redesign',
  'Real-time Analytics Dashboard',
  'Open Source CLI Toolkit',
  'Mobile Expense Tracker',
  'Internal Design System',
  'Automated CI/CD Pipeline',
];

function generateSide(fileName: string): ResumeComparisonSide {
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

  const missing = pickRandom(MISSING_SKILLS_POOL, 2 + Math.floor(Math.random() * 3));

  return {
    fileName,
    scores: { overall, ats, grammar, keywordMatch, skillsMatch, formatting, experience, education },
    skills: pickRandom(SKILLS_POOL, 5 + Math.floor(Math.random() * 4)),
    experience: pickRandom(EXPERIENCE_POOL, 2 + Math.floor(Math.random() * 2)),
    education: pickRandom(EDUCATION_POOL, 1 + Math.floor(Math.random() * 2)),
    certifications: pickRandom(CERTIFICATIONS_POOL, Math.floor(Math.random() * 4)),
    projects: pickRandom(PROJECTS_POOL, 1 + Math.floor(Math.random() * 3)),
    keywordMatch: {
      matched: pickRandom(
        ['JavaScript', 'React', 'Node.js', 'Agile', 'Leadership', 'Communication'],
        3 + Math.floor(Math.random() * 2),
      ),
      missing,
      recommended: pickRandom(RECOMMENDED_KEYWORDS_POOL, 3 + Math.floor(Math.random() * 2)),
    },
    missingSkills: missing,
    strengths: pickRandom(STRENGTHS_POOL, 3),
    areasForImprovement: pickRandom(WEAKNESSES_POOL, 3),
  };
}

export function generateMockComparison(fileNameA: string, fileNameB: string): ResumeComparisonResult {
  return {
    id: uuid(),
    comparedAt: new Date().toISOString(),
    resumeA: generateSide(fileNameA),
    resumeB: generateSide(fileNameB),
  };
}
