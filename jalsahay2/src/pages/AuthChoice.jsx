import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserRound, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AuthChoice() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t.accessPortal}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t.chooseAccountType}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="group block rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-2xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            <UserRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.customerLogin}</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {t.customerDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 font-semibold text-blue-700 dark:text-blue-200">
            <Link to="/login?role=user" className="inline-flex items-center gap-2">{t.customerAccess} <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" /></Link>
            <span className="inline-flex items-center gap-2 text-sm">{t.login} <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" /></span>
            <Link to="/signup?role=user" onClick={(event) => event.stopPropagation()} className="text-sm underline">{t.register}</Link>
          </div>
        </div>

        <div className="group block rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.authorityLogin}</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {t.authorityDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 font-semibold text-emerald-700 dark:text-emerald-200">
            <Link to="/login?role=admin" className="inline-flex items-center gap-2">{t.authorityAccess} <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" /></Link>
            <span className="inline-flex items-center gap-2 text-sm">{t.login} <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" /></span>
            <Link to="/signup?role=admin" onClick={(event) => event.stopPropagation()} className="text-sm underline">{t.register}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
