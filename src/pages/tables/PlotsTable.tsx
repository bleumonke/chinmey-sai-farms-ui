import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DataTable, { ColumnDef } from "../../components/DataTableV2";
import { getLayoutPlots } from "../../api";

interface Plot {
  id: string;
  name: string;
  number: string;
  is_active: string;
  is_sold: string;
}

interface PlotTableProps {
  layoutId: string;
}

const PlotsTable: React.FC<PlotTableProps> = ({layoutId}) => {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Plot>[] = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    { label: "Number", accessor: "number" },
    { label: "Active", accessor: "is_active" },
    { label: "Sold", accessor: "is_sold" },

  ];

  useEffect(() => {
    const fetchplots = async () => {
      try {
        const response = await getLayoutPlots(layoutId);
        setPlots(response.data);
      } catch (error) {
        console.error("Failed to fetch layouts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchplots();
  }, []);

  return (
    <DataTable
      title="Plots"
      columns={columns}
      data={plots}
      loading={loading}
      onAddClick={() => navigate(`/agent/layouts/${layoutId}/plots/new`)}
      onViewDetails={(id) => navigate(`/agent/layouts/${layoutId}/plots/${id}/edit`)}
    />
  );
};

export default PlotsTable;