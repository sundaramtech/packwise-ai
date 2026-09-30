import React, { useState } from 'react';
import { RecommendationResult, SavedRecommendation } from '../types';
import { Download, QrCode, Bookmark, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Layers, Leaf, DollarSign, HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

interface ResultProps {
  result: RecommendationResult;
  onBack: () => void;
  onSave: (notes?: string) => void;
  onOpenQR: (recId: string) => void;
  onOpenAskPackWise: () => void;
}

export const RecommendationResultView: React.FC<ResultProps> = ({
  result,
  onBack,
  onSave,
  onOpenQR,
  onOpenAskPackWise
}) => {
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const mat = result.primary_material;
  const struct = result.primary_structure;

  const handleDownloadPDF = async () => {
    setPdfGenerating(true);
    setPdfError('');

    try {
      // 1. Try Backend PDF Endpoint
      const backendUrl = `/api/reports/pdf/${result.recommendation_id}`;
      const response = await fetch(backendUrl);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `PackWise_AI_Report_${result.recommendation_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setPdfGenerating(false);
        return;
      }
    } catch (err) {
      console.warn("Backend PDF endpoint unreachable, generating client-side PDF...", err);
    }

    // 2. Client-Side jsPDF Generator (Guaranteed reliable fallback)
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const margin = 40;
      let y = 40;

      // Header
      doc.setFillColor(36, 91, 53); // #245B35
      doc.rect(0, 0, 612, 60, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("PackWise AI — Packaging Recommendation Report", margin, 36);

      y = 85;
      doc.setTextColor(36, 91, 53);
      doc.setFontSize(10);
      doc.text("Smarter Packaging. Better Food Protection. | SIH Problem Statement 26236", margin, y);
      
      y += 15;
      doc.setDrawColor(76, 175, 80);
      doc.setLineWidth(1.5);
      doc.line(margin, y, 612 - margin, y);

      // Meta Table
      y += 20;
      doc.setFillColor(255, 248, 231);
      doc.rect(margin, y, 612 - margin * 2, 45, 'F');
      doc.setDrawColor(255, 193, 7);
      doc.rect(margin, y, 612 - margin * 2, 45, 'S');

      doc.setTextColor(38, 50, 56);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Report ID: ${result.recommendation_id}`, margin + 10, y + 18);
      doc.text(`Date: ${result.timestamp}`, margin + 300, y + 18);
      doc.text(`Commodity: ${result.commodity_name}`, margin + 10, y + 34);
      doc.text(`Overall Score: ${result.overall_score}/100`, margin + 300, y + 34);

      // Primary Spec
      y += 65;
      doc.setFontSize(12);
      doc.setTextColor(36, 91, 53);
      doc.text("Primary Recommended Packaging Specification", margin, y);

      y += 15;
      doc.setFontSize(9);
      doc.setTextColor(38, 50, 56);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Recommended Material: `, margin, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(mat.name, margin + 130, y);

      y += 14;
      doc.setFont('Helvetica', 'bold');
      doc.text(`Film Structure Code: `, margin, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(struct.code_name, margin + 130, y);

      y += 14;
      doc.setFont('Helvetica', 'bold');
      doc.text(`Layer Composition: `, margin, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(struct.layer_composition.join(" / "), margin + 130, y);

      y += 14;
      doc.setFont('Helvetica', 'bold');
      doc.text(`WVTR Barrier: `, margin, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(result.specifications.water_vapor_transmission_rate_wvtr, margin + 130, y);

      y += 14;
      doc.setFont('Helvetica', 'bold');
      doc.text(`OTR Barrier: `, margin, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(result.specifications.oxygen_transmission_rate_otr, margin + 130, y);

      // Technical Justification
      y += 25;
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(36, 91, 53);
      doc.text("Technical Recommendation Justification", margin, y);

      y += 15;
      doc.setFontSize(8.5);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(38, 50, 56);
      const splitJustification = doc.splitTextToSize(result.why_selected_explanation, 612 - margin * 2);
      doc.text(splitJustification, margin, y);
      y += (splitJustification.length * 11) + 10;

      // Score Breakdown
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(36, 91, 53);
      doc.text("Compatibility Criteria Breakdown", margin, y);

      y += 12;
      result.score_breakdown.forEach((item) => {
        y += 14;
        doc.setFontSize(8.5);
        doc.setFont('Helvetica', 'bold');
        doc.text(`${item.criterion}: ${item.earned}/${item.maximum} pts`, margin, y);
        doc.setFont('Helvetica', 'normal');
        doc.text(`- ${item.note}`, margin + 220, y);
      });

      // Disclaimer
      y += 30;
      doc.setDrawColor(229, 57, 53);
      doc.setLineWidth(1);
      doc.line(margin, y, 612 - margin, y);

      y += 15;
      doc.setFontSize(7.5);
      doc.setFont('Helvetica', 'italic');
      doc.setTextColor(229, 57, 53);
      const splitDisclaimer = doc.splitTextToSize(`Scientific Safety Note: ${result.scientific_disclaimer}`, 612 - margin * 2);
      doc.text(splitDisclaimer, margin, y);

      // Save PDF
      doc.save(`PackWise_AI_Report_${result.recommendation_id}.pdf`);
      setPdfGenerating(false);
    } catch (e: any) {
      console.error("PDF generation failed:", e);
      setPdfError("Unable to generate PDF report. Please try again.");
      setPdfGenerating(false);
    }
  };

  const handleSaveClick = () => {
    onSave(notes);
    setSaved(true);
    setShowNotesModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* PDF Error Notification */}
      {pdfError && (
        <div className="p-4 bg-red-50 text-tomato-red border border-red-200 rounded-2xl text-xs font-bold flex justify-between items-center">
          <span>{pdfError}</span>
          <button onClick={() => setPdfError('')} className="text-red-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-bold text-xs text-slate-600 hover:text-[#245B35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analysis
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowNotesModal(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              saved ? 'bg-emerald-100 text-[#245B35] border border-[#4CAF50]' : 'bg-[#FFF8E7] hover:bg-[#FFC107]/20 border border-[#FFC107] text-[#245B35]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#FF9800]" />
            {saved ? 'Saved to History' : 'Save Recommendation'}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
            className="flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            {pdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {pdfGenerating ? 'Generating PDF...' : 'Download PDF Report'}
          </button>

          <button
            onClick={() => onOpenQR(result.recommendation_id)}
            className="flex items-center gap-1.5 bg-[#245B35] hover:bg-[#245B35]/90 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
          >
            <QrCode className="w-4 h-4 text-[#FFC107]" />
            Scan / Show QR Code
          </button>

          <button
            onClick={onOpenAskPackWise}
            className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Ask PackWise
          </button>
        </div>
      </div>

      {/* Main Recommended Hero Card */}
      <div className="bg-gradient-to-r from-[#245B35] via-[#2d6f42] to-[#4CAF50] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFC107] text-slate-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                RECOMMENDED PACKAGING
              </span>
              <span className="text-xs text-slate-200 font-mono">ID: {result.recommendation_id}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black">
              {mat.name}
            </h1>
            <p className="text-base text-slate-100 font-bold">
              Film Structure: <span className="text-[#FFC107] font-mono">{struct.code_name}</span> ({struct.layer_composition.join(" / ")})
            </p>
            <p className="text-xs text-slate-200">
              Analyzed for <span className="font-extrabold text-white">{result.commodity_name}</span> | Generated: {result.timestamp}
            </p>
          </div>

          {/* Compatibility Score Circle */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex flex-col items-center justify-center shrink-0 min-w-[180px]">
            <span className="text-5xl font-black text-[#FFC107]">{result.overall_score}</span>
            <span className="text-xs font-extrabold uppercase text-slate-100 mt-1">/ 100 Score</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-semibold mt-2">
              Calculated Score
            </span>
          </div>
        </div>
      </div>

      {/* "Why This Packaging?" Technical Justification */}
      <div className="bg-white p-6 rounded-3xl shadow-food-card border-l-8 border-[#4CAF50] space-y-2">
        <h3 className="font-extrabold text-base text-[#245B35] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF9800]" /> Why Was This Packaging Material Selected?
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {result.why_selected_explanation}
        </p>
      </div>

      {/* Two Column Layout: Specifications & Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Packaging Technical Specifications Table */}
        <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-lg text-[#245B35] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4CAF50]" /> Technical Specifications
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-600">Water Vapor Transmission (WVTR)</td>
                  <td className="p-3 font-extrabold text-[#245B35]">{result.specifications.water_vapor_transmission_rate_wvtr}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-600">Oxygen Transmission Rate (OTR)</td>
                  <td className="p-3 font-extrabold text-[#245B35]">{result.specifications.oxygen_transmission_rate_otr}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-600">Recommended Structure Code</td>
                  <td className="p-3 font-extrabold text-slate-800">{struct.code_name}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-600">Heat Sealability Rating</td>
                  <td className="p-3 font-bold text-emerald-700">{result.specifications.sealability_rating}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-600">Light Barrier Protection</td>
                  <td className="p-3 font-bold text-amber-700">{result.specifications.light_barrier_rating}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-600">Temperature Suitability</td>
                  <td className="p-3 font-bold text-slate-700">{result.specifications.temperature_range}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transparent Compatibility Score Breakdown */}
        <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-lg text-[#245B35] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF9800]" /> Score Criteria Breakdown (100 pts)
          </h3>

          <div className="space-y-3">
            {result.score_breakdown.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#FFF8E7]/40 border border-amber-200/50 space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-[#245B35]">{item.criterion}</span>
                  <span className="text-[#4CAF50]">{item.earned} / {item.maximum}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#4CAF50] h-full rounded-full"
                    style={{ width: `${(item.earned / item.maximum) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Respiration & MAP Analysis Module */}
      <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-lg text-[#245B35] flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#7CB342]" /> Respiration & Modified Atmosphere Packaging (MAP) Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <p className="font-bold text-[#245B35]">Respiration Category</p>
            <p className="text-base font-black text-[#4CAF50] mt-1">{result.respiration_analysis.respiration_category}</p>
            <p className="text-[11px] text-slate-600 mt-2">{result.respiration_analysis.explanation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="font-bold text-[#245B35]">MAP Suitability</p>
            <p className="text-base font-black text-[#FF9800] mt-1">{result.map_analysis.map_suitability}</p>
            <p className="text-[11px] text-slate-600 mt-2">Gas Flush: {result.map_analysis.recommended_gas_mixture}</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
            <p className="font-bold text-[#245B35]">Micro-Perforation Requirement</p>
            <p className="text-base font-black text-sky-700 mt-1">
              {result.respiration_analysis.microperforation_required ? "Micro-Perforated Film Required" : "Standard Non-Perforated"}
            </p>
            <p className="text-[11px] text-slate-600 mt-2">{result.map_analysis.validation_note}</p>
          </div>
        </div>
      </div>

      {/* 4-Tier Alternatives Comparison Cards */}
      <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-lg text-[#245B35]">Alternative Packaging Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: "performance_focused", title: "Performance-Focused", badge: "Max Shelf Life", data: result.alternatives.performance_focused, color: "border-emerald-300 bg-emerald-50/40" },
            { key: "cost_focused", title: "Cost-Focused", badge: "Budget Option", data: result.alternatives.cost_focused, color: "border-amber-300 bg-amber-50/40" },
            { key: "sustainability_focused", title: "Sustainability-Focused", badge: "Eco Compostable", data: result.alternatives.sustainability_focused, color: "border-lime-300 bg-lime-50/40" }
          ].map((alt, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border ${alt.color} space-y-3`}>
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-[#245B35]">{alt.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border text-slate-700">{alt.badge}</span>
              </div>
              <div>
                <p className="font-extrabold text-sm text-slate-800">{alt.data.material_name}</p>
                <p className="text-xs font-mono text-[#7CB342] mt-0.5">{alt.data.structure_code}</p>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-emerald-700 font-bold">✓ {alt.data.advantages[0]}</p>
                <p className="text-slate-500">⚠ {alt.data.limitations[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualitative Shelf-Life Support Module */}
      <div className="bg-white p-6 rounded-3xl shadow-food-card border border-slate-200 space-y-2">
        <h3 className="font-extrabold text-base text-[#245B35]">Qualitative Shelf-Life Support Assessment</h3>
        <p className="text-sm font-bold text-[#4CAF50]">
          {result.shelf_life_support.support_level}: <span className="text-slate-800">{result.shelf_life_support.estimated_supported_window}</span>
        </p>
        <p className="text-xs text-slate-500">{result.shelf_life_support.scientific_note}</p>
      </div>

      {/* Mandatory Scientific Safety Disclaimer */}
      <div className="bg-red-50 p-5 rounded-3xl border border-red-200 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-tomato-red shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-extrabold text-tomato-red uppercase tracking-wider block mb-0.5">Scientific Safety Validation Note</span>
          {result.scientific_disclaimer}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-extrabold text-lg text-[#245B35]">Save Recommendation to History</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add optional notes (e.g., Supplier quote, trial batch observations)..."
              className="w-full p-3 border border-slate-300 rounded-xl text-sm h-28 focus:ring-2 focus:ring-[#4CAF50]"
            ></textarea>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNotesModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleSaveClick} className="px-5 py-2 bg-[#4CAF50] text-white rounded-xl text-xs font-extrabold shadow-md">Confirm Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
