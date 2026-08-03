import { Box, Typography, Button, Stack } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Friendly empty-state block for lists with no items yet (e.g. no experience added). */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 5,
        px: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Box sx={{ color: 'text.disabled', fontSize: 40 }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          {description}
        </Typography>
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
