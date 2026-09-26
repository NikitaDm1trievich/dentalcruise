import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
// С Astro 6 схемы описываются zod из 'astro/zod': реэкспорт из 'astro:content' убран
import { z } from 'astro/zod';

/**
 * Контент, который меняется чаще вёрстки, живёт в JSON-файлах.
 * Добавить врача / позицию прайса = добавить запись в файл, вёрстку не трогаем.
 *
 * Два вида загрузчиков:
 *   file()  — один JSON-массив на коллекцию (короткие списки: FAQ, акции, бренды);
 *   glob()  — один файл на запись (длинные/растущие списки: врачи, кейсы).
 */

/*
 * Пустые необязательные поля. Редактор (Sveltia CMS) пишет незаполненное
 * поле не пропуском, а значением: текст — "", объект (логотип без файла) —
 * null, флажок — false. Всё пустое приводим к «нет значения»: сборка не
 * падает на null, а на сайт не выходят пустые ссылки, подписи и
 * зачёркнутые цены. Проверки в шаблонах поэтому могут опираться на
 * `undefined`, а не перебирать "" и null.
 */
const text = () => z.string().nullish().transform((value) => value || undefined);
const textOr = (fallback: string) => z.string().nullish().transform((value) => value || fallback);
const flag = () => z.boolean().nullish().transform((value) => value ?? false);
const list = <T extends z.ZodType>(item: T) =>
  z
    .array(item)
    .nullish()
    .transform((value) => value ?? []);

const orderable = { order: z.number().nullish().transform((value) => value ?? 100) };

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
    extra: text(),
    photo: text(),
    photoLabel: textOr('Здесь фото врача'),
    featured: flag(),
    /* ── Поля персональной страницы /doctors/<файл>. Все необязательные:
          пустые блоки на странице не рисуются. ───────────────────────── */
    /** Пара абзацев о подходе врача */
    about: list(z.string()),
    /** Образование и курсы. Год необязателен: у курсов даты обычно нет,
        а выдумывать её нельзя — такие строки идут отдельным списком. */
    education: list(z.object({ year: textOr(''), text: z.string() })),
    /** Что делает: короткие пункты для списка */
    skills: list(z.string()),
    /** Слаги услуг из service-pages, которые ведёт врач */
    services: list(z.string()),
    /** Крупная надпись под карточками услуг («И другие виды протезирования»):
        карточки — только примеры, врач делает больше */
    servicesMore: text(),
    seoTitle: text(),
    seoDescription: text(),
    ...orderable,
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    price: z.string(),
    priceNote: text(),
    badge: text(),
    benefit: z.string(),
    features: list(z.string()),
    photo: text(),
    photoLabel: textOr('Здесь фото работы'),
    /** Ключ категории — связывает услугу с кейсами «до/после» в галерее. */
    category: z.string(),
    featured: flag(),
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
    note: text(),
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
    was: text(),
    note: text(),
    /**
     * Характеристики материала (срок службы, внешний вид и т.п.) —
     * поясняют, за счёт чего позиция «горячая», а не только цену.
     * Общие свойства материалов, не измеренные клиникой лично значения.
     */
    attributes: list(z.object({ label: z.string(), value: z.string() })),
    /**
     * Слаг раздела из service-categories: карточка акции ведёт в прайс
     * с якорем на нужное направление.
     */
    category: text(),
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
      .object({ src: text(), width: z.number().nullish(), height: z.number().nullish() })
      .nullish()
      // Логотип без файла или без размеров — как без логотипа: в ленте имя.
      .transform((logo) =>
        logo?.src && logo.width && logo.height ? { src: logo.src, width: logo.width, height: logo.height } : undefined,
      ),
    note: text(),
    ...orderable,
  }),
});

/** Позиция прайса: название, цена и, если есть, старая цена и сноска. */
const priceItem = z.object({
  title: z.string(),
  price: z.string(),
  was: text(),
  note: text(),
  /**
   * Метка «Акция» у строки прайса. Указана старая цена — метка появляется
   * сама, отдельно включать не нужно; флаг нужен для позиций, которые
   * выделяем без скидки.
   */
  promo: flag(),
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
    note: text(),
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
    matchTitle: text(),
    /**
     * Название группы прайса, если такая же строка есть в нескольких
     * группах раздела («На импланте, винтовая фиксация» повторяется у
     * циркониевых, металлокерамических, E.max и временных коронок).
     * Без группы строки всех четырёх групп вели на одну страницу.
     */
    matchGroup: text(),
    /** Короткое пояснение под заголовком — одно-два предложения */
    lead: z.string(),
    /** Слаг категории из service-categories: хлебные крошки и ссылка в прайс */
    category: z.string(),
    price: text(),
    priceNote: text(),
    duration: text(),
    warranty: text(),
    photo: text(),
    photoLabel: textOr('Здесь фото работы'),
    /** «Что входит в цену» */
    includes: list(z.string()),
    /** «Когда подходит» / показания */
    indications: list(z.string()),
    /** Этапы работы: заголовок + описание */
    steps: list(z.object({ title: z.string(), text: z.string() })),
    /** Позиции прайса, которые показываем прямо на странице */
    prices: list(priceItem),
    /** Вопросы конкретно по этой услуге */
    faq: list(z.object({ q: z.string(), a: z.string() })),
    seoTitle: text(),
    seoDescription: text(),
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
    items: z.array(
      z.object({
        title: z.string(),
        price: z.string(),
        /**
         * Слаг страницы услуги (имя файла в service-pages без .json), на
         * которую ведёт позиция с главной. Без него страница ищется по
         * точному совпадению названия со строкой прайса; названия в
         * каталоге короче («Проф. гигиена, ультразвук»), и совпадение
         * находилось лишь у половины позиций.
         */
        page: text(),
      }),
    ),
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
    icon: textOr('shield-check'),
    href: text(),
    /** true — открывает шторку лицензии вместо перехода по ссылке */
    opensLicense: flag(),
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
  cases,  faq,
  promos,
  brands,
  'price-list': priceList,
  'service-categories': serviceCategories,
  'service-pages': servicePages,
  trust,
  comparison,
};
