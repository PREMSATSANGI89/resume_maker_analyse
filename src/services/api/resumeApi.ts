import { axiosInstance } from '@/services/api/axiosInstance';
import type { ResumeData, ResumeTemplateMeta } from '@/types/resume.types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface GenerateResumeResponse {
  downloadUrl: string;
  generatedAt: string;
  message: string;
}

export const resumeApi = {
  async getTemplates(): Promise<ResumeTemplateMeta[]> {
    const { data } = await axiosInstance.get<ApiEnvelope<ResumeTemplateMeta[]>>('/resume/templates');
    return data.data;
  },

  async generateResume(resume: ResumeData): Promise<GenerateResumeResponse> {
    const { data } = await axiosInstance.post<ApiEnvelope<GenerateResumeResponse>>(
      '/resume/generate',
      resume,
    );
    return data.data;
  },
};
