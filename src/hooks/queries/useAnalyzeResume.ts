import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { analyzerApi } from '@/services/api/analyzerApi';

export function useAnalyzeResume() {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (file: File) => analyzerApi.analyzeResume(file, setUploadProgress),
    retry: 1,
    onSuccess: () => {
      toast.success('Analysis complete!');
    },
    onError: () => {
      toast.error('Failed to analyze resume. Please try a different file.');
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
