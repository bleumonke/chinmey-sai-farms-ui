import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTable";
import type { Layout } from '../../types';
import { useLayouts } from './hooks/useLayouts';

const LayoutsTableSection: React.FC = () => {
  const navigate = useNavigate();
  const { layouts, isLoading, isError, error } = useLayouts();

  const columns: ColumnDef<Layout>[] = [
    { label: "Name", accessor: "name" },
    { label: "Area (acers)", accessor: "area_in_acres" },
    { label: "Address", accessor: "address",
      render: (row) =>
        [row.address, row.city, row.state, row.country, row.zip_code].filter(Boolean).join(", ")
    },
    { label: "Number of plots", accessor: "number_of_plots" },
  ];

  if (isError) {
    return <Alert severity="error">Error fetching layouts: {error?.message || 'Unknown error'}</Alert>;
  }

  return (
    <DataTable
      title="Layouts"
      columns={columns}
      data={layouts}
      loading={isLoading}
      onViewDetails={(id) => navigate(`/agent/layouts/${id}/edit`)}
    />
  );
};

export default LayoutsTableSection;
