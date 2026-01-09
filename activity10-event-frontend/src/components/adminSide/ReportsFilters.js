import React, { useState } from 'react';

function ReportsFilters({ onDateRangeChange, onOrganizerChange, onStatusChange }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organizer, setOrganizer] = useState('all');
  const [status, setStatus] = useState('');

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    onDateRangeChange({ startDate: e.target.value, endDate });
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    onDateRangeChange({ startDate, endDate: e.target.value });
  };

  const handleOrganizerChange = (e) => {
    setOrganizer(e.target.value);
    onOrganizerChange(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onStatusChange(e.target.value);
  };

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] p-6 mb-6">
      <div className="flex items-end gap-6">
        {/* Date Range Section */}
        <div className="flex items-end gap-4 flex-1">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Date Range</label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
              />
              <span className="text-[var(--text-muted)]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Organizer Section */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Organizer</label>
          <select
            value={organizer}
            onChange={handleOrganizerChange}
            className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent cursor-pointer"
          >
            <option value="all">All Organizers</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="emily">Emily Carter</option>
            <option value="sophia">Sophia Lee</option>
          </select>
        </div>

        {/* Status Section */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Status</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ReportsFilters;
