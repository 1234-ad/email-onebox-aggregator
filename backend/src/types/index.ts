export interface EmailAccount {
  id: string;
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
}

export interface Email {
  id: string;
  accountId: string;
  messageId: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  date: Date;
  folder: string;
  category?: EmailCategory;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
}

export enum EmailCategory {
  INTERESTED = 'Interested',
  MEETING_BOOKED = 'Meeting Booked',
  NOT_INTERESTED = 'Not Interested',
  SPAM = 'Spam',
  OUT_OF_OFFICE = 'Out of Office',
  UNCATEGORIZED = 'Uncategorized'
}

export interface SearchQuery {
  query?: string;
  accountId?: string;
  folder?: string;
  category?: EmailCategory;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

export interface RagContext {
  product: string;
  agenda: string;
  meetingLink?: string;
  additionalInfo?: string;
}
