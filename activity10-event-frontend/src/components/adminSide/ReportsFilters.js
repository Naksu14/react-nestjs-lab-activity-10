import React, { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { usersService } from '../../services/adminSideService';

function ReportsFilters({ onDateRangeChange, onOrganizerChange, onStatusChange, statusOptions = [], organizerCounts = new Map(), totalEventsCount = 0 }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const [organizer, setOrganizer] = useState('all');
  const [status, setStatus] = useState('');
  const [organizers, setOrganizers] = useState([]);
  const [orgQuery, setOrgQuery] = useState('');
  const [orgOpen, setOrgOpen] = useState(false);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);

  // Helper to calculate date ranges for presets
  const getDateRange = (preset) => {
    const today = new Date(2026, 0, 11); // January 11, 2026
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    
    switch (preset) {
      case 'all':
        return { startDate: '', endDate: '' };
      case 'thisMonth':
        return {
          startDate: `${year}-${String(month + 1).padStart(2, '0')}-01`,
          endDate: `${year}-${String(month + 1).padStart(2, '0')}-31`
        };
      case 'last30':
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        return {
          startDate: last30.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };

      default:
        return { startDate: '', endDate: '' };
    }
  };

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    const range = getDateRange(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    onDateRangeChange(range);
  };

  useEffect(() => {
    let mounted = true;
    setIsLoadingOrgs(true);
    usersService
      .getAllOrganizers()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setOrganizers(list);
        setIsLoadingOrgs(false);
      })
      .catch(() => {
        setOrganizers([]);
        setIsLoadingOrgs(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Display selected organizer label in input when closed
  useEffect(() => {
    if (!orgOpen) {
      if (organizer === 'all') setOrgQuery('All Organizers');
      else {
        const sel = organizers.find((o) => String(o.id) === String(organizer));
        const name = ((sel?.firstname || '') + ' ' + (sel?.lastname || '')).trim();
        setOrgQuery(name || 'Select Organizer');
      }
    }
  }, [organizer, organizers, orgOpen]);

  const handleStartDateChange = (e) => {
    setDatePreset('');
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

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setDatePreset('all');
    setOrganizer('all');
    setStatus('');
    onDateRangeChange({ startDate: '', endDate: '' });
    onOrganizerChange('all');
    onStatusChange('');
  };

  // Check if any filter is customized
  const isFiltered = datePreset !== 'all' || organizer !== 'all' || status !== '';

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] p-6 mb-6">
      <div className="flex items-end gap-4 flex-wrap">
        {/* Date Range Section */}
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Date Range</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePresetChange('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  datePreset === 'all'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('thisMonth')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  datePreset === 'thisMonth'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('last30')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  datePreset === 'last30'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                Last 30 Days
              </button>

            </div>
          </div>
        </div>

        {/* Organizer Section (searchable combobox) */}
        <div className="min-w-[280px] relative">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Organizer</label>
          <div className="relative">
            <input
              type="text"
              value={orgQuery}
              onChange={(e) => { setOrgQuery(e.target.value); setOrgOpen(true); }}
              onFocus={() => { setOrgOpen(true); setOrgQuery(''); }}
              placeholder="Search organizers..."
              className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setOrgOpen((o) => { const next = !o; if (next) setOrgQuery(''); return next; })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            >
              <ChevronDown size={18} />
            </button>
          </div>
          {orgOpen && (
            <div className="absolute z-10 mt-2 w-full max-h-56 overflow-auto border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] shadow-lg">
              {isLoadingOrgs ? (
                <div className="px-4 py-2 text-[var(--text-muted)] text-sm">Loading organizers...</div>
              ) : (
                (() => {
                  const searchQuery = orgQuery.trim().toLowerCase();
                  const showAllOrganizers = !searchQuery;
                  
                  const filteredOrganizers = organizers.filter((org) => {
                    const name = ((org.firstname || '') + ' ' + (org.lastname || '')).toLowerCase();
                    return name.includes(searchQuery);
                  });

                  if (!showAllOrganizers && filteredOrganizers.length === 0) {
                    return (
                      <div className="px-4 py-2 text-[var(--text-muted)] text-sm">No organizers found</div>
                    );
                  }

                  return (
                    <>
                      {showAllOrganizers && (
                        <>
                          <button
                            type="button"
                            onClick={() => { setOrganizer('all'); onOrganizerChange('all'); setOrgOpen(false); setOrgQuery('All Organizers'); }}
                            className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-[var(--bg-main)] text-[var(--text-primary)]"
                          >
                            <span>All Organizers</span>
                            <span className="text-xs text-[var(--text-muted)]">{totalEventsCount} events</span>
                          </button>
                          <div className="border-t border-[var(--border-color)]" />
                        </>
                      )}
                      {filteredOrganizers.map((org) => {
                        const name = ((org.firstname || '') + ' ' + (org.lastname || '')).trim() || org.email || `Organizer ${org.id}`;
                        const count = organizerCounts.get ? (organizerCounts.get(org.id) || 0) : (organizerCounts[org.id] || 0);
                        return (
                          <button
                            key={org.id}
                            type="button"
                            onClick={() => { setOrganizer(org.id); onOrganizerChange(org.id); setOrgOpen(false); setOrgQuery(name); }}
                            className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-[var(--bg-main)] text-[var(--text-primary)]"
                          >
                            <span>{name}</span>
                            <span className="text-xs text-[var(--text-muted)]">{count} events</span>
                          </button>
                        );
                      })}
                    </>
                  );
                })()
              )}
            </div>
          )}
        </div>

        {/* Status Section */}
        <div className="min-w-[240px]">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Status</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent cursor-pointer"
          >
            <option value="">All Status</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Reset Button - Only show when filters are customized */}
        {isFiltered && (
          <div className="ml-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-primary)] text-sm hover:bg-[var(--bg-card)] transition-colors"
            >
              <X size={16} />
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsFilters;
