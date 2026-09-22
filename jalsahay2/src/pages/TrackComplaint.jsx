import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

export default function TrackComplaint() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const steps = [t.submitted, t.assigned, t.inProgress, t.resolved, t.closed];

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    const searchValue = query.trim();

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .or(`id.eq.${searchValue},phone.eq.${searchValue}`)
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.error('Search error:', error);
      alert(error.message);
      return;
    }

    setResult(data);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">

      <div className="glass-card p-6 rounded-2xl text-center space-y-4">

        <h1 className="text-2xl font-bold">
          {t.trackComplaintStatus}
        </h1>

        <p className="text-xs text-slate-500">
          {t.complaintIdPhone}
        </p>

        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-xl mx-auto"
        >

          <input
            type="text"
            className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-sm"
            placeholder={t.enterComplaintIdPhone}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center space-x-2 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{t.search}</span>
          </button>

        </form>

      </div>

      {loading && (
        <div className="text-center py-8 text-slate-400">
          {t.searching}
        </div>
      )}

      {!loading && result && (

        <div className="glass-card p-8 rounded-3xl space-y-6">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">

            <div>

              <span className="text-xs font-mono font-bold text-primary">
                {result.id}
              </span>

              <h2 className="text-xl font-bold">
                {result.category}
              </h2>

            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 w-fit">
              {result.status}
            </span>

          </div>

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
                    <span className="text-xs mt-2 font-medium hidden sm:block">
                      {step}
                    </span>
                  </div>
                );
              })}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400">{t.assignedEngineer}</span>
              <p className="font-semibold text-sm">{result.assigned_engineer || t.notAssignedYet}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400">{t.estimatedResolution}</span>
              <p className="font-semibold text-sm">{result.estimated_completion || t.notAvailableYet}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1 sm:col-span-2">
              <span className="text-slate-400">{t.addressLocation}</span>
              <p className="font-semibold">{result.address}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !result && query && (
        <div className="text-center py-12 text-slate-400">
          {t.noComplaintRecords}
        </div>
      )}
    </div>
  );
}