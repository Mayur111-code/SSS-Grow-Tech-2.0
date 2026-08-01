import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      maxlength: [1000, 'Testimonial cannot exceed 1000 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
