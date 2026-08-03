import { Button, Grid, IconButton, Stack, Box, Divider } from '@mui/material';
import { FolderOutlined, AddRounded, DeleteOutline } from '@mui/icons-material';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FormTextField } from '@/components/form/FormTextField';
import { FormTextarea } from '@/components/form/FormTextarea';
import { ChipInput } from '@/components/form/ChipInput';
import type { ResumeFormValues } from '@/validation/resumeSchema';

export function ProjectsSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });

  const addNew = () =>
    append({ id: uuid(), name: '', description: '', technologies: [], github: '', liveLink: '' });

  return (
    <SectionCard
      title="Projects"
      subtitle="Personal or professional projects worth showcasing."
      icon={<FolderOutlined fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<FolderOutlined fontSize="inherit" />}
          title="No projects added yet"
          description="Highlight side projects, open-source contributions, or portfolio work."
          actionLabel="Add project"
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
                  aria-label={`Remove project ${index + 1}`}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <FormTextField name={`projects.${index}.name`} label="Project Name" required />
                </Grid>
                <Grid size={12}>
                  <FormTextarea
                    name={`projects.${index}.description`}
                    label="Description"
                    minRows={2}
                    maxLength={400}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    control={control}
                    name={`projects.${index}.technologies`}
                    render={({ field: f }) => (
                      <ChipInput
                        label="Technologies"
                        value={f.value ?? []}
                        onChange={f.onChange}
                        placeholder="e.g. React, Node.js, PostgreSQL"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name={`projects.${index}.github`}
                    label="GitHub URL"
                    placeholder="https://github.com/..."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name={`projects.${index}.liveLink`}
                    label="Live Demo URL"
                    placeholder="https://..."
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
