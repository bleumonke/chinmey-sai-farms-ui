/**
 * 
 * ConfirmDialog Component
 * A reusable confirmation dialog component for user actions.
 * 
 * * Example usage:
 * <ConfirmDialog
 *      open={open}
 *      title="Save Changes"
 *      message="Are you sure you want to save the changes to your profile?"
 *      onClose={handleClose}
 *      onConfirm={handleConfirm}
 *      confirmLabel="Apply Changes"
 *      confirmColor="success"
 * />
 * 
 * 
 */


import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, ButtonProps
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmColor?: ButtonProps['color'];
  confirmVariant?: ButtonProps['variant'];
  children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Are you sure?',
  message,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmColor = 'error',
  confirmVariant = 'contained',
  children,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: 'sm',
        width: '100%',
        padding: 2,
        height: 'auto',
        minHeight: '150px',
      }
    }}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {children ? children : <Typography>{message}</Typography>}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        onClick={onConfirm}
        color={confirmColor}
        variant={confirmVariant}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
