import Wallpaper from '../models/Wallpaper.js';

const optimiseCloudinaryUrl = (url, width = 1920) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.match(/\/upload\/[a-z0-9_,]+/)) {
    return url;
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
};

export const getSitemap = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find({}).select('slug title previewImage updatedAt').sort({ updatedAt: -1 });

    const baseUrl = 'https://velorahd.in';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/explore', priority: '0.8', changefreq: 'daily' },
      { url: '/mobile', priority: '0.8', changefreq: 'daily' },
      { url: '/pc', priority: '0.8', changefreq: 'daily' },
      { url: '/premium', priority: '0.8', changefreq: 'daily' }
    ];

    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // XML escaping helper
    const escapeXml = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Dynamic wallpaper pages
    wallpapers.forEach(wp => {
      const lastMod = wp.updatedAt ? wp.updatedAt.toISOString() : new Date().toISOString();
      const escapedTitle = escapeXml(wp.title);
      const optimisedImg = optimiseCloudinaryUrl(wp.previewImage, 1920);

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/wallpaper/${wp.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${optimisedImg}</image:loc>\n`;
      xml += `      <image:title>${escapedTitle}</image:title>\n`;
      xml += `    </image:image>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
