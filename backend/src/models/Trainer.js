import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, default: 5 },
  assignedClientsCount: { type: Number, default: 10 },
  status: { type: String, default: 'ACTIVE' },
  
  // Certification & Evidence Evaluation Fields
  certificationName: { type: String, default: 'NASM Certified Personal Trainer (NASM-CPT)' },
  issuingAuthority: { type: String, default: 'National Academy of Sports Medicine' },
  certificateLicenseNo: { type: String, default: 'NASM-CPT-8492019' },
  issueDate: { type: String, default: '2023-01-15' },
  expiryDate: { type: String, default: '2027-01-15' },
  certificateUrl: { type: String, default: '' },
  verificationStatus: { type: String, enum: ['VERIFIED', 'PENDING_REVIEW', 'REVOKED', 'UNVERIFIED'], default: 'VERIFIED' },
  authenticityScore: { type: Number, default: 98 },
  evidenceReport: {
    accreditationCheck: { type: Boolean, default: true },
    registryMatch: { type: Boolean, default: true },
    cprAedClearance: { type: Boolean, default: true },
    licenseFormatValid: { type: Boolean, default: true },
    verificationNotes: { type: String, default: 'Accreditation certified through official fitness registry.' }
  },

  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
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

const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;
