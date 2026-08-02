import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { cloudinaryService } from '../src/services/cloudinary.service.js';

dotenv.config();

const toRef = (value) => {
  if (!value) return null;
  if (typeof value === 'object') {
    return { url: value.url || '', publicId: value.publicId || '' };
  }
  if (typeof value === 'string') {
    if (!value.trim()) return null;
    return { url: value, publicId: cloudinaryService.extractPublicId(value) || '' };
  }
  return null;
};

const shouldMigrate = (value) => typeof value === 'string' || value == null;

const models = [
  {
    name: 'Project',
    get: () => import('../src/models/Project.js').then((m) => m.default),
    fields: ['cover'],
    arrayFields: ['gallery'],
  },
  {
    name: 'Blog',
    get: () => import('../src/models/Blog.js').then((m) => m.default),
    fields: ['thumbnail', 'banner'],
  },
  {
    name: 'Service',
    get: () => import('../src/models/Service.js').then((m) => m.default),
    fields: ['image'],
  },
  {
    name: 'Testimonial',
    get: () => import('../src/models/Testimonial.js').then((m) => m.default),
    fields: ['avatar'],
  },
  {
    name: 'User',
    get: () => import('../src/models/User.js').then((m) => m.default),
    fields: ['avatar'],
  },
];

const migrateCollection = async ({ name, get, fields, arrayFields = [] }) => {
  const Model = await get();
  const docs = await Model.find().lean();
  let migrated = 0;
  for (const doc of docs) {
    const updates = {};
    let changed = false;
    for (const field of fields) {
      if (shouldMigrate(doc[field])) {
        updates[field] = toRef(doc[field]);
        changed = true;
      }
    }
    for (const field of arrayFields) {
      if (Array.isArray(doc[field]) && doc[field].some((item) => typeof item === 'string')) {
        updates[field] = doc[field].map((item) => toRef(item)).filter(Boolean);
        changed = true;
      }
    }
    if (changed) {
      await Model.updateOne({ _id: doc._id }, { $set: updates });
      migrated += 1;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`${name}: ${migrated}/${docs.length} documents migrated`);
};

const migrateSettings = async () => {
  const SiteSetting = (await import('../src/models/SiteSetting.js')).default;
  const imageKeys = ['logo', 'favicon', 'heroImage'];
  const docs = await SiteSetting.find({ key: { $in: imageKeys } }).lean();
  let migrated = 0;
  for (const doc of docs) {
    if (typeof doc.value !== 'string') continue;
    await SiteSetting.updateOne({ _id: doc._id }, { $set: { value: toRef(doc.value) } });
    migrated += 1;
  }
  // eslint-disable-next-line no-console
  console.log(`SiteSetting (image keys): ${migrated}/${docs.length} documents migrated`);
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    for (const item of models) {
      await migrateCollection(item);
    }
    await migrateSettings();
    // eslint-disable-next-line no-console
    console.log('Migration complete');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

run();
