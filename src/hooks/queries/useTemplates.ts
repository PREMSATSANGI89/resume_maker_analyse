import { useQuery } from '@tanstack/react-query';
import { resumeApi } from '@/services/api/resumeApi';

export const templatesQueryKey = ['resume', 'templates'] as const;

export function useTemplates() {
  return useQuery({
    queryKey: templatesQueryKey,
    queryFn: resumeApi.getTemplates,
    staleTime: 1000 * 60 * 30, // templates rarely change
    retry: 2,
  });
}
