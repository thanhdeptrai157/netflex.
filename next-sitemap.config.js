// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://netflex-film.vercel.app', 
    generateRobotsTxt: true, 
    generateIndexSitemap: true, 
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/admin', '/admin/*'], 
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin'],
        },
      ],
    },
  };
  