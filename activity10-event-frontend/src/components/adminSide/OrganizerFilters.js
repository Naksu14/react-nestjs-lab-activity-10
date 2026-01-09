import React, { useState } from 'react';

function OrganizerFilters({ onSearch, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('active');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onStatusChange(e.target.value);
  };

  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      <div className="flex items-center gap-3">
        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="status" className="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap">
            Filter:
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent cursor-pointer min-w-[120px]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Add Organizer Button */}
      <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:shadow-lg shadow-[var(--accent-color)]/20">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add organizer
      </button>
    </div>
  );
}

export default OrganizerFilters;
