import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Camera, Activity, PhoneCall, ChevronRight } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden pt-12 pb-20 rounded-3xl glass-card text-center px-4 sm:px-8 mt-4 border border-blue-100 dark:border-slate-800"
      >
        <div className="ambient-layer pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-wave ambient-wave-one"></div>
          <div className="ambient-wave ambient-wave-two"></div>
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="abstract-orb"
              style={{
                left: `${(i * 11.5) % 100}%`,
                bottom: `${8 + (i % 5) * 18}%`,
                animationDelay: `${i * 0.9}s`,
                animationDuration: `${7 + (i % 4) * 2.5}s`,
                width: `${24 + (i % 4) * 18}px`,
                height: `${24 + (i % 4) * 18}px`,
                opacity: 0.28 + (i % 3) * 0.12
              }}
            />
          ))}
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none animate-float-slow delay-200"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-primary text-xs font-semibold tracking-wide uppercase"
          >
            ⚡ {t.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight"
          >
            {t.title.split(' ').slice(0, 3).join(' ')} <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t.title.split(' ').slice(3).join(' ')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/report" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 motion-lift">
              <span>{t.reportComplaint}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/track" className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold transition-all motion-lift">
              {t.trackComplaint}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Animated Counter Section */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {[
          { label: t.submittedCount, val: 12450 },
          { label: t.resolved, val: 11890 },
          { label: t.pendingCount, val: 560 },
          { label: t.averageResponseTime, val: 24, suffix: " hrs" },
          { label: t.satisfaction, val: 96, suffix: "%" }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.45 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-2xl glass-card text-center border border-slate-100 dark:border-slate-800 shadow-sm motion-lift"
          >
            <h3 className="text-3xl font-extrabold text-primary">
              <AnimatedCounter end={stat.val} suffix={stat.suffix || ""} />
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold">{t.keyPlatformFeatures}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t.featureDescription}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: t.realTimeTracking, desc: t.realTimeTrackingDesc },
            { icon: Camera, title: t.proof, desc: t.photoVideoProofDesc },
            { icon: MapPin, title: t.gpsPrecision, desc: t.gpsPrecisionDesc },
            { icon: ShieldCheck, title: t.authorityDashboardFeature, desc: t.authorityDashboardDesc },
            { icon: PhoneCall, title: t.emergencySosMode, desc: t.emergencySosDesc },
            { icon: Activity, title: t.waterAnalytics, desc: t.waterAnalyticsDesc }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.45 }}
              whileHover={{ y: -8 }}
              className="p-6 rounded-2xl glass-card space-y-3 hover:border-primary/50 transition-all motion-lift"
            >
              <div className="p-3 w-fit rounded-xl bg-blue-50 dark:bg-slate-800 text-primary">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{feat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-8 rounded-3xl glass-card border border-slate-100 dark:border-slate-800"
      >
        <h2 className="text-2xl font-bold text-center mb-8">{t.howJalSahayWorks}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: t.step01, title: t.loginRegisterStep, desc: t.loginRegisterDesc },
            { step: t.step02, title: t.submitIssueStep, desc: t.submitIssueDesc },
            { step: t.step03, title: t.authorityReviewStep, desc: t.authorityReviewDesc },
            { step: t.step04, title: t.issueResolvedStep, desc: t.issueResolvedDesc }
          ].map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="space-y-2 motion-lift"
            >
              <span className="text-4xl font-black text-primary/30">{s.step}</span>
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}