import React from 'react';

function ReportsCharts() {
  // Mock data for bar chart
  const barChartData = [
    { name: 'Tech Conference 2024', value: 900, color: 'bg-purple-500' },
    { name: 'Startup Expo 2024', value: 550, color: 'bg-purple-400' },
    { name: 'Charity Gala', value: 1250, color: 'bg-blue-500' },
    { name: 'Music Festival 2024', value: 950, color: 'bg-green-500' },
    { name: 'Health & Wellness Summit', value: 450, color: 'bg-yellow-400' },
    { name: '', value: 600, color: 'bg-cyan-400' },
    { name: '', value: 950, color: 'bg-red-500' }
  ];

  const maxValue = Math.max(...barChartData.map(d => d.value));

  // Pie chart data
  const pieData = [
    { label: 'Used', value: 66.2, color: 'bg-green-500' },
    { label: 'Unused', value: 22.4, color: 'bg-blue-500' },
    { label: 'Cancelled', value: 11.4, color: 'bg-red-500' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Attendance per Event - Bar Chart */}
      <div className="p-6 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Attendance per Event</h3>
        <div className="space-y-3">
          {barChartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-32 text-xs text-[var(--text-muted)] truncate">
                {item.name}
              </div>
              <div className="flex-1 h-12 bg-[var(--bg-main)] rounded flex items-center">
                <div
                  className={`h-full ${item.color} rounded flex items-center justify-end pr-2`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Event Filter */}
        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm font-medium text-[var(--text-muted)]">Event:</label>
          <select className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer">
            <option>All Events</option>
            <option>Tech Conference 2024</option>
            <option>Startup Expo 2024</option>
          </select>
          <select className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer">
            <option>All Organizers</option>
            <option>Sarah Johnson</option>
            <option>Emily Carter</option>
          </select>
        </div>
      </div>

      {/* Right Column - Pie Chart and Line Chart */}
      <div className="space-y-6">
        {/* Ticket Status - Pie Chart */}
        <div className="p-6 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ticket Status</h3>
          <div className="flex items-center gap-6">
            {/* Pie Chart Visual */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Used - 66.2% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeDasharray="165.8 251.2"
                  strokeDashoffset="0"
                />
                {/* Unused - 22.4% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="56.2 251.2"
                  strokeDashoffset="-165.8"
                />
                {/* Cancelled - 11.4% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="28.6 251.2"
                  strokeDashoffset="-222"
                />
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex-1 space-y-3">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-[var(--text-muted)]">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registrations Over Time - Line Chart */}
        <div className="p-6 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Registrations Over Time</h3>
          <div className="h-40 flex items-end justify-between gap-2 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-[var(--text-muted)]">
              <span>1,500</span>
              <span>1,000</span>
              <span>500</span>
              <span>0</span>
            </div>
            
            {/* Line Chart Area */}
            <div className="flex-1 ml-10 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-200/30 to-transparent rounded-t-lg"></div>
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <polyline
                  points="0,80 25,60 50,50 75,35 100,20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="0%" cy="80" r="4" fill="#3b82f6" />
                <circle cx="25%" cy="60" r="4" fill="#3b82f6" />
                <circle cx="50%" cy="50" r="4" fill="#3b82f6" />
                <circle cx="75%" cy="35" r="4" fill="#3b82f6" />
                <circle cx="100%" cy="20" r="4" fill="#3b82f6" />
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-[var(--text-muted)]">
                <span>Jan 2024</span>
                <span>April 2024</span>
                <span>June 2024</span>
                <span>Apr 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsCharts;
