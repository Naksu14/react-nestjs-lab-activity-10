import React from 'react';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

function ReportsStats() {
  const stats = [
    {
      icon: <Calendar size={24} />,
      value: '25',
      label: 'Events Created',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600'
    },
    {
      icon: <Users size={24} />,
      value: '4,532',
      label: 'Registered Attendees',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600'
    },
    {
      icon: <CheckCircle size={24} />,
      value: '3,251',
      label: 'Total Check-ins',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600'
    },
    {
      icon: <XCircle size={24} />,
      value: '560',
      label: 'No-shows',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <div className={stat.iconColor}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReportsStats;
