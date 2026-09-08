import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Camera, Activity, PhoneCall, ChevronRight } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 rounded-3xl glass-card text-center px-4 sm:px-8 mt-4 border border-blue-100 dark:border-slate-800">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-primary text-xs font-semibold tracking-wide uppercase">
            ⚡ Next-Gen Municipal Tech
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Smart Water Complaint <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Report water supply problems in seconds, track real-time resolution timelines, and help authorities build smarter, leakage-free cities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/report" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2">
              <span>Report Complaint</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/track" className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold transition-all">
              Track Complaint
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Counter Section */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {[
          { label: "Submitted", val: 12450 },
          { label: "Resolved", val: 11890 },
          { label: "Pending", val: 560 },
          { label: "Avg Res. Time", val: 24, suffix: " hrs" },
          { label: "Satisfaction", val: 96, suffix: "%" }
        ].map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-card text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-3xl font-extrabold text-primary">
              <AnimatedCounter end={stat.val} suffix={stat.suffix || ""} />
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Key Platform Features</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Designed for extreme speed, transparency, and municipal efficiency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: "Real-time Tracking", desc: "Track exact stages from assignment to repair crew arrival." },
            { icon: Camera, title: "Photo & Video Proof", desc: "Attach geo-tagged media evidence for quick verification." },
            { icon: MapPin, title: "GPS Precision", desc: "Pinpoint exact water leak locations down to precise coordinates." },
            { icon: ShieldCheck, title: "Authority Dashboard", desc: "Engineers receive instant ward updates for dispatch." },
            { icon: PhoneCall, title: "Emergency SOS Mode", desc: "High priority flags for major pipe breaks and contaminated supply." },
            { icon: Activity, title: "Water Analytics", desc: "Data insights on repeat outage areas and ward performance." }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card space-y-3 hover:border-primary/50 transition-all">
              <div className="p-3 w-fit rounded-xl bg-blue-50 dark:bg-slate-800 text-primary">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{feat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto p-8 rounded-3xl glass-card border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-8">How JalSahay Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: "01", title: "Login / Register", desc: "Sign up via Google or email in seconds." },
            { step: "02", title: "Submit Issue", desc: "Select category, snap a photo, and set GPS." },
            { step: "03", title: "Authority Review", desc: "Ward engineer gets assigned instantly." },
            { step: "04", title: "Issue Resolved", desc: "Receive real-time fix status & rate work." }
          ].map((s, idx) => (
            <div key={idx} className="space-y-2">
              <span className="text-4xl font-black text-primary/30">{s.step}</span>
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}