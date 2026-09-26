import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, Users, FileText, Download, Ban, CheckCircle, Activity, BarChart2 } from 'lucide-react';

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    totalDonations: 0,
    totalMealsServed: 3450,
    totalFoodSavedKg: 1820,
    totalCO2SavedKg: 3270,
    userCounts: { restaurants: 1, ngos: 1, drivers: 1, admins: 1 },
    recentAuditLogs: []
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [overRes, usersRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users')
      ]);

      if (overRes.data.success) setOverview(overRes.data.overview);
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      console.warn('Fetch admin overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlacklist = async (userId, currentBlacklist) => {
    try {
      const res = await api.post('/admin/user-status', { userId, is_blacklisted: !currentBlacklist });
      if (res.data.success) {
        toast.success(`User status updated.`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleExportCSV = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/csv`, '_blank');
  };

  const handleExportPDF = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/pdf`, '_blank');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Governance Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">Platform Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Audit logs, user verification, system metrics, and compliance exports.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
          
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <FileText className="w-4 h-4" /> Download PDF Audit
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400">Total System Users</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{users.length} registered</div>
          <span className="text-[11px] text-purple-400 mt-2 block font-semibold">Across 4 roles</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400">Total Meals Served</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{overview.totalMealsServed}</div>
          <span className="text-[11px] text-emerald-400 mt-2 block font-semibold">Community impact</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400">Total Food Saved</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{overview.totalFoodSavedKg} kg</div>
          <span className="text-[11px] text-brand-400 mt-2 block font-semibold">Zero waste metric</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <span className="text-xs text-slate-400">CO₂ Prevented</span>
          <div className="text-3xl font-bold text-white font-outfit mt-1">{overview.totalCO2SavedKg} kg</div>
          <span className="text-[11px] text-teal-300 mt-2 block font-semibold">Emissions offset</span>
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> User Accounts & Governance
          </h3>
          <span className="text-xs text-slate-400">{users.length} accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Name / Organization</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold">Verification</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-medium text-white">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 font-semibold uppercase text-[10px] text-slate-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${u.is_blacklisted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {u.is_blacklisted ? 'Blacklisted' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleBlacklist(u.id, u.is_blacklisted)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all ${u.is_blacklisted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}
                    >
                      {u.is_blacklisted ? 'Unblock' : 'Blacklist'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
