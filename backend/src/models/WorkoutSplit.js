import mongoose from 'mongoose';

const dailyScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true }, // 'Monday', 'Tuesday', ...
  isRestDay: { type: Boolean, default: false },
  focus: { type: String, required: true }, // e.g. 'Chest, Shoulders & Triceps (Push)'
  targetMuscleGroups: { type: String, default: '' },
  intensity: { type: String, default: 'Moderate' }, // 'High', 'Moderate', 'Deload', 'Rest'
  targetDurationMinutes: { type: Number, default: 60 },
  cardioGuidance: { type: String, default: '' }, // e.g. '15 min incline treadmill walk'
  coachNotes: { type: String, default: '' } // Specific daily cues
}, { _id: false });

const workoutSplitSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  userName: { type: String, default: '' },
  trainerEmail: { type: String, required: true, index: true },
  trainerName: { type: String, default: '' },
  splitTitle: { type: String, required: true }, // e.g. 'Personalized Hypertrophy Push-Pull-Legs Split'
  splitType: { type: String, default: 'Push / Pull / Legs (PPL)' },
  daysPerWeek: { type: Number, default: 5 },
  durationWeeks: { type: Number, default: 4 },
  difficulty: { type: String, default: 'Intermediate' },
  targetGoal: { type: String, default: 'Hypertrophy & Muscle Gain' },
  progressiveOverloadStrategy: { type: String, default: 'Increase load by 2.5kg or +1 rep each consecutive week when RPE < 8' },
  recoveryProtocols: { type: String, default: 'Ensure 8 hours of sleep, 10 min dynamic mobility post-session' },
  coachGuidelines: { type: String, default: '' },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ACTIVE'], default: 'PUBLISHED' },
  prescribedAt: { type: String, default: () => new Date().toISOString().replace('T', ' ').substring(0, 19) },
  schedule: [dailyScheduleSchema]
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

const WorkoutSplit = mongoose.model('WorkoutSplit', workoutSplitSchema);
export default WorkoutSplit;
