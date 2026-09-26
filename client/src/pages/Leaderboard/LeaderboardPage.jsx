import React from 'react';
import { Award, Trophy, Sparkles, Utensils, HeartHandshake, Leaf, Star } from 'lucide-react';

export default function LeaderboardPage() {
  const topRestaurants = [
    { rank: 1, name: 'Green Leaf Gourmet Bistro', meals: 1250, co2: 840, badge: '🏆 Zero Waste Champion' },
    { rank: 2, name: 'San Francisco Organic Kitchen', meals: 980, co2: 660, badge: '🥇 Gold Food Saver' },
    { rank: 3, name: 'Mission District Bakery', meals: 740, co2: 490, badge: '🥈 Silver Food Rescue' },
    { rank: 4, name: 'Bay Area Deli & Grill', meals: 520, co2: 350, badge: '🥉 Community Hero' }
  ];

  const topNGOs = [
    { rank: 1, name: 'Hope Haven Food Rescue', meals: 2100, beneficiaries: 350, badge: '🌟 Top Rescue Shelter' },
    { rank: 2, name: 'Bay Area Hunger Alliance', meals: 1650, beneficiaries: 280, badge: '💙 Community Shield' },
    { rank: 3, name: 'St. Vincent Meal Program', meals: 1200, beneficiaries: 210, badge: '✨ Compassion Force' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative overflow-hidden space-y-3">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-amber-400" /> Platform Gamification & Rankings
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">Community Impact Leaderboard</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">Celebrating restaurants and NGOs rescuing surplus food and mitigating carbon emissions daily.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Top Restaurants */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" /> Top Donating Restaurants
          </h3>

          <div className="space-y-3">
            {topRestaurants.map((r) => (
              <div key={r.rank} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs ${
                    r.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    r.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                  }`}>
                    #{r.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{r.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">{r.badge}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-extrabold text-white block text-sm">{r.meals} meals</span>
                  <span className="text-slate-400 text-[11px]">{r.co2}kg CO₂ saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top NGOs */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-blue-400" /> Top Rescue NGOs
          </h3>

          <div className="space-y-3">
            {topNGOs.map((n) => (
              <div key={n.rank} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-extrabold text-xs">
                    #{n.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{n.name}</h4>
                    <span className="text-[10px] text-blue-400 font-semibold">{n.badge}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-extrabold text-white block text-sm">{n.meals} received</span>
                  <span className="text-slate-400 text-[11px]">{n.beneficiaries} fed daily</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
