import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HeartHandshake, MapPin, Clock, Utensils, Filter, Search, ShieldCheck, Map, Grid, CheckCircle2 } from 'lucide-react';
import LeafletMap from '../../components/LeafletMap';

export default function NGODashboard() {
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ beneficiariesCount: 350, mealsReceived: 2100, capacityMealsPerDay: 600 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchNGOData();
  }, []);

  const fetchNGOData = async () => {
    try {
      const [donRes, claimRes, statRes] = await Promise.all([
        api.get('/donations?status=available'),
        api.get('/ngo/my-claims'),
        api.get('/ngo/stats')
      ]);

      if (donRes.data.success) setDonations(donRes.data.donations);
      if (claimRes.data.success) setClaims(claimRes.data.claims);
      if (statRes.data.success) setStats(statRes.data.stats);
    } catch (err) {
      console.warn('Fetch NGO dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (donationId) => {
    setClaiming(true);
    try {
      const res = await api.post('/ngo/claim', { donationId, notes: 'Hope Haven emergency rescue' });
      if (res.data.success) {
        toast.success(`Donation Claimed! Driver assigned with OTP: ${res.data.otpCode}`);
        setSelectedDonation(null);
        fetchNGOData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Claim failed');
    } finally {
      setClaiming(false);
    }
  };

  const filteredDonations = donations.filter(d => {
    if (filterType !== 'ALL' && d.veg_type !== filterType) return false;
    if (searchQuery && !d.food_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const mapMarkers = filteredDonations.map(d => ({
    lat: d.latitude || 37.7749,
    lng: d.longitude || -122.4194,
    title: d.food_name,
    type: 'restaurant',
    description: `${d.approx_meals} meals (${d.approx_weight_kg}kg) | ${d.ai_priority_level} priority`,
    badge: `${d.ai_freshness_score}% Fresh`
  }));

  return (
    <div className="space-y-8 pb-12">
      
      {/* NGO Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" /> NGO Partner Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">Hope Haven Food Rescue</h1>
          <p className="text-xs text-slate-400 mt-1">Claim surplus food from nearby restaurants and feed local community shelters.</p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Grid className="w-4 h-4" /> Feed View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Map className="w-4 h-4" /> Map View
          </button>
        </div>
      </div>

      {/* NGO STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Daily Capacity</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{stats.capacityMealsPerDay} meals</div>
          <span className="text-[11px] text-blue-400 mt-2 block font-semibold">Active shelter distribution</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Meals Received</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{stats.mealsReceived} meals</div>
          <span className="text-[11px] text-emerald-400 mt-2 block font-semibold">Total community impact</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Active Claims</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{claims.length} claims</div>
          <span className="text-[11px] text-amber-400 mt-2 block font-semibold">Drivers dispatched</span>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'Veg', 'Non Veg'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filterType === type ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'glass-panel border-slate-800 text-slate-400'}`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* VIEW CONTENT */}
      {viewMode === 'map' ? (
        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <LeafletMap center={[37.7749, -122.4194]} zoom={13} markers={mapMarkers} height="480px" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((d) => (
            <div key={d.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-blue-500/30 transition-all flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.veg_type === 'Veg' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {d.veg_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                    AI Score: {d.ai_freshness_score}%
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white font-outfit">{d.food_name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{d.description}</p>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Meals Available:</span>
                    <span className="font-bold text-white">{d.approx_meals} meals ({d.approx_weight_kg}kg)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shelf Life Remaining:</span>
                    <span className="font-bold text-brand-400">{d.ai_shelf_life_hours} hrs</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDonation(d)}
                className="w-full mt-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <HeartHandshake className="w-4 h-4" /> Claim Food Donation
              </button>

            </div>
          ))}
        </div>
      )}

      {/* CLAIM CONFIRMATION MODAL */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-md w-full space-y-6">
            <h3 className="text-xl font-bold text-white font-outfit">Confirm Donation Claim</h3>
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <p className="font-bold text-sm text-brand-400">{selectedDonation.food_name}</p>
              <p className="text-slate-300">Meals: {selectedDonation.approx_meals} meals ({selectedDonation.approx_weight_kg}kg)</p>
              <p className="text-slate-400">Freshness Score: {selectedDonation.ai_freshness_score}%</p>
            </div>

            <p className="text-xs text-slate-400">
              Claiming this donation will automatically dispatch an available fleet driver to pick up the food.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedDonation(null)}
                className="flex-1 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleClaim(selectedDonation.id)}
                disabled={claiming}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs"
              >
                {claiming ? 'Processing...' : 'Confirm Claim'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
