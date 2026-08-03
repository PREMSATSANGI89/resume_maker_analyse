import { RESUME_TEMPLATES } from '@/utils/constants';
import type { ResumeTemplateMeta } from '@/types/resume.types';

export function getMockTemplates(): ResumeTemplateMeta[] {
  return RESUME_TEMPLATES;
}
