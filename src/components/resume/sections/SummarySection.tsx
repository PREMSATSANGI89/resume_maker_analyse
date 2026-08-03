import { AutoAwesomeOutlined } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SectionCard } from '@/components/common/SectionCard';
import { FormTextarea } from '@/components/form/FormTextarea';
import type { ResumeFormValues } from '@/validation/resumeSchema';

const AI_TEMPLATES = [
  'Results-driven professional with proven expertise in delivering scalable solutions, collaborating across teams, and turning ambiguous problems into shipped products. Passionate about clean architecture, mentorship, and measurable outcomes.',
  'Full-stack engineer with hands-on experience architecting resilient systems and leading agile teams. Blend deep technical skill with clear communication to bridge product intent and engineering execution.',
];

export function SummarySection() {
  const { setValue } = useFormContext<ResumeFormValues>();

  const generateSuggestion = () => {
    const suggestion = AI_TEMPLATES[Math.floor(Math.random() * AI_TEMPLATES.length)];
    setValue('summary', suggestion, { shouldDirty: true });
    toast.success('AI suggestion added — feel free to personalize it.');
  };

  return (
    <SectionCard
      title="Professional Summary"
      subtitle="A 2-3 sentence pitch at the top of your resume."
      icon={<AutoAwesomeOutlined fontSize="small" />}
      action={
        <Button size="small" startIcon={<AutoAwesomeOutlined />} onClick={generateSuggestion}>
          AI Suggest
        </Button>
      }
    >
      <Stack spacing={2}>
        <FormTextarea
          name="summary"
          label="Summary"
          minRows={4}
          maxLength={800}
          placeholder="e.g. Product-minded engineer with 5+ years building web platforms…"
        />
      </Stack>
    </SectionCard>
  );
}
