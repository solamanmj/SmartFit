import math

def calculate_nutrition_targets(profile: dict) -> dict:
    weight = float(profile.get('weight') or 75.0)
    height = float(profile.get('height') or 178.0)
    if height < 3.0:
        height = height * 100.0  # Convert meters to cm if needed

    age = float(profile.get('age') or 26.0)
    gender = str(profile.get('gender') or 'Male')
    act_level = str(profile.get('activityLevel') or 'Moderately Active').lower()
    goal = str(profile.get('fitnessGoal') or 'Muscle Building').lower()

    # 1. BMR (Mifflin-St Jeor Formula)
    if 'female' in gender.lower():
        bmr = 10.0 * weight + 6.25 * height - 5.0 * age - 161.0
    else:
        bmr = 10.0 * weight + 6.25 * height - 5.0 * age + 5.0

    # 2. Activity Multiplier -> TDEE
    multiplier = 1.55
    if 'sedentary' in act_level:
        multiplier = 1.2
    elif 'light' in act_level:
        multiplier = 1.375
    elif 'very' in act_level or 'extra' in act_level:
        multiplier = 1.725
    elif 'extreme' in act_level:
        multiplier = 1.9

    tdee = bmr * multiplier

    # 3. Daily Calorie Target Based on Fitness Goal
    if 'loss' in goal or 'cut' in goal or 'fat' in goal:
        target_calories = tdee - 450.0
    elif 'muscle' in goal or 'gain' in goal or 'bulk' in goal:
        target_calories = tdee + 350.0
    else: # Maintenance
        target_calories = tdee

    target_calories = max(1200.0, round(target_calories))

    # 4. Macronutrient Targets (Grams)
    # Muscle Building: 2.2g Protein / kg; Fat: 25% of cals; Carbs: Remainder
    # Weight Loss: 2.0g Protein / kg; Fat: 25% of cals; Carbs: Deficit remainder
    # Maintenance: 1.8g Protein / kg; Fat: 30% of cals; Carbs: Remainder
    if 'muscle' in goal or 'gain' in goal:
        protein_g = min(weight * 2.2, target_calories * 0.35 / 4.0)
        fat_g = (target_calories * 0.25) / 9.0
    elif 'loss' in goal or 'fat' in goal:
        protein_g = min(weight * 2.0, target_calories * 0.40 / 4.0)
        fat_g = (target_calories * 0.25) / 9.0
    else:
        protein_g = weight * 1.8
        fat_g = (target_calories * 0.30) / 9.0

    protein_cals = protein_g * 4.0
    fat_cals = fat_g * 9.0
    carb_cals = max(0.0, target_calories - (protein_cals + fat_cals))
    carb_g = carb_cals / 4.0

    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "targetCalories": int(target_calories),
        "proteinTargetGrams": round(protein_g, 1),
        "carbohydrateTargetGrams": round(carb_g, 1),
        "fatTargetGrams": round(fat_g, 1),
        "calorieFormula": "Mifflin-St Jeor BMR * Activity Multiplier + Goal Offset"
    }
