import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';
import type { AnalyzerSuggestion } from '@/types/analyzer.types';

interface SuggestionsAccordionProps {
  suggestions: AnalyzerSuggestion[];
}

const SEVERITY_COLORS: Record<AnalyzerSuggestion['severity'], 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

export function SuggestionsAccordion({ suggestions }: SuggestionsAccordionProps) {
  const [expanded, setExpanded] = useState<string | false>(suggestions[0]?.id ?? false);

  if (suggestions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No suggestions — your resume looks great!
      </Typography>
    );
  }

  return (
    <Box>
      {suggestions.map((s) => (
        <Accordion
          key={s.id}
          expanded={expanded === s.id}
          onChange={(_, isExpanded) => setExpanded(isExpanded ? s.id : false)}
          disableGutters
          sx={{
            mb: 1,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&:before': { display: 'none' },
            boxShadow: 'none',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreRounded />}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
              <Chip
                label={s.severity}
                size="small"
                color={SEVERITY_COLORS[s.severity]}
                sx={{ textTransform: 'capitalize', fontWeight: 600, minWidth: 64 }}
              />
              <Typography fontWeight={600} sx={{ flexGrow: 1 }}>
                {s.title}
              </Typography>
              <Chip label={s.category} size="small" variant="outlined" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {s.detail}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
