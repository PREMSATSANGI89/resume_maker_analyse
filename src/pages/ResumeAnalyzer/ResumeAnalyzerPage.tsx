import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Grid, Stack, Typography, Chip, Button } from '@mui/material';
import {
  InsightsOutlined,
  VerifiedOutlined,
  SpellcheckRounded,
  DesignServicesOutlined,
  TrendingUpRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ResumeDropzone } from '@/components/analyzer/ResumeDropzone';
import { useAnalyzeResume } from '@/hooks/queries/useAnalyzeResume';

const FEATURES = [
  { icon: <VerifiedOutlined />, title: 'ATS scoring', text: 'How well parsers will read your resume' },
  { icon: <SpellcheckRounded />, title: 'Grammar check', text: 'Catches tense mismatches & typos' },
  { icon: <DesignServicesOutlined />, title: 'Formatting audit', text: 'Flags layout that breaks in ATS' },
  { icon: <TrendingUpRounded />, title: 'Keyword match', text: 'Compares to real role postings' },
];

export default function ResumeAnalyzerPage() {
  const navigate = useNavigate();
  const analyze = useAnalyzeResume();
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileSelected = (file: File) => {
    setPendingFile(file);
  };

  const handleAnalyze = async () => {
    if (!pendingFile) return;
    try {
      const result = await analyze.mutateAsync(pendingFile);
      // Pass the result through the router state — avoids a global store just for a one-shot payload.
      navigate('/analyzer/result', { state: { result } });
    } catch {
      /* toast already shown in mutation */
    }
  };

  const isBusy = analyze.isPending;

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
          <Chip
            size="small"
            icon={<InsightsOutlined sx={{ fontSize: 14 }} />}
            label="AI Resume Analyzer"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          Get an honest, detailed review in seconds.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
          Upload your resume and we'll score it against ATS parsers, benchmark it against role keywords,
          and hand you a prioritized list of improvements.
        </Typography>
      </motion.div>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              Upload your resume
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Files stay on your device — we only send the parsed text for analysis.
            </Typography>
            <ResumeDropzone
              onFileSelected={handleFileSelected}
              uploadProgress={analyze.uploadProgress}
              isBusy={isBusy}
              onReset={() => {
                setPendingFile(null);
                analyze.reset();
              }}
            />
            {pendingFile && !isBusy && (
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={handleAnalyze} sx={{ flexGrow: 1 }}>
                  Analyze resume
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
              What we check
            </Typography>
            <Stack spacing={2}>
              {FEATURES.map((f) => (
                <Stack key={f.title} direction="row" spacing={2} alignItems="flex-start">
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
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {f.text}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
