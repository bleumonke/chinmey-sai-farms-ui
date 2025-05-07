import React, { useEffect, useState } from 'react';
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
  Alert,
  Grid,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getPricing, createPricing, updatePricing, deletePricing } from '../lib/api';
import type { Pricing } from '../types';

const extentUnits = ['acre', 'cent', 'sqft'];
const paymentModes = ['OUT-RIGHT', 'EMI'];

const PricingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { pricingId, cropId } = useParams();
  const isEdit = !!pricingId;

  const [formData, setFormData] = useState<Partial<Pricing>>({
    name: '',
    payment_mode: '',
    extent_unit: '',
    extent_min_value: '',
    extent_max_value: '',
    cost_per_acre: '',
    cost_per_cent: '',
    cost_per_sqft: '',
    total_cost_per_acre: '',
    emi_per_month: '',
    valid_from: '',
    valid_to: '',
    description: '',
    status: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (isEdit && pricingId) {
      getPricing().then(res => {
        const pricing = res.data.find((p: Pricing) => p.id === pricingId);
        if (pricing) {
          setFormData({ 
            ...pricing,
            valid_from: pricing.valid_from?.split('T')[0] || '', 
            valid_to: pricing.valid_to?.split('T')[0] || '',
          });
        }
      });
    }
  }, [pricingId, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      ...formData,
      crop_id: isEdit ? undefined : cropId,
      extent_min_value: Number(formData.extent_min_value || 0),
      extent_max_value: Number(formData.extent_max_value || 0),
      cost_per_acre: Number(formData.cost_per_acre || 0),
      cost_per_cent: Number(formData.cost_per_cent || 0),
      cost_per_sqft: Number(formData.cost_per_sqft || 0),
      total_cost_per_acre: Number(formData.total_cost_per_acre || 0),
      emi_per_month: Number(formData.emi_per_month || 0),
    };
    delete payload.id;

    try {
      if (isEdit) {
        await updatePricing(pricingId!, payload);
      } else {
        await createPricing(payload);
      }
      setSnackbar({ open: true, message: 'Pricing saved successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error saving pricing', err);
      setSnackbar({ open: true, message: 'Failed to save pricing', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePricing(pricingId!);
      setSnackbar({ open: true, message: 'Pricing deleted successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error deleting pricing', err);
      setSnackbar({ open: true, message: 'Failed to delete pricing', severity: 'error' });
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

        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>{isEdit ? `Edit Pricing` : 'Add New Pricing'}</Typography>
            <Stack direction='row' spacing={2}>
              {isEdit && (
                <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>Delete</Button>
              )}
              <Button variant="outlined" color='success' onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
            </Stack>
          </Box>

          <Stack spacing={2}>
            <TextField name="CropId" label="CropID" value={cropId} disabled={true} fullWidth />
            <TextField name="PricingID" label="PricingID" value={pricingId} disabled={true} fullWidth />
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
            <TextField select label="Payment Mode" name="payment_mode" value={formData.payment_mode} onChange={handleChange} fullWidth>
              {paymentModes.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
            </TextField>
            <TextField select label="Extent Unit" name="extent_unit" value={formData.extent_unit} onChange={handleChange} fullWidth>
              {extentUnits.map(unit => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
            </TextField>
            <Grid container spacing={2}>
              <Grid><TextField label="Extent Min Value" name="extent_min_value" value={formData.extent_min_value} onChange={handleChange} fullWidth type="number" /></Grid>
              <Grid><TextField label="Extent Max Value" name="extent_max_value" value={formData.extent_max_value} onChange={handleChange} fullWidth type="number" /></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid><TextField label="Cost per Acre" name="cost_per_acre" value={formData.cost_per_acre} onChange={handleChange} fullWidth type="number" /></Grid>
              <Grid><TextField label="Total Cost per Acre" name="total_cost_per_acre" value={formData.total_cost_per_acre} onChange={handleChange} fullWidth type="number" /></Grid>
              <Grid><TextField label="Cost per Cent" name="cost_per_cent" value={formData.cost_per_cent} onChange={handleChange} fullWidth type="number" /></Grid>
              <Grid><TextField label="Cost per Sqft" name="cost_per_sqft" value={formData.cost_per_sqft} onChange={handleChange} fullWidth type="number" /></Grid>
              <Grid><TextField label="EMI per Month" name="emi_per_month" value={formData.emi_per_month} onChange={handleChange} fullWidth type="number" /></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid><TextField label="Valid From" name="valid_from" type="date" value={formData.valid_from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
              <Grid><TextField label="Valid To" name="valid_to" type="date" value={formData.valid_to} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
            </Grid>
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} />
          </Stack>
        </Box>

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Pricing</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this pricing? This action cannot be undone.</DialogContentText>
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

export default PricingFormPage;