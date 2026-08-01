export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateSlug = async (Model, title, currentId = null) => {
  let slug = slugify(title);
  let suffix = 1;
  let base = slug;
  let exists = true;
  while (exists) {
    const filter = { slug };
    if (currentId) filter._id = { $ne: currentId };
    const count = await Model.countDocuments(filter);
    if (count === 0) {
      exists = false;
    } else {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
  }
  return slug;
};

export default slugify;
