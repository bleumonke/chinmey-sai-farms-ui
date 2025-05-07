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
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../lib/api';
import type { Customer } from '../types';

const CustomerFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const isEdit = !!customerId;

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (isEdit) {
      getCustomers().then(res => {
        const customer = res.data.find((c: any) => c.id === customerId);
        if (customer) {
          setFormData({
            first_name: customer.first_name || '',
            middle_name: customer.middle_name || '',
            last_name: customer.last_name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            city: customer.city || '',
            state: customer.state || '',
            zip_code: customer.zip_code || '',
            country: customer.country || ''
          });
        }
      });
    }
  }, [customerId, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateCustomer(customerId!, formData);
      } else {
        await createCustomer(formData);
      }
      setSnackbar({ open: true, message: 'Customer saved successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error saving customer', err);
      setSnackbar({ open: true, message: 'Failed to save customer', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(customerId!);
      setSnackbar({ open: true, message: 'Customer deleted successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error deleting customer', err);
      setSnackbar({ open: true, message: 'Failed to delete customer', severity: 'error' });
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
            <Typography variant="h5" fontWeight={600}>{isEdit ? "Edit Customer" : "Add New Customer"}</Typography>
            <Stack direction='row' spacing={2}>
              {isEdit && (
                <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>Delete</Button>
              )}
              <Button variant="outlined" color='success' onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
            </Stack>
          </Box>

          <Stack spacing={2}>
            <TextField name="customerId" label="CustomerID" value={customerId} disabled={true} fullWidth />
            <Grid container spacing={2}>
              <Grid><TextField name="first_name" label="First Name" value={formData.first_name} onChange={handleChange} fullWidth /></Grid>
              <Grid><TextField name="middle_name" label="Middle Name" value={formData.middle_name} onChange={handleChange} fullWidth /></Grid>
              <Grid><TextField name="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} fullWidth /></Grid>
            </Grid>
            <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth />
            <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField name="address" label="Address" value={formData.address} onChange={handleChange} fullWidth />
            <Grid container spacing={2}>
              <Grid><TextField name="city" label="City" value={formData.city} onChange={handleChange} fullWidth /></Grid>
              <Grid><TextField name="state" label="State" value={formData.state} onChange={handleChange} fullWidth /></Grid>
              <Grid><TextField name="zip_code" label="Zip Code" value={formData.zip_code} onChange={handleChange} fullWidth /></Grid>
            </Grid>
            <TextField name="country" label="Country" value={formData.country} onChange={handleChange} fullWidth />
          </Stack>
        </Box>

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this customer? This action cannot be undone.</DialogContentText>
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

export default CustomerFormPage;
