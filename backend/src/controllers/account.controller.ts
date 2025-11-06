import { Request, Response } from 'express';
import { getEmailAccounts } from '../config';
import imapService from '../services/imap.service';
import logger from '../utils/logger';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = getEmailAccounts();
    const status = imapService.getConnectionStatus();
    
    const accountsWithStatus = accounts.map(account => ({
      id: account.id,
      user: account.user,
      host: account.host,
      connected: status.find(s => s.accountId === account.id)?.connected || false
    }));
    
    res.json({
      success: true,
      data: accountsWithStatus
    });
  } catch (error) {
    logger.error('Error getting accounts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch accounts' });
  }
};

export const syncAccounts = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Sync triggered (automatic via IDLE mode)'
    });
  } catch (error) {
    logger.error('Error syncing accounts:', error);
    res.status(500).json({ success: false, error: 'Sync failed' });
  }
};
