import { Box, Stack, Typography } from '@mui/material';
import { CheckCircleRounded, RadioButtonUncheckedRounded, ErrorRounded } from '@mui/icons-material';
import type { ImprovementStep } from '@/types/analyzer.types';

interface ImprovementTimelineProps {
  steps: ImprovementStep[];
}

const STATUS_META = {
  done: { icon: <CheckCircleRounded fontSize="small" />, color: 'success.main' },
  pending: { icon: <RadioButtonUncheckedRounded fontSize="small" />, color: 'text.secondary' },
  critical: { icon: <ErrorRounded fontSize="small" />, color: 'error.main' },
} as const;

/** Vertical checklist of concrete next steps to improve the resume score. */
export function ImprovementTimeline({ steps }: ImprovementTimelineProps) {
  return (
    <Stack spacing={0}>
      {steps.map((step, i) => {
        const meta = STATUS_META[step.status];
        const isLast = i === steps.length - 1;
        return (
          <Stack key={step.id} direction="row" spacing={1.5} sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ color: meta.color }}>{meta.icon}</Box>
              {!isLast && (
                <Box
                  sx={{
                    flexGrow: 1,
                    width: '2px',
                    bgcolor: 'divider',
                    my: 0.5,
                    minHeight: 20,
                  }}
                />
              )}
            </Box>
            <Box sx={{ pb: isLast ? 0 : 2, flexGrow: 1 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  color: step.status === 'done' ? 'text.disabled' : 'text.primary',
                  textDecoration: step.status === 'done' ? 'line-through' : 'none',
                }}
              >
                {step.label}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
