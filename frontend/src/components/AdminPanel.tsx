import React, { useState } from 'react';
import { Shield, Plus, Trash2, Edit2, Users, Layers, BarChart3, ArrowLeft } from 'lucide-react';

export const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'commodities' | 'materials' | 'users'>('analytics');
  
  const sampleUsers = [
    { id: 'u-1', name: 'Dr. Rajesh Kumar', email: 'rajesh@agri.in', type: 'Researcher', date: '2026-01-10' },
    { id: 'u-2', name: 'Vikram Singh', email: 'vikram@foodpack.com', type: 'Food Manufacturer', date: '2026-01-12' },
    { id: 'u-3', name: 'Ananya Sharma', email: 'ananya@startup.io', type: 'Startup', date: '2026-01-15' },
    { id: 'u-4', name: 'SIH Admin User', email: 'admin@packwise.ai', type: 'Admin', date: '2026-01-01' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Admin Title Bar */}
      <div className="flex justify-between items-center bg-[#245B35] text-white p-6 rounded-3xl shadow-lg">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 font-bold text-xs text-[#FFC107] hover:underline mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </button>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FFC107]" /> Admin Operations Panel
          </h1>
          <p className="text-xs text-slate-200">Manage commodities, packaging materials, decision rules, and user activity.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 bg-white/10 p-1.5 rounded-2xl">
          {[
            { id: 'analytics', label: 'System Analytics' },
            { id: 'commodities', label: 'Commodities' },
            { id: 'materials', label: 'Materials' },
            { id: 'users', label: 'Users' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id ? 'bg-[#FFC107] text-slate-dark shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Recommendations", val: "148" },
              { label: "Commodity Database", val: "15 Items" },
              { label: "Packaging Structures", val: "10 Structures" },
              { label: "Registered Platform Users", val: "29 Users" }
            ].map((st, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-food-card border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">{st.label}</p>
                <p className="text-3xl font-extrabold text-[#245B35] mt-1">{st.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-food-card border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-extrabold text-sm text-[#245B35]">
            Platform Users Management
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4 font-bold">User ID</th>
                <th className="p-4 font-bold">Full Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">User Category</th>
                <th className="p-4 font-bold">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-slate-500">{u.id}</td>
                  <td className="p-4 font-extrabold text-slate-800">{u.name}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4 font-bold text-[#4CAF50]">{u.type}</td>
                  <td className="p-4 text-slate-500">{u.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Commodities Tab Placeholder */}
      {activeTab === 'commodities' && (
        <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-[#245B35]">Manage Food Commodities</h3>
            <button className="flex items-center gap-1 bg-[#4CAF50] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md">
              <Plus className="w-4 h-4" /> Add Commodity
            </button>
          </div>
          <p className="text-xs text-slate-500">15 commodities preloaded in database. Edit or append new agricultural commodities.</p>
        </div>
      )}

      {/* Materials Tab Placeholder */}
      {activeTab === 'materials' && (
        <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-[#245B35]">Manage Packaging Materials & Rules</h3>
            <button className="flex items-center gap-1 bg-[#4CAF50] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md">
              <Plus className="w-4 h-4" /> Add Material
            </button>
          </div>
          <p className="text-xs text-slate-500">14 packaging materials & 10 structures preloaded.</p>
        </div>
      )}

    </div>
  );
};
