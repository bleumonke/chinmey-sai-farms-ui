import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Divider,
  Grid,
  Fade,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { createLayout, updateLayout, getLayouts, deleteLayout } from '../lib/api';
import PlotsTableSection from '../sections/AgentDashboard/PlotsTableSection';
import type { Layout, LayoutPayload } from '../types';

const LayoutFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { layoutId } = useParams();
  const isEdit = !!layoutId;

  const [formData, setFormData] = useState<Partial<Layout> & { center_lat?: string, center_lng?: string }>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    area_in_acres: 0,
    description: '',
    center_lat: '',
    center_lng: '',
  });
  const [perimeterCoords, setPerimeterCoords] = useState<{
    [key: string]: { lat: number; lng: number };
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isEdit && layoutId) {
      getLayouts().then((res) => {
        const layout = res.data.find((l: Layout) => l.id === layoutId);
        if (layout) {
          setFormData({
            name: layout.name,
            address: layout.address,
            city: layout.city,
            state: layout.state,
            zip_code: layout.zip_code,
            country: layout.country,
            area_in_acres: layout.area_in_acres ?? 0,
            description: layout.description || '',
            center_lat: layout.center_coordinates?.lat != null ? String(layout.center_coordinates.lat) : '',
            center_lng: layout.center_coordinates?.long != null ? String(layout.center_coordinates.long) : '',
          });
          setPerimeterCoords(layout.perimeter_coordinates || {});
        }
      });
    }
  }, [isEdit, layoutId]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddPerimeter = () => {
    const key = `point_${Object.keys(perimeterCoords).length + 1}`;
    setPerimeterCoords({ ...perimeterCoords, [key]: { lat: 0, lng: 0 } });
  };

  const updatePerimeterValue = (key: string, field: 'lat' | 'lng', value: number) => {
    setPerimeterCoords({
      ...perimeterCoords,
      [key]: {
        ...perimeterCoords[key],
        [field]: value,
      },
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload: LayoutPayload = {
      name: formData.name!,
      address: formData.address!,
      city: formData.city!,
      state: formData.state!,
      zip_code: formData.zip_code!,
      country: formData.country!,
      area_in_acres: Number(formData.area_in_acres || '0'),
      description: formData.description,
      center_coordinates: {
        lat: parseFloat(formData.center_lat || '0'),
        long: parseFloat(formData.center_lng || '0'),
      },
      perimeter_coordinates: perimeterCoords,
    };

    try {
      if (isEdit) {
        await updateLayout(layoutId!, payload);
      } else {
        await createLayout(payload);
      }
      setSnackbar({ open: true, message: 'Layout saved successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error('Error submitting layout', err);
      setSnackbar({ open: true, message: 'Failed to save layout', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLayout(layoutId!);
      setSnackbar({ open: true, message: 'Layout deleted successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (error) {
      console.error('Error deleting layout', error);
      setSnackbar({ open: true, message: 'Failed to delete layout', severity: 'error' });
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" fontWeight={600}>{isEdit ? "Edit Layout" : "Add New Layout"}</Typography>
            </Box>
            <Stack direction={'row'} spacing={2}>
              {isEdit && (
                <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>Delete</Button>
              )}
              <Button variant="outlined" onClick={handleSubmit} disabled={isSubmitting} color='success'>Save</Button>
            </Stack>
          </Box>

          <Stack spacing={2}>
            <TextField name="LayoutId" label="LayoutID" value={layoutId} disabled={true} fullWidth />
            <TextField label="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth />
            <TextField label="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} fullWidth />
            <TextField label="City" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} fullWidth />
            <TextField label="Description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} fullWidth multiline rows={3} />

            <Grid container spacing={2}>
              <Grid>
                <TextField label="State" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} fullWidth />
              </Grid>
              <Grid>
                <TextField label="Zip Code" value={formData.zip_code} onChange={(e) => handleChange('zip_code', e.target.value)} fullWidth />
              </Grid>
              <Grid>
                <TextField label="Country" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} fullWidth />
              </Grid>
            </Grid>

            <TextField label="Area (in acres)" value={formData.area_in_acres} onChange={(e) => handleChange('area_in_acres', e.target.value)} fullWidth />

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Center Coordinates</Typography>
            <Grid container spacing={2}>
              <Grid>
                <TextField label="Center Latitude" value={formData.center_lat} onChange={(e) => handleChange('center_lat', e.target.value)} fullWidth />
              </Grid>
              <Grid>
                <TextField label="Center Longitude" value={formData.center_lng} onChange={(e) => handleChange('center_lng', e.target.value)} fullWidth />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <Typography variant="h6">Perimeter Coordinates</Typography>
              </Grid>
              <Grid>
                <Button onClick={handleAddPerimeter} variant="outlined" color='secondary'>Add Perimeter Point</Button>
              </Grid>
            </Grid>

            {Object.entries(perimeterCoords).map(([key, coord]) => (
              <Grid container spacing={2} key={key}>
                <Grid>
                  <TextField label={`Lat (${key})`} type="number" value={coord.lat} onChange={(e) => updatePerimeterValue(key, 'lat', parseFloat(e.target.value))} fullWidth />
                </Grid>
                <Grid>
                  <TextField label={`Lng (${key})`} type="number" value={coord.lng} onChange={(e) => updatePerimeterValue(key, 'lng', parseFloat(e.target.value))} fullWidth />
                </Grid>
              </Grid>
            ))}
            <Divider sx={{ my: 2 }} />
            {layoutId && (<PlotsTableSection layoutId={layoutId} />)}
          </Stack>
        </Box>

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Layout</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this layout? This action cannot be undone.</DialogContentText>
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

export default LayoutFormPage;
