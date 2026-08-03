import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { CloudUploadOutlined, DeleteOutline } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getInitials, readFileAsDataUrl } from '@/utils/helpers';

interface FileUploadFieldProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  displayName: string;
}

/** Circular profile-image dropzone with preview, used in Personal Information. */
export function FileUploadField({ value, onChange, displayName }: FileUploadFieldProps) {
  const onDrop = useCallback(
    async (accepted: File[], rejected: import('react-dropzone').FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error('Please upload a JPG or PNG under 2MB.');
        return;
      }
      const file = accepted[0];
      if (!file) return;
      try {
        const dataUrl = await readFileAsDataUrl(file);
        onChange(dataUrl);
      } catch {
        toast.error('Could not read image file.');
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
  });

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        src={value ?? undefined}
        sx={{ width: 72, height: 72, fontSize: 24, bgcolor: 'primary.main' }}
      >
        {!value && getInitials(displayName)}
      </Avatar>
      <Stack spacing={1}>
        <Box
          {...getRootProps()}
          sx={{
            border: '1.5px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            px: 2,
            py: 1,
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            '&:hover': { borderColor: 'primary.main' },
          }}
          role="button"
          aria-label="Upload profile image"
        >
          <input {...getInputProps()} />
          <Stack direction="row" spacing={1} alignItems="center">
            <CloudUploadOutlined fontSize="small" color="primary" />
            <Typography variant="body2">
              {isDragActive ? 'Drop image here…' : 'Upload or drag a photo'}
            </Typography>
          </Stack>
        </Box>
        {value && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutline />}
            onClick={() => onChange(null)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Remove photo
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
