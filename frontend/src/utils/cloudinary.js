export const optimiseUrl = (url, opts = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const {
    width = null,
    height = null,
    quality = 'auto',
    format = 'auto',
  } = opts;

  // Check if transforms are already in the URL to avoid double-injecting
  // Cloudinary transformations contain underscores (e.g., w_800, q_auto) whereas version tags do not
  if (url.match(/\/upload\/[^\/]*_[^\/]*\//)) {
    return url;
  }

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
  ].filter(Boolean).join(',');

  return url.replace('/upload/', `/upload/${transforms}/`);
};
