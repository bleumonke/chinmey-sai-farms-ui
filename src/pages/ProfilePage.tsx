import React from 'react';
import { Container, Typography, Grid, Fade } from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog';
import Notification from '../components/Notification';
import ActionButton from '../components/ActionButton';

const ProfilePage: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    console.log('Confirmed deletion');
    setShowSuccess(true);
    handleClose();
  };

  return (
    <Fade in={true} timeout={300}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Profile Management
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={400}>
          Manage your profile information here. You can view and edit your personal details.
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
          <Grid size={{ xs: 12, sm: 2 }}>
            <ActionButton
              label='Save'
              onClick={handleOpen}
              color='success'
              variant='outlined'
              sx={{ mt: 2, mb: 2 }}
              fullWidth
            />
          </Grid>
        </Grid>

        <ConfirmDialog
          open={open}
          title="Save Changes"
          message="Are you sure you want to save the changes to your profile?"
          onClose={handleClose}
          onConfirm={handleConfirm}
          confirmLabel="Apply Changes"
          confirmColor="success"
        />

        <Notification
          open={showSuccess}
          severity="success"
          message="Profile changes saved successfully!"
          onClose={() => setShowSuccess(false)}
        />
      </Container>
    </Fade>
  );
};

export default ProfilePage;
