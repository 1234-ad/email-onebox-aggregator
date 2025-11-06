import { Request, Response } from 'express';
import elasticsearchService from '../services/elasticsearch.service';
import aiService from '../services/ai.service';
import { SearchQuery } from '../types';
import logger from '../utils/logger';

export const getEmails = async (req: Request, res: Response) => {
  try {
    const query: SearchQuery = {
      query: req.query.q as string,
      accountId: req.query.accountId as string,
      folder: req.query.folder as string,
      category: req.query.category as any,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20
    };

    const result = await elasticsearchService.searchEmails(query);
    
    res.json({
      success: true,
      data: result.emails,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        pages: Math.ceil(result.total / (query.limit || 20))
      }
    });
  } catch (error) {
    logger.error('Error getting emails:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch emails' });
  }
};

export const getEmailById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const email = await elasticsearchService.getEmailById(id);
    
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }
    
    res.json({ success: true, data: email });
  } catch (error) {
    logger.error('Error getting email by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch email' });
  }
};

export const searchEmails = async (req: Request, res: Response) => {
  try {
    const query: SearchQuery = {
      query: req.query.q as string,
      accountId: req.query.accountId as string,
      folder: req.query.folder as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20
    };

    const result = await elasticsearchService.searchEmails(query);
    
    res.json({
      success: true,
      data: result.emails,
      total: result.total
    });
  } catch (error) {
    logger.error('Error searching emails:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};

export const categorizeEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const email = await elasticsearchService.getEmailById(id);
    
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }
    
    const category = await aiService.categorizeEmail(email);
    await elasticsearchService.updateEmail(id, { category });
    
    res.json({ success: true, data: { category } });
  } catch (error) {
    logger.error('Error categorizing email:', error);
    res.status(500).json({ success: false, error: 'Categorization failed' });
  }
};
