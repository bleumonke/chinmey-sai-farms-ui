import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';

export interface RecordFormDialogField {
  name: string;
  label: string;
  type?: 'text' | 'checkbox' | 'select' | 'textarea';
  multiline?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string | number | boolean }[];
}

export interface RecordFormDialogProps {
  open: boolean;
  title: string;
  formData: Record<string, any>;
  fields: RecordFormDialogField[];
  onClose: () => void;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
  submitLabel?: string;
  extraContent?: React.ReactNode;
}

const RecordFormDialog: React.FC<RecordFormDialogProps> = ({
  open,
  title,
  formData,
  fields,
  onClose,
  onChange,
  onSubmit,
  submitLabel = 'Submit',
  extraContent,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          backgroundColor: '#fff',
          color: '#000',
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: '65vh',
          px: 4,
          py: 2,
        }}
      >
        <Stack spacing={2}>
          {fields.map((field) => {
            const value = formData[field.name] ?? '';

            if (field.type === 'checkbox') {
              return (
                <FormControlLabel
                  key={field.name}
                  control={
                    <Checkbox
                      checked={!!formData[field.name]}
                      onChange={(e) => onChange(field.name, e.target.checked)}
                      disabled={field.disabled}
                    />
                  }
                  label={field.label}
                />
              );
            }

            if (field.type === 'select') {
              return (
                <TextField
                  key={field.name}
                  select
                  label={field.label}
                  value={String(value)}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  fullWidth
                  disabled={field.disabled}
                >
                  {field.options?.map((option) => (
                    <MenuItem
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            if (field.type === 'textarea') {
              return (
                <Box key={field.name}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 4,
                      fontWeight: 500,
                      color: '#000',
                    }}
                  >
                    {field.label}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    disabled={field.disabled}
                    style={{
                      width: '100%',
                      minHeight: 120,
                      padding: '10px',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      color: '#000',
                      backgroundColor: field.disabled ? '#f5f5f5' : '#fff',
                    }}
                  />
                </Box>
              );
            }

            return (
              <TextField
                key={field.name}
                label={field.label}
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                fullWidth
                variant="outlined"
                multiline={field.multiline}
                minRows={field.multiline ? 4 : undefined}
                disabled={field.disabled}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#666',
                    },
                  },
                  input: {
                    color: '#000',
                  },
                  label: {
                    color: '#000',
                  },
                }}
              />
            );
          })}

          {extraContent && <Box mt={2}>{extraContent}</Box>}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordFormDialog;
