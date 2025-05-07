import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Fade,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getCrops, createCrop, updateCrop, deleteCrop } from '../lib/api';
import PricingTableSection from '../sections/AgentDashboard/PricingTableSection';
import type { Crop } from '../types';

const CropFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { cropId } = useParams();
  const isEdit = !!cropId;

  const [formData, setFormData] = useState({
    name: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (isEdit) {
      getCrops().then(res => {
        const crop = res.data.find((c: any) => c.id === cropId);
        if (crop) {
          setFormData({ name: crop.name });
        }
      });
    }
  }, [cropId, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateCrop(cropId!, formData);
      } else {
        await createCrop(formData);
      }
      setSnackbar({ open: true, message: 'Crop saved successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error saving crop', err);
      setSnackbar({ open: true, message: 'Failed to save crop', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCrop(cropId!);
      setSnackbar({ open: true, message: 'Crop deleted successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error deleting crop', err);
      setSnackbar({ open: true, message: 'Failed to delete crop', severity: 'error' });
    }
  };

  const handleBackClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate(-1), 300);
  };

  return (
    <Fade in={!fadeOut} timeout={300}>
      <Stack>
        <IconButton onClick={handleBackClick} sx={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', width: 40, height: 40, '&:hover': { backgroundColor: '#333' } }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>{isEdit ? "Edit Crop" : "Add New Crop"}</Typography>
            <Stack direction='row' spacing={2}>
              {isEdit && (
                <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>Delete</Button>
              )}
              <Button variant="outlined" color='success' onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
            </Stack>
          </Box>

          <Stack spacing={2}>
            <TextField name="CropId" label="CropID" value={cropId} disabled={true} fullWidth />
            <TextField label="Crop Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
              {cropId && (<PricingTableSection cropId={cropId} />)}
          </Stack>
        </Box>

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Crop</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this crop? This action cannot be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Fade>
  );
};

export default CropFormPage;