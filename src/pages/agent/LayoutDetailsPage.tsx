import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Grid,
  Fade,
  Container,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { getLayouts, updateLayout, deleteLayout } from '../../api';
import PlotsTableSection from '../../sections/AgentDashboard/PlotsTableSection';
import type { Layout, LayoutPayload } from '../../types';
import GTagInformation from '../../components/GTagInformation';
import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';

const TabPanel = ({ children, value, index }: { children?: React.ReactNode; value: number; index: number }) => {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
};

const defaultFormState: Omit<LayoutPayload, 'perimeter_coordinates'> = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  area_in_acres: 0,
  description: '',
  center_coordinates: { lat: 0, long: 0 },
};

const LayoutDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { layoutId } = useParams<{ layoutId: string }>();
  const isEdit = Boolean(layoutId);

  const [formData, setFormData] = useState(defaultFormState);
  const [perimeterCoords, setPerimeterCoords] = useState<Record<string, { lat: number; lng: number }>>({});
  const [tabIndex, setTabIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (!isEdit) navigate(-1);
  }, [isEdit, navigate]);

  useEffect(() => {
    if (layoutId) {
      getLayouts()
        .then((res) => {
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
              center_coordinates: layout.center_coordinates ?? { lat: 0, long: 0 },
            });
            setPerimeterCoords(layout.perimeter_coordinates || {});
          } else {
            setSnackbar({ open: true, message: 'Layout not found', severity: 'error' });
            setTimeout(() => navigate(-1), 1500);
          }
        })
        .catch(() => setSnackbar({ open: true, message: 'Failed to load layout', severity: 'error' }));
    }
  }, [layoutId, navigate]);

  const handleBack = () => {
    setFadeOut(true);
    setTimeout(() => navigate(-1), 300);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: LayoutPayload = { ...formData, perimeter_coordinates: perimeterCoords };
      await updateLayout(layoutId!, payload);
      setSnackbar({ open: true, message: 'Layout updated', severity: 'success' });
      setTimeout(() => navigate(-1), 1000);
    } catch {
      setSnackbar({ open: true, message: 'Update failed', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLayout(layoutId!);
      setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
      setTimeout(() => navigate(-1), 800);
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };
  
  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Fade in={!fadeOut} timeout={300}>
        <Stack spacing={3}>
          <IconButton onClick={handleBack} sx={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', width: 40, height: 40, '&:hover': { backgroundColor: '#333' } }}><ArrowBackIcon /></IconButton>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>Edit Layout</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => setShowDeleteDialog(true)}>Delete</Button>
              <Button variant="outlined" color="success" onClick={handleSubmit} disabled={isSubmitting}>Save</Button>
            </Stack>
          </Box>
        <Stack spacing={2}>
            <Grid container spacing={2}>
                {
                isEdit && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="LayoutId" label="LayoutID" value={layoutId} disabled={true} fullWidth />
                    </Grid>
                )
                }
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Area (in hectares)" value={formData.area_in_acres} onChange={(e) => handleChange('area_in_acres', e.target.value)} />
                </Grid>
            </Grid>
        </Stack>
          <Tabs value={tabIndex} onChange={(_, i) => setTabIndex(i)}>
            <Tab label="Address" />
            <Tab label="Plots" />
            <Tab label="G-Tags" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <Grid container spacing={2}>
              {['address', 'city', 'state', 'zip_code', 'country'].map((field) => (
                <Grid size={{ xs:12, sm:6 }} key={field}>
                  <TextField
                    fullWidth
                    label={field.replace(/_/g, ' ').toUpperCase()}
                    value={formData[field as keyof typeof formData] || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabIndex} index={2}>
            <GTagInformation
              centerCoordinates={{ lat: formData.center_coordinates.lat, lng: formData.center_coordinates.long }}
              perimeterCoordinates={Object.values(perimeterCoords)}
              zoom={15}
              mapHeight="400px"
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <PlotsTableSection layoutId={layoutId!} />
          </TabPanel>
          
        </Stack>
      </Fade>
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

    </Container>
  );
};

export default LayoutDetailsPage;
