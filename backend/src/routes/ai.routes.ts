import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = Router();

router.post('/context', aiController.addContext);
router.post('/context/initialize', aiController.initializeContext);
router.post('/suggest-reply/:id', aiController.suggestReply);

export default router;
