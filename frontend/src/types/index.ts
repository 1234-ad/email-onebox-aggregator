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
  date: string;
  folder: string;
  category?: EmailCategory;
  read: boolean;
}

export enum EmailCategory {
  INTERESTED = 'Interested',
  MEETING_BOOKED = 'Meeting Booked',
  NOT_INTERESTED = 'Not Interested',
  SPAM = 'Spam',
  OUT_OF_OFFICE = 'Out of Office',
  UNCATEGORIZED = 'Uncategorized'
}

export interface Account {
  id: string;
  user: string;
  host: string;
  connected: boolean;
}

export interface SearchFilters {
  query?: string;
  accountId?: string;
  folder?: string;
  category?: EmailCategory;
  page?: number;
  limit?: number;
}
