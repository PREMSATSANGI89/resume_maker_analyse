import { v4 as uuid } from 'uuid';
import type { ResumeData } from '@/types/resume.types';
import { DEFAULT_SECTION_ORDER } from '@/utils/constants';

export function createEmptyResume(): ResumeData {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    templateId: 'modern',
    personalInfo: {
      profileImage: null,
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certificates: [],
    achievements: [],
    languages: [],
    interests: [],
    references: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    createdAt: now,
    updatedAt: now,
  };
}
