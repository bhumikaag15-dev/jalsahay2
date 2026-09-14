import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/report" className="hover:text-primary transition-colors">Report Complaint</Link>
            <Link to="/track" className="hover:text-primary transition-colors">Track Status</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
            <Link to="/comparison" className="hover:text-primary transition-colors">Comparison</Link>
            <Link to="/blog" className="hover:text-primary transition-colors">News & Blog</Link>
            <Link to="/admin" className="hover:text-primary transition-colors flex items-center space-x-1">
              <Shield className="w-4 h-4 text-primary" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-1 text-sm font-semibold hover:text-primary">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all">
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-slate-600 dark:text-slate-300">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={()=>setIsOpen(false)} className="block py-2">Home</Link>
          <Link to="/report" onClick={()=>setIsOpen(false)} className="block py-2">Report Complaint</Link>
          <Link to="/track" onClick={()=>setIsOpen(false)} className="block py-2">Track Status</Link>
          <Link to="/dashboard" onClick={()=>setIsOpen(false)} className="block py-2">Dashboard</Link>
          <Link to="/analytics" onClick={()=>setIsOpen(false)} className="block py-2">Analytics</Link>
          <Link to="/comparison" onClick={()=>setIsOpen(false)} className="block py-2">Comparison</Link>
          <Link to="/blog" onClick={()=>setIsOpen(false)} className="block py-2">News & Blog</Link>
          <Link to="/admin" onClick={()=>setIsOpen(false)} className="block py-2 text-primary font-bold">Admin Panel</Link>
          {user ? (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <Link to="/profile" onClick={()=>setIsOpen(false)} className="font-semibold">My Profile</Link>
              <button onClick={handleLogout} className="text-rose-500 font-semibold">Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={()=>setIsOpen(false)} className="block text-center py-2 bg-primary text-white rounded-xl font-semibold">
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}