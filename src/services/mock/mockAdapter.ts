import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '@/services/api/axiosInstance';
import { getMockTemplates } from '@/services/mock/mockTemplates';
import { generateMockAnalysis } from '@/services/mock/mockAnalyzer';
import { USE_MOCK_API } from '@/utils/constants';

/**
 * Wires up axios-mock-adapter so the app is fully functional without a live backend.
 * Simulates realistic network latency. Set USE_MOCK_API to false in constants.ts
 * once a real API is available — no other code changes required.
 */
export function setupMockApi() {
  if (!USE_MOCK_API) return;

  const mock = new MockAdapter(axiosInstance, { delayResponse: 700 });

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
    // Simulate a generated PDF URL (in a real backend this would be a signed blob URL)
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

  mock.onPost('/analyzer/analyze').reply((config) => {
    const formData = config.data as FormData;
    const file = formData?.get?.('file') as File | undefined;
    const fileName = file?.name ?? 'resume.pdf';
    return [200, { success: true, data: generateMockAnalysis(fileName) }];
  });
}
