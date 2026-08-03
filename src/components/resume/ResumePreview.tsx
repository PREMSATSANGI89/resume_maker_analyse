import { Box } from '@mui/material';
import type { ResumeData } from '@/types/resume.types';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';

const TEMPLATE_MAP = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  creative: CreativeTemplate,
};

interface ResumePreviewProps {
  resume: ResumeData;
  scale?: number;
}

/** Renders the live A4 resume preview using whichever template is currently selected. */
export function ResumePreview({ resume, scale = 1 }: ResumePreviewProps) {
  const Template = TEMPLATE_MAP[resume.templateId] ?? ModernTemplate;

  return (
    <Box
      sx={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease',
      }}
    >
      <Template resume={resume} />
    </Box>
  );
}
