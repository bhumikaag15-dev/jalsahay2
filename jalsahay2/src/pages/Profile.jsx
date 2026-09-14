import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-card p-8 rounded-3xl space-y-4">
        <h1 className="text-2xl font-bold">User Profile Settings</h1>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Email:</span> {user?.email || "aarav@example.com"}</p>
          <p><span className="font-semibold">Registered Ward:</span> Ward 12</p>
        </div>
      </div>
    </div>
  );
}