import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  workoutTitle: { type: String, required: true },
  date: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  xpEarned: { type: Number, required: true },
  completedExercises: [{ type: String }]
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

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;
