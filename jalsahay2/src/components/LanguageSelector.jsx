import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="language-selector">{t.languageLabel}</label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-2.5 py-2 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
        <Languages className="h-4 w-4 text-primary" />
        <select
          id="language-selector"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="bg-transparent pr-6 text-sm font-medium outline-none"
          aria-label={t.chooseLanguage}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-900 dark:text-slate-100">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
