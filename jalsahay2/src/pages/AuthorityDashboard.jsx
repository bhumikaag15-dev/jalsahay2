import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, DollarSign, MapPinned, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getAuthorityRequests, updateServiceRequestStatus } from '../lib/marketplaceApi';

export default function AuthorityDashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;
    getAuthorityRequests().then(({ data, error: requestError }) => {
      if (!active) return;
      if (requestError) setError(requestError.message || t.unableLoadRequests);
      setJobs(data || []);
    });
    return () => { active = false; };
  }, []);

  const updateJob = async (job, status) => {
    const { data, error: updateError } = await updateServiceRequestStatus(job.id, status, user.id);
    if (updateError) {
      setError(updateError.message || t.unableUpdateRequest);
      return;
    }
    setJobs((current) => current.map((item) => item.id === job.id ? data : item));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t.authorityPortal}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t.operationsDashboard}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard icon={<BriefcaseBusiness className="w-5 h-5" />} label={t.activeJobs} value={jobs.length} tone="blue" />
        <MetricCard icon={<Users className="w-5 h-5" />} label={t.assignedTeams} value={new Set(jobs.map((job) => job.authority_id).filter(Boolean)).size} tone="green" />
        <MetricCard icon={<DollarSign className="w-5 h-5" />} label={t.bookedValue} value={`₹${jobs.reduce((sum, job) => sum + Number(job.service_amount || 0), 0)}`} tone="amber" />
        <MetricCard icon={<MapPinned className="w-5 h-5" />} label={t.requests} value={jobs.filter((job) => job.status === 'requested').length} tone="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-xl font-bold">{t.incomingServiceRequests}</h2>

          <div className="mt-5 space-y-4">
            {error && <p className="mb-4 text-sm font-medium text-rose-600">{error}</p>}
            {jobs.length === 0 && <p className="text-sm text-slate-500">{t.noLiveServiceRequests}</p>}
            {jobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{job.id}</p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.service_title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{t.customerId}: {job.customer_id} · {t.location}: {job.address}</p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-lg font-bold text-emerald-600">₹{job.service_amount}</p>
                    <span className="inline-flex rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.status === 'requested' && <button onClick={() => updateJob(job, 'accepted')} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white">{t.acceptRequest}</button>}
                  {job.status === 'accepted' && <button onClick={() => updateJob(job, 'in_progress')} className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white">{t.startJob}</button>}
                  {job.status === 'in_progress' && <button onClick={() => updateJob(job, 'completed')} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">{t.markCompleted}</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-bold">{t.priorityAlerts}</h2>
            <div className="mt-5 space-y-4">
              <AlertCard title={t.mainLineBurst} detail={`2 ${t.requestsAwaitingDispatch}`} tone="rose" />
              <AlertCard title={t.pressureDropReported} detail={t.westernCorridorIssue} tone="amber" />
              <AlertCard title={t.waterQualityCheckPending} detail={t.sampleReviewDue} tone="blue" />
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-bold">{t.settlementSummary}</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t.completedJobs}</span>
                <span className="font-bold">₹86,400</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t.pendingPayout}</span>
                <span className="font-bold">₹26,200</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t.platformCommission}</span>
                <span className="font-bold">₹18,600</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, tone }) {
  const tones = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200'
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
      <div className={`mb-4 inline-flex rounded-2xl p-2 ${tones[tone]}`}>{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function AlertCard({ title, detail, tone }) {
  const tones = {
    rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200',
    blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200'
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-sm opacity-90">{detail}</p>
    </div>
  );
}
