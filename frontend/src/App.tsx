import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';
import axios from 'axios';
import OSILayers from './components/OSILayers';

// Define the LogEntry type to match the backend
interface LogEntry {
  timestamp: string;
  message: string;
  layer: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR';
}

function App() {
  const [payload, setPayload] = useState('Hello, OSI!');
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);
  const [currentLayer, setCurrentLayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (allLogs.length > 0) {
      let logIndex = 0;
      const interval = setInterval(() => {
        if (logIndex < allLogs.length) {
          const currentLog = allLogs[logIndex];
          setDisplayedLogs((prev) => [...prev, currentLog]);
          setCurrentLayer(currentLog.layer);
          logIndex++;
        } else {
          clearInterval(interval);
        }
      }, 300); // Delay between log entries
      return () => clearInterval(interval);
    }
  }, [allLogs]);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setAllLogs([]);
    setDisplayedLogs([]);
    setCurrentLayer('');

    try {
      const response = await axios.post('http://localhost:3001/simulate', {
        payload,
      });
      setAllLogs(response.data.logs);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred during simulation.',
      );
      if (err.response?.data?.logs) {
        setAllLogs(err.response.data.logs);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          OSI Packet Simulator
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Payload"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleSimulate}
              disabled={loading || !payload}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Simulate'}
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box
              sx={{
                mt: 4,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                height: '400px',
                overflowY: 'auto',
                fontFamily: 'monospace',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Logs
              </Typography>
              {displayedLogs.map((log, index) => (
                <div key={index}>
                  <span
                    style={{ color: log.type === 'ERROR' ? 'red' : 'inherit' }}
                  >
                    [{log.timestamp.split('T')[1].slice(0, 12)}] [{log.layer}]{' '}
                    {log.message}
                  </span>
                </div>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <OSILayers currentLayer={currentLayer} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
