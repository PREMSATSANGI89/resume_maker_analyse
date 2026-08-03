import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  ArrowBackRounded,
  DescriptionOutlined,
  VerifiedOutlined,
  CheckCircleOutline,
  ReportProblemOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ScoreRing } from '@/components/common/ScoreRing';
import { ScoreBarChart } from '@/components/analyzer/ScoreBarChart';
import { KeywordMatchList } from '@/components/analyzer/KeywordMatchList';
import { SuggestionsAccordion } from '@/components/analyzer/SuggestionsAccordion';
import { ImprovementTimeline } from '@/components/analyzer/ImprovementTimeline';
import type { ResumeAnalysisResult } from '@/types/analyzer.types';
import { getScoreLabel } from '@/utils/helpers';

export default function AnalyzerResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: ResumeAnalysisResult } | null)?.result;

  useEffect(() => {
    // If someone deep-links here with no result payload, bounce them back to the upload screen.
    if (!result) navigate('/analyzer', { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const { scores } = result;

  const scoreCards = [
    { label: 'Grammar', value: scores.grammar },
    { label: 'Keyword Match', value: scores.keywordMatch },
    { label: 'Skills Match', value: scores.skillsMatch },
    { label: 'Formatting', value: scores.formatting },
    { label: 'Experience', value: scores.experience },
    { label: 'Education', value: scores.education },
  ];

  return (
    <Box>
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/analyzer')}
        sx={{ mb: 2 }}
      >
        Analyze another
      </Button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }} flexWrap="wrap">
          <Chip
            icon={<DescriptionOutlined sx={{ fontSize: 14 }} />}
            label={result.fileName}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="caption" color="text.secondary">
            Analyzed {new Date(result.analyzedAt).toLocaleString()}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          Analysis Results
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
          {result.summary}
        </Typography>
      </motion.div>

      {/* Top: Overall + ATS hero cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3.5,
              background: 'linear-gradient(135deg, #3B5BFD 0%, #6E85FF 100%)',
              color: '#fff',
              height: '100%',
              boxShadow: '0 12px 32px -12px rgba(59,91,253,0.5)',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ filter: 'brightness(1.2)' }}>
                <ScoreRing score={scores.overall} size={140} strokeWidth={12} showLabel={false} />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.85 }}>
                  Overall Resume Score
                </Typography>
                <Typography variant="h3" fontWeight={800}>
                  {scores.overall}/100
                </Typography>
                <Chip
                  label={getScoreLabel(scores.overall)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 600, mt: 0.5 }}
                  size="small"
                />
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3.5,
              background: 'linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)',
              color: '#fff',
              height: '100%',
              boxShadow: '0 12px 32px -12px rgba(20,184,166,0.5)',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ filter: 'brightness(1.2)' }}>
                <ScoreRing score={scores.ats} size={140} strokeWidth={12} showLabel={false} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VerifiedOutlined fontSize="small" />
                  <Typography variant="overline" sx={{ opacity: 0.85 }}>
                    ATS Compatibility
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight={800}>
                  {scores.ats}/100
                </Typography>
                <Chip
                  label={getScoreLabel(scores.ats)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 600, mt: 0.5 }}
                  size="small"
                />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed score breakdown */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
              Score breakdown
            </Typography>
            <ScoreBarChart data={scoreCards} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Improvement timeline
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ship these updates for the fastest score improvement.
            </Typography>
            <ImprovementTimeline steps={result.improvementTimeline} />
          </Card>
        </Grid>
      </Grid>

      {/* Strengths + Weaknesses */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CheckCircleOutline color="success" />
              <Typography variant="h6" fontWeight={700}>
                Strengths
              </Typography>
            </Stack>
            <Stack spacing={1.25} component="ul" sx={{ pl: 2.5, m: 0 }}>
              {result.strengths.map((s, i) => (
                <Typography key={i} component="li" variant="body2">
                  {s}
                </Typography>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <ReportProblemOutlined color="warning" />
              <Typography variant="h6" fontWeight={700}>
                Weaknesses
              </Typography>
            </Stack>
            <Stack spacing={1.25} component="ul" sx={{ pl: 2.5, m: 0 }}>
              {result.weaknesses.map((w, i) => (
                <Typography key={i} component="li" variant="body2">
                  {w}
                </Typography>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Keywords */}
      <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Keyword analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Missing keywords are flagged — add them where they truthfully apply.
        </Typography>
        <KeywordMatchList data={result.keywordMatch} />
        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Missing skills for this role
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {result.missingSkills.map((s) => (
            <Chip key={s} label={s} color="warning" variant="outlined" size="small" />
          ))}
        </Stack>
      </Card>

      {/* Suggestions */}
      <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Suggestions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Expand each item for a concrete recommendation.
        </Typography>
        <SuggestionsAccordion suggestions={result.suggestions} />
      </Card>

      <Alert severity="info" icon={<VerifiedOutlined />} sx={{ borderRadius: 3 }}>
        Ready to fix these? Open the <strong>Resume Builder</strong> and copy your resume in to
        edit with the same recommendations applied live.
      </Alert>
    </Box>
  );
}
