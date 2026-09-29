import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://niraj-nirmal.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
