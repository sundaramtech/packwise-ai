import React, { useState, useEffect } from 'react';
import { PackagingMaterial } from '../types';
import { fetchMaterials } from '../services/api';
import { Search, Filter, ShieldCheck, Leaf, Layers, ArrowLeft, X, AlertCircle } from 'lucide-react';

export const MaterialExplorer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [materials, setMaterials] = useState<PackagingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBarrier, setSelectedBarrier] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState<PackagingMaterial | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchMaterials(search, selectedCategory);
    setMaterials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory]);

  const handleClearSearch = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBarrier('All');
  };

  // Extra client-side filter pass for instant real-time responsiveness
  const filteredMaterials = materials.filter(m => {
    if (selectedBarrier !== 'All') {
      const b = selectedBarrier.toLowerCase();
      const mBarrier = (m.moisture_barrier || '').toLowerCase();
      const oBarrier = (m.oxygen_barrier || '').toLowerCase();
      if (!mBarrier.includes(b) && !oBarrier.includes(b)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Title Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 font-bold text-xs text-slate-500 hover:text-[#245B35] mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-[#245B35]">Packaging Material Database Explorer</h1>
          <p className="text-xs text-slate-500">Search and filter packaging materials, polymers, and film structures across all food categories.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        {/* Real-time Search Input with Clear Button */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material by name, category, application (e.g. chips, tomato, PET, foil, coffee)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Flexible Plastic">Flexible Plastic</option>
            <option value="Flexible Film">Flexible Film</option>
            <option value="Laminate Barrier">Laminate Barrier</option>
            <option value="Breathable Produce Film">Breathable Produce Film</option>
            <option value="Bio-based / Compostable">Bio-based / Compostable</option>
            <option value="High Barrier Polymer Laminate">High Barrier Polymer Laminate</option>
            <option value="Paper-Based Packaging">Paper-Based Packaging</option>
          </select>

          <select
            value={selectedBarrier}
            onChange={(e) => setSelectedBarrier(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-700"
          >
            <option value="All">All Barrier Levels</option>
            <option value="High">High Barrier</option>
            <option value="Controlled">Controlled / Breathable</option>
            <option value="Absolute">Very High / Absolute</option>
          </select>

          {(search || selectedCategory !== 'All' || selectedBarrier !== 'All') && (
            <button
              onClick={handleClearSearch}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Materials Cards Grid / Empty State */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-bold text-sm">
          Loading packaging materials database...
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 shadow-sm border border-slate-200 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-extrabold text-lg text-[#245B35]">No Packaging Materials Found</h3>
          <p className="text-xs text-slate-500">
            No packaging materials in the database match your query "<span className="font-bold">{search}</span>".
          </p>
          <button
            onClick={handleClearSearch}
            className="px-5 py-2.5 bg-[#4CAF50] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-[#4CAF50]/90 transition-all"
          >
            Reset Search & Show All Materials
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <div key={mat.id} className="bg-white rounded-3xl p-6 shadow-food-card border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-[#4CAF50] bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                    {mat.category}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Cost: {mat.relative_cost}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#245B35]">{mat.name}</h3>

                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                  <p><span className="font-bold text-slate-600">WVTR:</span> {mat.wvtr_range}</p>
                  <p><span className="font-bold text-slate-600">OTR:</span> {mat.otr_range}</p>
                  <p><span className="font-bold text-slate-600">Recyclability:</span> {mat.recyclability}</p>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Typical Applications</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mat.typical_applications.map((app, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMaterial(mat)}
                className="mt-4 w-full py-2 bg-[#FFF8E7] hover:bg-[#FFC107]/20 border border-[#FFC107] text-[#245B35] font-bold text-xs rounded-xl transition-colors"
              >
                View Full Material Datasheet
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Material Detail Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedMaterial(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-xl text-[#245B35]">{selectedMaterial.name}</h3>
            <p className="text-xs text-[#7CB342] font-bold">{selectedMaterial.category}</p>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl">
              <p><span className="font-bold text-slate-700">Moisture Barrier:</span> {selectedMaterial.moisture_barrier}</p>
              <p><span className="font-bold text-slate-700">Oxygen Barrier:</span> {selectedMaterial.oxygen_barrier}</p>
              <p><span className="font-bold text-slate-700">CO2 Permeability:</span> {selectedMaterial.co2_permeability}</p>
              <p><span className="font-bold text-slate-700">WVTR Range:</span> {selectedMaterial.wvtr_range}</p>
              <p><span className="font-bold text-slate-700">OTR Range:</span> {selectedMaterial.otr_range}</p>
              <p><span className="font-bold text-slate-700">Sealability:</span> {selectedMaterial.sealability}</p>
              <p><span className="font-bold text-slate-700">Mechanical Strength:</span> {selectedMaterial.mechanical_strength}</p>
              <p><span className="font-bold text-slate-700">Temperature Compatibility:</span> {selectedMaterial.temp_compatibility}</p>
              <p><span className="font-bold text-slate-700">Recyclability:</span> {selectedMaterial.recyclability}</p>
              <p><span className="font-bold text-slate-700">Biodegradability:</span> {selectedMaterial.biodegradability}</p>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <p className="font-bold text-emerald-700">Key Advantages:</p>
                <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                  {selectedMaterial.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-bold text-amber-700">Limitations:</p>
                <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                  {selectedMaterial.limitations.map((lim, i) => <li key={i}>{lim}</li>)}
                </ul>
              </div>
            </div>

            <button onClick={() => setSelectedMaterial(null)} className="w-full py-2.5 bg-[#4CAF50] text-white font-extrabold text-xs rounded-xl shadow-md">
              Close Datasheet
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
