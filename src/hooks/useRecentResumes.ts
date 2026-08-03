import { useCallback, useEffect, useState } from 'react';
import type { RecentResumeSummary, ResumeData } from '@/types/resume.types';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { calculateResumeCompletion } from '@/utils/helpers';

function readRecent(): RecentResumeSummary[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_RESUMES);
    return raw ? (JSON.parse(raw) as RecentResumeSummary[]) : [];
  } catch {
    return [];
  }
}

/** Tracks a lightweight history of resumes the user has worked on, for the dashboard. */
export function useRecentResumes() {
  const [recent, setRecent] = useState<RecentResumeSummary[]>(readRecent);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT_RESUMES, JSON.stringify(recent));
  }, [recent]);

  const trackResume = useCallback((resume: ResumeData) => {
    setRecent((prev) => {
      const summary: RecentResumeSummary = {
        id: resume.id,
        fullName: resume.personalInfo.fullName || 'Untitled Resume',
        jobTitle: resume.personalInfo.jobTitle || 'No title yet',
        templateId: resume.templateId,
        completion: calculateResumeCompletion(resume),
        updatedAt: resume.updatedAt,
      };
      const filtered = prev.filter((r) => r.id !== resume.id);
      return [summary, ...filtered].slice(0, 8);
    });
  }, []);

  return { recent, trackResume };
}
