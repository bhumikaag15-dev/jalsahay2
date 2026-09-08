import React from 'react';
import { Check, X } from 'lucide-react';

export default function Comparison() {
  const comparisonRows = [
    { feature: "Online Status Tracking", traditional: false, jalsahay: true },
    { feature: "Photo & Video Upload", traditional: false, jalsahay: true },
    { feature: "Exact GPS Geotagging", traditional: false, jalsahay: true },
    { feature: "Real-time Push Alerts", traditional: false, jalsahay: true },
    { feature: "Ward Analytics", traditional: false, jalsahay: true },
    { feature: "Avg Response Time", traditional: "7-14 Days", jalsahay: "24-48 Hours" }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Traditional System vs. JalSahay</h1>
        <p className="text-sm text-slate-500">Why modern cities are upgrading to automated water portal management.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/50">
            <tr>
              <th className="p-4">Feature</th>
              <th className="p-4 text-slate-500">Traditional System</th>
              <th className="p-4 text-primary font-bold">JalSahay Smart System</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {comparisonRows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-4 font-semibold">{row.feature}</td>
                <td className="p-4">
                  {typeof row.traditional === 'boolean' ? (
                    row.traditional ? <Check className="text-emerald-500" /> : <X className="text-rose-500" />
                  ) : row.traditional}
                </td>
                <td className="p-4 font-bold text-primary">
                  {typeof row.jalsahay === 'boolean' ? (
                    row.jalsahay ? <Check className="text-emerald-500" /> : <X className="text-rose-500" />
                  ) : row.jalsahay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}