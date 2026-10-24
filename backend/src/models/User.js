import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Mixed },
  id: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number, default: 26 },
  gender: { type: String, default: 'Male' },
  height: { type: Number, default: 178 }, // in cm
  weight: { type: Number, default: 75 }, // in kg
  activityLevel: { type: String, default: 'Moderately Active' },
  fitnessGoal: { type: String, default: 'Muscle Building' },
  dietaryPreference: { type: String, default: 'Standard Balanced' },
  workoutEquipment: { type: String, default: 'Full Gym Access' },
  medicalConditions: { type: String, default: 'None' },
  allergies: { type: [String], default: [] }, // Confirmed allergies
  intolerances: { type: [String], default: [] }, // Confirmed intolerances (e.g., Lactose)
  dislikedFoods: { type: [String], default: [] }, // Disliked foods
  culturalRestrictions: { type: [String], default: [] }, // Cultural/Religious dietary rules
  clinicianAdvisedRestrictions: { type: [String], default: [] }, // Physician/Clinician warnings
  verifiedFoodWarnings: { type: [String], default: [] },
  foodBudget: { type: String, default: 'Standard' }, // Low / Standard / Premium
  cookingFacilities: { type: String, default: 'Full Kitchen' }, // None / Microwave Only / Full Kitchen
  foodAvailability: { type: String, default: 'Urban Fresh Supermarket' },
  scheduleConstraints: { type: String, default: 'Normal 9-5 work hours' },
  role: { type: String, default: 'USER', uppercase: true },
  assignedTrainer: {
    email: { type: String, default: null },
    name: { type: String, default: null },
    specialization: { type: String, default: null }
  },
  assignedNutritionist: {
    email: { type: String, default: null },
    name: { type: String, default: null },
    qualification: { type: String, default: null }
  },
  plainPasswordFallback: { type: String, default: null },
  mustChangePassword: { type: Boolean, default: false },
  hasChangedDefaultPassword: { type: Boolean, default: false },
  isFirstLogin: { type: Boolean, default: true },
  passwordLastChangedAt: { type: String, default: null },
  isLoggedIn: { type: Boolean, default: false },
  lastLoginTime: { type: String, default: null },
  streakDays: { type: Number, default: 1 },
  points: { type: Number, default: 250 },
  bmi: { type: Number, default: 23.7 },
  bmr: { type: Number, default: 1740 },
  tdee: { type: Number, default: 2697 },
  targetCalories: { type: Number, default: 3047 },
  fitnessScore: { type: Number, default: 78 },
  bmiCategory: { type: String, default: 'Normal Weight' },
  completedWorkoutDays: { type: [Number], default: [] },
  activeWorkoutDay: { type: Number, default: 1 },
  completedNutritionDays: { type: [Number], default: [] },
  activeNutritionDay: { type: Number, default: 1 },
  workoutDaysCount: { type: Number, default: 0 },
  workoutTenDayCompleted: { type: Boolean, default: false },
  milestones: [{
    id: { type: String },
    title: { type: String },
    achievedAt: { type: String },
    daysCount: { type: Number }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : (ret.id || (doc && (doc.id || (doc._id ? doc._id.toString() : ''))) || '');
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : (ret.id || (doc && (doc.id || (doc._id ? doc._id.toString() : ''))) || '');
      delete ret.__v;
      return ret;
    }
  }
});

export function calculateUserMetrics(user) {
  const height = user.height > 0 ? user.height : 178;
  const weight = user.weight > 0 ? user.weight : 75;
  const age = user.age > 0 ? user.age : 26;
  const heightM = height / 100.0;

  // BMI
  const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
  let bmiCategory = 'Normal Weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi <= 24.9) bmiCategory = 'Normal Weight';
  else if (bmi <= 29.9) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  // BMR (Mifflin-St Jeor)
  const isFemale = (user.gender || '').toLowerCase() === 'female';
  const baseBmr = (10 * weight) + (6.25 * height) - (5 * age);
  const bmr = Math.round(isFemale ? baseBmr - 161 : baseBmr + 5);

  // TDEE Activity multiplier
  let actMult = 1.55;
  const act = (user.activityLevel || '').toLowerCase();
  if (act.includes('sedentary')) actMult = 1.2;
  else if (act.includes('light')) actMult = 1.375;
  else if (act.includes('moderate')) actMult = 1.55;
  else if (act.includes('very')) actMult = 1.725;
  else if (act.includes('extra') || act.includes('extreme')) actMult = 1.9;

  const tdee = Math.round(bmr * actMult);

  // Target Calories
  let targetCalories = tdee;
  const goal = (user.fitnessGoal || '').toLowerCase();
  if (goal.includes('loss') || goal.includes('fat')) targetCalories = tdee - 500;
  else if (goal.includes('muscle') || goal.includes('hypertrophy') || goal.includes('gain') || goal.includes('building')) targetCalories = tdee + 350;

  // Fitness score (0 - 100)
  const bmiScore = (bmi >= 18.5 && bmi <= 24.9) ? 30 : Math.max(10, Math.round(30 - Math.abs(bmi - 21.7) * 2.5));
  let actScore = 20;
  if (actMult >= 1.725) actScore = 25;
  else if (actMult >= 1.55) actScore = 20;
  else if (actMult >= 1.375) actScore = 15;
  else actScore = 10;

  const streakBonus = Math.min(25, Math.round((user.streakDays || 1) * 1.5));
  const med = (user.medicalConditions || '').toLowerCase();
  const healthRiskScore = (!med || med === 'none' || med.trim() === '') ? 20 : 15;

  const fitnessScore = Math.min(100, Math.round(bmiScore + actScore + streakBonus + healthRiskScore));

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    fitnessScore
  };
}

userSchema.pre('save', function(next) {
  const metrics = calculateUserMetrics(this);
  this.bmi = metrics.bmi;
  this.bmiCategory = metrics.bmiCategory;
  this.bmr = metrics.bmr;
  this.tdee = metrics.tdee;
  this.targetCalories = metrics.targetCalories;
  this.fitnessScore = metrics.fitnessScore;
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
