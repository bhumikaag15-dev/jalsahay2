
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fullName = user?.user_metadata?.full_name || t.user;

  const initials = fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const citizenId = user?.id
    ? `CIT-${user.id.slice(0, 8).toUpperCase()}`
    : 'CIT-UNKNOWN';

  useEffect(() => {
    const loadComplaints = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading complaints:', error);
        setLoading(false);
        return;
      }

      setComplaints(data || []);
      setLoading(false);
    };

    loadComplaints();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">

      {/* USER PROFILE */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">

        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent text-white font-bold text-2xl flex items-center justify-center">
          {initials}
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">{fullName}</h1>

          <p className="text-xs text-slate-500">
            {t.citizenIdLabel}: {citizenId}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {user?.email}
          </p>
        </div>

      </div>

      {/* TABS */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-sm">

        {[[t.complaintsTab, 'complaints'], [t.bookmarksTab, 'bookmarks'], [t.notificationsTab, 'notifications']].map(([label, tab]) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize font-semibold transition-all ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {label}
          </button>

        ))}

      </div>

      {/* REAL COMPLAINTS */}
      {activeTab === 'complaints' && (

        <div className="space-y-4">

          {loading ? (

            <div className="text-center py-8 text-slate-400">
              {t.loadingYourComplaints}
            </div>

          ) : complaints.length === 0 ? (

            <div className="text-center py-12 text-slate-400">
              {t.noComplaintsSubmitted}
            </div>

          ) : (

            complaints.map((c) => (

              <div
                key={c.id}
                className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
              >

                <div>

                  <span className="text-xs font-mono font-bold text-primary">
                    {c.id}
                  </span>

                  <h3 className="font-bold text-base">
                    {c.category}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {c.address}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {t.priorityLabel}: {c.priority}
                  </p>

                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {c.status}
                </span>

              </div>

            ))

          )}

        </div>

      )}

      {/* BOOKMARKS */}
      {activeTab === 'bookmarks' && (

        <div className="text-center py-8 text-slate-400 text-sm">
          {t.noBookmarkedNotices}
        </div>

      )}

      {/* NOTIFICATIONS */}
      {activeTab === 'notifications' && (

        <div className="text-center py-8 text-slate-400 text-sm">
          {t.noNotificationsYet}
        </div>

      )}

    </div>
  );
}