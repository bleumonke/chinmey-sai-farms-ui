import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DataTable, { ColumnDef } from "../../components/DataTableV2";
import { getCrops } from "../../api";

interface Crop {
  id: string;
  name: string;
}

const CropsTable: React.FC = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Crop>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
  ];

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await getCrops();
        setCrops(response.data);
      } catch (error) {
        console.error("Failed to fetch layouts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  return (
    <DataTable
      title="Crops"
      columns={columns}
      data={crops}
      loading={loading}
      onAddClick={() => navigate("/agent/crops/new")}
      onViewDetails={(id) => navigate(`/agent/crops/${id}/edit`)}
    />
  );
};

export default CropsTable;