import { Box, Chip, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface MatchChipListProps {
  title: string;
  icon: ReactNode;
  items: string[];
  color: 'success' | 'error' | 'warning' | 'primary' | 'secondary';
  variant?: 'filled' | 'outlined';
  emptyLabel: string;
}

/** Titled, counted chip group — shared by the matching/missing skill and education lists. */
export function MatchChipList({
  title,
  icon,
  items,
  color,
  variant = 'filled',
  emptyLabel,
}: MatchChipListProps) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ({items.length})
        </Typography>
      </Stack>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyLabel}
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {items.map((item) => (
            <Chip key={item} label={item} size="small" color={color} variant={variant} sx={{ fontWeight: 500 }} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
