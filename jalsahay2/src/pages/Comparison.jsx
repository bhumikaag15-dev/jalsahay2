import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Comparison() {
  const { t } = useLanguage();
  const comparisonRows = [
    { feature: t.onlineStatusTracking, traditional: false, jalsahay: true },
    { feature: t.photoVideoUpload, traditional: false, jalsahay: true },
    { feature: t.exactGpsGeotagging, traditional: false, jalsahay: true },
    { feature: t.realTimePushAlerts, traditional: false, jalsahay: true },
    { feature: t.wardAnalytics, traditional: false, jalsahay: true },
    { feature: t.avgResponseTime, traditional: '7-14 days', jalsahay: '24-48 hours' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t.traditionalVsJalSahay}</h1>
        <p className="text-sm text-slate-500">{t.whyModernCities}</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/50">
            <tr>
              <th className="p-4">{t.feature}</th>
              <th className="p-4 text-slate-500">{t.traditionalSystem}</th>
              <th className="p-4 text-primary font-bold">{t.jalsahaySmartSystem}</th>
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