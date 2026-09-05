import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import {
  ArrowBackRounded,
  DescriptionOutlined,
  VerifiedOutlined,
  PsychologyOutlined,
  WorkOutline,
  SchoolOutlined,
  WorkspacePremiumOutlined,
  FolderOutlined,
  CancelOutlined,
  CheckCircleOutline,
  TrendingUpRounded,
  EmojiEventsRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ScoreRing } from '@/components/common/ScoreRing';
import { KeywordMatchList } from '@/components/analyzer/KeywordMatchList';
import { ComparisonScoreTable } from '@/components/comparison/ComparisonScoreTable';
import { ComparisonListCard } from '@/components/comparison/ComparisonListCard';
import type { ResumeComparisonResult } from '@/types/comparison.types';
import { getScoreLabel } from '@/utils/helpers';
import { compareHigherWins } from '@/utils/comparisonHelpers';

const HERO_STYLES = {
  A: { gradient: 'linear-gradient(135deg, #3B5BFD 0%, #6E85FF 100%)', shadow: 'rgba(59,91,253,0.5)' },
  B: { gradient: 'linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)', shadow: 'rgba(20,184,166,0.5)' },
} as const;

export default function ComparisonResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: ResumeComparisonResult } | null)?.result;

  useEffect(() => {
    // If someone deep-links here with no result payload, bounce them back to the upload screen.
    if (!result) navigate('/compare', { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const { resumeA, resumeB } = result;
  const overallWinner = compareHigherWins(resumeA.scores.overall, resumeB.scores.overall);
  const winnerSide = overallWinner === 'A' ? resumeA : overallWinner === 'B' ? resumeB : null;

  const scoreMetrics = [
    { label: 'Overall', valueA: resumeA.scores.overall, valueB: resumeB.scores.overall },
    { label: 'ATS Compatibility', valueA: resumeA.scores.ats, valueB: resumeB.scores.ats },
    { label: 'Grammar', valueA: resumeA.scores.grammar, valueB: resumeB.scores.grammar },
    { label: 'Keyword Match', valueA: resumeA.scores.keywordMatch, valueB: resumeB.scores.keywordMatch },
    { label: 'Skills Match', valueA: resumeA.scores.skillsMatch, valueB: resumeB.scores.skillsMatch },
    { label: 'Formatting', valueA: resumeA.scores.formatting, valueB: resumeB.scores.formatting },
    { label: 'Experience', valueA: resumeA.scores.experience, valueB: resumeB.scores.experience },
    { label: 'Education', valueA: resumeA.scores.education, valueB: resumeB.scores.education },
  ];

  const renderHeroCard = (side: 'A' | 'B', resume: typeof resumeA) => {
    const isWinner = overallWinner === side;
    const style = HERO_STYLES[side];
    return (
      <Card
        sx={{
          p: 3.5,
          background: style.gradient,
          color: '#fff',
          height: '100%',
          position: 'relative',
          boxShadow: `0 12px 32px -12px ${style.shadow}`,
        }}
      >
        {isWinner && (
          <Chip
            icon={<EmojiEventsRounded sx={{ fontSize: 14, color: 'inherit' }} />}
            label="Stronger overall"
            size="small"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              bgcolor: 'rgba(255,255,255,0.22)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        )}
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ filter: 'brightness(1.2)' }}>
            <ScoreRing score={resume.scores.overall} size={120} strokeWidth={11} showLabel={false} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Chip
              icon={<DescriptionOutlined sx={{ fontSize: 13, color: 'inherit' }} />}
              label={resume.fileName}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, mb: 1, maxWidth: '100%' }}
            />
            <Typography variant="h4" fontWeight={800}>
              {resume.scores.overall}/100
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <VerifiedOutlined sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ATS {resume.scores.ats}/100
              </Typography>
            </Stack>
            <Chip
              label={getScoreLabel(resume.scores.overall)}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 600, mt: 0.75 }}
            />
          </Box>
        </Stack>
      </Card>
    );
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackRounded />} onClick={() => navigate('/compare')} sx={{ mb: 2 }}>
        Compare another pair
      </Button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }} flexWrap="wrap">
          <Chip
            icon={<DescriptionOutlined sx={{ fontSize: 14 }} />}
            label={resumeA.fileName}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<DescriptionOutlined sx={{ fontSize: 14 }} />}
            label={resumeB.fileName}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="caption" color="text.secondary">
            Compared {new Date(result.comparedAt).toLocaleString()}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          Comparison Results
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
          {winnerSide
            ? `${winnerSide.fileName} scores higher overall (${resumeA.scores.overall} vs ${resumeB.scores.overall}).`
            : `Both resumes score equally overall (${resumeA.scores.overall}/100).`}
        </Typography>
      </motion.div>

      {/* Hero: overall score per resume */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>{renderHeroCard('A', resumeA)}</Grid>
        <Grid size={{ xs: 12, md: 6 }}>{renderHeroCard('B', resumeB)}</Grid>
      </Grid>

      {/* Full score breakdown table */}
      <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Score breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Every metric, compared side by side.
        </Typography>
        <ComparisonScoreTable metrics={scoreMetrics} nameA={resumeA.fileName} nameB={resumeB.fileName} />
      </Card>

      <ComparisonListCard
        icon={<PsychologyOutlined />}
        title="Skills"
        nameA={resumeA.fileName}
        nameB={resumeB.fileName}
        itemsA={resumeA.skills}
        itemsB={resumeB.skills}
        chipColor="primary"
        emptyLabel="No skills detected."
      />

      <ComparisonListCard
        icon={<WorkOutline />}
        title="Experience"
        nameA={resumeA.fileName}
        nameB={resumeB.fileName}
        itemsA={resumeA.experience}
        itemsB={resumeB.experience}
        chipColor="primary"
        emptyLabel="No experience listed."
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ComparisonListCard
            icon={<SchoolOutlined />}
            title="Education"
            nameA={resumeA.fileName}
            nameB={resumeB.fileName}
            itemsA={resumeA.education}
            itemsB={resumeB.education}
            chipColor="secondary"
            emptyLabel="No education listed."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ComparisonListCard
            icon={<WorkspacePremiumOutlined />}
            title="Certifications"
            nameA={resumeA.fileName}
            nameB={resumeB.fileName}
            itemsA={resumeA.certifications}
            itemsB={resumeB.certifications}
            chipColor="secondary"
            emptyLabel="No certifications listed."
          />
        </Grid>
      </Grid>

      <ComparisonListCard
        icon={<FolderOutlined />}
        title="Projects"
        nameA={resumeA.fileName}
        nameB={resumeB.fileName}
        itemsA={resumeA.projects}
        itemsB={resumeB.projects}
        chipColor="primary"
        emptyLabel="No projects listed."
      />

      {/* Keywords */}
      <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Keyword analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Matched, missing and recommended keywords for each resume.
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip label={resumeA.fileName} size="small" color="primary" sx={{ fontWeight: 600, mb: 2 }} />
            <KeywordMatchList data={resumeA.keywordMatch} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Divider sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }} />
            <Chip label={resumeB.fileName} size="small" color="secondary" sx={{ fontWeight: 600, mb: 2 }} />
            <KeywordMatchList data={resumeB.keywordMatch} />
          </Grid>
        </Grid>
      </Card>

      <ComparisonListCard
        icon={<CancelOutlined />}
        title="Missing Skills"
        subtitle="Fewer missing skills is better — these are gaps against the target role."
        nameA={resumeA.fileName}
        nameB={resumeB.fileName}
        itemsA={resumeA.missingSkills}
        itemsB={resumeB.missingSkills}
        fewerIsBetter
        chipColor="warning"
        emptyLabel="No missing skills — great coverage!"
      />

      <ComparisonListCard
        icon={<CheckCircleOutline />}
        title="Strengths"
        nameA={resumeA.fileName}
        nameB={resumeB.fileName}
        itemsA={resumeA.strengths}
        itemsB={resumeB.strengths}
        chipColor="success"
        emptyLabel="No standout strengths detected."
      />

      <ComparisonListCard
        icon={<TrendingUpRounded />}
        title="Areas for Improvement"
        subtitle="Fewer flagged areas is better."
        nameA={resumeA.fileName}
        nameB={resumeB.fileName}
        itemsA={resumeA.areasForImprovement}
        itemsB={resumeB.areasForImprovement}
        fewerIsBetter
        chipColor="error"
        emptyLabel="No improvement areas flagged."
      />

      <Alert severity="info" icon={<VerifiedOutlined />} sx={{ borderRadius: 3 }}>
        Ready to act on this? Open the <strong>Resume Analyzer</strong> for a full deep-dive on either
        resume, or head to the <strong>Resume Builder</strong> to apply the fixes.
      </Alert>
    </Box>
  );
}
