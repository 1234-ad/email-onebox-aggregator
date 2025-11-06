import OpenAI from 'openai';
import { config } from '../config';
import { Email, EmailCategory } from '../types';
import logger from '../utils/logger';

class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: config.openai.apiKey });
  }

  async categorizeEmail(email: Email): Promise<EmailCategory> {
    try {
      const prompt = `Analyze this email and categorize it into ONE of these categories:
- Interested: The sender shows interest in the product/service/opportunity
- Meeting Booked: The email confirms or schedules a meeting
- Not Interested: The sender declines or shows no interest
- Spam: Promotional, unsolicited, or irrelevant content
- Out of Office: Automated out-of-office reply

Email Details:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 1000)}

Respond with ONLY the category name, nothing else.`;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an email categorization expert. Respond with only the category name.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 50
      });

      const category = response.choices[0]?.message?.content?.trim() || '';
      
      // Map response to enum
      const categoryMap: Record<string, EmailCategory> = {
        'Interested': EmailCategory.INTERESTED,
        'Meeting Booked': EmailCategory.MEETING_BOOKED,
        'Not Interested': EmailCategory.NOT_INTERESTED,
        'Spam': EmailCategory.SPAM,
        'Out of Office': EmailCategory.OUT_OF_OFFICE
      };

      const result = categoryMap[category] || EmailCategory.UNCATEGORIZED;
      logger.info(`Email categorized as: ${result}`);
      
      return result;
    } catch (error) {
      logger.error('Error categorizing email:', error);
      return EmailCategory.UNCATEGORIZED;
    }
  }

  async generateReply(email: Email, context: string): Promise<string> {
    try {
      const prompt = `Given this context about our product/service:
${context}

Generate a professional reply to this email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

The reply should be:
- Professional and concise
- Address the sender's points
- Include relevant information from the context
- Include any meeting links or next steps mentioned in the context

Generate only the email body, no subject line.`;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional email assistant. Generate clear, concise, and helpful email replies.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error generating reply:', error);
      throw error;
    }
  }
}

export default new AIService();
