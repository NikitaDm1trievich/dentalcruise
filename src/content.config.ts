import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

/**
 * Контент, который меняется чаще вёрстки, живёт в JSON-файлах.
 * Добавить врача / позицию прайса = добавить запись в файл, вёрстку не трогаем.
 *
 * Два вида загрузчиков:
 *   file()  — один JSON-массив на коллекцию (короткие списки: FAQ, акции, бренды);
 *   glob()  — один файл на запись (длинные/растущие списки: врачи, кейсы).
 */

const orderable = { order: z.number().default(100) };

const doctors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/doctors' }),
  schema: z.object({
    name: z.string(),
    speciality: z.string(),
    experience: z.string(),
    note: z.string(),
    extra: z.string().optional(),
    photo: z.string().optional(),
    photoLabel: z.string().default('Здесь фото врача'),
    featured: z.boolean().default(false),
    ...orderable,
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    price: z.string(),
    priceNote: z.string().optional(),
    badge: z.string().optional(),
    benefit: z.string(),
    features: z.array(z.string()).default([]),
    photo: z.string().optional(),
    photoLabel: z.string().default('Здесь фото работы'),
    /** Ключ категории — связывает услугу с кейсами «до/после» в галерее. */
    category: z.string(),
    featured: z.boolean().default(false),
    ...orderable,
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    before: z.string(),
    after: z.string(),
    note: z.string().optional(),
    ...orderable,
  }),
});

const carouselSlides = defineCollection({
  loader: file('./src/content/carousel-slides/slides.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    /** Несколько кадров — галерея с кроссфейдом; пустой массив — подписанная заглушка */
    photos: z.array(z.string()).default([]),
    photoLabel: z.string().default('Здесь фото клиники'),
    ...orderable,
  }),
});

const faq = defineCollection({
  loader: file('./src/content/faq/faq.json'),
  schema: z.object({
    id: z.string(),
    q: z.string(),
    a: z.string(),
    ...orderable,
  }),
});

const promos = defineCollection({
  loader: file('./src/content/promos/promos.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    price: z.string(),
    was: z.string().optional(),
    note: z.string().optional(),
    /**
     * Характеристики материала (срок службы, внешний вид и т.п.) —
     * поясняют, за счёт чего позиция «горячая», а не только цену.
     * Общие свойства материалов, не измеренные клиникой лично значения.
     */
    attributes: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    /**
     * Слаг раздела из service-categories: карточка акции ведёт в прайс
     * с якорем на нужное направление.
     */
    category: z.string().optional(),
    ...orderable,
  }),
});

const brands = defineCollection({
  loader: file('./src/content/brands/brands.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().optional(),
    note: z.string().optional(),
    ...orderable,
  }),
});

/**
 * Полный прайс — одна запись на категорию, внутри позиции.
 * Заполняется на этапе страницы «Прайс-лист»; схема заложена сразу.
 */
const priceList = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/price-list' }),
  schema: z.object({
    category: z.string(),
    note: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string(),
        price: z.string(),
        was: z.string().optional(),
        note: z.string().optional(),
      }),
    ),
    ...orderable,
  }),
});

/**
 * Категории услуг для каталога на главной и для выпадающего меню «Услуги».
 * Единственный источник правды по названиям и якорям (slug) — то же самое
 * меню в бургере и десктоп-панели ссылается на эти же id.
 */
const serviceCategories = defineCollection({
  loader: file('./src/content/service-categories/categories.json'),
  schema: z.object({
    id: z.string(),
    /** Якорь на будущей странице /pricelist, напр. "protezirovanie" */
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    items: z.array(z.object({ title: z.string(), price: z.string() })),
    ...orderable,
  }),
});

/** Полоса доверия перед подвалом. */
const trust = defineCollection({
  loader: file('./src/content/trust/trust.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    icon: z.string().default('shield-check'),
    href: z.string().optional(),
    /** true — открывает шторку лицензии вместо перехода по ссылке */
    opensLicense: z.boolean().default(false),
    ...orderable,
  }),
});

/** Колонки «мы vs обычная клиника» в блоке «Почему мы». */
const comparison = defineCollection({
  loader: file('./src/content/comparison/comparison.json'),
  schema: z.object({
    id: z.string(),
    side: z.enum(['them', 'us']),
    text: z.string(),
    ...orderable,
  }),
});

export const collections = {
  doctors,
  services,
  cases,
  'carousel-slides': carouselSlides,
  faq,
  promos,
  brands,
  'price-list': priceList,
  'service-categories': serviceCategories,
  trust,
  comparison,
};
