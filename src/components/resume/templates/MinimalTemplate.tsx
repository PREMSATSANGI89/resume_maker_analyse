import { Box, Typography } from '@mui/material';
import { type TemplateProps, ContactRow, SECTION_RENDERERS, A4_SX } from './templateShared';

const HEADING_STYLE = {
  color: '#111827',
  fontFamily: '"Inter", sans-serif',
  uppercase: true,
  size: '10.5px',
};

/** Minimal — generous whitespace, no color, precision typography, content-first. */
export function MinimalTemplate({ resume }: TemplateProps) {
  const { personalInfo } = resume;
  return (
    <Box id="resume-print-area" sx={{ ...A4_SX, p: '18mm', fontFamily: '"Inter", sans-serif' }}>
      <Typography sx={{ fontSize: '24px', fontWeight: 300, letterSpacing: '0.02em', mb: 0.25 }}>
        {personalInfo.fullName || 'Your Name'}
      </Typography>
      <Typography sx={{ fontSize: '12px', color: '#6B7280', mb: 1.5 }}>
        {personalInfo.jobTitle || 'Job Title'}
      </Typography>
      <ContactRow resume={resume} iconColor="#6B7280" />
      <Box sx={{ height: '1px', bgcolor: '#E5E7EB', my: 2.5 }} />
      {resume.sectionOrder.map((key) => {
        const Renderer = SECTION_RENDERERS[key];
        return <Renderer key={key} resume={resume} style={HEADING_STYLE} />;
      })}
    </Box>
  );
}
