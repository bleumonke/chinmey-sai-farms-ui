import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTable";
import type { Plot } from '../../types';
import { useLayoutPlots } from './hooks/useLayoutPlots';

interface PlotTableProps {
  layoutId: string;
}

const PlotsTableSection: React.FC<PlotTableProps> = ({layoutId}) => {
  const navigate = useNavigate();
  const { plots, isLoading, isError, error } = useLayoutPlots(layoutId);

  const columns: ColumnDef<Plot>[] = [
    { label: "LP Number", accessor: "number" },
    { label: "Name", accessor: "name" },
    { label: "Area (acres)", accessor: "area_in_acres" },
    { label: "Crop ID", accessor: "crop_id" },
    { label: "Customer ID", accessor: "customer_id" }
  ];

  if (isError) {
    return <Alert severity="error">Error fetching plots: {error?.message || 'Unknown error'}</Alert>;
      }

  return (
    <DataTable
      title="Plots"
      columns={columns}
      data={plots}
      loading={isLoading}
      onViewDetails={(id) => navigate(`/agent/layouts/${layoutId}/plots/${id}/edit`)}
    />
  );
};

export default PlotsTableSection;