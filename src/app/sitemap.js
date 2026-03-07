
/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const baseUrl = 'https://yourdomain.com'; 

  // Current date for lastModified
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/whatsapp-bot`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Agar future mein public user timelines add karna ho (dynamic example)
    // {
    //   url: `${baseUrl}/timeline/view/example-id`,
    //   lastModified: '2026-02-01',
    //   changeFrequency: 'yearly',
    //   priority: 0.6,
    // },
  ];
}