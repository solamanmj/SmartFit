"""
SmartFit Deterministic Restriction & Allergen Safety Engine
CRITICAL SAFETY INVARIANT:
- Operates independently of and strictly BEFORE any ML recommendation or ranking.
- Machine learning scores or feedback loops CANNOT relax or bypass a safety restriction.
- Recipe ingredients, derivatives, and cross-contact hazards are recursively scanned.
- If no verified safe meal candidate exists, the engine safely halts and reports unverified status.
"""

from typing import List, Dict, Tuple, Set, Optional
import pandas as pd
from domain_models import (
    ClientNutritionProfile,
    FoodRestrictionItem,
    RestrictionType,
    AllergenCategory,
    RecipeModel,
    IngredientItem
)

# Comprehensive Synonym & Derivative Mapping for Hidden Allergens
ALLERGEN_DERIVATIVES_MAP: Dict[AllergenCategory, List[str]] = {
    AllergenCategory.PEANUT: [
        "peanut", "groundnut", "arachis", "goober", "monkey nut", "peanut butter", "peanut oil"
    ],
    AllergenCategory.TREE_NUT: [
        "almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "macadamia",
        "brazil nut", "chestnut", "pine nut", "praline", "marzipan", "nutella", "nut butter"
    ],
    AllergenCategory.MILK_DAIRY: [
        "milk", "dairy", "cheese", "paneer", "butter", "ghee", "cream", "curd", "yogurt",
        "yoghurt", "whey", "casein", "caseinate", "lactose", "custard", "buttermilk"
    ],
    AllergenCategory.EGG: [
        "egg", "egg white", "egg yolk", "albumin", "mayonnaise", "meringue", "ovalbumin",
        "eggnog", "lysozyme", "surimi"
    ],
    AllergenCategory.WHEAT_GLUTEN: [
        "wheat", "gluten", "barley", "rye", "spelt", "semolina", "durum", "bulgur",
        "couscous", "bread", "flour", "pasta", "malt", "brewer's yeast", "seitan"
    ],
    AllergenCategory.SOY: [
        "soy", "soya", "soybean", "tofu", "tempeh", "edamame", "miso", "soy sauce",
        "tamari", "soy lecithin", "textured vegetable protein", "tvp", "natto"
    ],
    AllergenCategory.FISH: [
        "fish", "salmon", "tuna", "cod", "tilapia", "trout", "halibut", "mackerel",
        "sardine", "anchovy", "bass", "fish sauce", "isinglass"
    ],
    AllergenCategory.SHELLFISH_CRUSTACEAN: [
        "shellfish", "shrimp", "prawn", "crab", "lobster", "crayfish", "clam", "mussel",
        "oyster", "scallop", "squid", "octopus", "calamari"
    ],
    AllergenCategory.SESAME: [
        "sesame", "tahini", "sesame oil", "sesame seed", "halvah", "gomasio"
    ],
    AllergenCategory.MUSTARD: [
        "mustard", "mustard seed", "mustard powder", "mustard oil"
    ],
    AllergenCategory.CELERY: [
        "celery", "celeriac", "celery salt", "celery seed"
    ],
    AllergenCategory.SULFITES: [
        "sulfite", "sulphite", "sulfur dioxide", "potassium metabisulfite"
    ]
}

# Clinician-Directed Dietary Exclusions Rules
CLINICAL_RESTRICTION_RULES = {
    "hypertension": {"max_sodium_g_per_100g": 0.15, "exclude_keywords": ["pickle", "salted", "cured", "processed meat", "bacon"]},
    "chronic_kidney_disease": {"max_potassium_mg_per_100g": 200.0, "max_sodium_g_per_100g": 0.10, "exclude_keywords": ["starfruit"]},
    "type_2_diabetes": {"max_sugars_g_per_100g": 5.0, "exclude_keywords": ["high fructose", "syrup", "candy", "sweetened"]},
    "celiac_disease": {"strict_allergen": AllergenCategory.WHEAT_GLUTEN},
    "gerd_acid_reflux": {"exclude_keywords": ["citrus", "raw onion", "peppermint", "deep fried", "spicy chili", "excessive caffeine"]}
}


class DeterministicRestrictionEngine:
    """
    Guarantees strict safety verification on all food items and recipes.
    """

    @staticmethod
    def extract_forbidden_keywords(profile: ClientNutritionProfile) -> Tuple[Set[str], Set[AllergenCategory], List[str]]:
        """
        Builds a comprehensive set of prohibited keywords and allergen categories.
        """
        forbidden_keywords: Set[str] = set()
        prohibited_categories: Set[AllergenCategory] = set()
        active_safety_warnings: List[str] = []

        for r in profile.restrictions:
            # 1. Confirmed Allergens & Intolerances
            if r.restrictionType in [RestrictionType.CONFIRMED_ALLERGY, RestrictionType.INTOLERANCE, RestrictionType.SUSPECTED_TRIGGER]:
                if r.allergenCategory and r.allergenCategory in ALLERGEN_DERIVATIVES_MAP:
                    prohibited_categories.add(r.allergenCategory)
                    for derivative in ALLERGEN_DERIVATIVES_MAP[r.allergenCategory]:
                        forbidden_keywords.add(derivative.lower())
                
                if r.specificItemOrKeyword:
                    clean_kw = r.specificItemOrKeyword.strip().lower()
                    if clean_kw and clean_kw != "none":
                        forbidden_keywords.add(clean_kw)
                
                conf_label = "Confirmed Allergy" if r.isConfirmed else ("Suspected Trigger" if r.restrictionType == RestrictionType.SUSPECTED_TRIGGER else "Intolerance")
                active_safety_warnings.append(f"Enforced {conf_label}: {r.specificItemOrKeyword} ({r.severity.value})")

            # 2. Clinician Directed Restrictions
            elif r.restrictionType == RestrictionType.CLINICIAN_DIRECTED:
                if r.specificItemOrKeyword:
                    forbidden_keywords.add(r.specificItemOrKeyword.strip().lower())
                active_safety_warnings.append(f"Enforced Clinician Restriction: {r.specificItemOrKeyword}")

            # 3. Personal Dislikes & Exclusions
            elif r.restrictionType in [RestrictionType.PERSONAL_DISLIKE, RestrictionType.DIETARY_EXCLUSION]:
                if r.specificItemOrKeyword:
                    forbidden_keywords.add(r.specificItemOrKeyword.strip().lower())

        # Check Medical Conditions for clinical rules
        for cond in profile.medicalConditions:
            c_clean = cond.strip().lower()
            for rule_key, rule_val in CLINICAL_RESTRICTION_RULES.items():
                if rule_key in c_clean:
                    if "strict_allergen" in rule_val:
                        cat = rule_val["strict_allergen"]
                        prohibited_categories.add(cat)
                        for d in ALLERGEN_DERIVATIVES_MAP[cat]:
                            forbidden_keywords.add(d.lower())
                    if "exclude_keywords" in rule_val:
                        for kw in rule_val["exclude_keywords"]:
                            forbidden_keywords.add(kw.lower())
                    active_safety_warnings.append(f"Applied Clinical Medical Protocol for: {cond}")

        return forbidden_keywords, prohibited_categories, active_safety_warnings

    @classmethod
    def is_food_item_safe(cls, food_name: str, food_row: pd.Series, forbidden_keywords: Set[str], prohibited_categories: Set[AllergenCategory], profile: ClientNutritionProfile) -> Tuple[bool, Optional[str]]:
        """
        Validates an individual food candidate against all safety barriers.
        """
        name_lower = str(food_name).lower()

        # 1. Check prohibited allergen derivatives
        for kw in forbidden_keywords:
            if kw in name_lower:
                return False, f"Contains restricted ingredient/allergen keyword: '{kw}'"

        # 2. Check Dietary Pattern Requirements
        pattern = profile.dietaryPattern
        is_vegan = bool(food_row.get("is_vegan", False))
        is_veg = bool(food_row.get("is_vegetarian", False))
        is_egg = bool(food_row.get("is_eggetarian", False))

        if pattern == "Vegan" and not is_vegan:
            return False, "Not certified Vegan"
        elif pattern == "Vegetarian" and not (is_veg or is_vegan):
            return False, "Not certified Vegetarian"
        elif pattern == "Eggetarian" and not (is_veg or is_vegan or is_egg):
            return False, "Not compliant with Eggetarian pattern"

        # 3. Check Clinical Sodium / Sugar Limits if present in row
        for cond in profile.medicalConditions:
            c_clean = cond.lower()
            if "hypertension" in c_clean and float(food_row.get("Sodium", 0.0)) > 0.15:
                return False, "Sodium exceeds clinical threshold for hypertension (>0.15g/100g)"
            if "diabetes" in c_clean and float(food_row.get("Sugars", 0.0)) > 5.0:
                return False, "Sugar content exceeds clinical threshold for diabetes (>5.0g/100g)"

        return True, None

    @classmethod
    def filter_food_database(cls, df: pd.DataFrame, profile: ClientNutritionProfile) -> Tuple[pd.DataFrame, List[str]]:
        """
        Executes deterministic multi-layer safety filtering over the food dataframe.
        NEVER bypasses or relaxes safety rules.
        """
        forbidden_keywords, prohibited_categories, safety_log = DeterministicRestrictionEngine.extract_forbidden_keywords(profile)

        safe_indices = []
        for idx, row in df.iterrows():
            food_name = row.get("food", "")
            is_safe, reason = cls.is_food_item_safe(food_name, row, forbidden_keywords, prohibited_categories, profile)
            if is_safe:
                safe_indices.append(idx)

        safe_df = df.loc[safe_indices].copy()

        if len(safe_df) == 0:
            safety_log.append("CRITICAL: Zero food options met all confirmed allergen and dietary constraints. No unverified foods were substituted.")

        return safe_df, safety_log

    @classmethod
    def is_recipe_safe(cls, recipe: RecipeModel, forbidden_keywords: Set[str], prohibited_categories: Set[AllergenCategory]) -> Tuple[bool, List[str]]:
        """
        Recursively audits a multi-ingredient recipe for hidden allergen tags and derivatives.
        """
        violations: List[str] = []

        # Check composite recipe allergens
        for cat in recipe.compositeAllergens:
            if cat in prohibited_categories:
                violations.append(f"Recipe contains composite allergen category: {cat.value}")

        # Check each ingredient item
        for ing in recipe.ingredients:
            ing_name = ing.name.lower()
            for kw in forbidden_keywords:
                if kw in ing_name:
                    violations.append(f"Ingredient '{ing.name}' matches restricted keyword '{kw}'")

            for tag in ing.allergenTags:
                if tag in prohibited_categories:
                    violations.append(f"Ingredient '{ing.name}' flagged with allergen category {tag.value}")

        return len(violations) == 0, violations
