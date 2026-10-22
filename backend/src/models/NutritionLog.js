import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  date: { type: String, required: true, default: () => new Date().toISOString().substring(0, 10) }, // YYYY-MM-DD
  mealsCompleted: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    snack: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false }
  },
  caloriesConsumed: { type: Number, default: 0 },
  targetCalories: { type: Number, default: 2200 },
  proteinGrams: { type: Number, default: 0 },
  targetProteinGrams: { type: Number, default: 140 },
  carbGrams: { type: Number, default: 0 },
  targetCarbGrams: { type: Number, default: 220 },
  fatGrams: { type: Number, default: 0 },
  targetFatGrams: { type: Number, default: 60 },
  waterLiters: { type: Number, default: 0 },
  targetWaterLiters: { type: Number, default: 3.0 },
  notes: { type: String, default: '' },
  adherenceRate: { type: Number, default: 0 } // Percentage
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);
export default NutritionLog;
