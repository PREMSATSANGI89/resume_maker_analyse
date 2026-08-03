import { Box, Chip, Stack, Typography } from '@mui/material';
import { CheckCircleOutline, CancelOutlined, TipsAndUpdatesOutlined } from '@mui/icons-material';
import type { KeywordMatchResult } from '@/types/analyzer.types';

interface KeywordMatchListProps {
  data: KeywordMatchResult;
}

/** Three-column keyword panel: matched (green), missing (red), recommended (amber). */
export function KeywordMatchList({ data }: KeywordMatchListProps) {
  const columns = [
    {
      title: 'Matched keywords',
      icon: <CheckCircleOutline color="success" fontSize="small" />,
      items: data.matched,
      color: 'success' as const,
      variant: 'filled' as const,
      empty: 'No matched keywords yet.',
    },
    {
      title: 'Missing keywords',
      icon: <CancelOutlined color="error" fontSize="small" />,
      items: data.missing,
      color: 'error' as const,
      variant: 'outlined' as const,
      empty: 'No missing keywords — great coverage!',
    },
    {
      title: 'Recommended keywords',
      icon: <TipsAndUpdatesOutlined color="warning" fontSize="small" />,
      items: data.recommended,
      color: 'warning' as const,
      variant: 'outlined' as const,
      empty: 'No extra recommendations right now.',
    },
  ];

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2.5}
      sx={{ '& > *': { flex: 1 } }}
    >
      {columns.map((col) => (
        <Box key={col.title}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            {col.icon}
            <Typography variant="subtitle2" fontWeight={700}>
              {col.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({col.items.length})
            </Typography>
          </Stack>
          {col.items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {col.empty}
            </Typography>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {col.items.map((k) => (
                <Chip
                  key={k}
                  label={k}
                  size="small"
                  color={col.color}
                  variant={col.variant}
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
}
