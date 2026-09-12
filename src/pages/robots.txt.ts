import type { APIRoute } from 'astro';

import { absolute } from '../lib/seo';

/**
 * robots.txt генерируется, а не лежит статикой: адреса карты сайта и фидов
 * должны совпадать с доменом текущей сборки (GitHub Pages сейчас,
 * dentalcruise.ru после переезда).
 *
 * Фиды закрывать от роботов нельзя: Яндекс Вебмастер и Магазин ВКонтакте
 * скачивают их тем же обходчиком, что и страницы, и закрытый каталог
 * читается как «файл недоступен».
 */
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /
Allow: /feeds/

# Служебные страницы в индексе не нужны
Disallow: /404
Disallow: /admin

# Метки рекламных кампаний создают дубли одной и той же страницы.
# Директива понятна Яндексу; Google сводит дубли по canonical.
Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&from&_openstat

Sitemap: ${absolute('sitemap-index.xml', site)}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
