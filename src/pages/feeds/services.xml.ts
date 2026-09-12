import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { clinic } from '../../data/site';
import { absolute, priceValue, siteRoot, xml } from '../../lib/seo';

/**
 * YML-фид услуг: единый прайс в машиночитаемом виде.
 *
 * Один файл закрывает сразу несколько площадок, потому что YML —
 * общий формат экосистемы Яндекса и его же принимает ВКонтакте:
 *   • Яндекс Вебмастер, раздел «Товары и цены» — цены в органической выдаче;
 *   • Магазин сообщества ВКонтакте — импорт товаров по ссылке на фид;
 *   • прайс-агрегаторы, которые просят «выгрузку в YML».
 *
 * Расширение у файла .xml, хотя внутри YML: статический хостинг ставит
 * заголовок Content-Type по расширению, и .yml уезжает как text/yaml —
 * такой тип Яндекс отклоняет. Документация Яндекса .xml разрешает.
 *
 * Адрес постоянный, поэтому площадкам достаточно указать его один раз:
 * при каждом деплое файл пересобирается из тех же карточек услуг, что
 * рисуют сайт. Владелец правит цену в редакторе — она уезжает всюду сама.
 *
 * Картинка обязательна для Магазина ВКонтакте, а своих снимков у карточек
 * услуг пока нет: подставляем фото направления, а где его нет — интерьер
 * клиники. Это честная иллюстрация, а не чужая работа, выданная за свою.
 */

/** Фото направления. Ключ — slug категории из service-categories. */
const CATEGORY_PICTURE: Record<string, string> = {
  restoration: 'images/services/veneers.jpg',
  protezirovanie: 'images/services/crowns.jpg',
  implantacia: 'images/services/implants.jpg',
};
const FALLBACK_PICTURE = 'images/clinic/clinic-01.jpg';

export const GET: APIRoute = async ({ site }) => {
  const pages = (await getCollection('service-pages')).sort((a, b) => a.data.order - b.data.order);
  const categories = (await getCollection('service-categories')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  /* Числовые id категорий: YML не принимает строковые слаги. */
  const categoryId = new Map(categories.map((c, index) => [c.data.slug, index + 1]));

  const categoryNodes = categories.map(
    (c) => `      <category id="${categoryId.get(c.data.slug)}">${xml(c.data.title)}</category>`,
  );

  const offerNodes = pages
    .map((page) => {
      const s = page.data;
      const price = priceValue(s.price);
      // Позиция без цены в фид не идёт: площадка обязана показать сумму,
      // а «уточняйте» в поле price читается как ошибка выгрузки.
      if (!price) return null;

      const picture = CATEGORY_PICTURE[s.category] ?? FALLBACK_PICTURE;
      const description = [s.lead, s.priceNote ? `Цена ${s.price} ${s.priceNote}.` : null]
        .filter(Boolean)
        .join(' ');

      return [
        `      <offer id="${xml(page.id)}" available="true">`,
        `        <name>${xml(s.title)}</name>`,
        `        <url>${xml(absolute(`uslugi/${page.id}`, site))}</url>`,
        `        <price>${price}</price>`,
        `        <currencyId>RUB</currencyId>`,
        `        <categoryId>${categoryId.get(s.category) ?? 1}</categoryId>`,
        `        <picture>${xml(absolute(picture, site))}</picture>`,
        `        <vendor>${xml(clinic.name)}</vendor>`,
        `        <description>${xml(description)}</description>`,
        s.duration ? `        <param name="Сроки">${xml(s.duration)}</param>` : null,
        s.warranty ? `        <param name="Гарантия">${xml(s.warranty)}</param>` : null,
        `      </offer>`,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .filter(Boolean);

  const body = `<?xml version="1.0" encoding="utf-8"?>
<yml_catalog date="${new Date().toISOString().slice(0, 16).replace('T', ' ')}">
  <shop>
    <name>${xml(clinic.name)}</name>
    <company>${xml(clinic.legalName)}</company>
    <url>${xml(siteRoot(site))}</url>
    <email>${xml(clinic.email)}</email>
    <currencies>
      <currency id="RUB" rate="1"/>
    </currencies>
    <categories>
${categoryNodes.join('\n')}
    </categories>
    <offers>
${offerNodes.join('\n')}
    </offers>
  </shop>
</yml_catalog>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
