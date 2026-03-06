import { Box, Typography } from '@mui/material';

const layers = [
  { name: 'ApplicationLayer', displayName: '7. Application Layer' },
  { name: 'TransportLayer', displayName: '4. Transport Layer' },
  { name: 'NetworkLayer', displayName: '3. Network Layer' },
  { name: 'DataLinkLayer', displayName: '2. Data Link Layer' },
  { name: 'PhysicalLayer', displayName: '1. Physical Layer' },
  { name: 'Orchestrator', displayName: 'Orchestrator' },
];

interface OSILayersProps {
  currentLayer: string;
}

const OSILayers = ({ currentLayer }: OSILayersProps) => {
  return (
    <Box>
      <Typography variant="h6">OSI Model</Typography>
      {layers.map((layer) => (
        <Box
          key={layer.name}
          sx={{
            p: 2,
            my: 1,
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor:
              currentLayer === layer.name ? '#e0f7fa' : '#fff',
            transition: 'background-color 0.3s',
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: currentLayer === layer.name ? 'bold' : 'normal' }}
          >
            {layer.displayName}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default OSILayers;
