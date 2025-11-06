import { Router } from 'express';
import emailRoutes from './email.routes';
import aiRoutes from './ai.routes';
import webhookRoutes from './webhook.routes';
import accountRoutes from './account.routes';

const router = Router();

router.use('/emails', emailRoutes);
router.use('/ai', aiRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/accounts', accountRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
