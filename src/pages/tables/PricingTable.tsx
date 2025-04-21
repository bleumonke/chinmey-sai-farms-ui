import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DataTable, { ColumnDef } from "../../components/DataTableV2";
import { getPricingByCropId } from "../../api";

interface Pricing {
  id: string;
  name: string;
  payment_mode: string;
  status: string;
}

interface PricingTableProps {
  cropId: string
}

const PricingTable: React.FC<PricingTableProps> = ({cropId}) => {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Pricing>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    { label: "Payment Mode", accessor: "payment_mode" },
    { label: "status", accessor: "status"}
  ];

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await getPricingByCropId(cropId);
        setPricing(response.data);
      } catch (error) {
        console.error("Failed to fetch layouts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  return (
    <DataTable
      title="Pricing"
      columns={columns}
      data={pricing}
      loading={loading}
      onAddClick={() => navigate(`/agent/crops/${cropId}/pricing/new`)}
      onViewDetails={(id) => navigate(`/agent/crops/${cropId}/pricing/${id}/edit`)}
    />
  );
};

export default PricingTable;