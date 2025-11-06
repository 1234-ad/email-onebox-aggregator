import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

router.post('/test', webhookController.testWebhooks);

export default router;
