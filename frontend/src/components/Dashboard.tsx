import React from 'react';
import { User, SavedRecommendation } from '../types';
import { PlusCircle, Search, History, HelpCircle, FileText, BarChart3, ShieldCheck, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  onNewRecommendation: () => void;
  onExploreMaterials: () => void;
  onOpenHistory: () => void;
  onOpenAskPackWise: () => void;
  onViewRecommendation: (recId: string) => void;
  savedList: SavedRecommendation[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onNewRecommendation,
  onExploreMaterials,
  onOpenHistory,
  onOpenAskPackWise,
  onViewRecommendation,
  savedList
}) => {
  const categoryChartData = [
    { name: 'Snacks', count: 42 },
    { name: 'Vegetables', count: 35 },
    { name: 'Fruits', count: 28 },
    { name: 'Dairy', count: 22 },
    { name: 'Grains', count: 18 },
    { name: 'Meat', count: 14 }
  ];

  const materialDistributionData = [
    { name: 'PET/Al/PE', value: 35, color: '#4CAF50' },
    { name: 'Micro-Perf PE', value: 28, color: '#FF9800' },
    { name: 'PET/LDPE', value: 20, color: '#7CB342' },
    { name: 'BOPP/CPP', value: 17, color: '#29B6F6' }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#245B35] via-[#2d6f42] to-[#4CAF50] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFC107] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> PackWise AI Dashboard
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome, {user.full_name}!
              </h1>
              <p className="text-slate-100 text-sm mt-1">
                Role: <span className="font-bold text-[#FFC107]">{user.user_type}</span> | Smarter Packaging. Better Food Protection.
              </p>
            </div>

            <button
              onClick={onNewRecommendation}
              className="flex items-center gap-2.5 bg-[#FF9800] hover:bg-[#FF9800]/90 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transform hover:-translate-y-0.5 transition-all text-sm shrink-0"
            >
              <PlusCircle className="w-5 h-5" />
              Start New Analysis
            </button>
          </div>
        </div>

        {/* Overview Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Recommendations Generated", val: "148", icon: BarChart3, color: "text-[#4CAF50]", bg: "bg-emerald-50" },
            { label: "Food Commodities Analyzed", val: "15", icon: Layers, color: "text-[#FF9800]", bg: "bg-amber-50" },
            { label: "Reports Exported", val: "64", icon: FileText, color: "text-[#7CB342]", bg: "bg-lime-50" },
            { label: "Saved Recommendations", val: savedList.length.toString() || "8", icon: ShieldCheck, color: "text-[#29B6F6]", bg: "bg-sky-50" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-food-card border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-extrabold text-[#245B35] mt-1">{stat.val}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={onNewRecommendation}
            className="p-5 bg-white hover:bg-emerald-50/50 border border-[#4CAF50]/30 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <PlusCircle className="w-8 h-8 text-[#4CAF50] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-sm text-[#245B35]">New Packaging Analysis</h3>
            <p className="text-xs text-slate-500 mt-1">Multi-step food property analysis wizard.</p>
          </button>

          <button
            onClick={onExploreMaterials}
            className="p-5 bg-white hover:bg-amber-50/50 border border-[#FF9800]/30 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <Search className="w-8 h-8 text-[#FF9800] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-sm text-[#245B35]">Material Database Explorer</h3>
            <p className="text-xs text-slate-500 mt-1">Browse 14+ materials & film structures.</p>
          </button>

          <button
            onClick={onOpenHistory}
            className="p-5 bg-white hover:bg-lime-50/50 border border-[#7CB342]/30 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <History className="w-8 h-8 text-[#7CB342] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-sm text-[#245B35]">Saved Reports & History</h3>
            <p className="text-xs text-slate-500 mt-1">View saved reports, PDFs & QR codes.</p>
          </button>

          <button
            onClick={onOpenAskPackWise}
            className="p-5 bg-white hover:bg-sky-50/50 border border-[#29B6F6]/30 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <HelpCircle className="w-8 h-8 text-[#29B6F6] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-sm text-[#245B35]">Ask PackWise Assistant</h3>
            <p className="text-xs text-slate-500 mt-1">Grounded packaging science QA bot.</p>
          </button>
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200">
            <h3 className="font-extrabold text-base text-[#245B35] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
              Commodity Analysis by Food Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#4CAF50" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200">
            <h3 className="font-extrabold text-base text-[#245B35] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FF9800]" />
              Top Recommended Packaging Structures
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={materialDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {materialDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-600 mt-2">
              {materialDistributionData.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></span>
                  {m.name} ({m.value}%)
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Demo Scenarios Quick Launcher Cards */}
        <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg text-[#245B35]">Test Demonstration Scenarios</h3>
              <p className="text-xs text-slate-500">Run pre-configured commodity tests required for SIH evaluation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Potato Chips", desc: "High O2 sensitivity, low moisture -> PET/Al/PE", tag: "Snacks", img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=300" },
              { name: "Tomato", desc: "High respiration, chilled -> Micro-perforated PE", tag: "Produce", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300" },
              { name: "Rice", desc: "Low moisture, long storage -> Woven PP / PE", tag: "Grains", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300" },
              { name: "Fresh Milk", desc: "Liquid dairy, chilled -> EVOH / HDPE bottle", tag: "Dairy", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300" }
            ].map((sc, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-[#FFF8E7]/20 p-3 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <img src={sc.img} alt={sc.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                  <span className="text-[10px] font-bold text-[#4CAF50] bg-emerald-100 px-2 py-0.5 rounded-full uppercase">{sc.tag}</span>
                  <h4 className="font-extrabold text-sm text-[#245B35] mt-1">{sc.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{sc.desc}</p>
                </div>
                <button
                  onClick={onNewRecommendation}
                  className="mt-3 w-full py-1.5 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Run Scenario Test
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
