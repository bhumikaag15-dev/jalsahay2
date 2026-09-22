import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading complaints:', error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setComplaints(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {

    const { error } = await supabase
      .from('complaints')
      .update({
        status: newStatus
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      alert(t.couldNotUpdateStatus + ' ' + error.message);
      return;
    }

    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: newStatus }
          : c
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          {t.adminPanel}
        </h1>

        <p className="text-sm text-slate-500">
          {t.manageComplaints}
        </p>

      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">

        {loading ? (

          <div className="p-8 text-center text-slate-400">
            {t.loadingComplaints}
          </div>

        ) : complaints.length === 0 ? (

          <div className="p-8 text-center text-slate-400">
            {t.noComplaintsSubmittedYet}
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-100 dark:bg-slate-800/50">

                <tr>

                  <th className="p-4">ID</th>
                  <th className="p-4">{t.citizen}</th>
                  <th className="p-4">{t.category}</th>
                  <th className="p-4">{t.ward}</th>
                  <th className="p-4">{t.priority}</th>
                  <th className="p-4">{t.status}</th>
                  <th className="p-4">{t.action}</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

                {complaints.map((c) => (

                  <tr key={c.id}>

                    <td className="p-4 font-mono font-bold text-primary">
                      {c.id}
                    </td>

                    <td className="p-4">
                      {c.full_name}
                    </td>

                    <td className="p-4">
                      {c.category}
                    </td>

                    <td className="p-4">
                      {t.ward} {c.ward_number}
                    </td>

                    <td className="p-4 font-semibold text-rose-500">
                      {c.priority}
                    </td>

                    <td className="p-4">
                      {c.status}
                    </td>

                    <td className="p-4">

                      <select
                        value={c.status}
                        onChange={(e) =>
                          updateStatus(c.id, e.target.value)
                        }
                        className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white/50 dark:bg-slate-800"
                      >

                        <option value="Submitted">{t.submitted}</option>
                        <option value="Assigned">{t.assigned}</option>
                        <option value="In Progress">{t.inProgress}</option>
                        <option value="Resolved">{t.resolved}</option>
                        <option value="Closed">{t.closed}</option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}