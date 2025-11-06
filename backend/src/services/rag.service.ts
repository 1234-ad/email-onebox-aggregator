import { ChromaClient } from 'chromadb';
import { config } from '../config';
import { RagContext, Email } from '../types';
import aiService from './ai.service';
import logger from '../utils/logger';

class RagService {
  private client: ChromaClient;
  private collectionName = config.rag.collectionName;

  constructor() {
    this.client = new ChromaClient();
    this.initializeCollection();
  }

  private async initializeCollection() {
    try {
      await this.client.getOrCreateCollection({
        name: this.collectionName,
        metadata: { description: 'Email context for RAG' }
      });
      logger.info('Chroma collection initialized');
    } catch (error) {
      logger.error('Error initializing Chroma collection:', error);
    }
  }

  async addContext(context: RagContext): Promise<void> {
    try {
      const collection = await this.client.getCollection({
        name: this.collectionName
      });

      const contextText = `Product: ${context.product}\nAgenda: ${context.agenda}${
        context.meetingLink ? `\nMeeting Link: ${context.meetingLink}` : ''
      }${context.additionalInfo ? `\nAdditional Info: ${context.additionalInfo}` : ''}`;

      await collection.add({
        ids: ['context_1'],
        documents: [contextText],
        metadatas: [{ type: 'product_context' }]
      });

      logger.info('Context added to vector database');
    } catch (error) {
      logger.error('Error adding context to vector database:', error);
      throw error;
    }
  }

  async getRelevantContext(query: string): Promise<string> {
    try {
      const collection = await this.client.getCollection({
        name: this.collectionName
      });

      const results = await collection.query({
        queryTexts: [query],
        nResults: 3
      });

      if (results.documents && results.documents[0]) {
        return results.documents[0].join('\n\n');
      }

      return '';
    } catch (error) {
      logger.error('Error retrieving context from vector database:', error);
      return '';
    }
  }

  async suggestReply(email: Email): Promise<string> {
    try {
      // Get relevant context from vector DB
      const query = `${email.subject} ${email.body.substring(0, 500)}`;
      const context = await this.getRelevantContext(query);

      if (!context) {
        logger.warn('No context found in vector database');
        return 'Unable to generate reply: No context available';
      }

      // Generate reply using AI with context
      const reply = await aiService.generateReply(email, context);
      
      logger.info('Reply suggestion generated successfully');
      return reply;
    } catch (error) {
      logger.error('Error suggesting reply:', error);
      throw error;
    }
  }

  async initializeDefaultContext(): Promise<void> {
    const defaultContext: RagContext = {
      product: 'Email Onebox Aggregator - A feature-rich email management system',
      agenda: 'We help teams manage multiple email accounts with AI-powered categorization and smart replies',
      meetingLink: 'https://cal.com/example',
      additionalInfo: 'Our system supports real-time IMAP sync, Elasticsearch search, and RAG-based reply suggestions'
    };

    await this.addContext(defaultContext);
  }
}

export default new RagService();
