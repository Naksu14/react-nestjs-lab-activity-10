import React, { useState } from 'react';
import { useAllOrganizers, useUpdateOrganizer, useArchiveOrganizer, useRestoreOrganizer } from '../../hooks/adminSideHooks/event-useOrganizerTable';
import CreateOrganizerModal from '../modal/createUserModal';
import ConfirmModal from '../modal/ConfirmModal';
import Toast from './Toast';

function OrganizerTable({ organizers = [], status = 'active' }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [organizerToArchive, setOrganizerToArchive] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  // Mock data if no organizers provided
  const mockOrganizers = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    fullname: `John Doe ${i + 1}`,
    email: `organizer${i + 1}@example.com`,
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  }));

  const data = organizers.length > 0 ? organizers : mockOrganizers;
  const { data: allOrganizers, isLoading, isError } = useAllOrganizers();
  const { mutateAsync: updateOrganizer } = useUpdateOrganizer();
  const { mutateAsync: archiveOrganizer } = useArchiveOrganizer();
  const { mutateAsync: restoreOrganizer } = useRestoreOrganizer();

  // Filter organizers based on status
  const filteredOrganizers = allOrganizers?.filter((organizer) => {
    if (status === 'all') return !organizer.isArchived; // All = non-archived only
    if (status === 'active') return organizer.isActive && !organizer.isArchived;
    if (status === 'inactive') return !organizer.isActive && !organizer.isArchived;
    if (status === 'archived') return organizer.isArchived; // Archived = separate section
    return true;
  }) || [];

  const handleEdit = (organizer) => {
    setSelectedOrganizer(organizer);
    setModalOpen(true);
  };

  const handleView = (organizer) => {
    setSelectedOrganizer(organizer);
    setModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    await updateOrganizer({ id: selectedOrganizer.id, data: formData });
  };

  const handleArchive = async (organizerId) => {
    setOrganizerToArchive(organizerId);
    setConfirmModalOpen(true);
  };

  const handleRestore = async (organizerId) => {
    await restoreOrganizer(organizerId);
    setToast({ show: true, message: 'Organizer restored successfully!', type: 'success' });
  };

  const confirmArchive = async () => {
    if (organizerToArchive) {
      await archiveOrganizer(organizerToArchive);
      setOrganizerToArchive(null);
      setToast({ show: true, message: 'Organizer archived successfully!', type: 'success' });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrganizer(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">Error loading users.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[35%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrganizers.map((organizer, index) => (
              <tr
                key={organizer.id}
                className={`border-b border-[var(--border-color)] ${
                  index % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-main)]'
                } hover:bg-[var(--bg-secondary)] transition-colors`}
              >
                <td className="px-6 py-4 text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{`${organizer.firstname} ${organizer.lastname}`}</p>
                </td>
                <td className="px-6 py-4 text-left">
                  <p className="text-sm text-[var(--text-primary)]">{organizer.email}</p>
                </td>
                <td className="px-6 py-4 text-left">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      organizer.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {organizer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {organizer.isArchived ? (
                      // Archived: Show View + Restore
                      <>
                        <button 
                          onClick={() => handleView(organizer)}
                          className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center justify-center"
                          title="View organizer details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleRestore(organizer.id)}
                          className="text-green-500 hover:text-green-700 transition-colors inline-flex items-center justify-center"
                          title="Restore organizer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      // Active/Inactive: Show Edit + Archive
                      <>
                        <button 
                          onClick={() => handleEdit(organizer)}
                          className="text-blue-500 hover:text-blue-700 transition-colors inline-flex items-center justify-center"
                          title="Edit organizer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleArchive(organizer.id)}
                          className="text-red-500 hover:text-red-700 transition-colors inline-flex items-center justify-center"
                          title="Archive organizer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4v6m4-6v6" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <CreateOrganizerModal
      isOpen={modalOpen}
      onClose={handleCloseModal}
      onCreate={selectedOrganizer ? handleUpdate : undefined}
      organizer={selectedOrganizer}
    />
    <ConfirmModal
      isOpen={confirmModalOpen}
      onClose={() => setConfirmModalOpen(false)}
      onConfirm={confirmArchive}
      title="Archive Organizer"
      message="Are you sure you want to archive this organizer? They will no longer have access to the system."
      confirmText="Yes, Archive"
      cancelText="No, Cancel"
    />
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.show}
      onClose={() => setToast({ ...toast, show: false })}
    />
    </>
  );
}

export default OrganizerTable;
