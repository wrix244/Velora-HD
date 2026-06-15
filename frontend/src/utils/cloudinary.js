export const optimiseUrl = (url, opts = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const {
    width = null,
    height = null,
    quality = 'auto',
    format = 'auto',
  } = opts;

  // Check if transforms are already in the URL to avoid double-injecting
  if (url.match(/\/upload\/[a-z0-9_,]+/)) {
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
