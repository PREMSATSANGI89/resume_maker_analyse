import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { resumeApi } from '@/services/api/resumeApi';
import type { ResumeData } from '@/types/resume.types';

export function useGenerateResume() {
  return useMutation({
    mutationFn: (resume: ResumeData) => resumeApi.generateResume(resume),
    retry: 1,
    onSuccess: () => {
      toast.success('Resume generated! Your download is ready.');
    },
    onError: () => {
      toast.error('Could not generate your resume PDF. Please try again.');
    },
  });
}
