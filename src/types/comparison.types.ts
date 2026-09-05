/**
 * Types for the Resume Comparison module.
 */
import type { AnalyzerScoreBreakdown, KeywordMatchResult } from '@/types/analyzer.types';

export interface ResumeComparisonSide {
  fileName: string;
  scores: AnalyzerScoreBreakdown;
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
  projects: string[];
  keywordMatch: KeywordMatchResult;
  missingSkills: string[];
  strengths: string[];
  areasForImprovement: string[];
}

export interface ResumeComparisonResult {
  id: string;
  comparedAt: string;
  resumeA: ResumeComparisonSide;
  resumeB: ResumeComparisonSide;
}
