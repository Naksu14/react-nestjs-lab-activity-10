import React from 'react';

function OrganizerTable({ organizers = [] }) {
  // Mock data if no organizers provided
  const mockOrganizers = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    fullname: `John Doe ${i + 1}`,
    email: `organizer${i + 1}@example.com`,
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  }));

  const data = organizers.length > 0 ? organizers : mockOrganizers;

  return (
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
            {data.map((organizer, index) => (
              <tr
                key={organizer.id}
                className={`border-b border-[var(--border-color)] ${
                  index % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-main)]'
                } hover:bg-[var(--bg-secondary)] transition-colors`}
              >
                <td className="px-6 py-4 text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{organizer.fullname}</p>
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
                    {organizer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrganizerTable;
