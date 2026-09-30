from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# User Models
class UserSignup(BaseModel):
    full_name: str
    email: str
    password: str
    user_type: str  # Farmer, Food Manufacturer, Startup, Researcher, Student, Packaging Professional, Admin

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    user_type: str
    created_at: str

# Commodity Model
class FoodCommodity(BaseModel):
    id: str
    name: str
    category: str  # Fruits, Vegetables, Grains, Snacks, Dairy, Bakery, Meat, Seafood, Frozen, Ready-to-Eat
    image_url: str
    default_moisture_pct: float
    default_fat_pct: float
    default_ph: float
    respiration_rate: str  # Low, Medium, High, None
    oxygen_sensitivity: str  # Low, Medium, High
    light_sensitivity: str  # Low, Medium, High
    microbial_sensitivity: str  # Low, Medium, High
    texture_sensitivity: str  # Low, Medium, High
    description: str

# Packaging Material Model
class PackagingMaterial(BaseModel):
    id: str
    name: str
    category: str  # Rigid Plastic, Flexible Plastic, Laminate, Metal, Paper, Bio-based
    typical_applications: List[str]
    moisture_barrier: str  # Low, Moderate, High, Very High
    oxygen_barrier: str  # Low, Moderate, High, Very High
    co2_permeability: str  # Low, Moderate, High, Very High
    otr_range: str  # e.g., "1-5 cc/m²/24h" or "High (>1000)"
    wvtr_range: str  # e.g., "0.5-2.0 g/m²/24h"
    mechanical_strength: str  # Low, Moderate, High, Very High
    sealability: str  # Poor, Fair, Good, Excellent
    flexibility: str  # Rigid, Semi-rigid, Flexible
    transparency: str  # Opaque, Translucent, Transparent
    light_barrier: str  # Low, Moderate, High, Complete
    temp_compatibility: str  # Ambient, Chilled, Frozen, Retortable
    recyclability: str  # Non-recyclable, Recyclable (RIC 1-7), Industrial Composting
    biodegradability: str  # Non-biodegradable, Biodegradable, Compostable
    relative_cost: str  # Low, Medium, High, Very High
    food_compatibility: List[str]
    advantages: List[str]
    limitations: List[str]
    typical_structures: List[str]
    data_source: str

# Packaging Structure Model
class PackagingStructure(BaseModel):
    id: str
    code_name: str  # e.g., PET/LDPE, PET/Al/PE
    layer_composition: List[str]
    barrier_level: str
    sealability: str
    mechanical_strength: str
    recyclability: str
    cost_category: str
    temp_suitability: str
    typical_applications: List[str]
    description: str

# Recommendation Request Input
class RecommendationRequest(BaseModel):
    commodity_name: str
    category: str
    processing_state: str  # Fresh, Processed, Dried, Frozen, Cooked, Ready-to-Eat
    desired_shelf_life_days: int
    quantity_kg: float
    moisture_content_pct: float
    oil_fat_pct: float
    ph_level: float
    respiration_rate: str  # Low, Medium, High
    oxygen_sensitivity: str  # Low, Medium, High
    light_sensitivity: str  # Low, Medium, High
    microbial_sensitivity: str  # Low, Medium, High
    texture_sensitivity: str  # Low, Medium, High
    storage_type: str  # Ambient, Chilled, Frozen
    storage_temp_c: float
    relative_humidity_pct: float
    storage_duration_days: int
    light_exposure: str  # Dark, Indirect Light, Direct Light
    transport_type: str  # Road, Rail, Air, Sea, Refrigerated Transport
    transport_duration_hours: int
    expected_temp_variation: str  # Minimal, Moderate, High
    handling_conditions: str  # Standard, Rough, Sensitive
    priorities: List[str]  # Shelf Life, Low Cost, Sustainability, Recyclability, Max Protection, Lightweight, Export

# Criteria Compatibility Score Item
class ScoreBreakdownItem(BaseModel):
    criterion: str
    earned: float
    maximum: float
    note: str

# Recommendation Result Output
class RecommendationResult(BaseModel):
    recommendation_id: str
    timestamp: str
    commodity_name: str
    overall_score: int
    score_breakdown: List[ScoreBreakdownItem]
    primary_material: Dict[str, Any]
    primary_structure: Dict[str, Any]
    specifications: Dict[str, Any]
    respiration_analysis: Dict[str, Any]
    map_analysis: Dict[str, Any]
    why_selected_explanation: str
    alternatives: Dict[str, Any]  # performance_focused, cost_focused, sustainability_focused
    cost_analysis: Dict[str, Any]
    sustainability_analysis: Dict[str, Any]
    shelf_life_support: Dict[str, Any]
    scientific_disclaimer: str

# Saved Recommendation
class SavedRecommendation(BaseModel):
    id: str
    user_id: str
    user_name: str
    commodity_name: str
    date: str
    material_name: str
    structure_code: str
    compatibility_score: int
    storage_type: str
    shelf_life_days: int
    notes: Optional[str] = ""
    result_data: Dict[str, Any]
