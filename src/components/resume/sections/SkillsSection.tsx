import { Controller, useFormContext } from 'react-hook-form';
import { PsychologyAltOutlined } from '@mui/icons-material';
import { SectionCard } from '@/components/common/SectionCard';
import { ChipInput } from '@/components/form/ChipInput';
import type { ResumeFormValues } from '@/validation/resumeSchema';

export function SkillsSection() {
  const { control } = useFormContext<ResumeFormValues>();

  return (
    <SectionCard
      title="Skills"
      subtitle="Technologies, tools, and soft skills you're proficient in."
      icon={<PsychologyAltOutlined fontSize="small" />}
    >
      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <ChipInput
            label="Skills"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="e.g. TypeScript, React, System Design"
          />
        )}
      />
    </SectionCard>
  );
}
