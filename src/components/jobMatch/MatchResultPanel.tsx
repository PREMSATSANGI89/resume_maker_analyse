import { Alert, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import {
  CancelOutlined,
  CheckCircleOutline,
  PsychologyOutlined,
  SchoolOutlined,
  TipsAndUpdatesOutlined,
  TuneRounded,
  WorkOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MatchScoreCard } from '@/components/jobMatch/MatchScoreCard';
import { MatchChipList } from '@/components/jobMatch/MatchChipList';
import { MatchCriteriaList } from '@/components/jobMatch/MatchCriteriaList';
import type { MatchResult } from '@/types/jobMatch.types';
import { MATCH_CATEGORY_META } from '@/utils/jobMatchHelpers';

interface MatchResultPanelProps {
  result: MatchResult;
}

function SectionCard({ title, subtitle, icon, children }: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: subtitle ? 0.5 : 2.5 }}>
        {icon}
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Card>
  );
}

/**
 * Renders the processed match. Every section is conditional: Affinda only returns some
 * criteria for some accounts and documents, and an absent field is never shown as a zero
 * or filled in with an assumption about the candidate.
 */
export function MatchResultPanel({ result }: MatchResultPanelProps) {
  const meta = MATCH_CATEGORY_META[result.category];
  const { skills, experience, education, keywords, criteria } = result;

  const hasSkillBreakdown = !!skills && (skills.matched.length > 0 || skills.missing.length > 0);
  const hasEducationBreakdown = !!education && (education.matched.length > 0 || education.missing.length > 0);

  return (
    <Stack spacing={3} component={motion.div} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <MatchScoreCard result={result} />

      <Alert severity={meta.color === 'success' ? 'success' : meta.color} sx={{ borderRadius: 3 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          {meta.title}
        </Typography>
        <Typography variant="body2">{meta.detail}</Typography>
      </Alert>

      {hasSkillBreakdown && (
        <SectionCard
          title="Skills"
          subtitle="Skills Affinda matched between this resume and the job description."
          icon={<PsychologyOutlined color="primary" />}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MatchChipList
                title="Matching Skills"
                icon={<CheckCircleOutline color="success" fontSize="small" />}
                items={skills.matched}
                color="success"
                emptyLabel="No skills from the job description were matched in this resume."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Divider sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }} />
              <MatchChipList
                title="Missing Skills"
                icon={<CancelOutlined color="error" fontSize="small" />}
                items={skills.missing}
                color="error"
                variant="outlined"
                emptyLabel="No required skills were reported as missing."
              />
            </Grid>
          </Grid>
        </SectionCard>
      )}

      <Grid container spacing={3}>
        {experience && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="Experience Match" icon={<WorkOutline color="primary" />}>
              <Stack spacing={1.5}>
                {experience.value && (
                  <Typography variant="h5" fontWeight={800}>
                    {experience.value}
                  </Typography>
                )}
                {experience.years !== null && (
                  <Typography variant="body2" color="text.secondary">
                    {experience.years} {experience.years === 1 ? 'year' : 'years'} of experience detected in the
                    resume.
                  </Typography>
                )}
                {experience.meetsRequirement !== null && (
                  <Chip
                    size="small"
                    color={experience.meetsRequirement ? 'success' : 'warning'}
                    variant={experience.meetsRequirement ? 'filled' : 'outlined'}
                    icon={
                      experience.meetsRequirement ? (
                        <CheckCircleOutline sx={{ fontSize: 14 }} />
                      ) : (
                        <CancelOutlined sx={{ fontSize: 14 }} />
                      )
                    }
                    label={
                      experience.meetsRequirement
                        ? "Meets the job's experience requirement"
                        : "Does not meet the job's experience requirement"
                    }
                    sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                  />
                )}
                {experience.score !== null && (
                  <Typography variant="caption" color="text.secondary">
                    Experience score: {experience.score}%
                  </Typography>
                )}
              </Stack>
            </SectionCard>
          </Grid>
        )}

        {education && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="Education Match" icon={<SchoolOutlined color="primary" />}>
              <Stack spacing={2}>
                {education.value && (
                  <Typography variant="subtitle1" fontWeight={700}>
                    {education.value}
                  </Typography>
                )}
                {hasEducationBreakdown && (
                  <>
                    <MatchChipList
                      title="Matching qualifications"
                      icon={<CheckCircleOutline color="success" fontSize="small" />}
                      items={education.matched}
                      color="success"
                      emptyLabel="No qualifications matched the job description."
                    />
                    <MatchChipList
                      title="Missing qualifications"
                      icon={<CancelOutlined color="error" fontSize="small" />}
                      items={education.missing}
                      color="error"
                      variant="outlined"
                      emptyLabel="No required qualifications were reported as missing."
                    />
                  </>
                )}
                {education.score !== null && (
                  <Typography variant="caption" color="text.secondary">
                    Education score: {education.score}%
                  </Typography>
                )}
              </Stack>
            </SectionCard>
          </Grid>
        )}
      </Grid>

      {keywords && (
        <SectionCard
          title="Keywords"
          subtitle="Keyword criteria evaluated against the resume text."
          icon={<TipsAndUpdatesOutlined color="primary" />}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MatchChipList
                title="Matched keywords"
                icon={<CheckCircleOutline color="success" fontSize="small" />}
                items={keywords.matched}
                color="success"
                emptyLabel="No keywords matched."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MatchChipList
                title="Missing keywords"
                icon={<CancelOutlined color="error" fontSize="small" />}
                items={keywords.missing}
                color="error"
                variant="outlined"
                emptyLabel="No keywords reported as missing."
              />
            </Grid>
          </Grid>
        </SectionCard>
      )}

      {criteria.length > 0 && (
        <SectionCard
          title="Other Matching Criteria"
          subtitle="Everything else Affinda compared between the resume and the job description."
          icon={<TuneRounded color="primary" />}
        >
          <MatchCriteriaList criteria={criteria} />
        </SectionCard>
      )}

      {!result.detailsAvailable && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Affinda returned the overall score and criteria for this match, but not the detailed
          matched/missing skills breakdown. Configure a resume search index
          (<strong>AFFINDA_RESUME_INDEX</strong>) on the backend to enable it.
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary">
        Matched {new Date(result.matchedAt).toLocaleString()} · Scores come directly from the Affinda
        Resume Search &amp; Match API.
      </Typography>
    </Stack>
  );
}
