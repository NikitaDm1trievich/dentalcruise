/**
 * Адреса полей редактора для выбора блока в живом предпросмотре.
 *
 * Блок главной, который берёт данные из редактора, несёт атрибут
 * `data-cms="<коллекция>/<запись>:<путь>"` — имена те же, что в
 * public/admin/config.yml (`home/promos:items.2`, `doctors/terapevt`).
 * Во фрейме редактора src/lib/cms-preview.ts по нему понимает, какую
 * запись и какое поле открыть по клику. На опубликованном сайте атрибут
 * ни на что не влияет.
 *
 * Элемент списка адресуется номером в JSON-файле, а не на странице: на
 * сайте списки отсортированы по `order`, и третья карточка на странице не
 * обязательно третья в файле. Номер ищем по служебному id.
 */
import promos from '../content/promos/promos.json';
import categories from '../content/service-categories/categories.json';
import brands from '../content/brands/brands.json';
import comparison from '../content/comparison/comparison.json';
import trust from '../content/trust/trust.json';
import faq from '../content/faq/faq.json';

/** Файлы-списки главной и их записи в редакторе. */
const lists = {
  promos: { entry: 'home/promos', items: promos.items },
  catalog: { entry: 'home/catalog', items: categories.items },
  brands: { entry: 'home/brands', items: brands.items },
  comparison: { entry: 'home/comparison', items: comparison.items },
  trust: { entry: 'home/trust', items: trust.items },
  faq: { entry: 'home/faq', items: faq.items },
} satisfies Record<string, { entry: string; items: { id: string }[] }>;

/** Тексты главной (src/data/home.json): `cmsText('promo')` → `home/texts:promo`. */
export function cmsText(path: string): string {
  return `home/texts:${path}`;
}

/**
 * Элемент файла-списка по его id: `cmsItem('promos', 'crown-zirconia')` →
 * `home/promos:items.0`. Хвост `sub` уточняет поле внутри элемента
 * (`items.0.items.2`). Нет такого id — атрибута не будет.
 */
export function cmsItem(list: keyof typeof lists, id: string, sub?: string): string | undefined {
  const { entry, items } = lists[list];
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return undefined;
  return `${entry}:items.${index}${sub ? `.${sub}` : ''}`;
}

/** Весь список файла, например ленту поставщиков целиком. */
export function cmsList(list: keyof typeof lists): string {
  return `${lists[list].entry}:items`;
}
