import React from 'react';
import { dummyBlogs } from '../lib/dummyData';

export default function Blog() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Water Conservation & Municipal News</h1>
        <p className="text-sm text-slate-500">Articles and guidelines on smart water management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyBlogs.map(blog => (
          <div key={blog.id} className="glass-card p-6 rounded-3xl space-y-3">
            <span className="text-xs font-semibold text-primary">{blog.category} • {blog.date}</span>
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p className="text-sm text-slate-500">{blog.summary}</p>
            <div className="text-xs text-slate-400">By {blog.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}