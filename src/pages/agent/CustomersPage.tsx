import React from 'react';
import { Grid, Alert, Typography, Button, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useCustomers } from '../../sections/AgentDashboard/hooks/useCustomers';
import DataTable, { ColumnDef } from "../../components/DataTable";
import type { Customer } from '../../types';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, isLoading, isError, error } = useCustomers();

  const columns: ColumnDef<Customer>[] = [
    {
      label: "Customer Name",
      accessor: "first_name",
      render: (row) =>
        [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" "),
    },
    { label: "Phone", accessor: "phone" },
    { label: "Email", accessor: "email" },
    {
      label: "Address",
      accessor: "address",
      render: (row) => {
        const parts = [row.address, row.city, row.state, row.zip_code, row.country].filter(Boolean);
        return parts.join(", ");
      },
    },
  ];

  if (isError) {
    return (
      <Alert severity="error">
        Error fetching customers: {error?.message || 'Unknown error'}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Customer Management
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={400}>
        Manage all your customer records here. You can add, view, or edit customer information.
        <span>Select an existing customer to view or edit their details, or click the button below to add a new customer.</span>
      </Typography>
      <Grid container spacing={2} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <Button variant="outlined" sx={{ alignSelf: "flex-end", backgroundColor: 'black', color:'white' }} onClick={() => navigate('/agent/customers/new')}>
          Create Customer
        </Button>
        <Grid size={12}>
          <DataTable
            title="Customer List"
            columns={columns}
            data={customers}
            loading={isLoading}
            onViewDetails={(id) => navigate(`/agent/customers/${id}/edit`)}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomersPage;
