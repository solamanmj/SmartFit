"""
SmartFit Nutrition & Allergen Domain Models
Provides strict Pydantic data structures for:
- Confirmed Allergies vs Suspected Triggers
- Intolerances & Clinician-Advised Restrictions
- Client Dietary Profile & Macro Targets
- Food Items & Multi-Ingredient Recipes
- Symptom Logging & Clinical Review Status
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class RestrictionType(str, Enum):
    CONFIRMED_ALLERGY = "CONFIRMED_ALLERGY"         # Verified IgE or medical diagnosis
    SUSPECTED_TRIGGER = "SUSPECTED_TRIGGER"         # Client-observed flare, pending clinical test
    INTOLERANCE = "INTOLERANCE"                     # Non-IgE enzymatic (e.g. Lactose, Fructose)
    CLINICIAN_DIRECTED = "CLINICIAN_DIRECTED"       # Medical diet (e.g. Renal low-potassium, Cardiac low-sodium)
    PERSONAL_DISLIKE = "PERSONAL_DISLIKE"           # Taste or sensory preference
    DIETARY_EXCLUSION = "DIETARY_EXCLUSION"         # Lifestyle/Ethical (Vegetarian, Vegan, Halal, Kosher)


class AllergenCategory(str, Enum):
    PEANUT = "PEANUT"
    TREE_NUT = "TREE_NUT"
    MILK_DAIRY = "MILK_DAIRY"
    EGG = "EGG"
    WHEAT_GLUTEN = "WHEAT_GLUTEN"
    SOY = "SOY"
    FISH = "FISH"
    SHELLFISH_CRUSTACEAN = "SHELLFISH_CRUSTACEAN"
    SESAME = "SESAME"
    MUSTARD = "MUSTARD"
    CELERY = "CELERY"
    SULFITES = "SULFITES"
    OTHER = "OTHER"


class AllergySeverity(str, Enum):
    SEVERE_ANAPHYLACTIC = "SEVERE_ANAPHYLACTIC"
    MODERATE = "MODERATE"
    MILD = "MILD"
    UNKNOWN = "UNKNOWN"


class DocumentationSource(str, Enum):
    CLINICIAN_DIAGNOSED = "CLINICIAN_DIAGNOSED"
    LAB_CONFIRMED = "LAB_CONFIRMED"
    SELF_REPORTED = "SELF_REPORTED"


class DietaryPattern(str, Enum):
    VEGETARIAN = "Vegetarian"
    VEGAN = "Vegan"
    EGGETARIAN = "Eggetarian"
    PESCATARIAN = "Pescatarian"
    NON_VEGETARIAN = "Non-Vegetarian"
    STANDARD_BALANCED = "Standard Balanced"


class FitnessGoal(str, Enum):
    MUSCLE_BUILDING = "Muscle Building"
    FAT_LOSS = "Fat Loss"
    MAINTENANCE = "Maintenance"
    BODY_RECOMPOSITION = "Body Recomposition"


class FoodRestrictionItem(BaseModel):
    restrictionId: str = Field(..., description="Unique identifier for the restriction")
    restrictionType: RestrictionType
    allergenCategory: Optional[AllergenCategory] = AllergenCategory.OTHER
    specificItemOrKeyword: str = Field(..., description="Target ingredient or keyword to exclude")
    severity: AllergySeverity = AllergySeverity.UNKNOWN
    documentedBy: DocumentationSource = DocumentationSource.SELF_REPORTED
    isConfirmed: bool = False
    crossContactSensitive: bool = False
    notes: Optional[str] = None


class ClientNutritionProfile(BaseModel):
    userId: str
    age: float = Field(..., ge=12, le=100)
    gender: str = Field("Male")
    weightKg: float = Field(..., ge=30, le=300)
    heightCm: float = Field(..., ge=100, le=250)
    activityLevel: str = Field("Moderately Active")
    fitnessGoal: FitnessGoal = FitnessGoal.MAINTENANCE
    dietaryPattern: DietaryPattern = DietaryPattern.STANDARD_BALANCED
    
    # Stratified Restrictions
    restrictions: List[FoodRestrictionItem] = Field(default_factory=list)
    
    # Lifestyle Preferences
    preferredCuisines: List[str] = Field(default_factory=lambda: ["Mediterranean", "Asian", "Indian", "Continental"])
    budgetTier: str = Field("Standard", description="Budget | Standard | Premium")
    mealsPerDay: int = Field(4, ge=2, le=6)
    mealScheduleHours: List[str] = Field(default_factory=lambda: ["08:00", "13:00", "16:30", "20:00"])
    
    # Medical Context (Handled with strict safety boundaries)
    medicalConditions: List[str] = Field(default_factory=list)
    specialistAssignedEmail: Optional[str] = None


class IngredientItem(BaseModel):
    foodId: str
    name: str
    quantityGrams: float
    allergenTags: List[AllergenCategory] = Field(default_factory=list)
    isMandatory: bool = True
    verifiedSafeSubstitutions: List[str] = Field(default_factory=list)


class RecipeModel(BaseModel):
    recipeId: str
    title: str
    mealType: str # BREAKFAST | LUNCH | DINNER | SNACK
    ingredients: List[IngredientItem]
    totalCalories: float
    totalProtein: float
    totalCarbs: float
    totalFat: float
    totalFiber: float
    sodiumG: float = 0.0
    compositeAllergens: List[AllergenCategory] = Field(default_factory=list)
    isVegetarian: bool = False
    isVegan: bool = False
    preparationInstructions: Optional[str] = None
    verificationStatus: str = Field("VERIFIED", description="VERIFIED | UNVERIFIED | PENDING_REVIEW")


class SymptomLogEntry(BaseModel):
    logId: str
    userId: str
    timestamp: str
    loggedMealTitle: str
    consumedIngredients: List[str]
    symptomType: str = Field(..., description="SKIN_FLARE | DIGESTIVE_DISTRESS | RESPIRATORY | HEADACHE | OTHER")
    severityRating: int = Field(..., ge=1, le=5)
    symptomNotes: Optional[str] = None
    suspectedTriggers: List[str] = Field(default_factory=list)
    requiresClinicalReview: bool = True
    reviewedBySpecialist: bool = False
    specialistComments: Optional[str] = None
