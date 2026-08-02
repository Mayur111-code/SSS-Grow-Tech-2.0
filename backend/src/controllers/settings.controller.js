import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import SiteSetting from '../models/SiteSetting.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

const IMAGE_SETTING_KEYS = new Set(['logo', 'favicon', 'heroImage']);

const toImageRef = (value) => {
  if (!value) return null;
  if (typeof value === 'object') {
    const url = value.url || '';
    const publicId = value.publicId || '';
    if (url && url.includes('cloudinary.com') && !publicId) {
      return { url, publicId: cloudinaryService.extractPublicId(url) || '' };
    }
    return { url, publicId };
  }
  if (typeof value === 'string') {
    if (value.includes('cloudinary.com')) {
      return { url: value, publicId: cloudinaryService.extractPublicId(value) || '' };
    }
    return null;
  }
  return null;
};

const DEFAULT_SETTINGS = [
  { key: 'siteName', group: 'general', label: 'Site Name', value: 'SSS Grow Tech', type: 'text' },
  { key: 'tagline', group: 'general', label: 'Tagline', value: 'We Build, Grow & Scale Your Digital Presence', type: 'text' },
  { key: 'description', group: 'seo', label: 'SEO Description', value: 'Premium IT services agency - software development, web development, mobile apps, AI solutions, UI/UX design, cloud solutions, digital marketing and IT consulting.', type: 'textarea' },
  { key: 'keywords', group: 'seo', label: 'SEO Keywords', value: 'IT services, software development, web development, mobile apps, AI solutions, UI UX design, cloud solutions, digital marketing', type: 'text' },
  { key: 'logo', group: 'branding', label: 'Logo URL', value: '', type: 'image' },
  { key: 'favicon', group: 'branding', label: 'Favicon URL', value: '', type: 'image' },
  { key: 'supportEmail', group: 'contact', label: 'Support Email', value: 'sssgrowtech@gmail.com', type: 'text' },
  { key: 'contactEmail', group: 'contact', label: 'Contact Email', value: 'sssgrowtech@gmail.com', type: 'text' },
  { key: 'phone', group: 'contact', label: 'Phone', value: '+91 70285 07985', type: 'text' },
  { key: 'phoneSecondary', group: 'contact', label: 'Alternate Phone', value: '+91 98342 32411', type: 'text' },
  { key: 'address', group: 'contact', label: 'Address', value: 'India · Serving clients worldwide', type: 'text' },
  { key: 'facebook', group: 'social', label: 'Facebook URL', value: 'https://facebook.com/sssgrowtech', type: 'text' },
  { key: 'twitter', group: 'social', label: 'Twitter URL', value: 'https://twitter.com/sssgrowtech', type: 'text' },
  { key: 'linkedin', group: 'social', label: 'LinkedIn URL', value: 'https://linkedin.com/company/sssgrowtech', type: 'text' },
  { key: 'instagram', group: 'social', label: 'Instagram URL', value: 'https://instagram.com/sssgrowtech', type: 'text' },
  { key: 'github', group: 'social', label: 'GitHub URL', value: 'https://github.com/sssgrowtech', type: 'text' },
  { key: 'heroTitle', group: 'hero', label: 'Hero Title', value: 'We Build Digital Products That Grow Your Business', type: 'text' },
  { key: 'heroSubtitle', group: 'hero', label: 'Hero Subtitle', value: 'SSS Grow Tech delivers world-class software, web, mobile, AI and cloud solutions to take your business to the next level.', type: 'textarea' },
  { key: 'heroImage', group: 'hero', label: 'Hero Image URL', value: '', type: 'image' },
  { key: 'stats', group: 'home', label: 'Stats (JSON)', value: { projects: 250, clients: 120, years: 10, awards: 15 }, type: 'json' },
  { key: 'footerText', group: 'footer', label: 'Footer Text', value: 'Premium IT services agency focused on helping businesses grow through technology.', type: 'textarea' },
  { key: 'copyright', group: 'footer', label: 'Copyright', value: '© 2026 SSS Grow Tech. All rights reserved.', type: 'text' },
  { key: 'announcementBar', group: 'general', label: 'Announcement Bar', value: '', type: 'textarea' },
];

export const getSettings = asyncHandler(async (req, res) => {
  const docs = await SiteSetting.find().lean();
  const map = {};
  docs.forEach((doc) => {
    map[doc.key] = doc.value;
  });
  res.status(200).json(new ApiResponse(200, { settings: map, items: docs }, 'Settings retrieved'));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  if (!Array.isArray(settings) || settings.length === 0) throw new ApiError(400, 'No settings provided');

  const existingDocs = await SiteSetting.find({ key: { $in: settings.map((s) => s.key) } });
  const docMap = {};
  existingDocs.forEach((doc) => {
    docMap[doc.key] = doc;
  });

  for (const s of settings) {
    if (!IMAGE_SETTING_KEYS.has(s.key)) continue;
    const oldDoc = docMap[s.key];
    const oldRef = toImageRef(oldDoc ? oldDoc.value : null);
    const newRef = toImageRef(s.value);
    if (oldRef?.publicId && (!newRef || oldRef.publicId !== newRef.publicId)) {
      await cloudinaryService.deleteImage(oldRef.publicId);
    }
  }

  const bulkOps = settings.map((s) => ({
    updateOne: {
      filter: { key: s.key },
      update: {
        $set: {
          value: s.value,
          ...(s.label ? { label: s.label } : {}),
          ...(s.group ? { group: s.group } : {}),
        },
      },
      upsert: true,
    },
  }));
  await SiteSetting.bulkWrite(bulkOps);

  const docs = await SiteSetting.find().lean();
  const map = {};
  docs.forEach((doc) => {
    map[doc.key] = doc.value;
  });
  res.status(200).json(new ApiResponse(200, { settings: map }, 'Settings updated successfully'));
});

export const initDefaultSettings = async () => {
  const existing = await SiteSetting.countDocuments();
  if (existing === 0) {
    await SiteSetting.insertMany(DEFAULT_SETTINGS);
    // eslint-disable-next-line no-console
    console.log('Default site settings seeded');
  }
};

export const getPublicSettings = asyncHandler(async (req, res) => {
  const docs = await SiteSetting.find().lean();
  const map = {};
  docs.forEach((doc) => {
    map[doc.key] = doc.value;
  });
  res.status(200).json(new ApiResponse(200, map, 'Public settings retrieved'));
});
