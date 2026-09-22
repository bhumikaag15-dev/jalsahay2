import React, { useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [signupMethod, setSignupMethod] = useState('email');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [searchParams] = useSearchParams();
  const role = useMemo(() => searchParams.get('role') || 'user', [searchParams]);
  const { t } = useLanguage();

  const { signUpWithIdentifier, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { error } = await signUpWithIdentifier(identifier, password, {
      full_name: fullName,
      role,
      phone: signupMethod === 'phone' ? identifier : '',
      organization: organization || (role === 'admin' ? t.waterDept : t.customer)
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert(t.accountRegistered);
    navigate(role === 'admin' ? '/authority-dashboard' : '/book-service');
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{role === 'admin' ? t.authority : t.customer} {t.customerRegistration}</p>
          <h1 className="text-2xl font-bold text-center">
            {t.createJalSahayAccount}
          </h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold mb-1">{t.fullName}</label>
            <input
              required
              type="text"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.enterFullName}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button type="button" onClick={() => setSignupMethod('email')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${signupMethod === 'email' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{t.email}</button>
            <button type="button" onClick={() => setSignupMethod('phone')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${signupMethod === 'phone' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{t.phoneNumber}</button>
          </div>
          <div>
            <label className="block font-semibold mb-1">{signupMethod === 'email' ? t.email : t.phoneNumber}</label>
            <input
              required
              type={signupMethod === 'email' ? 'email' : 'tel'}
              inputMode={signupMethod === 'email' ? 'email' : 'tel'}
              autoComplete={signupMethod === 'email' ? 'email' : 'tel'}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={signupMethod === 'phone' ? '+91 9876543210' : ''}
            />
          </div>

          {role === 'admin' && (
            <div>
              <label className="block font-semibold mb-1">{t.authorityOrg}</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={t.waterDept}
              />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1">{t.password}</label>
            <input
              required
              type="password"
              minLength="6"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl"
          >
            {t.registerAs} {role === 'admin' ? t.authority : t.customer}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          {t.alreadyRegistered}
          <Link to={`/login?role=${role}`} className="text-primary font-bold ml-1">
            {t.login}
          </Link>
        </p>

        <button onClick={loginWithGoogle} className="w-full py-3 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm">
          {t.signInGoogle}
        </button>
      </div>
    </div>
  );
}