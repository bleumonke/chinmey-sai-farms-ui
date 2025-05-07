import React, { useEffect, useState } from 'react';
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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlotById, createPlot, updatePlot, deletePlot } from '../lib/api';
import type { Plot, PlotPayload } from '../types';

const PlotFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { layoutId, plotId } = useParams();
  const isEdit = !!plotId;

  const [formData, setFormData] = useState<Partial<Plot> & { center_lat?: string, center_lng?: string }>({
    number: '',
    name: '',
    area_in_acres: 0,
    is_active: true,
    is_sold: false,
    description: '',
    customer_id: '',
    center_lat: '',
    center_lng: ''
  });

  const [perimeterCoords, setPerimeterCoords] = useState<{
    [key: string]: { lat: number; lng: number };
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isEdit && plotId) {
      getPlotById(plotId).then((res) => {
        const plot: Plot = res.data;
        setFormData({
          number: plot.number,
          name: plot.name,
          area_in_acres: plot.area_in_acres ?? 0,
          is_active: plot.is_active ?? true,
          is_sold: plot.is_sold ?? false,
          description: plot.description || '',
          customer_id: plot.customer_id || '',
          center_lat: plot.center_coordinates?.lat != null ? String(plot.center_coordinates.lat) : '',
          center_lng: plot.center_coordinates?.long != null ? String(plot.center_coordinates.long) : ''
        });
        setPerimeterCoords(plot.perimeter_coordinates || {});
      });
    }
  }, [isEdit, plotId]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddPerimeter = () => {
    const key = `point_${Object.keys(perimeterCoords).length + 1}`;
    setPerimeterCoords({ ...perimeterCoords, [key]: { lat: 0, lng: 0 } });
  };

  const updatePerimeterValue = (
    key: string,
    field: 'lat' | 'lng',
    value: number
  ) => {
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
    const payload: PlotPayload = {
      layout_id: layoutId!,
      customer_id: formData.customer_id || null,
      number: formData.number!,
      name: formData.name!,
      area_in_acres: Number(formData.area_in_acres || 0),
      is_active: formData.is_active ?? true,
      is_sold: formData.is_sold ?? false,
      description: formData.description || null,
      center_coordinates: formData.center_lat && formData.center_lng ? {
        lat: parseFloat(formData.center_lat || '0'),
        long: parseFloat(formData.center_lng || '0')
      } : null,
      perimeter_coordinates: Object.keys(perimeterCoords).length > 0 ? perimeterCoords : null
    };

    try {
      if (isEdit) {
        await updatePlot(plotId!, payload);
      } else {
        await createPlot(payload);
      }
      setSnackbar({ open: true, message: 'Plot saved successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch (error) {
      console.error('Failed to submit plot', error);
      setSnackbar({ open: true, message: 'Failed to save plot', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (plotId) {
      try {
        await deletePlot(plotId);
        setSnackbar({ open: true, message: 'Plot deleted', severity: 'success' });
        setTimeout(() => navigate(-1), 800);
      } catch (error) {
        console.error("Failed to delete plot", error);
        setSnackbar({ open: true, message: 'Failed to delete plot', severity: 'error' });
      }
    }
  };

  const handleBackClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate(-1), 300);
  };

  return (
    <Fade in={!fadeOut} timeout={300}>
      <Stack>
        <IconButton
          onClick={handleBackClick}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '50%',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight={600}>{isEdit ? "Edit Plot" : "Add New Plot"}</Typography>
            <Stack direction={'row'} spacing={2}>
              {isEdit && (
                <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>Delete</Button>
              )}
              <Button variant="outlined" onClick={handleSubmit} disabled={isSubmitting} color='success'>Save</Button>
            </Stack>
          </Box>
          <Stack spacing={2}>
            <TextField name="LayoutId" label="LayoutID" value={layoutId} disabled={true} fullWidth />
            <TextField name="PlotId" label="PlotID" value={plotId} disabled={true} fullWidth />
            <TextField label="Number" value={formData.number} onChange={(e) => handleChange('number', e.target.value)} fullWidth />
            <TextField label="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth />
            <TextField label="Area (in acres)" value={formData.area_in_acres} onChange={(e) => handleChange('area_in_acres', e.target.value)} fullWidth />
            <TextField label="Description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} fullWidth multiline rows={3} />
            <TextField label="Customer ID" value={formData.customer_id} onChange={(e) => handleChange('customer_id', e.target.value)} fullWidth />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
              }
              label="Is Active"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_sold}
                  onChange={(e) => handleChange('is_sold', e.target.checked)}
                />
              }
              label="Is Sold"
            />

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Center Coordinates</Typography>
            <Grid container spacing={2}>
              <Grid>
                <TextField label="Latitude" value={formData.center_lat} onChange={(e) => handleChange('center_lat', e.target.value)} fullWidth />
              </Grid>
              <Grid>
                <TextField label="Longitude" value={formData.center_lng} onChange={(e) => handleChange('center_lng', e.target.value)} fullWidth />
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
                  <TextField
                    label={`Lat (${key})`}
                    type="number"
                    value={coord.lat}
                    onChange={(e) => updatePerimeterValue(key, 'lat', parseFloat(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid>
                  <TextField
                    label={`Lng (${key})`}
                    type="number"
                    value={coord.lng}
                    onChange={(e) => updatePerimeterValue(key, 'lng', parseFloat(e.target.value))}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}

          </Stack>
        </Box>

        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogTitle>Delete Plot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this plot? This action cannot be undone.
            </DialogContentText>
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

export default PlotFormPage;