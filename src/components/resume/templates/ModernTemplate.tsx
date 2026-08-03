import { Box, Typography, Avatar, Stack } from '@mui/material';
import type { ReactElement } from 'react';
import { Email, Phone, Room, LinkedIn, GitHub, Language } from '@mui/icons-material';
import {
  type TemplateProps,
  SkillsSection,
  LanguagesSection,
  InterestsSection,
  CertificatesSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  AchievementsSection,
  ReferencesSection,
  A4_SX,
} from './templateShared';
import { getInitials } from '@/utils/helpers';

const ACCENT = '#3B5BFD';

const SIDEBAR_HEADING = {
  color: '#fff',
  fontFamily: '"Sora", sans-serif',
  uppercase: true,
  size: '11px',
};
const MAIN_HEADING = { color: ACCENT, fontFamily: '"Sora", sans-serif', uppercase: true, underline: true };

const SIDEBAR_MAP: Record<string, (p: { resume: TemplateProps['resume']; style: typeof SIDEBAR_HEADING }) => ReactElement | null> = {
  skills: (p) => <SkillsSection {...p} chipVariant accentColor="#fff" />,
  languages: LanguagesSection,
  certificates: CertificatesSection,
  interests: InterestsSection,
};

const MAIN_MAP: Record<string, (p: { resume: TemplateProps['resume']; style: typeof MAIN_HEADING }) => ReactElement | null> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  achievements: AchievementsSection,
  references: ReferencesSection,
};

/** Modern — bold accent sidebar with photo & contact, ideal for tech/design roles. */
export function ModernTemplate({ resume }: TemplateProps) {
  const { personalInfo } = resume;
  const sidebarKeys = resume.sectionOrder.filter((k) => SIDEBAR_MAP[k]);
  const mainKeys = resume.sectionOrder.filter((k) => MAIN_MAP[k]);

  const contactItems = [
    { icon: <Email sx={{ fontSize: 12 }} />, value: personalInfo.email },
    { icon: <Phone sx={{ fontSize: 12 }} />, value: personalInfo.phone },
    { icon: <Room sx={{ fontSize: 12 }} />, value: personalInfo.location },
    { icon: <LinkedIn sx={{ fontSize: 12 }} />, value: personalInfo.linkedin?.replace(/^https?:\/\//, '') },
    { icon: <GitHub sx={{ fontSize: 12 }} />, value: personalInfo.github?.replace(/^https?:\/\//, '') },
    { icon: <Language sx={{ fontSize: 12 }} />, value: personalInfo.portfolio?.replace(/^https?:\/\//, '') },
  ].filter((i) => i.value);

  return (
    <Box id="resume-print-area" sx={{ ...A4_SX, display: 'flex' }}>
      <Box sx={{ width: '34%', bgcolor: '#111827', color: '#fff', p: '10mm 7mm' }}>
        <Avatar
          src={personalInfo.profileImage ?? undefined}
          sx={{ width: 76, height: 76, mx: 'auto', mb: 1.5, bgcolor: ACCENT, fontSize: 24 }}
        >
          {!personalInfo.profileImage && getInitials(personalInfo.fullName)}
        </Avatar>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, textAlign: 'center', fontFamily: '"Sora", sans-serif' }}>
          {personalInfo.fullName || 'Your Name'}
        </Typography>
        <Typography sx={{ fontSize: '10.5px', textAlign: 'center', color: ACCENT, mb: 2, fontWeight: 600 }}>
          {personalInfo.jobTitle || 'Job Title'}
        </Typography>
        <Stack spacing={0.75} sx={{ mb: 2.5 }}>
          {contactItems.map((item, i) => (
            <Stack key={i} direction="row" spacing={0.75} alignItems="center">
              {item.icon}
              <Typography sx={{ fontSize: '9.5px', wordBreak: 'break-all' }}>{item.value}</Typography>
            </Stack>
          ))}
        </Stack>
        {sidebarKeys.map((key) => {
          const Renderer = SIDEBAR_MAP[key];
          return Renderer ? <Renderer key={key} resume={resume} style={SIDEBAR_HEADING} /> : null;
        })}
      </Box>
      <Box sx={{ width: '66%', p: '10mm 8mm', color: '#1a1a1a' }}>
        {mainKeys.map((key) => {
          const Renderer = MAIN_MAP[key];
          return Renderer ? <Renderer key={key} resume={resume} style={MAIN_HEADING} /> : null;
        })}
      </Box>
    </Box>
  );
}
