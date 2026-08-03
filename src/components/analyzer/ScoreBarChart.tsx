import { Box, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/utils/helpers';

interface ScoreBarChartProps {
  data: Array<{ label: string; value: number }>;
  maxValue?: number;
}

const COLORS = {
  success: '#14B8A6',
  warning: '#F59E0B',
  error: '#EF4444',
};

/** Horizontal bar chart for score breakdowns — animated with framer-motion. */
export function ScoreBarChart({ data, maxValue = 100 }: ScoreBarChartProps) {
  const theme = useTheme();
  const trackColor = theme.palette.mode === 'light' ? '#EEF0F6' : '#1D2740';

  return (
    <Stack spacing={2}>
      {data.map((item) => {
        const percent = Math.min((item.value / maxValue) * 100, 100);
        const color = COLORS[getScoreColor(item.value)];
        return (
          <Box key={item.label}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2" fontWeight={500}>
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ fontFamily: '"JetBrains Mono", monospace', color }}
              >
                {item.value}
              </Typography>
            </Stack>
            <Box sx={{ height: 10, borderRadius: 5, bgcolor: trackColor, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${color}aa, ${color})`,
                  borderRadius: 5,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
