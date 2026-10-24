import mongoose from 'mongoose';

const exerciseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workoutType: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  difficulty: { type: String, required: true },
  equipmentNeeded: { type: String, required: true },
  durationMinutes: { type: Number, default: 15 },
  estimatedCaloriesBurned: { type: Number, default: 120 },
  instructions: { type: String, default: '' }
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

const ExerciseItem = mongoose.model('ExerciseItem', exerciseItemSchema);
export default ExerciseItem;
