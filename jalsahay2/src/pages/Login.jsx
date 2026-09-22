import React, { useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const role = useMemo(() => searchParams.get('role') || 'user', [searchParams]);
  const { loginWithIdentifier, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { error } = await loginWithIdentifier(identifier, password, role);

      if (error) {
        alert(error.message);
        return;
      }

      navigate(role === 'admin' ? '/authority-dashboard' : '/book-service');
    } catch (err) {
      console.error(err);
      alert(t.loginFailed);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{role === 'admin' ? t.authority : t.customer} {t.accessPortal}</p>
          <h1 className="mt-3 text-2xl font-bold text-center">{t.login} JalSahay</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button type="button" onClick={() => setLoginMethod('email')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${loginMethod === 'email' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{t.email}</button>
            <button type="button" onClick={() => setLoginMethod('phone')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${loginMethod === 'phone' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{t.phoneNumber}</button>
          </div>
          <div>
            <label className="block font-semibold mb-1">{loginMethod === 'email' ? t.email : t.phoneNumber}</label>
            <input required type={loginMethod === 'email' ? 'email' : 'tel'} inputMode={loginMethod === 'email' ? 'email' : 'tel'} autoComplete={loginMethod === 'email' ? 'email' : 'tel'} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder={loginMethod === 'phone' ? '+91 9876543210' : ''} />
          </div>
          <div>
            <label className="block font-semibold mb-1">{t.password}</label>
            <input required type="password" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-semibold rounded-xl">
            {t.signIn}: {role === 'admin' ? t.authority : t.customer}
          </button>
        </form>

        <button onClick={loginWithGoogle} className="w-full py-3 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm">
          {t.signInGoogle}
        </button>

        <p className="text-xs text-center text-slate-500">
          {t.needAccount} <Link to={`/signup?role=${role}`} className="text-primary font-bold">{t.register}</Link>
        </p>
      </div>
    </div>
  );
}