import mongoose from 'mongoose';

const technologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Technology name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Frontend',
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI', 'Design', 'Cloud', 'Other'],
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Technology = mongoose.model('Technology', technologySchema);

export default Technology;
