import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Sparkles, Utensils, Bell, LogOut, User, Shield, Truck, HeartHandshake, Award, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'restaurant': return '/restaurant/dashboard';
      case 'ngo': return '/ngo/dashboard';
      case 'driver': return '/driver/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  const roleBadges = {
    restaurant: { label: 'Restaurant', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Utensils },
    ngo: { label: 'NGO Partner', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: HeartHandshake },
    driver: { label: 'Express Driver', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Truck },
    admin: { label: 'System Admin', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Shield }
  };

  const badge = user ? roleBadges[user.role] : null;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-400 tracking-tight font-outfit">
                Nourish<span className="text-brand-400">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                Zero Food Waste System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand-400' : 'text-slate-300 hover:text-white'}`}>
              Home
            </Link>
            
            {user && (
              <>
                <Link to={getDashboardLink()} className={`text-sm font-medium transition-colors ${location.pathname.includes('dashboard') ? 'text-brand-400' : 'text-slate-300 hover:text-white'}`}>
                  Dashboard
                </Link>
                {user.role === 'restaurant' && (
                  <>
                    <Link to="/restaurant/add-donation" className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">
                      Publish Food
                    </Link>
                    <Link to="/restaurant/predict" className="text-sm font-medium text-brand-400 flex items-center gap-1.5 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/30 hover:bg-brand-500/20 transition-all">
                      <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
                      AI Surplus Predictor
                    </Link>
                  </>
                )}
              </>
            )}

            <Link to="/leaderboard" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
              <Award className="w-4 h-4 text-amber-400" />
              Leaderboard
            </Link>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-500 rounded-full ring-2 ring-slate-900 animate-ping" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-700/60 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800">
                        <span className="font-semibold text-sm text-white">Live Notifications</span>
                        <span className="text-xs text-brand-400">{notifications.length} new</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                              <p>{n.text}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Role Badge & Profile */}
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                  {badge && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
                      <badge.icon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  )}

                  <div className="text-right">
                    <span className="block text-xs font-semibold text-white">{user.name}</span>
                    <span className="block text-[10px] text-slate-400">{user.email}</span>
                  </div>

                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium">Home</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-brand-400 font-semibold">Dashboard</Link>
              {user.role === 'restaurant' && (
                <Link to="/restaurant/predict" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-400 font-medium">AI Surplus Predictor</Link>
              )}
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 text-red-400 font-medium">Log Out</button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 rounded-xl bg-slate-800 text-white font-medium">Log In</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 rounded-xl bg-brand-500 text-slate-950 font-semibold">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
