import React from 'react';
import { useNavigate } from "react-router-dom";
import TableSection from "../../components/TableSection";
import { ColumnDef } from "../../components/DataTable";
import type { Plot } from '../../types';
import { useLayoutPlots } from './hooks/useLayouts';

interface PlotTableProps {
  layoutId: string;
}

const columns: ColumnDef<Plot>[] = [
  { label: "LP Number", accessor: "number" },
  { label: "Name", accessor: "name" },
  { label: "Area (acres)", accessor: "area_in_acres" },
  { label: "Crop ID", accessor: "crop_id" },
  { label: "Customer ID", accessor: "customer_id" }
];

const PlotsTableSection: React.FC<PlotTableProps> = ({ layoutId }) => {
  const navigate = useNavigate();
  const { data: plots, isLoading, isError, error } = useLayoutPlots(layoutId);

  return (
    <TableSection
      columns={columns}
      data={plots ?? []}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onAddNew={() => navigate(`/agent/layouts/${layoutId}/plots/new`)}
      onViewDetails={(id) => navigate(`/agent/layouts/${layoutId}/plots/${id}/edit`)}
      searchPlaceholder="Search plots..."
      searchFields={["number", "name", "crop_id", "customer_id"]}
    />
  );
};

export default PlotsTableSection;