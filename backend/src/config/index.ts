import dotenv from 'dotenv';
import { EmailAccount } from '../types';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    index: 'emails'
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4-turbo-preview'
  },
  
  webhooks: {
    slack: process.env.SLACK_WEBHOOK_URL || '',
    generic: process.env.GENERIC_WEBHOOK_URL || ''
  },
  
  rag: {
    chromaPath: process.env.CHROMA_PATH || './chroma_db',
    collectionName: process.env.VECTOR_COLLECTION_NAME || 'email_context'
  },
  
  sync: {
    days: parseInt(process.env.SYNC_DAYS || '30', 10)
  }
};

export const getEmailAccounts = (): EmailAccount[] => {
  const accounts: EmailAccount[] = [];
  
  let i = 1;
  while (process.env[`IMAP_HOST_${i}`]) {
    accounts.push({
      id: `account_${i}`,
      host: process.env[`IMAP_HOST_${i}`]!,
      port: parseInt(process.env[`IMAP_PORT_${i}`] || '993', 10),
      user: process.env[`IMAP_USER_${i}`]!,
      password: process.env[`IMAP_PASSWORD_${i}`]!,
      tls: process.env[`IMAP_TLS_${i}`] === 'true'
    });
    i++;
  }
  
  return accounts;
};
