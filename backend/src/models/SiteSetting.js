import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    group: {
      type: String,
      default: 'general',
      enum: ['general', 'branding', 'contact', 'social', 'seo', 'hero', 'home', 'footer', 'email'],
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: '',
    },
    type: {
      type: String,
      enum: ['text', 'textarea', 'richtext', 'number', 'boolean', 'image', 'array', 'json'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
);

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);

export default SiteSetting;
