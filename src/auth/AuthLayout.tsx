import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Grid, Paper, Typography } from '@mui/material';
// Using a generic icon for the main logo on the branding panel, user can replace
// For example, if they have a specific company logo as an SVG or image.
// import YourCompanyLogoIcon from './YourCompanyLogoIcon'; 

const AuthLayout: React.FC = () => {
  // const brandGreen = '#224F36'; // Removed as unused
  // const accentGreen = '#4A7856'; // Removed as unused

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      {/* Left Column: Form Area - Full width on small screens, 5/12 on medium+ */}
      <Grid 
        size={{ xs: 12, md: 5 }}
        component={Paper}
        elevation={0}
        square 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 0 }, // Add padding on small screens, remove for md+ where form centers itself
          backgroundColor: '#f7f9fc', // Added background color here
        }}
      >
        <Outlet />
      </Grid>

      {/* Right Column: Branding Panel with Background Image */}
      <Grid
        size={{ md: 7 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { md: 6 },
          color: 'white',
          position: 'relative', // For the overlay
          backgroundImage: 'url(/assests/login_image.png)', // UPDATED PATH: Assumes login_image.png IS IN /public/assests/ FOLDER
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for text readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
            zIndex: 1, // Ensure overlay is above background but below content
          }}
        />

        {/* Content (will be above the overlay due to zIndex or default stacking) */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative', // To ensure content is above the overlay
            zIndex: 2,
          }}
        >
 
          {/* Text Content Area - No longer needs internal flex for image, image is background */}
          <Box sx={{ textAlign: 'center', width: '100%', mb: 4}}> 
            <Typography component="h1" variant="h2" fontWeight="bold" gutterBottom>
              GROW WITH US
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
              Join our farming community today!
            </Typography>
          </Box>
          {/* Image Placeholder Box is REMOVED as image is now background */}
        </Box>

        {/* Bottom text */}
        <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', mt: 'auto', position: 'relative', zIndex: 2, pt:3 }}>
          CHINMAYI SAI AGRO FARMS
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthLayout; 