import React, { useState } from 'react';
import { Bookmark, Bell, FileText, Award, Settings } from 'lucide-react';
import { dummyComplaints } from '../lib/dummyData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('complaints');

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent text-white font-bold text-2xl flex items-center justify-center">
          AS
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">Aarav Sharma</h1>
          <p className="text-xs text-slate-500">Citizen ID: CIT-90412 • Ward 12</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-sm">
        {['complaints', 'bookmarks', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize font-semibold transition-all ${activeTab === tab ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {dummyComplaints.map((c) => (
            <div key={c.id} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div>
                <span className="text-xs font-mono font-bold text-primary">{c.id}</span>
                <h3 className="font-bold text-base">{c.category}</h3>
                <p className="text-xs text-slate-500">{c.address}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="text-center py-8 text-slate-400 text-sm">No bookmarked complaints or municipal notices yet.</div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl glass-card text-xs space-y-1">
            <span className="text-primary font-bold">In-App Alert</span>
            <p>Engineer Rajesh Kumar was assigned to complaint JAL-84920.</p>
          </div>
        </div>
      )}
    </div>
  );
}