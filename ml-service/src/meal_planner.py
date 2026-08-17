import pandas as pd
import numpy as np

def generate_constrained_meal_plan(ranked_df: pd.DataFrame, targets: dict) -> list:
    daily_cals = targets['targetCalories']
    
    # Filter out pure water / zero calorie drinks for meal construction
    valid_df = ranked_df[ranked_df['Caloric Value'] >= 20.0].copy()
    if len(valid_df) < 10:
        valid_df = ranked_df.copy()

    meal_ratios = [
        {"type": "Breakfast", "target_pct": 0.22, "cat_keywords": ["fruit", "berry", "cheese", "milk", "yoghurt", "oat", "bread", "juice", "egg", "apple", "banana"]},
        {"type": "Lunch", "target_pct": 0.35, "cat_keywords": ["rice", "bean", "cheese", "potato", "salad", "vegetable", "paneer", "soup", "lentil", "pasta", "chickpea"]},
        {"type": "Snack", "target_pct": 0.15, "cat_keywords": ["berry", "nut", "seed", "fruit", "smoothie", "yogurt", "tea", "coffee", "biscuit", "almond"]},
        {"type": "Dinner", "target_pct": 0.28, "cat_keywords": ["cheese", "soup", "vegetable", "salad", "curry", "spinach", "paneer", "mushroom", "tofu", "quinoa"]}
    ]

    used_foods = set()
    meals_output = []

    for m_cfg in meal_ratios:
        meal_type = m_cfg["type"]
        m_cal_target = daily_cals * m_cfg["target_pct"]
        keywords = m_cfg["cat_keywords"]

        # Filter candidates matching category keywords
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

        for idx, row in candidates.iterrows():
            if len(selected_foods) >= 2:
                break

            fname = row['food']
            cals = max(float(row['Caloric Value']), 20.0)
            prot = float(row['Protein'])
            carbs = float(row['Carbohydrates'])
            fat = float(row['Fat'])

            # Aim for 50% of meal calorie budget per item
            desired_cals_per_item = m_cal_target * 0.50
            portion_g = (desired_cals_per_item / cals) * 100.0
            
            # Portions bounded between 50g and 250g
            portion_g = max(50.0, min(portion_g, 250.0))
            ratio = portion_g / 100.0

            item_cals = round(cals * ratio)
            item_prot = round(prot * ratio, 1)
            item_carbs = round(carbs * ratio, 1)
            item_fat = round(fat * ratio, 1)

            selected_foods.append({
                "name": fname.title(),
                "category": row.get('food_category', 'Nutritious Choice'),
                "portion": f"{round(portion_g)}g",
                "calories": item_cals,
                "protein": item_prot,
                "carbohydrates": item_carbs,
                "fat": item_fat
            })

            used_foods.add(fname)
            accumulated_cals += item_cals
            accumulated_prot += item_prot
            accumulated_carbs += item_carbs
            accumulated_fat += item_fat

        food_titles = [f["name"] for f in selected_foods]
        meal_title = " & ".join(food_titles) if food_titles else f"Balanced {meal_type} Option"

        round_prot = round(accumulated_prot, 1)
        round_carbs = round(accumulated_carbs, 1)
        round_fat = round(accumulated_fat, 1)

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
            "macros": f"{round_prot}g P • {round_carbs}g C • {round_fat}g F"
        })

    return meals_output

