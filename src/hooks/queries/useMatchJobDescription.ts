import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { jobMatchApi } from '@/services/api/jobMatchApi';
import type { JobDescriptionMatcherRequest } from '@/types/jobMatch.types';

export function useMatchJobDescription() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ resume, jobDescription }: JobDescriptionMatcherRequest) =>
      jobMatchApi.matchResume(resume, jobDescription, setUploadProgress),
    // No retry: every match consumes Affinda credits, so a failure shouldn't silently double up.
    retry: false,
    onSuccess: () => {
      toast.success('Match complete!');
    },
    // Errors are deliberately not toasted here — the axios response interceptor already
    // surfaces the backend's user-friendly message (and network failures) exactly once.
    onSettled: () => {
      setUploadProgress(0);
    },
  });

  const reset = useCallback(() => {
    mutation.reset();
    setUploadProgress(0);
  }, [mutation]);

  return { ...mutation, uploadProgress, reset };
}
