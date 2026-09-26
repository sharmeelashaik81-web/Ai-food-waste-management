import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Utensils, HeartHandshake, Truck, Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('restaurant');
  const [email, setEmail] = useState('restaurant@demo.com');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    if (role === 'restaurant') setEmail('restaurant@demo.com');
    if (role === 'ngo') setEmail('ngo@demo.com');
    if (role === 'driver') setEmail('driver@demo.com');
    if (role === 'admin') setEmail('admin@demo.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password, selectedRole);
    setSubmitting(false);
    if (result && result.success) {
      if (result.role === 'restaurant') navigate('/restaurant/dashboard');
      else if (result.role === 'ngo') navigate('/ngo/dashboard');
      else if (result.role === 'driver') navigate('/driver/dashboard');
      else if (result.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit">Welcome Back to NourishAI</h2>
          <p className="text-xs text-slate-400">Select your role to access your dedicated portal</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleTabChange('restaurant')}
            className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${selectedRole === 'restaurant' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Utensils className="w-4 h-4" />
            Bistro
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('ngo')}
            className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${selectedRole === 'ngo' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <HeartHandshake className="w-4 h-4" />
            NGO
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('driver')}
            className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${selectedRole === 'driver' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Truck className="w-4 h-4" />
            Driver
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${selectedRole === 'admin' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="name@organization.org"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo Password is "password123"'); }} className="text-[11px] text-brand-400 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? 'Authenticating...' : `Log In as ${selectedRole.toUpperCase()}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
