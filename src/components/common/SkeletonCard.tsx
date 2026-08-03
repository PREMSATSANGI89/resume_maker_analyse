import { Card, Skeleton, Stack } from '@mui/material';

interface SkeletonCardProps {
  height?: number;
  lines?: number;
}

/** Generic skeleton loader used while dashboard stats, templates, or query data load. */
export function SkeletonCard({ height = 140, lines = 2 }: SkeletonCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 2.5, height }}>
      <Stack spacing={1.5}>
        <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2.5 }} />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant="text" width={i === 0 ? '70%' : '45%'} height={24} />
        ))}
      </Stack>
    </Card>
  );
}

export function SkeletonGrid({ count = 4, height = 140 }: { count?: number; height?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={height} />
      ))}
    </>
  );
}
