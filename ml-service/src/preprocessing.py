import os
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler

def load_and_preprocess_nutrition_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    files_config = [
        ("FOOD-DATA-GROUP1-selected-columns.csv", "Dairy & Cheese"),
        ("FOOD-DATA-GROUP2.csv", "Beverages"),
        ("FOOD-DATA-GROUP3.csv", "Fruits & Produce"),
        ("FOOD-DATA-GROUP4-selected-columns.csv", "Desserts & Sweets"),
        ("FOOD-DATA-GROUP5-selected-columns.csv", "Fats & Oils")
    ]

    dfs = []
    for filename, category in files_config:
        path = os.path.join(data_dir, filename)
        if not os.path.exists(path):
            continue
        df = pd.read_csv(path)
        
        # Clean index columns if present
        for col in ['Unnamed: 0.1', 'Unnamed: 0']:
            if col in df.columns:
                df = df.drop(columns=[col])
        
        df['food_category'] = category
        
        # Standardize food name column
        food_col = [c for c in df.columns if 'food' in c.lower() or 'item' in c.lower()][0]
        df = df.rename(columns={food_col: 'food'})
        df['food'] = df['food'].astype(str).str.strip().str.lower()
        
        # Ensure numerical core columns exist
        num_cols = ['Caloric Value', 'Fat', 'Saturated Fats', 'Monounsaturated Fats', 'Polyunsaturated Fats', 'Carbohydrates', 'Sugars']
        for c in num_cols:
            if c not in df.columns:
                df[c] = 0.0
            else:
                df[c] = pd.to_numeric(df[c], errors='coerce').fillna(0.0)

        # Handle Protein & Fiber for datasets where they are missing
        if 'Protein' not in df.columns:
            if category == "Dairy & Cheese":
                # Dairy average ~15g protein per 100g
                df['Protein'] = np.where(df['food'].str.contains('cheese|ricotta|cottage'), 18.0, 7.0)
            elif category == "Fats & Oils":
                # Seeds/nuts have protein (~12g), pure oils 0g
                df['Protein'] = np.where(df['food'].str.contains('butter|seed|nut'), 14.0, 0.0)
            else:
                df['Protein'] = 1.0
        else:
            df['Protein'] = pd.to_numeric(df['Protein'], errors='coerce').fillna(0.0)

        if 'Dietary Fiber' not in df.columns:
            if category in ["Fruits & Produce", "Desserts & Sweets"]:
                df['Dietary Fiber'] = np.where(df['food'].str.contains('fruit|berry|apple|oat|grain'), 2.5, 0.5)
            elif category == "Fats & Oils":
                df['Dietary Fiber'] = np.where(df['food'].str.contains('seed|nut'), 5.0, 0.0)
            else:
                df['Dietary Fiber'] = 0.0
        else:
            df['Dietary Fiber'] = pd.to_numeric(df['Dietary Fiber'], errors='coerce').fillna(0.0)

        if 'Sodium' not in df.columns:
            df['Sodium'] = 0.05
        else:
            df['Sodium'] = pd.to_numeric(df['Sodium'], errors='coerce').fillna(0.0)

        if 'Cholesterol' not in df.columns:
            if category in ["Dairy & Cheese", "Fats & Oils"]:
                df['Cholesterol'] = np.where(df['food'].str.contains('cheese|butter|cream|ghee'), 30.0, 0.0)
            else:
                df['Cholesterol'] = 0.0
        else:
            df['Cholesterol'] = pd.to_numeric(df['Cholesterol'], errors='coerce').fillna(0.0)

        dfs.append(df)

    if not dfs:
        raise FileNotFoundError("No food dataset CSV files found in data directory.")

    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df = combined_df.drop_duplicates(subset=['food']).reset_index(drop=True)

    # 1. Derive Rules & Dietary Classifications
    non_veg_keywords = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'turkey', 'lamb', 'shrimp', 'bacon', 'ham', 'sausage', 'meat', 'anchovy', 'menhaden', 'cod liver', 'lard', 'gelatin']
    egg_keywords = ['egg', 'eggnog', 'custard', 'mayonnaise', 'meringue']
    dairy_keywords = ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'whey', 'ghee', 'ricotta', 'neufchatel', 'requeijao', 'ice cream']

    def assign_dietary_flags(row):
        name = row['food']
        chol = row['Cholesterol']
        
        is_non_veg = any(kw in name for kw in non_veg_keywords) or chol > 120.0
        is_egg = any(kw in name for kw in egg_keywords)
        is_dairy = any(kw in name for kw in dairy_keywords)
        
        is_vegan = (not is_non_veg) and (not is_egg) and (not is_dairy) and (chol == 0)
        is_vegetarian = (not is_non_veg) and (not is_egg)
        is_eggetarian = (not is_non_veg)
        
        cals = max(row['Caloric Value'], 1.0)
        prot = row['Protein']
        carbs = row['Carbohydrates']
        fiber = row['Dietary Fiber']

        is_high_protein = (prot * 4 / cals) >= 0.22 or prot >= 10.0
        is_low_carb = (carbs * 4 / cals) <= 0.25 or carbs <= 6.0
        is_high_fiber = fiber >= 2.5 or (fiber / cals * 100) >= 1.2

        return pd.Series({
            'is_vegan': is_vegan,
            'is_vegetarian': is_vegetarian,
            'is_eggetarian': is_eggetarian,
            'is_non_veg': is_non_veg,
            'is_high_protein': is_high_protein,
            'is_low_carb': is_low_carb,
            'is_high_fiber': is_high_fiber
        })

    flag_df = combined_df.apply(assign_dietary_flags, axis=1)
    combined_df = pd.concat([combined_df, flag_df], axis=1)

    # 2. Derive Continuous Ratios
    combined_df['protein_per_cal'] = (combined_df['Protein'] * 4.0) / combined_df['Caloric Value'].clip(lower=1.0)
    combined_df['fiber_per_cal'] = (combined_df['Dietary Fiber'] * 100.0) / combined_df['Caloric Value'].clip(lower=1.0)
    combined_df['sugar_per_cal'] = (combined_df['Sugars'] * 4.0) / combined_df['Caloric Value'].clip(lower=1.0)
    combined_df['fat_per_cal'] = (combined_df['Fat'] * 9.0) / combined_df['Caloric Value'].clip(lower=1.0)

    # 3. Fit Vector Scaler for Cosine Similarity Ranking
    feature_cols = ['Caloric Value', 'Fat', 'Saturated Fats', 'Carbohydrates', 'Sugars', 'Protein', 'Dietary Fiber', 'protein_per_cal', 'fiber_per_cal']
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(combined_df[feature_cols])

    # Save artifacts
    cleaned_path = os.path.join(data_dir, "cleaned_nutrition_data.csv")
    combined_df.to_csv(cleaned_path, index=False)
    
    scaler_path = os.path.join(models_dir, "nutrition_scaler.pkl")
    joblib.dump({"scaler": scaler, "feature_cols": feature_cols}, scaler_path)

    print(f"[SUCCESS] Preprocessed {len(combined_df)} food items. Exported to {cleaned_path}")
    return combined_df, scaler, feature_cols

if __name__ == "__main__":
    load_and_preprocess_nutrition_data()
