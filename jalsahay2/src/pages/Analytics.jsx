import React, { useEffect, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  RefreshCw,
  TrendingUp,
  MapPin
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import ComplaintMap from '../components/ComplaintMap';
import ServiceRiskMap from '../components/ServiceRiskMap';
import { useLanguage } from '../context/LanguageContext';

import {
  getComplaintAnalytics,
  getServiceRiskData
} from '../lib/serviceRiskApi';

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);
  const [riskZones, setRiskZones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  async function loadAnalytics() {

    try {

      setLoading(true);
      setError('');

      const [
        complaintData,
        riskData
      ] = await Promise.all([
        getComplaintAnalytics(),
        getServiceRiskData()
      ]);

      setAnalytics(complaintData);
      setRiskZones(riskData);

    } catch (err) {

      console.error(
        'Analytics error:',
        err
      );

      setError(
        err.message ||
        'Unable to load analytics.'
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    loadAnalytics();

    const interval = setInterval(
      loadAnalytics,
      5 * 60 * 1000
    );

    return () => {
      clearInterval(interval);
    };

  }, []);

  if (loading && !analytics) {

    return (
      <div className="max-w-7xl mx-auto py-12 text-center">

        <RefreshCw
          className="w-8 h-8 animate-spin mx-auto mb-3"
        />

        <p className="text-slate-500">
          {t.loadingLiveAnalytics}
        </p>

      </div>
    );
  }

  if (error && !analytics) {

    return (
      <div className="max-w-3xl mx-auto py-12">

        <div className="p-6 rounded-2xl bg-red-50 text-red-700">

          <h2 className="font-bold text-lg mb-2">
            {t.analyticsFailedToLoad}
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {t.tryAgain}
          </button>

        </div>

      </div>
    );
  }

  const criticalZones =
    riskZones.filter(
      zone => zone.riskLevel === 'Critical'
    ).length;

  const highRiskZones =
    riskZones.filter(
      zone => zone.riskLevel === 'High'
    ).length;

  const mostAttentionZone =
    riskZones.length > 0
      ? [...riskZones].sort((a, b) => b.score - a.score)[0]
      : null;

  return (

    <div className="max-w-7xl mx-auto py-8 space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <MapPin className="text-blue-600" />

            <span className="text-sm font-semibold text-blue-600">
              {t.liveMunicipalOperations}
            </span>

          </div>

          <h1 className="text-3xl font-bold mt-1">
            {t.waterIntelligenceDashboard}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {t.realComplaintWeather}
          </p>

        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
        >
          <RefreshCw className="w-4 h-4" />

          {t.refreshData}
        </button>

      </div>


      {/* AREA REQUIRING MOST ATTENTION */}

      {mostAttentionZone && (
        <div className="p-6 rounded-3xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                {t.highestAttentionRequired}
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {mostAttentionZone.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {mostAttentionZone.riskLevel} {t.risk} · {mostAttentionZone.openComplaints} {t.open.toLowerCase()} {t.complaints.toLowerCase()} · {t.score.toLowerCase()} {mostAttentionZone.score}/100
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 px-4 py-3 text-center shadow-sm">
              <p className="text-xs uppercase text-slate-500">{t.priorityScore}</p>
              <p className="text-3xl font-bold text-red-600">{mostAttentionZone.score}</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          icon={<Droplets />}
          title={t.totalComplaints}
          value={analytics.total}
        />

        <StatCard
          icon={<Clock />}
          title={t.open}
          value={analytics.open}
        />

        <StatCard
          icon={<CheckCircle />}
          title={t.resolved}
          value={analytics.resolved}
        />

        <StatCard
          icon={<AlertTriangle />}
          title={t.emergencyLabel}
          value={analytics.emergency}
        />

        <StatCard
          icon={<TrendingUp />}
          title={t.highPriority}
          value={analytics.highPriority}
        />

      </div>


      {/* RISK SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <RiskSummary
          title={t.criticalZones}
          value={criticalZones}
          description={t.immediateMonitoring}
          danger
        />

        <RiskSummary
          title={t.highRiskZones}
          value={highRiskZones}
          description={t.increasedAttention}
        />

        <RiskSummary
          title={t.monitoredZones}
          value={riskZones.length}
          description={t.weatherComplaintAreas}
        />

      </div>


      {/* COMPLAINT MAP */}

      <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">

        <ComplaintMap />

      </div>


      {/* SERVICE RISK MAP */}

      <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">

        <ServiceRiskMap
          zones={riskZones}
        />

      </div>


      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CATEGORY */}

        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">

          <h2 className="text-lg font-bold mb-5">
            {t.complaintsByCategory}
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={analytics.categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >

                  {analytics.categoryData.map(
                    (entry, index) => (

                      <Cell
                        key={entry.name}
                        fill={[
                          '#2563eb',
                          '#06b6d4',
                          '#f59e0b',
                          '#ef4444',
                          '#8b5cf6',
                          '#10b981'
                        ][index % 6]}
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* WARDS */}

        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">

          <h2 className="text-lg font-bold mb-5">
            {t.complaintsByWard}
          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={analytics.wardData}
              >

                <XAxis
                  dataKey="ward"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="complaints"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* STATUS */}

      <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">

        <h2 className="text-lg font-bold mb-5">
          {t.complaintStatus}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {analytics.statusData.map(status => (

            <div
              key={status.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"
            >

              <p className="text-sm text-slate-500">
                {status.name}
              </p>

              <p className="text-2xl font-bold mt-1">
                {status.value}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* RISK TABLE */}

      <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">

        <h2 className="text-lg font-bold mb-5">
          {t.serviceRiskAnalysis}
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-200 dark:border-slate-700">

                <th className="text-left py-3">
                  {t.zone}
                </th>

                <th className="text-left py-3">
                  {t.risk}
                </th>

                <th className="text-left py-3">
                  {t.score}
                </th>

                <th className="text-left py-3">
                  {t.complaints}
                </th>

                <th className="text-left py-3">
                  {t.rain}
                </th>

                <th className="text-left py-3">
                  {t.rainProbability}
                </th>

                <th className="text-left py-3">
                  {t.action}
                </th>

              </tr>

            </thead>

            <tbody>

              {riskZones
                .sort((a, b) => b.score - a.score)
                .map(zone => (

                  <tr
                    key={zone.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >

                    <td className="py-3 font-semibold">
                      {zone.name}
                    </td>

                    <td className="py-3">

                      <RiskBadge
                        level={zone.riskLevel}
                      />

                    </td>

                    <td className="py-3 font-bold">
                      {zone.score}/100
                    </td>

                    <td className="py-3">
                      {zone.complaints}
                    </td>

                    <td className="py-3">
                      {zone.weather.totalRain} mm
                    </td>

                    <td className="py-3">
                      {zone.weather.maxRainProbability}%
                    </td>

                    <td className="py-3">

                      {zone.score >= 70
                        ? t.immediateInspection
                        : zone.score >= 50
                        ? t.increaseMonitoring
                        : zone.score >= 30
                        ? t.monitor
                        : t.normalOperations}

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

      <p className="text-xs text-slate-400 text-center">
        {t.riskScoreNote}
      </p>

    </div>
  );
}


function StatCard({
  icon,
  title,
  value
}) {

  return (

    <div className="glass-card p-5 rounded-2xl border border-slate-100 dark:border-slate-800">

      <div className="flex items-center justify-between">

        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
          {React.cloneElement(icon, {
            className: 'w-5 h-5'
          })}
        </div>

      </div>

      <p className="text-sm text-slate-500 mt-4">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}


function RiskSummary({
  title,
  value,
  description,
  danger
}) {

  return (

    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700">

      <div className="flex justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold mt-1">
            {value}
          </p>

        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            danger
              ? 'bg-red-100 text-red-600'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>

      </div>

      <p className="text-xs text-slate-500 mt-3">
        {description}
      </p>

    </div>
  );
}


function RiskBadge({ level }) {

  const styles = {

    Critical:
      'bg-red-100 text-red-700',

    High:
      'bg-orange-100 text-orange-700',

    Medium:
      'bg-yellow-100 text-yellow-700',

    Low:
      'bg-green-100 text-green-700'

  };

  return (

    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
        styles[level] || styles.Low
      }`}
    >
      {level}
    </span>

  );
}
