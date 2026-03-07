// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/payment/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}