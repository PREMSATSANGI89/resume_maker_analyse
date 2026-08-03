import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { Box, Typography, Stack, LinearProgress, Button, Chip } from '@mui/material';
import { CloudUploadOutlined, PictureAsPdfOutlined, DescriptionOutlined, DeleteOutline } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ACCEPTED_RESUME_FILE_TYPES, MAX_UPLOAD_SIZE_MB } from '@/utils/constants';
import { formatFileSize } from '@/utils/helpers';

interface ResumeDropzoneProps {
  onFileSelected: (file: File) => void;
  uploadProgress?: number;
  isBusy?: boolean;
  onReset?: () => void;
}

/** Full-width drag-and-drop upload target for the analyzer. */
export function ResumeDropzone({ onFileSelected, uploadProgress = 0, isBusy = false, onReset }: ResumeDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        const reason = rejected[0].errors[0]?.code;
        if (reason === 'file-too-large') {
          toast.error(`File is too large. Max ${MAX_UPLOAD_SIZE_MB}MB.`);
        } else {
          toast.error('Only PDF and DOCX files are supported.');
        }
        return;
      }
      const picked = accepted[0];
      if (picked) {
        setFile(picked);
        onFileSelected(picked);
      }
    },
    [onFileSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_RESUME_FILE_TYPES,
    multiple: false,
    disabled: isBusy,
    maxSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  });

  const handleReset = () => {
    setFile(null);
    onReset?.();
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          bgcolor: (theme) =>
            isDragActive
              ? theme.palette.mode === 'light'
                ? 'rgba(59,91,253,0.06)'
                : 'rgba(59,91,253,0.12)'
              : 'background.paper',
          textAlign: 'center',
          cursor: isBusy ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': !isBusy ? { borderColor: 'primary.main' } : undefined,
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload resume file"
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, #3B5BFD, #14B8A6)',
                    color: '#fff',
                  }}
                >
                  <CloudUploadOutlined sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to browse — PDF or DOCX, up to {MAX_UPLOAD_SIZE_MB}MB
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="PDF" size="small" icon={<PictureAsPdfOutlined />} />
                  <Chip label="DOCX" size="small" icon={<DescriptionOutlined />} />
                </Stack>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Stack spacing={2} alignItems="center">
                <PictureAsPdfOutlined color="primary" sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {isBusy && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {uploadProgress < 100 ? `Uploading — ${uploadProgress}%` : 'Analyzing your resume with AI…'}
            </Typography>
          </Stack>
          <LinearProgress
            variant={uploadProgress < 100 ? 'determinate' : 'indeterminate'}
            value={uploadProgress}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>
      )}

      {file && !isBusy && (
        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Button startIcon={<DeleteOutline />} color="inherit" onClick={handleReset}>
            Choose another file
          </Button>
        </Stack>
      )}
    </Box>
  );
}
