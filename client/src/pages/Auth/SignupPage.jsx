import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Utensils, HeartHandshake, Truck, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [role, setRole] = useState('restaurant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    restaurantName: '',
    organizationName: '',
    vehicleType: 'Refrigerated Van'
  });
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await signup({ ...formData, role });
    setSubmitting(false);
    if (result && result.success) {
      if (result.role === 'restaurant') navigate('/restaurant/dashboard');
      else if (result.role === 'ngo') navigate('/ngo/dashboard');
      else if (result.role === 'driver') navigate('/driver/dashboard');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white font-outfit">Join the Food Rescue Mission</h2>
          <p className="text-xs text-slate-400">Select account role and register your organization</p>
        </div>

        {/* Role Select */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRole('restaurant')}
            className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${role === 'restaurant' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'glass-panel border-slate-800 text-slate-400'}`}
          >
            <Utensils className="w-5 h-5" />
            Restaurant
          </button>

          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${role === 'ngo' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'glass-panel border-slate-800 text-slate-400'}`}
          >
            <HeartHandshake className="w-5 h-5" />
            NGO / Shelter
          </button>

          <button
            type="button"
            onClick={() => setRole('driver')}
            className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${role === 'driver' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'glass-panel border-slate-800 text-slate-400'}`}
          >
            <Truck className="w-5 h-5" />
            Driver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="user@domain.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="+1 555-0192"
              />
            </div>
          </div>

          {role === 'restaurant' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Restaurant / Bistro Name</label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="Green Leaf Gourmet Bistro"
              />
            </div>
          )}

          {role === 'ngo' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">NGO / Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="Hope Haven Food Bank"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Location / Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              placeholder="742 Evergreen Terrace, San Francisco, CA"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Already have an account? <Link to="/login" className="text-brand-400 font-semibold hover:underline">Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
