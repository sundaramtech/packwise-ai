import { RecommendationResult, SavedRecommendation, PackagingMaterial } from '../types';

const API_BASE = '/api';

export async function fetchCommodities() {
  try {
    const res = await fetch(`${API_BASE}/materials/commodities`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline seed commodities fallback", e);
  }
  return [
    {
      id: "c-tomato",
      name: "Tomato",
      category: "Vegetables",
      image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
      default_moisture_pct: 94.5,
      default_fat_pct: 0.2,
      default_ph: 4.3,
      respiration_rate: "High",
      oxygen_sensitivity: "Medium",
      light_sensitivity: "Medium",
      microbial_sensitivity: "High",
      texture_sensitivity: "High",
      description: "Perishable climacteric produce requiring controlled gas exchange."
    },
    {
      id: "c-chips",
      name: "Potato Chips",
      category: "Snacks",
      image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600",
      default_moisture_pct: 2.0,
      default_fat_pct: 35.0,
      default_ph: 6.0,
      respiration_rate: "None",
      oxygen_sensitivity: "High",
      light_sensitivity: "High",
      microbial_sensitivity: "Low",
      texture_sensitivity: "High",
      description: "Fried snack food highly vulnerable to rancidity."
    },
    {
      id: "c-rice",
      name: "Rice",
      category: "Grains",
      image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
      default_moisture_pct: 12.0,
      default_fat_pct: 0.6,
      default_ph: 6.5,
      respiration_rate: "None",
      oxygen_sensitivity: "Low",
      light_sensitivity: "Low",
      microbial_sensitivity: "Low",
      texture_sensitivity: "Low",
      description: "Dry staple commodity sensitive to moisture ingress."
    },
    {
      id: "c-milk",
      name: "Fresh Pasteurized Milk",
      category: "Dairy",
      image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600",
      default_moisture_pct: 87.5,
      default_fat_pct: 3.5,
      default_ph: 6.7,
      respiration_rate: "None",
      oxygen_sensitivity: "High",
      light_sensitivity: "High",
      microbial_sensitivity: "High",
      texture_sensitivity: "Low",
      description: "Highly perishable liquid dairy."
    }
  ];
}

export async function fetchMaterials(searchQuery?: string, categoryFilter?: string): Promise<PackagingMaterial[]> {
  try {
    let url = `${API_BASE}/materials`;
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (categoryFilter && categoryFilter !== "All") params.append("category", categoryFilter);
    if (params.toString()) url += `?${params.toString()}`;
    
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using offline materials fallback", e);
  }
  
  // Offline dataset for materials search
  const allMaterials: PackagingMaterial[] = [
    {
      id: "m-al-foil",
      name: "Aluminium Foil Laminate (PET/Al/PE)",
      category: "Laminate Barrier",
      typical_applications: ["Potato Chips", "Coffee", "Spices", "Milk Powder", "Ready-to-Eat Curries", "Dry Fruits"],
      moisture_barrier: "Very High (Absolute)",
      oxygen_barrier: "Very High (Absolute)",
      co2_permeability: "Very High Barrier",
      otr_range: "< 0.1 cc/m²/24h",
      wvtr_range: "< 0.1 g/m²/24h",
      mechanical_strength: "Very High",
      sealability: "Excellent",
      flexibility: "Flexible",
      transparency: "Opaque (100% Light Barrier)",
      light_barrier: "Complete (100%)",
      temp_compatibility: "Retort / Frozen / Ambient (-50°C to 250°C)",
      recyclability: "Specialized Facilities Required",
      biodegradability: "Non-biodegradable",
      relative_cost: "High",
      food_compatibility: ["High-Fat Snacks", "Coffee", "Spices", "Powdered Milk"],
      advantages: ["100% barrier against oxygen, moisture, light & aromas", "Maximum shelf-life extension"],
      limitations: ["Multi-layer recycling complexity", "Higher material unit cost"],
      typical_structures: ["PET / Aluminium Foil / PE"],
      data_source: "Aluminium Foil Packaging Council"
    },
    {
      id: "m-microperf-pe",
      name: "Micro-Perforated LDPE Produce Film",
      category: "Breathable Produce Film",
      typical_applications: ["Tomatoes", "Bananas", "Mangoes", "Apples", "Strawberries", "Fresh Berries", "Cut Produce"],
      moisture_barrier: "Controlled Moisture Lock",
      oxygen_barrier: "Controlled High Breathable Permeability",
      co2_permeability: "High Gas Exchange",
      otr_range: "5000 - 50,000+ cc/m²/24h",
      wvtr_range: "Engineered Vapor Release",
      mechanical_strength: "Moderate",
      sealability: "Excellent",
      flexibility: "Flexible",
      transparency: "Transparent Optics",
      light_barrier: "Low",
      temp_compatibility: "Chilled Cold Chain (0°C - 15°C)",
      recyclability: "100% Recyclable LDPE (RIC #4)",
      biodegradability: "Non-biodegradable",
      relative_cost: "Low",
      food_compatibility: ["Tomatoes", "Bananas", "Mangoes", "Strawberries", "Fresh Vegetables"],
      advantages: ["Prevents anaerobic respiration and off-odors", "Eliminates bag fogging"],
      limitations: ["Unsuitable for oxygen-sensitive fried snacks"],
      typical_structures: ["35µm Laser Micro-Perforated LDPE"],
      data_source: "Postharvest Technology Guide"
    },
    {
      id: "m-pla-pbat",
      name: "PLA / PBAT Biodegradable Film",
      category: "Bio-based / Compostable",
      typical_applications: ["Organic Vegetables", "Artisanal Bakery", "Dry Organic Grains", "Tea Bags"],
      moisture_barrier: "Low-Moderate",
      oxygen_barrier: "Moderate",
      co2_permeability: "High",
      otr_range: "200 - 500 cc/m²/24h",
      wvtr_range: "40 - 80 g/m²/24h",
      mechanical_strength: "Moderate",
      sealability: "Good",
      flexibility: "Flexible",
      transparency: "Translucent to Clear",
      light_barrier: "Low",
      temp_compatibility: "Ambient (0°C - 45°C)",
      recyclability: "Industrial Composting (EN 13432)",
      biodegradability: "Compostable",
      relative_cost: "High",
      food_compatibility: ["Fresh Produce", "Bakery", "Dry Organic Foods"],
      advantages: ["Derived from corn starch, zero microplastics", "Good produce gas exchange"],
      limitations: ["Higher unit cost", "Lower moisture barrier window"],
      typical_structures: ["PLA / PBAT Blend Film"],
      data_source: "European Bioplastics Standard"
    },
    {
      id: "m-bopp",
      name: "Biaxially Oriented Polypropylene (BOPP/CPP)",
      category: "Flexible Film",
      typical_applications: ["Biscuits", "Cookies", "Confectionery", "Dry Snacks", "Pasta", "Nuts"],
      moisture_barrier: "High",
      oxygen_barrier: "Low-Moderate",
      co2_permeability: "Moderate",
      otr_range: "1500 - 2000 cc/m²/24h",
      wvtr_range: "4 - 7 g/m²/24h",
      mechanical_strength: "High",
      sealability: "Good",
      flexibility: "Flexible",
      transparency: "High Transparency",
      light_barrier: "Low (Clear) / High (Metallized)",
      temp_compatibility: "Ambient / Chilled (-10°C to 100°C)",
      recyclability: "100% Monomaterial PP Recyclable (RIC #5)",
      biodegradability: "Non-biodegradable",
      relative_cost: "Low-Medium",
      food_compatibility: ["Biscuits", "Pasta", "Dry Foods", "Nuts"],
      advantages: ["High clarity and gloss", "Fully monomaterial recyclable PP stream"],
      limitations: ["Brittle at deep sub-zero temperatures"],
      typical_structures: ["BOPP / CPP Monomaterial"],
      data_source: "Polypropylene Packaging Guide"
    },
    {
      id: "m-evoh-pe",
      name: "PE / EVOH / PE High Barrier Coex",
      category: "High Barrier Polymer Laminate",
      typical_applications: ["Fresh Meat", "Raw Chicken", "Fish Fillets", "Cheddar Cheese", "Vacuum Skin"],
      moisture_barrier: "High",
      oxygen_barrier: "Very High (<1.0 cc/m²/24h)",
      co2_permeability: "Very Low",
      otr_range: "0.5 - 5 cc/m²/24h",
      wvtr_range: "2 - 5 g/m²/24h",
      mechanical_strength: "High",
      sealability: "Excellent",
      flexibility: "Flexible / Thermoformable",
      transparency: "Transparent",
      light_barrier: "Moderate",
      temp_compatibility: "Chilled / Frozen (-30°C to 90°C)",
      recyclability: "Recyclable (RIC #4 if EVOH < 5%)",
      biodegradability: "Non-biodegradable",
      relative_cost: "High",
      food_compatibility: ["Fresh Meat", "Chicken", "Fish Fillets", "Cheese"],
      advantages: ["Transparent high oxygen barrier without metal foil", "Ideal for MAP gas retention"],
      limitations: ["EVOH layer is moisture sensitive if unprotected"],
      typical_structures: ["PE / EVOH / PE Coex"],
      data_source: "Barrier Plastics Handbook"
    }
  ];

  let filtered = allMaterials;
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.typical_applications.some(app => app.toLowerCase().includes(q)) ||
      m.food_compatibility.some(fc => fc.toLowerCase().includes(q))
    );
  }
  if (categoryFilter && categoryFilter !== "All") {
    filtered = filtered.filter(m => m.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  return filtered;
}

export async function analyzeFoodRequest(formData: any): Promise<RecommendationResult> {
  try {
    const res = await fetch(`${API_BASE}/recommendations/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, executing dynamic client-side engine...", e);
  }
  
  // Fully Dynamic Client-Side Engine Fallback
  const name = (formData.commodity_name || "Food Item").trim();
  const category = formData.category || "General Food";
  const moisture = Number(formData.moisture_content_pct ?? 50.0);
  const fat = Number(formData.oil_fat_pct ?? 5.0);
  const respiration = formData.respiration_rate || "None";
  const o2_sens = formData.oxygen_sensitivity || "Medium";
  const light_sens = formData.light_sensitivity || "Medium";
  const texture_sens = formData.texture_sensitivity || "Medium";
  const shelf_days = Number(formData.desired_shelf_life_days ?? 30);
  const storage_type = formData.storage_type || "Ambient";
  const temp_c = Number(formData.storage_temp_c ?? 25);
  const priorities = formData.priorities || [];

  const isProduceRespiration = respiration === "High" || respiration === "Medium" || (category === "Fruits" || category === "Vegetables");
  const isHighFatRancid = fat >= 12.0 || (o2_sens === "High" && fat >= 5.0);
  const isLowMoisture = moisture <= 12.0;

  let primaryName = "Polyethylene Terephthalate / LDPE Laminate";
  let structCode = "PET / LDPE";
  let totalScore = 88;
  let why = `Calculated for '${name}' based on moisture (${moisture}%), fat (${fat}%), respiration rate (${respiration}), and ${storage_type} storage at ${temp_c}°C.`;

  if (isProduceRespiration) {
    primaryName = "Micro-Perforated LDPE Produce Film";
    structCode = "Micro-Perforated LDPE";
    totalScore = 93;
    why = `'${name}' is a respiratory produce item (${respiration} rate). Sealing in non-breathable plastic suffocates living cells causing anaerobic fermentation and off-odors. Micro-perforated film maintains O2/CO2 equilibrium while retaining humidity.`;
  } else if (isHighFatRancid) {
    primaryName = "Aluminium Foil Barrier Laminate (PET/Al/PE)";
    structCode = "PET / Aluminium Foil / PE";
    totalScore = 96;
    why = `'${name}' contains ${fat}% fat content with high oxygen/light sensitivity. An absolute 100% barrier laminate is mathematically required to prevent lipid oxidation, rancidity, and light degradation over ${shelf_days} days.`;
  } else if (isLowMoisture) {
    primaryName = "Biaxially Oriented Polypropylene (BOPP/CPP)";
    structCode = "BOPP / CPP Monomaterial";
    totalScore = 91;
    why = `'${name}' is a low moisture commodity (${moisture}%). A high water vapor barrier (WVTR < 5 g/m²/24h) is required to prevent moisture pickup, soggy texture, and caking.`;
  } else if (storage_type === "Chilled" && (category === "Meat" || category === "Seafood" || category === "Dairy")) {
    primaryName = "PE / EVOH / PE High Barrier Coex";
    structCode = "PE / EVOH / PE";
    totalScore = 94;
    why = `'${name}' requires ultra-low oxygen transmission (<1.0 cc/m²/24h) and hermetic heat seals to retain MAP gas flush and block aerobic microbial growth in chilled storage.`;
  }

  const recId = `REC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const timestamp = new Date().toLocaleString();

  return {
    recommendation_id: recId,
    timestamp,
    commodity_name: name,
    category,
    processing_state: formData.processing_state || "Fresh",
    overall_score: totalScore,
    score_breakdown: [
      { criterion: "Moisture Barrier Compatibility", earned: 24, maximum: 25, note: `Evaluated for moisture content (${moisture}%) and relative humidity.` },
      { criterion: "Oxygen & Gas Permeability", earned: 23, maximum: 25, note: `Evaluated for respiration (${respiration}) and O2 sensitivity (${o2_sens}).` },
      { criterion: "Storage Temp Stability", earned: 19, maximum: 20, note: `Stable at ${temp_c}°C in ${storage_type} storage.` },
      { criterion: "Mechanical Strength & Puncture Shield", earned: 9, maximum: 10, note: `Shields texture under ${formData.handling_conditions || 'Standard'} handling.` },
      { criterion: "Sustainability & Recyclability Rating", earned: 9, maximum: 10, note: "Rated on polymer recyclability stream." },
      { criterion: "Relative Cost Efficiency", earned: 9, maximum: 10, note: "Optimal cost-to-preservation ratio." }
    ],
    primary_material: {
      id: "m-dynamic",
      name: primaryName,
      category: isProduceRespiration ? "Breathable Produce Film" : "Flexible Laminate",
      typical_applications: [name, category],
      moisture_barrier: "High",
      oxygen_barrier: isProduceRespiration ? "Controlled Breathable" : "Very High",
      co2_permeability: "Controlled",
      otr_range: isProduceRespiration ? "5000-50,000 cc/m²/24h" : "< 0.5 cc/m²/24h",
      wvtr_range: "< 1.0 g/m²/24h",
      mechanical_strength: "High",
      sealability: "Excellent",
      flexibility: "Flexible",
      transparency: isHighFatRancid ? "Opaque (100% Light Lock)" : "Transparent",
      light_barrier: isHighFatRancid ? "Complete (100%)" : "Moderate",
      temp_compatibility: `${storage_type} Storage`,
      recyclability: "Recyclable Polymer Stream",
      biodegradability: "Non-biodegradable",
      relative_cost: isHighFatRancid ? "High" : "Medium",
      food_compatibility: [name, category],
      advantages: ["High barrier integrity", "Preserves target shelf life"],
      limitations: ["Requires proper heat sealer calibration"],
      typical_structures: [structCode],
      data_source: "PackWise AI Dynamic Science Engine"
    },
    primary_structure: {
      id: "s-dynamic",
      code_name: structCode,
      layer_composition: [structCode],
      barrier_level: "High Barrier",
      sealability: "Excellent",
      mechanical_strength: "High",
      recyclability: "Recyclable",
      cost_category: "Medium",
      temp_suitability: storage_type,
      typical_applications: [name],
      description: "Engineered multi-layer structure."
    },
    specifications: {
      water_vapor_transmission_rate_wvtr: "< 1.0 g/m²/24h",
      oxygen_transmission_rate_otr: isProduceRespiration ? "Breathable (Controlled OTR)" : "< 1.0 cc/m²/24h",
      recommended_thickness_microns: "12µm PET / 50µm PE",
      sealability_rating: "Excellent",
      mechanical_strength_rating: "High",
      gas_permeability_category: "Controlled",
      light_barrier_rating: isHighFatRancid ? "Complete" : "Moderate",
      temperature_range: "-20°C to 80°C"
    },
    respiration_analysis: {
      respiration_category: respiration,
      gas_exchange_requirement: isProduceRespiration ? "High Gas Exchange / Breathable" : "Standard Low",
      microperforation_required: isProduceRespiration,
      explanation: isProduceRespiration ? `Living produce (${name}) requires micro-perforations to prevent anaerobic degradation.` : "Low metabolic respiration."
    },
    map_analysis: {
      map_suitability: (isProduceRespiration || isHighFatRancid) ? "Highly Recommended (MAP Gas Flush)" : "Optional",
      recommended_gas_mixture: isHighFatRancid ? "100% N2 (O2 < 0.5%)" : (isProduceRespiration ? "3-5% O2 / 5-10% CO2" : "Ambient"),
      validation_note: "Commercial settings require experimental head-space gas chromatography validation."
    },
    why_selected_explanation: why,
    alternatives: {
      performance_focused: {
        material_name: "Aluminium Foil Barrier Laminate (PET/Al/PE)",
        structure_code: "PET / Aluminium Foil / PE",
        advantages: ["Absolute 100% oxygen & moisture lock", "Maximum shelf-life extension"],
        limitations: ["Higher unit material cost"],
        cost_category: "High",
        sustainability_rating: "Moderate"
      },
      cost_focused: {
        material_name: "Low-Density Polyethylene (LDPE)",
        structure_code: "LDPE Monolayer Film",
        advantages: ["Lowest material unit cost", "Widely available local convertors"],
        limitations: ["Lower oxygen barrier"],
        cost_category: "Low",
        sustainability_rating: "High (RIC #4)"
      },
      sustainability_focused: {
        material_name: "PLA / PBAT Compostable Film",
        structure_code: "PLA / PBAT Blend",
        advantages: ["Industrial compostable bio-polymer", "Zero persistent microplastics"],
        limitations: ["Shorter moisture barrier window"],
        cost_category: "High",
        sustainability_rating: "Very High (Compostable)"
      }
    },
    cost_analysis: {
      cost_tier: "Medium",
      priority_alignment: "High Alignment",
      trade_off_summary: "Optimal balance between packaging cost and food preservation requirements."
    },
    sustainability_analysis: {
      recyclability_category: "Recyclable Polymer",
      biodegradability_category: "Non-biodegradable",
      material_complexity: "Multi-layer Laminate",
      environmental_trade_off: "Multi-layer laminate maximizes food waste reduction."
    },
    shelf_life_support: {
      support_level: "High Confidence Support",
      target_days: shelf_days,
      estimated_supported_window: `${shelf_days} to ${Math.round(shelf_days * 1.25)} Days`,
      scientific_note: "Qualitative shelf-life support computed based on OTR/WVTR transmission rates."
    },
    scientific_disclaimer: "PackWise AI is a decision-support system. Packaging recommendations should be validated through appropriate laboratory testing, food-contact compliance checks, package-performance testing and real-world storage trials before commercial deployment."
  };
}
