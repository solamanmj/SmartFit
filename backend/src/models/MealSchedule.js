import mongoose from 'mongoose';

const mealScheduleSlotSchema = new mongoose.Schema({
  slotId: { type: String, required: true }, // 'breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'
  slotName: { type: String, required: true },
  scheduledTime: { type: String, default: '08:00' },
  mealId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  servingSize: { type: String, default: '1 serving' },
  prescribedCalories: { type: Number, required: true },
  prescribedProtein: { type: Number, required: true },
  prescribedCarbs: { type: Number, required: true },
  prescribedFat: { type: Number, required: true },
  prescribedFiber: { type: Number, default: 5 },
  ingredients: [{ type: mongoose.Schema.Types.Mixed }],
  preparationInstructions: { type: String, default: '' },
  allowedSubstitutions: [{ type: String }],
  
  // Client Consumption Tracking (Phase 6)
  consumptionStatus: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'PARTIALLY_EATEN', 'SKIPPED', 'SUBSTITUTED'], 
    default: 'PENDING' 
  },
  actualPortionEatenPct: { type: Number, default: 0 }, // 0 - 100%
  actualCaloriesConsumed: { type: Number, default: 0 },
  actualProteinConsumed: { type: Number, default: 0 },
  actualCarbsConsumed: { type: Number, default: 0 },
  actualFatConsumed: { type: Number, default: 0 },
  substitutedWith: { type: String, default: null },
  clientFeedbackNotes: { type: String, default: '' },
  loggedAt: { type: Date, default: null }
}, { _id: false });

const mealScheduleSchema = new mongoose.Schema({
  scheduleId: { type: String, required: true, unique: true, index: true },
  userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  userName: { type: String, default: '' },
  nutritionistEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  nutritionistName: { type: String, default: '' },
  date: { type: String, required: true, index: true }, // Format YYYY-MM-DD
  prescriptionId: { type: String, required: true },
  prescriptionVersion: { type: Number, default: 1 },
  algorithmVersion: { type: String, default: 'DETERMINISTIC_CONSTRAINT_V2' },
  generationTime: { type: Date, default: Date.now },
  validationResult: {
    isFullyCompliant: { type: Boolean, default: true },
    safetyChecksPassed: { type: Boolean, default: true },
    macroVariancePct: { type: Number, default: 0 },
    prohibitedIngredientsDetected: [{ type: String }],
    validationMessages: [{ type: String }]
  },
  targetTotals: {
    calories: { type: Number, default: 2200 },
    protein: { type: Number, default: 140 },
    carbs: { type: Number, default: 220 },
    fat: { type: Number, default: 60 },
    fiber: { type: Number, default: 30 }
  },
  scheduledTotals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 }
  },
  reportedTotals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    adherenceRatePct: { type: Number, default: 0 }
  },
  slots: [mealScheduleSlotSchema],
  status: { type: String, enum: ['DRAFT_PREVIEW', 'PUBLISHED', 'COMPLETED', 'ARCHIVED'], default: 'PUBLISHED' },
  isStable: { type: Boolean, default: true } // Preserves generated schedule on refresh
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

mealScheduleSchema.index({ userEmail: 1, date: 1 }, { unique: true });

const MealSchedule = mongoose.model('MealSchedule', mealScheduleSchema);
export default MealSchedule;
