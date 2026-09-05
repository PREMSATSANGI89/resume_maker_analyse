import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import type { MatchCriterion } from '@/types/jobMatch.types';
import { getScoreColor } from '@/utils/helpers';

interface MatchCriteriaListProps {
  criteria: MatchCriterion[];
}

/**
 * Per-criterion readout. Affinda frequently returns a value with no score, so the bar is
 * only drawn when a score actually exists — an unscored criterion is not a zero.
 */
export function MatchCriteriaList({ criteria }: MatchCriteriaListProps) {
  return (
    <Stack spacing={2.5}>
      {criteria.map((criterion) => (
        <Box key={criterion.key}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2} sx={{ mb: 0.75 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {criterion.label}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: '"JetBrains Mono", monospace', flexShrink: 0 }}
            >
              {criterion.score === null ? 'Not scored' : `${criterion.score}%`}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: criterion.score === null ? 0 : 1 }}>
            {criterion.value ?? 'No value detected.'}
          </Typography>
          {criterion.score !== null && (
            <LinearProgress
              variant="determinate"
              value={criterion.score}
              color={getScoreColor(criterion.score)}
              sx={{ height: 6, borderRadius: 5 }}
            />
          )}
        </Box>
      ))}
    </Stack>
  );
}
