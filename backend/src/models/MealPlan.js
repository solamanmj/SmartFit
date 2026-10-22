import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  slotType: { 
    type: String, 
    enum: ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'EVENING_SNACK', 'DINNER', 'SNACK'],
    default: 'BREAKFAST'
  },
  mealType: { type: String, default: 'Breakfast' },
  mealTime: { type: String, default: '08:00' },
  description: { type: String, default: '' },
  servingSize: { type: String, default: '1 serving' },
  portionGrams: { type: Number, default: 150 },
  calories: { type: Number, required: true, default: 400 },
  protein: { type: Number, required: true, default: 25 },
  carbs: { type: Number, required: true, default: 45 },
  fat: { type: Number, required: true, default: 12 },
  fiber: { type: Number, default: 5 },
  micronutrients: {
    calciumMg: { type: Number, default: 0 },
    ironMg: { type: Number, default: 0 },
    potassiumMg: { type: Number, default: 0 },
    vitaminDMcg: { type: Number, default: 0 },
    vitaminB12Mcg: { type: Number, default: 0 }
  },
  allergens: [{ type: String }],
  ingredients: [{ type: mongoose.Schema.Types.Mixed }],
  preparationInstructions: { type: String, default: '' },
  allowedSubstitutions: [{ type: String }],
  verifiedSafeSubstitutions: [{ type: String }],
  isApprovedForClient: { type: Boolean, default: true },
  maxWeeklyFrequency: { type: Number, default: 7 }
}, { _id: false });

const prescriptionVersionSchema = new mongoose.Schema({
  version: { type: Number, required: true },
  createdByEmail: { type: String, required: true },
  approvedByEmail: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date, default: null },
  revisionReason: { type: String, default: 'Initial prescription formulation' },
  planTitle: { type: String, required: true },
  targetCalories: { type: Number, required: true },
  targetProtein: { type: Number, required: true },
  targetCarbs: { type: Number, required: true },
  targetFat: { type: Number, required: true },
  status: { type: String, required: true },
  mealsCount: { type: Number, default: 0 }
}, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  userName: { type: String, default: '' },
  nutritionistEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  nutritionistName: { type: String, default: '' },
  planTitle: { type: String, required: true },
  dietaryPreference: { type: String, default: 'Standard Balanced' },
  
  // Date Range (Phase 4)
  startDate: { type: String, default: () => new Date().toISOString().substring(0, 10) },
  endDate: { type: String, default: () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().substring(0, 10);
  }},

  // Targets and Tolerances
  targetCalories: { type: Number, default: 2200 },
  proteinGrams: { type: Number, default: 140 },
  carbGrams: { type: Number, default: 220 },
  fatGrams: { type: Number, default: 60 },
  fiberGrams: { type: Number, default: 30 },
  hydrationLiters: { type: Number, default: 3.5 },
  calorieTolerancePct: { type: Number, default: 5 }, // ±5% acceptable variance
  macroTolerancePct: { type: Number, default: 10 },

  notes: { type: String, default: '' },
  clientInstructions: { type: String, default: '' },
  
  // Status lifecycle: DRAFT -> VALIDATED -> APPROVED -> PUBLISHED -> REVISED -> ARCHIVED
  status: { 
    type: String, 
    enum: ['DRAFT', 'VALIDATED', 'NEEDS_REVIEW', 'APPROVED', 'PUBLISHED', 'REVISED', 'ARCHIVED'], 
    default: 'DRAFT' 
  },
  currentVersion: { type: Number, default: 1 },
  approvedByEmail: { type: String, default: null },
  approvedAt: { type: String, default: null },
  publishedAt: { type: String, default: null },
  
  // Audit and Version History
  versionHistory: [prescriptionVersionSchema],
  
  // Approved Candidate Meals Pool for rotation
  approvedCandidateMeals: [mealItemSchema],
  
  // Configured default daily meal template
  meals: [mealItemSchema],
  
  allergiesAudited: [{ type: String }],
  safetyLog: [{ type: String }],
  validationWarnings: [{ type: String }],
  adequacyAudit: {
    overallAdequacyScore: { type: String, default: '96%' },
    isNutritionallyAdequate: { type: Boolean, default: true },
    identifiedGaps: [{ type: mongoose.Schema.Types.Mixed }],
    verifiedFoodRemedies: [{ type: mongoose.Schema.Types.Mixed }]
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret.__v;
      return ret;
    }
  }
});

mealPlanSchema.index({ userEmail: 1, status: 1 });

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlan;
