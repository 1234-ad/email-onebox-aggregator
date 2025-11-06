import express from 'express';
import cors from 'cors';
import { config, getEmailAccounts } from './config';
import routes from './routes';
import imapService from './services/imap.service';
import ragService from './services/rag.service';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', routes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing services...');
    
    // Initialize RAG with default context
    await ragService.initializeDefaultContext();
    logger.info('RAG service initialized');
    
    // Connect to email accounts
    const accounts = getEmailAccounts();
    
    if (accounts.length === 0) {
      logger.warn('No email accounts configured. Please add accounts in .env file');
    } else {
      logger.info(`Connecting to ${accounts.length} email account(s)...`);
      
      for (const account of accounts) {
        await imapService.connectAccount(account);
      }
      
      logger.info('All email accounts connected');
    }
  } catch (error) {
    logger.error('Error initializing services:', error);
  }
}

// Start server
const PORT = config.port;

app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📧 Environment: ${config.nodeEnv}`);
  logger.info(`🔍 Elasticsearch: ${config.elasticsearch.node}`);
  
  await initializeServices();
  
  logger.info('✅ Email Onebox Aggregator is ready!');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await imapService.disconnectAll();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await imapService.disconnectAll();
  process.exit(0);
});

export default app;
