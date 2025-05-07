import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTableV2/DataTableV2";
import type { Layout } from '../../types';
import { useLayouts } from './hooks/useLayouts';

const LayoutsTableSection: React.FC = () => {
  const navigate = useNavigate();
  const { layouts, isLoading, isError, error } = useLayouts();

  const columns: ColumnDef<Layout>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    {
      label: "Address",
      accessor: "address",
      render: (row) =>
        `${row.address}\n${row.city}\n${row.state}, ${row.country}-${row.zip_code}`,
    },
    { label: "Area(acers)", accessor: "area_in_acres"}
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
      onAddClick={() => navigate("/agent/layouts/new")}
      onViewDetails={(id) => navigate(`/agent/layouts/${id}/edit`)}
    />
  );
};

export default LayoutsTableSection;