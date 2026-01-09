import React, { useState } from 'react';
import AdminTopNav from '../../../components/adminSide/AdminTopNav';
import AdminSidebar from '../../../components/adminSide/AdminSidebar';
import OrganizerFilters from '../../../components/adminSide/OrganizerFilters';
import OrganizerTable from '../../../components/adminSide/OrganizerTable';
import Pagination from '../../../components/adminSide/Pagination';

function OrganizerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('active');

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
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
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Manage Organizers</h1>
          
          {/* Filters Section */}
          <OrganizerFilters onSearch={handleSearch} onStatusChange={handleStatusChange} />
          
          {/* Table Section */}
          <OrganizerTable />
          
          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerPage;