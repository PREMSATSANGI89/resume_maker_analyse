import { Box, Grid, Typography, Stack, Card, Button, Chip, Avatar } from '@mui/material';
import {
  DescriptionOutlined,
  InsightsOutlined,
  HistoryOutlined,
  StarBorderRounded,
  VerifiedOutlined,
  ViewQuiltOutlined,
  ArrowForwardRounded,
  AutoAwesome,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GradientCard } from '@/components/common/GradientCard';
import { StatCard } from '@/components/common/StatCard';
import { ScoreRing } from '@/components/common/ScoreRing';
import { SkeletonGrid } from '@/components/common/SkeletonCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useTemplates } from '@/hooks/queries/useTemplates';
import { useRecentResumes } from '@/hooks/useRecentResumes';
import { useResumeContext } from '@/context/ResumeContext';
import { calculateResumeCompletion, getInitials } from '@/utils/helpers';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: templates, isLoading: templatesLoading } = useTemplates();
  const { recent } = useRecentResumes();
  const { resume } = useResumeContext();
  const completion = calculateResumeCompletion(resume);

  // Dashboard stats — mocked but derived from real user state where possible.
  const stats = [
    {
      label: 'Resumes Created',
      value: recent.length || 1,
      icon: <DescriptionOutlined />,
      accentColor: '#3B5BFD',
    },
    {
      label: 'Average ATS Score',
      value: '82',
      icon: <VerifiedOutlined />,
      accentColor: '#14B8A6',
      trend: { value: '4 pts this week', positive: true },
    },
    {
      label: 'Analyses Run',
      value: 12,
      icon: <InsightsOutlined />,
      accentColor: '#F59E0B',
    },
    {
      label: 'Draft Completion',
      value: `${completion}%`,
      icon: <StarBorderRounded />,
      accentColor: '#7C3AED',
    },
  ];

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Chip
            size="small"
            icon={<AutoAwesome sx={{ fontSize: 14 }} />}
            label="AI-powered"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          Build resumes recruiters actually read.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 620 }}>
          Craft a resume from scratch or drop in an existing one for an instant ATS + AI review.
        </Typography>
      </motion.div>

      {/* Primary module cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GradientCard
            title="Resume Builder"
            description="Compose a polished, ATS-safe resume with live preview and 5 professional templates."
            icon={<DescriptionOutlined sx={{ fontSize: 26 }} />}
            gradient="linear-gradient(135deg, #3B5BFD 0%, #6E85FF 100%)"
            to="/builder"
            tag="Live preview"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GradientCard
            title="Resume Analyzer"
            description="Upload a PDF or DOCX and get scored on ATS, keywords, grammar, and structure in seconds."
            icon={<InsightsOutlined sx={{ fontSize: 26 }} />}
            gradient="linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)"
            to="/analyzer"
            tag="AI feedback"
          />
        </Grid>
      </Grid>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Resume Score card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Resume Score
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Current draft
                </Typography>
              </Box>
              <StarBorderRounded color="warning" />
            </Stack>
            <Stack alignItems="center" spacing={1.5}>
              <ScoreRing score={Math.max(completion, 45)} size={140} strokeWidth={12} label="of 100" />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Complete more sections to boost your score.
              </Typography>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForwardRounded />}
                onClick={() => navigate('/builder')}
                fullWidth
              >
                Improve draft
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* ATS Compatibility card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  ATS Compatibility
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Last analysis
                </Typography>
              </Box>
              <VerifiedOutlined color="success" />
            </Stack>
            <Stack alignItems="center" spacing={1.5}>
              <ScoreRing score={82} size={140} strokeWidth={12} label="ATS score" />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Strong keyword coverage. Consider tightening formatting.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardRounded />}
                onClick={() => navigate('/analyzer')}
                fullWidth
              >
                Run new analysis
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* Recent Resumes */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Recent Resumes
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Continue where you left off
                </Typography>
              </Box>
              <HistoryOutlined color="primary" />
            </Stack>
            {recent.length === 0 ? (
              <EmptyState
                icon={<DescriptionOutlined fontSize="inherit" />}
                title="No resumes yet"
                description="Your recent resumes will show up here."
                actionLabel="Create one"
                onAction={() => navigate('/builder')}
              />
            ) : (
              <Stack spacing={1.5}>
                {recent.slice(0, 4).map((r) => (
                  <Stack
                    key={r.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate('/builder')}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>
                      {getInitials(r.fullName)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {r.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {r.jobTitle} · {r.completion}% complete
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Templates grid */}
      <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ViewQuiltOutlined color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Templates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Five distinct layouts — all mobile-friendly and ATS-tested.
              </Typography>
            </Box>
          </Stack>
          <Button endIcon={<ArrowForwardRounded />} onClick={() => navigate('/builder')}>
            Open builder
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {templatesLoading ? (
            <>
              <Grid size={{ xs: 6, md: 3 }}>
                <SkeletonGrid count={1} height={180} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <SkeletonGrid count={1} height={180} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <SkeletonGrid count={1} height={180} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <SkeletonGrid count={1} height={180} />
              </Grid>
            </>
          ) : (
            (templates ?? []).map((t) => (
              <Grid key={t.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-3px)', borderColor: 'primary.main' },
                  }}
                  onClick={() => navigate('/builder')}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {t.name}
                    </Typography>
                    {t.isPremium && <Chip label="Pro" size="small" color="warning" />}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {t.description}
                  </Typography>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Card>
    </Box>
  );
}
