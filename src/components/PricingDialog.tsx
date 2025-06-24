import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import { Pricing } from "../types";

interface PricingDialogProps {
  open: boolean;
  isNewPricing: boolean;
  selectedCropId: string;
  selectedCropName: string;
  selectedPricing: Pricing | null;
  setSelectedPricing: React.Dispatch<React.SetStateAction<Pricing | null>>;
  handleCloseDialog: () => void;
  handleSave: () => void;
  handleDelete: () => void;
}

export const PricingDialog: React.FC<PricingDialogProps> = ({
  open,
  isNewPricing,
  selectedCropId,
  selectedCropName,
  selectedPricing,
  setSelectedPricing,
  handleCloseDialog,
  handleSave,
  handleDelete
}) => {
  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          {isNewPricing ? "Add New Pricing" : "View / Edit Pricing"}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            {isNewPricing
              ? "Fill out details to create a new pricing record."
              : "You can edit or view details of the selected pricing record."}
          </Typography>
        </Box>
        {!isNewPricing && (<Button color="error" variant="outlined" onClick={handleDelete}>Delete</Button>)}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              margin="dense"
              label="Crop ID"
              fullWidth
              value={selectedCropId}
              disabled
            />
          </Grid>
          <Grid size={6}>
            <TextField
              margin="dense"
              label="Crop Name"
              fullWidth
              value={selectedCropName}
              disabled
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {!isNewPricing && (
            <Grid size={12}>
              <TextField
                margin="dense"
                label="Pricing ID"
                fullWidth
                value={selectedPricing?.id || ""}
                disabled
              />
            </Grid>
          )}
          <Grid size={12}>
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
          </Grid>
        </Grid>

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
            <MenuItem value="" disabled>
              Select Payment Mode
            </MenuItem>
            <MenuItem value="OUT-RIGHT">CASH</MenuItem>
            <MenuItem value="EMI">EMI</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Extent Details
        </Typography>

        <FormControl fullWidth margin="dense">
          <InputLabel>Extent Unit</InputLabel>
          <Select
            value={selectedPricing?.extent_unit || ""}
            onChange={(e) =>
              setSelectedPricing((prev) =>
                prev ? { ...prev, extent_unit: e.target.value } : null
              )
            }
            label="Extent Unit"
          >
            <MenuItem value="" disabled>
              Select extent unit
            </MenuItem>
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
                prev
                  ? { ...prev, extent_min_value: +e.target.value }
                  : null
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
                prev
                  ? { ...prev, extent_max_value: +e.target.value }
                  : null
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
            label="Cost Per Acre"
            type="number"
            fullWidth
            value={selectedPricing?.cost_per_acre || ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              const perCent = value / 100;
              setSelectedPricing((prev) =>
                prev
                  ? {
                      ...prev,
                      cost_per_acre: value,
                      cost_per_cent: +perCent.toFixed(2),
                    }
                  : null
              );
            }}
          />
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            margin="dense"
            label="Cost Per Cent"
            type="number"
            fullWidth
            value={
              selectedPricing?.cost_per_cent != null
                ? selectedPricing.cost_per_cent.toFixed(2)
                : ""
            }
            disabled
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

        {!isNewPricing && (
          <TextField
            margin="dense"
            label="Status"
            fullWidth
            value={selectedPricing?.status || ""}
            disabled
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isNewPricing ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
