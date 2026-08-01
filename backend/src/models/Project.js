import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
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
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    client: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    duration: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
      },
    ],
    features: [String],
    gallery: [String],
    cover: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: String, default: '' },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.index({ title: 'text', description: 'text', client: 'text' });

const Project = mongoose.model('Project', projectSchema);

export default Project;
