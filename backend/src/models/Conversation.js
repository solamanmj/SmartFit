import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  clientEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  clientName: { type: String, default: '' },
  specialistEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  specialistName: { type: String, default: '' },
  specialistRole: { type: String, enum: ['NUTRITIONIST', 'TRAINER'], default: 'NUTRITIONIST' },
  lastMessageText: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now },
  lastSenderRole: { type: String, default: '' },
  unreadCountForSpecialist: { type: Number, default: 0 },
  unreadCountForClient: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
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

conversationSchema.index({ clientEmail: 1, specialistEmail: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
