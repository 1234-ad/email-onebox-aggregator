import { Client } from '@elastic/elasticsearch';
import { config } from '../config';
import { Email, SearchQuery } from '../types';
import logger from '../utils/logger';

class ElasticsearchService {
  private client: Client;
  private index = config.elasticsearch.index;

  constructor() {
    this.client = new Client({ node: config.elasticsearch.node });
    this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      const exists = await this.client.indices.exists({ index: this.index });
      
      if (!exists) {
        await this.client.indices.create({
          index: this.index,
          body: {
            mappings: {
              properties: {
                accountId: { type: 'keyword' },
                messageId: { type: 'keyword' },
                from: { type: 'text' },
                to: { type: 'text' },
                cc: { type: 'text' },
                subject: { type: 'text' },
                body: { type: 'text' },
                bodyHtml: { type: 'text' },
                date: { type: 'date' },
                folder: { type: 'keyword' },
                category: { type: 'keyword' },
                read: { type: 'boolean' }
              }
            }
          }
        });
        logger.info('Elasticsearch index created');
      }
    } catch (error) {
      logger.error('Error initializing Elasticsearch index:', error);
    }
  }

  async indexEmail(email: Email): Promise<void> {
    try {
      await this.client.index({
        index: this.index,
        id: email.id,
        document: email
      });
      logger.info(`Email indexed: ${email.id}`);
    } catch (error) {
      logger.error('Error indexing email:', error);
      throw error;
    }
  }

  async bulkIndexEmails(emails: Email[]): Promise<void> {
    try {
      const operations = emails.flatMap(email => [
        { index: { _index: this.index, _id: email.id } },
        email
      ]);

      await this.client.bulk({ operations });
      logger.info(`Bulk indexed ${emails.length} emails`);
    } catch (error) {
      logger.error('Error bulk indexing emails:', error);
      throw error;
    }
  }

  async searchEmails(query: SearchQuery): Promise<{ emails: Email[]; total: number }> {
    try {
      const must: any[] = [];

      if (query.query) {
        must.push({
          multi_match: {
            query: query.query,
            fields: ['subject^2', 'body', 'from', 'to']
          }
        });
      }

      if (query.accountId) {
        must.push({ term: { accountId: query.accountId } });
      }

      if (query.folder) {
        must.push({ term: { folder: query.folder } });
      }

      if (query.category) {
        must.push({ term: { category: query.category } });
      }

      if (query.from || query.to) {
        const range: any = {};
        if (query.from) range.gte = query.from;
        if (query.to) range.lte = query.to;
        must.push({ range: { date: range } });
      }

      const page = query.page || 1;
      const limit = query.limit || 20;

      const result = await this.client.search({
        index: this.index,
        body: {
          query: must.length > 0 ? { bool: { must } } : { match_all: {} },
          sort: [{ date: 'desc' }],
          from: (page - 1) * limit,
          size: limit
        }
      });

      const emails = result.hits.hits.map(hit => hit._source as Email);
      const total = typeof result.hits.total === 'number' 
        ? result.hits.total 
        : result.hits.total?.value || 0;

      return { emails, total };
    } catch (error) {
      logger.error('Error searching emails:', error);
      throw error;
    }
  }

  async getEmailById(id: string): Promise<Email | null> {
    try {
      const result = await this.client.get({
        index: this.index,
        id
      });
      return result._source as Email;
    } catch (error) {
      logger.error('Error getting email by ID:', error);
      return null;
    }
  }

  async updateEmail(id: string, updates: Partial<Email>): Promise<void> {
    try {
      await this.client.update({
        index: this.index,
        id,
        doc: updates
      });
      logger.info(`Email updated: ${id}`);
    } catch (error) {
      logger.error('Error updating email:', error);
      throw error;
    }
  }
}

export default new ElasticsearchService();
