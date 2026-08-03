import {
  Button,
  Grid,
  IconButton,
  Stack,
  Box,
  Divider,
} from '@mui/material';
import {
  WorkspacePremiumOutlined,
  EmojiEventsOutlined,
  TranslateOutlined,
  InterestsOutlined,
  ContactPhoneOutlined,
  AddRounded,
  DeleteOutline,
} from '@mui/icons-material';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FormTextField } from '@/components/form/FormTextField';
import { FormSelect } from '@/components/form/FormSelect';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { ChipInput } from '@/components/form/ChipInput';
import { LANGUAGE_PROFICIENCIES } from '@/utils/constants';
import type { ResumeFormValues } from '@/validation/resumeSchema';

/* ─────────────────  CERTIFICATES  ───────────────── */

export function CertificatesSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'certificates' });
  const addNew = () => append({ id: uuid(), name: '', issuer: '', date: '' });

  return (
    <SectionCard
      title="Certificates"
      subtitle="Professional certifications and courses."
      icon={<WorkspacePremiumOutlined fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<WorkspacePremiumOutlined fontSize="inherit" />}
          title="No certificates yet"
          description="Add courses, credentials, or professional certifications."
          actionLabel="Add certificate"
          onAction={addNew}
        />
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <IconButton size="small" color="error" onClick={() => remove(index)}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name={`certificates.${index}.name`} label="Certificate Name" required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name={`certificates.${index}.issuer`} label="Issuing Body" required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormDatePicker name={`certificates.${index}.date`} label="Issue Date" />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}

/* ─────────────────  ACHIEVEMENTS  ───────────────── */

export function AchievementsSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'achievements' });
  const addNew = () => append({ id: uuid(), title: '', description: '' });

  return (
    <SectionCard
      title="Achievements"
      subtitle="Awards, recognitions, and standout wins."
      icon={<EmojiEventsOutlined fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<EmojiEventsOutlined fontSize="inherit" />}
          title="No achievements yet"
          description="Add awards, competition wins, or notable recognitions."
          actionLabel="Add achievement"
          onAction={addNew}
        />
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <IconButton size="small" color="error" onClick={() => remove(index)}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <FormTextField name={`achievements.${index}.title`} label="Title" required />
                </Grid>
                <Grid size={12}>
                  <FormTextField
                    name={`achievements.${index}.description`}
                    label="Description"
                    multiline
                    minRows={2}
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

/* ─────────────────  LANGUAGES  ───────────────── */

export function LanguagesSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'languages' });
  const addNew = () => append({ id: uuid(), name: '', proficiency: 'Conversational' });

  return (
    <SectionCard
      title="Languages"
      subtitle="Languages you speak and your proficiency level."
      icon={<TranslateOutlined fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<TranslateOutlined fontSize="inherit" />}
          title="No languages yet"
          description="Add any languages you speak."
          actionLabel="Add language"
          onAction={addNew}
        />
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <FormTextField name={`languages.${index}.name`} label="Language" required />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <FormSelect
                    name={`languages.${index}.proficiency`}
                    label="Proficiency"
                    options={LANGUAGE_PROFICIENCIES}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <IconButton size="small" color="error" onClick={() => remove(index)}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}

/* ─────────────────  INTERESTS  ───────────────── */

export function InterestsSection() {
  const { control } = useFormContext<ResumeFormValues>();

  return (
    <SectionCard
      title="Interests"
      subtitle="Hobbies and personal interests."
      icon={<InterestsOutlined fontSize="small" />}
    >
      <Controller
        control={control}
        name="interests"
        render={({ field }) => (
          <ChipInput
            label="Interests"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="e.g. Photography, Chess, Trail running"
          />
        )}
      />
    </SectionCard>
  );
}

/* ─────────────────  REFERENCES  ───────────────── */

export function ReferencesSection() {
  const { control } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'references' });
  const addNew = () => append({ id: uuid(), name: '', relation: '', contact: '' });

  return (
    <SectionCard
      title="References"
      subtitle="People who can speak to your work."
      icon={<ContactPhoneOutlined fontSize="small" />}
      badge={fields.length}
      action={
        <Button startIcon={<AddRounded />} onClick={addNew} variant="contained" size="small">
          Add
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={<ContactPhoneOutlined fontSize="inherit" />}
          title="No references yet"
          description="Add colleagues, mentors, or managers who can vouch for you."
          actionLabel="Add reference"
          onAction={addNew}
        />
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <IconButton size="small" color="error" onClick={() => remove(index)}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField name={`references.${index}.name`} label="Name" required />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField name={`references.${index}.relation`} label="Relationship" required />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField name={`references.${index}.contact`} label="Contact" required />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
