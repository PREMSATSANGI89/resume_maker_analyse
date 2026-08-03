import { Box, Card, Stack, Typography, Chip } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ResumeTemplateMeta, TemplateId } from '@/types/resume.types';

interface TemplateSelectorProps {
  templates: ResumeTemplateMeta[];
  activeTemplate: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const TEMPLATE_PREVIEWS: Record<TemplateId, { primary: string; secondary: string; layout: 'stack' | 'sidebar' | 'header' }> = {
  classic: { primary: '#1F2937', secondary: '#F3F4F6', layout: 'stack' },
  modern: { primary: '#3B5BFD', secondary: '#111827', layout: 'sidebar' },
  minimal: { primary: '#111827', secondary: '#FFFFFF', layout: 'stack' },
  corporate: { primary: '#0F2A5C', secondary: '#F3F4F6', layout: 'header' },
  creative: { primary: '#7C3AED', secondary: '#14B8A6', layout: 'sidebar' },
};

/** Miniature preview thumbnail drawn with SVG — avoids shipping large PNG assets. */
function TemplateThumbnail({ id }: { id: TemplateId }) {
  const style = TEMPLATE_PREVIEWS[id];
  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '210 / 297',
        bgcolor: '#fff',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid rgba(15,23,42,0.08)',
        position: 'relative',
      }}
    >
      {style.layout === 'sidebar' && (
        <>
          <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '34%', bgcolor: style.secondary }} />
          <Box sx={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderRadius: '50%', bgcolor: style.primary }} />
        </>
      )}
      {style.layout === 'header' && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 34, bgcolor: style.primary }} />
      )}
      {style.layout === 'stack' && (
        <Box sx={{ position: 'absolute', top: 10, left: 12, right: 12, height: 3, borderRadius: 2, bgcolor: style.primary }} />
      )}
      {[0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85].map((frac, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: style.layout === 'sidebar' ? '38%' : '12%',
            right: '12%',
            top: `${20 + i * 8}%`,
            height: 2,
            borderRadius: 1,
            bgcolor: i % 3 === 0 ? style.primary : 'rgba(15,23,42,0.14)',
            width: i % 3 === 0 ? '35%' : '70%',
          }}
        />
      ))}
    </Box>
  );
}

const MotionCard = motion(Card);

export function TemplateSelector({ templates, activeTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          md: 'repeat(5, minmax(0, 1fr))',
        },
      }}
    >
      {templates.map((t) => {
        const active = t.id === activeTemplate;
        return (
          <MotionCard
            key={t.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(t.id)}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`Select ${t.name} template`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(t.id);
            }}
            sx={{
              p: 1.25,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: active ? 'primary.main' : 'divider',
              position: 'relative',
              outline: 'none',
              '&:focus-visible': { boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}30` },
            }}
          >
            <TemplateThumbnail id={t.id} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {t.name}
              </Typography>
              {t.isPremium && <Chip label="Pro" size="small" color="warning" sx={{ height: 18, fontSize: 10 }} />}
            </Stack>
            {active && (
              <CheckCircleRounded
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'primary.main',
                  bgcolor: '#fff',
                  borderRadius: '50%',
                }}
              />
            )}
          </MotionCard>
        );
      })}
    </Box>
  );
}
