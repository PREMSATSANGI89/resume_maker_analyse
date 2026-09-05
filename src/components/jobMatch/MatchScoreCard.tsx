import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import { DescriptionOutlined } from '@mui/icons-material';
import { ScoreRing } from '@/components/common/ScoreRing';
import type { MatchResult } from '@/types/jobMatch.types';
import { MATCH_CATEGORY_META } from '@/utils/jobMatchHelpers';

const CATEGORY_GRADIENT = {
  strong: 'linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)',
  good: 'linear-gradient(135deg, #3B5BFD 0%, #6E85FF 100%)',
  partial: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  low: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
} as const;

const CATEGORY_SHADOW = {
  strong: 'rgba(20,184,166,0.5)',
  good: 'rgba(59,91,253,0.5)',
  partial: 'rgba(245,158,11,0.5)',
  low: 'rgba(239,68,68,0.5)',
} as const;

interface MatchScoreCardProps {
  result: MatchResult;
}

/** Hero card: overall percentage, its band, and the recommendation for that band. */
export function MatchScoreCard({ result }: MatchScoreCardProps) {
  const meta = MATCH_CATEGORY_META[result.category];

  return (
    <Card
      sx={{
        p: { xs: 3, md: 3.5 },
        background: CATEGORY_GRADIENT[result.category],
        color: '#fff',
        boxShadow: `0 12px 32px -12px ${CATEGORY_SHADOW[result.category]}`,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
        <Box sx={{ filter: 'brightness(1.25)', flexShrink: 0 }}>
          <ScoreRing score={result.score} size={132} strokeWidth={12} showLabel={false} />
        </Box>
        <Box sx={{ minWidth: 0, textAlign: { xs: 'center', sm: 'left' } }}>
          <Chip
            icon={<DescriptionOutlined sx={{ fontSize: 13, color: 'inherit' }} />}
            label={result.fileName}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, mb: 1, maxWidth: '100%' }}
          />
          <Typography variant="overline" sx={{ opacity: 0.85, display: 'block' }}>
            Resume Match
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.1 }}>
            {result.score}%
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
            {meta.label}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.92, mt: 0.75, maxWidth: 460 }}>
            {meta.detail}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
