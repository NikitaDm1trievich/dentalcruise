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
 * услуг пока нет. Порядок: фото работы из карточки услуги → фото
 * направления (коронки, импланты, виниры — настоящие снимки) → картинка
 * раздела из public/images/2gis (1000×1000, те же, что в карточке 2ГИС).
 * Это честная иллюстрация, а не чужая работа, выданная за свою.
 */

/** Фото направления. Ключ — slug категории из service-categories. */
const CATEGORY_PHOTO: Record<string, string> = {
  protezirovanie: 'images/services/crowns.jpg',
  implantacia: 'images/services/implants.jpg',
};

/** Картинка раздела из карточки 2ГИС — для всех, у кого нет фото. */
const CATEGORY_PICTURE: Record<string, string> = {
  diagnostika: 'images/2gis/diagnostika.png',
  gigiena: 'images/2gis/gigiena.png',
  karies: 'images/2gis/karies.png',
  // Лечение каналов — то же лечение зуба, своей картинки у 2ГИС нет
  endodontiya: 'images/2gis/karies.png',
  protezirovanie: 'images/2gis/koronki.png',
  'semnoe-protezirovanie': 'images/2gis/protezy.png',
  implantacia: 'images/2gis/implantologiya.png',
  hirurgiya: 'images/2gis/hirurgiya.png',
  kappy: 'images/2gis/protezy.png',
};
/** Новый раздел, для которого картинку ещё не выбрали, — интерьер клиники */
const FALLBACK_PICTURE = 'images/clinic/clinic-01.jpg';

/** Картинка оффера: своё фото → фото направления → картинка раздела. */
function pictureFor(slug: string, category: string, photo: string | undefined): string {
  if (photo) return photo;
  // Каппа для отбеливания лежит в «Каппах», но по смыслу — отбеливание, а не протез
  if (slug.includes('otbelivanie')) return 'images/2gis/gigiena.png';
  // Виниры живут в разделе протезирования, но коронка вместо винира на фото — чужая работа
  if (slug.startsWith('vinir')) return 'images/services/veneers.jpg';
  // Акриловые протезы — отдельная картинка 2ГИС
  if (category === 'semnoe-protezirovanie' && slug.includes('akril')) return 'images/2gis/akrilovye-protezy.png';
  return CATEGORY_PHOTO[category] ?? CATEGORY_PICTURE[category] ?? FALLBACK_PICTURE;
}

/**
 * Описание оффера: лид страницы и, если у цены есть пояснение, строка о
 * цене — «Цена: от 49 900 ₽ — Osstem с циркониевой коронкой, всё
 * включено.» Раньше склеивалось «Цена от 49 900 ₽ Osstem с …» без знаков.
 */
function describe(lead: string, price: string, note: string | undefined): string {
  const sentence = (text: string) => (/[.!?…]$/.test(text) ? text : `${text}.`);
  const parts = [sentence(lead.trim())];
  if (note?.trim()) parts.push(sentence(`Цена: ${price} — ${note.trim()}`));
  return parts.join(' ');
}

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

      const picture = pictureFor(page.id, s.category, s.photo);
      const description = describe(s.lead, s.price ?? '', s.priceNote);

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
