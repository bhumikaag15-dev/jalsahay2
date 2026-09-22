import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-card p-8 rounded-3xl space-y-4">
        <h1 className="text-2xl font-bold">{t.userProfileSettings}</h1>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">{t.email}:</span> {user?.email || "aarav@example.com"}</p>
          <p><span className="font-semibold">{t.registeredWard}:</span> Ward 12</p>
        </div>
      </div>
    </div>
  );
}