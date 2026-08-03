import { Button, Grid, IconButton, Stack, Box, Divider, FormControlLabel, Checkbox } from '@mui/material';
import { WorkOutline, AddRounded, DeleteOutline } from '@mui/icons-material';
import { useFieldArray, useFormContext, Controller, useWatch } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FormTextField } from '@/components/form/FormTextField';
import { FormSelect } from '@/components/form/FormSelect';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { ChipInput } from '@/components/form/ChipInput';
import { EMPLOYMENT_TYPES } from '@/utils/constants';
import type { ResumeFormValues } from '@/validation/resumeSchema';

/** One repeatable experience entry — extracted so we can watch `isCurrent` per-item. */
function ExperienceItem({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control, setValue } = useFormContext<ResumeFormValues>();
  const isCurrent = useWatch({ control, name: `experience.${index}.isCurrent` });

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <IconButton
          size="small"
          color="error"
          onClick={onRemove}
          aria-label={`Remove experience entry ${index + 1}`}
        >
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name={`experience.${index}.company`} label="Company" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name={`experience.${index}.designation`} label="Designation" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormSelect
            name={`experience.${index}.employmentType`}
            label="Employment Type"
            options={EMPLOYMENT_TYPES}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name={`experience.${index}.isCurrent`}
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue(`experience.${index}.endDate`, '', { shouldDirty: true });
                      }
                    }}
                  />
                )}
              />
            }
            label="I currently work here"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDatePicker name={`experience.${index}.startDate`} label="Start Date" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDatePicker
            name={`experience.${index}.endDate`}
            label="End Date"
            disabled={isCurrent}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            control={control}
            name={`experience.${index}.responsibilities`}
            render={({ field }) => (
              <ChipInput
                label="Responsibilities / Achievements"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Press Enter to add each bullet point"
                helperText="Add one bullet at a time. Start with a strong action verb."
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function ExperienceSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

  const addNew = () =>
    append({
      id: uuid(),
      company: '',
      designation: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      responsibilities: [],
    });

  return (
    <SectionCard
      title="Work Experience"
      subtitle="Roles, achievements, and responsibilities."
      icon={<WorkOutline fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<WorkOutline fontSize="inherit" />}
          title="No experience added yet"
          description="Start with your most recent role."
          actionLabel="Add experience"
          onAction={addNew}
        />
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <ExperienceItem index={index} onRemove={() => remove(index)} />
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
