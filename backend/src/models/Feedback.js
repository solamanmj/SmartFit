import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedbackCategory: { type: String, required: true },
  recommendationType: { type: String, default: 'WORKOUT' },
  comments: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString().replace('T', ' ').substring(0, 16) }
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

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
