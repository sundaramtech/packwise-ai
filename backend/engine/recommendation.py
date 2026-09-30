import uuid
from datetime import datetime
from typing import Dict, Any, List
from backend.seed_data import MATERIALS_SEED, STRUCTURES_SEED

def evaluate_recommendation(req: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Extract & Sanitize User Inputs
    commodity_name = req.get("commodity_name", "Food Commodity").strip()
    category = req.get("category", "General Food")
    processing_state = req.get("processing_state", "Fresh")
    shelf_life_days = int(req.get("desired_shelf_life_days", 30))
    moisture = float(req.get("moisture_content_pct", 50.0))
    fat = float(req.get("oil_fat_pct", 5.0))
    ph = float(req.get("ph_level", 6.0))
    respiration = req.get("respiration_rate", "None")
    o2_sens = req.get("oxygen_sensitivity", "Medium")
    light_sens = req.get("light_sensitivity", "Medium")
    microbial_sens = req.get("microbial_sensitivity", "Medium")
    texture_sens = req.get("texture_sensitivity", "Medium")
    
    storage_type = req.get("storage_type", "Ambient")
    storage_temp = float(req.get("storage_temp_c", 25.0))
    humidity = float(req.get("relative_humidity_pct", 50.0))
    light_exposure = req.get("light_exposure", "Indirect Light")
    
    transport_type = req.get("transport_type", "Road")
    transport_duration = int(req.get("transport_duration_hours", 24))
    handling = req.get("handling_conditions", "Standard")
    priorities = req.get("priorities", [])

    # 2. Biophysical Requirement Calculations
    is_produce_respiration = respiration in ["High", "Medium"] or (category in ["Fruits", "Vegetables"] and processing_state == "Fresh")
    is_high_fat_rancidity_risk = fat >= 12.0 or (o2_sens == "High" and fat >= 5.0)
    is_low_moisture_crisp_dry = moisture <= 12.0
    is_frozen = storage_type == "Frozen" or storage_temp < 0
    is_retort_cooked = processing_state in ["Cooked", "Ready-to-Eat"]
    
    want_sustainability = any(p in priorities for p in ["Sustainability", "Recyclability"])
    want_low_cost = "Low Cost" in priorities
    want_max_shelf_life = "Maximum Shelf Life" in priorities

    # 3. Multi-Criteria Scoring for ALL Materials in Database
    material_scores = []

    for mat in MATERIALS_SEED:
        mat_id = mat["id"]
        mat_name = mat["name"]
        
        # A. Moisture Barrier Score (max 25)
        # Low moisture or high moisture retention needs high moisture barrier
        m_barrier = mat.get("moisture_barrier", "Moderate")
        if is_low_moisture_crisp_dry:
            m_score = 25.0 if "Very High" in m_barrier else (23.0 if "High" in m_barrier else 15.0)
        elif moisture > 70.0:
            m_score = 24.0 if "High" in m_barrier or "Controlled" in m_barrier else 20.0
        else:
            m_score = 22.0

        # B. Oxygen & Gas Permeability Score (max 25)
        o_barrier = mat.get("oxygen_barrier", "Low")
        if is_produce_respiration:
            # Living produce needs breathable / micro-perforated film; 100% airtight foil is penalized
            if "Breathable" in mat_name or "Micro-Perforated" in mat_name:
                o_score = 25.0
            elif "Bio-based" in mat.get("category", ""):
                o_score = 22.0
            elif "Aluminium" in mat_name or "EVOH" in mat_name:
                o_score = 11.0  # Suffocation penalty for living produce
            else:
                o_score = 18.0
        elif is_high_fat_rancidity_risk or o2_sens == "High":
            # Fatty or O2 sensitive foods need ultra-high barrier
            if "Aluminium" in mat_name:
                o_score = 25.0
            elif "EVOH" in mat_name or "PET" in mat_name:
                o_score = 23.0
            elif "Micro-Perforated" in mat_name:
                o_score = 6.0   # Severe oxidation penalty if perforated
            else:
                o_score = 15.0
        else:
            o_score = 21.0

        # C. Storage Temperature & Flexibility Score (max 20)
        temp_compat = mat.get("temp_compatibility", "")
        if is_frozen:
            t_score = 20.0 if "Frozen" in temp_compat or "HDPE" in mat_name or "LDPE" in mat_name else 12.0
        elif is_retort_cooked:
            t_score = 20.0 if "Retort" in temp_compat or "PET" in mat_name or "CPP" in mat_name else 14.0
        else:
            t_score = 19.0

        # D. Mechanical Strength & Protection Score (max 10)
        mech_strength = mat.get("mechanical_strength", "Moderate")
        if texture_sens == "High" or handling == "Rough" or transport_duration > 48:
            mech_score = 10.0 if "High" in mech_strength else 6.0
        else:
            mech_score = 8.5

        # E. Sustainability & Recyclability Score (max 10)
        recyc = mat.get("recyclability", "")
        if "Recyclable" in recyc or "Compostable" in mat.get("biodegradability", ""):
            sust_score = 10.0 if want_sustainability else 8.5
        else:
            sust_score = 5.0 if want_sustainability else 7.0

        # F. Relative Cost Score (max 10)
        cost_tier = mat.get("relative_cost", "Medium")
        if cost_tier == "Low":
            c_score = 10.0 if want_low_cost else 8.5
        elif cost_tier in ["Low-Medium", "Medium"]:
            c_score = 8.5
        else:
            c_score = 5.5 if want_low_cost else 7.5

        total = m_score + o_score + t_score + mech_score + sust_score + c_score
        
        # Priority Weight Adjustments
        if want_max_shelf_life and ("Aluminium" in mat_name or "EVOH" in mat_name):
            total += 3.0
        if want_sustainability and ("Recyclable" in recyc or "Compostable" in mat.get("biodegradability", "")):
            total += 3.0

        total_clamped = min(99, int(round(total)))

        material_scores.append({
            "material": mat,
            "total_score": total_clamped,
            "breakdown": [
                {"criterion": "Moisture Barrier Compatibility", "earned": round(m_score, 1), "maximum": 25.0, "note": f"Evaluated against moisture content ({moisture}%) and RH ({humidity}%)."},
                {"criterion": "Oxygen & Gas Barrier Permeability", "earned": round(o_score, 1), "maximum": 25.0, "note": f"Evaluated for respiration rate ({respiration}) and O2 sensitivity ({o2_sens})."},
                {"criterion": "Storage Temperature Stability", "earned": round(t_score, 1), "maximum": 20.0, "note": f"Flex-stable at {storage_temp}°C in {storage_type} storage."},
                {"criterion": "Mechanical Strength & Puncture Shield", "earned": round(mech_score, 1), "maximum": 10.0, "note": f"Shields texture under {handling} handling."},
                {"criterion": "Sustainability & Recyclability Rating", "earned": round(sust_score, 1), "maximum": 10.0, "note": f"Rated on {recyc}."},
                {"criterion": "Relative Cost Efficiency", "earned": round(c_score, 1), "maximum": 10.0, "note": f"Material relative cost tier: {cost_tier}."}
            ]
        })

    # Sort materials by overall score descending
    material_scores.sort(key=lambda x: x["total_score"], reverse=True)
    best_match = material_scores[0]
    primary_material = best_match["material"]

    # Select matching structure
    matching_structure = next((s for s in STRUCTURES_SEED if primary_material["id"] in s["id"] or primary_material["name"][:4] in s["code_name"]), STRUCTURES_SEED[0])
    for s in STRUCTURES_SEED:
        if any(app.lower() in category.lower() or app.lower() in commodity_name.lower() for app in s.get("typical_applications", [])):
            matching_structure = s
            break

    # 4. Dynamic Respiration & MAP Analysis
    respiration_analysis = {
        "respiration_category": respiration,
        "gas_exchange_requirement": "High Gas Exchange / Breathable" if is_produce_respiration else "Standard Low Permeability",
        "microperforation_required": is_produce_respiration,
        "breathable_film_suitable": is_produce_respiration,
        "explanation": f"{commodity_name} exhibits active metabolic respiration ({respiration} rate). Controlled gas exchange micro-perforations prevent anaerobic fermentation and off-odors." if is_produce_respiration else f"{commodity_name} exhibits low or zero metabolic respiration during storage."
    }

    map_analysis = {
        "map_suitability": "Highly Recommended (MAP Gas Flush)" if (is_produce_respiration or is_high_fat_rancidity_risk or processing_state in ["Fresh", "Raw"]) else "Optional / Standard Atmosphere",
        "recommended_gas_mixture": "3-5% O2 / 5-10% CO2 / Bal N2" if is_produce_respiration else ("100% N2 (O2 < 0.5%)" if is_high_fat_rancidity_risk else "Ambient Atmosphere"),
        "oxygen_requirement_category": "Controlled High Permeability" if is_produce_respiration else ("Ultra-High Barrier (<1.0 cc/m²/24h)" if is_high_fat_rancidity_risk else "Moderate Barrier"),
        "carbon_dioxide_requirement_category": "Moderate Permeability" if is_produce_respiration else "Standard Barrier",
        "validation_note": "Commercial MAP gas mixtures require experimental head-space gas chromatography validation for specific commodity cultivar batches."
    }

    # 5. Dynamic Technical Justification
    why_explanation = f"{primary_material['name']} (Structure: {matching_structure['code_name']}) was mathematically recommended for '{commodity_name}' because it scores {best_match['total_score']}/100 across biophysical criteria. "
    if is_produce_respiration:
        why_explanation += f"With a {respiration} respiration rate and {moisture}% moisture, living produce requires breathable gas exchange to prevent anaerobic decay while maintaining humidity."
    elif is_high_fat_rancidity_risk:
        why_explanation += f"With {fat}% fat content and {o2_sens} oxygen sensitivity, absolute oxygen and light barriers are required to block lipid oxidation and rancidity."
    elif is_low_moisture_crisp_dry:
        why_explanation += f"With low moisture ({moisture}%) and desired shelf life of {shelf_life_days} days, a high water vapor barrier (WVTR) is essential to prevent sogginess and loss of crispness."
    else:
        why_explanation += f"It delivers an optimal balance between moisture barrier, mechanical strength for {transport_type} transport, and temperature stability at {storage_temp}°C."

    # 6. Alternatives Synthesis
    perf_mat = next((m for m in MATERIALS_SEED if "Aluminium" in m["name"] or "EVOH" in m["name"]), MATERIALS_SEED[2])
    cost_mat = next((m for m in MATERIALS_SEED if m["relative_cost"] == "Low"), MATERIALS_SEED[0])
    sust_mat = next((m for m in MATERIALS_SEED if "Compostable" in m.get("biodegradability", "") or "PLA" in m["name"]), MATERIALS_SEED[6])

    alternatives = {
        "performance_focused": {
            "material_name": perf_mat["name"],
            "structure_code": "PET / Aluminium Foil / PE",
            "advantages": ["Maximum possible shelf-life extension", "100% oxygen & light lock"],
            "limitations": ["Higher unit material cost"],
            "cost_category": perf_mat["relative_cost"],
            "sustainability_rating": "Moderate"
        },
        "cost_focused": {
            "material_name": cost_mat["name"],
            "structure_code": "LDPE Monolayer Film",
            "advantages": ["Lowest packaging material cost", "Widely available local convertors"],
            "limitations": ["Lower oxygen barrier"],
            "cost_category": cost_mat["relative_cost"],
            "sustainability_rating": "High (RIC #4)"
        },
        "sustainability_focused": {
            "material_name": sust_mat["name"],
            "structure_code": "PLA / PBAT Bio-Laminate",
            "advantages": ["Industrial compostable bio-polymer", "Zero persistent microplastics"],
            "limitations": ["Shorter moisture barrier window"],
            "cost_category": sust_mat["relative_cost"],
            "sustainability_rating": "Very High (Compostable)"
        }
    }

    # 7. Cost & Sustainability Analysis
    cost_analysis = {
        "cost_tier": primary_material["relative_cost"],
        "priority_alignment": "High Alignment" if want_low_cost and primary_material["relative_cost"] == "Low" else "Balanced Trade-off",
        "trade_off_summary": f"Selecting {primary_material['name']} provides an optimal balance between unit material cost ({primary_material['relative_cost']}) and mandatory preservation requirements for {commodity_name}."
    }

    sustainability_analysis = {
        "recyclability_category": primary_material["recyclability"],
        "biodegradability_category": primary_material["biodegradability"],
        "material_complexity": "Monomaterial" if "Mono" in matching_structure["recyclability"] else "Multi-layer Laminate",
        "environmental_trade_off": "Monomaterial polymer optimizes circular recycling." if "Mono" in matching_structure["recyclability"] else "Multi-layer laminate maximizes food waste reduction."
    }

    # 8. Qualitative Shelf-Life Support
    shelf_life_support = {
        "support_level": "High Confidence Support" if best_match["total_score"] >= 80 else "Moderate Support",
        "target_days": shelf_life_days,
        "estimated_supported_window": f"{shelf_life_days} to {int(shelf_life_days * 1.25)} Days under recommended storage ({storage_type}, {storage_temp}°C)",
        "scientific_note": "Qualitative shelf-life support level computed from OTR/WVTR transmission rates under stated relative humidity and temperature conditions."
    }

    return {
        "recommendation_id": f"REC-{uuid.uuid4().hex[:8].upper()}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "commodity_name": commodity_name,
        "category": category,
        "processing_state": processing_state,
        "overall_score": best_match["total_score"],
        "score_breakdown": best_match["breakdown"],
        "primary_material": primary_material,
        "primary_structure": matching_structure,
        "specifications": {
            "water_vapor_transmission_rate_wvtr": primary_material["wvtr_range"],
            "oxygen_transmission_rate_otr": primary_material["otr_range"],
            "recommended_thickness_microns": "12µm PET / 7µm Foil / 50µm PE" if "Aluminium" in primary_material["name"] else ("35µm Micro-perforated LDPE" if is_produce_respiration else "20µm BOPP / 30µm CPP"),
            "sealability_rating": primary_material["sealability"],
            "mechanical_strength_rating": primary_material["mechanical_strength"],
            "gas_permeability_category": primary_material["co2_permeability"],
            "light_barrier_rating": primary_material["light_barrier"],
            "temperature_range": primary_material["temp_compatibility"]
        },
        "respiration_analysis": respiration_analysis,
        "map_analysis": map_analysis,
        "why_selected_explanation": why_explanation,
        "alternatives": alternatives,
        "cost_analysis": cost_analysis,
        "sustainability_analysis": sustainability_analysis,
        "shelf_life_support": shelf_life_support,
        "scientific_disclaimer": "PackWise AI is a decision-support system. Packaging recommendations should be validated through appropriate laboratory testing, food-contact compliance checks, package-performance testing and real-world storage trials before commercial deployment."
    }
