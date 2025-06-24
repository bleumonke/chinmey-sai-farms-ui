import React, { useState } from "react";
import {
  Typography,
  Container,
  Paper,
  Stack,
  Box,
  Grid,
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import PersonIcon from "@mui/icons-material/Person";
import LayoutsTableSection from "../../sections/AgentDashboard/LayoutsTableSection";
import Notification from '../../components/Notification';
import { useCreateLayout } from "../../sections/AgentDashboard/hooks/useLayouts";

const cards = [
  { title: "Total Layouts", value: 12, icon: <LandscapeIcon />, color: "green" },
  { title: "Active Crops", value: 8, icon: <LocalFloristIcon />, color: "gold" },
  { title: "Customers", value: 150, icon: <PersonIcon />, color: "royalblue" },
];

const DashboardPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Use mutation hook
  const createLayoutMutation = useCreateLayout();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: "",
      area: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.area) {
      setSnackbar({
        open: true,
        message: "Name and area are required.",
        severity: "error",
      });
      return;
    }

    createLayoutMutation.mutate(
      {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip_code: formData.zip_code,
        area_in_acres: parseFloat(formData.area),
        center_coordinates: { lat: 0, long: 0},
        perimeter_coordinates: {}
      },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Layout created successfully.",
            severity: "success",
          });
          handleCloseDialog();
        },
        onError: (error) => {
          console.error(error);
          setSnackbar({
            open: true,
            message: "Failed to create layout.",
            severity: "error",
          });
        }
      }
    );
  };

const isSaving = createLayoutMutation.status === "pending";

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Welcome, Jane Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage your layouts and crops here.
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center">
          {cards.map((card, index) => (
            <Grid key={index} size={{ xs:12, sm:6, md:4}}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                    {card.icon}
                  </Avatar>
                  <Box
                    minHeight={75}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Typography variant="subtitle1">{card.title}</Typography>
                    <Typography variant="subtitle2">{card.value}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />
        <LayoutsTableSection onAddNew={() => setOpenDialog(true)} />

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>Create New Layout</Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details to create a new layout.
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                name="name"
                fullWidth
                label="Layout Name"
                placeholder="Enter layout name"
                variant="outlined"
                size="medium"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                name="area"
                fullWidth
                label="Area (in Acres)"
                placeholder="Enter area in acres"
                variant="outlined"
                size="medium"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs:12, sm:6}}>
                  <TextField
                    name="address"
                    fullWidth
                    label="Address"
                    placeholder="Enter address"
                    variant="outlined"
                    size="medium"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs:12, sm:6}}>
                  <TextField
                    name="city"
                    fullWidth
                    label="City"
                    placeholder="Enter city"
                    variant="outlined"
                    size="medium"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs:12, sm:4}}>
                  <TextField
                    name="state"
                    fullWidth
                    label="State"
                    placeholder="Enter state"
                    variant="outlined"
                    size="medium"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs:12, sm:4}}>
                  <TextField
                    name="country"
                    fullWidth
                    label="Country"
                    placeholder="Enter country"
                    variant="outlined"
                    size="medium"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs:12, sm:4}}>
                  <TextField
                    name="zip_code"
                    fullWidth
                    label="Zip Code"
                    placeholder="Enter zip code"
                    variant="outlined"
                    size="medium"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Notification
          open={snackbar.open}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          alertColor={snackbar.severity}
          message={snackbar.message}
        />
      </Stack>
    </Container>
  );
};

export default DashboardPage;
