import { Controller, useFormContext } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

interface FormDatePickerProps extends Omit<TextFieldProps, 'name' | 'error' | 'type'> {
  name: string;
}

/**
 * Month/year picker for education & experience date ranges.
 * Uses a native `type="month"` input for the best cross-browser accessibility
 * and mobile keyboard support without pulling in a heavy date-picker dependency.
 */
export function FormDatePicker({ name, ...rest }: FormDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          type="month"
          fullWidth
          value={field.value ?? ''}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      )}
    />
  );
}
