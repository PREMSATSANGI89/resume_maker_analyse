import { Card, Stack, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  accentColor?: string;
}

const MotionCard = motion(Card);

/** Compact statistic card (e.g. "Resumes Created", "Avg. ATS Score") for the dashboard grid. */
export function StatCard({ label, value, icon, trend, accentColor = 'primary.main' }: StatCardProps) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      sx={{ p: 2.5, height: '100%' }}
      variant="outlined"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? `${accentColor}14` : `${accentColor}26`,
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} noWrap>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
        </Box>
      </Stack>
      {trend && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            display: 'inline-block',
            color: trend.positive ? 'success.main' : 'error.main',
            fontWeight: 600,
          }}
        >
          {trend.positive ? '↑' : '↓'} {trend.value}
        </Typography>
      )}
    </MotionCard>
  );
}
