import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import { CompareArrowsOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ComparisonUploadCard } from '@/components/comparison/ComparisonUploadCard';
import { useCompareResumes } from '@/hooks/queries/useCompareResumes';

export default function ResumeComparisonPage() {
  const navigate = useNavigate();
  const compare = useCompareResumes();
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);

  const isBusy = compare.isPending;
  const bothSelected = !!fileA && !!fileB;

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    try {
      const result = await compare.mutateAsync({ resumeA: fileA, resumeB: fileB });
      // Pass the result through the router state — avoids a global store just for a one-shot payload.
      navigate('/compare/result', { state: { result } });
    } catch {
      /* toast already shown in mutation */
    }
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
          <Chip
            size="small"
            icon={<CompareArrowsOutlined sx={{ fontSize: 14 }} />}
            label="Resume Comparison"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          See which resume performs better, side by side.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 680 }}>
          Upload two resumes and we'll compare scores, skills, experience, education and more —
          highlighting exactly where each one is stronger.
        </Typography>
      </motion.div>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ComparisonUploadCard
            label="Resume 1"
            accentColor="#3B5BFD"
            file={fileA}
            uploadProgress={isBusy ? compare.uploadProgress : 0}
            isBusy={isBusy}
            onFileSelected={setFileA}
            onReset={() => setFileA(null)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ComparisonUploadCard
            label="Resume 2"
            accentColor="#14B8A6"
            file={fileB}
            uploadProgress={isBusy ? compare.uploadProgress : 0}
            isBusy={isBusy}
            onFileSelected={setFileB}
            onReset={() => setFileB(null)}
          />
        </Grid>
      </Grid>

      <Stack alignItems="center" spacing={1} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<CompareArrowsOutlined />}
          disabled={!bothSelected || isBusy}
          onClick={handleCompare}
          sx={{ minWidth: 260 }}
        >
          {isBusy ? 'Comparing…' : 'Compare Resumes'}
        </Button>
        {!bothSelected && (
          <Typography variant="caption" color="text.secondary">
            Upload both resumes to enable comparison.
          </Typography>
        )}
        {bothSelected && (
          <Typography variant="caption" color="text.secondary">
            Comparing two resumes takes longer than a single analysis — up to a few minutes.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
