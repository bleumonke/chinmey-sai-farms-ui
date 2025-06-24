import React from "react";
import { Pricing } from "../../types";
import TableSection from "../../components/TableSection";
import { ColumnDef } from "../../components/DataTable";

interface PricingTableSectionProps {
  pricing: Pricing[];
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  onAddNewPricing: () => void;
  onViewDetails: (id: string | number) => void;
}

const columns: ColumnDef<Pricing>[] = [
  { label: "Payment Name", accessor: "name" },
  { label: "Payment Mode", accessor: "payment_mode" },
  { label: "Extent Unit Type", accessor: "extent_unit" },
  { label: "Price Per Acre", accessor: "cost_per_acre" },
  { label: "Status", accessor: "status" },
];

const PricingTableSection: React.FC<PricingTableSectionProps> = ({
  pricing,
  isLoading,
  isError,
  error,
  onAddNewPricing,
  onViewDetails,
}) => {
  return (
    <TableSection<Pricing>
      columns={columns}
      data={pricing}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onAddNew={onAddNewPricing}
      onViewDetails={onViewDetails}
      searchPlaceholder="Search pricing..."
      searchFields={["name", "payment_mode", "extent_unit", "status"]}
    />
  );
};

export default PricingTableSection;
