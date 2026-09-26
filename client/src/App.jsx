import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

import RestaurantDashboard from './pages/Restaurant/RestaurantDashboard';
import AddDonationPage from './pages/Restaurant/AddDonationPage';
import SurplusPredictionPage from './pages/Restaurant/SurplusPredictionPage';

import NGODashboard from './pages/NGO/NGODashboard';
import DriverDashboard from './pages/Driver/DriverDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading NourishAI...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />

                {/* Restaurant Routes */}
                <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRoles={['restaurant', 'admin']}><RestaurantDashboard /></ProtectedRoute>} />
                <Route path="/restaurant/add-donation" element={<ProtectedRoute allowedRoles={['restaurant', 'admin']}><AddDonationPage /></ProtectedRoute>} />
                <Route path="/restaurant/predict" element={<ProtectedRoute allowedRoles={['restaurant', 'admin']}><SurplusPredictionPage /></ProtectedRoute>} />

                {/* NGO Routes */}
                <Route path="/ngo/dashboard" element={<ProtectedRoute allowedRoles={['ngo', 'admin']}><NGODashboard /></ProtectedRoute>} />

                {/* Driver Routes */}
                <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['driver', 'admin']}><DriverDashboard /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid #334155' } }} />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}
