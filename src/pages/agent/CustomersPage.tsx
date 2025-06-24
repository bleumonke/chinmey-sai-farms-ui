import React from 'react';
import { Container, Fade } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useCustomers } from '../../sections/AgentDashboard/hooks/useCustomers';
import TableSection from "../../components/TableSection";
import { ColumnDef } from "../../components/DataTable";
import type { Customer } from '../../types';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PageHeading from '../../components/PageHeading';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, isLoading, isError, error } = useCustomers();

  const columns: ColumnDef<Customer>[] = [
    {
      label: "",
      accessor: "icon",
      render: () => <AccountCircleRoundedIcon />,
    },
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

  return (
    <Fade in={true} timeout={300}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <PageHeading 
          title='Customer Management'
          sub_title='
          Manage all your customer records here. You can add, view, or edit customer information.
          Select an existing customer to view or edit their details, or click the button below to add a new customer.
          '
        />

        <TableSection<Customer>
          columns={columns}
          data={customers ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onAddNew={() => navigate('/agent/customers/new')}
          onViewDetails={(id) => navigate(`/agent/customers/${id}/edit`)}
          searchPlaceholder="Search customers..."
          searchFields={["first_name", "middle_name", "last_name", "email", "phone"]}
        />
      </Container>
    </Fade>
  );
};

export default CustomersPage;
