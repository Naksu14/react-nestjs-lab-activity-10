import React, { useState } from 'react';
import { useCreateOrganizer } from '../../hooks/adminSideHooks/event-useOrganizerTable';
import CreateOrganizerModal from '../modal/createUserModal';

function OrganizerFilters({ onSearch, onStatusChange, onRoleChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('active');
  const [role, setRole] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    onRoleChange(newRole);
  };

  const { mutateAsync: createOrganizer } = useCreateOrganizer();

  const handleCreate = async (formData) => {
    await createOrganizer({ ...formData, role: 'organizer', isActive: true });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 mt-4">
      {/* Tabs and Search Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Role Tabs */}
          <div className="flex items-center gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'organizer', label: 'Organizers' },
              { value: 'attendee', label: 'Attendees' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => handleRoleChange(item.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  role === item.value
                    ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                status === 'active'
                  ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusChange('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                status === 'inactive'
                  ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
              }`}
            >
              Inactive
            </button>
            <button
              onClick={() => handleStatusChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                status === 'all'
                  ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Right Side: Archived + Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => handleStatusChange('archived')}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                status === 'archived'
                  ? 'bg-gray-100 text-gray-800 border-2 border-gray-400'
                  : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Archived
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
                View archived users
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:shadow-lg shadow-[var(--accent-color)]/20"
            onClick={() => setModalOpen(true)}
            type='button'
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add organizer
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-64">
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
          className="pl-10 pr-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent w-full"
        />
      </div>

      <CreateOrganizerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default OrganizerFilters;
