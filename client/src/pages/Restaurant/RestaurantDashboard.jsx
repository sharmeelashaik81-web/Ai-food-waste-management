import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Utensils, Sparkles, Plus, Clock, CheckCircle2, AlertCircle, Leaf, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function RestaurantDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    mealsDonated: 1250,
    foodSavedKg: 500,
    co2SavedKg: 900
  });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const res = await api.get('/donations/my-restaurant');
      if (res.data.success) {
        setStats(res.data.stats);
        setDonations(res.data.donations);
      }
    } catch (err) {
      console.warn('Fetch restaurant dashboard failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { day: 'Mon', meals: 40, weightKg: 16 },
    { day: 'Tue', meals: 65, weightKg: 24 },
    { day: 'Wed', meals: 50, weightKg: 19 },
    { day: 'Thu', meals: 80, weightKg: 32 },
    { day: 'Fri', meals: 110, weightKg: 45 },
    { day: 'Sat', meals: 140, weightKg: 58 },
    { day: 'Sun', meals: 95, weightKg: 38 }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Utensils className="w-3.5 h-3.5" /> Restaurant Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">Green Leaf Bistro Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Track your surplus predictions, active donations, and environmental impact.</p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/restaurant/predict"
            className="px-5 py-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 font-semibold text-xs hover:bg-brand-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Surplus Predictor
          </Link>

          <Link
            to="/restaurant/add-donation"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-xs hover:shadow-lg hover:shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publish Food Donation
          </Link>
        </div>
      </div>

      {/* DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Meals Donated</span>
              <div className="text-3xl font-bold text-white font-outfit mt-1">{stats.mealsDonated}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 mt-3 inline-block font-semibold">↑ +14% vs last week</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Food Rescued</span>
              <div className="text-3xl font-bold text-white font-outfit mt-1">{stats.foodSavedKg} kg</div>
            </div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-brand-400 mt-3 inline-block font-semibold">Zero waste target</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">CO₂ Prevented</span>
              <div className="text-3xl font-bold text-white font-outfit mt-1">{stats.co2SavedKg} kg</div>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-teal-300 mt-3 inline-block font-semibold">Green certification level</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Active / Pending</span>
              <div className="text-3xl font-bold text-white font-outfit mt-1">{stats.pending}</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-amber-400 mt-3 inline-block font-semibold">Nearby NGOs notified</span>
        </div>

      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-400" /> Weekly Donation & Meals Impact
            </h3>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="meals" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Quick Insight Box */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-bold text-sm mb-3">
              <Sparkles className="w-5 h-5" /> Gemini AI Weekly Insight
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Fridays & Saturdays generate 40% higher surplus due to dinner buffet over-preparation. Using the AI Surplus Predictor before 14:00 will optimize meal counts and prevent up to 35kg of waste."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Recommended Prep Cut:</span>
              <span className="font-bold text-white">-12% Rice/Naan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Peak NGO Pickup:</span>
              <span className="font-bold text-brand-400">17:30 - 18:30</span>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT DONATIONS TABLE */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Donation History & Live Status</h3>
          <span className="text-xs text-slate-400">{donations.length} total records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Food Item</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Meals / Weight</th>
                <th className="p-3 font-semibold">AI Freshness</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-medium text-white">{d.food_name}</td>
                  <td className="p-3">{d.category} ({d.veg_type})</td>
                  <td className="p-3">{d.approx_meals} meals ({d.approx_weight_kg}kg)</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                      {d.ai_freshness_score || 95}% Fresh
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      d.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      d.status === 'claimed' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
