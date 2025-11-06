import React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchFilters, EmailCategory } from '../types';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  accounts: Array<{ id: string; user: string }>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, accounts }) => {
  return (
    <div className="p-4 bg-white border-b space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search emails..."
          value={filters.query || ''}
          onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filters:</span>
        </div>

        <select
          value={filters.accountId || ''}
          onChange={(e) => onFiltersChange({ ...filters, accountId: e.target.value || undefined })}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Accounts</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.user}
            </option>
          ))}
        </select>

        <select
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value as EmailCategory || undefined })}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {Object.values(EmailCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {(filters.query || filters.accountId || filters.category) && (
          <button
            onClick={() => onFiltersChange({})}
            className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
