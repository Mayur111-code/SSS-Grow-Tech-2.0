import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'remote'],
      default: 'full-time',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    experience: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    applicationDeadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

careerSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'career',
  count: true,
});

careerSchema.index({ title: 'text', description: 'text', department: 'text' });

const Career = mongoose.model('Career', careerSchema);

export default Career;
