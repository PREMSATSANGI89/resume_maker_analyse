import { Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { EmojiEventsRounded } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { compareByCount } from '@/utils/comparisonHelpers';

type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface ComparisonListCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  nameA: string;
  nameB: string;
  itemsA: string[];
  itemsB: string[];
  /** Set true for categories where having fewer items is the better outcome (e.g. missing skills). */
  fewerIsBetter?: boolean;
  chipColor?: ChipColor;
  emptyLabel?: string;
}

/**
 * Reusable side-by-side comparison card for list-based resume categories
 * (skills, experience, education, certifications, projects, strengths, etc).
 * Highlights whichever resume "leads" for the category based on item count.
 */
export function ComparisonListCard({
  icon,
  title,
  subtitle,
  nameA,
  nameB,
  itemsA,
  itemsB,
  fewerIsBetter = false,
  chipColor = 'primary',
  emptyLabel = 'None listed',
}: ComparisonListCardProps) {
  const winner = compareByCount(itemsA, itemsB, fewerIsBetter);

  const renderColumn = (name: string, items: string[], isWinner: boolean) => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.25, rowGap: 0.5 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap>
          {name}
        </Typography>
        <Chip label={items.length} size="small" variant="outlined" />
        {isWinner && winner !== 'tie' && (
          <Chip
            icon={<EmojiEventsRounded sx={{ fontSize: 14 }} />}
            label="Leads"
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Stack>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyLabel}
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {items.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              color={chipColor}
              variant={isWinner ? 'filled' : 'outlined'}
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );

  return (
    <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: subtitle ? 0.5 : 2.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'primary.main',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {subtitle}
        </Typography>
      )}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2.5}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
      >
        {renderColumn(nameA, itemsA, winner === 'A')}
        {renderColumn(nameB, itemsB, winner === 'B')}
      </Stack>
    </Card>
  );
}
