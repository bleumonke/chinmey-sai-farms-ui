import React from 'react';
import { Typography, Container, Paper, Stack } from '@mui/material';
import CustomersTable from '../tables/CustomersTable';
import LayoutsTable from '../tables/LayoutsTable'
import CropsTable from '../tables/CropTable';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
        <Stack spacing={5}>
         <Typography variant='h4'>Welcome Jane Doe</Typography>
         <CustomersTable />
         <LayoutsTable />
         <CropsTable />
        </Stack>
    </Container>
  );
};

export default Dashboard;