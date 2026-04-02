// Custom imports
import app from '../app';
import { env } from '../config/env';

const PORT = env.PORT || 3001;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is firing on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
