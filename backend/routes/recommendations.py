from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
import uuid
from datetime import datetime
from backend.database import db
from backend.engine.recommendation import evaluate_recommendation

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("/analyze")
def analyze_food(req: Dict[str, Any]):
    result = evaluate_recommendation(req)
    # Record history entry
    hist_entry = {
        "id": result["recommendation_id"],
        "timestamp": result["timestamp"],
        "commodity_name": result["commodity_name"],
        "overall_score": result["overall_score"],
        "primary_material": result["primary_material"]["name"],
        "primary_structure": result["primary_structure"]["code_name"],
        "storage_type": req.get("storage_type", "Ambient"),
        "desired_shelf_life_days": req.get("desired_shelf_life_days", 30),
        "result_data": result
    }
    db.history.insert(0, hist_entry)
    db.save()
    return result

@router.post("/save")
def save_recommendation(payload: Dict[str, Any]):
    rec_id = payload.get("recommendation_id", f"REC-{uuid.uuid4().hex[:8].upper()}")
    notes = payload.get("notes", "")
    user_id = payload.get("user_id", "u-demo")
    
    # check if already saved
    for item in db.saved_recommendations:
        if item["id"] == rec_id:
            item["notes"] = notes
            db.save()
            return {"status": "updated", "saved": item}
    
    result_data = payload.get("result_data", {})
    new_saved = {
        "id": rec_id,
        "user_id": user_id,
        "user_name": payload.get("user_name", "PackWise User"),
        "commodity_name": payload.get("commodity_name", result_data.get("commodity_name", "Food Item")),
        "date": datetime.now().strftime("%Y-%m-%d"),
        "material_name": result_data.get("primary_material", {}).get("name", "Standard Packaging"),
        "structure_code": result_data.get("primary_structure", {}).get("code_name", "Standard Structure"),
        "compatibility_score": result_data.get("overall_score", 85),
        "storage_type": payload.get("storage_type", "Ambient"),
        "shelf_life_days": payload.get("shelf_life_days", 30),
        "notes": notes,
        "result_data": result_data
    }
    db.saved_recommendations.insert(0, new_saved)
    db.save()
    return {"status": "saved", "saved": new_saved}

@router.get("/history")
def get_history(commodity: Optional[str] = None, storage: Optional[str] = None):
    res = db.history
    if commodity and commodity.strip():
        res = [item for item in res if commodity.lower() in item["commodity_name"].lower()]
    if storage and storage.strip():
        res = [item for item in res if storage.lower() in item.get("storage_type", "").lower()]
    return res

@router.get("/saved")
def get_saved():
    return db.saved_recommendations

@router.get("/{id}")
def get_recommendation_by_id(id: str):
    for item in db.history:
        if item["id"].upper() == id.upper():
            return item["result_data"]
    for item in db.saved_recommendations:
        if item["id"].upper() == id.upper():
            return item["result_data"]
    raise HTTPException(status_code=404, detail="Recommendation not found")

@router.delete("/{id}")
def delete_recommendation(id: str):
    db.saved_recommendations = [item for item in db.saved_recommendations if item["id"].upper() != id.upper()]
    db.history = [item for item in db.history if item["id"].upper() != id.upper()]
    db.save()
    return {"status": "deleted"}
