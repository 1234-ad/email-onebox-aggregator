import Imap from 'imap';
import { simpleParser, ParsedMail } from 'mailparser';
import { EmailAccount, Email, EmailCategory } from '../types';
import { config } from '../config';
import elasticsearchService from './elasticsearch.service';
import aiService from './ai.service';
import webhookService from './webhook.service';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

class ImapService {
  private connections: Map<string, Imap> = new Map();
  private syncInProgress: Set<string> = new Set();

  async connectAccount(account: EmailAccount): Promise<void> {
    try {
      const imap = new Imap({
        user: account.user,
        password: account.password,
        host: account.host,
        port: account.port,
        tls: account.tls,
        tlsOptions: { rejectUnauthorized: false }
      });

      this.connections.set(account.id, imap);

      imap.once('ready', () => {
        logger.info(`IMAP connected: ${account.user}`);
        this.syncAccount(account);
        this.setupIdleMode(account);
      });

      imap.once('error', (err: Error) => {
        logger.error(`IMAP error for ${account.user}:`, err);
      });

      imap.once('end', () => {
        logger.info(`IMAP connection ended: ${account.user}`);
      });

      imap.connect();
    } catch (error) {
      logger.error(`Error connecting to IMAP for ${account.user}:`, error);
      throw error;
    }
  }

  private setupIdleMode(account: EmailAccount): void {
    const imap = this.connections.get(account.id);
    if (!imap) return;

    imap.openBox('INBOX', false, (err) => {
      if (err) {
        logger.error(`Error opening INBOX for ${account.user}:`, err);
        return;
      }

      logger.info(`IDLE mode activated for ${account.user}`);

      imap.on('mail', (numNewMsgs: number) => {
        logger.info(`${numNewMsgs} new email(s) received for ${account.user}`);
        this.fetchNewEmails(account);
      });

      // Start IDLE
      const startIdle = () => {
        if (imap.state === 'authenticated') {
          imap.idle((err) => {
            if (err) logger.error('IDLE error:', err);
          });
        }
      };

      // Restart IDLE every 29 minutes (IMAP IDLE timeout is 30 min)
      setInterval(() => {
        imap.idle((err) => {
          if (err) logger.error('IDLE restart error:', err);
        });
      }, 29 * 60 * 1000);

      startIdle();
    });
  }

  private async syncAccount(account: EmailAccount): Promise<void> {
    if (this.syncInProgress.has(account.id)) {
      logger.info(`Sync already in progress for ${account.user}`);
      return;
    }

    this.syncInProgress.add(account.id);
    const imap = this.connections.get(account.id);
    if (!imap) return;

    try {
      imap.openBox('INBOX', true, async (err, box) => {
        if (err) {
          logger.error(`Error opening INBOX for sync: ${account.user}`, err);
          this.syncInProgress.delete(account.id);
          return;
        }

        const syncDate = new Date();
        syncDate.setDate(syncDate.getDate() - config.sync.days);

        const searchCriteria = [['SINCE', syncDate]];

        imap.search(searchCriteria, async (err, uids) => {
          if (err) {
            logger.error(`Error searching emails for ${account.user}:`, err);
            this.syncInProgress.delete(account.id);
            return;
          }

          if (uids.length === 0) {
            logger.info(`No emails to sync for ${account.user}`);
            this.syncInProgress.delete(account.id);
            return;
          }

          logger.info(`Syncing ${uids.length} emails for ${account.user}`);
          await this.fetchEmailsByUids(account, imap, uids, 'INBOX');
          this.syncInProgress.delete(account.id);
        });
      });
    } catch (error) {
      logger.error(`Error syncing account ${account.user}:`, error);
      this.syncInProgress.delete(account.id);
    }
  }

  private async fetchNewEmails(account: EmailAccount): Promise<void> {
    const imap = this.connections.get(account.id);
    if (!imap) return;

    imap.search(['UNSEEN'], async (err, uids) => {
      if (err) {
        logger.error(`Error fetching new emails for ${account.user}:`, err);
        return;
      }

      if (uids.length > 0) {
        await this.fetchEmailsByUids(account, imap, uids, 'INBOX');
      }
    });
  }

  private async fetchEmailsByUids(
    account: EmailAccount,
    imap: Imap,
    uids: number[],
    folder: string
  ): Promise<void> {
    const fetch = imap.fetch(uids, { bodies: '', markSeen: false });

    fetch.on('message', (msg) => {
      msg.on('body', async (stream) => {
        try {
          const parsed = await simpleParser(stream);
          const email = await this.parseEmail(parsed, account, folder);
          
          await elasticsearchService.indexEmail(email);
          
          // Categorize with AI
          const category = await aiService.categorizeEmail(email);
          await elasticsearchService.updateEmail(email.id, { category });
          
          // Send webhook if interested
          if (category === EmailCategory.INTERESTED) {
            await webhookService.sendSlackNotification(email);
            await webhookService.sendGenericWebhook(email);
          }
        } catch (error) {
          logger.error('Error processing email:', error);
        }
      });
    });

    fetch.once('error', (err) => {
      logger.error('Fetch error:', err);
    });

    fetch.once('end', () => {
      logger.info(`Finished fetching ${uids.length} emails for ${account.user}`);
    });
  }

  private async parseEmail(
    parsed: ParsedMail,
    account: EmailAccount,
    folder: string
  ): Promise<Email> {
    return {
      id: uuidv4(),
      accountId: account.id,
      messageId: parsed.messageId || uuidv4(),
      from: parsed.from?.text || '',
      to: parsed.to?.text ? [parsed.to.text] : [],
      cc: parsed.cc?.text ? [parsed.cc.text] : undefined,
      subject: parsed.subject || '(No Subject)',
      body: parsed.text || '',
      bodyHtml: parsed.html || undefined,
      date: parsed.date || new Date(),
      folder,
      read: false,
      attachments: parsed.attachments?.map(att => ({
        filename: att.filename || 'unknown',
        contentType: att.contentType,
        size: att.size
      }))
    };
  }

  async disconnectAll(): Promise<void> {
    for (const [accountId, imap] of this.connections) {
      imap.end();
      logger.info(`Disconnected IMAP for account: ${accountId}`);
    }
    this.connections.clear();
  }

  getConnectionStatus(): { accountId: string; connected: boolean }[] {
    return Array.from(this.connections.entries()).map(([accountId, imap]) => ({
      accountId,
      connected: imap.state === 'authenticated'
    }));
  }
}

export default new ImapService();
