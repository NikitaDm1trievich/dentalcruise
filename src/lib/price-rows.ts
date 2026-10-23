/**
 * Строки прайса раздела по точному названию: цена, метка акции и описание.
 * Для блоков страниц услуг, которые не хранят цены у себя (ImplantVariants,
 * ImplantProsthesis). Нет строки — ошибка сборки, а не пустая цена.
 */
import { getCollection } from 'astro:content';

export interface PriceRow {
  price: string;
  promo: boolean;
  desc?: string;
}

export async function priceRows(category: string, who: string) {
  const rows = new Map<string, PriceRow>();
  for (const file of (await getCollection('price-list')).filter((f) => f.data.slug === category)) {
    for (const group of file.data.groups) {
      for (const item of group.items) {
        rows.set(item.title, { price: item.price, promo: Boolean(item.promo || item.was), desc: item.desc });
      }
    }
  }
  return (title: string): PriceRow => {
    const row = rows.get(title);
    if (!row) throw new Error(`${who}: в прайсе «${category}» нет строки «${title}»`);
    return row;
  };
}
