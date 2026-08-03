/**
 * Core domain types for the Resume Builder module.
 * Kept framework-agnostic so they can be reused across form, preview,
 * and API layers without circular dependencies.
 */

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'corporate' | 'creative';

export interface PersonalInfo {
  profileImage: string | null; // base64 data URL or remote URL
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface EducationItem {
  id: string;
  college: string;
  degree: string;
  branch: string;
  cgpa: string;
  startDate: string; // ISO yyyy-MM
  endDate: string; // ISO yyyy-MM or "Present"
}

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Contract'
  | 'Freelance'
  | 'Remote';

export interface ExperienceItem {
  id: string;
  company: string;
  designation: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  github: string;
  liveLink: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface ReferenceItem {
  id: string;
  name: string;
  relation: string;
  contact: string;
}

export interface ResumeData {
  id: string;
  templateId: TemplateId;
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  interests: string[];
  references: ReferenceItem[];
  sectionOrder: ResumeSectionKey[];
  updatedAt: string;
  createdAt: string;
}

export type ResumeSectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certificates'
  | 'achievements'
  | 'languages'
  | 'interests'
  | 'references';

export interface ResumeTemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  isPremium: boolean;
}

export interface RecentResumeSummary {
  id: string;
  fullName: string;
  jobTitle: string;
  templateId: TemplateId;
  completion: number;
  updatedAt: string;
}
