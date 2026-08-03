import { axiosInstance } from '@/services/api/axiosInstance';
import type { ResumeAnalysisResult } from '@/types/analyzer.types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const analyzerApi = {
  async analyzeResume(
    file: File,
    onUploadProgress?: (percent: number) => void,
  ): Promise<ResumeAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post<ApiEnvelope<ResumeAnalysisResult>>(
      '/analyzer/analyze',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total && onUploadProgress) {
            onUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      },
    );
    return data.data;
  },
};
