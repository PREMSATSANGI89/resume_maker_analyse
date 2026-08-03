import { z } from 'zod';

export const personalInfoSchema = z.object({
  profileImage: z.string().nullable(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  jobTitle: z.string().min(2, 'Job title is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .regex(/^[\d+\-\s()]+$/, 'Phone number contains invalid characters'),
  location: z.string().min(2, 'Location is required'),
  linkedin: z.string().url('Enter a valid URL').or(z.literal('')),
  github: z.string().url('Enter a valid URL').or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').or(z.literal('')),
});

export const educationItemSchema = z.object({
  id: z.string(),
  college: z.string().min(2, 'College/University name is required'),
  degree: z.string().min(2, 'Degree is required'),
  branch: z.string().optional().default(''),
  cgpa: z.string().optional().default(''),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(2, 'Company name is required'),
  designation: z.string().min(2, 'Designation is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Remote']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  isCurrent: z.boolean(),
  responsibilities: z.array(z.string()).default([]),
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Project name is required'),
  description: z.string().min(10, 'Add a short description (10+ chars)'),
  technologies: z.array(z.string()).default([]),
  github: z.string().url('Enter a valid URL').or(z.literal('')),
  liveLink: z.string().url('Enter a valid URL').or(z.literal('')),
});

export const certificateItemSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Certificate name is required'),
  issuer: z.string().min(2, 'Issuer is required'),
  date: z.string().optional().default(''),
});

export const achievementItemSchema = z.object({
  id: z.string(),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional().default(''),
});

export const languageItemSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Language is required'),
  proficiency: z.enum(['Basic', 'Conversational', 'Fluent', 'Native']),
});

export const referenceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name is required'),
  relation: z.string().min(2, 'Relation is required'),
  contact: z.string().min(3, 'Contact info is required'),
});

export const resumeSchema = z.object({
  id: z.string(),
  templateId: z.enum(['classic', 'modern', 'minimal', 'corporate', 'creative']),
  personalInfo: personalInfoSchema,
  summary: z.string().max(800, 'Summary should be under 800 characters'),
  education: z.array(educationItemSchema),
  experience: z.array(experienceItemSchema),
  skills: z.array(z.string()),
  projects: z.array(projectItemSchema),
  certificates: z.array(certificateItemSchema),
  achievements: z.array(achievementItemSchema),
  languages: z.array(languageItemSchema),
  interests: z.array(z.string()),
  references: z.array(referenceItemSchema),
  sectionOrder: z.array(
    z.enum([
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
    ]),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;
