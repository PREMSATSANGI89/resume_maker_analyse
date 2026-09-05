import { Box, Stack, TextField, Typography } from '@mui/material';
import { JOB_DESCRIPTION_LIMITS } from '@/utils/constants';
import { countWords } from '@/utils/jobMatchHelpers';

interface JobDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Large paste-target for the job description, with the same character-counter treatment
 * the builder's Summary field uses.
 */
export function JobDescriptionField({ value, onChange, disabled = false }: JobDescriptionFieldProps) {
  const { MIN_CHARS, MAX_CHARS } = JOB_DESCRIPTION_LIMITS;
  const trimmedLength = value.trim().length;
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_CHARS;

  return (
    <Box>
      <TextField
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        multiline
        minRows={12}
        maxRows={24}
        fullWidth
        placeholder="Paste the complete job description here — responsibilities, requirements, skills, qualifications…"
        error={tooShort}
        helperText={tooShort ? `Add at least ${MIN_CHARS} characters so we can match it properly.` : ' '}
        slotProps={{ htmlInput: { maxLength: MAX_CHARS, 'aria-label': 'Job description' } }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: -1.5 }}>
        <Typography variant="caption" color="text.secondary">
          {countWords(value).toLocaleString()} words
        </Typography>
        <Typography
          variant="caption"
          color={value.length >= MAX_CHARS ? 'error.main' : 'text.secondary'}
        >
          {value.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
        </Typography>
      </Stack>
    </Box>
  );
}
