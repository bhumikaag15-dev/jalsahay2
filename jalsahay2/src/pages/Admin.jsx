import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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
      alert('Could not update status: ' + error.message);
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
          Municipal Authority Admin Panel
        </h1>

        <p className="text-sm text-slate-500">
          Manage incoming complaints and update their status.
        </p>

      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">

        {loading ? (

          <div className="p-8 text-center text-slate-400">
            Loading complaints...
          </div>

        ) : complaints.length === 0 ? (

          <div className="p-8 text-center text-slate-400">
            No complaints have been submitted yet.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-100 dark:bg-slate-800/50">

                <tr>

                  <th className="p-4">ID</th>
                  <th className="p-4">Citizen</th>
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
                      Ward {c.ward_number}
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

                        <option>Submitted</option>
                        <option>Assigned</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Closed</option>

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