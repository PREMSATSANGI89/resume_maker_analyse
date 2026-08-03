import { Box, Typography, Avatar, Divider } from '@mui/material';
import {
  type TemplateProps,
  ContactRow,
  SECTION_RENDERERS,
  A4_SX,
} from './templateShared';
import { getInitials } from '@/utils/helpers';

const HEADING_STYLE = {
  color: '#1F2937',
  fontFamily: '"Georgia", "Times New Roman", serif',
  uppercase: true,
  underline: true,
};

/** Classic — traditional single-column, serif headings, maximally ATS-friendly. */
export function ClassicTemplate({ resume }: TemplateProps) {
  const { personalInfo } = resume;
  return (
    <Box id="resume-print-area" sx={{ ...A4_SX, p: '16mm', fontFamily: '"Georgia", serif' }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          src={personalInfo.profileImage ?? undefined}
          sx={{ width: 64, height: 64, mx: 'auto', mb: 1, bgcolor: '#1F2937' }}
        >
          {!personalInfo.profileImage && getInitials(personalInfo.fullName)}
        </Avatar>
        <Typography sx={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.03em' }}>
          {personalInfo.fullName || 'Your Name'}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1 }}>
          {personalInfo.jobTitle || 'Job Title'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ContactRow resume={resume} iconColor="#4B5563" />
        </Box>
      </Box>
      <Divider sx={{ mb: 2, borderColor: '#1F2937' }} />
      {resume.sectionOrder.map((key) => {
        const Renderer = SECTION_RENDERERS[key];
        return <Renderer key={key} resume={resume} style={HEADING_STYLE} />;
      })}
    </Box>
  );
}
