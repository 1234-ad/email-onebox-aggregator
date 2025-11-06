import axios from 'axios';
import { Email, SearchFilters, Account } from '../types';

const API_BASE = '/api';

export const emailService = {
  async getEmails(filters: SearchFilters = {}) {
    const response = await axios.get(`${API_BASE}/emails`, { params: filters });
    return response.data;
  },

  async getEmailById(id: string) {
    const response = await axios.get(`${API_BASE}/emails/${id}`);
    return response.data;
  },

  async searchEmails(query: string, filters: SearchFilters = {}) {
    const response = await axios.get(`${API_BASE}/emails/search`, {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  async categorizeEmail(id: string) {
    const response = await axios.post(`${API_BASE}/emails/${id}/categorize`);
    return response.data;
  }
};

export const accountService = {
  async getAccounts(): Promise<{ success: boolean; data: Account[] }> {
    const response = await axios.get(`${API_BASE}/accounts`);
    return response.data;
  },

  async syncAccounts() {
    const response = await axios.post(`${API_BASE}/accounts/sync`);
    return response.data;
  }
};

export const aiService = {
  async suggestReply(emailId: string) {
    const response = await axios.post(`${API_BASE}/ai/suggest-reply/${emailId}`);
    return response.data;
  },

  async addContext(context: any) {
    const response = await axios.post(`${API_BASE}/ai/context`, context);
    return response.data;
  }
};

export const webhookService = {
  async testWebhooks() {
    const response = await axios.post(`${API_BASE}/webhooks/test`);
    return response.data;
  }
};
