import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <h1 className="text-2xl font-bold text-center">Create JalSahay Account</h1>
        <form onSubmit={handleSignup} className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input required type="email" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input required type="password" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-semibold rounded-xl">
            Register Account
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Already registered? <Link to="/login" className="text-primary font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}