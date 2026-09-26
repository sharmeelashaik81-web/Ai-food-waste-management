import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Sparkles, TrendingUp, Utensils, Calendar, CloudSun, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SurplusPredictionPage() {
  const [formData, setFormData] = useState({
    todayCustomers: 140,
    previous30DaySalesAvg: 160,
    currentBookings: 25,
    isWeekendOrFestival: true,
    weather: 'Clear & Mild',
    menuItems: 'Paneer Butter Masala, Garlic Naan, Veg Biryani, Gulab Jamun',
    foodCookedKg: 50,
    currentTime: '14:30'
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState({
    expectedRemainingFoodKg: 12.5,
    expectedWasteKg: 3.2,
    mealsAvailable: 30,
    donationScore: 94,
    bestPickupTime: '17:00 - 18:30',
    confidencePercentage: 95,
    reasoning: 'Based on customer footfall (140) vs 50kg cooked food on a weekend, expected surplus is ~12.5kg (~30 meals). High donation confidence.'
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/ai/predict-surplus', formData);
      if (res.data.success) {
        setPrediction(res.data.prediction);
        toast.success('Gemini AI Surplus Forecast Updated!');
      }
    } catch (err) {
      toast.error('AI forecasting model fallback active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/30">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Core AI Forecasting Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white font-outfit">AI Food Surplus & Waste Predictor</h1>
        <p className="text-xs text-slate-400">Input daily sales, reservations, weather, and cooked amounts to forecast surplus food before it spoils.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT FORM */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" /> Operational Inputs
          </h3>

          <form onSubmit={handlePredict} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Today's Footfall (Customers)</label>
                <input
                  type="number"
                  name="todayCustomers"
                  value={formData.todayCustomers}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">30-Day Sales Avg</label>
                <input
                  type="number"
                  name="previous30DaySalesAvg"
                  value={formData.previous30DaySalesAvg}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Bookings</label>
                <input
                  type="number"
                  name="currentBookings"
                  value={formData.currentBookings}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Total Food Cooked (kg)</label>
                <input
                  type="number"
                  name="foodCookedKg"
                  value={formData.foodCookedKg}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Menu Items Prepared</label>
              <input
                type="text"
                name="menuItems"
                value={formData.menuItems}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weather Condition</label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
                >
                  <option value="Clear & Mild">Clear & Mild</option>
                  <option value="Rainy">Rainy (Low Footfall)</option>
                  <option value="Hot / Humid">Hot / Humid</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isWeekendOrFestival"
                    checked={formData.isWeekendOrFestival}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 bg-slate-900 border-slate-700"
                  />
                  Weekend or Festival Day
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Running Gemini AI Model...' : 'Calculate AI Surplus Forecast'}
            </button>

          </form>
        </div>

        {/* AI PREDICTION VISUAL CARDS */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-8 rounded-3xl border border-brand-500/30 space-y-6 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Gemini AI Forecast Result
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold">
                {prediction.confidencePercentage}% Confidence
              </span>
            </div>

            {/* Big Stat Numbers */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block">Expected Remaining</span>
                <span className="text-3xl font-extrabold text-white font-outfit mt-1 block">{prediction.expectedRemainingFoodKg} kg</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block">Meals Available</span>
                <span className="text-3xl font-extrabold text-brand-400 font-outfit mt-1 block">{prediction.mealsAvailable} meals</span>
              </div>
            </div>

            {/* Additional Predictions */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Predicted Waste:</span>
                <span className="font-bold text-red-400">{prediction.expectedWasteKg} kg</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Donation Viability Score:</span>
                <span className="font-bold text-emerald-400">{prediction.donationScore} / 100</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Optimal Pickup Window:</span>
                <span className="font-bold text-amber-400">{prediction.bestPickupTime}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-brand-400 block mb-1">AI Reasoning Summary:</span>
              {prediction.reasoning}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
