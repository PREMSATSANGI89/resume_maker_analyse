import { Card, Stack, Typography, Box, Chip } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  badge?: string | number;
}

/** Consistent card wrapper for every resume-builder form section. */
export function SectionCard({ title, subtitle, icon, action, children, badge }: SectionCardProps) {
  return (
    <Card
      variant="outlined"
      component="section"
      aria-labelledby={`section-${title}`}
      sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3 }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 2.5 }}
        spacing={2}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {icon && (
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
          )}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography id={`section-${title}`} variant="h6" fontWeight={700}>
                {title}
              </Typography>
              {badge !== undefined && <Chip label={badge} size="small" color="primary" />}
            </Stack>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action}
      </Stack>
      {children}
    </Card>
  );
}
