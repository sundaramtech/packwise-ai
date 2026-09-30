import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, HelpCircle, Layers, Thermometer, Truck, Target, Loader2 } from 'lucide-react';
import { RecommendationResult } from '../types';
import { analyzeFoodRequest, fetchCommodities } from '../services/api';

interface WizardProps {
  onComplete: (result: RecommendationResult) => void;
  onCancel: () => void;
}

export const RecommendationWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Form State
  const [commodityName, setCommodityName] = useState('Potato Chips');
  const [category, setCategory] = useState('Snacks');
  const [processingState, setProcessingState] = useState('Processed');
  const [desiredShelfLife, setDesiredShelfLife] = useState(180);
  const [quantity, setQuantity] = useState(500);

  const [moistureContent, setMoistureContent] = useState(2.0);
  const [oilFatContent, setOilFatContent] = useState(35.0);
  const [phLevel, setPhLevel] = useState(6.0);
  const [respirationRate, setRespirationRate] = useState('None');
  const [oxygenSensitivity, setOxygenSensitivity] = useState('High');
  const [lightSensitivity, setLightSensitivity] = useState('High');
  const [microbialSensitivity, setMicrobialSensitivity] = useState('Low');
  const [textureSensitivity, setTextureSensitivity] = useState('High');

  const [storageType, setStorageType] = useState('Ambient');
  const [storageTemp, setStorageTemp] = useState(25);
  const [relativeHumidity, setRelativeHumidity] = useState(50);
  const [storageDuration, setStorageDuration] = useState(180);
  const [lightExposure, setLightExposure] = useState('Direct Light');

  const [transportType, setTransportType] = useState('Road');
  const [transportDuration, setTransportDuration] = useState(48);
  const [tempVariation, setTempVariation] = useState('Moderate');
  const [handlingConditions, setHandlingConditions] = useState('Standard');

  const [priorities, setPriorities] = useState<string[]>(['Maximum Shelf Life', 'Low Cost', 'Sustainability']);

  const loadingMessages = [
    "Analyzing food properties & moisture sensitivity...",
    "Evaluating metabolic respiration rate & MAP suitability...",
    "Determining WVTR and OTR barrier specifications...",
    "Matching multi-layer film structures & polymers...",
    "Analyzing recyclability & sustainability trade-offs...",
    "Generating transparent compatibility score breakdown..."
  ];

  const presetCommodities = [
    { name: 'Potato Chips', cat: 'Snacks', state: 'Processed', m: 2.0, f: 35.0, ph: 6.0, resp: 'None', o2: 'High', light: 'High', shelf: 180 },
    { name: 'Tomato', cat: 'Vegetables', state: 'Fresh', m: 94.5, f: 0.2, ph: 4.3, resp: 'High', o2: 'Medium', light: 'Medium', shelf: 21 },
    { name: 'Rice', cat: 'Grains', state: 'Fresh', m: 12.0, f: 0.6, ph: 6.5, resp: 'None', o2: 'Low', light: 'Low', shelf: 365 },
    { name: 'Fresh Milk', cat: 'Dairy', state: 'Processed', m: 87.5, f: 3.5, ph: 6.7, resp: 'None', o2: 'High', light: 'High', shelf: 10 }
  ];

  const handleSelectPreset = (p: typeof presetCommodities[0]) => {
    setCommodityName(p.name);
    setCategory(p.cat);
    setProcessingState(p.state);
    setMoistureContent(p.m);
    setOilFatContent(p.f);
    setPhLevel(p.ph);
    setRespirationRate(p.resp);
    setOxygenSensitivity(p.o2);
    setLightSensitivity(p.light);
    setDesiredShelfLife(p.shelf);
  };

  const togglePriority = (p: string) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter(item => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setCurrentStep(6);
    setLoadingMsgIdx(0);

    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 600);

    const reqPayload = {
      commodity_name: commodityName,
      category,
      processing_state: processingState,
      desired_shelf_life_days: desiredShelfLife,
      quantity_kg: quantity,
      moisture_content_pct: moistureContent,
      oil_fat_pct: oilFatContent,
      ph_level: phLevel,
      respiration_rate: respirationRate,
      oxygen_sensitivity: oxygenSensitivity,
      light_sensitivity: lightSensitivity,
      microbial_sensitivity: microbialSensitivity,
      texture_sensitivity: textureSensitivity,
      storage_type: storageType,
      storage_temp_c: storageTemp,
      relative_humidity_pct: relativeHumidity,
      storage_duration_days: storageDuration,
      light_exposure: lightExposure,
      transport_type: transportType,
      transport_duration_hours: transportDuration,
      expected_temp_variation: tempVariation,
      handling_conditions: handlingConditions,
      priorities
    };

    try {
      const result = await analyzeFoodRequest(reqPayload);
      setTimeout(() => {
        clearInterval(interval);
        setLoading(false);
        onComplete(result);
      }, 3600);
    } catch (e) {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#4CAF50]/20 overflow-hidden">
        
        {/* Wizard Header Bar */}
        <div className="bg-gradient-to-r from-[#245B35] to-[#4CAF50] p-6 text-white flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-[#FFC107] uppercase tracking-wider">Multi-Step Analysis</span>
            <h2 className="text-2xl font-extrabold mt-0.5">New Packaging Recommendation</h2>
          </div>
          <button onClick={onCancel} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-colors">
            Cancel
          </button>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="bg-[#FFF8E7] px-6 py-4 border-b border-amber-200/60">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Properties" },
              { num: 3, label: "Storage" },
              { num: 4, label: "Transport" },
              { num: 5, label: "Priorities" }
            ].map((st) => (
              <div key={st.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                  currentStep === st.num
                    ? 'bg-[#4CAF50] text-white ring-4 ring-[#4CAF50]/20'
                    : currentStep > st.num
                    ? 'bg-[#245B35] text-white'
                    : 'bg-white text-slate-400 border border-slate-300'
                }`}>
                  {currentStep > st.num ? <CheckCircle2 className="w-5 h-5" /> : st.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${currentStep === st.num ? 'text-[#245B35]' : 'text-slate-400'}`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body Container */}
        <div className="p-8">
          
          {/* STEP 1: FOOD DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-[#245B35]">Step 1: Food Commodity Details</h3>
                <p className="text-xs text-slate-500 mt-1">Select a pre-configured scenario or enter custom commodity specifications.</p>
              </div>

              {/* Presets Quick Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Preset Commodity Scenarios</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {presetCommodities.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        commodityName === p.name ? 'border-[#4CAF50] bg-emerald-50 text-[#245B35] ring-2 ring-[#4CAF50]/30' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-extrabold text-sm">{p.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.cat} • {p.shelf} Days</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Commodity Name</label>
                  <input
                    type="text"
                    value={commodityName}
                    onChange={(e) => setCommodityName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Food Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    {["Snacks", "Vegetables", "Fruits", "Grains", "Dairy", "Bakery", "Meat", "Seafood", "Frozen Foods", "Ready-to-Eat Foods"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Processing State</label>
                  <select
                    value={processingState}
                    onChange={(e) => setProcessingState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    {["Fresh", "Processed", "Dried", "Frozen", "Cooked", "Ready-to-Eat"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desired Shelf Life (Days)</label>
                  <input
                    type="number"
                    value={desiredShelfLife}
                    onChange={(e) => setDesiredShelfLife(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FOOD PROPERTIES */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-[#245B35]">Step 2: Biophysical Food Properties</h3>
                <p className="text-xs text-slate-500 mt-1">Configure moisture, fat content, metabolic respiration, and environmental sensitivity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Moisture Content (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={moistureContent}
                    onChange={(e) => setMoistureContent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Oil / Fat Content (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={oilFatContent}
                    onChange={(e) => setOilFatContent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={phLevel}
                    onChange={(e) => setPhLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    Respiration Rate
                    <span className="text-[10px] text-[#7CB342] font-semibold">Critical for produce</span>
                  </label>
                  <select
                    value={respirationRate}
                    onChange={(e) => setRespirationRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="None">None (Processed / Dry / Meat)</option>
                    <option value="Low">Low (Potato / Apple)</option>
                    <option value="Medium">Medium (Pear / Citrus)</option>
                    <option value="High">High (Tomato / Banana / Mango)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Oxygen Sensitivity</label>
                  <select
                    value={oxygenSensitivity}
                    onChange={(e) => setOxygenSensitivity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (High OTR barrier needed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Light Sensitivity</label>
                  <select
                    value={lightSensitivity}
                    onChange={(e) => setLightSensitivity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Low">Low (Transparent film ok)</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Needs opaque / metallized barrier)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texture Sensitivity</label>
                  <select
                    value={textureSensitivity}
                    onChange={(e) => setTextureSensitivity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Needs high puncture protection)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STORAGE CONDITIONS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-[#245B35]">Step 3: Environmental Storage Conditions</h3>
                <p className="text-xs text-slate-500 mt-1">Specify ambient, chilled, or sub-zero temperature and relative humidity targets.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Storage Type</label>
                  <select
                    value={storageType}
                    onChange={(e) => {
                      setStorageType(e.target.value);
                      if (e.target.value === 'Chilled') setStorageTemp(4);
                      else if (e.target.value === 'Frozen') setStorageTemp(-18);
                      else setStorageTemp(25);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Ambient">Ambient Room Temperature</option>
                    <option value="Chilled">Chilled Cold Chain (0°C - 8°C)</option>
                    <option value="Frozen">Deep Frozen Sub-zero (-18°C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Storage Temperature (°C)</label>
                  <input
                    type="number"
                    value={storageTemp}
                    onChange={(e) => setStorageTemp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relative Humidity (%)</label>
                  <input
                    type="number"
                    value={relativeHumidity}
                    onChange={(e) => setRelativeHumidity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Light Exposure</label>
                  <select
                    value={lightExposure}
                    onChange={(e) => setLightExposure(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Dark">Complete Dark Storage</option>
                    <option value="Indirect Light">Indirect Retail Lighting</option>
                    <option value="Direct Light">Direct Sunlight Exposure</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TRANSPORTATION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-[#245B35]">Step 4: Logistics & Transportation</h3>
                <p className="text-xs text-slate-500 mt-1">Configure transit mode, duration, and mechanical handling stress.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transportation Type</label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Road">Road Truck Transport</option>
                    <option value="Rail">Rail Cargo</option>
                    <option value="Refrigerated Transport">Refrigerated Reefer Truck</option>
                    <option value="Sea">Sea Freight Shipping Container</option>
                    <option value="Air">Air Express Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transit Duration (Hours)</label>
                  <input
                    type="number"
                    value={transportDuration}
                    onChange={(e) => setTransportDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Temp Variation</label>
                  <select
                    value={tempVariation}
                    onChange={(e) => setTempVariation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Minimal">Minimal (Controlled Cold Chain)</option>
                    <option value="Moderate">Moderate Fluctuation</option>
                    <option value="High">High Thermal Spikes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Handling Conditions</label>
                  <select
                    value={handlingConditions}
                    onChange={(e) => setHandlingConditions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                  >
                    <option value="Standard">Standard Palletized</option>
                    <option value="Rough">Rough Loose Stacking</option>
                    <option value="Sensitive">Fragile Cushion Required</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PACKAGING PRIORITIES */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-[#245B35]">Step 5: Packaging Priorities & Weighting</h3>
                <p className="text-xs text-slate-500 mt-1">Select priorities to influence compatibility scoring weights.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Maximum Shelf Life",
                  "Low Cost",
                  "Sustainability",
                  "Recyclability",
                  "Maximum Protection",
                  "Lightweight Packaging",
                  "Export Compatibility"
                ].map((p) => {
                  const isSel = priorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePriority(p)}
                      className={`p-4 rounded-2xl border text-left text-xs font-extrabold flex items-center justify-between transition-all ${
                        isSel
                          ? 'border-[#4CAF50] bg-emerald-50 text-[#245B35] shadow-sm ring-2 ring-[#4CAF50]/30'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{p}</span>
                      {isSel && <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: DYNAMIC ANALYSIS LOADING EXPERIENCE */}
          {currentStep === 6 && (
            <div className="py-12 text-center space-y-6 animate-fade-in">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#FFC107] border-t-[#4CAF50] animate-spin"></div>
                <Sparkles className="w-8 h-8 text-[#4CAF50] absolute" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-[#245B35]">Analyzing Commodity & Packaging Requirements</h3>
                <p className="text-sm font-semibold text-[#FF9800] animate-pulse">
                  {loadingMessages[loadingMsgIdx]}
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#4CAF50] to-[#FF9800] h-full transition-all duration-500"
                  style={{ width: `${((loadingMsgIdx + 1) / loadingMessages.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Wizard Controls Footer */}
          {currentStep < 6 && (
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF9800] to-[#4CAF50] hover:opacity-95 text-white font-extrabold text-sm shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Analyze & Generate Recommendation
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
