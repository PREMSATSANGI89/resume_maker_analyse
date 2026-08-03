import { Card, CardActionArea, Box, Typography, Stack } from '@mui/material';
import { ArrowOutward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface GradientCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  to?: string;
  onClick?: () => void;
  tag?: string;
}

const MotionCard = motion(Card);

/** Large, bold call-to-action card used on the dashboard for the two main modules. */
export function GradientCard({ title, description, icon, gradient, to, onClick, tag }: GradientCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (to) navigate(to);
  };

  return (
    <MotionCard
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      sx={{
        background: gradient,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        boxShadow: '0 12px 32px -12px rgba(59, 91, 253, 0.45)',
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{ height: '100%', p: 3.5 }}
        aria-label={`Open ${title}`}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
          }}
        />
        <Stack spacing={2} sx={{ position: 'relative', height: '100%', minHeight: 190 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {icon}
            </Box>
            {tag && (
              <Box
                sx={{
                  px: 1.25,
                  py: 0.4,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {tag}
              </Box>
            )}
          </Stack>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.88, maxWidth: 320 }}>
              {description}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ fontWeight: 600 }}>
            <Typography variant="body2" fontWeight={600}>
              Get started
            </Typography>
            <ArrowOutward fontSize="small" />
          </Stack>
        </Stack>
      </CardActionArea>
    </MotionCard>
  );
}
