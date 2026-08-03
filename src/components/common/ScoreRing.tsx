import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/utils/helpers';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
}

const COLOR_MAP = {
  success: '#14B8A6',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

/**
 * Signature visual motif of the app — a gradient progress ring used consistently
 * across the dashboard, resume score card, and analyzer results to tie the two
 * modules together visually.
 */
export function ScoreRing({ score, size = 96, strokeWidth = 9, label, showLabel = true }: ScoreRingProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;
  const color = COLOR_MAP[getScoreColor(score)];
  const trackColor = theme.palette.mode === 'light' ? '#EDEFF6' : '#1D2740';
  const gradientId = `score-ring-gradient-${size}-${label ?? 'ring'}`;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'inline-flex' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Score ${score} out of 100`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
          {score}
        </Typography>
        {showLabel && label && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textAlign: 'center' }}>
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
