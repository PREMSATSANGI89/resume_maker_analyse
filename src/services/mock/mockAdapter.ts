import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '@/services/api/axiosInstance';
import { getMockTemplates } from '@/services/mock/mockTemplates';
import { generateMockAnalysis } from '@/services/mock/mockAnalyzer';
import { generateMockComparison } from '@/services/mock/mockComparison';
import { generateMockJobMatch } from '@/services/mock/mockJobMatch';
import { USE_MOCK_API } from '@/utils/constants';

/**
 * Wires up axios-mock-adapter so the app is fully functional without a live backend.
 * Resume-builder endpoints (/resume/*) have no real backend — PDF generation happens
 * entirely client-side — so they're always mocked. Analyzer (/analyzer/*) and job-match
 * (/job-match/*) endpoints hit the real server (see server/) unless USE_MOCK_API is true,
 * via onNoMatch: 'passthrough'.
 */
export function setupMockApi() {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 700, onNoMatch: 'passthrough' });

  mock.onGet('/resume/templates').reply(200, {
    success: true,
    data: getMockTemplates(),
  });

  mock.onPost('/resume/generate').reply((config) => {
    try {
      JSON.parse(config.data);
    } catch {
      return [400, { message: 'Invalid resume payload' }];
    }
    return [
      200,
      {
        success: true,
        data: {
          downloadUrl: '#',
          generatedAt: new Date().toISOString(),
          message: 'Resume generated successfully.',
        },
      },
    ];
  });

  if (!USE_MOCK_API) return;

  mock.onPost('/analyzer/analyze').reply((config) => {
    const formData = config.data as FormData;
    const file = formData?.get?.('file') as File | undefined;
    const fileName = file?.name ?? 'resume.pdf';
    return [200, { success: true, data: generateMockAnalysis(fileName) }];
  });

  mock.onPost('/job-match/match').reply((config) => {
    const formData = config.data as FormData;
    const file = formData?.get?.('resume') as File | undefined;
    const jobDescription = (formData?.get?.('jobDescription') as string | null) ?? '';
    if (!file) return [400, { message: 'Please upload a resume before matching.' }];
    if (!jobDescription.trim()) return [400, { message: 'Please paste a job description before matching.' }];
    return [200, { success: true, data: generateMockJobMatch(file.name) }];
  });

  mock.onPost('/analyzer/compare').reply((config) => {
    const formData = config.data as FormData;
    const fileA = formData?.get?.('resumeA') as File | undefined;
    const fileB = formData?.get?.('resumeB') as File | undefined;
    const fileNameA = fileA?.name ?? 'resume-1.pdf';
    const fileNameB = fileB?.name ?? 'resume-2.pdf';
    return [200, { success: true, data: generateMockComparison(fileNameA, fileNameB) }];
  });
}
