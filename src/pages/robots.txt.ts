import type { APIRoute } from 'astro';

/**
 * robots.txt генерируется, а не лежит статикой: адрес карты сайта
 * должен совпадать с доменом текущей сборки (GitHub Pages сейчас,
 * dentalcruise.ru после переезда).
 */
export const GET: APIRoute = ({ site }) => {
  const path = `${import.meta.env.BASE_URL}sitemap-index.xml`.replace(/\/{2,}/g, '/');
  const sitemap = new URL(path, site ?? 'https://dentalcruise.ru').toString();

  const body = `User-agent: *
Allow: /

# Служебные страницы в индексе не нужны
Disallow: /404

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
