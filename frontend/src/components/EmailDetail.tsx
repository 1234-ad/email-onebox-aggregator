import React from 'react';
import { Email, EmailCategory } from '../types';
import { X, Tag, Sparkles } from 'lucide-react';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onSuggestReply: (emailId: string) => void;
  suggestedReply?: string;
  loadingReply?: boolean;
}

const categoryColors: Record<EmailCategory, string> = {
  [EmailCategory.INTERESTED]: 'bg-green-100 text-green-800',
  [EmailCategory.MEETING_BOOKED]: 'bg-blue-100 text-blue-800',
  [EmailCategory.NOT_INTERESTED]: 'bg-red-100 text-red-800',
  [EmailCategory.SPAM]: 'bg-gray-100 text-gray-800',
  [EmailCategory.OUT_OF_OFFICE]: 'bg-yellow-100 text-yellow-800',
  [EmailCategory.UNCATEGORIZED]: 'bg-gray-100 text-gray-600'
};

export const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onClose,
  onSuggestReply,
  suggestedReply,
  loadingReply
}) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {email.subject}
        </h2>
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">{email.from}</p>
              <p className="text-xs text-gray-500 mt-1">
                To: {email.to.join(', ')}
              </p>
              {email.cc && email.cc.length > 0 && (
                <p className="text-xs text-gray-500">
                  Cc: {email.cc.join(', ')}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(email.date).toLocaleString()}
            </p>
          </div>

          {email.category && email.category !== EmailCategory.UNCATEGORIZED && (
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[email.category]}`}>
                <Tag className="h-4 w-4" />
                {email.category}
              </span>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          {email.bodyHtml ? (
            <div dangerouslySetInnerHTML={{ __html: email.bodyHtml }} />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-gray-700">
              {email.body}
            </pre>
          )}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Attachments ({email.attachments.length})
            </h3>
            <div className="space-y-2">
              {email.attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{att.filename}</span>
                  <span className="text-xs text-gray-400">
                    ({(att.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => onSuggestReply(email.id)}
            disabled={loadingReply}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4" />
            {loadingReply ? 'Generating...' : 'Suggest Reply (AI)'}
          </button>

          {suggestedReply && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                AI Suggested Reply:
              </h4>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                {suggestedReply}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
