import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Wrench, ShieldAlert } from 'lucide-react';
import { dummyComplaints } from '../lib/dummyData';

export default function TrackComplaint() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(dummyComplaints[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = dummyComplaints.find(c => 
      c.id.toLowerCase().includes(query.toLowerCase()) || 
      c.phone.includes(query)
    );
    setResult(found || null);
  };

  const steps = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="glass-card p-6 rounded-2xl text-center space-y-4">
        <h1 className="text-2xl font-bold">Track Complaint Status</h1>
        <p className="text-xs text-slate-500">Enter your Reference ID (e.g., JAL-84920) or Registered Phone Number</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-sm"
            placeholder="Enter Complaint ID or Phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center space-x-2 text-sm">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {result ? (
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary">{result.id}</span>
              <h2 className="text-xl font-bold">{result.category}</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 w-fit">
              {result.status}
            </span>
          </div>

          {/* Timeline Visualiser */}
          <div className="py-4">
            <div className="flex justify-between items-center relative">
              {steps.map((step, idx) => {
                const currentIdx = steps.indexOf(result.status);
                const isDone = idx <= currentIdx;
                return (
                  <div key={idx} className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isDone ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      {idx + 1}
                    </div>
                    <span className="text-xs mt-2 font-medium hidden sm:block">{step}</span>
                  </div>
                );
              })}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400">Assigned Engineer:</span>
              <p className="font-semibold text-sm">{result.assigned_engineer}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400">Estimated Resolution:</span>
              <p className="font-semibold text-sm">{result.estimated_completion}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1 sm:col-span-2">
              <span className="text-slate-400">Address Location:</span>
              <p className="font-semibold">{result.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">No complaint records found.</div>
      )}
    </div>
  );
}