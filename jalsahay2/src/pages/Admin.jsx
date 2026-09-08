import React, { useState } from 'react';
import { dummyComplaints } from '../lib/dummyData';

export default function Admin() {
  const [complaints, setComplaints] = useState(dummyComplaints);

  const updateStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Municipal Authority Admin Panel</h1>
        <p className="text-sm text-slate-500">Manage incoming complaints and update status dispatched to field workers.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/50">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Category</th>
              <th className="p-4">Ward</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {complaints.map((c) => (
              <tr key={c.id}>
                <td className="p-4 font-mono font-bold text-primary">{c.id}</td>
                <td className="p-4">{c.category}</td>
                <td className="p-4">Ward {c.ward_number}</td>
                <td className="p-4 font-semibold text-rose-500">{c.priority}</td>
                <td className="p-4">{c.status}</td>
                <td className="p-4">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white/50 dark:bg-slate-800"
                  >
                    <option>Submitted</option>
                    <option>Assigned</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}