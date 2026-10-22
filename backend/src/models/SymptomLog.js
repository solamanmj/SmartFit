import mongoose from 'mongoose';

const symptomLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  userName: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().substring(0, 10) },
  timestamp: { type: String, default: () => new Date().toISOString() },
  loggedMealTitle: { type: String, default: 'Logged Meal' },
  foodTrigger: { type: String, default: '' },
  consumedIngredients: [{ type: String }],
  suspectedTriggers: [{ type: String }],
  symptomType: { type: String, default: 'SKIN_FLARE' },
  symptomCategory: { type: String, default: 'SKIN_ECZEMA' },
  severityRating: { type: Number, min: 1, max: 5, default: 3 },
  severity: { type: Number, min: 1, max: 5, default: 3 },
  onsetLatencyMins: { type: Number, default: 45 },
  mealId: { type: String, default: '' },
  symptomNotes: { type: String, default: '' },
  notes: { type: String, default: '' },
  requiresClinicalReview: { type: Boolean, default: true },
  reviewedBySpecialist: { type: Boolean, default: false },
  reviewedByNutritionist: { type: Boolean, default: false },
  specialistComments: { type: String, default: '' },
  nutritionistNotes: { type: String, default: '' },
  specialistEmail: { type: String, default: '' },
  reviewedAt: { type: String, default: null }
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

const SymptomLog = mongoose.models.SymptomLog || mongoose.model('SymptomLog', symptomLogSchema);
export default SymptomLog;
