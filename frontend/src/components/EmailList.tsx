import React from 'react';
import { Email, EmailCategory } from '../types';
import { Mail, Clock, Tag } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  selectedEmailId?: string;
}

const categoryColors: Record<EmailCategory, string> = {
  [EmailCategory.INTERESTED]: 'bg-green-100 text-green-800',
  [EmailCategory.MEETING_BOOKED]: 'bg-blue-100 text-blue-800',
  [EmailCategory.NOT_INTERESTED]: 'bg-red-100 text-red-800',
  [EmailCategory.SPAM]: 'bg-gray-100 text-gray-800',
  [EmailCategory.OUT_OF_OFFICE]: 'bg-yellow-100 text-yellow-800',
  [EmailCategory.UNCATEGORIZED]: 'bg-gray-100 text-gray-600'
};

export const EmailList: React.FC<EmailListProps> = ({ emails, onEmailClick, selectedEmailId }) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="divide-y divide-gray-200">
      {emails.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Mail className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No emails found</p>
        </div>
      ) : (
        emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailClick(email)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedEmailId === email.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {email.from}
                </p>
                <p className="text-sm font-medium text-gray-700 truncate mt-1">
                  {email.subject}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">{formatDate(email.date)}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {email.body}
            </p>
            
            <div className="flex items-center gap-2">
              {email.category && email.category !== EmailCategory.UNCATEGORIZED && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[email.category]}`}>
                  <Tag className="h-3 w-3" />
                  {email.category}
                </span>
              )}
              <span className="text-xs text-gray-500">{email.accountId}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
