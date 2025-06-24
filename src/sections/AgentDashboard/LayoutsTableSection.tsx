import React from 'react';
import { useNavigate } from "react-router-dom";
import TableSection from "../../components/TableSection";
import { ColumnDef } from "../../components/DataTable";
import type { Layout } from '../../types';
import { useLayouts } from './hooks/useLayouts';

const columns: ColumnDef<Layout>[] = [
  { label: "Name", accessor: "name" },
  { label: "Area (acers)", accessor: "area_in_acres" },
  { 
    label: "Address", 
    accessor: "address",
    render: (row) =>
      [row.address, row.city, row.state, row.country, row.zip_code].filter(Boolean).join(", ")
  },
  { label: "Number of plots", accessor: "number_of_plots" },
];

interface LayoutTableSectionProps{
  onAddNew: () => void;
}

const LayoutsTableSection: React.FC<LayoutTableSectionProps> = ({onAddNew}) => {
  const navigate = useNavigate();
  const { data:layouts, isLoading, isError, error } = useLayouts();

  return (
    <TableSection
      columns={columns}
      data={layouts ?? []}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onAddNew={onAddNew}
      onViewDetails={(id) => navigate(`/agent/layouts/${id}/edit`)}
      searchPlaceholder="Search layouts..."
      searchFields={["name", "address", "city", "state", "country", "zip_code"]}
    />
  );
};

export default LayoutsTableSection;
