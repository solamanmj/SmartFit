import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  userName: { type: String, default: '' },
  trainerEmail: { type: String, required: true, index: true },
  trainerName: { type: String, default: '' },
  planTitle: { type: String, required: true },
  category: { type: String, default: 'Full Body' },
  difficulty: { type: String, default: 'Intermediate' },
  targetGoal: { type: String, default: 'Muscle Building' },
  durationWeeks: { type: Number, default: 4 },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'PUBLISHED' },
  publishedAt: { type: String, default: () => new Date().toISOString().replace('T', ' ').substring(0, 19) },
  exercises: [
    {
      id: { type: String },
      name: { type: String, required: true },
      sets: { type: Number, default: 3 },
      reps: { type: String, default: '10-12 Reps' },
      targetMuscle: { type: String, default: '' },
      equipmentNeeded: { type: String, default: 'Full Gym Access' },
      instructions: { type: String, default: '' },
      estimatedCaloriesBurned: { type: Number, default: 100 }
    }
  ]
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

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export default WorkoutPlan;
