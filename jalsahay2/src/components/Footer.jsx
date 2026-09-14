import React from 'react';
import { Droplet, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-slate-200/50 dark:border-slate-800/50 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Droplet className="w-6 h-6 text-primary fill-current" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JalSahay
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A Next-Gen Smart Municipal Water Complaint Management System empowering citizens and authorities.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><a href="/report" className="hover:text-primary">File Complaint</a></li>
            <li><a href="/track" className="hover:text-primary">Track Grievance</a></li>
            <li><a href="/analytics" className="hover:text-primary">City Analytics</a></li>
            <li><a href="/comparison" className="hover:text-primary">Tool Comparison</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Categories</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>Pipeline Leakage</li>
            <li>Dirty Water Supply</li>
            <li>Low Water Pressure</li>
            <li>Illegal Connection</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Emergency Helpline</h4>
          <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>1800-111-WATER (Toll Free)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>support@jalsahay.gov.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Municipal Water HQ, City Center</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        © 2026 JalSahay Municipal Portal. All rights reserved. Built for Smart Cities.
      </div>
    </footer>
  );
}