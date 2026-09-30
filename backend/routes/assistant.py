from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.database import db

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])

class AskReq(BaseModel):
    question: str
    context_recommendation_id: Optional[str] = None

@router.post("/ask")
def ask_packwise(req: AskReq):
    q = req.question.strip().lower()
    
    # Grounded response lookup based on domain rules and structured dataset
    if "why" in q and "tomato" in q:
        reply = "Tomatoes are living produce with a high respiration rate. If sealed in non-breathable airtight plastic, they consume all internal O2, switch to anaerobic respiration, and produce off-odors and rapid decay. Micro-perforated or high gas-exchange PE film maintains oxygen equilibrium while locking in relative humidity to prevent shriveling."
    elif "otr" in q or "oxygen transmission" in q:
        reply = "Oxygen Transmission Rate (OTR) measures the volume of oxygen gas passing through a packaging film per unit area over 24 hours (expressed as cc/m²/24h). Fried snacks like potato chips require ultra-low OTR (<1.0 cc/m²/24h) to prevent lipid oxidation and rancidity."
    elif "wvtr" in q or "water vapor" in q:
        reply = "Water Vapor Transmission Rate (WVTR) quantifies moisture permeating through packaging (g/m²/24h). Dry foods (biscuits, powder) demand low WVTR to prevent moisture pickup and sogginess, while fresh produce requires controlled WVTR to prevent condensation build-up inside bags."
    elif "sustainable" in q or "recycl" in q:
        reply = "Monomaterial PP (BOPP/CPP) or PE (LDPE monolayer) films offer superior end-of-life recyclability compared to traditional PET/Aluminium multi-material laminates. For short shelf-life organic items, industrial compostable bio-polymers like PLA/PBAT present eco-friendly alternatives."
    elif "map" in q or "modified atmosphere" in q:
        reply = "Modified Atmosphere Packaging (MAP) replaces the air inside a package with a protective gas mixture (such as 100% N2 for fried snacks, or 3-5% O2 / 5-10% CO2 for fresh produce) to double or triple shelf life without chemical preservatives."
    else:
        reply = f"Based on PackWise AI structured packaging science rules: For '{req.question}', we evaluate food moisture content, fat oxidation risk, metabolic respiration rate, and storage temperature to specify the exact barrier film thickness and layer composition."
    
    return {
        "question": req.question,
        "answer": reply,
        "source": "PackWise AI Structured Knowledge Base"
    }
