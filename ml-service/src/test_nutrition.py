import unittest
import sys
import os
import warnings

# Ensure src directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nutrition_engine import calculate_nutrition_targets
from recommendation import filter_and_rank_foods
from meal_planner import generate_constrained_meal_plan
from main import app, NutritionRequest, predict_nutrition

class TestNutritionModule(unittest.TestCase):

    def test_height_unit_normalization_and_bmr(self):
        """Test BMR/TDEE calculation with height in meters vs cm."""
        profile_m = {
            'weight': 75.0,
            'height': 1.78, # In meters
            'age': 26,
            'gender': 'Male',
            'activityLevel': 'Moderately Active',
            'fitnessGoal': 'Muscle Building'
        }
        profile_cm = {
            'weight': 75.0,
            'height': 178.0, # In cm
            'age': 26,
            'gender': 'Male',
            'activityLevel': 'Moderately Active',
            'fitnessGoal': 'Muscle Building'
        }
        
        targets_m = calculate_nutrition_targets(profile_m)
        targets_cm = calculate_nutrition_targets(profile_cm)

        # Height in meters and cm should produce identical BMR and TDEE
        self.assertEqual(targets_m['bmr'], targets_cm['bmr'])
        self.assertEqual(targets_m['tdee'], targets_cm['tdee'])
        self.assertGreater(targets_m['bmr'], 1500)
        self.assertGreater(targets_m['targetCalories'], 2000)

    def test_allergy_filtering_and_xai(self):
        """Test exclusion of allergen keywords and inclusion in XAI explanations."""
        profile = {
            'weight': 70.0,
            'height': 175.0,
            'age': 25,
            'gender': 'Female',
            'activityLevel': 'Moderately Active',
            'fitnessGoal': 'Weight Loss',
            'dietaryPreference': 'Vegetarian',
            'allergies': ['Nuts', 'Dairy'],
            'medicalConditions': 'Hypertension'
        }
        targets = calculate_nutrition_targets(profile)

        # Capture warnings to verify sklearn UserWarning is fixed
        with warnings.catch_warnings(record=True) as w:
            warnings.simplefilter("always")
            top_candidates, explanations = filter_and_rank_foods(profile, targets)
            
            # Check sklearn warnings
            user_warnings = [item for item in w if issubclass(item.category, UserWarning)]
            self.assertEqual(len(user_warnings), 0, f"Expected 0 UserWarnings, found: {user_warnings}")

        # Check candidate count
        self.assertGreater(len(top_candidates), 5)

        # Verify no food item contains excluded allergen keywords
        food_names_lower = top_candidates['food'].str.lower().tolist()
        for food in food_names_lower:
            self.assertFalse('almond' in food or 'peanut' in food or 'hazelnut' in food, f"Found allergen nut in food: {food}")
            self.assertFalse('cheese' in food or 'milk' in food or 'butter' in food, f"Found allergen dairy in food: {food}")

        # Verify XAI explanations contain allergen and medical notes
        exp_text = " ".join(explanations)
        self.assertIn("allergen exclusion filter", exp_text.lower())
        self.assertIn("sodium constraint filter", exp_text.lower())

    def test_constrained_meal_planner(self):
        """Test generation of 4 constrained meals with macros."""
        profile = {
            'weight': 80.0,
            'height': 180.0,
            'age': 30,
            'gender': 'Male',
            'activityLevel': 'Moderately Active',
            'fitnessGoal': 'Muscle Building',
            'dietaryPreference': 'Standard Balanced'
        }
        targets = calculate_nutrition_targets(profile)
        top_candidates, _ = filter_and_rank_foods(profile, targets)

        meals = generate_constrained_meal_plan(top_candidates, targets)

        self.assertEqual(len(meals), 4)
        meal_types = [m['type'] for m in meals]
        self.assertEqual(meal_types, ['Breakfast', 'Lunch', 'Snack', 'Dinner'])

        for m in meals:
            self.assertIn('id', m)
            self.assertIn('title', m)
            self.assertIn('macros', m)
            self.assertGreater(m['calories'], 0)
            self.assertGreater(len(m['foods']), 0)

    def test_fastapi_predict_nutrition_endpoint(self):
        """Test FastAPI predict_nutrition endpoint helper."""
        req = NutritionRequest(
            userId="test@smartfit.ai",
            weight=75.0,
            height=178.0,
            age=26.0,
            gender="Male",
            activityLevel="Moderately Active",
            fitnessGoal="Muscle Building",
            dietaryPreference="Vegetarian",
            allergies=["Nuts"]
        )

        res = predict_nutrition(req)
        self.assertEqual(res['userId'], "test@smartfit.ai")
        self.assertIn('targetCalories', res)
        self.assertIn('proteinGrams', res)
        self.assertIn('carbGrams', res)
        self.assertIn('fatGrams', res)
        self.assertEqual(len(res['meals']), 4)
        self.assertGreater(len(res['explanation']), 0)

if __name__ == '__main__':
    unittest.main()
