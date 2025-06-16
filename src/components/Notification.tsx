/**
 * 
 * Notification Component
 * A reusable notification component that displays messages to the user.
 * 
 * * Example usage:
 * <Notification open={true} message="This is a success message!" severity="success" onClose={() => {}} />
 * 
 */

import React from 'react';
import {
  Snackbar,
  Alert,
  AlertColor,
  SnackbarOrigin,
  AlertProps
} from '@mui/material';

interface NotificationProps {
  open: boolean;
  message?: string;
  severity?: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  alertVariant?: AlertProps['variant'];
  alertColor?: AlertProps['color'];
  children?: React.ReactNode;
  sx?: AlertProps['sx'];
}

const getDefaultSx = (severity: AlertColor): AlertProps['sx'] => {
  switch (severity) {
    case 'success':
      return { backgroundColor: '#d0f0d8', color: '#2e7d32' };
    case 'error':
      return { backgroundColor: '#fdecea', color: '#c62828' };
    case 'warning':
      return { backgroundColor: '#fff4e5', color: '#f57c00' };
    case 'info':
      return { backgroundColor: '#e8f4fd', color: '#0277bd' };
    default:
      return { backgroundColor: '#fff', color: '#000' };
  }
};

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'success',
  onClose,
  autoHideDuration = 3000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  alertVariant = 'filled',
  alertColor,
  children,
  sx,
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={alertVariant}
        color={alertColor}
        sx={sx ?? getDefaultSx(severity)}
      >
        {children || message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
