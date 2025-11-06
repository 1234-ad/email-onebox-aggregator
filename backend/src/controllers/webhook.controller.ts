import { Request, Response } from 'express';
import webhookService from '../services/webhook.service';
import logger from '../utils/logger';

export const testWebhooks = async (req: Request, res: Response) => {
  try {
    const results = await webhookService.testWebhooks();
    
    res.json({
      success: true,
      data: {
        slack: results.slack ? 'Success' : 'Failed or not configured',
        generic: results.generic ? 'Success' : 'Failed or not configured'
      }
    });
  } catch (error) {
    logger.error('Error testing webhooks:', error);
    res.status(500).json({ success: false, error: 'Webhook test failed' });
  }
};
