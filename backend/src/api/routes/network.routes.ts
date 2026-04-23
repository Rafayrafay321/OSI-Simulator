import { Router } from 'express';

// Custom Imports
import { send } from '../controllers/network.controller';
import { createTopology, getTopology } from '../controllers/topology.controller';

const router = Router();

router.post('/topology', createTopology);
router.get('/topology/:id', getTopology);
router.post('/send', send);

export default router;
