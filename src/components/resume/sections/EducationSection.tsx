import { Button, Grid, IconButton, Stack, Box, Divider } from '@mui/material';
import { SchoolOutlined, AddRounded, DeleteOutline } from '@mui/icons-material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FormTextField } from '@/components/form/FormTextField';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import type { ResumeFormValues } from '@/validation/resumeSchema';

export function EducationSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  const addNew = () =>
    append({ id: uuid(), college: '', degree: '', branch: '', cgpa: '', startDate: '', endDate: '' });

  return (
    <SectionCard
      title="Education"
      subtitle="Your academic history, most recent first."
      icon={<SchoolOutlined fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<SchoolOutlined fontSize="inherit" />}
          title="No education added yet"
          description="Add a college, degree, and dates to get started."
          actionLabel="Add education"
          onAction={addNew}
        />
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                  aria-label={`Remove education entry ${index + 1}`}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name={`education.${index}.college`} label="College / University" required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name={`education.${index}.degree`} label="Degree" required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name={`education.${index}.branch`} label="Branch / Major" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name={`education.${index}.cgpa`} label="CGPA / GPA" placeholder="8.5 / 10" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormDatePicker name={`education.${index}.startDate`} label="Start Date" required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormDatePicker name={`education.${index}.endDate`} label="End Date" required />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
