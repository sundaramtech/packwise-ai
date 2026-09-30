from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.auth import router as auth_router
from backend.routes.recommendations import router as rec_router
from backend.routes.materials import router as mat_router
from backend.routes.reports import router as rep_router
from backend.routes.assistant import router as ast_router
from backend.routes.admin import router as adm_router

app = FastAPI(
    title="PackWise AI API",
    description="AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities (SIH 26236)",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(rec_router)
app.include_router(mat_router)
app.include_router(rep_router)
app.include_router(ast_router)
app.include_router(adm_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "PackWise AI API",
        "tagline": "Smarter Packaging. Better Food Protection.",
        "sih_problem_statement": "26236"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
