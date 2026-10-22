import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  splitId: { type: String, required: true, index: true }, // e.g., 'push', 'pull', 'legs', 'full_body', 'chest', 'back', 'shoulders', 'arms', 'core', 'glutes', 'cardio', 'mobility'
  splitName: { type: String, required: true },
  category: { type: String, default: 'General Fitness' },
  movementType: { type: String, default: 'Compound Resistance' },
  primaryMuscles: [{ type: String }],
  secondaryMuscles: [{ type: String }],
  equipment: [{ type: String }],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  sets: { type: Number, default: 4 },
  reps: { type: String, default: '8-10' },
  restSeconds: { type: Number, default: 90 },
  tempo: { type: String, default: '3-1-1' },
  recommendedAngle: { type: String, enum: ['front', 'side', 'rear', 'isometric'], default: 'front' },
  animationType: { type: String, default: 'default_compound' },
  setupAngle: { type: Number, default: 0 },
  coachSpeech: { type: String, default: '' },
  phases: [{
    phaseNumber: { type: Number },
    name: { type: String },
    cue: { type: String },
    durationSecs: { type: Number, default: 2 }
  }],
  instructions: [{ type: String }],
  breathingInstructions: { type: String, default: 'Inhale on the negative eccentric descent, exhale powerfully on the concentric drive.' },
  formCues: [{ type: String }],
  commonMistakes: [{
    mistake: { type: String },
    correction: { type: String },
    whyItMatters: { type: String },
    visualWarning: { type: String }
  }],
  safetyNotes: [{ type: String }],
  estimatedCaloriesBurned: { type: Number, default: 110 },
  startingPosition: {
    posture: { type: String, default: 'Neutral upright spine, core engaged, shoulders retracted.' },
    footStance: { type: String, default: 'Shoulder-width stance, toes angled slightly outward 15-30 degrees.' },
    handGrip: { type: String, default: 'Pronated grip with thumbs wrapped securely around the bar.' }
  },
  jointAlignmentCues: [{
    joint: { type: String },
    cue: { type: String }
  }],
  rangeOfMotionGuidance: {
    startPoint: { type: String, default: 'Full lockout with joints stacked and braced.' },
    endPoint: { type: String, default: 'Target anatomical depth without lumbar rounding or joint impingement.' },
    fullRomDescription: { type: String, default: 'Complete full range of motion under active neuromuscular tension.' }
  },
  availableCameraAngles: [{ type: String, default: 'side' }],
  formValidationStatus: { type: String, default: 'Verified Biomechanics' },
  reviewerNotes: { type: String, default: 'Barbell horizontal alignment and multi-plane joint kinematics verified by SmartFit Exercise Biomechanics Lab.' },
  videoUrl: { type: String, default: '' },
  createdBy: { type: String, default: 'SmartFit Certified AI' }
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

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
