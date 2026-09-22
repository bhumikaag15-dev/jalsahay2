import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  CircleCheck,
  Droplet,
  FileText,
  Home,
  LogOut,
  Menu,
  Newspaper,
  Scale,
  Shield,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsOpen(false);

  const publicLinks = [
    { to: '/', label: t.home, description: t.overview, icon: Home },
    { to: '/report', label: t.report, description: t.reportComplaintDescription, icon: FileText },
    { to: '/track', label: t.track, description: t.trackStatusDescription, icon: Activity },
    { to: '/analytics', label: t.analytics, description: 'Service and area insights', icon: BarChart3 },
    { to: '/comparison', label: t.comparison, description: t.comparisonDescription, icon: Scale },
    { to: '/blog', label: t.blog, description: t.blogDescription, icon: Newspaper },
    { to: '/rewards', label: t.rewards, description: t.rewardsDescription, icon: Sparkles }
  ];

  const accountLinks = user
    ? role === 'admin'
      ? [{ to: '/authority-dashboard', label: t.operations, description: t.operationsDescription, icon: BriefcaseBusiness }]
      : [
          { to: '/dashboard', label: t.dashboard, description: t.dashboardDescription, icon: BarChart3 },
          { to: '/book-service', label: t.bookService, description: t.bookServiceDescription, icon: Droplet },
          { to: '/payments', label: t.payments, description: t.paymentsDescription, icon: CreditCard }
        ]
    : [];

  const renderMenuLink = ({ to, label, description, icon: Icon }) => (
    <Link
      key={to}
      to={to}
      onClick={closeMenu}
      className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white/55 px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/80 hover:shadow-md dark:bg-slate-800/45 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 shadow-inner transition group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white dark:from-blue-900/60 dark:to-cyan-900/40 dark:text-blue-200 dark:group-hover:from-blue-600 dark:group-hover:to-cyan-500">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{description}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-blue-500/30">
              <Droplet className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JalSahay
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
              <CircleCheck className="h-4 w-4" />
              <span>{t.serviceDesk}</span>
            </div>
            <Link to="/report" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200 dark:hover:bg-blue-900/40">
              <FileText className="h-4 w-4" />
              {t.reportIssue}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            {user ? (
              <Link to="/profile" className="hidden rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-primary sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Open profile">
                <CircleUserRound className="h-5 w-5" />
              </Link>
            ) : null}
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              aria-expanded={isOpen}
              aria-controls="main-navigation"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">{t.menu}</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t.menu}>
          <button className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]" onClick={closeMenu} aria-label={t.closeNavigation} />
          <aside id="main-navigation" className="absolute right-0 top-0 flex h-screen w-full max-w-md flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="relative flex min-h-[154px] shrink-0 items-end overflow-hidden border-b border-blue-900/20 bg-slate-900 px-5 py-5">
              <img
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80"
                alt="Abstract blue water texture"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101a4a]/95 via-[#1d3c8d]/75 to-[#17245c]/45" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200">{t.waterServiceNetwork}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">{t.navigateTitle}</h2>
                <p className="mt-1 text-xs text-blue-100/80">{t.connectReportResolve}</p>
              </div>
              <button onClick={closeMenu} className="absolute right-4 top-4 z-10 rounded-xl border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md transition hover:bg-white/20" aria-label={t.closeNavigation}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/70 via-white/40 to-cyan-50/60 px-4 py-5 dark:from-slate-900 dark:via-slate-900/95 dark:to-blue-950/30">
              {user && (
                <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-white/80 to-blue-50/80 p-4 shadow-sm dark:border-blue-900/50 dark:from-slate-800/80 dark:to-blue-950/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                      {role === 'admin' ? <Shield className="h-5 w-5" /> : <CircleUserRound className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.email}</p>
                      <p className="mt-0.5 text-xs capitalize text-slate-500 dark:text-slate-400">{role === 'admin' ? t.authorityAccount : t.customerAccount}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={closeMenu} className="mt-3 inline-flex text-xs font-semibold text-blue-700 hover:underline dark:text-blue-300">{t.profile}</Link>
                </div>
              )}

              {accountLinks.length > 0 && (
                <section className="mb-6">
                  <div className="mb-2 flex items-center gap-2 px-3">
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{t.yourWorkspace}</p>
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="space-y-1">{accountLinks.map(renderMenuLink)}</div>
                </section>
              )}

              <section>
                <div className="mb-2 flex items-center gap-2 px-3">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{t.exploreJalSahay}</p>
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-1">{publicLinks.map(renderMenuLink)}</div>
              </section>

              {!user && (
                <Link to="/auth-choice" onClick={closeMenu} className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                  <CircleUserRound className="h-4 w-4" />
                  {t.loginRegister}
                </Link>
              )}
            </div>

            {user && (
              <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-700">
                <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30">
                  <LogOut className="h-4 w-4" />
                  {t.signOut}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </nav>
  );
}