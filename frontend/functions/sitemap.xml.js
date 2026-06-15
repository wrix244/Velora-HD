export async function onRequest(context) {
  // Read VITE_API_URL from Cloudflare environment or fallback
  const backendUrl = context.env.VITE_API_URL || 'https://dream-lens-backend.onrender.com';
  
  try {
    const response = await fetch(`${backendUrl}/sitemap.xml`);
    
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response('Sitemap proxy failed', { status: 500 });
  }
}
