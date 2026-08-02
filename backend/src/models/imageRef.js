import mongoose from 'mongoose';

export const imageRefSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

export const imageRefField = { type: imageRefSchema, default: () => ({}) };

export default imageRefSchema;
