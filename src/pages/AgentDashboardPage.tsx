import React from 'react';
import { Typography, Container, Paper, Stack } from '@mui/material';
import CustomersTableSection from '../sections/AgentDashboard/CustomersTableSection';
import LayoutsTableSection from '../sections/AgentDashboard/LayoutsTableSection';
import CropTableSection from '../sections/AgentDashboard/CropTableSection';

const AgentDashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
        <Stack spacing={5}>
         <Typography variant='h4'>Welcome Jane Doe</Typography>
         <CustomersTableSection />
         <LayoutsTableSection />
         <CropTableSection />
        </Stack>
    </Container>
  );
};

export default AgentDashboardPage;