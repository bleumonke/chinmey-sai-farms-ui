import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Divider
} from '@mui/material';
import {
  GoogleMap,
  Polygon,
  useJsApiLoader
} from '@react-google-maps/api';
import AddIcon from '@mui/icons-material/Add';

type Coordinates = {
  lat: number;
  lng: number;
};

interface GTagInformationProps {
  centerCoordinates?: Coordinates;
  perimeterCoordinates?: Coordinates[];
  zoom?: number;
  mapHeight?: string;
}

const GTagInformation: React.FC<GTagInformationProps> = ({
  centerCoordinates,
  perimeterCoordinates = [],
  zoom = 15,
  mapHeight = '400px'
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDLOSyNsZtFdtPGwV0wyxgAkwdvXIb1bOQ'
  });

  const [localPerimeter, setLocalPerimeter] = useState<Coordinates[]>(perimeterCoordinates);

  useEffect(() => {
    setLocalPerimeter(perimeterCoordinates);
  }, [perimeterCoordinates]);

  const handleCoordinateChange = (index: number, key: 'lat' | 'lng', value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const updated = [...localPerimeter];
    updated[index] = { ...updated[index], [key]: num };
    setLocalPerimeter(updated);
  };

  const handleAddCoordinate = () => {
    setLocalPerimeter([...localPerimeter, { lat: 0, lng: 0 }]);
  };

  if (loadError) return <Typography>Error loading map</Typography>;
  if (!isLoaded) return <Typography>Loading map...</Typography>;

  return (
    <Paper sx={{ padding: 2 }} elevation={0}>
      <Grid container spacing={2}>
        {/* Left Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Center Coordinates
            </Typography>
            {centerCoordinates ? (
              <Grid container spacing={1} my={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    label="Latitude"
                    value={centerCoordinates.lat.toFixed(6)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    label="Longitude"
                    value={centerCoordinates.lng.toFixed(6)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ) : (
              <Typography>No center coordinates provided</Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="subtitle1">
                Perimeter Coordinates
              </Typography>
              <Button
                variant="outlined"
                onClick={handleAddCoordinate}
                size="small"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>

            {localPerimeter.length > 0 ? (
              localPerimeter.map((coord, idx) => (
                <Box key={idx} display="flex" gap={2} mb={1}>
                  <TextField
                    label={`Lat ${idx + 1}`}
                    value={coord.lat}
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1 }}
                    onChange={(e) => handleCoordinateChange(idx, 'lat', e.target.value)}
                  />
                  <TextField
                    label={`Lng ${idx + 1}`}
                    value={coord.lng}
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1 }}
                    onChange={(e) => handleCoordinateChange(idx, 'lng', e.target.value)}
                  />
                </Box>
              ))
            ) : (
              <Typography>No perimeter coordinates provided</Typography>
            )}
          </Box>
        </Grid>

        {/* Map */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ width: '100%', height: mapHeight }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={centerCoordinates || { lat: 0, lng: 0 }}
              zoom={zoom}
            >
              {localPerimeter.length > 2 && (
                <Polygon
                  paths={localPerimeter}
                  options={{
                    fillColor: '#2196f3',
                    fillOpacity: 0.3,
                    strokeColor: '#1976d2',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              )}
            </GoogleMap>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GTagInformation;
