import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface CreateCropDialogProps {
  open: boolean;
  cropName: string;
  onCropNameChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateCropDialog: React.FC<CreateCropDialogProps> = ({
  open,
  cropName,
  onCropNameChange,
  onClose,
  onCreate,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Crop</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Crop Name"
          fullWidth
          value={cropName}
          onChange={(e) => onCropNameChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onCreate} disabled={!cropName.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
