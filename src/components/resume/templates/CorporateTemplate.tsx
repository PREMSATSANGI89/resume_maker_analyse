import { Box, Typography, Stack } from '@mui/material';
import { type TemplateProps, ContactRow, SECTION_RENDERERS, A4_SX } from './templateShared';

const NAVY = '#0F2A5C';

const HEADING_STYLE = {
  color: NAVY,
  fontFamily: '"Sora", sans-serif',
  uppercase: true,
  size: '11.5px',
};

/** Corporate — structured, formal layout with navy rule lines, suited for finance & law. */
export function CorporateTemplate({ resume }: TemplateProps) {
  const { personalInfo } = resume;
  return (
    <Box id="resume-print-area" sx={{ ...A4_SX, fontFamily: '"Inter", sans-serif' }}>
      <Box sx={{ bgcolor: NAVY, color: '#fff', p: '10mm 14mm 6mm' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap">
          <Box>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, fontFamily: '"Sora", sans-serif' }}>
              {personalInfo.fullName || 'Your Name'}
            </Typography>
            <Typography sx={{ fontSize: '12px', opacity: 0.85 }}>
              {personalInfo.jobTitle || 'Job Title'}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Box sx={{ p: '4mm 14mm', borderBottom: `3px solid ${NAVY}` }}>
        <ContactRow resume={resume} iconColor={NAVY} />
      </Box>
      <Box sx={{ p: '6mm 14mm 12mm' }}>
        {resume.sectionOrder.map((key) => {
          const Renderer = SECTION_RENDERERS[key];
          return <Renderer key={key} resume={resume} style={HEADING_STYLE} />;
        })}
      </Box>
    </Box>
  );
}
