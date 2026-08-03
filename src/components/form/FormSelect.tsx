import { Controller, useFormContext } from 'react-hook-form';
import { TextField, MenuItem, type TextFieldProps } from '@mui/material';

interface FormSelectProps extends Omit<TextFieldProps, 'name' | 'select' | 'error'> {
  name: string;
  options: readonly string[];
}

/** Reusable dropdown select wired to React Hook Form, built on MUI's TextField `select` mode. */
export function FormSelect({ name, options, ...rest }: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          select
          fullWidth
          value={field.value ?? ''}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
