import axios from 'axios';
import { config } from '../config';
import { Email } from '../types';
import logger from '../utils/logger';

class WebhookService {
  async sendSlackNotification(email: Email): Promise<void> {
    if (!config.webhooks.slack) {
      logger.warn('Slack webhook URL not configured');
      return;
    }

    try {
      const message = {
        text: '🎯 New Interested Email!',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎯 New Interested Email Received'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*From:*\n${email.from}`
              },
              {
                type: 'mrkdwn',
                text: `*Subject:*\n${email.subject}`
              },
              {
                type: 'mrkdwn',
                text: `*Date:*\n${new Date(email.date).toLocaleString()}`
              },
              {
                type: 'mrkdwn',
                text: `*Account:*\n${email.accountId}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Preview:*\n${email.body.substring(0, 200)}...`
            }
          }
        ]
      };

      await axios.post(config.webhooks.slack, message);
      logger.info('Slack notification sent successfully');
    } catch (error) {
      logger.error('Error sending Slack notification:', error);
    }
  }

  async sendGenericWebhook(email: Email): Promise<void> {
    if (!config.webhooks.generic) {
      logger.warn('Generic webhook URL not configured');
      return;
    }

    try {
      const payload = {
        event: 'email.interested',
        timestamp: new Date().toISOString(),
        data: {
          emailId: email.id,
          from: email.from,
          to: email.to,
          subject: email.subject,
          body: email.body,
          date: email.date,
          category: email.category,
          accountId: email.accountId
        }
      };

      await axios.post(config.webhooks.generic, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      logger.info('Generic webhook triggered successfully');
    } catch (error) {
      logger.error('Error sending generic webhook:', error);
    }
  }

  async testWebhooks(): Promise<{ slack: boolean; generic: boolean }> {
    const results = { slack: false, generic: false };

    // Test Slack
    if (config.webhooks.slack) {
      try {
        await axios.post(config.webhooks.slack, {
          text: '✅ Slack webhook test successful!'
        });
        results.slack = true;
        logger.info('Slack webhook test passed');
      } catch (error) {
        logger.error('Slack webhook test failed:', error);
      }
    }

    // Test Generic
    if (config.webhooks.generic) {
      try {
        await axios.post(config.webhooks.generic, {
          event: 'webhook.test',
          timestamp: new Date().toISOString(),
          message: 'Generic webhook test successful!'
        });
        results.generic = true;
        logger.info('Generic webhook test passed');
      } catch (error) {
        logger.error('Generic webhook test failed:', error);
      }
    }

    return results;
  }
}

export default new WebhookService();
