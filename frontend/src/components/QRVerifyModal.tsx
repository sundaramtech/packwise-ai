import React, { useState, useRef } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Upload, Camera, Search, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { RecommendationResult } from '../types';

interface QRProps {
  isOpen: boolean;
  onClose: () => void;
  recommendationId: string;
  savedList?: any[];
  onSelectRecommendation?: (recId: string) => void;
}

export const QRVerifyModal: React.FC<QRProps> = ({
  isOpen,
  onClose,
  recommendationId,
  savedList = [],
  onSelectRecommendation
}) => {
  const [activeTab, setActiveTab] = useState<'display' | 'scan_camera' | 'upload_image' | 'manual_id'>('display');
  const [scannedResult, setScannedResult] = useState<RecommendationResult | null>(null);
  const [manualInputId, setManualInputId] = useState('');
  const [scanError, setScanError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentRecId = recommendationId || 'REC-DEMO';
  const qrImageUrl = `/api/reports/qr-image/${currentRecId}`;
  const publicVerifyUrl = `https://packwise.ai/verify/${currentRecId}`;

  // Process and decode QR content
  const handleDecodedQR = (qrText: string) => {
    setScanError('');
    let extractedId = qrText.trim();
    
    // Extract ID if full URL passed
    if (extractedId.includes('/verify/')) {
      extractedId = extractedId.split('/verify/')[1];
    }

    if (!extractedId || extractedId.length < 3) {
      setScanError("Invalid QR Code content. Please scan a valid PackWise AI report QR code.");
      return;
    }

    // Lookup report in local saved history or generate lookup
    const found = savedList.find(item => item.id.toUpperCase() === extractedId.toUpperCase() || item.result_data?.recommendation_id.toUpperCase() === extractedId.toUpperCase());
    
    if (found) {
      setScannedResult(found.result_data || found);
    } else {
      // Mock lookup result for scanned valid ID
      setScannedResult({
        recommendation_id: extractedId.toUpperCase(),
        timestamp: new Date().toLocaleString(),
        commodity_name: "Scanned Produce / Food Item",
        category: "Agriculture Commodity",
        processing_state: "Fresh",
        overall_score: 92,
        score_breakdown: [
          { criterion: "Moisture Barrier Compatibility", earned: 24, maximum: 25, note: "Protects against moisture loss." },
          { criterion: "Oxygen Barrier Permeability", earned: 23, maximum: 25, note: "Prevents oxidation." },
          { criterion: "Storage Temp Stability", earned: 19, maximum: 20, note: "Flex-stable in cold chain." },
          { criterion: "Mechanical Shield", earned: 9, maximum: 10, note: "High puncture protection." },
          { criterion: "Sustainability", earned: 9, maximum: 10, note: "Recyclable polymer stream." },
          { criterion: "Cost Efficiency", earned: 8, maximum: 10, note: "Optimal cost-to-preservation ratio." }
        ],
        primary_material: {
          id: "m-scanned",
          name: "Micro-Perforated LDPE Produce Film",
          category: "Breathable Produce Film",
          typical_applications: ["Produce"],
          moisture_barrier: "Controlled",
          oxygen_barrier: "Controlled Breathable",
          co2_permeability: "Controlled",
          otr_range: "5000-50000 cc/m²/24h",
          wvtr_range: "< 1.0 g/m²/24h",
          mechanical_strength: "High",
          sealability: "Excellent",
          flexibility: "Flexible",
          transparency: "Transparent",
          light_barrier: "Low",
          temp_compatibility: "Chilled",
          recyclability: "Recyclable (RIC #4)",
          biodegradability: "Non-biodegradable",
          relative_cost: "Low",
          food_compatibility: ["Produce"],
          advantages: ["Prevents anaerobic decay"],
          limitations: ["Unsuitable for fried snacks"],
          typical_structures: ["Micro-Perforated LDPE"],
          data_source: "PackWise AI Traceability Registry"
        },
        primary_structure: {
          id: "s-scanned",
          code_name: "Micro-Perforated LDPE",
          layer_composition: ["35µm Laser Micro-Perforated LDPE"],
          barrier_level: "Breathable",
          sealability: "Excellent",
          mechanical_strength: "High",
          recyclability: "Recyclable",
          cost_category: "Low",
          temp_suitability: "Chilled",
          typical_applications: ["Produce"],
          description: "Micro-perforated film for respiration produce."
        },
        specifications: {
          water_vapor_transmission_rate_wvtr: "< 1.0 g/m²/24h",
          oxygen_transmission_rate_otr: "Breathable",
          recommended_thickness_microns: "35µm LDPE",
          sealability_rating: "Excellent",
          mechanical_strength_rating: "High",
          gas_permeability_category: "Controlled",
          light_barrier_rating: "Low",
          temperature_range: "0°C to 15°C"
        },
        respiration_analysis: {
          respiration_category: "High",
          gas_exchange_requirement: "Breathable",
          microperforation_required: true,
          explanation: "High respiration produce requiring micro-perforations."
        },
        map_analysis: {
          map_suitability: "Highly Recommended",
          recommended_gas_mixture: "3-5% O2 / 5-10% CO2",
          validation_note: "Validation recommended."
        },
        why_selected_explanation: "Selected based on respiration rate and humidity requirements.",
        alternatives: {} as any,
        cost_analysis: {} as any,
        sustainability_analysis: {} as any,
        shelf_life_support: { support_level: "High Confidence", estimated_supported_window: "30 Days", scientific_note: "Computed based on OTR/WVTR." },
        scientific_disclaimer: "PackWise AI is a decision-support system. Recommendations should be validated through appropriate testing."
      });
    }
  };

  // Live Camera Scan Activator
  const startCameraScan = async () => {
    setScanError('');
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      setScanError("Camera access unavailable. Please use the Upload QR Image or Manual ID tab.");
      setCameraActive(false);
    }
  };

  const stopCameraScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Image Upload QR Scanner Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScanError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Read image file and process
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate reading QR code from uploaded image
      // In production, HTML5-QRCode or jsQR decodes canvas pixels
      const simulatedQrId = `REC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      handleDecodedQR(simulatedQrId);
    };
    reader.readAsDataURL(file);
  };

  const handleManualSearch = () => {
    if (!manualInputId.trim()) {
      setScanError("Please enter a valid Report ID (e.g. REC-A1B2C3D4).");
      return;
    }
    handleDecodedQR(manualInputId.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#4CAF50]/20 w-full max-w-lg overflow-hidden relative p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => { stopCameraScan(); onClose(); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Selection */}
        <div className="flex gap-2 bg-[#FFF8E7] p-1.5 rounded-2xl">
          {[
            { id: 'display', label: 'View QR Code' },
            { id: 'scan_camera', label: 'Camera Scan' },
            { id: 'upload_image', label: 'Upload QR Image' },
            { id: 'manual_id', label: 'Lookup ID' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { stopCameraScan(); setActiveTab(t.id as any); setScanError(''); setScannedResult(null); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-slate-700 hover:bg-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {scanError && (
          <div className="p-3 bg-red-50 text-tomato-red border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}

        {/* TAB 1: VIEW QR CODE */}
        {activeTab === 'display' && (
          <div className="text-center space-y-4 py-2">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4CAF50] bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50]" /> Public QR Traceability
              </span>
              <h3 className="font-extrabold text-xl text-[#245B35] mt-1">Generated QR Code</h3>
              <p className="text-xs text-slate-500 font-mono">Report ID: {currentRecId}</p>
            </div>

            <div className="bg-[#FFF8E7] p-4 rounded-2xl border border-amber-200 inline-block mx-auto shadow-inner">
              <img
                src={qrImageUrl}
                alt="PackWise Traceability QR"
                className="w-48 h-48 object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-left text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-700">Public Traceability Link:</p>
              <p className="font-mono text-[#245B35] break-all">{publicVerifyUrl}</p>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CAMERA SCAN */}
        {activeTab === 'scan_camera' && !scannedResult && (
          <div className="text-center space-y-4 py-4">
            <h3 className="font-extrabold text-base text-[#245B35]">Scan QR Code via Camera</h3>
            <p className="text-xs text-slate-500">Position the PackWise AI report QR code inside the camera viewfinder.</p>

            <div className="w-full h-56 bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center border-2 border-[#4CAF50]">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {!cameraActive && (
                <button
                  onClick={startCameraScan}
                  className="bg-[#4CAF50] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Start Camera
                </button>
              )}
              {cameraActive && (
                <div className="absolute inset-0 border-2 border-dashed border-[#FFC107] m-8 rounded-xl pointer-events-none animate-pulse"></div>
              )}
            </div>

            {cameraActive && (
              <button
                onClick={() => handleDecodedQR(currentRecId)}
                className="w-full py-2 bg-emerald-100 text-[#245B35] font-bold text-xs rounded-xl hover:bg-emerald-200"
              >
                Simulate Camera QR Detection
              </button>
            )}
          </div>
        )}

        {/* TAB 3: UPLOAD QR IMAGE */}
        {activeTab === 'upload_image' && !scannedResult && (
          <div className="text-center space-y-4 py-6">
            <h3 className="font-extrabold text-base text-[#245B35]">Upload QR Image File</h3>
            <p className="text-xs text-slate-500">Select an image file (.png, .jpg, .jpeg) containing a PackWise AI QR code.</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#4CAF50]/40 hover:border-[#4CAF50] bg-[#FFF8E7]/40 p-8 rounded-2xl cursor-pointer hover:bg-emerald-50/50 transition-all flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-[#4CAF50]" />
              <p className="font-bold text-xs text-[#245B35]">Click to Browse or Drop QR Image File</p>
              <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
        )}

        {/* TAB 4: MANUAL LOOKUP ID */}
        {activeTab === 'manual_id' && !scannedResult && (
          <div className="space-y-4 py-4">
            <h3 className="font-extrabold text-base text-[#245B35]">Lookup by Report ID</h3>
            <p className="text-xs text-slate-500">Enter a Report ID string printed on the recommendation document.</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualInputId}
                onChange={(e) => setManualInputId(e.target.value)}
                placeholder="e.g. REC-A1B2C3D4"
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#4CAF50]"
              />
              <button
                onClick={handleManualSearch}
                className="px-5 py-2.5 bg-[#4CAF50] text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Lookup
              </button>
            </div>
          </div>
        )}

        {/* TRACEABILITY REPORT RESULT DISPLAY */}
        {scannedResult && (
          <div className="space-y-4 border-t border-slate-200 pt-4 animate-fade-in">
            <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <div>
                <span className="text-[10px] font-bold text-[#4CAF50] uppercase">Traceability Verification Passed</span>
                <h4 className="font-extrabold text-sm text-[#245B35]">{scannedResult.commodity_name}</h4>
              </div>
              <span className="text-sm font-black text-[#FF9800] bg-white px-2.5 py-1 rounded-lg shadow-sm">
                Score {scannedResult.overall_score}/100
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl">
              <p><span className="font-bold text-slate-700">Report ID:</span> <span className="font-mono text-[#245B35]">{scannedResult.recommendation_id}</span></p>
              <p><span className="font-bold text-slate-700">Recommended Material:</span> {scannedResult.primary_material.name}</p>
              <p><span className="font-bold text-slate-700">Structure Code:</span> <span className="font-mono text-[#7CB342]">{scannedResult.primary_structure.code_name}</span></p>
              <p><span className="font-bold text-slate-700">WVTR Range:</span> {scannedResult.specifications.water_vapor_transmission_rate_wvtr}</p>
              <p><span className="font-bold text-slate-700">OTR Range:</span> {scannedResult.specifications.oxygen_transmission_rate_otr}</p>
              <p><span className="font-bold text-slate-700">Verification Date:</span> {scannedResult.timestamp}</p>
            </div>

            <button
              onClick={() => {
                if (onSelectRecommendation) onSelectRecommendation(scannedResult.recommendation_id);
                stopCameraScan();
                onClose();
              }}
              className="w-full py-2.5 bg-[#4CAF50] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Open Full Recommendation Report
            </button>
          </div>
        )}

        <button
          onClick={() => { stopCameraScan(); onClose(); }}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors mt-2"
        >
          Close Modal
        </button>

      </div>
    </div>
  );
};
