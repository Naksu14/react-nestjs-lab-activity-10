import React, { useState } from 'react';
import AdminTopNav from '../../../components/adminSide/AdminTopNav';
import AdminSidebar from '../../../components/adminSide/AdminSidebar';
import ReportsHeader from '../../../components/adminSide/ReportsHeader';
import ReportsFilters from '../../../components/adminSide/ReportsFilters';
import ReportsStats from '../../../components/adminSide/ReportsStats';
import ReportsTable from '../../../components/adminSide/ReportsTable';

function EventReportsPage() {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [organizer, setOrganizer] = useState('all');
  const [status, setStatus] = useState('');

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleOrganizerChange = (org) => {
    setOrganizer(org);
  };

  const handleStatusChange = (stat) => {
    setStatus(stat);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <AdminTopNav />
          
          {/* Page Content */}
          <div className="p-8">
            {/* Header with Export Buttons */}
            <ReportsHeader />
            
            {/* Filters */}
            <ReportsFilters 
              onDateRangeChange={handleDateRangeChange}
              onOrganizerChange={handleOrganizerChange}
              onStatusChange={handleStatusChange}
            />
            
            {/* Stats Cards */}
            <ReportsStats />
            
            {/* Events Table */}
            <ReportsTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventReportsPage;