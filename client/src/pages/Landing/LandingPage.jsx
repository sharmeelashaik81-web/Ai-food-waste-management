import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, HeartHandshake, Truck, ShieldCheck, TrendingUp, Clock, MapPin, Award, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import LeafletMap from '../../components/LeafletMap';

export default function LandingPage() {
  const sampleMarkers = [
    { lat: 37.7749, lng: -122.4194, title: 'Green Leaf Bistro', type: 'restaurant', description: 'Gourmet Curry (45 meals available)', badge: 'Freshness: 96%' },
    { lat: 37.7649, lng: -122.4294, title: 'Hope Haven Food Rescue', type: 'ngo', description: 'Capacity: 600 meals/day', badge: 'Verified Partner' },
    { lat: 37.7700, lng: -122.4200, title: 'Alex Rivera (Express Van)', type: 'driver', description: 'En route to pickup', badge: 'ETA 12 mins' }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-500/30 text-brand-400 text-xs font-semibold mb-8 shadow-lg shadow-brand-500/10"
          >
            <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
            <span>AI-Powered Food Rescue & Surplus Prediction System</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-outfit leading-tight max-w-5xl mx-auto"
          >
            Bridge the Gap Between <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">
              Restaurant Surplus & Hunger Relief
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Predict remaining unsold food with Gemini AI, detect freshness, automatically match with nearby shelters, and optimize express delivery routes in real-time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/restaurant/predict"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              Try AI Surplus Predictor
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl glass-panel text-white font-semibold text-base hover:bg-slate-800/80 border-slate-700 hover:border-brand-500/40 transition-all flex items-center gap-2"
            >
              Role Portals & Login
              <ArrowRight className="w-5 h-5 text-brand-400" />
            </Link>
          </motion.div>

          {/* Demo Login Quick Note */}
          <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-brand-400" /> Pre-configured Hackathon Seed Data</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-brand-400" /> Demo Credentials: restaurant@demo.com / password123</span>
          </div>

        </div>
      </section>

      {/* STATS IMPACT COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl text-center border-slate-800 hover:border-brand-500/30 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-brand-400 font-outfit mb-1">3,450+</div>
            <div className="text-sm font-semibold text-white">Meals Served</div>
            <div className="text-xs text-slate-400 mt-1">To local community shelters</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border-slate-800 hover:border-emerald-500/30 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-emerald-400 font-outfit mb-1">1,820 kg</div>
            <div className="text-sm font-semibold text-white">Food Rescued</div>
            <div className="text-xs text-slate-400 mt-1">Saved from landfills</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border-slate-800 hover:border-teal-500/30 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-teal-300 font-outfit mb-1">3,270 kg</div>
            <div className="text-sm font-semibold text-white">CO₂ Emissions Saved</div>
            <div className="text-xs text-slate-400 mt-1">Environmental mitigation</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border-slate-800 hover:border-purple-500/30 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-purple-400 font-outfit mb-1">98.4%</div>
            <div className="text-sm font-semibold text-white">AI Prediction Accuracy</div>
            <div className="text-xs text-slate-400 mt-1">Powered by Google Gemini</div>
          </div>

        </div>
      </section>

      {/* HOW AI WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Autonomous Intelligence</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white font-outfit">How the AI Engine Works</h3>
          <p className="text-slate-400 mt-3 text-sm">Four seamless steps powered by Google Gemini and real-time route optimization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="glass-panel p-6 rounded-2xl relative border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-4 text-brand-400 font-bold">1</div>
            <h4 className="font-bold text-white mb-2">1. Input Sales & Weather</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Restaurant inputs customer counts, 30-day average sales, current bookings, and menu items.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 font-bold">2</div>
            <h4 className="font-bold text-white mb-2">2. Gemini AI Forecast</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Gemini predicts expected unsold food, remaining shelf-life hours, spoilage probability, and estimated meals.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-4 text-teal-300 font-bold">3</div>
            <h4 className="font-bold text-white mb-2">3. Smart NGO Match</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Algorithm calculates Haversine distance and ranks nearby NGOs by capacity to auto-notify top shelters via Socket.IO.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 font-bold">4</div>
            <h4 className="font-bold text-white mb-2">4. Express Delivery & OTP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Driver accepts delivery, follows optimized map navigation, and verifies delivery using a secure 4-digit OTP.</p>
          </div>

        </div>
      </section>

      {/* LIVE MAP & DONATION FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/30">
                Live Interactive Map
              </span>
              <h3 className="text-2xl font-bold text-white font-outfit mt-2">Active Food Rescue Network</h3>
            </div>
            <Link to="/login" className="px-4 py-2 rounded-xl bg-brand-500 text-slate-950 text-xs font-bold hover:bg-brand-400 transition-colors">
              Claim Nearby Donation
            </Link>
          </div>

          <LeafletMap center={[37.7749, -122.4194]} zoom={13} markers={sampleMarkers} height="380px" />
        </div>
      </section>

      {/* FOUR USER ROLE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Role Based Ecosystem</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white font-outfit">Four Dedicated Stakeholder Portals</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Restaurant Portal</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Add donations, run Gemini AI food freshness analysis, and view surplus prediction charts.</p>
            <Link to="/login" className="text-xs font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1">
              Login as Restaurant <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">NGO & Shelter Portal</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Browse map feed of available donations, filter by distance/expiry, and claim food instantly.</p>
            <Link to="/login" className="text-xs font-semibold text-blue-400 hover:underline inline-flex items-center gap-1">
              Login as NGO <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Driver Fleet App</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Follow optimized pickup/delivery routes on maps and complete deliveries with 4-digit OTPs.</p>
            <Link to="/login" className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1">
              Login as Driver <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Admin Governance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Manage users, approve applications, monitor platform analytics, and export PDF/CSV reports.</p>
            <Link to="/login" className="text-xs font-semibold text-purple-400 hover:underline inline-flex items-center gap-1">
              Login as Admin <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
