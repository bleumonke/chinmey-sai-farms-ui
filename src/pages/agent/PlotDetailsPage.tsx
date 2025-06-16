import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Stack, Typography, IconButton, Grid, Fade, Tabs,
  Tab, Select, FormControl, InputLabel, MenuItem, Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlotById, createPlot, updatePlot, deletePlot } from '../../api';
import type { Plot, PlotPayload } from '../../types';
import GTagInformation from '../../components/GTagInformation';
import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';

const PlotDetailsPage: React.FC = () => {
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
    center_lng: '',
    crop_id: ''
  });

  const [perimeterCoords, setPerimeterCoords] = useState<{ [key: string]: { lat: number; lng: number } }>({});
  const [activeTab, setActiveTab] = useState(0);
  const [activePricingTab, setActivePricingTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        lat: parseFloat(formData.center_lat),
        long: parseFloat(formData.center_lng)
      } : null,
      perimeter_coordinates: Object.keys(perimeterCoords).length > 0 ? perimeterCoords : null
    };

    try {
      isEdit ? await updatePlot(plotId!, payload) : await createPlot(payload);
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
    try {
      if (plotId) {
        await deletePlot(plotId);
        setSnackbar({ open: true, message: 'Plot deleted', severity: 'success' });
        setTimeout(() => navigate(-1), 800);
      }
    } catch (error) {
      console.error("Failed to delete plot", error);
      setSnackbar({ open: true, message: 'Failed to delete plot', severity: 'error' });
    }
  };

  const handleBack = () => {
    setFadeOut(true);
    setTimeout(() => navigate(-1), 300);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Fade in={!fadeOut} timeout={300}>
        <Stack spacing={3}>
          <IconButton onClick={handleBack} sx={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', width: 40, height: 40, '&:hover': { backgroundColor: '#333' } }}><ArrowBackIcon /></IconButton>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>{isEdit ? "Edit Plot" : "Add New Plot"}</Typography>
              <Stack direction="row" spacing={2}>
                {isEdit && (
                  <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>Delete</Button>
                )}
                <Button variant="outlined" onClick={handleSubmit} disabled={isSubmitting} color="success">Save</Button>
              </Stack>
            </Box>

            {isEdit && (
              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Layout ID" value={layoutId} fullWidth disabled />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Plot ID" value={plotId} fullWidth disabled />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="LP Number" value={formData.number} onChange={(e) => handleChange('number', e.target.value)} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Plot Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Area (acres)" type="number" inputProps={{ step: "any", min: 0 }} value={formData.area_in_acres} onChange={(e) => handleChange('area_in_acres', e.target.value)} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Customer ID" value={formData.customer_id} onChange={(e) => handleChange('customer_id', e.target.value)} fullWidth />
              </Grid>
            </Grid>

            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mt: 4 }}>
              <Tab label="Pricing" />
              <Tab label="G-Tags" />
              <Tab label="Activity" />
            </Tabs>

            <Box mt={3}>

              {activeTab === 0 && (
                <Stack gap={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <FormControl fullWidth>
                        <InputLabel>Select Crop</InputLabel>
                        <Select
                          value={formData.crop_id || ''}
                          // onChange={(e) => handleChange('crop', e.target.value)}
                          label="Select Crop"
                        >
                          <MenuItem value=""><em>Select a crop</em></MenuItem>
                          <MenuItem value="wheat">Wheat</MenuItem>
                          <MenuItem value="rice">Rice</MenuItem>
                          <MenuItem value="corn">Corn</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} justifyContent="center">
                    <Tabs value={activePricingTab} onChange={(_, newValue) => setActivePricingTab(newValue)}>
                      <Tab label="CASH" />
                      <Tab label="EMI" />
                    </Tabs>
                  </Grid>
                  {activePricingTab === 0 && (
                    <Stack gap={2}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Price Per Acre"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Price Per Cent"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Total Price"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Down Payment"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  )}
                  {activePricingTab === 1 && (
                    <Stack gap={2}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Price Per Acre"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Price Per Cent"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Total Price"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                          <TextField
                            label="Down Payment"
                            variant='filled'
                            fullWidth
                            value="5000"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  )}
              </Stack>
              )}

              {activeTab === 1 && (
                <GTagInformation
                  centerCoordinates={{ lat: parseFloat(formData.center_lat || '0'), lng: parseFloat(formData.center_lng || '0') }}
                  perimeterCoordinates={Object.values(perimeterCoords)}
                  zoom={15}
                  mapHeight="400px"
                />
              )}
              {activeTab === 2 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary">Nothing to display</Typography>
                </Box>
              )}
            </Box>
          </Box>
          <ConfirmDialog
            open={showDeleteDialog} 
            onClose={() => setShowDeleteDialog(false)}
            title="Delete Plot"
            message="Are you sure you want to delete ?"
            onConfirm={handleDelete}
            confirmLabel="Delete"
            confirmColor="error"
          />
          <Notification
            open={snackbar.open}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            alertColor={snackbar.severity}
            message={snackbar.message}
          />
        </Stack>
      </Fade>
    </Container>
  );
};

export default PlotDetailsPage;
