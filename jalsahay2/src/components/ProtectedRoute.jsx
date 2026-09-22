import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, role } = useAuth();
  const { t } = useLanguage();

  if (loading) return <div className="p-10 text-center">{t.loading}</div>;
  if (!user) return <Navigate to="/auth-choice" replace />;
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/authority-dashboard' : '/book-service'} replace />;
  }

  return children;
}