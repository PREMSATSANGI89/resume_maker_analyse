/**
 * Types for the Resume Analyzer module.
 */

export interface AnalyzerScoreBreakdown {
  overall: number;
  ats: number;
  grammar: number;
  keywordMatch: number;
  skillsMatch: number;
  formatting: number;
  experience: number;
  education: number;
}

export interface KeywordMatchResult {
  matched: string[];
  missing: string[];
  recommended: string[];
}

export interface AnalyzerSuggestion {
  id: string;
  category: 'ATS' | 'Grammar' | 'Content' | 'Formatting' | 'Keywords' | 'Structure';
  severity: 'low' | 'medium' | 'high';
  title: string;
  detail: string;
}

export interface ImprovementStep {
  id: string;
  label: string;
  status: 'done' | 'pending' | 'critical';
}

export interface ResumeAnalysisResult {
  id: string;
  fileName: string;
  analyzedAt: string;
  scores: AnalyzerScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  keywordMatch: KeywordMatchResult;
  suggestions: AnalyzerSuggestion[];
  improvementTimeline: ImprovementStep[];
  summary: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
