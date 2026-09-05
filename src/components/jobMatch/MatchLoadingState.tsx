import { useEffect, useState } from 'react';
import { Box, Card, LinearProgress, Skeleton, Stack, Typography } from '@mui/material';
import { CheckCircleRounded, RadioButtonUncheckedRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';

const STAGES = ['Analyzing Resume…', 'Comparing with Job Description…', 'Calculating Match Score…'];
const STAGE_DURATION_MS = 4000;

interface MatchLoadingStateProps {
  uploadProgress: number;
}

/**
 * Matching involves two document uploads plus a match call, so it can take a while.
 * Real upload progress is shown first, then the stages advance on a timer to signal
 * that work is still happening server-side.
 */
export function MatchLoadingState({ uploadProgress }: MatchLoadingStateProps) {
  const [stage, setStage] = useState(0);
  const uploading = uploadProgress > 0 && uploadProgress < 100;

  useEffect(() => {
    if (uploading) return;
    const timer = setInterval(
      () => setStage((current) => Math.min(current + 1, STAGES.length - 1)),
      STAGE_DURATION_MS,
    );
    return () => clearInterval(timer);
  }, [uploading]);

  return (
    <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 } }} aria-live="polite" aria-busy="true">
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Matching your resume
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        This usually takes under a minute.
      </Typography>

      <LinearProgress
        variant={uploading ? 'determinate' : 'indeterminate'}
        value={uploadProgress}
        sx={{ height: 8, borderRadius: 5, mb: 3 }}
      />

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        {STAGES.map((label, index) => {
          const done = !uploading && index < stage;
          const active = uploading ? index === 0 : index === stage;
          return (
            <Stack key={label} direction="row" spacing={1.5} alignItems="center">
              {done ? (
                <CheckCircleRounded color="success" sx={{ fontSize: 20 }} />
              ) : (
                <Box
                  component={motion.div}
                  animate={active ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.35 }}
                  transition={active ? { duration: 1.4, repeat: Infinity } : undefined}
                  sx={{ display: 'flex' }}
                >
                  <RadioButtonUncheckedRounded sx={{ fontSize: 20, color: 'text.disabled' }} />
                </Box>
              )}
              <Typography
                variant="body2"
                fontWeight={active ? 700 : 500}
                color={done || active ? 'text.primary' : 'text.secondary'}
              >
                {uploading && index === 0 ? `Uploading resume — ${uploadProgress}%` : label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>

      <Stack spacing={1.5}>
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="text" width="40%" height={28} />
      </Stack>
    </Card>
  );
}
