import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { comparisonApi } from '@/services/api/comparisonApi';

interface CompareArgs {
  resumeA: File;
  resumeB: File;
}

export function useCompareResumes() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ resumeA, resumeB }: CompareArgs) =>
      comparisonApi.compareResumes(resumeA, resumeB, setUploadProgress),
    retry: 1,
    onSuccess: () => {
      toast.success('Comparison complete!');
    },
    onError: () => {
      toast.error('Failed to compare resumes. Please try different files.');
    },
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
