import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  schema,
  is404 = false
}) {
  const location = useLocation();
  const canonicalUrl = url || `https://velorahd.in${location.pathname}`;

  useEffect(() => {
    // 1. Determine Title
    let pageTitle = "Velora HD";
    if (is404) {
      pageTitle = "Wallpaper Not Found | Velora HD";
    } else if (title) {
      pageTitle = title.includes('|') ? title : `${title} Wallpaper (4K) | Velora HD`;
    }
    document.title = pageTitle;

    // Helper to add/update meta tags
    const setMetaTag = (attributeName, attributeValue, content) => {
      if (!content) {
        const existing = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
        if (existing) existing.remove();
        return;
      }
      let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeName, attributeValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Robots indexing for 404 pages
    if (is404) {
      setMetaTag('name', 'robots', 'noindex, follow');
    } else {
      // Remove any leftover noindex robots tag on valid routes
      const existingRobots = document.querySelector('meta[name="robots"]');
      if (existingRobots && existingRobots.getAttribute('content') === 'noindex, follow') {
        existingRobots.remove();
      }
    }

    // 3. Standard Meta Descriptions and Keywords
    let seoDesc = "";
    if (is404) {
      seoDesc = "The requested wallpaper could not be found. It may have been deleted or moved.";
    } else if (!description) {
      seoDesc = title
        ? `Download ${title} wallpaper in high resolution for desktop and mobile devices.`
        : "Velora HD — Premium wallpaper marketplace. Discover loop-ready live video motion wallpapers, high resolution 4K desktop themes, and mobile backgrounds. Transform every screen into art.";
    } else {
      seoDesc = `${description}. Download in high resolution for desktop and mobile.`;
    }
    setMetaTag('name', 'description', seoDesc);

    let seoKeywords = "";
    if (keywords) {
      seoKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    } else {
      seoKeywords = "wallpapers, 4k wallpapers, live wallpapers, backgrounds, lockscreen, desktop setup";
    }
    setMetaTag('name', 'keywords', seoKeywords);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', is404 ? "Wallpaper Not Found" : (title || "Velora HD"));
    setMetaTag('property', 'og:description', seoDesc);
    setMetaTag('property', 'og:image', image || 'https://velorahd.in/graffiti-bg.png');
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'website');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', is404 ? "Wallpaper Not Found" : (title || "Velora HD"));
    setMetaTag('name', 'twitter:description', seoDesc);
    setMetaTag('name', 'twitter:image', image || 'https://velorahd.in/graffiti-bg.png');

    // 6. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 7. Structured Data (JSON-LD)
    let schemaScript = document.getElementById('seo-schema-jsonld');
    if (schema && !is404) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'seo-schema-jsonld');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

  }, [title, description, keywords, image, canonicalUrl, schema, is404]);

  return null;
}
