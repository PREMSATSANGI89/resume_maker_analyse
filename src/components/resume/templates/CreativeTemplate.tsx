import { Box, Typography, Avatar, Stack } from '@mui/material';
import type { ReactElement } from 'react';
import {
  type TemplateProps,
  ContactRow,
  SkillsSection,
  LanguagesSection,
  InterestsSection,
  ReferencesSection,
  CertificatesSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  AchievementsSection,
  A4_SX,
} from './templateShared';
import { getInitials } from '@/utils/helpers';

const ACCENT = '#7C3AED';
const TEAL = '#14B8A6';

const MAIN_HEADING = { color: ACCENT, fontFamily: '"Sora", sans-serif', uppercase: true, size: '12px' };
const SIDE_HEADING = { color: '#fff', fontFamily: '"Sora", sans-serif', uppercase: true, size: '10.5px' };

const MAIN_MAP: Record<string, (p: { resume: TemplateProps['resume']; style: typeof MAIN_HEADING }) => ReactElement | null> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  achievements: AchievementsSection,
};

const SIDE_MAP: Record<string, (p: { resume: TemplateProps['resume']; style: typeof SIDE_HEADING }) => ReactElement | null> = {
  skills: (p) => <SkillsSection {...p} chipVariant accentColor="#fff" />,
  languages: LanguagesSection,
  interests: InterestsSection,
  certificates: CertificatesSection,
  references: ReferencesSection,
};

/** Creative — expressive gradient header + color-blocked sidebar for design/marketing roles. */
export function CreativeTemplate({ resume }: TemplateProps) {
  const { personalInfo } = resume;
  const mainKeys = resume.sectionOrder.filter((k) => MAIN_MAP[k]);
  const sideKeys = resume.sectionOrder.filter((k) => SIDE_MAP[k]);

  return (
    <Box id="resume-print-area" sx={{ ...A4_SX, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          background: `linear-gradient(120deg, ${ACCENT}, ${TEAL})`,
          color: '#fff',
          p: '10mm 12mm',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={personalInfo.profileImage ?? undefined}
            sx={{ width: 68, height: 68, bgcolor: 'rgba(255,255,255,0.25)', fontSize: 22 }}
          >
            {!personalInfo.profileImage && getInitials(personalInfo.fullName)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Sora", sans-serif' }}>
              {personalInfo.fullName || 'Your Name'}
            </Typography>
            <Typography sx={{ fontSize: '13px', opacity: 0.92 }}>
              {personalInfo.jobTitle || 'Job Title'}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ mt: 1.5 }}>
          <ContactRow resume={resume} iconColor="#fff" />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ width: '64%', p: '8mm 8mm' }}>
          {mainKeys.map((key) => {
            const Renderer = MAIN_MAP[key];
            return Renderer ? <Renderer key={key} resume={resume} style={MAIN_HEADING} /> : null;
          })}
        </Box>
        <Box sx={{ width: '36%', bgcolor: '#1F2937', color: '#fff', p: '8mm 7mm' }}>
          {sideKeys.map((key) => {
            const Renderer = SIDE_MAP[key];
            return Renderer ? <Renderer key={key} resume={resume} style={SIDE_HEADING} /> : null;
          })}
        </Box>
      </Box>
    </Box>
  );
}
