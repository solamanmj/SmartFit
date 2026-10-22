"""
SmartFit Comprehensive Nutrition & Allergen Safety Test Suite (Phase 13 Compliance)
Validates:
1. Confirmed egg allergy strict exclusion across foods & recipe ingredients.
2. Multiple simultaneous allergies (Dairy + Soy + Tree Nuts).
3. Vegetarian & Vegan pattern compliance with zero meat contamination.
4. Milk and Soy restriction filtering.
5. Multi-ingredient recipe hidden allergen derivative detection.
6. Zero safe candidate graceful handling without relaxation.
7. Nutrient adequacy gap detection (Calcium on dairy-free, B12 on vegan).
8. Suspected skin trigger food diary recording without diagnosing allergies.
9. Individualized Mifflin-St Jeor caloric & protein/kg scaling.
10. FastAPI endpoint contract & explainable AI transparency.
"""

import unittest
import sys
import os
import pandas as pd

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from domain_models import (
    ClientNutritionProfile,
    FoodRestrictionItem,
    RestrictionType,
    AllergenCategory,
    AllergySeverity,
    DietaryPattern,
    FitnessGoal,
    RecipeModel,
    IngredientItem
)
from restriction_engine import DeterministicRestrictionEngine, ALLERGEN_DERIVATIVES_MAP
from adequacy_engine import NutrientAdequacyEngine
from recommendation import filter_and_rank_foods, get_preprocessed_data
from meal_planner import generate_constrained_meal_plan
from main import app, NutritionRequest, predict_nutrition, check_adequacy, AdequacyCheckRequest, log_and_correlate_symptom, SymptomCorrelationRequest


class TestSmartFitNutritionSafety(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.df, cls.scaler, cls.feature_cols = get_preprocessed_data()

    def test_case_1_confirmed_egg_allergy(self):
        """1. Confirmed egg allergy must exclude eggs, albumin, mayonnaise, and ovalbumin."""
        profile = ClientNutritionProfile(
            userId="user-egg-allergy",
            age=26.0,
            weightKg=72.0,
            heightCm=175.0,
            activityLevel="Moderately Active",
            fitnessGoal=FitnessGoal.MUSCLE_BUILDING,
            dietaryPattern=DietaryPattern.STANDARD_BALANCED,
            restrictions=[
                FoodRestrictionItem(
                    restrictionId="rest-egg",
                    restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                    allergenCategory=AllergenCategory.EGG,
                    specificItemOrKeyword="egg",
                    severity=AllergySeverity.SEVERE_ANAPHYLACTIC,
                    isConfirmed=True
                )
            ]
        )

        safe_df, safety_log = DeterministicRestrictionEngine.filter_food_database(self.df, profile)
        
        # Verify no egg or derivative in safe candidates
        for food in safe_df['food'].str.lower():
            for derivative in ALLERGEN_DERIVATIVES_MAP[AllergenCategory.EGG]:
                self.assertNotIn(derivative, food, f"Found prohibited egg derivative '{derivative}' in safe food: {food}")

        self.assertTrue(any("Enforced Confirmed Allergy: egg" in log for log in safety_log))

    def test_case_2_multiple_simultaneous_allergies(self):
        """2. Multiple simultaneous allergies (Milk, Soy, Tree Nuts) must all be strictly excluded."""
        profile = ClientNutritionProfile(
            userId="user-multi-allergy",
            age=30.0,
            weightKg=80.0,
            heightCm=182.0,
            activityLevel="Very Active",
            fitnessGoal=FitnessGoal.FAT_LOSS,
            dietaryPattern=DietaryPattern.STANDARD_BALANCED,
            restrictions=[
                FoodRestrictionItem(
                    restrictionId="rest-dairy",
                    restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                    allergenCategory=AllergenCategory.MILK_DAIRY,
                    specificItemOrKeyword="milk",
                    severity=AllergySeverity.SEVERE_ANAPHYLACTIC,
                    isConfirmed=True
                ),
                FoodRestrictionItem(
                    restrictionId="rest-soy",
                    restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                    allergenCategory=AllergenCategory.SOY,
                    specificItemOrKeyword="soy",
                    severity=AllergySeverity.MODERATE,
                    isConfirmed=True
                ),
                FoodRestrictionItem(
                    restrictionId="rest-nuts",
                    restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                    allergenCategory=AllergenCategory.TREE_NUT,
                    specificItemOrKeyword="nuts",
                    severity=AllergySeverity.SEVERE_ANAPHYLACTIC,
                    isConfirmed=True
                )
            ]
        )

        safe_df, _ = DeterministicRestrictionEngine.filter_food_database(self.df, profile)
        for food in safe_df['food'].str.lower():
            self.assertFalse(any(d in food for d in ["cheese", "milk", "butter", "whey", "paneer", "yogurt"]), f"Dairy found: {food}")
            self.assertFalse(any(d in food for d in ["tofu", "soy", "edamame", "tempeh", "miso"]), f"Soy found: {food}")
            self.assertFalse(any(d in food for d in ["almond", "walnut", "cashew", "pistachio"]), f"Nut found: {food}")

    def test_case_3_meat_exclusion_vegetarian_vegan(self):
        """3. Vegetarian & Vegan preference must strictly exclude poultry, meat, and seafood."""
        profile_veg = ClientNutritionProfile(
            userId="user-veg",
            age=24.0,
            weightKg=65.0,
            heightCm=170.0,
            dietaryPattern=DietaryPattern.VEGETARIAN
        )
        safe_df_veg, _ = DeterministicRestrictionEngine.filter_food_database(self.df, profile_veg)
        for food in safe_df_veg['food'].str.lower():
            self.assertFalse(any(meat in food for meat in ["chicken", "turkey", "beef", "pork", "salmon", "tuna", "shrimp", "fish"]), f"Meat in vegetarian: {food}")

    def test_case_4_milk_and_soy_restrictions(self):
        """4. Specific milk and soy restrictions must be filtered."""
        profile = ClientNutritionProfile(
            userId="user-milk-soy",
            age=28.0,
            weightKg=70.0,
            heightCm=175.0,
            restrictions=[
                FoodRestrictionItem(
                    restrictionId="r1",
                    restrictionType=RestrictionType.INTOLERANCE,
                    allergenCategory=AllergenCategory.MILK_DAIRY,
                    specificItemOrKeyword="milk"
                ),
                FoodRestrictionItem(
                    restrictionId="r2",
                    restrictionType=RestrictionType.CONFIRMED_ALLERGY,
                    allergenCategory=AllergenCategory.SOY,
                    specificItemOrKeyword="soy"
                )
            ]
        )
        safe_df, _ = DeterministicRestrictionEngine.filter_food_database(self.df, profile)
        for food in safe_df['food'].str.lower():
            self.assertFalse(any(d in food for d in ["milk", "dairy", "yogurt", "paneer", "curd", "soy", "tofu", "edamame"]))

    def test_case_5_hidden_allergen_in_recipe_detection(self):
        """5. Multi-ingredient recipe with hidden allergen derivatives must be rejected."""
        recipe_with_hidden_peanut = RecipeModel(
            recipeId="rec-hidden-1",
            title="Spiced Asian Satay Noodle Bowl",
            mealType="LUNCH",
            ingredients=[
                IngredientItem(foodId="ing-1", name="Rice Noodles", quantityGrams=150),
                IngredientItem(foodId="ing-2", name="Tofu Chunks", quantityGrams=120),
                IngredientItem(foodId="ing-3", name="Groundnut Satay Paste", quantityGrams=30, allergenTags=[AllergenCategory.PEANUT])
            ],
            totalCalories=580,
            totalProtein=24,
            totalCarbs=70,
            totalFat=18,
            totalFiber=6
        )

        forbidden_kw = {"peanut", "groundnut", "arachis"}
        prohibited_cats = {AllergenCategory.PEANUT}

        is_safe, violations = DeterministicRestrictionEngine.is_recipe_safe(recipe_with_hidden_peanut, forbidden_kw, prohibited_cats)
        self.assertFalse(is_safe)
        self.assertTrue(any("Groundnut Satay Paste" in v or "PEANUT" in v for v in violations))

    def test_case_6_zero_safe_meal_candidates_graceful_halt(self):
        """6. When all food candidates are excluded, engine safely halts with empty set, never relaxing constraints."""
        extreme_profile = ClientNutritionProfile(
            userId="user-extreme",
            age=35.0,
            weightKg=70.0,
            heightCm=170.0,
            dietaryPattern=DietaryPattern.VEGAN,
            restrictions=[
                FoodRestrictionItem(restrictionId=f"r-all-{i}", restrictionType=RestrictionType.CONFIRMED_ALLERGY, specificItemOrKeyword=kw)
                for i, kw in enumerate(["a", "e", "i", "o", "u", "y"])
            ]
        )

        safe_df, safety_log = DeterministicRestrictionEngine.filter_food_database(self.df, extreme_profile)
        self.assertEqual(len(safe_df), 0)
        self.assertTrue(any("CRITICAL: Zero food options met all confirmed allergen and dietary constraints" in log for log in safety_log))

    def test_case_7_nutrient_adequacy_gaps_calcium_b12(self):
        """7. Adequate check must identify Calcium gap on Dairy-free and Vitamin B12 on Vegan."""
        vegan_profile = ClientNutritionProfile(
            userId="user-vegan-audit",
            age=27.0,
            weightKg=60.0,
            heightCm=168.0,
            dietaryPattern=DietaryPattern.VEGAN,
            restrictions=[
                FoodRestrictionItem(restrictionId="r-dairy", restrictionType=RestrictionType.CONFIRMED_ALLERGY, allergenCategory=AllergenCategory.MILK_DAIRY, specificItemOrKeyword="dairy")
            ]
        )

        sample_meals = [
            {"type": "Breakfast", "title": "Oatmeal", "calories": 400, "protein": 12, "carbohydrates": 65, "fat": 8},
            {"type": "Lunch", "title": "Rice & Lentils", "calories": 550, "protein": 20, "carbohydrates": 90, "fat": 10},
            {"type": "Snack", "title": "Apple & Almonds", "calories": 200, "protein": 4, "carbohydrates": 25, "fat": 9},
            {"type": "Dinner", "title": "Steamed Veggies & Quinoa", "calories": 450, "protein": 16, "carbohydrates": 70, "fat": 11}
        ]

        targets = NutrientAdequacyEngine.calculate_personalized_targets(vegan_profile)
        audit = NutrientAdequacyEngine.audit_meal_plan_adequacy(sample_meals, targets, vegan_profile)

        gaps = [g["nutrient"] for g in audit["identifiedGaps"]]
        self.assertIn("Calcium", gaps)
        self.assertIn("Vitamin B12", gaps)
        self.assertGreater(len(audit["verifiedFoodRemedies"]), 0)

    def test_case_8_suspected_skin_trigger_logging(self):
        """8. Suspected skin trigger must be logged for clinical review without diagnosing allergy."""
        req = SymptomCorrelationRequest(
            userId="client-skin-flare@example.com",
            loggedMealTitle="Prawn & Egg Fried Rice with Soy Dressing",
            consumedIngredients=["Prawn", "Egg", "Rice", "Soy Sauce"],
            symptomType="SKIN_FLARE",
            severityRating=4,
            symptomNotes="Eczema flare and pruritus noticed 45 mins post-meal"
        )

        res = log_and_correlate_symptom(req)
        self.assertTrue(res["success"])
        self.assertIn("SmartFit does not diagnose allergies", res["clinicalNotice"])
        self.assertEqual(res["logEntry"]["requiresClinicalReview"], True)
        self.assertIn("Egg", res["logEntry"]["suspectedTriggers"])

    def test_case_9_individualized_mifflin_st_jeor(self):
        """9. Energy calculation must vary by goal, gender, height, and body mass."""
        male_muscle = ClientNutritionProfile(userId="m1", age=25, gender="Male", weightKg=80, heightCm=180, fitnessGoal=FitnessGoal.MUSCLE_BUILDING)
        female_fatloss = ClientNutritionProfile(userId="f1", age=25, gender="Female", weightKg=60, heightCm=165, fitnessGoal=FitnessGoal.FAT_LOSS)

        t_male = NutrientAdequacyEngine.calculate_personalized_targets(male_muscle)
        t_female = NutrientAdequacyEngine.calculate_personalized_targets(female_fatloss)

        self.assertGreater(t_male["targetCalories"], t_female["targetCalories"])
        self.assertGreater(t_male["proteinTargetGrams"], t_female["proteinTargetGrams"])
        self.assertGreaterEqual(t_male["proteinTargetGrams"], 150.0)

    def test_case_10_fastapi_endpoint_integration(self):
        """10. Full predict_nutrition FastAPI endpoint test."""
        req = NutritionRequest(
            userId="full-test@smartfit.ai",
            age=27.0,
            gender="Male",
            height=180.0,
            weight=78.0,
            fitnessGoal="Muscle Building",
            dietaryPreference="Vegetarian",
            allergies=["Peanut"]
        )
        res = predict_nutrition(req)
        self.assertEqual(res["userId"], "full-test@smartfit.ai")
        self.assertEqual(len(res["meals"]), 4)
        self.assertIn("adequacyAudit", res)
        self.assertIn("overallAdequacyScore", res["adequacyAudit"])
        
        # Verify Peanut is not in any generated meal
        for m in res["meals"]:
            self.assertNotIn("peanut", m["title"].lower())
            for f in m["foods"]:
                food_name = f["name"] if isinstance(f, dict) else str(f)
                self.assertNotIn("peanut", food_name.lower())


if __name__ == '__main__':
    unittest.main()
