import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, TextField, Stack, Typography, IconButton, Grid, Fade, Tabs, Tab,
  SelectChangeEvent, Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlotById, createPlot, updatePlot, deletePlot } from '../../api';
import type { Plot, PlotPayload, Pricing } from '../../types';
import GTagInformation from '../../components/GTagInformation';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useCrops, useCropPricing } from "../../sections/AgentDashboard/hooks/useCrops";
import DropDown from "../../components/DropDown";

const INITIAL_FORM_DATA = {
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
};

const PlotDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { layoutId, plotId } = useParams();
  const isEdit = Boolean(plotId);

  const [formData, setFormData] = useState<typeof INITIAL_FORM_DATA>(INITIAL_FORM_DATA);
  const [perimeterCoords, setPerimeterCoords] = useState<Record<string, { lat: number; lng: number }>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [activePricingTab, setActivePricingTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [downpayment, setDownpayment] = React.useState<string>("");
  const { data: crops = [], isLoading: isLoadingCrops } = useCrops();
  const { data: pricing = []} = useCropPricing(selectedCropId);

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
          center_lng: plot.center_coordinates?.long != null ? String(plot.center_coordinates.long) : '',
          crop_id: plot.crop_id || ''
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
      center_coordinates: (formData.center_lat && formData.center_lng)
        ? { lat: parseFloat(formData.center_lat), long: parseFloat(formData.center_lng) }
        : null,
      perimeter_coordinates: Object.keys(perimeterCoords).length > 0 ? perimeterCoords : null
    };

    try {
      if (isEdit) {
        await updatePlot(plotId!, payload);
      } else {
        await createPlot(payload);
      }
      setTimeout(() => navigate(-1), 800);
    } catch (error) {
      console.error('Failed to submit plot', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (plotId) {
        await deletePlot(plotId);
        setTimeout(() => navigate(-1), 800);
      }
    } catch (error) {
      console.error("Failed to delete plot", error);
    }
  };

  const handleBack = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => navigate(-1), 300);
  }, [navigate]);

  const handleCropSelect = (event: SelectChangeEvent<string | number>) => {
    setSelectedCropId(String(event.target.value));
  };

  const renderPricingFields = (pricing: Pricing[]) => {
    const parsedDownpayment = Number(downpayment) || 0;
    const selectedPricing = pricing.find(p => 
      formData.area_in_acres >= p.extent_min_value &&
      formData.area_in_acres <= p.extent_max_value
    );

    if (!selectedPricing) {
      return <div>No pricing available for selected area.</div>;
    }

    const totalPrice = formData.area_in_acres * selectedPricing.cost_per_acre;
    const outstandingAmount = totalPrice - (totalPrice * (parsedDownpayment / 100));

    const fields = [
      { label: "Price Per Acre", value: selectedPricing.cost_per_acre },
      { label: "Price Per Cent", value: selectedPricing.cost_per_cent },
      { label: "Total Price", value: totalPrice },
    ];

    return (
      <Grid container spacing={2}>
        {fields.map(({ label, value }) => (
          <Grid size={{ xs:12, sm:6}} key={label}>
            <TextField
              label={label}
              variant="filled"
              fullWidth
              value={value}
              InputProps={{
                readOnly: true,
                endAdornment: <InputAdornment position="end">(INR)</InputAdornment>
            }}
            />
          </Grid>
        ))}
        <Grid size={{ xs:12, sm:6}}>
          <TextField
            label="Down Payment (%)"
            variant="filled"
            fullWidth
            type="number"
            value={downpayment}
            onChange={(e) => setDownpayment(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs:12, sm:6}}>
          <Typography variant="h6">
            Outstanding Amount: {outstandingAmount.toFixed(2)} (INR)
          </Typography>
        </Grid>
      </Grid>
    );
  };  



  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Fade in={!fadeOut} timeout={300}>
        <Stack spacing={3}>
          <IconButton onClick={handleBack} sx={{
            backgroundColor: '#000', color: '#fff', borderRadius: '50%',
            width: 40, height: 40, '&:hover': { backgroundColor: '#333' }
          }}>
            <ArrowBackIcon />
          </IconButton>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>{isEdit ? "Edit Plot" : "Add New Plot"}</Typography>
              <Stack direction="row" spacing={2}>
                {isEdit && (
                  <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)} startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                )}
                <Button variant="outlined" onClick={handleSubmit} disabled={isSubmitting} color="success">
                  Save
                </Button>
              </Stack>
            </Box>

            {isEdit && (
              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid size={{ xs:12, sm:6}}>
                    <TextField label="Layout ID" value={layoutId} fullWidth disabled />
                </Grid>
                <Grid size={{ xs:12, sm:6}}>
                    <TextField label="Plot ID" value={plotId} fullWidth disabled />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid size={{ xs:12, sm:6}}>
                <TextField label="Plot Number" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth />
              </Grid>
              <Grid size={{ xs:12, sm:6}}>
                <TextField label="Plot LP Number" value={formData.number} onChange={(e) => handleChange('number', e.target.value)} fullWidth />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid size={{ xs:12, sm:6}}>
                <TextField label="Area (acres)" type="number" inputProps={{ step: "any", min: 0 }} value={formData.area_in_acres} onChange={(e) => handleChange('area_in_acres', e.target.value)} fullWidth />
              </Grid>
              <Grid size={{ xs:12, sm:6}}>
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
                <Stack spacing={2}>
                  <DropDown
                    selected={selectedCropId}
                    onChange={handleCropSelect}
                    disabled={isLoadingCrops}
                    isLoading={isLoadingCrops}
                    items={crops}
                    label="Select a crop"
                  />
                  <Tabs value={activePricingTab} onChange={(_, newValue) => setActivePricingTab(newValue)} sx={{ alignSelf:'center'}}>
                    <Tab label="CASH" />
                    <Tab label="EMI" />
                  </Tabs>
                  {renderPricingFields(pricing)}
                </Stack>
              )}

              {activeTab === 1 && (
                <GTagInformation
                  centerCoordinates={{
                    lat: parseFloat(formData.center_lat || '0'),
                    lng: parseFloat(formData.center_lng || '0')
                  }}
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
            message="Are you sure you want to delete this plot?"
            onConfirm={handleDelete}
          />
        </Stack>
      </Fade>
    </Container>
  );
};

export default PlotDetailsPage;
