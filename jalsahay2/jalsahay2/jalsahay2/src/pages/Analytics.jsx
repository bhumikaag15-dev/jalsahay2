import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { dummyAnalytics } from '../lib/dummyData';

const COLORS = ['#2563EB', '#38BDF8', '#06B6D4', '#F59E0B', '#EF4444'];

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Municipal Water Analytics</h1>
        <p className="text-sm text-slate-500">Real-time resolution metrics and Ward complaint density.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold">Monthly Complaint Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyAnalytics.monthlyComplaints}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Bar dataKey="complaints" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Categories */}
        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold">Issue Breakdown by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dummyAnalytics.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {dummyAnalytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}