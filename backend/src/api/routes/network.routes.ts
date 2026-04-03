import { Router } from 'express';

// Custom Imports
import { send } from '../controllers/network.controller';

const router = Router();

router.post('/send', send);

export default router;
