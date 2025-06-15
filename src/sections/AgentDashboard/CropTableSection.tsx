import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTable";
import type { Crop } from '../../types';
import { useCrops } from './hooks/useCrops';

const CropTableSection: React.FC = () => {
  const navigate = useNavigate();
  const { crops, isLoading, isError, error } = useCrops();

  const columns: ColumnDef<Crop>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
  ];

  if (isError) {
    return <Alert severity="error">Error fetching crops: {error?.message || 'Unknown error'}</Alert>;
      }

  return (
    <DataTable
      title="Crops"
      columns={columns}
      data={crops}
      loading={isLoading}
      onViewDetails={(id) => navigate(`/agent/crops/${id}/edit`)}
    />
  );
};

export default CropTableSection;