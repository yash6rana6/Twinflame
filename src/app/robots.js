// app/robots.js    ← ya app/robots.ts agar TS use kar raha hai

export const dynamic = 'force-static'; // optional: build time pe static generate kar dega

export default function robots() {
  // Agar env variable use karna chahte ho (sabse best practice)
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

  // Ya seedha hardcode kar do (temporary quick fix ke liye)
  const baseUrl = 'https://twinflame.vercel.app';   

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/payment/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}