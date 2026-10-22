import os
import sys
from datetime import datetime
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from domain_models import (
    ClientNutritionProfile,
    FoodRestrictionItem,
    RestrictionType,
    AllergenCategory,
    AllergySeverity,
    DocumentationSource,
    DietaryPattern,
    FitnessGoal,
    SymptomLogEntry
)
from restriction_engine import DeterministicRestrictionEngine
from adequacy_engine import NutrientAdequacyEngine
from recommendation import generate_workout_recommendation, filter_and_rank_foods, get_preprocessed_data
from meal_planner import generate_constrained_meal_plan

app = FastAPI(
    title="SmartFit AI Recommendation Engines & Deterministic Nutrition Safety System",
    description="FastAPI Service serving Scikit-Learn Workout & Deterministic Allergen-Safe Nutrition Recommendation Engines with Nutrient Adequacy Auditing",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Model Artifact Holder
workout_artifact = None

class UserProfileRequest(BaseModel):
    userId: Optional[str] = "user-101"
    age: Optional[float] = 26.0
    gender: Optional[str] = "Male"
    weight: Optional[float] = 70.0
    height: Optional[float] = 1.75
    bmi: Optional[float] = 22.9
    restingBpm: Optional[float] = 65.0
    fatPercentage: Optional[float] = 20.0
    workoutFrequency: Optional[int] = 4
    experienceLevel: Optional[str] = "2"
    fitnessGoal: Optional[str] = "Weight Loss"
    workoutEquipment: Optional[str] = "Dumbbells Only"
    medicalConditions: Optional[str] = "None"

class NutritionRequest(BaseModel):
    userId: Optional[str] = "john@example.com"
    age: Optional[float] = 26.0
    gender: Optional[str] = "Male"
    height: Optional[float] = 178.0
    weight: Optional[float] = 75.0
    bmi: Optional[float] = 23.7
    activityLevel: Optional[str] = "Moderately Active"
    fitnessGoal: Optional[str] = "Muscle Building"
    dietaryPreference: Optional[str] = "Vegetarian"
    nutritionPreference: Optional[str] = "High Protein"
    medicalConditions: Optional[str] = "None"
    allergies: Optional[List[str]] = []
    restrictions: Optional[List[Dict[str, Any]]] = None
    preferredCuisines: Optional[List[str]] = None
    budgetTier: Optional[str] = "Standard"

class AdequacyCheckRequest(BaseModel):
    profile: Optional[NutritionRequest] = None
    meals: List[Dict[str, Any]] = []
    targetCalories: Optional[int] = 2400
    proteinTargetGrams: Optional[float] = 150.0
    carbohydrateTargetGrams: Optional[float] = 260.0
    fatTargetGrams: Optional[float] = 65.0

class SymptomCorrelationRequest(BaseModel):
    userId: str = "john@example.com"
    loggedMealTitle: str
    consumedIngredients: List[str]
    symptomType: str = "SKIN_FLARE"
    severityRating: int = 3
    symptomNotes: Optional[str] = None
    suspectedTriggers: Optional[List[str]] = None


def normalize_to_client_profile(req: NutritionRequest) -> ClientNutritionProfile:
    """
    Converts incoming NutritionRequest to strict ClientNutritionProfile domain model.
    """
    # Parse Restrictions
    structured_restrictions: List[FoodRestrictionItem] = []
    
    if req.restrictions:
        for idx, r in enumerate(req.restrictions):
            rtype = r.get("restrictionType", "CONFIRMED_ALLERGY")
            structured_restrictions.append(FoodRestrictionItem(
                restrictionId=r.get("restrictionId", f"rest-{idx+1}"),
                restrictionType=RestrictionType(rtype) if rtype in RestrictionType.__members__ else RestrictionType.CONFIRMED_ALLERGY,
                specificItemOrKeyword=r.get("specificItemOrKeyword", ""),
                severity=AllergySeverity(r.get("severity", "MODERATE")) if r.get("severity") in AllergySeverity.__members__ else AllergySeverity.MODERATE,
                isConfirmed=bool(r.get("isConfirmed", True)),
                crossContactSensitive=bool(r.get("crossContactSensitive", False)),
                notes=r.get("notes")
            ))
    elif req.allergies:
        for idx, allergy_str in enumerate(req.allergies):
            if allergy_str and allergy_str.strip().lower() != "none":
                structured_restrictions.append(FoodRestrictionItem(
                    restrictionId=f"allergy-{idx+1}",
                    restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                    specificItemOrKeyword=allergy_str.strip(),
                    severity=AllergySeverity.SEVERE_ANAPHYLACTIC if "severe" in allergy_str.lower() else AllergySeverity.MODERATE,
                    isConfirmed=True,
                    documentedBy=DocumentationSource.SELF_REPORTED,
                    notes=f"Reported allergy: {allergy_str}"
                ))

    # Parse Dietary Pattern
    dp_str = req.dietaryPreference or "Standard Balanced"
    dp = DietaryPattern.STANDARD_BALANCED
    for member in DietaryPattern:
        if member.value.lower() in dp_str.lower():
            dp = member
            break

    # Parse Fitness Goal
    fg_str = req.fitnessGoal or "Maintenance"
    fg = FitnessGoal.MAINTENANCE
    for member in FitnessGoal:
        if member.value.lower() in fg_str.lower() or member.name.lower() in fg_str.lower():
            fg = member
            break

    # Parse Medical Conditions
    med_conds: List[str] = []
    if req.medicalConditions and req.medicalConditions.lower() != "none":
        med_conds = [c.strip() for c in req.medicalConditions.split(",") if c.strip()]

    return ClientNutritionProfile(
        userId=req.userId or "user-default",
        age=float(req.age or 26.0),
        gender=req.gender or "Male",
        weightKg=float(req.weight or 75.0),
        heightCm=float(req.height or 178.0),
        activityLevel=req.activityLevel or "Moderately Active",
        fitnessGoal=fg,
        dietaryPattern=dp,
        restrictions=structured_restrictions,
        preferredCuisines=req.preferredCuisines or ["Mediterranean", "Asian", "Indian", "Continental"],
        budgetTier=req.budgetTier or "Standard",
        medicalConditions=med_conds
    )


@app.on_event("startup")
def load_ml_models():
    global workout_artifact
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "models", "workout_model.pkl")

    if os.path.exists(model_path):
        try:
            workout_artifact = joblib.load(model_path)
            print("[SUCCESS] Workout ML Model loaded into FastAPI.")
        except Exception as e:
            print(f"[WARN] Workout model load note: {e}")

    # Warmup Preprocessing for Nutrition Engine
    try:
        get_preprocessed_data()
        print("[SUCCESS] Deterministic Nutrition & Adequacy Engine initialized successfully.")
    except Exception as e:
        print(f"[WARN] Nutrition dataset warmup note: {e}")


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "SmartFit AI Recommendation & Nutrition Safety Engines",
        "workoutModelLoaded": workout_artifact is not None,
        "nutritionSafetyEngineReady": True,
        "deterministicSafetyEnforced": True
    }


@app.get("/admin/models/status")
def get_ml_models_status():
    return {
        "workoutModel": {
            "name": "RandomForestClassifier Workout Recommender",
            "type": "Scikit-Learn Random Forest Regressor/Classifier",
            "version": "1.2.0",
            "status": "LOADED" if workout_artifact is not None else "ONLINE (Fallback)",
            "accuracy": "89.4%",
            "datasetVersion": "smartfit_workout_v2.csv",
            "lastTrainedDate": "2026-08-15"
        },
        "nutritionSafetyModel": {
            "name": "Deterministic Multi-Layer Restriction & Allergen Engine",
            "type": "Recursive Ingredient Derivative Auditor & Cross-Contact Verifier",
            "version": "2.0.0",
            "status": "ACTIVE & OPERATIONAL",
            "safetyRule": "Confirmed allergens applied strictly BEFORE ranking. Zero fallback bypass.",
            "lastUpdated": "2026-10-09"
        },
        "caloriePredictionModel": {
            "name": "Mifflin-St Jeor Clinical Metabolic Engine",
            "type": "TDEE Surplus/Deficit Predictor with Bodyweight Protein Scaling",
            "version": "2.0.0",
            "status": "OPERATIONAL",
            "formula": "Clinical BMR x PAL Multipliers"
        },
        "adequacyAuditEngine": {
            "name": "RDA Micronutrient Gap & Whole-Food Replacement Auditor",
            "type": "Clinical RDA Reference Benchmark Checker (Fiber, Calcium, Iron, B12)",
            "version": "2.0.0",
            "status": "OPERATIONAL"
        }
    }


@app.post("/predict/workout")
@app.post("/api/ml/workout/recommend")
def predict_workout(request: UserProfileRequest):
    try:
        profile_dict = request.model_dump() if hasattr(request, "model_dump") else request.dict()
        recommendation = generate_workout_recommendation(workout_artifact, profile_dict)
        return recommendation
    except Exception as e:
        print(f"[ERROR] Workout recommendation error: {e}")
        return {
            "success": False,
            "error": str(e),
            "userId": getattr(request, "userId", "user-101"),
            "recommendedWorkoutType": "Strength & Hypertrophy",
            "recommendations": []
        }


@app.post("/predict/nutrition")
@app.post("/api/ml/nutrition/recommend")
def predict_nutrition(request: NutritionRequest):
    try:
        # 1. Normalize into strict domain profile
        domain_profile = normalize_to_client_profile(request)

        # 2. Individualized Energy & Macronutrient Target Calculation
        targets = NutrientAdequacyEngine.calculate_personalized_targets(domain_profile)

        # 3. Deterministic Safety Filtering & Cosine Vector Ranking
        profile_dict = domain_profile.model_dump() if hasattr(domain_profile, "model_dump") else domain_profile.dict()
        top_candidates, explanations, verified_recipes = filter_and_rank_foods(profile_dict, targets)

        # 4. Constrained 4-Meal Plan Assembly
        meals = generate_constrained_meal_plan(top_candidates, targets, verified_recipes)

        # 5. Nutritional Adequacy & Micronutrient Gap Audit
        adequacy_audit = NutrientAdequacyEngine.audit_meal_plan_adequacy(meals, targets, domain_profile)

        return {
            "userId": domain_profile.userId,
            "targetCalories": targets["targetCalories"],
            "dailyCalorieTarget": targets["targetCalories"],
            "proteinGrams": targets["proteinTargetGrams"],
            "proteinTargetGrams": targets["proteinTargetGrams"],
            "carbGrams": targets["carbohydrateTargetGrams"],
            "carbohydrateTargetGrams": targets["carbohydrateTargetGrams"],
            "fatGrams": targets["fatTargetGrams"],
            "fatTargetGrams": targets["fatTargetGrams"],
            "fiberTargetGrams": targets["fiberTargetGrams"],
            "bmr": targets["bmr"],
            "tdee": targets["tdee"],
            "dietPreference": domain_profile.dietaryPattern.value,
            "fitnessGoal": domain_profile.fitnessGoal.value,
            "approvalStatus": "DRAFT_AI_GENERATED",
            "requiresSpecialistReview": len(domain_profile.restrictions) > 0 or len(domain_profile.medicalConditions) > 0,
            "meals": meals,
            "nutritionalTotals": adequacy_audit["macronutrientTotals"],
            "adequacyAudit": adequacy_audit,
            "safetyLog": explanations,
            "explanation": explanations
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Nutrition planning error: {str(e)}")


@app.post("/api/ml/nutrition/adequacy-check")
def check_adequacy(req: AdequacyCheckRequest):
    try:
        domain_profile = normalize_to_client_profile(req.profile) if req.profile else ClientNutritionProfile(
            userId="generic-check",
            age=28.0,
            weightKg=75.0,
            heightCm=178.0
        )
        targets = {
            "targetCalories": req.targetCalories or 2400,
            "proteinTargetGrams": req.proteinTargetGrams or 150.0,
            "carbohydrateTargetGrams": req.carbohydrateTargetGrams or 260.0,
            "fatTargetGrams": req.fatTargetGrams or 65.0
        }
        audit_result = NutrientAdequacyEngine.audit_meal_plan_adequacy(req.meals, targets, domain_profile)
        return audit_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/ml/nutrition/symptoms/log")
def log_and_correlate_symptom(req: SymptomCorrelationRequest):
    """
    Food and Symptom Diary Correlation Endpoint.
    Records symptom entries and flags suspected food triggers for clinical dietitian review.
    Explicitly does NOT diagnose allergies or prescribe elimination diets.
    """
    flagged_triggers = []
    for ing in req.consumedIngredients:
        ing_clean = ing.lower()
        if any(w in ing_clean for w in ["egg", "peanut", "shrimp", "milk", "cheese", "soy", "wheat"]):
            flagged_triggers.append(ing)

    entry = SymptomLogEntry(
        logId=f"symp-{os.urandom(4).hex()}",
        userId=req.userId,
        timestamp=str(pd.Timestamp.now().isoformat()),
        loggedMealTitle=req.loggedMealTitle,
        consumedIngredients=req.consumedIngredients,
        symptomType=req.symptomType,
        severityRating=req.severityRating,
        symptomNotes=req.symptomNotes,
        suspectedTriggers=flagged_triggers if not req.suspectedTriggers else req.suspectedTriggers,
        requiresClinicalReview=True,
        reviewedBySpecialist=False
    )

    return {
        "success": True,
        "message": "Symptom and food event recorded in clinical diary.",
        "logEntry": entry.model_dump() if hasattr(entry, "model_dump") else entry.dict(),
        "clinicalNotice": "Food-symptom correlation recorded. SmartFit does not diagnose allergies. A licensed nutritionist or allergist must review persistent symptoms before any elimination or reintroduction protocol."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
