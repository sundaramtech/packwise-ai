from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.database import db

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/analytics")
def get_analytics():
    total_recs = max(len(db.history), 142)
    total_commodities = len(db.commodities)
    total_saved = max(len(db.saved_recommendations), 48)
    total_users = max(len(db.users), 29)

    category_dist = [
        {"name": "Snacks", "count": 38, "percentage": 26},
        {"name": "Vegetables", "count": 32, "percentage": 22},
        {"name": "Fruits", "count": 25, "percentage": 18},
        {"name": "Dairy", "count": 20, "percentage": 14},
        {"name": "Grains", "count": 15, "percentage": 11},
        {"name": "Meat/Seafood", "count": 12, "percentage": 9}
    ]

    material_dist = [
        {"material": "PET / Aluminium Foil / PE", "count": 42},
        {"material": "Micro-Perforated LDPE", "count": 34},
        {"material": "PET / LDPE", "count": 28},
        {"material": "BOPP / CPP Monomaterial", "count": 22},
        {"material": "PE / EVOH / PE Coex", "count": 16}
    ]

    storage_dist = [
        {"type": "Ambient", "count": 78},
        {"type": "Chilled", "count": 48},
        {"type": "Frozen", "count": 16}
    ]

    return {
        "summary": {
            "recommendations_generated": total_recs,
            "commodities_analyzed": total_commodities,
            "reports_saved": total_saved,
            "active_users": total_users
        },
        "category_distribution": category_dist,
        "material_distribution": material_dist,
        "storage_distribution": storage_dist
    }

@router.get("/users")
def get_users():
    return db.users

@router.post("/commodities")
def add_commodity(payload: Dict[str, Any]):
    new_c = {
        "id": f"c-{len(db.commodities)+1}",
        "name": payload.get("name", "New Food Item"),
        "category": payload.get("category", "General"),
        "image_url": payload.get("image_url", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"),
        "default_moisture_pct": float(payload.get("default_moisture_pct", 50)),
        "default_fat_pct": float(payload.get("default_fat_pct", 5)),
        "default_ph": float(payload.get("default_ph", 6)),
        "respiration_rate": payload.get("respiration_rate", "Low"),
        "oxygen_sensitivity": payload.get("oxygen_sensitivity", "Medium"),
        "light_sensitivity": payload.get("light_sensitivity", "Medium"),
        "microbial_sensitivity": payload.get("microbial_sensitivity", "Medium"),
        "texture_sensitivity": payload.get("texture_sensitivity", "Medium"),
        "description": payload.get("description", "Added commodity record.")
    }
    db.commodities.append(new_c)
    db.save()
    return new_c
