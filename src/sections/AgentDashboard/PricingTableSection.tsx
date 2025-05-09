import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTableV2/DataTableV2";
import type { Pricing } from '../../types';
import { useCropPricing } from './hooks/useCropPricing';

interface PricingTableProps {
  cropId: string
}

const PricingTableSection: React.FC<PricingTableProps> = ({cropId}) => {
  const navigate = useNavigate();
  const { pricing, isLoading, isError, error } = useCropPricing(cropId);

  const columns: ColumnDef<Pricing>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    { label: "Payment Mode", accessor: "payment_mode" },
    { label: "status", accessor: "status"}
  ];

  if (isError) {
    return <Alert severity="error">Error fetching pricing: {error?.message || 'Unknown error'}</Alert>;
      }

  return (
    <DataTable
      title="Pricing"
      columns={columns}
      data={pricing}
      loading={isLoading}
      onAddClick={() => navigate(`/agent/crops/${cropId}/pricing/new`)}
      onViewDetails={(id) => navigate(`/agent/crops/${cropId}/pricing/${id}/edit`)}
    />
  );
};

export default PricingTableSection;