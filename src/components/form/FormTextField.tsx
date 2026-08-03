import { Controller, useFormContext } from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

interface FormTextFieldProps extends Omit<TextFieldProps, 'name' | 'error'> {
  name: string;
  helperTextOnError?: boolean;
}

/**
 * A TextField pre-wired to React Hook Form context.
 * Automatically surfaces validation errors from the Zod resolver.
 */
export function FormTextField({ name, helperTextOnError = true, ...rest }: FormTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          value={field.value ?? ''}
          fullWidth
          error={!!fieldState.error}
          helperText={helperTextOnError ? fieldState.error?.message : rest.helperText}
          aria-invalid={!!fieldState.error}
          aria-describedby={fieldState.error ? `${name}-error` : undefined}
        />
      )}
    />
  );
}
