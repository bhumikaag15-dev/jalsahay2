import React from 'react';
import { dummyBlogs } from '../lib/dummydata';
import { useLanguage } from '../context/LanguageContext';

export default function Blog() {
  const { t } = useLanguage();
  const blogTranslations = {
    1: ['blog1Title', 'blog1Category', 'blog1Summary'],
    2: ['blog2Title', 'blog2Category', 'blog2Summary'],
    3: ['blog3Title', 'blog3Category', 'blog3Summary'],
    4: ['blog4Title', 'blog4Category', 'blog4Summary']
  };
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t.waterConservationNews}</h1>
        <p className="text-sm text-slate-500">{t.articlesGuidelines}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyBlogs.map(blog => (
          <div key={blog.id} className="glass-card p-6 rounded-3xl space-y-3">
            <span className="text-xs font-semibold text-primary">{t[blogTranslations[blog.id][1]]} • {blog.date}</span>
            <h2 className="text-xl font-bold">{t[blogTranslations[blog.id][0]]}</h2>
            <p className="text-sm text-slate-500">{t[blogTranslations[blog.id][2]]}</p>
            <div className="text-xs text-slate-400">{t.by} {blog.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}