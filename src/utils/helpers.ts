import type { ResumeData } from '@/types/resume.types';

/** Formats an ISO yyyy-MM date string into "Mon yyyy" for preview rendering. */
export function formatMonthYear(value: string): string {
  if (!value) return '';
  if (value.toLowerCase() === 'present') return 'Present';
  const [year, month] = value.split('-');
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Generates initials from a full name for avatar fallbacks. */
export function getInitials(name: string): string {
  if (!name?.trim()) return 'NA';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * Calculates the completion percentage of a resume based on filled sections.
 * Weighted so critical sections (personal info, summary, experience) count more.
 */
export function calculateResumeCompletion(resume: ResumeData): number {
  const checks: Array<{ weight: number; filled: boolean }> = [
    { weight: 15, filled: !!resume.personalInfo.fullName && !!resume.personalInfo.email },
    { weight: 10, filled: !!resume.personalInfo.jobTitle && !!resume.personalInfo.phone },
    { weight: 15, filled: resume.summary.trim().length > 20 },
    { weight: 20, filled: resume.experience.length > 0 },
    { weight: 15, filled: resume.education.length > 0 },
    { weight: 10, filled: resume.skills.length >= 3 },
    { weight: 10, filled: resume.projects.length > 0 },
    { weight: 5, filled: resume.certificates.length > 0 || resume.achievements.length > 0 },
  ];
  const total = checks.reduce((sum, c) => sum + c.weight, 0);
  const filled = checks.reduce((sum, c) => sum + (c.filled ? c.weight : 0), 0);
  return Math.round((filled / total) * 100);
}

/** Simple debounce implementation for autosave & search inputs. */
export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Returns a Tailwind-esque semantic color name based on a 0-100 score. */
export function getScoreColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}

/** Reads a File object as a base64 data URL (used for profile image upload). */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
