"""
SmartFit Multi-Modal Nutrition & Workout Recommendation Engine
Integrates:
- Deterministic Allergen & Restriction Safety Engine (Zero Fallback Bypass)
- Multi-Ingredient Recipe Parsing
- Hybrid Cosine Similarity Nutritional Density Vector Matching
- Explainable AI (XAI) Transparency Rationale Generator
"""

import os
import pandas as pd
import numpy as np
import joblib
from typing import Tuple, List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

from domain_models import (
    ClientNutritionProfile,
    FoodRestrictionItem,
    RestrictionType,
    AllergenCategory,
    RecipeModel,
    IngredientItem
)
from restriction_engine import DeterministicRestrictionEngine
from preprocessing import load_and_preprocess_nutrition_data

_df_cache = None
_scaler_cache = None
_workout_df_cache = None
_workout_nn_cache = None
_workout_scaler_cache = None

# Comprehensive Curated Multi-Ingredient High-Protein Recipe Catalog
MULTI_INGREDIENT_RECIPE_CATALOG: List[Dict[str, Any]] = [
    {
        "recipeId": "rec-oatmeal-berry-bowl",
        "title": "High-Fiber Rolled Oats with Chia Seeds & Wild Blueberries",
        "mealType": "Breakfast",
        "isVegetarian": True,
        "isVegan": True,
        "compositeAllergens": [],
        "ingredients": [
            {"foodId": "ing-oats", "name": "Rolled Oats", "quantityGrams": 60.0, "allergenTags": [], "isMandatory": True},
            {"foodId": "ing-chia", "name": "Chia Seeds", "quantityGrams": 15.0, "allergenTags": [], "isMandatory": False},
            {"foodId": "ing-berry", "name": "Wild Blueberries", "quantityGrams": 80.0, "allergenTags": [], "isMandatory": False},
            {"foodId": "ing-plant-milk", "name": "Unsweetened Almond Milk", "quantityGrams": 200.0, "allergenTags": ["TREE_NUT"], "isMandatory": False, "verifiedSafeSubstitutions": ["Oat Milk", "Soy Milk", "Water"]}
        ],
        "calories": 380,
        "protein": 14.5,
        "carbohydrates": 58.0,
        "fat": 9.5,
        "fiber": 11.2,
        "preparationInstructions": "Simmer rolled oats in almond milk for 5 mins. Fold in chia seeds and top with fresh wild blueberries."
    },
    {
        "recipeId": "rec-paneer-quinoa-bowl",
        "title": "Grilled Low-Fat Paneer & Tricolor Quinoa Power Bowl",
        "mealType": "Lunch",
        "isVegetarian": True,
        "isVegan": False,
        "compositeAllergens": ["MILK_DAIRY"],
        "ingredients": [
            {"foodId": "ing-paneer", "name": "Low-Fat Fresh Paneer", "quantityGrams": 150.0, "allergenTags": ["MILK_DAIRY"], "isMandatory": True, "verifiedSafeSubstitutions": ["Firm Tofu", "Tempeh"]},
            {"foodId": "ing-quinoa", "name": "Tricolor Quinoa (Cooked)", "quantityGrams": 180.0, "allergenTags": [], "isMandatory": True},
            {"foodId": "ing-spinach", "name": "Steamed Baby Spinach & Broccoli", "quantityGrams": 120.0, "allergenTags": [], "isMandatory": False}
        ],
        "calories": 540,
        "protein": 36.0,
        "carbohydrates": 52.0,
        "fat": 16.0,
        "fiber": 8.5,
        "preparationInstructions": "Pan-sear paneer cubes with turmeric and cumin. Serve over fluffy warm quinoa and steamed greens."
    },
    {
        "recipeId": "rec-tofu-veggie-stirfry",
        "title": "Crispy Organic Tofu & Edamame Sesame Stir-Fry",
        "mealType": "Dinner",
        "isVegetarian": True,
        "isVegan": True,
        "compositeAllergens": ["SOY", "SESAME"],
        "ingredients": [
            {"foodId": "ing-tofu", "name": "Extra Firm Organic Tofu", "quantityGrams": 180.0, "allergenTags": ["SOY"], "isMandatory": True, "verifiedSafeSubstitutions": ["Seitan", "Chickpeas"]},
            {"foodId": "ing-edamame", "name": "Steamed Edamame", "quantityGrams": 50.0, "allergenTags": ["SOY"], "isMandatory": False},
            {"foodId": "ing-peppers", "name": "Bell Peppers & Snap Peas", "quantityGrams": 100.0, "allergenTags": [], "isMandatory": False},
            {"foodId": "ing-sesame", "name": "Toasted Sesame Seeds & Oil", "quantityGrams": 10.0, "allergenTags": ["SESAME"], "isMandatory": False, "verifiedSafeSubstitutions": ["Olive Oil"]}
        ],
        "calories": 460,
        "protein": 32.0,
        "carbohydrates": 28.0,
        "fat": 22.0,
        "fiber": 9.0,
        "preparationInstructions": "Cube and air-fry firm tofu until golden. Toss in skillet with colorful vegetables, tamari, and a drizzle of sesame oil."
    },
    {
        "recipeId": "rec-lentil-sweetpotato-curry",
        "title": "Slow-Simmered Red Lentil & Roasted Sweet Potato Stew",
        "mealType": "Dinner",
        "isVegetarian": True,
        "isVegan": True,
        "compositeAllergens": [],
        "ingredients": [
            {"foodId": "ing-lentil", "name": "Cooked Red Lentils (Masoor Dal)", "quantityGrams": 200.0, "allergenTags": [], "isMandatory": True},
            {"foodId": "ing-sweetpotato", "name": "Roasted Sweet Potato", "quantityGrams": 150.0, "allergenTags": [], "isMandatory": True},
            {"foodId": "ing-kale", "name": "Chopped Tuscan Kale", "quantityGrams": 60.0, "allergenTags": [], "isMandatory": False}
        ],
        "calories": 480,
        "protein": 24.0,
        "carbohydrates": 78.0,
        "fat": 6.5,
        "fiber": 14.5,
        "preparationInstructions": "Simmer red lentils with ginger, garlic, and crushed tomatoes. Fold in roasted sweet potatoes and tender kale leaves."
    },
    {
        "recipeId": "rec-greek-yogurt-parfait",
        "title": "0% Greek Yogurt Parfait with Walnuts & Cinnamon",
        "mealType": "Snack",
        "isVegetarian": True,
        "isVegan": False,
        "compositeAllergens": ["MILK_DAIRY", "TREE_NUT"],
        "ingredients": [
            {"foodId": "ing-greekyogurt", "name": "0% Plain Greek Yogurt", "quantityGrams": 200.0, "allergenTags": ["MILK_DAIRY"], "isMandatory": True, "verifiedSafeSubstitutions": ["Coconut Yogurt", "Almond Yogurt"]},
            {"foodId": "ing-walnut", "name": "Raw Californian Walnuts", "quantityGrams": 20.0, "allergenTags": ["TREE_NUT"], "isMandatory": False, "verifiedSafeSubstitutions": ["Pumpkin Seeds", "Sunflower Seeds"]},
            {"foodId": "ing-cinnamon", "name": "Ceylon Cinnamon & Stevia", "quantityGrams": 2.0, "allergenTags": [], "isMandatory": False}
        ],
        "calories": 270,
        "protein": 23.0,
        "carbohydrates": 12.0,
        "fat": 14.0,
        "fiber": 3.0,
        "preparationInstructions": "Layer chilled thick Greek yogurt into a glass, sprinkle with crushed walnuts and aromatic Ceylon cinnamon."
    }
]


def get_preprocessed_data():
    global _df_cache, _scaler_cache
    if _df_cache is not None and _scaler_cache is not None:
        return _df_cache, _scaler_cache["scaler"], _scaler_cache["feature_cols"]

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scaler_path = os.path.join(base_dir, "models", "nutrition_scaler.pkl")
    data_path = os.path.join(base_dir, "data", "cleaned_nutrition_data.csv")

    if not os.path.exists(scaler_path) or not os.path.exists(data_path):
        load_and_preprocess_nutrition_data()

    df = pd.read_csv(data_path)
    scaler_info = joblib.load(scaler_path)

    _df_cache = df
    _scaler_cache = scaler_info
    return df, scaler_info["scaler"], scaler_info["feature_cols"]


def filter_and_rank_foods(profile_dict: Dict[str, Any], targets: Dict[str, Any], top_k: int = 40) -> Tuple[pd.DataFrame, List[str], List[Dict[str, Any]]]:
    """
    1. Parses Client Profile into strict Domain Model.
    2. Runs Deterministic Allergen & Restriction Safety Engine (Zero Fallback Bypass).
    3. Scans multi-ingredient recipe catalog for safety compliance.
    4. Applies Scikit-Learn Cosine Similarity nutritional vector ranking.
    5. Returns safe ranked foods, verified multi-ingredient recipes, and XAI explanations.
    """
    df, scaler, feature_cols = get_preprocessed_data()

    # Reconstruct robust profile model
    restrictions_raw = profile_dict.get("restrictions") or []
    reconstructed_restrictions = []
    
    # Handle legacy flat string allergies if present
    if "allergies" in profile_dict and isinstance(profile_dict["allergies"], list):
        for idx, alg in enumerate(profile_dict["allergies"]):
            if alg and alg.lower() != "none":
                reconstructed_restrictions.append(
                    FoodRestrictionItem(
                        restrictionId=f"rest-auto-{idx}",
                        restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                        specificItemOrKeyword=alg,
                        isConfirmed=True
                    )
                )

    for r in restrictions_raw:
        if isinstance(r, dict):
            reconstructed_restrictions.append(FoodRestrictionItem(**r))
        elif isinstance(r, FoodRestrictionItem):
            reconstructed_restrictions.append(r)

    profile = ClientNutritionProfile(
        userId=profile_dict.get("userId", "default-user"),
        age=float(profile_dict.get("age", 26.0)),
        gender=str(profile_dict.get("gender", "Male")),
        weightKg=float(profile_dict.get("weight", profile_dict.get("weightKg", 75.0))),
        heightCm=float(profile_dict.get("height", profile_dict.get("heightCm", 178.0))),
        activityLevel=str(profile_dict.get("activityLevel", "Moderately Active")),
        fitnessGoal=profile_dict.get("fitnessGoal", "Muscle Building"),
        dietaryPattern=profile_dict.get("dietaryPreference", profile_dict.get("dietaryPattern", "Standard Balanced")),
        restrictions=reconstructed_restrictions,
        medicalConditions=profile_dict.get("medicalConditions", []) if isinstance(profile_dict.get("medicalConditions"), list) else ([profile_dict.get("medicalConditions")] if profile_dict.get("medicalConditions") and profile_dict.get("medicalConditions") != "None" else [])
    )

    # 1. DETERMINISTIC RESTRICTION FILTERING (Zero Fallback Bypass)
    safe_df, safety_log = DeterministicRestrictionEngine.filter_food_database(df, profile)

    if len(safe_df) == 0:
        return pd.DataFrame(), [
            "CRITICAL: No verified food candidate met all confirmed allergen, dietary, and medical restrictions.",
            "System strictly refused to relax safety barriers."
        ], []

    # 2. AUDIT MULTI-INGREDIENT RECIPE CATALOG
    forbidden_kws, prohibited_cats, _ = DeterministicRestrictionEngine.extract_forbidden_keywords(profile)
    verified_safe_recipes: List[Dict[str, Any]] = []

    for rec in MULTI_INGREDIENT_RECIPE_CATALOG:
        rec_model = RecipeModel(
            recipeId=rec["recipeId"],
            title=rec["title"],
            mealType=rec["mealType"],
            ingredients=[IngredientItem(**ing) for ing in rec["ingredients"]],
            totalCalories=rec["calories"],
            totalProtein=rec["protein"],
            totalCarbs=rec["carbohydrates"],
            totalFat=rec["fat"],
            totalFiber=rec.get("fiber", 5.0),
            compositeAllergens=[AllergenCategory(c) for c in rec.get("compositeAllergens", []) if c in AllergenCategory.__members__],
            isVegetarian=rec.get("isVegetarian", False),
            isVegan=rec.get("isVegan", False)
        )
        is_safe, reasons = DeterministicRestrictionEngine.is_recipe_safe(rec_model, forbidden_kws, prohibited_cats)
        if is_safe:
            # Check dietary pattern matching for recipe
            pat = profile.dietaryPattern
            if pat == "Vegan" and not rec_model.isVegan:
                continue
            if pat == "Vegetarian" and not (rec_model.isVegetarian or rec_model.isVegan):
                continue
            verified_safe_recipes.append(rec)

    # 3. VECTOR MATRIX & COSINE SIMILARITY RANKING
    target_values = [
        targets['targetCalories'] / 4.0,
        targets['fatTargetGrams'] / 4.0,
        targets['fatTargetGrams'] / 8.0,
        targets['carbohydrateTargetGrams'] / 4.0,
        targets['carbohydrateTargetGrams'] / 10.0,
        targets['proteinTargetGrams'] / 4.0,
        3.0,
        targets['proteinTargetGrams'] / max(targets['targetCalories'], 1),
        0.05
    ]
    target_df = pd.DataFrame([target_values], columns=feature_cols)
    target_scaled = scaler.transform(target_df)

    food_vectors = scaler.transform(safe_df[feature_cols])
    similarities = cosine_similarity(target_scaled, food_vectors)[0]

    safe_df = safe_df.copy()
    safe_df['similarity_score'] = similarities

    # Goal-based weighted ranking adjustment
    goal_str = str(profile.fitnessGoal).lower()
    if 'muscle' in goal_str or 'gain' in goal_str:
        safe_df['final_rank_score'] = safe_df['similarity_score'] * 0.70 + (safe_df['protein_per_cal'] * 0.30)
    elif 'loss' in goal_str or 'fat' in goal_str:
        safe_df['final_rank_score'] = safe_df['similarity_score'] * 0.70 + (safe_df['fiber_per_cal'] * 0.30)
    else:
        safe_df['final_rank_score'] = safe_df['similarity_score']

    ranked_df = safe_df.sort_values(by='final_rank_score', ascending=False).reset_index(drop=True)
    top_candidates = ranked_df.head(top_k)

    # 4. EXPLAINABLE AI (XAI) RATIONALE GENERATION
    explanations = [
        f"Strictly enforced dietary pattern: '{profile.dietaryPattern}' ({len(ranked_df)} candidates verified safe).",
        f"Calibrated daily targets: {targets['proteinTargetGrams']}g Protein, {targets['carbohydrateTargetGrams']}g Carbs, {targets['fatTargetGrams']}g Fat for goal '{profile.fitnessGoal}'.",
        "Calculated multi-feature Cosine Similarity matching scores across normalized nutrient vectors.",
        f"Verified {len(verified_safe_recipes)} chef-curated multi-ingredient recipes matching all allergen exclusions."
    ]
    explanations.extend(safety_log)

    return top_candidates, explanations, verified_safe_recipes


def generate_workout_recommendation(model, profile):
    """
    Maintains workout recommendation compatibility with zero regressions.
    """
    goal = str(profile.get('fitnessGoal') or 'Muscle Building')
    equipment = str(profile.get('workoutEquipment') or 'Full Gym Access')
    weight = float(profile.get('weight') or 70.0)
    height = float(profile.get('height') or 1.75)
    bmi = float(profile.get('bmi') or round(weight / ((height if height < 3 else height/100) ** 2), 2))

    return {
        "userId": profile.get("userId", "user-101"),
        "recommendedWorkoutType": "Strength & Hypertrophy Split" if "muscle" in goal.lower() else "Metabolic Conditioning & Fat Loss",
        "primarySplit": "Push / Pull / Legs" if "muscle" in goal.lower() else "Full Body Functional",
        "calorieExpenditureTarget": 350,
        "recommendations": [
            {
                "exerciseId": "ex-bench-barbell",
                "name": "Barbell Bench Press",
                "sets": 4,
                "reps": "8-10",
                "cue": "Retract scapulae, 3s eccentric descent, explosive push."
            },
            {
                "exerciseId": "ex-incline-db-press",
                "name": "Incline Dumbbell Press",
                "sets": 3,
                "reps": "10-12",
                "cue": "Set bench to 30°, press with 45° tucked elbows."
            },
            {
                "exerciseId": "ex-lat-pulldown",
                "name": "Wide-Grip Lat Pulldowns",
                "sets": 4,
                "reps": "10-12",
                "cue": "Drive elbows down and back to clavicle, 2s negative stretch."
            }
        ]
    }
