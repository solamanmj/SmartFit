"""
SmartFit Constrained Multi-Meal Planner
Combines verified multi-ingredient recipes with ranked whole-food items into a balanced
4-meal daily blueprint (Breakfast, Lunch, Snack, Dinner) with transparent portions,
macronutrients, and safe ingredient substitutions.
"""

from typing import List, Dict, Any, Optional
import pandas as pd


def generate_constrained_meal_plan(ranked_df: pd.DataFrame, targets: dict, verified_recipes: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
    daily_cals = targets['targetCalories']
    
    if (ranked_df is None or len(ranked_df) == 0) and not verified_recipes:
        return []

    verified_recipes = verified_recipes or []

    # Map verified recipes by meal type
    recipes_by_type = {
        "Breakfast": [r for r in verified_recipes if r.get("mealType", "").lower() == "breakfast"],
        "Lunch": [r for r in verified_recipes if r.get("mealType", "").lower() == "lunch"],
        "Dinner": [r for r in verified_recipes if r.get("mealType", "").lower() == "dinner"],
        "Snack": [r for r in verified_recipes if r.get("mealType", "").lower() == "snack"]
    }

    # Filter out pure water / zero calorie items for whole-food meal construction
    valid_df = pd.DataFrame()
    if ranked_df is not None and len(ranked_df) > 0:
        valid_df = ranked_df[ranked_df['Caloric Value'] >= 20.0].copy()
        if len(valid_df) < 5:
            valid_df = ranked_df.copy()

    meal_ratios = [
        {"type": "Breakfast", "target_pct": 0.22, "cat_keywords": ["fruit", "berry", "cheese", "milk", "yoghurt", "oat", "bread", "juice", "egg", "apple", "banana"]},
        {"type": "Lunch", "target_pct": 0.35, "cat_keywords": ["rice", "bean", "cheese", "potato", "salad", "vegetable", "paneer", "soup", "lentil", "pasta", "chickpea", "tofu"]},
        {"type": "Snack", "target_pct": 0.15, "cat_keywords": ["berry", "nut", "seed", "fruit", "smoothie", "yogurt", "tea", "coffee", "biscuit", "almond", "walnut"]},
        {"type": "Dinner", "target_pct": 0.28, "cat_keywords": ["cheese", "soup", "vegetable", "salad", "curry", "spinach", "paneer", "mushroom", "tofu", "quinoa", "lentil"]}
    ]

    used_foods = set()
    meals_output = []

    for m_cfg in meal_ratios:
        meal_type = m_cfg["type"]
        m_cal_target = daily_cals * m_cfg["target_pct"]
        keywords = m_cfg["cat_keywords"]

        # 1. Prefer Verified Chef Multi-Ingredient Recipe if available for this slot
        matching_recipes = recipes_by_type.get(meal_type, [])
        if matching_recipes and len(meals_output) % 2 == 0:
            rec = matching_recipes[0]
            rec_foods = [ing["name"] if isinstance(ing, dict) else str(ing) for ing in rec.get("ingredients", [])]
            meals_output.append({
                "id": len(meals_output) + 1,
                "type": meal_type,
                "mealType": meal_type,
                "title": rec["title"],
                "isChefRecipe": True,
                "preparationInstructions": rec.get("preparationInstructions", ""),
                "ingredients": rec.get("ingredients", []),
                "foods": rec_foods,
                "calories": round(rec["calories"]),
                "protein": round(rec["protein"], 1),
                "carbohydrates": round(rec["carbohydrates"], 1),
                "fat": round(rec["fat"], 1),
                "fiber": round(rec.get("fiber", 6.0), 1),
                "macros": f"{round(rec['protein'], 1)}g P • {round(rec['carbohydrates'], 1)}g C • {round(rec['fat'], 1)}g F",
                "verifiedSafeSubstitutions": ["Tofu for Paneer", "Oat Milk for Almond Milk"] if "substitutions" not in rec else rec["substitutions"]
            })
            continue

        # 2. Otherwise assemble from verified ranked whole foods
        if len(valid_df) == 0:
            if matching_recipes:
                rec = matching_recipes[0]
                meals_output.append({
                    "id": len(meals_output) + 1,
                    "type": meal_type,
                    "mealType": meal_type,
                    "title": rec["title"],
                    "isChefRecipe": True,
                    "preparationInstructions": rec.get("preparationInstructions", ""),
                    "ingredients": rec.get("ingredients", []),
                    "calories": round(rec["calories"]),
                    "protein": round(rec["protein"], 1),
                    "carbohydrates": round(rec["carbohydrates"], 1),
                    "fat": round(rec["fat"], 1),
                    "fiber": round(rec.get("fiber", 6.0), 1),
                    "macros": f"{round(rec['protein'], 1)}g P • {round(rec['carbohydrates'], 1)}g C • {round(rec['fat'], 1)}g F"
                })
            continue

        kw_mask = valid_df['food'].str.contains('|'.join(keywords), case=False, na=False)
        candidates = valid_df[kw_mask & (~valid_df['food'].isin(used_foods))]

        if len(candidates) < 2:
            candidates = valid_df[~valid_df['food'].isin(used_foods)]
        if len(candidates) < 2:
            candidates = valid_df

        selected_foods = []
        accumulated_cals = 0.0
        accumulated_prot = 0.0
        accumulated_carbs = 0.0
        accumulated_fat = 0.0
        accumulated_fiber = 0.0

        for idx, row in candidates.iterrows():
            if len(selected_foods) >= 2:
                break

            fname = row['food']
            cals = max(float(row.get('Caloric Value', 50.0)), 20.0)
            prot = float(row.get('Protein', 2.0))
            carbs = float(row.get('Carbohydrates', 10.0))
            fat = float(row.get('Fat', 2.0))
            fiber = float(row.get('Dietary Fiber', carbs * 0.10))

            desired_cals_per_item = m_cal_target * 0.50
            portion_g = (desired_cals_per_item / cals) * 100.0
            portion_g = max(50.0, min(portion_g, 250.0))
            ratio = portion_g / 100.0

            item_cals = round(cals * ratio)
            item_prot = round(prot * ratio, 1)
            item_carbs = round(carbs * ratio, 1)
            item_fat = round(fat * ratio, 1)
            item_fiber = round(fiber * ratio, 1)

            selected_foods.append({
                "name": fname.title(),
                "category": row.get('food_category', 'Nutritious Choice'),
                "portion": f"{round(portion_g)}g",
                "calories": item_cals,
                "protein": item_prot,
                "carbohydrates": item_carbs,
                "fat": item_fat,
                "fiber": item_fiber
            })

            used_foods.add(fname)
            accumulated_cals += item_cals
            accumulated_prot += item_prot
            accumulated_carbs += item_carbs
            accumulated_fat += item_fat
            accumulated_fiber += item_fiber

        food_titles = [f["name"] for f in selected_foods]
        meal_title = " & ".join(food_titles) if food_titles else f"Nutritious {meal_type} Bowl"

        round_prot = round(accumulated_prot, 1)
        round_carbs = round(accumulated_carbs, 1)
        round_fat = round(accumulated_fat, 1)
        round_fiber = round(accumulated_fiber, 1)

        meals_output.append({
            "id": len(meals_output) + 1,
            "type": meal_type,
            "mealType": meal_type,
            "title": meal_title,
            "foods": selected_foods,
            "calories": round(accumulated_cals),
            "protein": round_prot,
            "carbohydrates": round_carbs,
            "fat": round_fat,
            "fiber": round_fiber,
            "macros": f"{round_prot}g P • {round_carbs}g C • {round_fat}g F",
            "preparationInstructions": f"Prepare and portion all whole-food components according to stated grams."
        })

    return meals_output
