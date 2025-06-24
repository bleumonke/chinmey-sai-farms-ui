import React, { useState } from "react";
import {
  Container,
  Fade,
  SelectChangeEvent,
  AlertColor
} from "@mui/material";
import { CreateCropDialog } from "../../components/CreateCropDialog";
import { PricingDialog } from "../../components/PricingDialog";
import Notification from "../../components/Notification";
import PageHeading from "../../components/PageHeading";
import DropDown from "../../components/DropDown";
import PricingTableSection from "../../sections/AgentDashboard/PricingTableSection";
import { useCrops, useCropPricing, useCreateCrop } from "../../sections/AgentDashboard/hooks/useCrops";
import { Pricing } from "../../types";
import { useCreatePricing, useUpdatePricing, useDeletePricing } from "../../sections/AgentDashboard/hooks/usePricing";

const PricingPage: React.FC = () => {
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
  const [isNewPricing, setIsNewPricing] = useState<boolean>(false);

  // Crop dialog state
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [newCropName, setNewCropName] = useState("");

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const showNotification = (message: string, severity: AlertColor = "success") => {
    setNotification({ open: true, message, severity });
  };

  const {data: crops = [], isLoading: isLoadingCrops} = useCrops();

  const selectedCropName = crops.find(crop => crop.id === selectedCropId)?.name || "";

  const {
    data: pricing = [],
    isLoading: isLoadingPricing,
    refetch, // Add refetch here
  } = useCropPricing(selectedCropId, {
    onError: () => showNotification("Failed to load pricing data", "error"),
  });

  const createCropMutation = useCreateCrop();

  const createPricingMutation = useCreatePricing();
  const updatePricingMutation = useUpdatePricing();
  const deletePricingMutation = useDeletePricing();

  // Handle crop selection
  const handleCropSelect = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value;
    if (value === "new") {
      setOpenCropDialog(true);
    } else {
      setSelectedCropId(String(value));
    }
  };

  // Create new crop via mutation
  const handleCreateCrop = async () => {
    try {
      const newCrop = await createCropMutation.mutateAsync({ name: newCropName });
      setNewCropName("");
      setOpenCropDialog(false);
      setSelectedCropId(newCrop.id);
      showNotification("Crop created successfully!", "success");
    } catch (error) {
      console.error("Failed to create crop:", error);
      showNotification("Failed to create crop", "error");
    }
  };

  // View existing pricing details
  const handleViewDetails = (id: string | number) => {
    const selected = pricing.find((p) => p.id === id);
    if (selected) {
      setIsNewPricing(false);
      setSelectedPricing(selected);
      setOpenDialog(true);
    }
  };

  // Add new pricing record
  const handleAddNewPricing = () => {
    setIsNewPricing(true);
    setSelectedPricing({
      id: Date.now().toString(),
      name: "",
      payment_mode: "",
      status: "Active",
    } as Pricing);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPricing(null);
  };

  const handleSave = async () => {
    if (!selectedPricing) return;
    try {
      const pricingData = {
        ...selectedPricing,
        crop_id: selectedCropId,
      };

      if (isNewPricing) {
        const { id, ...createData } = pricingData;
        await createPricingMutation.mutateAsync(createData);
        showNotification("Pricing created successfully!", "success");
      } else {
        const { id, ...updateData } = pricingData;
        if (!id) throw new Error("Pricing ID missing for update");
        await updatePricingMutation.mutateAsync({ pricingId: id, data: updateData });
        showNotification("Pricing updated successfully!", "success");
      }
      setOpenDialog(false);
      setSelectedPricing(null);
      refetch();
    } catch (error) {
      console.error("Failed to save pricing:", error);
      showNotification("Failed to save pricing", "error");
    }
  };

  // Delete pricing handler
  const handleDelete = async () => {
    if (!selectedPricing?.id) return;
    try {
      await deletePricingMutation.mutateAsync(selectedPricing.id);
      showNotification("Pricing deleted successfully!", "success");
      setOpenDialog(false);
      setSelectedPricing(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete pricing:", error);
      showNotification("Failed to delete pricing", "error");
    }
  };

  return (
    <Fade in timeout={300}>
      <Container maxWidth="lg" sx={{ padding: 2 }}>
        <PageHeading 
          title="Crop Pricing Management"
          sub_title="Select an existing crop to view and manage its pricing details, or create a
          new crop if it doesn't exist. You can view, edit, or add new pricing records
          for the selected crop."
        />
        <DropDown
          selected={selectedCropId}
          onChange={handleCropSelect}
          disabled={isLoadingCrops}
          isLoading={isLoadingCrops}
          items={crops}
          label="Select a crop"
          button={{
            title: "+ Create new crop",
            value: "new",
            onClick: () => setOpenCropDialog(true),
          }}
        />
        {selectedCropId && (
          <PricingTableSection
            pricing={pricing}
            isLoading={isLoadingPricing}
            onAddNewPricing={handleAddNewPricing}
            onViewDetails={handleViewDetails}
          />
        )}
        <PricingDialog
          open={openDialog}
          isNewPricing={isNewPricing}
          selectedCropId={selectedCropId}
          selectedCropName={selectedCropName}
          selectedPricing={selectedPricing}
          setSelectedPricing={setSelectedPricing}
          handleCloseDialog={handleCloseDialog}
          handleSave={handleSave}
          handleDelete={handleDelete}
        />
        <CreateCropDialog
          open={openCropDialog}
          cropName={newCropName}
          onCropNameChange={setNewCropName}
          onClose={() => setOpenCropDialog(false)}
          onCreate={handleCreateCrop}
        />
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        />
      </Container>
    </Fade>
  );
};

export default PricingPage;
