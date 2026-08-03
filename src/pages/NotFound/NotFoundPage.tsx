import { Box, Button, Stack, Typography } from '@mui/material';
import { HomeRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Typography
          sx={{
            fontSize: { xs: 80, md: 120 },
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #3B5BFD, #14B8A6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          This page doesn't exist yet.
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          The link may be broken or the page moved. Head back to the dashboard to keep going.
        </Typography>
        <Button variant="contained" startIcon={<HomeRounded />} onClick={() => navigate('/')}>
          Back to dashboard
        </Button>
      </Stack>
    </Box>
  );
}
