import React, { useState } from 'react';
import { SavedRecommendation } from '../types';
import { Download, QrCode, Search, Trash2, ArrowLeft, Eye, AlertCircle } from 'lucide-react';

interface HistoryProps {
  onBack: () => void;
  savedList: SavedRecommendation[];
  onViewRecommendation: (recId: string) => void;
  onOpenQR: (recId: string) => void;
  onDeleteRecommendation?: (recId: string) => void;
}

export const HistoryView: React.FC<HistoryProps> = ({
  onBack,
  savedList,
  onViewRecommendation,
  onOpenQR,
  onDeleteRecommendation
}) => {
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = savedList.filter(item => 
    item.commodity_name.toLowerCase().includes(search.toLowerCase()) ||
    item.material_name.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (onDeleteRecommendation) {
      onDeleteRecommendation(id);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 font-bold text-xs text-slate-500 hover:text-[#245B35] mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-[#245B35]">User Recommendation History</h1>
          <p className="text-xs text-slate-500">Access saved packaging recommendations, PDF exports, and QR traceability codes.</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history by commodity, material, or Report ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#4CAF50]"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl shadow-food-card border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#245B35] text-white">
              <tr>
                <th className="p-4 font-bold">Report ID</th>
                <th className="p-4 font-bold">Commodity</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Recommended Packaging</th>
                <th className="p-4 font-bold">Film Structure</th>
                <th className="p-4 font-bold">Score</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-extrabold text-sm text-[#245B35]">No Recommendation History Found</p>
                    <p className="text-xs text-slate-400">Run a new packaging recommendation analysis to add records to history.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#245B35]">{item.id}</td>
                    <td className="p-4 font-extrabold text-slate-800">{item.commodity_name}</td>
                    <td className="p-4 text-slate-500">{item.date}</td>
                    <td className="p-4 font-bold text-slate-700">{item.material_name}</td>
                    <td className="p-4 font-mono text-[#7CB342] font-bold">{item.structure_code}</td>
                    <td className="p-4 font-black text-[#4CAF50]">{item.compatibility_score}/100</td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => onViewRecommendation(item.id)}
                        title="View Full Report"
                        className="p-1.5 bg-emerald-50 text-[#4CAF50] hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/api/reports/pdf/${item.id}`, '_blank')}
                        title="Download PDF"
                        className="p-1.5 bg-amber-50 text-[#FF9800] hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenQR(item.id)}
                        title="Show QR Code"
                        className="p-1.5 bg-sky-50 text-[#245B35] hover:bg-sky-100 rounded-lg transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Delete Entry"
                        className="p-1.5 bg-red-50 text-tomato-red hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-tomato-red mx-auto" />
            <h3 className="font-extrabold text-base text-[#245B35]">Delete Recommendation Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete report <span className="font-mono font-bold text-slate-800">{deleteConfirmId}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-tomato-red text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
