import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Box, Typography, type TextFieldProps } from '@mui/material';

interface FormTextareaProps extends Omit<TextFieldProps, 'name' | 'error'> {
  name: string;
  maxLength?: number;
  minRows?: number;
}

/** Multiline textarea with an optional live character counter (used for the Summary section). */
export function FormTextarea({ name, maxLength, minRows = 4, ...rest }: FormTextareaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box>
          <TextField
            {...field}
            {...rest}
            value={field.value ?? ''}
            multiline
            minRows={minRows}
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { maxLength } }}
          />
          {maxLength && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
            >
              {(field.value ?? '').length}/{maxLength}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}
