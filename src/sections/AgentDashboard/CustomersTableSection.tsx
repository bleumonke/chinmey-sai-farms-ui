import React from 'react';
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import DataTable, { ColumnDef } from "../../components/DataTable";
import type { Customer } from '../../types';
import { useCustomers } from './hooks/useCustomers';

const CustomersTableSection: React.FC = () => {
  const navigate = useNavigate();
  const { customers, isLoading, isError, error } = useCustomers();

  const columns: ColumnDef<Customer>[] = [
    { 
      label: "Name",
      accessor: "first_name",
      render: (row) =>
        [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" ")
    },
    { label: "Phone", accessor: "phone" },
    { label: "Email", accessor: "email" },
  ];

  if (isError) {
    return <Alert severity="error">Error fetching customers: {error?.message || 'Unknown error'}</Alert>;
      }

  return (
    <DataTable
      title="Customers"
      columns={columns}
      data={customers}
      loading={isLoading}
      onAddClick={() => navigate("/agent/customers/new")}
      onViewDetails={(id) => navigate(`/agent/customers/${id}/edit`)}
    />
  );
};

export default CustomersTableSection;