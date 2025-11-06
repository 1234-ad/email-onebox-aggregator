import { Request, Response } from 'express';
import ragService from '../services/rag.service';
import elasticsearchService from '../services/elasticsearch.service';
import { RagContext } from '../types';
import logger from '../utils/logger';

export const addContext = async (req: Request, res: Response) => {
  try {
    const context: RagContext = req.body;
    
    if (!context.product || !context.agenda) {
      return res.status(400).json({
        success: false,
        error: 'Product and agenda are required'
      });
    }
    
    await ragService.addContext(context);
    
    res.json({
      success: true,
      message: 'Context added successfully'
    });
  } catch (error) {
    logger.error('Error adding context:', error);
    res.status(500).json({ success: false, error: 'Failed to add context' });
  }
};

export const suggestReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const email = await elasticsearchService.getEmailById(id);
    
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }
    
    const reply = await ragService.suggestReply(email);
    
    res.json({
      success: true,
      data: {
        emailId: id,
        suggestedReply: reply
      }
    });
  } catch (error) {
    logger.error('Error suggesting reply:', error);
    res.status(500).json({ success: false, error: 'Failed to generate reply' });
  }
};

export const initializeContext = async (req: Request, res: Response) => {
  try {
    await ragService.initializeDefaultContext();
    
    res.json({
      success: true,
      message: 'Default context initialized'
    });
  } catch (error) {
    logger.error('Error initializing context:', error);
    res.status(500).json({ success: false, error: 'Failed to initialize context' });
  }
};
