import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Sparkles, Utensils, Clock, AlertTriangle, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';

export default function AddDonationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    food_name: 'Fresh Mixed Vegetable Curry & Rice',
    category: 'Cooked Food',
    veg_type: 'Veg',
    cuisine: 'Lunch',
    approx_weight_kg: 15,
    approx_meals: 35,
    description: 'Hot insulated containers of organic curry prepared in restaurant kitchen.',
    latitude: 37.7749,
    longitude: -122.4194,
    special_instructions: 'Keep in heat-insulated bag until pickup'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnalyzeAI = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/ai/analyze-freshness', {
        foodName: formData.food_name,
        category: formData.category,
        vegType: formData.veg_type,
        cuisine: formData.cuisine,
        approxWeightKg: formData.approx_weight_kg,
        approxMeals: formData.approx_meals
      });
      if (res.data.success) {
        setAiResult(res.data.analysis);
        toast.success('Gemini AI analysis complete!');
      }
    } catch (err) {
      toast.error('AI analysis error, using fallback safety scores.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const res = await api.post('/donations', formData);
      if (res.data.success) {
        toast.success('Food donation published! Nearby NGOs notified in real-time.');
        navigate('/restaurant/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Publishing failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> AI Freshness & NGO Matching Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white font-outfit">Publish Surplus Food Donation</h1>
        <p className="text-xs text-slate-400">Fill in food details, trigger Gemini AI analysis, and broadcast to nearby NGOs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORM */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <form onSubmit={handlePublish} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Food Item Name</label>
              <input
                type="text"
                name="food_name"
                value={formData.food_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dietary Type</label>
                <select
                  name="veg_type"
                  value={formData.veg_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
                >
                  <option value="Veg">Vegetarian</option>
                  <option value="Non Veg">Non-Vegetarian</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cuisine / Course</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
                >
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Approx Weight (kg)</label>
                <input
                  type="number"
                  name="approx_weight_kg"
                  value={formData.approx_weight_kg}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Approx Meals Count</label>
                <input
                  type="number"
                  name="approx_meals"
                  value={formData.approx_meals}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Storage Notes</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Instructions</label>
              <input
                type="text"
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleAnalyzeAI}
                disabled={analyzing}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-400 font-semibold text-xs border border-brand-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brand-400" />
                {analyzing ? 'Analyzing with Gemini AI...' : 'Analyze Freshness with AI'}
              </button>

              <button
                type="submit"
                disabled={publishing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-xs hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {publishing ? 'Publishing...' : 'Publish Donation'}
              </button>
            </div>

          </form>
        </div>

        {/* AI PREDICTION CARD */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" /> Gemini AI Assessment
          </h3>

          {aiResult ? (
            <div className="space-y-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Freshness Score:</span>
                  <span className="font-bold text-emerald-400 text-base">{aiResult.freshnessScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${aiResult.freshnessScore}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Safe Shelf-Life:</span>
                  <span className="font-bold text-white">{aiResult.remainingShelfLifeHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spoilage Risk:</span>
                  <span className="font-bold text-emerald-400">{(aiResult.spoilageProbability * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority Level:</span>
                  <span className="font-bold uppercase text-amber-400">{aiResult.priorityLevel}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-slate-300 leading-relaxed">
                <span className="font-bold text-brand-400 block mb-1">AI Recommendation:</span>
                {aiResult.aiSummary}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
              <p>Click "Analyze Freshness with AI" to generate real-time shelf life, spoilage risk & NGO suitability scores.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
