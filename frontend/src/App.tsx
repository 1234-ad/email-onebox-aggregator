import React, { useState, useEffect } from 'react';
import { EmailList } from './components/EmailList';
import { EmailDetail } from './components/EmailDetail';
import { SearchBar } from './components/SearchBar';
import { Email, SearchFilters, Account } from './types';
import { emailService, accountService, aiService } from './services/api';
import { Mail, RefreshCw, Inbox } from 'lucide-react';
import './index.css';

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState<string>('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  useEffect(() => {
    loadAccounts();
    loadEmails();
  }, []);

  useEffect(() => {
    loadEmails();
  }, [filters]);

  const loadAccounts = async () => {
    try {
      const response = await accountService.getAccounts();
      if (response.success) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadEmails = async () => {
    setLoading(true);
    try {
      const response = await emailService.getEmails(filters);
      if (response.success) {
        setEmails(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setSuggestedReply('');
  };

  const handleSuggestReply = async (emailId: string) => {
    setLoadingReply(true);
    try {
      const response = await aiService.suggestReply(emailId);
      if (response.success) {
        setSuggestedReply(response.data.suggestedReply);
      }
    } catch (error) {
      console.error('Error suggesting reply:', error);
      setSuggestedReply('Error generating reply. Please try again.');
    } finally {
      setLoadingReply(false);
    }
  };

  const connectedAccounts = accounts.filter(a => a.connected).length;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Onebox</h1>
                <p className="text-sm text-gray-500">
                  {connectedAccounts} of {accounts.length} accounts connected
                </p>
              </div>
            </div>
            <button
              onClick={loadEmails}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className="w-96 flex flex-col bg-white border-r">
          <SearchBar
            filters={filters}
            onFiltersChange={setFilters}
            accounts={accounts}
          />
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <EmailList
                emails={emails}
                onEmailClick={handleEmailClick}
                selectedEmailId={selectedEmail?.id}
              />
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                disabled={!filters.page || filters.page === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {filters.page || 1} of {pagination.pages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                disabled={filters.page === pagination.pages}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Email Detail */}
        <div className="flex-1 overflow-hidden">
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onClose={() => setSelectedEmail(null)}
              onSuggestReply={handleSuggestReply}
              suggestedReply={suggestedReply}
              loadingReply={loadingReply}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Inbox className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select an email to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
