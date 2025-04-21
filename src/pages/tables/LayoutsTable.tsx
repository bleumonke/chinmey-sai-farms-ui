import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DataTable, { ColumnDef } from "../../components/DataTableV2";
import { getLayouts} from "../../api";

interface Layout {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  area_in_acres: number;
}

const LayoutsTable: React.FC = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const response = await getLayouts();
        setLayouts(response.data);
      } catch (error) {
        console.error("Failed to fetch layouts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  return (
    <DataTable
      title="Layouts"
      columns={columns}
      data={layouts}
      loading={loading}
      onAddClick={() => navigate("/agent/layouts/new")}
      onViewDetails={(id) => navigate(`/agent/layouts/${id}/edit`)}
    />
  );
};

export default LayoutsTable;