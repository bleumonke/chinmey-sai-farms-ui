import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTableV2/DataTableV2";
import type { Plot } from '../../types';
import { useLayoutPlots } from './hooks/useLayoutPlots';

interface PlotTableProps {
  layoutId: string;
}

const PlotsTableSection: React.FC<PlotTableProps> = ({layoutId}) => {
  const navigate = useNavigate();
  const { plots, isLoading, isError, error } = useLayoutPlots(layoutId);

  const columns: ColumnDef<Plot>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    { label: "Number", accessor: "number" },
    { label: "Active", accessor: "is_active" },
    { label: "Sold", accessor: "is_sold" },

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
      onAddClick={() => navigate(`/agent/layouts/${layoutId}/plots/new`)}
      onViewDetails={(id) => navigate(`/agent/layouts/${layoutId}/plots/${id}/edit`)}
    />
  );
};

export default PlotsTableSection;