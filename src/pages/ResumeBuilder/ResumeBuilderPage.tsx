import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Collapse,
  Card,
  Alert,
} from '@mui/material';
import {
  UndoRounded,
  RedoRounded,
  DownloadRounded,
  PrintRounded,
  RestartAltRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  VisibilityOutlined,
  EditNoteOutlined,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { resumeSchema, type ResumeFormValues } from '@/validation/resumeSchema';
import { useResumeContext } from '@/context/ResumeContext';
import { useTemplates } from '@/hooks/queries/useTemplates';
import { useGenerateResume } from '@/hooks/queries/useGenerateResume';
import { useRecentResumes } from '@/hooks/useRecentResumes';
import { calculateResumeCompletion } from '@/utils/helpers';
import { TemplateSelector } from '@/components/resume/TemplateSelector';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { PersonalInfoSection } from '@/components/resume/sections/PersonalInfoSection';
import { SummarySection } from '@/components/resume/sections/SummarySection';
import { EducationSection } from '@/components/resume/sections/EducationSection';
import { ExperienceSection } from '@/components/resume/sections/ExperienceSection';
import { SkillsSection } from '@/components/resume/sections/SkillsSection';
import { ProjectsSection } from '@/components/resume/sections/ProjectsSection';
import {
  CertificatesSection,
  AchievementsSection,
  LanguagesSection,
  InterestsSection,
  ReferencesSection,
} from '@/components/resume/sections/OtherSections';
import type { TemplateId } from '@/types/resume.types';

type MobileView = 'form' | 'preview';

export default function ResumeBuilderPage() {
  const { resume, updateResume, setTemplate, undo, redo, canUndo, canRedo, resetResume } =
    useResumeContext();
  const { data: templates } = useTemplates();
  const generateMutation = useGenerateResume();
  const { trackResume } = useRecentResumes();
  const [mobileView, setMobileView] = useState<MobileView>('form');
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const skipNextSync = useRef(false);

  const methods = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume,
    mode: 'onBlur',
  });

  const { watch, reset } = methods;

  // Sync context → form when we do undo/redo/template switch/reset outside the form.
  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    reset(resume, { keepDirty: false });
  }, [resume, reset]);

  // Sync form → context on every change (throttled by RHF's watch subscription).
  useEffect(() => {
    const subscription = watch((values) => {
      skipNextSync.current = true;
      updateResume(values as ResumeFormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateResume]);

  // Track this resume in the "recent resumes" dashboard list on every meaningful edit.
  useEffect(() => {
    trackResume(resume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume.updatedAt]);

  const completion = useMemo(() => calculateResumeCompletion(resume), [resume]);

  const handleTemplateChange = (id: TemplateId) => {
    setTemplate(id);
    toast.success(`Switched to ${id.charAt(0).toUpperCase() + id.slice(1)} template.`);
  };

  const handleDownload = async () => {
    // In production this would call POST /resume/generate and download the returned PDF.
    // For the offline demo we fall back to the browser's native print-to-PDF.
    await generateMutation.mutateAsync(resume).catch(() => {
      // Toast already handled by mutation
    });
    window.print();
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    if (confirm('Reset your resume to a blank draft? This cannot be undone.')) {
      resetResume();
      toast.success('Draft reset.');
    }
  };

  return (
    <Box>
      {/* Toolbar */}
      <Card variant="outlined" sx={{ p: 2, mb: 2.5 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="h5" fontWeight={800}>
                Resume Builder
              </Typography>
              <Chip label="Auto-saving" size="small" color="success" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ minWidth: 180, flexGrow: 1, maxWidth: 320 }}>
                <LinearProgress
                  variant="determinate"
                  value={completion}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {completion}% complete
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Tooltip title="Undo (last change)">
              <span>
                <IconButton onClick={undo} disabled={!canUndo} aria-label="Undo">
                  <UndoRounded />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo">
              <span>
                <IconButton onClick={redo} disabled={!canRedo} aria-label="Redo">
                  <RedoRounded />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reset draft">
              <IconButton onClick={handleReset} aria-label="Reset">
                <RestartAltRounded />
              </IconButton>
            </Tooltip>
            <Button startIcon={<PrintRounded />} onClick={handlePrint} variant="outlined">
              Print
            </Button>
            <Button
              startIcon={<DownloadRounded />}
              onClick={handleDownload}
              variant="contained"
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? 'Preparing…' : 'Download PDF'}
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Template selector */}
      <Card variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5, cursor: 'pointer' }}
          onClick={() => setPreviewCollapsed((v) => !v)}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Templates
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Switch styles anytime — your content is preserved.
            </Typography>
          </Box>
          <IconButton aria-label={previewCollapsed ? 'Expand templates' : 'Collapse templates'}>
            {previewCollapsed ? <ExpandMoreRounded /> : <ExpandLessRounded />}
          </IconButton>
        </Stack>
        <Collapse in={!previewCollapsed}>
          <TemplateSelector
            templates={templates ?? []}
            activeTemplate={resume.templateId}
            onSelect={handleTemplateChange}
          />
        </Collapse>
      </Card>

      {/* Mobile-only view toggle */}
      <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={mobileView}
          exclusive
          onChange={(_, v) => v && setMobileView(v)}
          size="small"
        >
          <ToggleButton value="form">
            <EditNoteOutlined sx={{ mr: 0.5 }} fontSize="small" /> Edit
          </ToggleButton>
          <ToggleButton value="preview">
            <VisibilityOutlined sx={{ mr: 0.5 }} fontSize="small" /> Preview
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Split layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2.5,
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: { xs: mobileView === 'form' ? 'block' : 'none', lg: 'block' },
          }}
        >
          {generateMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Could not generate PDF. Print will still work.
            </Alert>
          )}
          <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()} noValidate>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <PersonalInfoSection />
                <SummarySection />
                <ExperienceSection />
                <EducationSection />
                <ProjectsSection />
                <SkillsSection />
                <CertificatesSection />
                <AchievementsSection />
                <LanguagesSection />
                <InterestsSection />
                <ReferencesSection />
              </motion.div>
            </form>
          </FormProvider>
        </Box>

        <Box
          sx={{
            display: { xs: mobileView === 'preview' ? 'block' : 'none', lg: 'block' },
            position: { lg: 'sticky' },
            top: { lg: 84 },
            maxHeight: { lg: 'calc(100vh - 100px)' },
            overflowY: { lg: 'auto' },
          }}
        >
          <Card variant="outlined" sx={{ p: 2, bgcolor: (t) => (t.palette.mode === 'light' ? '#F1F3F9' : '#0F1728') }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, px: 1 }}>
              Live Preview · A4
            </Typography>
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <ResumePreview resume={resume} scale={0.72} />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
