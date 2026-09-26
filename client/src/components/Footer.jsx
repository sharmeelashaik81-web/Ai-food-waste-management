import React from 'react';
import { Sparkles, Heart, ShieldCheck, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400" />
              </div>
              <span className="font-bold text-lg text-white font-outfit">NourishAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering restaurants, shelters, and drivers with Artificial Intelligence to eliminate food waste, feed communities, and reduce greenhouse gas emissions.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">User Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Restaurant Login</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">NGO & Shelter Portal</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Driver Fleet App</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Platform & AI</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/restaurant/predict" className="hover:text-brand-400 transition-colors">AI Surplus Forecasting</Link></li>
              <li><Link to="/leaderboard" className="hover:text-brand-400 transition-colors">Impact Leaderboard</Link></li>
              <li><a href="#how-it-works" className="hover:text-brand-400 transition-colors">Smart NGO Recommendation</a></li>
              <li><a href="#faq" className="hover:text-brand-400 transition-colors">Route Optimization</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Contact & Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> support@nourishai.org</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> +1 (800) 555-FOOD</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400" /> San Francisco, CA</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 NourishAI System. Built for Hackathon Excellence.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-400"><ShieldCheck className="w-4 h-4 text-brand-400" /> Hackathon Production Ready</span>
            <span className="flex items-center gap-1 text-slate-400"><Heart className="w-4 h-4 text-red-400" /> Food Saved Daily</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
