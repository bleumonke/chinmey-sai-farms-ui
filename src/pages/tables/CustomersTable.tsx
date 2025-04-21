import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DataTable, { ColumnDef } from "../../components/DataTableV2";
import { getCustomers } from "../../api";

interface Customer {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string
}

const CustomersTable: React.FC = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Customer>[] = [
    { label: "ID", accessor: "id" },
    { 
      label: "Name",
      accessor: "first_name",
      render: (row) =>
        [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" ")
    },
    { label: "Phone", accessor: "phone" },
    { label: "Email", accessor: "email" },
  ];

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const response = await getCustomers();
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
      title="Customers"
      columns={columns}
      data={layouts}
      loading={loading}
      onAddClick={() => navigate("/agent/customers/new")}
      onViewDetails={(id) => navigate(`/agent/customers/${id}/edit`)}
    />
  );
};

export default CustomersTable;