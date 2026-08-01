import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    type: {
      type: String,
      enum: ['contact', 'quote'],
      default: 'contact',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'resolved', 'closed'],
      default: 'pending',
    },
    reply: {
      type: String,
      default: '',
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ user: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
