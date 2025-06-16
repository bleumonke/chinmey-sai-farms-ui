import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Divider,
  Container,
  Fade
} from "@mui/material";
import DataTable, { ColumnDef } from "../../components/DataTable";

// Pricing structure
interface Pricing {
  id: string;
  name: string;
  payment_mode: string;
  status: string;
  extent_unit_type?: string;
  extent_min_value?: number;
  extent_max_value?: number;
  price_per_acre?: number;
  price_per_cent?: number;
  total_price?: number;
  valid_from?: string;
  valid_to?: string;
  description?: string;
}

// Crop structure
interface Crop {
  id: string;
  name: string;
}

// Initial crop list
const initialCrops: Crop[] = [
  { id: "1", name: "Mosambi" },
  { id: "2", name: "Pomegranate" },
  { id: "3", name: "Orange" },
];

// Pricing data per crop
const mockPricingData: Record<string, Pricing[]> = {
  "1": [
    { id: "101", name: "Mosambi Premium", payment_mode: "CASH", status: "Active" },
    { id: "102", name: "Mosambi Regular", payment_mode: "EMI", status: "Inactive" },
  ],
  "2": [{ id: "201", name: "Pomegranate Deluxe", payment_mode: "CASH", status: "Active" }],
  "3": [
    { id: "301", name: "Orange Fresh", payment_mode: "EMI", status: "Active" },
    { id: "302", name: "Orange Bulk", payment_mode: "CASH", status: "Pending" },
  ],
};

// Hook to fetch pricing data
const useCropPricing = (cropId: string) => {
  const [data, setData] = useState<Pricing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!cropId) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(mockPricingData[cropId] || []);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [cropId]);

  return { data, isLoading, setData };
};

const PricingPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const { data: pricing = [], isLoading, setData } = useCropPricing(selectedCropId);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
  const [isNewPricing, setIsNewPricing] = useState<boolean>(false);

  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [newCropName, setNewCropName] = useState("");

  const handleCropSelect = (value: string) => {
    if (value === "new") {
      setOpenCropDialog(true);
    } else {
      setSelectedCropId(value);
    }
  };

  const handleCreateCrop = () => {
    const newId = (Math.max(...crops.map((c) => parseInt(c.id)), 0) + 1).toString();
    const newCrop = { id: newId, name: newCropName };
    setCrops((prev) => [...prev, newCrop]);
    setSelectedCropId(newId);
    setNewCropName("");
    setOpenCropDialog(false);
  };

  const handleViewDetails = (id: string | number) => {
    const selected = pricing.find((p) => p.id === id);
    if (selected) {
      setIsNewPricing(false);
      setSelectedPricing(selected);
      setOpenDialog(true);
    }
  };

  const handleAddNewPricing = () => {
    setIsNewPricing(true);
    setSelectedPricing({
      id: Date.now().toString(),
      name: "",
      payment_mode: "",
      status: "Active",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPricing(null);
  };

  const handleSave = () => {
    if (!selectedPricing) return;

    if (isNewPricing) {
      setData((prev) => [...prev, selectedPricing]);
    } else {
      setData((prev) =>
        prev.map((p) => (p.id === selectedPricing.id ? selectedPricing : p))
      );
    }

    setOpenDialog(false);
  };

  const columns: ColumnDef<Pricing>[] = [
    { label: "Payment Name", accessor: "name" },
    { label: "Payment Mode", accessor: "payment_mode" },
    { label: "Extent Unit Type", accessor: "extent_unit_type" },
    { label: "Price Per Acer", accessor: "price_per_acre" },
    { label: "Total Price", accessor: "total_price" },
    { label: "Status", accessor: "status" }
  ];

  return (
     <Fade in={true} timeout={300}>
      <Container maxWidth="lg" sx={{ padding: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Crop Pricing Management
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={400}>
            Select an existing crop to view and manage its pricing details, or create a new crop if it doesn't exist. You can view, edit, or add new pricing records for the selected crop.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Select
                fullWidth
                variant="outlined"
                displayEmpty
                value={selectedCropId}
                onChange={(e) => handleCropSelect(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select a crop
                </MenuItem>
                {crops.map((crop) => (
                  <MenuItem key={crop.id} value={crop.id}>
                    {crop.name}
                  </MenuItem>
                ))}
                <MenuItem value="new" sx={{ fontStyle: "italic", color: "primary.main" }}>
                  + Create new crop
                </MenuItem>
              </Select>
            </Grid>
          </Grid>

          {selectedCropId && (
            <Grid container spacing={2} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleAddNewPricing} sx={{ backgroundColor:'black', color: 'white', '&:hover': { backgroundColor: '#333' }, alignSelf: "flex-end" }}>
                Create Pricing
              </Button>
              <Grid size={12}>
                <DataTable
                  title="Pricing"
                  columns={columns}
                  data={pricing}
                  loading={isLoading}
                  onDelete={(id) => console.log("Delete", id)}
                  onViewDetails={handleViewDetails}
                />
              </Grid>
            </Grid>
          )}

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {isNewPricing ? "Add New Pricing" : "View / Edit Pricing"}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                {isNewPricing
                  ? "Fill out details to create a new pricing record."
                  : 'You can edit or view details of the selected pricing record.'}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                margin="dense"
                label="Crop ID"
                type="text"
                fullWidth
                value={selectedCropId}
                disabled
              />
              { !isNewPricing && (
                  <TextField
                    margin="dense"
                    label="Pricing ID"
                    type="text"
                    fullWidth
                    value={selectedPricing?.name || ""}
                    disabled={!isNewPricing}
                  />
                )
              }
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={selectedPricing?.name || ""}
                onChange={(e) =>
                  setSelectedPricing((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={selectedPricing?.payment_mode || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, payment_mode: e.target.value } : null
                    )
                  }
                  label="Payment Mode"
                >
                  <MenuItem value="" disabled>Select Payment Mode</MenuItem>
                  <MenuItem value="CASH">CASH</MenuItem>
                  <MenuItem value="EMI">EMI</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Extent Details
              </Typography>
              <FormControl fullWidth margin="dense">
                <InputLabel>Extent Unit Type</InputLabel>
                <Select
                  value={selectedPricing?.extent_unit_type || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, extent_unit_type: e.target.value } : null
                    )
                  }
                  label="Extent Unit Type"
                >
                  <MenuItem value="" disabled>Select extent unit type</MenuItem>
                  <MenuItem value="acre">Acre</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" gap={2}>
                <TextField
                  margin="dense"
                  label="Minimum Value"
                  type="number"
                  fullWidth
                  value={selectedPricing?.extent_min_value || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, extent_min_value: +e.target.value } : null
                    )
                  }
                />
                <TextField
                  margin="dense"
                  label="Maximum Value"
                  type="number"
                  fullWidth
                  value={selectedPricing?.extent_max_value || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, extent_max_value: +e.target.value } : null
                    )
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Unit Pricing
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  margin="dense"
                  label="Price Per Acre"
                  type="number"
                  fullWidth
                  value={selectedPricing?.price_per_acre || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, price_per_acre: +e.target.value } : null
                    )
                  }
                />
                <TextField
                  margin="dense"
                  label="Price Per Cent"
                  type="number"
                  fullWidth
                  value={selectedPricing?.price_per_cent || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, price_per_cent: +e.target.value } : null
                    )
                  }
                />
                <TextField
                  margin="dense"
                  label="Total Price"
                  type="number"
                  fullWidth
                  value={selectedPricing?.total_price || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, total_price: +e.target.value } : null
                    )
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Validity Period
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  margin="dense"
                  label="Valid From"
                  type="date"
                  fullWidth
                  value={selectedPricing?.valid_from || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, valid_from: e.target.value } : null
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  margin="dense"
                  label="Valid To"
                  type="date"
                  fullWidth
                  value={selectedPricing?.valid_to || ""}
                  onChange={(e) =>
                    setSelectedPricing((prev) =>
                      prev ? { ...prev, valid_to: e.target.value } : null
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={selectedPricing?.description || ""}
                onChange={(e) =>
                  setSelectedPricing((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openCropDialog} onClose={() => setOpenCropDialog(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Create New Crop</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                label="Crop Name"
                fullWidth
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCropDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateCrop} disabled={!newCropName.trim()} variant="contained">
                Create
              </Button>
            </DialogActions>
          </Dialog>
      </Container>
    </Fade>
  );
};

export default PricingPage;
