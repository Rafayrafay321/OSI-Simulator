// Node imports
import express from 'express';
import cors from 'cors';

// Types
import { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/simulate', (req: Request, res: Response) => {
  const payload = req.body;
  res.status(200).json({
    message: 'Success',
  });
});

app.listen(port, () => {
  console.log('Server is listening on port http://localhost:3001');
});
