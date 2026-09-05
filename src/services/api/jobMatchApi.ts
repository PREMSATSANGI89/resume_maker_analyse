import { axiosInstance } from '@/services/api/axiosInstance';
import type { JobDescriptionMatcherResponse, MatchResult } from '@/types/jobMatch.types';

export const jobMatchApi = {
  async matchResume(
    resume: File,
    jobDescription: string,
    onUploadProgress?: (percent: number) => void,
  ): Promise<MatchResult> {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    const { data } = await axiosInstance.post<JobDescriptionMatcherResponse>(
      '/job-match/match',
      formData,
      {
        // Let the browser set Content-Type itself — it needs to append the multipart
        // boundary, which a hardcoded 'multipart/form-data' header strips out.
        headers: { 'Content-Type': undefined },
        // The backend uploads and parses two documents with Affinda before matching,
        // which comfortably exceeds the 20s default.
        timeout: 180000,
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
