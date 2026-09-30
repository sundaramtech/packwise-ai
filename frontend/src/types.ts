export interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
}

export interface FoodCommodity {
  id: string;
  name: string;
  category: string;
  image_url: string;
  default_moisture_pct: number;
  default_fat_pct: number;
  default_ph: number;
  respiration_rate: string;
  oxygen_sensitivity: string;
  light_sensitivity: string;
  microbial_sensitivity: string;
  texture_sensitivity: string;
  description: string;
}

export interface PackagingMaterial {
  id: string;
  name: string;
  category: string;
  typical_applications: string[];
  moisture_barrier: string;
  oxygen_barrier: string;
  co2_permeability: string;
  otr_range: string;
  wvtr_range: string;
  mechanical_strength: string;
  sealability: string;
  flexibility: string;
  transparency: string;
  light_barrier: string;
  temp_compatibility: string;
  recyclability: string;
  biodegradability: string;
  relative_cost: string;
  food_compatibility: string[];
  advantages: string[];
  limitations: string[];
  typical_structures: string[];
  data_source: string;
}

export interface PackagingStructure {
  id: string;
  code_name: string;
  layer_composition: string[];
  barrier_level: string;
  sealability: string;
  mechanical_strength: string;
  recyclability: string;
  cost_category: string;
  temp_suitability: string;
  typical_applications: string[];
  description: string;
}

export interface ScoreBreakdownItem {
  criterion: string;
  earned: number;
  maximum: number;
  note: string;
}

export interface RecommendationResult {
  recommendation_id: string;
  timestamp: string;
  commodity_name: string;
  category?: string;
  processing_state?: string;
  overall_score: number;
  score_breakdown: ScoreBreakdownItem[];
  primary_material: PackagingMaterial;
  primary_structure: PackagingStructure;
  specifications: Record<string, any>;
  respiration_analysis: Record<string, any>;
  map_analysis: Record<string, any>;
  why_selected_explanation: string;
  alternatives: Record<string, any>;
  cost_analysis: Record<string, any>;
  sustainability_analysis: Record<string, any>;
  shelf_life_support: Record<string, any>;
  scientific_disclaimer: string;
}

export interface SavedRecommendation {
  id: string;
  user_id: string;
  user_name: string;
  commodity_name: string;
  date: string;
  material_name: string;
  structure_code: string;
  compatibility_score: number;
  storage_type: string;
  shelf_life_days: number;
  notes?: string;
  result_data: RecommendationResult;
}
