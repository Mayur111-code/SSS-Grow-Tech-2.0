import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: [true, 'Career is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    coverLetter: {
      type: String,
      default: '',
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
    },
    resume: {
      type: String,
      default: '',
    },
    resumePublicId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, career: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
