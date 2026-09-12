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
      // В карту сайта идут только страницы для людей. Служебное и машинное
      // (админка, фиды, ключ IndexNow) роботу там не нужно: фиды он берёт
      // по прямой ссылке из Вебмастера, а не из sitemap.
      filter: (page) =>
        !page.includes('/404') && !page.includes('/admin') && !page.includes('/feeds/'),
      /**
       * Приоритет и частота обновления — подсказка обходчику, куда
       * заглядывать чаще. Прайс и врачи меняются в редакторе постоянно,
       * политика конфиденциальности — никогда.
       */
      serialize: (item) => {
        // Хвостовой слеш у Astro необязателен, поэтому сравниваем по срезу,
        // а не по точному совпадению строки.
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        if (path.endsWith('/privacy')) return { ...item, changefreq: 'yearly', priority: 0.2 };
        if (path.endsWith('/pricelist') || path.endsWith('/doctors'))
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        if (path.includes('/uslugi/') || path.includes('/doctors/'))
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        return { ...item, changefreq: 'monthly', priority: 0.6 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
