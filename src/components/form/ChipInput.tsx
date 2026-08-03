import { useState, type KeyboardEvent } from 'react';
import { Box, Chip, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

interface ChipInputProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  helperText?: string;
  maxItems?: number;
}

/**
 * Generic "add/delete chip" input used for Skills, Interests, and Project technologies.
 * Not RHF-controller-bound directly (arrays of primitives are easiest to manage as local
 * state lifted to the parent) — callers pass `value`/`onChange` explicitly.
 */
export function ChipInput({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
  helperText,
  maxItems,
}: ChipInputProps) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setDraft('');
      return;
    }
    if (maxItems && value.length >= maxItems) return;
    onChange([...value, trimmed]);
    setDraft('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleDelete = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <TextField
        label={label}
        placeholder={placeholder}
        fullWidth
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        helperText={helperText ?? 'Press Enter or comma to add'}
        inputProps={{ 'aria-label': label }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        <AnimatePresence initial={false}>
          {value.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <Chip
                label={item}
                onDelete={() => handleDelete(index)}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
      {value.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          No items added yet.
        </Typography>
      )}
    </Box>
  );
}
