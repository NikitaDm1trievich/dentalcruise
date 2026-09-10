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

/**
 * Списочные коллекции лежат в файле как `{ "items": [...] }`, а не голым
 * массивом: редактор (Sveltia CMS, public/admin) умеет править только
 * объект в корне файла. Загрузчику отдаём сам массив.
 */
const unwrap = (text: string) => JSON.parse(text).items;

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
    /* ── Поля персональной страницы /doctors/<файл>. Все необязательные:
          пустые блоки на странице не рисуются. ───────────────────────── */
    /** Пара абзацев о подходе врача */
    about: z.array(z.string()).default([]),
    /** Образование и курсы: год + что именно */
    education: z.array(z.object({ year: z.string(), text: z.string() })).default([]),
    /** Что делает: короткие пункты для списка */
    skills: z.array(z.string()).default([]),
    /** Слаги услуг из service-pages, которые ведёт врач */
    services: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
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
  loader: file('./src/content/carousel-slides/slides.json', { parser: unwrap }),
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
  loader: file('./src/content/faq/faq.json', { parser: unwrap }),
  schema: z.object({
    id: z.string(),
    q: z.string(),
    a: z.string(),
    ...orderable,
  }),
});

const promos = defineCollection({
  loader: file('./src/content/promos/promos.json', { parser: unwrap }),
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
  loader: file('./src/content/brands/brands.json', { parser: unwrap }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    /**
     * Реальные ширина/высота файла логотипа в px — обязательны вместе
     * с logo, иначе браузер не может зарезервировать место под картинку
     * заранее и лента поставщиков дёргается при догрузке (CLS).
     */
    logo: z
      .object({ src: z.string(), width: z.number(), height: z.number() })
      .optional(),
    note: z.string().optional(),
    ...orderable,
  }),
});

/** Позиция прайса: название, цена и, если есть, старая цена и сноска. */
const priceItem = z.object({
  title: z.string(),
  price: z.string(),
  was: z.string().optional(),
  note: z.string().optional(),
  /**
   * Метка «Акция» у строки прайса. Указана старая цена — метка появляется
   * сама, отдельно включать не нужно; флаг нужен для позиций, которые
   * выделяем без скидки.
   */
  promo: z.boolean().default(false),
});

/**
 * Полный прайс — один файл на категорию, внутри группы позиций.
 * `slug` совпадает со слагом из service-categories: по нему собираются
 * якоря, фильтр на странице прайса и ссылки из каталога на главной.
 *
 * Чтобы добавить позицию — допишите объект в нужную группу. Новая группа —
 * ещё один объект в `groups`. Вёрстку трогать не нужно.
 */
const priceList = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/price-list' }),
  schema: z.object({
    slug: z.string(),
    category: z.string(),
    note: z.string().optional(),
    groups: z.array(
      z.object({
        title: z.string(),
        items: z.array(priceItem),
      }),
    ),
    ...orderable,
  }),
});

/**
 * Страницы отдельных услуг (/uslugi/<slug>).
 *
 * Шаблон для заполнения — src/content/service-pages/_template.json;
 * файлы, имя которых начинается с подчёркивания, в коллекцию не попадают.
 * Все блоки, кроме заголовка и лида, необязательные: чего нет — того не
 * будет и на странице, пустых заглушек не появится.
 */
const servicePages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/service-pages' }),
  schema: z.object({
    title: z.string(),
    /**
     * Точное название строки в прайс-листе, если оно короче и вне контекста
     * таблицы непонятно (например «На импланте, цементная фиксация»).
     * По нему цена в pricelist.astro находит эту карточку; не задано —
     * ищем по `title`.
     */
    matchTitle: z.string().optional(),
    /** Короткое пояснение под заголовком — одно-два предложения */
    lead: z.string(),
    /** Слаг категории из service-categories: хлебные крошки и ссылка в прайс */
    category: z.string(),
    price: z.string().optional(),
    priceNote: z.string().optional(),
    duration: z.string().optional(),
    warranty: z.string().optional(),
    photo: z.string().optional(),
    photoLabel: z.string().default('Здесь фото работы'),
    /** «Что входит в цену» */
    includes: z.array(z.string()).default([]),
    /** «Когда подходит» / показания */
    indications: z.array(z.string()).default([]),
    /** Этапы работы: заголовок + описание */
    steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    /** Позиции прайса, которые показываем прямо на странице */
    prices: z.array(priceItem).default([]),
    /** Вопросы конкретно по этой услуге */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ...orderable,
  }),
});

/**
 * Категории услуг для каталога на главной и для выпадающего меню «Услуги».
 * Единственный источник правды по названиям и якорям (slug) — то же самое
 * меню в бургере и десктоп-панели ссылается на эти же id.
 */
const serviceCategories = defineCollection({
  loader: file('./src/content/service-categories/categories.json', { parser: unwrap }),
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
  loader: file('./src/content/trust/trust.json', { parser: unwrap }),
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
  loader: file('./src/content/comparison/comparison.json', { parser: unwrap }),
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
  'service-pages': servicePages,
  trust,
  comparison,
};
