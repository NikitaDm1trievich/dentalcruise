// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Домен и базовый путь берутся из окружения, чтобы одна и та же сборка
 * уезжала и на GitHub Pages (подпапка /dentalcruise/), и на хостинг клиники
 * (корень dentalcruise.ru) без правок в коде.
 *
 *   SITE=https://nikitadm1trievich.github.io BASE=/dentalcruise/ npm run build
 */
const SITE = process.env.SITE ?? 'https://dentalcruise.ru';
const BASE = process.env.BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Служебные страницы в карте сайта не нужны.
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
