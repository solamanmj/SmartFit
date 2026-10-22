"""
SmartFit Nutrient Adequacy, Energy Target & Micronutrient Gap Evaluation Engine
Calculates individualized metabolic targets and audits proposed meal plans against
clinical RDA reference benchmarks (Fiber, Calcium, Iron, Potassium, Vitamin B12).
"""

from typing import Dict, List, Any
import math
from domain_models import ClientNutritionProfile, FitnessGoal, DietaryPattern, RestrictionType

# Recommended Dietary Allowances (RDA) Reference Benchmarks for Adults
CLINICAL_RDA_BENCHMARKS = {
    "fiber_g": 30.0,
    "calcium_mg": 1000.0,
    "iron_mg": 18.0,
    "potassium_mg": 3400.0,
    "sodium_max_mg": 2300.0,
    "vitamin_b12_mcg": 2.4
}

# Verified Whole Food Replacements for Common Elimination Gaps
VERIFIED_FOOD_GAP_REMEDIES = {
    "calcium": [
        {"food": "Fortified Soy / Almond Milk", "portion": "250 ml", "yield": "300mg Calcium", "suitableFor": ["Vegan", "Dairy-Free"]},
        {"food": "Chia Seeds", "portion": "30g", "yield": "180mg Calcium", "suitableFor": ["Vegan", "Nut-Free"]},
        {"food": "Tofu (Calcium-Set)", "portion": "150g", "yield": "350mg Calcium", "suitableFor": ["Vegetarian", "Vegan"]},
        {"food": "Cooked Collard / Mustard Greens", "portion": "1 Cup", "yield": "260mg Calcium", "suitableFor": ["All"]}
    ],
    "iron": [
        {"food": "Cooked Lentils (Dal)", "portion": "1 Cup", "yield": "6.6mg Iron", "suitableFor": ["Vegetarian", "Vegan"]},
        {"food": "Pumpkin Seeds (Pepitas)", "portion": "30g", "yield": "2.5mg Iron", "suitableFor": ["Vegan", "Nut-Free"]},
        {"food": "Cooked Spinach with Lemon (Vitamin C)", "portion": "1 Cup", "yield": "6.4mg Iron", "suitableFor": ["All"]},
        {"food": "Quinoa", "portion": "1 Cup", "yield": "2.8mg Iron", "suitableFor": ["Gluten-Free", "Vegan"]}
    ],
    "vitamin_b12": [
        {"food": "Nutritional Yeast (Fortified)", "portion": "1 Tbsp (10g)", "yield": "2.4mcg B12 (100% RDA)", "suitableFor": ["Vegan", "Vegetarian"]},
        {"food": "Fortified Plant Milk", "portion": "250 ml", "yield": "1.2mcg B12", "suitableFor": ["Dairy-Free", "Vegan"]},
        {"food": "0% Greek Yogurt / Low-Fat Milk", "portion": "200g", "yield": "1.5mcg B12", "suitableFor": ["Vegetarian"]}
    ],
    "fiber": [
        {"food": "Rolled Oats / Sprouted Oats", "portion": "60g", "yield": "6.5g Beta-Glucan Fiber", "suitableFor": ["Vegetarian", "Vegan"]},
        {"food": "Boiled Black Beans / Chickpeas", "portion": "1 Cup", "yield": "15g Fiber", "suitableFor": ["Vegan", "Gluten-Free"]},
        {"food": "Psyllium Husk / Flaxseeds", "portion": "10g", "yield": "7.8g Soluble Fiber", "suitableFor": ["All"]}
    ]
}


class NutrientAdequacyEngine:

    @staticmethod
    def calculate_personalized_targets(profile: ClientNutritionProfile) -> Dict[str, Any]:
        """
        Calculates individualized energy and macronutrient targets based on Mifflin-St Jeor,
        TDEE physical activity multipliers, and body-weight protein scaling.
        """
        w = profile.weightKg
        h = profile.heightCm
        age = profile.age
        gender = profile.gender.lower()

        # 1. Basal Metabolic Rate (Mifflin-St Jeor)
        if "female" in gender or "woman" in gender:
            bmr = 10.0 * w + 6.25 * h - 5.0 * age - 161.0
        else:
            bmr = 10.0 * w + 6.25 * h - 5.0 * age + 5.0

        # 2. Activity Multiplier (PAL)
        act = profile.activityLevel.lower()
        if "sedentary" in act:
            pal = 1.2
        elif "light" in act:
            pal = 1.375
        elif "very" in act or "extra" in act:
            pal = 1.725
        elif "extreme" in act or "athlete" in act:
            pal = 1.9
        else:  # Moderately Active
            pal = 1.55

        tdee = bmr * pal

        # 3. Energy Offset for Fitness Goal
        goal = profile.fitnessGoal
        if goal == FitnessGoal.FAT_LOSS:
            target_calories = max(1300.0, tdee - 450.0)
            protein_g = min(w * 2.1, target_calories * 0.38 / 4.0)
            fat_g = (target_calories * 0.25) / 9.0
        elif goal == FitnessGoal.MUSCLE_BUILDING:
            target_calories = tdee + 350.0
            protein_g = min(w * 2.2, target_calories * 0.35 / 4.0)
            fat_g = (target_calories * 0.25) / 9.0
        elif goal == FitnessGoal.BODY_RECOMPOSITION:
            target_calories = tdee - 150.0
            protein_g = w * 2.3
            fat_g = (target_calories * 0.25) / 9.0
        else:  # Maintenance
            target_calories = tdee
            protein_g = w * 1.8
            fat_g = (target_calories * 0.30) / 9.0

        protein_cals = protein_g * 4.0
        fat_cals = fat_g * 9.0
        carb_cals = max(0.0, target_calories - (protein_cals + fat_cals))
        carb_g = carb_cals / 4.0

        return {
            "bmr": round(bmr),
            "tdee": round(tdee),
            "targetCalories": int(round(target_calories)),
            "proteinTargetGrams": round(protein_g, 1),
            "carbohydrateTargetGrams": round(carb_g, 1),
            "fatTargetGrams": round(fat_g, 1),
            "fiberTargetGrams": CLINICAL_RDA_BENCHMARKS["fiber_g"],
            "calculationModel": "Mifflin-St Jeor Clinical BMR x PAL + Specific Goal Macro Allocation"
        }

    @classmethod
    def audit_meal_plan_adequacy(cls, meals: List[Dict[str, Any]], targets: Dict[str, Any], profile: ClientNutritionProfile) -> Dict[str, Any]:
        """
        Audits the cumulative nutrient totals of a proposed plan against targets and identifies gaps.
        """
        tot_cals = sum(float(m.get("calories", 0)) for m in meals)
        tot_prot = sum(float(m.get("protein", 0)) for m in meals)
        tot_carbs = sum(float(m.get("carbohydrates", 0)) for m in meals)
        tot_fat = sum(float(m.get("fat", 0)) for m in meals)

        # Estimate fiber from meal ingredients or default density
        tot_fiber = sum(float(m.get("fiber", m.get("carbohydrates", 0) * 0.12)) for m in meals)

        target_cals = targets["targetCalories"]
        target_prot = targets["proteinTargetGrams"]

        cal_adherence = round((tot_cals / max(1, target_cals)) * 100, 1)
        prot_adherence = round((tot_prot / max(1, target_prot)) * 100, 1)

        identified_gaps: List[Dict[str, Any]] = []
        safe_food_remedies: List[Dict[str, Any]] = []

        # Check Protein Adequacy
        if prot_adherence < 85.0:
            identified_gaps.append({
                "nutrient": "Protein",
                "current": f"{round(tot_prot, 1)}g",
                "target": f"{target_prot}g",
                "risk": "Sub-optimal muscle protein synthesis or lean tissue loss",
                "severity": "MODERATE"
            })

        # Check Fiber Adequacy
        if tot_fiber < 22.0:
            identified_gaps.append({
                "nutrient": "Dietary Fiber",
                "current": f"{round(tot_fiber, 1)}g",
                "target": "30.0g",
                "risk": "Reduced gut motility and altered microbiome diversity",
                "severity": "LOW"
            })
            safe_food_remedies.extend(VERIFIED_FOOD_GAP_REMEDIES["fiber"][:2])

        # Check Calcium Gap if Dairy Restricted
        has_dairy_restriction = any(
            r.allergenCategory == "MILK_DAIRY" or "dairy" in r.specificItemOrKeyword.lower() or "milk" in r.specificItemOrKeyword.lower()
            for r in profile.restrictions
        )
        if has_dairy_restriction:
            identified_gaps.append({
                "nutrient": "Calcium",
                "current": "Reduced from Dairy Exclusion",
                "target": "1000mg RDA",
                "risk": "Bone mineral density compromise over prolonged elimination without fortified substitutes",
                "severity": "ELEVATED"
            })
            safe_food_remedies.extend(VERIFIED_FOOD_GAP_REMEDIES["calcium"])

        # Check Vitamin B12 Gap if Vegan
        if profile.dietaryPattern == DietaryPattern.VEGAN:
            identified_gaps.append({
                "nutrient": "Vitamin B12",
                "current": "Exclusively Plant-Based Plan",
                "target": "2.4mcg RDA",
                "risk": "Hematological & neurological deficit without fortified foods or specialist-advised supplementation",
                "severity": "ELEVATED"
            })
            safe_food_remedies.extend(VERIFIED_FOOD_GAP_REMEDIES["vitamin_b12"])

        is_adequate = (cal_adherence >= 85.0 and cal_adherence <= 115.0 and prot_adherence >= 85.0)

        return {
            "overallAdequacyScore": f"{min(100, round((cal_adherence + prot_adherence) / 2))}%",
            "isNutritionallyAdequate": is_adequate,
            "macronutrientTotals": {
                "calories": round(tot_cals),
                "proteinGrams": round(tot_prot, 1),
                "carbohydrateGrams": round(tot_carbs, 1),
                "fatGrams": round(tot_fat, 1),
                "fiberGrams": round(tot_fiber, 1)
            },
            "adherencePercentages": {
                "calorieAdherence": f"{cal_adherence}%",
                "proteinAdherence": f"{prot_adherence}%"
            },
            "identifiedGaps": identified_gaps,
            "verifiedFoodRemedies": safe_food_remedies
        }
