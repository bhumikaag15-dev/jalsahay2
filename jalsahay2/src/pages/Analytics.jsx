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

import {
  getComplaintAnalytics,
  getServiceRiskData
} from '../lib/serviceRiskApi';

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);
  const [riskZones, setRiskZones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          Loading live municipal analytics...
        </p>

      </div>
    );
  }

  if (error && !analytics) {

    return (
      <div className="max-w-3xl mx-auto py-12">

        <div className="p-6 rounded-2xl bg-red-50 text-red-700">

          <h2 className="font-bold text-lg mb-2">
            Analytics failed to load
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Try Again
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

  return (

    <div className="max-w-7xl mx-auto py-8 space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <MapPin className="text-blue-600" />

            <span className="text-sm font-semibold text-blue-600">
              LIVE MUNICIPAL OPERATIONS
            </span>

          </div>

          <h1 className="text-3xl font-bold mt-1">
            Water Intelligence Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Real complaint data + live weather intelligence
          </p>

        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
        >
          <RefreshCw className="w-4 h-4" />

          Refresh Data
        </button>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          icon={<Droplets />}
          title="Total Complaints"
          value={analytics.total}
        />

        <StatCard
          icon={<Clock />}
          title="Open"
          value={analytics.open}
        />

        <StatCard
          icon={<CheckCircle />}
          title="Resolved"
          value={analytics.resolved}
        />

        <StatCard
          icon={<AlertTriangle />}
          title="Emergency"
          value={analytics.emergency}
        />

        <StatCard
          icon={<TrendingUp />}
          title="High Priority"
          value={analytics.highPriority}
        />

      </div>


      {/* RISK SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <RiskSummary
          title="Critical Zones"
          value={criticalZones}
          description="Immediate monitoring recommended"
          danger
        />

        <RiskSummary
          title="High Risk Zones"
          value={highRiskZones}
          description="Increased service attention required"
        />

        <RiskSummary
          title="Monitored Zones"
          value={riskZones.length}
          description="Weather + complaint monitoring areas"
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
            Complaints by Category
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
            Complaints by Ward
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
          Complaint Status
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
          Service Risk Analysis
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-200 dark:border-slate-700">

                <th className="text-left py-3">
                  Zone
                </th>

                <th className="text-left py-3">
                  Risk
                </th>

                <th className="text-left py-3">
                  Score
                </th>

                <th className="text-left py-3">
                  Complaints
                </th>

                <th className="text-left py-3">
                  Rain
                </th>

                <th className="text-left py-3">
                  Rain Probability
                </th>

                <th className="text-left py-3">
                  Action
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
                        ? 'Immediate inspection'
                        : zone.score >= 50
                        ? 'Increase monitoring'
                        : zone.score >= 30
                        ? 'Monitor'
                        : 'Normal operations'}

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

      <p className="text-xs text-slate-400 text-center">
        Risk scores are decision-support indicators calculated
        from live weather forecasts and complaint activity.
        They are not guaranteed predictions of incidents.
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
