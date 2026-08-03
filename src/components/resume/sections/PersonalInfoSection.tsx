import { Grid, Box } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { SectionCard } from '@/components/common/SectionCard';
import { FormTextField } from '@/components/form/FormTextField';
import { FileUploadField } from '@/components/form/FileUploadField';
import type { ResumeFormValues } from '@/validation/resumeSchema';

export function PersonalInfoSection() {
  const { control, setValue } = useFormContext<ResumeFormValues>();
  const profileImage = useWatch({ control, name: 'personalInfo.profileImage' });
  const fullName = useWatch({ control, name: 'personalInfo.fullName' });

  return (
    <SectionCard
      title="Personal Information"
      subtitle="Contact details recruiters use to reach you."
      icon={<PersonOutline fontSize="small" />}
    >
      <Box sx={{ mb: 2.5 }}>
        <FileUploadField
          value={profileImage}
          onChange={(v) => setValue('personalInfo.profileImage', v, { shouldDirty: true })}
          displayName={fullName ?? ''}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.fullName" label="Full Name" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.jobTitle" label="Job Title" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.email" label="Email" type="email" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.phone" label="Phone" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.location" label="Location" required />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.linkedin" label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.github" label="GitHub URL" placeholder="https://github.com/..." />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField name="personalInfo.portfolio" label="Portfolio URL" placeholder="https://..." />
        </Grid>
      </Grid>
    </SectionCard>
  );
}
