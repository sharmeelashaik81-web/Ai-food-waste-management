import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Truck, MapPin, CheckCircle2, ShieldCheck, Navigation, Camera, Key } from 'lucide-react';
import LeafletMap from '../../components/LeafletMap';

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [proofUrl, setProofUrl] = useState('https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/driver/my-deliveries');
      if (res.data.success) {
        setDeliveries(res.data.deliveries);
      }
    } catch (err) {
      console.warn('Fetch driver deliveries failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, status) => {
    try {
      const res = await api.post('/driver/status', { deliveryId, status });
      if (res.data.success) {
        toast.success(`Navigation Status: ${status.replace('_', ' ')}`);
        fetchDeliveries();
      }
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleVerifyOTP = async (deliveryId) => {
    if (!otpInput) {
      toast.error('Please enter the 4-digit OTP code');
      return;
    }
    setVerifying(true);
    try {
      const res = await api.post('/driver/verify-otp', {
        deliveryId,
        otpCode: otpInput,
        proofImageUrl: proofUrl
      });
      if (res.data.success) {
        toast.success('OTP Verified! Delivery Completed Successfully.');
        setOtpInput('');
        fetchDeliveries();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifying(false);
    }
  };

  const activeDelivery = deliveries.find(d => d.status !== 'delivered');

  const mapWaypoints = activeDelivery?.route_geometry || [
    [37.7749, -122.4194],
    [37.7700, -122.4200],
    [37.7649, -122.4294]
  ];

  const mapMarkers = activeDelivery ? [
    { lat: 37.7749, lng: -122.4194, title: activeDelivery.restaurantName, type: 'restaurant', description: activeDelivery.restaurantAddress, badge: 'Pickup Location' },
    { lat: 37.7649, lng: -122.4294, title: activeDelivery.ngoName, type: 'ngo', description: activeDelivery.ngoAddress, badge: 'Delivery Destination' },
    { lat: 37.7700, lng: -122.4200, title: 'Your Express Van', type: 'driver', description: 'Live Location', badge: 'Active Driver' }
  ] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5" /> Driver Express Fleet
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">Alex Rivera Navigation Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time route optimization, pickup instructions, and OTP delivery verification.</p>
        </div>
      </div>

      {activeDelivery ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Navigation Panel */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-bold text-white text-base flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-400 animate-pulse" /> Active Assigned Task
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase">
                {activeDelivery.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Address cards */}
            <div className="space-y-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block">STEP 1: PICKUP RESTAURANT</span>
                <h4 className="font-bold text-white text-sm">{activeDelivery.restaurantName}</h4>
                <p className="text-slate-400">{activeDelivery.restaurantAddress}</p>
                <p className="text-slate-300 font-medium mt-1">Food Item: {activeDelivery.donation?.food_name}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-blue-400 font-bold uppercase text-[10px] block">STEP 2: DROP-OFF SHELTER</span>
                <h4 className="font-bold text-white text-sm">{activeDelivery.ngoName}</h4>
                <p className="text-slate-400">{activeDelivery.ngoAddress}</p>
              </div>

            </div>

            {/* Navigation Status Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStatusUpdate(activeDelivery.id, 'en_route_pickup')}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px]"
              >
                1. To Pickup
              </button>
              <button
                onClick={() => handleStatusUpdate(activeDelivery.id, 'arrived_pickup')}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px]"
              >
                2. Arrived
              </button>
              <button
                onClick={() => handleStatusUpdate(activeDelivery.id, 'en_route_delivery')}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px]"
              >
                3. To Shelter
              </button>
            </div>

            {/* OTP VERIFICATION BOX */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Key className="w-4 h-4 text-brand-400" /> Verify 4-Digit NGO OTP Code
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  maxLength="4"
                  placeholder="Enter OTP (e.g. 8492)"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl glass-input text-center font-mono font-bold tracking-widest text-lg"
                />
                <button
                  onClick={() => handleVerifyOTP(activeDelivery.id)}
                  disabled={verifying}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-xs"
                >
                  {verifying ? 'Verifying...' : 'Complete Delivery'}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">Ask the receiving NGO coordinator for their 4-digit verification code to complete dropoff.</p>
            </div>

          </div>

          {/* Map & Route */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm">Optimized Route Preview</h3>
            <LeafletMap center={[37.7700, -122.4200]} zoom={13} markers={mapMarkers} routeWaypoints={mapWaypoints} height="360px" />
          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-brand-400 mx-auto" />
          <h3 className="text-xl font-bold text-white font-outfit">All Deliveries Complete!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">You have no active pending deliveries. Stand by for real-time Socket.IO notifications when new claims are published.</p>
        </div>
      )}

    </div>
  );
}
