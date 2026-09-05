import { useRef, useState } from 'react';
import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material';
import { WorkspacePremiumOutlined, TravelExploreOutlined, RestartAltRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ResumeDropzone } from '@/components/analyzer/ResumeDropzone';
import { JobDescriptionField } from '@/components/jobMatch/JobDescriptionField';
import { MatchLoadingState } from '@/components/jobMatch/MatchLoadingState';
import { MatchResultPanel } from '@/components/jobMatch/MatchResultPanel';
import { useMatchJobDescription } from '@/hooks/queries/useMatchJobDescription';
import { JOB_DESCRIPTION_LIMITS } from '@/utils/constants';

export default function JobDescriptionMatcherPage() {
  const match = useMatchJobDescription();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const isBusy = match.isPending;
  const jobDescriptionReady = jobDescription.trim().length >= JOB_DESCRIPTION_LIMITS.MIN_CHARS;
  const canMatch = !!resume && jobDescriptionReady && !isBusy;
  const result = match.data ?? null;

  const handleMatch = async () => {
    // Guard as well as disable the button — this also blocks a double submit from
    // a stray Enter key while the request is in flight.
    if (!resume || !jobDescriptionReady || isBusy) return;
    try {
      await match.mutateAsync({ resume, jobDescription: jobDescription.trim() });
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch {
      /* the axios interceptor already surfaced a friendly message */
    }
  };

  const handleStartOver = () => {
    setResume(null);
    setJobDescription('');
    match.reset();
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
          <Chip
            size="small"
            icon={<TravelExploreOutlined sx={{ fontSize: 14 }} />}
            label="Job Description Matcher"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          See how well your resume fits the role.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
          Upload a resume, paste the job description, and we'll score the fit with Affinda's Resume
          Search &amp; Match — including the skills you already cover and the ones the role asks for.
        </Typography>
      </motion.div>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              1. Your resume
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              PDF or DOCX — the same formats the analyzer accepts.
            </Typography>
            <ResumeDropzone
              onFileSelected={setResume}
              isBusy={isBusy}
              onReset={() => setResume(null)}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              2. The job description
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Paste the full posting — responsibilities, requirements and required skills.
            </Typography>
            <JobDescriptionField value={jobDescription} onChange={setJobDescription} disabled={isBusy} />
          </Card>
        </Grid>
      </Grid>

      <Stack alignItems="center" spacing={1} sx={{ mt: 4 }}>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            size="large"
            startIcon={<WorkspacePremiumOutlined />}
            disabled={!canMatch}
            onClick={handleMatch}
            sx={{ minWidth: 240 }}
          >
            {isBusy ? 'Matching…' : 'Match Resume'}
          </Button>
          {(result || resume || jobDescription) && !isBusy && (
            <Button color="inherit" startIcon={<RestartAltRounded />} onClick={handleStartOver}>
              Start over
            </Button>
          )}
        </Stack>
        {!canMatch && !isBusy && (
          <Typography variant="caption" color="text.secondary">
            {!resume
              ? 'Upload a resume to continue.'
              : `Paste a job description of at least ${JOB_DESCRIPTION_LIMITS.MIN_CHARS} characters to continue.`}
          </Typography>
        )}
      </Stack>

      <Box ref={resultsRef} sx={{ mt: 4, scrollMarginTop: 96 }}>
        {isBusy && <MatchLoadingState uploadProgress={match.uploadProgress} />}
        {!isBusy && result && <MatchResultPanel result={result} />}
      </Box>
    </Box>
  );
}
