from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from backend.database import db

router = APIRouter(prefix="/api/materials", tags=["Materials"])

@router.get("")
def list_materials(
    search: Optional[str] = None,
    category: Optional[str] = None,
    barrier: Optional[str] = None,
    recyclability: Optional[str] = None
):
    items = db.materials
    if search:
        s = search.lower()
        items = [m for m in items if s in m["name"].lower() or s in m["category"].lower() or any(s in app.lower() for app in m.get("typical_applications", []))]
    if category and category != "All":
        items = [m for m in items if m["category"].lower() == category.lower()]
    if barrier and barrier != "All":
        items = [m for m in items if barrier.lower() in m["moisture_barrier"].lower() or barrier.lower() in m["oxygen_barrier"].lower()]
    if recyclability and recyclability != "All":
        items = [m for m in items if recyclability.lower() in m["recyclability"].lower()]
    return items

@router.get("/structures")
def list_structures():
    return db.structures

@router.get("/commodities")
def list_commodities():
    return db.commodities

@router.get("/{id}")
def get_material(id: str):
    for m in db.materials:
        if m["id"] == id:
            return m
    raise HTTPException(status_code=404, detail="Material not found")
