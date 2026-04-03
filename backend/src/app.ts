// Node imports
import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './api/middleware/errorMiddleware';

// Custom imports
import sendRoute from './api/routes/network.routes';

// Types
import { Application } from 'express';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', sendRoute);

// Health check route
app.get('/api/health', (req, res) => {
  res.send('API is running...');
});

app.use(globalErrorHandler);

export default app;
