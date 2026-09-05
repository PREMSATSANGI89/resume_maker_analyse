import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import { CheckRounded } from '@mui/icons-material';
import { ResumeDropzone } from '@/components/analyzer/ResumeDropzone';

interface ComparisonUploadCardProps {
  label: string;
  accentColor: string;
  file: File | null;
  uploadProgress: number;
  isBusy: boolean;
  onFileSelected: (file: File) => void;
  onReset: () => void;
}

/** Labeled upload slot used for one side (Resume 1 / Resume 2) of the comparison flow. */
export function ComparisonUploadCard({
  label,
  accentColor,
  file,
  uploadProgress,
  isBusy,
  onFileSelected,
  onReset,
}: ComparisonUploadCardProps) {
  return (
    <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, height: '100%' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: accentColor,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {label.slice(-1)}
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        {file && !isBusy && (
          <Chip
            icon={<CheckRounded sx={{ fontSize: 14 }} />}
            label="Ready"
            size="small"
            color="success"
            variant="outlined"
          />
        )}
      </Stack>
      <ResumeDropzone
        onFileSelected={onFileSelected}
        uploadProgress={uploadProgress}
        isBusy={isBusy}
        onReset={onReset}
      />
    </Card>
  );
}
