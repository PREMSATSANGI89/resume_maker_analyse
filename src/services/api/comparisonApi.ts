import { axiosInstance } from '@/services/api/axiosInstance';
import type { ResumeComparisonResult } from '@/types/comparison.types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const comparisonApi = {
  async compareResumes(
    resumeA: File,
    resumeB: File,
    onUploadProgress?: (percent: number) => void,
  ): Promise<ResumeComparisonResult> {
    const formData = new FormData();
    formData.append('resumeA', resumeA);
    formData.append('resumeB', resumeB);

    const { data } = await axiosInstance.post<ApiEnvelope<ResumeComparisonResult>>(
      '/analyzer/compare',
      formData,
      {
        // Let the browser set Content-Type itself — it needs to append the multipart
        // boundary, which a hardcoded 'multipart/form-data' header strips out.
        headers: { 'Content-Type': undefined },
        // Comparing two resumes takes noticeably longer than a single analysis, and
        // free-tier model latency is highly variable (observed 60s-150s+) — give it room.
        timeout: 240000,
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
