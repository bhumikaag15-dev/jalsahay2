import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReportComplaint from './pages/ReportComplaint';
import TrackComplaint from './pages/TrackComplaint';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Comparison from './pages/Comparison';
import Blog from './pages/Blog';
import Rewards from './pages/Rewards';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthChoice from './pages/AuthChoice';
import BookService from './pages/BookService';
import AuthorityDashboard from './pages/AuthorityDashboard';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen flex flex-col justify-between">
              <Navbar />
              <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/report" element={<ReportComplaint />} />
                  <Route path="/track" element={<TrackComplaint />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/comparison" element={<Comparison />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/auth-choice" element={<AuthChoice />} />
                  <Route path="/book-service" element={<ProtectedRoute requiredRole="user"><BookService /></ProtectedRoute>} />
                  <Route path="/payments" element={<ProtectedRoute requiredRole="user"><Payments /></ProtectedRoute>} />
                  <Route path="/authority-dashboard" element={<ProtectedRoute requiredRole="admin"><AuthorityDashboard /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
