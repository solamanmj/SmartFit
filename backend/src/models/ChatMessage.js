import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  clientEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  specialistEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  specialistRole: { type: String, default: 'NUTRITIONIST' },
  senderEmail: { type: String, required: true, lowercase: true, trim: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['USER', 'NUTRITIONIST', 'TRAINER', 'ADMIN'], required: true },
  recipientEmail: { type: String, required: true, lowercase: true, trim: true },
  recipientName: { type: String, required: true },
  recipientRole: { type: String, enum: ['USER', 'NUTRITIONIST', 'TRAINER', 'ADMIN'], required: true },
  text: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  deliveryStatus: { type: String, enum: ['SENT', 'DELIVERED', 'READ'], default: 'SENT' },
  clientMutationId: { type: String, default: null } // Idempotency key to prevent duplicates
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

chatMessageSchema.index({ clientEmail: 1, specialistEmail: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
