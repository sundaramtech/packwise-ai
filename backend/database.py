import json
import os
import uuid
from datetime import datetime
from backend.seed_data import COMMODITIES_SEED, MATERIALS_SEED, STRUCTURES_SEED

DB_FILE = os.path.join(os.path.dirname(__file__), "data", "db.json")

class Database:
    def __init__(self):
        os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.users = data.get("users", [])
                    self.commodities = data.get("commodities", COMMODITIES_SEED)
                    self.materials = data.get("materials", MATERIALS_SEED)
                    self.structures = data.get("structures", STRUCTURES_SEED)
                    self.saved_recommendations = data.get("saved_recommendations", [])
                    self.history = data.get("history", [])
            except Exception:
                self._load_defaults()
        else:
            self._load_defaults()

    def _load_defaults(self):
        self.users = [
            {
                "id": "u-admin",
                "full_name": "SIH Admin User",
                "email": "admin@packwise.ai",
                "password_hash": "admin123",
                "user_type": "Admin",
                "created_at": "2026-01-01 10:00:00"
            },
            {
                "id": "u-demo",
                "full_name": "Food Manufacturer Demo",
                "email": "demo@packwise.ai",
                "password_hash": "demo123",
                "user_type": "Food Manufacturer",
                "created_at": "2026-01-02 11:30:00"
            }
        ]
        self.commodities = COMMODITIES_SEED
        self.materials = MATERIALS_SEED
        self.structures = STRUCTURES_SEED
        self.saved_recommendations = []
        self.history = []
        self.save()

    def save(self):
        try:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "users": self.users,
                    "commodities": self.commodities,
                    "materials": self.materials,
                    "structures": self.structures,
                    "saved_recommendations": self.saved_recommendations,
                    "history": self.history
                }, f, indent=2)
        except Exception as e:
            print("DB Save Error:", e)

db = Database()
